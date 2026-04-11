"""
MPA Company Monitor — Session Runner

Runs a monitoring session against pipeline companies.

Usage:
    python monitor_run.py                # Monitor all active pipeline companies
    python monitor_run.py --province NB  # Monitor NB companies only
"""

import json
import os
import sys
import time
from datetime import date
from pathlib import Path

from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

ANTHROPIC_API_KEY = os.environ["MPA_ANTHROPIC_API_KEY"]
MONITOR_CONFIG = Path(__file__).parent / "monitor_config.json"

PROVINCE_NAMES = {
    "NB": "New Brunswick",
    "NS": "Nova Scotia",
    "PEI": "Prince Edward Island",
    "NL": "Newfoundland and Labrador",
}

client = Anthropic(api_key=ANTHROPIC_API_KEY)


def load_config():
    if not MONITOR_CONFIG.exists():
        print("No monitor_config.json found. Run monitor_deploy.py first.")
        sys.exit(1)
    return json.loads(MONITOR_CONFIG.read_text())


def build_prompt(province=None):
    today = date.today().isoformat()
    province_filter = ""
    scope = "all active pipeline companies"

    if province:
        province_name = PROVINCE_NAMES.get(province, province)
        province_filter = " Filter to %s (%s) companies only." % (province_name, province)
        scope = "%s pipeline companies" % province_name

    return """Run weekly monitoring for %s. Today's date is %s.

EXECUTE THIS WORKFLOW NOW:

1. Export your credentials from your system prompt
2. Pull all active pipeline companies (not closed/passed), sorted by succession_composite DESC.%s
3. For each company:
   a. Pull existing signals (for dedup)
   b. Search for recent news: "{company name}" news 2026, "{founder name}" {company name}
   c. Search for succession signals: "{founder name}" retirement OR philanthropy OR award
   d. Search for deal activity: "{company name}" acquisition OR merger OR investment
   e. For top-scoring companies: check LinkedIn activity of key people
   f. Assess each finding (URGENT/NOTABLE/ROUTINE/IGNORE)
   g. Dedup against existing signals — do NOT save duplicates
   h. Save new signals to Supabase with source URLs
   i. Update last_monitored_at timestamp for each company checked
   j. Update pipeline priority if warranted
4. Produce weekly digest grouped by URGENT/NOTABLE/ROUTINE

EFFICIENCY RULES:
- Start with highest succession_composite companies
- Spend more time on High/Very High readiness companies
- For Low readiness companies, a quick news search is sufficient
- If budget is running low (150+ tool calls), skip LinkedIn scraping
- Always update last_monitored_at even if no news found""" % (scope, today, province_filter)


def run_monitoring(province=None):
    config = load_config()
    prompt = build_prompt(province)

    scope = "All Provinces"
    if province:
        scope = PROVINCE_NAMES.get(province, province)

    print("\n" + "=" * 60)
    print("MPA Company Monitor — %s" % scope)
    print("=" * 60 + "\n")

    print("Creating session...")
    metadata = {"type": "monitoring"}
    if province:
        metadata["province"] = province

    session = client.beta.sessions.create(
        agent=config["agent_id"],
        environment_id=config["environment_id"],
        title="Monitor: %s" % scope,
        metadata=metadata,
    )
    print("Session: %s\n" % session.id)

    tool_calls = 0
    signals_saved = 0
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
                tool_name = event.name
                if "bash" in tool_name:
                    input_text = str(getattr(event, "input", ""))
                    if "rest/v1/signals" in input_text and "POST" in input_text:
                        signals_saved += 1
                if tool_calls % 20 == 0:
                    elapsed = int(time.time() - start_time)
                    print(
                        "\n  [%ds] %d tool calls, ~%d signals saved\n"
                        % (elapsed, tool_calls, signals_saved)
                    )

            elif etype == "session.status_idle":
                stop_reason = getattr(event, "stop_reason", None)
                if stop_reason and getattr(stop_reason, "type", "") == "end_turn":
                    break

            elif etype == "session.status_terminated":
                print("\n[SESSION TERMINATED]")
                error = getattr(event, "error", None)
                if error:
                    print("Error: %s" % error)
                break

            elif etype == "session.error":
                print("\n[ERROR] %s" % event)

    elapsed = int(time.time() - start_time)
    print("\n" + "=" * 60)
    print("Monitoring complete in %ds" % elapsed)
    print("Tool calls: %d" % tool_calls)
    print("Signals saved (estimated): %d" % signals_saved)
    print("Session ID: %s" % session.id)
    print("=" * 60)

    return session.id


if __name__ == "__main__":
    prov = None
    if "--province" in sys.argv:
        idx = sys.argv.index("--province")
        if idx + 1 < len(sys.argv):
            prov = sys.argv[idx + 1].upper()
            if prov not in PROVINCE_NAMES:
                print("Invalid province: %s. Use: NB, NS, PEI, NL" % prov)
                sys.exit(1)

    run_monitoring(prov)
