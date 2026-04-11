"""
MPA Province Prospector — Session Runner

Starts a prospecting session for a specific province and streams results.

Usage:
    python run_session.py NB              # Prospect in New Brunswick
    python run_session.py NS              # Prospect in Nova Scotia
    python run_session.py PEI             # Prospect in PEI
    python run_session.py NL              # Prospect in Newfoundland & Labrador
    python run_session.py NB --prompt "custom prompt"  # Custom task
"""

import json
import sys
import time
from pathlib import Path

from anthropic import Anthropic
from dotenv import load_dotenv
import os

load_dotenv(Path(__file__).parent.parent / ".env")

ANTHROPIC_API_KEY = os.environ["MPA_ANTHROPIC_API_KEY"]
CONFIG_PATH = Path(__file__).parent / "config.json"

PROVINCE_NAMES = {
    "NB": "New Brunswick",
    "NS": "Nova Scotia",
    "PEI": "Prince Edward Island",
    "NL": "Newfoundland and Labrador",
}

client = Anthropic(api_key=ANTHROPIC_API_KEY)


def load_config() -> dict:
    if not CONFIG_PATH.exists():
        print("No config.json found. Run deploy.py first.")
        sys.exit(1)
    return json.loads(CONFIG_PATH.read_text())


def build_prompt(province: str, custom_prompt=None) -> str:
    province_name = PROVINCE_NAMES.get(province, province)

    if custom_prompt:
        return custom_prompt

    return f"""Prospect for M&A target companies in {province_name} ({province}).

EXECUTE THIS WORKFLOW NOW:

1. Export your credentials (SUPABASE_URL, SUPABASE_KEY, SCRAPINGDOG_API_KEY) from your system prompt
2. Query existing {province} companies from Supabase to avoid duplicates
4. Search for mid-market companies ($10M-$500M revenue) in {province_name} matching the ICP
5. For each new company found (NOT already in database):
   a. Research thoroughly (revenue, ownership, industry, key people)
   b. Score against ICP tiers (Tier 1/2/3 or disqualify)
   c. Calculate succession scorecard (5 dimensions, 1-5 each)
   d. Find and scrape LinkedIn profiles for 3-5 key people
   e. Save everything to Supabase (company, key_people, signals, pipeline, research_sources)
6. Report summary

TARGET: Find at least 5 new companies that qualify as Tier 1 or Tier 2 ICP fits.

Search strategies:
- "{province_name} largest private companies"
- "{province_name} family business founder owner"
- "{province_name} top employers private company"
- "{province_name} business acquisition merger"
- "{province_name} fastest growing companies award"
- Sector-specific searches for energy, manufacturing, healthcare, financial services, construction

Remember: EVERY data point needs a source URL. Skip companies already in the database."""


def run_session(province: str, custom_prompt=None):
    config = load_config()
    prompt = build_prompt(province, custom_prompt)

    province_name = PROVINCE_NAMES.get(province, province)
    print(f"\n{'='*60}")
    print(f"MPA Province Prospector — {province_name}")
    print(f"{'='*60}\n")

    # Create session
    print("Creating session...")
    session = client.beta.sessions.create(
        agent=config["agent_id"],
        environment_id=config["environment_id"],
        title=f"Prospect: {province_name}",
        metadata={"province": province},
    )
    print(f"Session: {session.id}\n")

    # Stream events
    tool_calls = 0
    companies_saved = 0
    start_time = time.time()

    with client.beta.sessions.events.stream(session.id) as stream:
        # Send the prospecting prompt
        client.beta.sessions.events.send(
            session.id,
            events=[
                {
                    "type": "user.message",
                    "content": [{"type": "text", "text": prompt}],
                }
            ],
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
                # Track company saves
                if "bash" in tool_name:
                    input_text = str(getattr(event, "input", ""))
                    if "rest/v1/companies" in input_text and "POST" in input_text:
                        companies_saved += 1
                if tool_calls % 10 == 0:
                    elapsed = int(time.time() - start_time)
                    print(
                        f"\n  [{elapsed}s] {tool_calls} tool calls, "
                        f"~{companies_saved} companies saved\n"
                    )

            elif etype == "session.status_idle":
                stop_reason = getattr(event, "stop_reason", None)
                if stop_reason and getattr(stop_reason, "type", "") == "end_turn":
                    break

            elif etype == "session.status_terminated":
                print("\n[SESSION TERMINATED]")
                error = getattr(event, "error", None)
                if error:
                    print(f"Error: {error}")
                break

            elif etype == "session.error":
                print(f"\n[ERROR] {event}")

    elapsed = int(time.time() - start_time)
    print(f"\n{'='*60}")
    print(f"Session complete in {elapsed}s")
    print(f"Tool calls: {tool_calls}")
    print(f"Companies saved (estimated): {companies_saved}")
    print(f"Session ID: {session.id}")
    print(f"{'='*60}")

    return session.id


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python run_session.py <PROVINCE> [--prompt 'custom prompt']")
        print("Provinces: NB, NS, PEI, NL")
        sys.exit(1)

    province = sys.argv[1].upper()
    if province not in PROVINCE_NAMES:
        print(f"Invalid province: {province}. Use: NB, NS, PEI, NL")
        sys.exit(1)

    custom_prompt = None
    if "--prompt" in sys.argv:
        idx = sys.argv.index("--prompt")
        if idx + 1 < len(sys.argv):
            custom_prompt = sys.argv[idx + 1]

    run_session(province, custom_prompt)
