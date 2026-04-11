# MPA Province Prospector — Managed Agent

Anthropic Managed Agent that discovers mid-market companies matching Morrison Park Advisors' Ideal Customer Profile in Atlantic Canada provinces.

## Setup

```bash
cd managed-agent
pip install -r requirements.txt
```

Ensure `.env` in the project root contains:
- `MPA_ANTHROPIC_API_KEY` — Anthropic API key for managed agents
- `SCRAPING_DOG_API_KEY` — ScrapingDog API key for LinkedIn scraping

## Deploy

```bash
python deploy.py
```

Creates the agent, environment, and uploads reference files. Saves all IDs to `config.json`.

## Run a Session

```bash
python run_session.py NB    # Prospect in New Brunswick
python run_session.py NS    # Prospect in Nova Scotia
python run_session.py PEI   # Prospect in PEI
python run_session.py NL    # Prospect in Newfoundland & Labrador
```

## Evaluate

Run the agent against a province with existing baseline data and compare quality:

```bash
python eval.py NB              # Full eval (run agent + score)
python eval.py NB --skip-run   # Score only (compare existing data)
```

Reports are saved to `eval_results/`.

## Eval Metrics

| Metric | Target |
|--------|--------|
| Discovery rate (% of baseline found) | >= 70% |
| Revenue accuracy (within 30%) | >= 80% |
| Ownership type match | >= 90% |
| Industry classification match | >= 85% |
| Succession scores (within +/-1) | >= 75% |
| Sources per company | >= 5 |

## Iteration Workflow

1. Run eval: `python eval.py NB`
2. Review scorecard — identify weak dimensions
3. Edit system prompt in `deploy.py`
4. Update agent: `python deploy.py --update`
5. Re-run eval until all metrics pass
6. Validate on remaining provinces (PEI, NL, NS)

## Architecture

- **Model:** Claude Sonnet 4.6
- **Tools:** Built-in agent toolset (bash, web_search, web_fetch, read, write, glob, grep)
- **Secrets:** Mounted credentials file (Supabase + ScrapingDog keys)
- **Output:** Directly to Supabase database
- **No custom tools** — agent uses bash + curl for all API calls

## Cost Tracking

All API calls use the dedicated `MPA_ANTHROPIC_API_KEY` for cost isolation.
Estimated cost per session: $0.50–$1.50 (Sonnet).
