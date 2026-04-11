"""
MPA Company Monitor — Evaluation Script

Tests signal detection accuracy and dedup behavior.

Usage:
    python monitor_eval.py --detection           # Test known event detection
    python monitor_eval.py --detection --province NB  # NB only
    python monitor_eval.py --dedup --province NB  # Run twice, verify no dupes
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

load_dotenv(Path(__file__).parent.parent / ".env")

ANTHROPIC_API_KEY = os.environ["MPA_ANTHROPIC_API_KEY"]
SUPABASE_URL = "https://vuuoukfcbucgsqnnsaii.supabase.co"
SUPABASE_ANON_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1dW91a2ZjYnVjZ3Nxbm5zYWlpIiwi"
    "cm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4OTU4MTgsImV4cCI6MjA4MDQ3MTgxOH0."
    "L9xpsTOwSpLvY7OdVvsd74oGS6ubVOJxtNCZSiXdjQY"
)

MONITOR_CONFIG = Path(__file__).parent / "monitor_config.json"
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

# Known verifiable events for detection testing
KNOWN_EVENTS = [
    {
        "company_pattern": "G.E. Barbour",
        "province": "NB",
        "expected_signal_type": "leadership",
        "expected_category": "ceo_hire",
        "description": "Jeff Rose appointed President replacing Sylvia MacVey (Dec 2025)",
    },
    {
        "company_pattern": "Twin Rivers",
        "province": "NB",
        "expected_signal_type": "sell_side",
        "expected_category": "asset_sale",
        "description": "Sold Plaster Rock lumber mill to Groupe Lebel (March 2023)",
    },
    {
        "company_pattern": "Ganong",
        "province": "NB",
        "expected_signal_type": "buy_side",
        "expected_category": "pe_backing",
        "description": "Glenn Cooke / Cooke Inc took minority stake (Oct 2022)",
    },
    {
        "company_pattern": "Moosehead",
        "province": "NB",
        "expected_signal_type": "leadership",
        "expected_category": "founder_transition",
        "description": "Andrew & Patrick Oland became majority shareholders from Derek Oland (Dec 2024)",
    },
    {
        "company_pattern": "Mariner Partners",
        "province": "NB",
        "expected_signal_type": "leadership",
        "expected_category": "founder_transition",
        "description": "Co-founder Gerry Pond transitioned from Board Chair to advisory (2024)",
    },
]


def load_config():
    if not MONITOR_CONFIG.exists():
        print("No monitor_config.json found. Run monitor_deploy.py first.")
        sys.exit(1)
    return json.loads(MONITOR_CONFIG.read_text())


def supabase_get(table, params=None):
    url = "%s/rest/v1/%s" % (SUPABASE_URL, table)
    resp = requests.get(url, headers=HEADERS, params=params or {})
    resp.raise_for_status()
    return resp.json()


def run_monitor_session(config, province=None):
    """Run a monitoring session and return the timestamp before it started."""
    from monitor_run import build_prompt

    before_ts = datetime.now(timezone.utc).isoformat()
    scope = PROVINCE_NAMES.get(province, "All") if province else "All"

    print("\nStarting monitoring session for %s..." % scope)
    prompt = build_prompt(province)

    session = client.beta.sessions.create(
        agent=config["agent_id"],
        environment_id=config["environment_id"],
        title="Eval Monitor: %s" % scope,
        metadata={"type": "monitoring_eval", "province": province or "all"},
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


def get_signals_since(since, province=None):
    """Get all signals created after a timestamp, optionally filtered by province."""
    params = {"created_at": "gte.%s" % since, "select": "*,companies(name,province)"}
    signals = supabase_get("signals", params)
    if province:
        signals = [s for s in signals if s.get("companies", {}).get("province") == province]
    return signals


def check_event_detected(known_event, signals):
    """Check if a known event was detected in a signal list."""
    pattern = known_event["company_pattern"].lower()
    expected_type = known_event["expected_signal_type"]

    for sig in signals:
        company_name = sig.get("companies", {}).get("name", "").lower()
        if pattern not in company_name:
            continue
        if sig.get("signal_type") == expected_type:
            return True
        if known_event.get("expected_category") and sig.get("signal_category") == known_event["expected_category"]:
            return True
    return False


def check_event_preexisting(known_event, province=None):
    """Check if a known event already exists in the DB (saved by prospector or prior monitor).

    Uses flexible matching: checks signal_type, signal_category, AND description keywords.
    Signals may be classified differently by different agents — that's expected.
    """
    pattern = known_event["company_pattern"].lower()
    expected_type = known_event["expected_signal_type"]
    # Extract key terms from the event description for fuzzy matching
    desc_keywords = _extract_keywords(known_event["description"])

    all_signals = supabase_get("signals", {"select": "*,companies(name,province)"})
    for sig in all_signals:
        company_name = sig.get("companies", {}).get("name", "").lower()
        if pattern not in company_name:
            continue
        # Exact type match
        if sig.get("signal_type") == expected_type:
            return True
        # Exact category match
        if known_event.get("expected_category") and sig.get("signal_category") == known_event["expected_category"]:
            return True
        # Keyword match in description — if 2+ key terms appear, it's the same event
        sig_desc = (sig.get("description") or "").lower()
        sig_cat = (sig.get("signal_category") or "").lower()
        matches = sum(1 for kw in desc_keywords if kw in sig_desc or kw in sig_cat)
        if matches >= 2:
            return True
    return False


def _extract_keywords(description):
    """Extract meaningful keywords from an event description for fuzzy matching."""
    # Remove common words, keep names and action words
    stopwords = {
        "the", "a", "an", "and", "or", "of", "in", "to", "for", "from",
        "by", "as", "on", "at", "was", "is", "are", "were", "been", "be",
        "has", "had", "have", "with", "that", "this", "it", "its",
    }
    words = description.lower().replace("(", "").replace(")", "").replace(",", "").split()
    return [w for w in words if w not in stopwords and len(w) > 3]


def run_detection_eval(province=None):
    """Test whether the agent detects known verifiable events."""
    config = load_config()
    RESULTS_DIR.mkdir(exist_ok=True)

    # Filter known events by province if specified
    events_to_check = KNOWN_EVENTS
    if province:
        events_to_check = [e for e in KNOWN_EVENTS if e["province"] == province]

    print("Known events to detect: %d" % len(events_to_check))
    for e in events_to_check:
        print("  - %s: %s" % (e["company_pattern"], e["description"]))

    # Run monitoring session
    before_ts = run_monitor_session(config, province)

    # Pull signals created during session
    print("\nPulling signals created since session start...")
    new_signals = get_signals_since(before_ts, province)
    print("New signals found: %d" % len(new_signals))

    # Check each known event — distinguish new detection vs. correct dedup vs. missed
    detected = 0
    already_known = 0
    missed = 0
    results = []
    for event in events_to_check:
        found_new = check_event_detected(event, new_signals)
        if found_new:
            detected += 1
            results.append({
                "event": event["description"],
                "company": event["company_pattern"],
                "status": "DETECTED",
            })
        else:
            preexisting = check_event_preexisting(event, province)
            if preexisting:
                already_known += 1
                results.append({
                    "event": event["description"],
                    "company": event["company_pattern"],
                    "status": "ALREADY_KNOWN",
                })
            else:
                missed += 1
                results.append({
                    "event": event["description"],
                    "company": event["company_pattern"],
                    "status": "MISSED",
                })

    # Count companies with last_monitored_at updated
    if province:
        companies = supabase_get("companies", {
            "province": "eq.%s" % province,
            "last_monitored_at": "not.is.null",
            "select": "id",
        })
    else:
        companies = supabase_get("companies", {
            "last_monitored_at": "not.is.null",
            "select": "id",
        })
    monitored_count = len(companies)

    # Source quality — signals with valid source_url
    signals_with_source = sum(1 for s in new_signals if s.get("source_url"))
    source_quality = signals_with_source / len(new_signals) if new_signals else 0

    # Scorecard — coverage = detected + already_known (both mean the system has it)
    total_covered = detected + already_known
    coverage_rate = total_covered / len(events_to_check) if events_to_check else 0
    miss_rate = missed / len(events_to_check) if events_to_check else 0

    lines = [
        "",
        "=" * 60,
        "MONITORING DETECTION SCORECARD — %s" % (province or "ALL"),
        "=" * 60,
        "",
        "Known events tested:    %d" % len(events_to_check),
        "Newly detected:         %d (found by monitor this session)" % detected,
        "Already known:          %d (correctly deduped — prospector found these)" % already_known,
        "Missed:                 %d (not in DB at all)" % missed,
        "New signals saved:      %d" % len(new_signals),
        "Companies monitored:    %d" % monitored_count,
        "",
        "--- Metrics ---",
        "",
        "Event coverage:         %.0f%%  (target: >=70%%) [detected + already_known]" % (coverage_rate * 100),
        "Source quality:          %.0f%%  (target: >=90%%)" % (source_quality * 100),
        "New signals this run:   %d" % len(new_signals),
        "",
        "--- Pass/Fail ---",
        "",
    ]

    thresholds = {
        "Event coverage": (coverage_rate, 0.70),
        "Source quality": (source_quality, 0.90),
    }

    all_pass = True
    for name, (value, threshold) in thresholds.items():
        passed = value >= threshold
        if not passed:
            all_pass = False
        lines.append("  [%s] %s" % ("PASS" if passed else "FAIL", name))

    lines.append("")
    lines.append("Overall: %s" % ("PASS" if all_pass else "FAIL — iterate on system prompt"))

    lines.append("")
    lines.append("--- Event Detection Details ---")
    lines.append("")
    for r in results:
        lines.append("  [%s] %s — %s" % (r["status"], r["company"], r["event"]))

    lines.append("")
    lines.append("=" * 60)

    report = "\n".join(lines)
    print(report)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_path = RESULTS_DIR / ("monitor_detection_%s_%s.txt" % (province or "all", timestamp))
    report_path.write_text(report)
    print("Report saved to %s" % report_path)


def run_dedup_eval(province=None):
    """Run monitoring twice and verify no duplicate signals on second pass."""
    config = load_config()
    RESULTS_DIR.mkdir(exist_ok=True)

    print("=== DEDUP EVAL: Run 1 ===")
    ts1 = run_monitor_session(config, province)
    signals_run1 = get_signals_since(ts1, province)
    print("Run 1 signals: %d" % len(signals_run1))

    print("\n=== DEDUP EVAL: Run 2 ===")
    ts2 = run_monitor_session(config, province)
    signals_run2 = get_signals_since(ts2, province)
    print("Run 2 signals: %d" % len(signals_run2))

    # Check for duplicates — same source_url appearing in both runs
    run1_urls = set(s.get("source_url", "") for s in signals_run1 if s.get("source_url"))
    duplicates = [s for s in signals_run2 if s.get("source_url") in run1_urls]

    dedup_accuracy = 1.0 - (len(duplicates) / len(signals_run2)) if signals_run2 else 1.0

    lines = [
        "",
        "=" * 60,
        "MONITORING DEDUP SCORECARD — %s" % (province or "ALL"),
        "=" * 60,
        "",
        "Run 1 signals:    %d" % len(signals_run1),
        "Run 2 signals:    %d" % len(signals_run2),
        "Duplicates found: %d" % len(duplicates),
        "",
        "Dedup accuracy:   %.0f%%  (target: >=90%%)" % (dedup_accuracy * 100),
        "",
        "--- Pass/Fail ---",
        "",
        "  [%s] Dedup accuracy" % ("PASS" if dedup_accuracy >= 0.90 else "FAIL"),
        "",
    ]

    if duplicates:
        lines.append("--- Duplicate Signals ---")
        lines.append("")
        for d in duplicates:
            lines.append("  %s — %s" % (d.get("signal_category", "?"), d.get("source_url", "?")))

    lines.append("")
    lines.append("=" * 60)

    report = "\n".join(lines)
    print(report)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_path = RESULTS_DIR / ("monitor_dedup_%s_%s.txt" % (province or "all", timestamp))
    report_path.write_text(report)
    print("Report saved to %s" % report_path)


if __name__ == "__main__":
    if len(sys.argv) < 2 or "--detection" not in sys.argv and "--dedup" not in sys.argv:
        print("Usage: python monitor_eval.py --detection [--province NB]")
        print("       python monitor_eval.py --dedup [--province NB]")
        sys.exit(1)

    prov = None
    if "--province" in sys.argv:
        idx = sys.argv.index("--province")
        if idx + 1 < len(sys.argv):
            prov = sys.argv[idx + 1].upper()

    if "--detection" in sys.argv:
        run_detection_eval(prov)
    elif "--dedup" in sys.argv:
        run_dedup_eval(prov)
