# Morrison Park — Context Map

> Last updated: 2026-02-22
> Maintained by: Claude Code (auto-refresh on session start)

---

## Quick Reference

- **Project**: Morrison Park
- **Slug**: morrison-park
- **Client**: Ken Skinner, Managing Director, Morrison Park Advisors
- **Client Email**: `kskinner@morrisonpark.com`
- **Supabase Project**: `vuuoukfcbucgsqnnsaii`
- **GitHub Repo**: `MattVOLTA/morrison_park` (private)
- **Netlify Dashboard**: `https://morrison-park.netlify.app/`
- **Todoist Project ID**: `6g4JH95McmPHjwGV`

---

## Project Purpose

> AI proof-of-concept for Morrison Park Advisors (MPA), testing whether Claude Code skills can generate actionable M&A deal intelligence for Atlantic Canada mid-market companies. Ken's vision is an "Informed Ideation OS" — a system that proactively surfaces deal hypotheses ("Idea Cards") by synthesizing public data, relationship networks, and proprietary knowledge.

This project also serves as a **lab for AI-augmented consulting** — exploring what future revenue streams or willingness-to-pay products might look like when AI handles research, qualification, and ideation while human advisors focus on relationships and judgment.

### Current Status (Feb 2026)

- **Phase 1 validated**: Company enricher skill tested on 13+ companies. Ken rated results "exceptional" and "highly additive." Average scores: 3.4/5 accuracy, 3.7/5 novelty, 3.5/5 actionability.
- **Gold standard result**: Imperial Manufacturing Group scored 5/4/5 — found BEFORE any transaction activity, novel to Ken, immediately actionable.
- **Next steps requested**: Ken wants a St. John's regional test and to push the pilot forward (Feb 17 email, unanswered).
- **Planned meeting**: Ken hopes to be in Halifax late March.

### Kill Criteria

| Skill | Kill If |
|-------|---------|
| atlantic-company-enricher | Avg novelty <2.5 after 5 companies |
| mpa-qualification-scorer | <70% agreement with Ken's judgment |
| deal-hypothesis-generator | Avg novelty <3.0 AND actionability <3.0 |
| meeting-prep-briefer | Ken doesn't use the brief in actual meeting |

If 2+ skills killed in Phase 1-2: Stop and reassess core hypothesis.

---

## People

### Ken Skinner (Client)
- **Relationship**: Managing Director at MPA. Leading Atlantic Canada origination. The client and evaluator of all POC outputs.
- **Email**: `kskinner@morrisonpark.com`
- **Phone**: 416.861.2241
- **LinkedIn**: https://www.linkedin.com/in/kenskinnermpa/
- **Location**: Toronto (9 Temperance St, Suite 300, M5H 1Y6), travels to Atlantic Canada regularly
- **Background**: Ex-Scotia Capital, CFA, McMaster MBA. At MPA since 2006 (~19 years).
- **Communication style**: Detailed, generous with context. Responds in bursts (sometimes weeks between replies). Prefers email.
- **Cadence**: Irregular — responds when he has time, usually with long detailed feedback. Halifax trips roughly monthly.

### Matt Cooper (Orchestrator)
- **Relationship**: CEO, Volta. Running the POC, building skills, learning the M&A domain.
- **Email**: `matt@voltaeffect.com`
- **Role in this project**: Orchestrator — runs skills, reviews outputs, refines prompts, interfaces with Ken.

### Andy Farnsworth (Volta Team)
- **Relationship**: Volta team member. Had a separate meeting with Ken (Dec 2025) re: Newfoundland ecosystem, Virtual Hallway, and builder network introductions.
- **Email**: `andy@voltaeffect.com`

---

## Data Source Registry

### Supabase (Database)
- **Access**: Supabase MCP tools with project ref `vuuoukfcbucgsqnnsaii`
- **Purpose**: Persistent storage for company intelligence, pipeline tracking, and POC metrics

#### Tables

