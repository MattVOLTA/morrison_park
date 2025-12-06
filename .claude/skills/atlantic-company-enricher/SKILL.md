---
name: atlantic-company-enricher
description: "Researches Atlantic Canada companies for M&A intelligence. Use when asked to research, enrich, or profile a company in Nova Scotia, New Brunswick, PEI, or Newfoundland for investment banking or deal sourcing purposes. Outputs structured company profiles with ownership, succession signals, and deal readiness indicators."
---

# Atlantic Canada Company Enricher

## Purpose
Produce comprehensive company intelligence profiles for Atlantic Canada mid-market companies, optimized for M&A origination and deal qualification. Surfaces information that manual internet/LinkedIn searches miss.

## When to Use
- User asks to "research [company name]" in Atlantic Canada
- User asks to "enrich" or "profile" a company
- User asks about ownership, succession, or deal readiness for a regional company
- User provides a list of companies to research

## When NOT to Use
- Company is outside Atlantic Canada (NS, NB, PEI, NL)
- User wants general business info (not M&A focused)
- Company is a large public corporation (use standard research)

## Workflow

1. **Confirm company identity**
   - Verify company name, location, industry
   - Ask clarifying questions if ambiguous (multiple companies with same name)

2. **Research systematically** (use Perplexity, web search, available tools)
   - Company basics (legal name, location, industry, founding date)
   - Ownership structure (who owns it, ownership %, family involvement)
   - Key people (owner, executives, board members)
   - Size indicators (revenue estimate, employee count, locations)
   - Recent activity (news, expansions, acquisitions, leadership changes)
   - Succession signals (see reference/succession-signals.md)
   - Competitive position (market share, key competitors)
   - Potential transaction triggers

   **CRITICAL - SOURCE CITATION REQUIREMENT:**
   - **EVERY data point MUST have a source URL**
   - No information should be presented without a verifiable source link
   - If a source cannot be found for a claim, mark it as "Unverified" or omit it
   - Users MUST be able to click through to verify any information
   - This is non-negotiable for M&A deal intelligence credibility

