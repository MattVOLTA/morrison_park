# Morrison Park — AI-Powered M&A Deal Intelligence POC

## Quick Start
Read `context-map.md` at the start of every session. It contains all data source locations, query patterns, keys, and project history.

## Project Purpose
AI proof-of-concept for Morrison Park Advisors (Ken Skinner). Testing whether Claude Code skills can generate actionable M&A deal intelligence for Atlantic Canada mid-market companies. Also a lab for AI-augmented consulting as a future product model.

## Primary Data Sources

| Source | Access Method | Key |
|--------|--------------|-----|
| **Supabase** | Supabase MCP tools | project: `vuuoukfcbucgsqnnsaii` |
| **GitHub** | GitHub MCP / `gh` CLI | `MattVOLTA/morrison_park` |
| **Netlify** | Netlify MCP tools | `morrison-park.netlify.app` |
| **Gmail** | Google Workspace MCP | `matt@voltaeffect.com`, search `kskinner@morrisonpark.com` |
| **Fireflies** | Fireflies MCP tools | search `ken skinner` |
| **Perplexity** | Perplexity MCP tools | Company research |
| **Todoist** | curl (REST v1 API) | project: `6g4JH95McmPHjwGV` |

## Key Skill: atlantic-company-enricher

Located at `.claude/skills/atlantic-company-enricher/SKILL.md`

Researches Atlantic Canada companies (NS, NB, PEI, NL) for M&A purposes:
- Structured profiles with ownership, succession signals, deal readiness
- Succession Scorecard (1-5 ratings across 5 dimensions)
- Potential acquirer identification (strategic + PE buyers)
- Supabase integration for persistent storage
- **CRITICAL**: Every data point requires a source URL for verification

Invoke when user asks to "research", "enrich", or "profile" an Atlantic Canada company.

## Rules

- **Source URLs required** on every data point — non-negotiable for M&A credibility
- **Confidentiality**: Ken's proprietary intel stays between us
- **Pre-screen before deep research**: Check (1) not already sold, (2) not wrong company type, (3) not already known to Ken
- **Three client types**: Sell-side succession, buy-side acquisition, AND growth capital — not just succession
- **Kill criteria are explicit**: See context-map.md for thresholds

## Google Workspace Tool Tips

### Gmail Attachments
- `get_gmail_messages_content_batch` does **not** return attachment details — only subject, sender, date, body
- `get_gmail_message_content` (single message) returns full attachment metadata: filename, MIME type, size, attachment ID
- `get_gmail_attachment_content` downloads an actual file to disk (requires message_id + attachment_id)

**Attachment workflow:** `search_gmail_messages` → `get_gmail_message_content` (one at a time) → `get_gmail_attachment_content` if needed

## Todoist Integration

- **Env file**: Source `/Users/matt/Development/Morrison Park/.env` (NOT Laurie/.env)
- **Token var**: `TODOIST_API_TOKEN` (not TODOIST_API_KEY)
- **API**: REST v1 at `https://api.todoist.com/api/v1/` with `Authorization: Bearer $TODOIST_API_TOKEN`
- **Sync API v9 is deprecated** — do not use
- **Before adding tasks**: Always list existing tasks first to avoid duplicates
- **Before updating**: Read the task to confirm current state
- **Moving tasks between sections**: Use `POST /api/v1/tasks/{id}/move` with `{"section_id": "..."}` (not the update endpoint)
- **Sections**: Triage (`6g4MRQPV5wJPJ6J3`), Do (`6g4MRQRVmQh3qH33`), Waiting (`6g4MRQMrxGHgG3F3`), Defer (`6g4MRQR35w92w5VV`)

## Deployment

Static HTML dashboard hosted on Netlify. Config in `netlify.toml`:
- Publish directory: `idea_cards/`

## Workflow

1. User provides company names to research
2. Run atlantic-company-enricher skill to generate profiles
3. Output goes to `idea_cards/` as markdown + Supabase
4. Ken reviews and scores outputs (accuracy, novelty, actionability)
5. Iterate based on feedback; kill if novelty < 2.5 after 5 companies
