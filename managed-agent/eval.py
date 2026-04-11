"""
MPA Province Prospector — Evaluation Script

Two modes:
  --prospecting (default): Agent finds new companies. Scores quality/novelty.
  --rediscovery:           Agent profiles known companies. Scores accuracy.

Usage:
    python eval.py NB                    # Prospecting eval (default)
    python eval.py NB --rediscovery      # Rediscovery eval
    python eval.py NB --skip-run         # Score existing data only
"""

import json
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import requests
from anthropic import Anthropic
from dotenv import load_dotenv

from scoring import (
    RediscoveryScorecard,
    ProspectingScorecard,
    find_best_match,
    score_company,
    score_prospect,
)

load_dotenv(Path(__file__).parent.parent / ".env")

ANTHROPIC_API_KEY = os.environ["MPA_ANTHROPIC_API_KEY"]
SUPABASE_URL = "https://vuuoukfcbucgsqnnsaii.supabase.co"
SUPABASE_ANON_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1dW91a2ZjYnVjZ3Nxbm5zYWlpIiwi"
    "cm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4OTU4MTgsImV4cCI6MjA4MDQ3MTgxOH0."
    "L9xpsTOwSpLvY7OdVvsd74oGS6ubVOJxtNCZSiXdjQY"
)

CONFIG_PATH = Path(__file__).parent / "config.json"
RESULTS_DIR = Path(__file__).parent / "eval_results"

PROVINCE_NAMES = {
    "NB": "New Brunswick",
    "NS": "Nova Scotia",
    "PEI": "Prince Edward Island",
    "NL": "Newfoundland and Labrador",
}

client = Anthropic(api_key=ANTHROPIC_API_KEY)
HEADERS = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": "Bearer %s" % SUPABASE_ANON_KEY,
}


def load_config():
    if not CONFIG_PATH.exists():
        print("No config.json found. Run deploy.py first.")
        sys.exit(1)
    return json.loads(CONFIG_PATH.read_text())


def supabase_get(table, params=None):
    url = "%s/rest/v1/%s" % (SUPABASE_URL, table)
    resp = requests.get(url, headers=HEADERS, params=params or {})
    resp.raise_for_status()
    return resp.json()


def get_baseline(province):
    """Pull all baseline data for a province."""
    companies = supabase_get("companies", {"province": "eq.%s" % province, "select": "*"})
    company_ids = [c["id"] for c in companies]

    key_people = {}
    sources = {}
    signals = {}
    pipeline = {}
    for cid in company_ids:
        key_people[cid] = supabase_get("key_people", {"company_id": "eq.%s" % cid, "select": "*"})
        sources[cid] = supabase_get("research_sources", {"company_id": "eq.%s" % cid, "select": "*"})
        signals[cid] = supabase_get("signals", {"company_id": "eq.%s" % cid, "select": "*"})
        pipeline[cid] = supabase_get("pipeline", {"company_id": "eq.%s" % cid, "select": "*"})

    return {
        "companies": companies,
        "key_people": key_people,
        "sources": sources,
        "signals": signals,
        "pipeline": pipeline,
    }


def get_agent_results(province, since):
    """Pull companies created/updated after a timestamp."""
    companies = supabase_get("companies", {
        "province": "eq.%s" % province,
        "updated_at": "gte.%s" % since,
        "select": "*",
    })

    company_ids = [c["id"] for c in companies]
    sources = {}
    key_people = {}
    signals = {}
    pipeline = {}
    for cid in company_ids:
        sources[cid] = supabase_get("research_sources", {
            "company_id": "eq.%s" % cid, "select": "*",
        })
        key_people[cid] = supabase_get("key_people", {
            "company_id": "eq.%s" % cid, "select": "*",
        })
        signals[cid] = supabase_get("signals", {
            "company_id": "eq.%s" % cid, "select": "*",
        })
        pipeline[cid] = supabase_get("pipeline", {
            "company_id": "eq.%s" % cid, "select": "*",
        })

    return {
        "companies": companies,
        "sources": sources,
        "key_people": key_people,
        "signals": signals,
        "pipeline": pipeline,
    }