3. **Synthesize into structured profile**
   - Use the output template below
   - Flag confidence levels for uncertain data
   - Note gaps (what couldn't be found)

4. **Identify deal hypotheses**
   - Based on findings, suggest why this company might need advisory services
   - Flag any red flags or disqualifiers

5. **Save to Supabase**
   - After generating the markdown profile, save structured data to Supabase
   - Use the MCP tools (morrison_park) to insert data
   - See "Supabase Integration" section below for details

## Output Template

```markdown
# Company Profile: [Company Name]

**Generated:** [Date]
**Confidence:** [High/Medium/Low] - based on data availability

## Basic Information
| Field | Value | Confidence | Source |
|-------|-------|------------|--------|
| Legal Name | | | |
| Location | | | |
| Industry | | | |
| Founded | | | |
| Website | | | |

## Ownership Structure
| Owner | Role | Ownership % | Notes |
|-------|------|-------------|-------|
| | | | |

**Ownership Type:** [Founder-owned / Family-held / PE-backed / Public / Other]

## Key People
| Name | Title | Age (est.) | Tenure | LinkedIn |
|------|-------|------------|--------|----------|
| | | | | |

## Size Indicators
| Metric | Estimate | Confidence | Source |
|--------|----------|------------|--------|
| Revenue | | | |
| Employees | | | |
| Locations | | | |

## Recent Activity (Last 24 Months)

| Date | Event | Source |
|------|-------|--------|
| [Date] | [Event description] | [Source name](URL) |
| [Date] | [Event description] | [Source name](URL) |

*Always include source URLs for verification and deeper research.*

## Succession Scorecard

| Dimension | Score (1-5) | Evidence |
|-----------|-------------|----------|
| Owner Age | [1: <55, 2: 55-60, 3: 60-65, 4: 65-72, 5: >72] | |
| Tenure | [1: <10yr, 2: 10-15yr, 3: 15-25yr, 4: 25-35yr, 5: >35yr] | |
| Next-Gen Clarity | [1: Clear successor, 3: Unclear, 5: No successor] | |
| Legacy Signals | [1: None, 3: Some (awards), 5: Strong (philanthropy, foundation)] | |
| Activity Trajectory | [1: Active M&A, 3: Steady, 5: Slowing/divesting] | |

**Composite Score:** [X]/25
**Succession Readiness:** [Low (<10) / Medium (10-15) / High (16-20) / Very High (>20)]
**Assessment:** [Narrative summary - e.g., "High probability of transaction consideration within 2-3 years based on owner age and legacy signals"]

## Deal Readiness Indicators
| Factor | Assessment | Notes |
|--------|------------|-------|
| Financial health | | |
| Market position | | |
| Management depth | | |
| Clean ownership | | |
| Industry dynamics | | |

## Potential Acquirers

**CRITICAL: Every acquirer entry MUST include source URLs for recent deals and rationale.**

### Strategic Buyers
| Company | Rationale | Recent Relevant Deals | Source |
|---------|-----------|----------------------|--------|
| [Name] | [Why they would acquire] | [Deal name, value, date] | [Source URL] |

### Financial Buyers (PE)
| Firm | Investment Thesis Fit | Relevant Portfolio Cos | Source |
|------|----------------------|------------------------|--------|
| [Name] | [Why thesis fits] | [Portfolio examples] | [Source URL] |

**Buyer Research Notes:** [Any additional context on buyer landscape, consolidation trends, recent activity]

## Comparable Transactions

**CRITICAL: Every transaction MUST include a source URL for deal value/multiple.**

| Date | Target | Acquirer | Deal Value | Multiple | Source |
|------|--------|----------|------------|----------|--------|
| [Date] | [Company] | [Buyer] | [Value] | [xEBITDA] | [Source URL] |

**Comps Notes:** [Market context, valuation trends, data limitations]

## Market Context ("Why Now")

**CRITICAL: Every data point MUST include a source URL.**

| Factor | Data Point | Source | Implication |
|--------|------------|--------|-------------|
| Industry Consolidation | [stat] | [Source URL] | [what it means] |
| Owner Demographics | [stat] | [Source URL] | [timing window] |
| Capital Availability | [stat] | [Source URL] | [buyer appetite] |
| Sector Tailwinds | [stat] | [Source URL] | [strategic drivers] |

**Timing Assessment:** [Summary of why now is/isn't a good time for a transaction]

## Potential Transaction Triggers
1. [Trigger + rationale]
2. [Trigger + rationale]

## Deal Hypotheses
Based on this research, potential advisory opportunities:

1. **[Hypothesis]**: [Rationale]
2. **[Hypothesis]**: [Rationale]

## Red Flags / Disqualifiers
- [Any concerns that might disqualify this opportunity]

## Information Gaps
- [What we couldn't find that would be valuable]

## Recommended Next Steps
1. [Specific action]
2. [Specific action]

## Connection Opportunities (Public Sources)

**CRITICAL: Every connection MUST include a verifiable source URL.**

| Connection Type | Detail | Source |
|-----------------|--------|--------|
| Board/Association | [e.g., "JA New Brunswick board member"] | [Source URL] |
| Conference Circuit | [e.g., "Spoke at ACG Atlantic 2024"] | [Source URL] |
| Philanthropy | [e.g., "Major donor to Dalhousie"] | [Source URL] |
| Shared Advisors | [e.g., "Uses McInnes Cooper (per press)"] | [Source URL] |
| University/Alumni | [e.g., "Dalhousie MBA, active alumni"] | [Source URL] |

**Warm Intro Paths:** [Narrative on best connection angles and who might facilitate introductions]

## Master Sources List

**CRITICAL: Consolidate ALL sources used in this profile. Every claim must be traceable.**

| Source | URL | Data Points Sourced |
|--------|-----|---------------------|
| [Source name] | [Full URL] | [List what data came from this source] |
| [Source name] | [Full URL] | [List what data came from this source] |

**Source Quality Notes:**
- Primary sources (company website, press releases, filings): HIGH confidence
- News articles (reputable outlets): MEDIUM-HIGH confidence
- Industry reports: MEDIUM confidence
- LinkedIn/social: MEDIUM confidence (verify independently)
- Estimates/inferences: LOW confidence (must flag)

---
*Research conducted using public sources. All data points include source citations for verification. Critical information should be independently verified before engagement.*
```

## Research Priorities

When time/resources are limited, prioritize in this order:

1. **Ownership** - Who owns it? This determines everything.
2. **Owner profile** - Age, tenure, family situation → Calculate Succession Score
3. **Size** - Revenue/employees (is it in the sweet spot?)
4. **Buyer landscape** - Who's acquiring in this space? (Strategic + PE)
5. **Recent news** - Any transaction triggers?
6. **Deal comps** - What have similar companies sold for?
7. **Competitive context** - Industry consolidation trends
8. **Connection paths** - How can we get introduced?

## Confidence Scoring

| Level | Criteria |
|-------|----------|
| **High** | Multiple corroborating sources, recent data, official filings |
| **Medium** | Single reliable source, or data 1-2 years old |
| **Low** | Estimated/inferred, conflicting sources, or data 3+ years old |
| **Unknown** | No data found |

## Atlantic Canada Context

Key regional factors to consider:
- Smaller market = relationships matter more
- Many businesses are family-held across generations
- "Inner circle" of advisors influences decisions
- Seasonal industries (fishing, tourism) have different cycles
- Government/university connections often relevant
- Strong regional identity (Maritimer vs. "come from away")

## Example Usage

**User:** Research Clearwater Seafoods in Halifax

**Assistant:** I'll research Clearwater Seafoods using the atlantic-company-enricher skill.

[Conducts systematic research]

[Outputs structured profile using template]

[Identifies that Clearwater was acquired by Premium Brands + Mi'kmaq coalition in 2021 for $1B, so no longer a target - but demonstrates methodology]

## Supabase Integration

After generating the markdown profile, save structured data to Supabase for querying and dashboard display.

### Database Schema

The Supabase database (`vuuoukfcbucgsqnnsaii`) has these tables:
- `companies` - Core company data with succession scores
- `key_people` - Executives and owners
- `research_sources` - All sources with URLs
- `potential_acquirers` - Strategic and PE buyers
- `user_feedback` - Ken's scoring (accuracy, novelty, actionability)

### How to Save Data

Use the `morrison_park` MCP tools to insert data:

1. **Insert company** using `execute_sql`:
```sql
INSERT INTO companies (
  name, legal_name, location, province, industry, founded_year, website,
  ownership_type, revenue_estimate, employee_count,
  score_owner_age, score_tenure, score_nextgen_clarity,
  score_legacy_signals, score_activity_trajectory,
  confidence, markdown_content
) VALUES (
  'Company Name',
  'Legal Name',
  'City, Province',
  'NS',  -- Must be NS, NB, PEI, or NL
  'Industry Description',
  2000,  -- Founded year
  'company.com',
  'founder-owned',  -- founder-owned, family-held, employee-owned, pe-backed, public, other
  100,  -- Revenue in millions
  500,  -- Employee count
  4,    -- Owner age score (1-5)
  5,    -- Tenure score (1-5)
  3,    -- Next-gen clarity score (1-5)
  4,    -- Legacy signals score (1-5)
  2,    -- Activity trajectory score (1-5)
  'high',  -- high, medium, low
  '# Full markdown content...'
) RETURNING id;
```

2. **Insert key people** (for each person):
```sql
INSERT INTO key_people (
  company_id, name, title, role, ownership_percentage,
  age_estimate, tenure_years, notes, source_url
) VALUES (
  '[company_id from step 1]',
  'Person Name',
  'CEO',
  'owner',  -- owner, executive, board, other
  100,
  65,
  20,
  'Key insight about this person',
  'https://source.url'  -- REQUIRED
);
```

3. **Insert research sources** (for each source):
```sql
INSERT INTO research_sources (
  company_id, source_name, source_url, source_type,
  data_points, confidence
) VALUES (
  '[company_id]',
  'Source Name',
  'https://full-url.com',
  'company_website',  -- company_website, press_release, news, linkedin, industry_report, government_filing, other
  ARRAY['data point 1', 'data point 2'],
  'high'  -- high, medium-high, medium, low
);
```

4. **Insert potential acquirers** (if identified):
```sql
INSERT INTO potential_acquirers (
  company_id, acquirer_name, acquirer_type,
  rationale, recent_deals, source_url
) VALUES (
  '[company_id]',
  'Acquirer Name',
  'strategic',  -- strategic, pe, family_office
  'Why they would acquire',
  'Recent deal details',
  'https://source.url'  -- REQUIRED
);
```

### Succession Score Mapping

Map your Succession Scorecard to database columns:
- `score_owner_age`: 1 (<55), 2 (55-60), 3 (60-65), 4 (65-72), 5 (>72)
- `score_tenure`: 1 (<10yr), 2 (10-15yr), 3 (15-25yr), 4 (25-35yr), 5 (>35yr)
- `score_nextgen_clarity`: 1 (clear successor), 3 (unclear), 5 (no successor)
- `score_legacy_signals`: 1 (none), 3 (some), 5 (strong)
- `score_activity_trajectory`: 1 (active M&A), 3 (steady), 5 (slowing)

The `succession_composite` (sum) and `succession_readiness` (Low/Medium/High/Very High) are auto-calculated.

### Verification

After inserting, verify the data appears in the dashboard:
- Dashboard URL: https://mpa-deal-intelligence.netlify.app/
- Or query: `SELECT * FROM company_dashboard_view ORDER BY created_at DESC LIMIT 1;`

### Important Notes

- **Every person, source, and acquirer MUST have a `source_url`** - this is enforced by the schema
- Continue generating markdown files for human review
- Supabase storage enables filtering, searching, and POC metrics tracking
- The dashboard will automatically show the new company after insertion