| Table | Rows | Purpose | Key Columns |
|-------|------|---------|-------------|
| `companies` | 27 | Core M&A target companies | `name`, `province`, `ownership_type`, `revenue_estimate`, succession scores |
| `signals` | 36 | Transaction signals over time | `company_id`, `signal_type` (sell/buy/growth/leadership/financial/strategic) |
| `pipeline` | 24 | Deal stage tracking | `company_id`, `stage` (prospect→closed), `priority`, `client_type` |
| `key_people` | 21 | Executives, owners, board members | `company_id`, `name`, `title`, `role`, `age_estimate` |
| `user_feedback` | 16 | Ken's accuracy/novelty/actionability scores | `company_id`, accuracy/novelty/actionability_score (1-5) |
| `research_sources` | 10 | Source URLs for verification | `company_id`, `source_url`, `source_type`, `confidence` |
| `investors` | 6 | PE firms, family offices, strategics | `name`, `investor_type`, `sectors`, `geographic_focus` |
| `potential_acquirers` | 1 | Potential buyers for targets | `company_id`, `acquirer_name`, `acquirer_type`, `rationale` |
| `connections` | 0 | Warm intro paths (not populated) | `company_id`, `connection_type`, `potential_introducer` |
| `company_investors` | 0 | Company-investor links (not populated) | `company_id`, `investor_id`, `board_seat` |

#### Key Computed Fields
- `succession_composite`: Auto-sum of 5 succession scores (max 25)
- `succession_readiness`: Auto-categorized as Low (<10) / Medium (10-15) / High (16-20) / Very High (>20)

#### Validated Query Patterns

```sql
-- Top pipeline prospects by priority
SELECT c.name, p.stage, p.priority, p.client_type, p.next_action,
  c.succession_readiness, c.revenue_estimate
FROM pipeline p
JOIN companies c ON p.company_id = c.id
WHERE p.stage NOT IN ('closed', 'passed')
ORDER BY p.priority DESC;

-- POC metrics: average feedback scores
SELECT
  ROUND(AVG(accuracy_score), 1) as avg_accuracy,
  ROUND(AVG(novelty_score), 1) as avg_novelty,
  ROUND(AVG(actionability_score), 1) as avg_actionability,
  COUNT(*) as total_rated
FROM user_feedback;

-- Companies with highest succession readiness
SELECT name, province, revenue_estimate, succession_composite, succession_readiness
FROM companies
WHERE succession_readiness IN ('High', 'Very High')
ORDER BY succession_composite DESC;
```

### GitHub (`MattVOLTA/morrison_park`)
- **Access**: GitHub MCP tools or `gh` CLI
- **Purpose**: Version control for skills, research docs, idea cards, multi-agent system
- **Key branches**: `main` only (9 commits)

### Netlify (`morrison-park.netlify.app`)
- **Access**: Netlify MCP tools
- **Purpose**: Hosts the idea card dashboard (static HTML from `idea_cards/`)
- **Config**: `netlify.toml` — publish directory is `idea_cards/`

### Gmail
- **Access**: Google Workspace MCP tools (`matt@voltaeffect.com`)
- **Search patterns**:
  - `from:kskinner@morrisonpark.com` — Ken's emails
  - `to:kskinner@morrisonpark.com` — Emails to Ken
  - Main thread ID: `19aa25eb02e84a4b` (Nov 2025 → Feb 2026, "New name for program!" subject)
- **Latest**: Ken's Feb 17 follow-up asking to push the pilot forward (unanswered)

### Fireflies (Meeting Transcripts)
- **Access**: Fireflies MCP tools
- **Relevant transcripts**:
  - `01K3Q7K8HKZ028RM7SQ3A12AGW` — Ken & Matt, Aug 28 2025 (32 min, initial discovery)
  - `01KCKVBZD5A376K8EDZMFHKGDA` — Ken & Andy, Dec 18 2025 (49 min, ecosystem connections)

### Perplexity
- **Access**: Perplexity MCP tools
- **Purpose**: Primary research tool for company enrichment — deep web searches for company intelligence

### Todoist
- **Access**: Todoist Sync API via curl (no MCP server). Token in `.env` as `TODOIST_API_TOKEN`.
- **Project**: Morrison Park (`6g4JH95McmPHjwGV`)
- **Reference**: See `todoist_api_reference.md` in outworkos root for API patterns.

---

## Rules & Constraints

- **Source URLs required**: Every data point in company profiles MUST have a verifiable source URL. Non-negotiable for M&A credibility.
- **Confidentiality**: Ken's proprietary intel (meeting notes, private conversations, analyst data) must be kept between us. Do not share or reference in external outputs.
- **Kill criteria are explicit**: Follow the kill criteria table above. Be ruthless about killing skills that don't deliver value.
- **Integrate, don't replace**: The system augments Ken's workflow and analysts — it doesn't replace his CRM, deal tracking, or human judgment.
- **Atlantic Canada only**: Focus on NS, NB, PEI, NL. Companies must be headquartered in region.
- **Pre-screen before deep research**: Based on feedback analysis, always check: (1) not already sold, (2) not PE-backed professional services, (3) not already known to Ken, (4) in MPA's sector sweet spot.
- **MPA sector priorities**: Manufacturing/industrials > building products/construction > food & beverage > healthcare services > distribution. Deprioritize professional services, employee-owned firms, PE-backed growth cos.
- **Three client types**: Don't just look for sell-side succession. Also surface: buy-side (companies growing through acquisition) and growth (companies needing capital to expand).