def run_agent_session(province, config, prompt):
    """Run a session and return the timestamp before it started."""
    before_ts = datetime.now(timezone.utc).isoformat()
    province_name = PROVINCE_NAMES[province]

    print("\nStarting eval session for %s..." % province_name)

    session = client.beta.sessions.create(
        agent=config["agent_id"],
        environment_id=config["environment_id"],
        title="Eval: %s" % province_name,
        metadata={"province": province, "eval": "true"},
    )
    print("Session: %s" % session.id)

    tool_calls = 0
    start_time = time.time()

    with client.beta.sessions.events.stream(session.id) as stream:
        client.beta.sessions.events.send(
            session.id,
            events=[{
                "type": "user.message",
                "content": [{"type": "text", "text": prompt}],
            }],
        )

        for event in stream:
            etype = event.type

            if etype == "agent.message":
                for block in event.content:
                    if hasattr(block, "text"):
                        print(block.text, end="", flush=True)
                print()
            elif etype == "agent.tool_use":
                tool_calls += 1
                if tool_calls % 20 == 0:
                    elapsed = int(time.time() - start_time)
                    print("\n  [%ds] %d tool calls\n" % (elapsed, tool_calls))
            elif etype == "session.status_idle":
                stop_reason = getattr(event, "stop_reason", None)
                if stop_reason and getattr(stop_reason, "type", "") == "end_turn":
                    break
            elif etype == "session.status_terminated":
                print("\n[SESSION TERMINATED]")
                break

    elapsed = int(time.time() - start_time)
    print("\nSession complete in %ds (%d tool calls)" % (elapsed, tool_calls))
    return before_ts


# ═══════════════════════════════════════════════
# Prospecting Eval
# ═══════════════════════════════════════════════

def prospecting_prompt(province):
    province_name = PROVINCE_NAMES[province]
    return """Prospect for M&A target companies in %s (%s).

EXECUTE THIS WORKFLOW NOW:

1. Export your credentials (SUPABASE_URL, SUPABASE_KEY, SCRAPINGDOG_API_KEY) from your system prompt
2. Query existing %s companies from Supabase to avoid duplicates
3. Search for mid-market companies ($10M-$500M revenue) in %s matching the ICP
4. For each new company found (NOT already in database):
   a. Research thoroughly (revenue, ownership, industry, key people)
   b. Score against ICP tiers (Tier 1/2/3 or disqualify)
   c. Calculate succession scorecard (5 dimensions, 1-5 each)
   d. Find and scrape LinkedIn profiles for 3-5 key people
   e. Save everything to Supabase (company, key_people, signals, pipeline, research_sources)
   f. IMPORTANT: Save at least 5 research sources per company with URLs
6. Report summary

TARGET: Find at least 5 new companies that qualify as Tier 1 or Tier 2 ICP fits.

Remember: EVERY data point needs a source URL. Skip companies already in the database.""" % (
        province_name, province, province, province_name
    )


def run_prospecting_eval(province, skip_run=False):
    config = load_config()
    RESULTS_DIR.mkdir(exist_ok=True)

    # Pull existing company count
    existing = supabase_get("companies", {"province": "eq.%s" % province, "select": "id"})
    print("Existing %s companies: %d" % (province, len(existing)))

    if skip_run:
        before_ts = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0).isoformat()
        print("Skipping agent run, using today's data")
    else:
        prompt = prospecting_prompt(province)
        before_ts = run_agent_session(province, config, prompt)

    # Pull agent results
    print("\nPulling agent results...")
    results = get_agent_results(province, before_ts)
    print("Agent found: %d companies" % len(results["companies"]))

    # Score each new company
    scorecard = ProspectingScorecard(
        province=province,
        existing_count=len(existing),
        new_count=len(results["companies"]),
        qualified_count=0,
    )

    for co in results["companies"]:
        cid = co["id"]
        ps = score_prospect(
            co,
            sources=results["sources"].get(cid),
            key_people=results["key_people"].get(cid),
            signals=results["signals"].get(cid),
            pipeline=results["pipeline"].get(cid),
        )
        if ps.revenue_in_range:
            scorecard.qualified_count += 1
        scorecard.prospect_scores.append(ps)

    report = scorecard.report()
    print(report)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_path = RESULTS_DIR / ("prospecting_%s_%s.txt" % (province, timestamp))
    report_path.write_text(report)
    print("Report saved to %s" % report_path)