---

## Timeline Playbook

To reconstruct chronological history, query these sources and merge by date:

### SQL Queries

```sql
-- Supabase: company research timeline
SELECT 'research' as source, research_date as event_date,
  name, province, succession_readiness
FROM companies
ORDER BY research_date;

-- Supabase: signals timeline
SELECT 'signal' as source, s.signal_date as event_date,
  c.name, s.signal_type, s.description
FROM signals s
JOIN companies c ON s.company_id = c.id
ORDER BY s.signal_date;

-- Supabase: feedback timeline
SELECT 'feedback' as source, uf.created_at as event_date,
  c.name, uf.accuracy_score, uf.novelty_score, uf.actionability_score
FROM user_feedback uf
JOIN companies c ON uf.company_id = c.id
ORDER BY uf.created_at;
```

### Non-SQL Timeline Sources

```
# Gmail — Ken's email thread
search_gmail_messages(query: "from:kskinner@morrisonpark.com OR to:kskinner@morrisonpark.com", user_google_email: "matt@voltaeffect.com")

# Fireflies — meeting transcripts with Ken
fireflies_search(query: "keyword:\"ken skinner\" limit:10")

# GitHub — commit history
git log --oneline --all (in /Volumes/SD/Morrison Park/)
```

### Key Dates

| Date | Event |
|------|-------|
| 2025-08-28 | First meeting: Ken & Matt via Zoom (Seasoned Pros context) |
| 2025-11-20 | Ken emails asking to put MPA through Volta's program |
| 2025-11-25 | Discovery meeting: Ken describes origination process, "Informed Ideation" vision |
| 2025-11-30 | Ken sends "Informed Ideation OS" executive summary |
| 2025-12-01 | Matt sends first ICP doc + initial idea cards |
| 2025-12-02 | Ken provides 3 test companies (Acadian, Protocase, Emmerson) + deep context |
| 2025-12-02 | Matt sends company profiles via Netlify dashboard |
| 2025-12-04 | Ken sends detailed feedback on all companies (the "big purge" email) |
| 2025-12-18 | Ken & Andy meeting: ecosystem connections, Virtual Hallway, Newfoundland |
| 2026-01-02 | Matt resends dashboard link after Ken lost the email |
| 2026-01-12 | Ken rates iteration as "exceptional" — requests St. John's regional test |
| 2026-02-17 | Ken follows up asking to push pilot forward (unanswered) |

---

## Refresh Checklist

When starting a new session, run through this checklist:

1. **Read this context map** — establishes full project context
2. **Check recent Gmail** — search for `from:kskinner@morrisonpark.com` to see if Ken has sent anything new
3. **Check Supabase metrics** — run the POC metrics query (avg feedback scores) to know current state
4. **Check pipeline** — run the top pipeline prospects query
5. **Check Todoist** — pull tasks from project `6g4JH95McmPHjwGV` to see outstanding items
6. **Review latest idea cards** — read `idea_cards/` for most recent company profiles
7. **Read feedback analysis** — `discovery/feedback_analysis_and_recommendations.md` for improvement patterns

---

## File Structure

```
/Volumes/SD/Morrison Park/
├── context-map.md                              ← This file (deep reference)
├── CLAUDE.md                                   ← Lightweight pointer
├── .env                                        ← Credentials (Google, Todoist, Supabase, Scraping Dog)
├── .mcp.json                                   ← MCP servers (GitHub, Netlify, Context7, Perplexity, Fireflies, Google, Supabase)
├── netlify.toml                                ← Netlify config (publishes idea_cards/)
├── discovery/                                  ← Research & strategy documents
│   ├── Initial_conversation.md                 ← Nov 25 meeting transcript
│   ├── Dec_4_email_from_ken.md                 ← Ken's detailed feedback
│   ├── jan_12_2026_email.md                    ← Ken rates results "exceptional"
│   ├── ken_skinner_profile.md                  ← Ken's LinkedIn/professional profile
│   ├── high_level_idea.md                      ← Ken's "Informed Ideation OS" vision
│   ├── questions_for_ken.md                    ← 30 validation questions (many unanswered)
│   ├── unmet_need_and_assumptions.md           ← Core hypothesis + 5 assumptions to test
│   ├── Solution_Market_Research.md             ← Competitive landscape (4Degrees, Grata, etc.)
│   ├── feedback_analysis_and_recommendations.md ← Pattern analysis of 13 rated companies
│   └── github_issue_draft.md
├── morrison_park/                              ← MPA company research
│   ├── morrison_park_overview.md               ← MPA firm profile
│   ├── mpa_ideal_customer_profile.md           ← ICP document
│   ├── atlantic_canada_competitive_research.md ← Regional competitive analysis
│   └── mpa_deal_history_research.md
├── poc/                                        ← POC planning
│   ├── skills_based_poc_approach.md            ← Implementation plan (6 skills mapped to assumptions)
│   └── 3testcompanies.md
├── idea_cards/                                 ← Output: company profiles + dashboard
│   ├── index.html                              ← Dashboard (deployed to Netlify)
│   ├── company_research_summary.md             ← Summary of 4 initial companies
│   ├── 01_imperial_manufacturing_group.md
│   ├── 02_stevens_group_of_companies.md
│   ├── 03_cbcl_limited.md
│   └── types/
├── agents/                                     ← Multi-agent system (Anthropic Agent SDK)
│   ├── README.md                               ← Architecture: Orchestrator → Prospector/Researcher/Connector
│   ├── src/                                    ← TypeScript source
│   ├── package.json
│   └── tsconfig.json
└── .claude/
    ├── settings.local.json                     ← Local settings (all MCP servers enabled)
    ├── agents/                                 ← Subagent definitions (7 agents)
    ├── skills/                                 ← Skills (many generic, 1 project-specific)
    │   └── atlantic-company-enricher/          ← Core skill: company intelligence profiles
    │       ├── SKILL.md                        ← Workflow, output template, Supabase integration
    │       └── reference/
    │           └── succession-signals.md       ← Signal detection guide
    └── commands/
```

---

## POC Skills Roadmap

| Phase | Skill | Status | Validates |
|-------|-------|--------|-----------|
| 1 | atlantic-company-enricher | **Validated** (avg scores >3/5) | Assumption 1: Proactive beats reactive |
| 2 | mpa-qualification-scorer | Not started | Assumption 2: AI can match Ken's criteria |
| 3 | deal-hypothesis-generator | Not started | Assumption 3: Novel deal hypotheses |
| 4 | meeting-prep-briefer | Not started | Assumption 5: Ken will act on recommendations |
| Future | signal-monitor | Deferred | Assumption 4: Signal monitoring catches inflection points |
| Future | relationship-path-finder | Deferred | Assumption 3: Relationship paths add value |

### Enricher Improvement Queue (from feedback analysis)

Based on Ken's Dec 4 feedback and the 13-company feedback analysis:

1. **Transaction recency check** — prevent post-deal errors (Elanco scored 1/5 accuracy)
2. **Company type filtering** — deprioritize professional services, employee-owned
3. **Consistent sections** — all reports should have same sections (client base, competitors, comps)
4. **Major customers/geographies** — Ken wants to see who they sell to and where
5. **Competitive advantages / moats** — Ken suggested "Sustainable Moats" or "SWOT" section
6. **Buy-side and growth signals** — not just sell-side succession
7. **Deeper recent activity** — complete record, not just highlights
8. **MPA Fit Score refinement** — calibrate against Ken's judgment
9. **Multi-agent pipeline** — pre-screening → novelty check → deep research → timing → connections

---

## Key Insights from Ken's Feedback

These are the most important patterns from Ken's engagement:

1. **"Nothing happens unless I do it"** — The core constraint. Ken is bandwidth-limited. Anything that surfaces quality opportunities without his manual effort is high value.
2. **"Be careful what you wish for"** — Ken often counsels clients about partnership risks. The system should flag both opportunities AND risks.
3. **The Inner Circle** — Deals flow through board members, investors, and advisors who influence decisions. Mapping shared investors across companies is extremely valuable (e.g., Jim Lawley + Robert Richardson across Sustane, Oberland, Sustainable Blue).
4. **"Advisors, not brokers"** — MPA's pitch is partnership, not transaction. The system should identify how MPA can *help* (capital, introductions, strategy), not just whether a company will sell.
5. **Insights Podcast** — Don and David's podcast is a goldmine for Atlantic Canada company intelligence. Audio content as a source would be transformative.
6. **Relationships trump research** — JP Deveau ignored Ken for a year until Ken found a skiing connection through his partner. Warm intro paths are critical.