# ═══════════════════════════════════════════════
# Rediscovery Eval
# ═══════════════════════════════════════════════

def rediscovery_prompt(province, baseline_names):
    province_name = PROVINCE_NAMES[province]
    names_list = "\n".join("- %s" % n for n in baseline_names)
    return """Research and profile these known %s companies. For each one:

1. Export your credentials from your system prompt
2. Search for comprehensive information using web_search and web_fetch
3. Save a complete company profile to Supabase with:
   - Revenue estimate, employee count, industry, ownership type, website
   - Succession scorecard (all 5 dimensions scored 1-5)
   - At least 3 key people with LinkedIn profiles
   - At least 5 research sources with URLs
   - Transaction signals detected
   - Pipeline entry
4. IMPORTANT: Use UPSERT so existing records are updated, not duplicated

Companies to research:
%s

Save ALL findings to Supabase. Do NOT skip any company. Research each one independently.""" % (
        province_name, names_list
    )


def run_rediscovery_eval(province, skip_run=False):
    config = load_config()
    RESULTS_DIR.mkdir(exist_ok=True)

    # Pull baseline
    print("Pulling baseline data for %s..." % province)
    baseline = get_baseline(province)
    baseline_names = [c["name"] for c in baseline["companies"]]
    print("Baseline: %d companies" % len(baseline["companies"]))
    for name in baseline_names:
        print("  - %s" % name)

    if skip_run:
        before_ts = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0).isoformat()
        print("Skipping agent run, using today's data")
    else:
        prompt = rediscovery_prompt(province, baseline_names)
        before_ts = run_agent_session(province, config, prompt)

    # Pull agent results
    print("\nPulling agent results...")
    results = get_agent_results(province, before_ts)
    print("Agent updated: %d companies" % len(results["companies"]))

    # Score
    scorecard = RediscoveryScorecard(
        province=province,
        baseline_count=len(baseline["companies"]),
        agent_count=len(results["companies"]),
    )

    for agent_co in results["companies"]:
        baseline_match = find_best_match(agent_co, baseline["companies"])
        cid = agent_co["id"]
        agent_sources = results["sources"].get(cid, [])

        if baseline_match:
            scorecard.matched_count += 1
            cs = score_company(agent_co, baseline_match, agent_sources)
        else:
            cs = score_company(agent_co, None, agent_sources)

        scorecard.company_scores.append(cs)

    report = scorecard.report()
    print(report)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_path = RESULTS_DIR / ("rediscovery_%s_%s.txt" % (province, timestamp))
    report_path.write_text(report)
    print("Report saved to %s" % report_path)


# ═══════════════════════════════════════════════
# Main
# ═══════════════════════════════════════════════

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python eval.py <PROVINCE> [--rediscovery] [--skip-run]")
        print("Provinces: NB, NS, PEI, NL")
        print("")
        print("Modes:")
        print("  (default)      Prospecting — find new companies, score quality")
        print("  --rediscovery  Rediscovery — profile known companies, score accuracy")
        sys.exit(1)

    province = sys.argv[1].upper()
    if province not in PROVINCE_NAMES:
        print("Invalid province: %s. Use: NB, NS, PEI, NL" % province)
        sys.exit(1)

    skip = "--skip-run" in sys.argv
    rediscovery = "--rediscovery" in sys.argv

    if rediscovery:
        run_rediscovery_eval(province, skip_run=skip)
    else:
        run_prospecting_eval(province, skip_run=skip)
