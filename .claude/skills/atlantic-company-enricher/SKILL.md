---
name: atlantic-company-enricher
description: "Researches Atlantic Canada companies for meeting prep and M&A intelligence. Use when asked to research, enrich, or profile a company in Nova Scotia, New Brunswick, PEI, or Newfoundland. Outputs structured profiles optimized for Ken's meeting preparation (sections 1-4) and deal qualification (sections 5-7)."
---

# Atlantic Canada Company Enricher

## Purpose
Produce comprehensive company intelligence profiles for Atlantic Canada mid-market companies, optimized first for **meeting preparation** and second for **M&A origination and deal qualification**. Surfaces information that manual internet/LinkedIn searches miss.

## Output Philosophy

Each profile serves Ken in two modes:

1. **Meeting prep mode** — Sections 1-4 (Executive Summary through Size & Market Position) give Ken everything he needs to walk into a first meeting informed. He should never start from zero. These sections answer: What does this company do? Who runs it? What markets do they serve? Who are their major customers?

2. **Deal qualification mode** — Sections 5-7 (Ownership & Succession through MPA Opportunity Assessment) layer on the M&A intelligence. These sections answer: Is there a succession opportunity? Who would buy this company? What's the timing?

When Ken asks for a "one-pager", sections 1-4 are the priority. When researching for pipeline development, the full profile is generated.

## When to Use
- User asks to "research [company name]" in Atlantic Canada
- User asks to "enrich" or "profile" a company
- User asks about ownership, succession, or deal readiness for a regional company
- User provides a list of companies to research
- User asks for a "one-pager" or meeting prep on a company

## When NOT to Use
- Company is outside Atlantic Canada (NS, NB, PEI, NL)
- User wants general business info (not M&A focused)
- Company is a large public corporation (use standard research)

## Workflow

### Step 1: Confirm company identity
- Verify company name, location, industry
- Ask clarifying questions if ambiguous (multiple companies with same name)

### Step 2: Research systematically (use Perplexity, web search, available tools)

**Research priorities** (front-loads meeting prep):

1. **Company identity & description** — what do they actually do?
2. **Products, markets, customers** — what should Ken ask about?
3. **Key people & board** — who will Ken be meeting?
4. **Company history** — the story Ken should know
5. **Size indicators** — revenue, employees, locations
6. **Competitive position & moats** — what makes them special?
7. **Ownership structure** — who owns it?
8. **Succession signals** — the deal qualification layer (see reference/succession-signals.md)
9. **Buyer landscape** — who's acquiring in this space?
10. **Deal comps & market context** — what have similar companies sold for?
11. **Connection paths** — how can Ken get introduced?

**CRITICAL — SOURCE CITATION REQUIREMENT:**
- **EVERY data point MUST have a source URL**
- No information should be presented without a verifiable source link
- If a source cannot be found for a claim, mark it as "Unverified" or omit it
- Users MUST be able to click through to verify any information
- This is non-negotiable for M&A deal intelligence credibility

### Step 2b: LinkedIn Intelligence (for each key person)

For each key decision maker, board member, and founder identified in Step 2:

1. **Find their LinkedIn URL**
   - Search Perplexity/web: "[person name] [company name] linkedin"
   - Extract the username/slug from the URL (e.g., `linkedin.com/in/kenskinnermpa` → `kenskinnermpa`)

2. **Pull their LinkedIn profile** via ScrapingDog
   - Retrieve API key from OutworkOS Vault: `get_user_secret('scrapingdog_api_key')`
   - Call: `GET https://api.scrapingdog.com/profile/?api_key={key}&type=profile&id={slug}`
   - Extract: headline, about section, experience history, education
   - Handle 202 (retry in 2-3 min) and 404 (note as unavailable)

3. **Discover their recent LinkedIn posts**
   - Search: `site:linkedin.com/posts/ "{person name}"` via Perplexity
   - Search: `site:linkedin.com/feed/update/ "{person name}"` via Perplexity
   - Collect up to 5 post URLs from the last 6 months

4. **Pull post content** for top 3-5 posts via ScrapingDog
   - Call: `GET https://api.scrapingdog.com/profile/post?api_key={key}&id={post_id}`
   - Extract: post text, reactions count, comment count, date

5. **Synthesize LinkedIn Intelligence**
   - Identify 2-4 recurring themes from their posts (what topics do they care about?)
   - Note their professional narrative (how do they describe themselves?)
   - Generate 2-3 specific conversation starters Ken can use
   - Flag any shared interests/connections with Ken's world (Atlantic Canada business, M&A, investment banking, community involvement)

6. **Save to Supabase**
   - Update `key_people` record with LinkedIn fields:
     - `linkedin_url`, `linkedin_headline`, `linkedin_about`
     - `linkedin_themes` (synthesized themes)
     - `conversation_starters` (2-3 specific angles)
     - `linkedin_scraped_at` (timestamp)

**Error handling:**
- ScrapingDog API unavailable → Profile generates without LinkedIn section, notes "LinkedIn enrichment unavailable"
- Person not on LinkedIn → Notes "LinkedIn: Not found"
- CAPTCHA blocks → Retries with `premium=true`, falls back to "Profile restricted"
- Credit budget exhausted → Stops LinkedIn enrichment, notes in profile

See `reference/linkedin-enrichment.md` for full API details, theme synthesis guidelines, and conversation starter templates.

### Step 3: Synthesize into structured profile
- Use the output template below
- Flag confidence levels for uncertain data
- Note gaps (what couldn't be found)

### Step 4: Identify deal hypotheses
- Based on findings, suggest why this company might need advisory services
- Flag any red flags or disqualifiers

### Step 5: Save to Supabase
- After generating the markdown profile, save structured data to Supabase
- Use the Supabase MCP tools to insert data
- See "Supabase Integration" section below for details

## Source Citation Requirements

- **Every profile MUST include a Research Sources section** with minimum 10 sources
- Sources must be hyperlinked in-line throughout the profile (not just in the master list)
- The Arrow Construction Products profile (#09) is the reference standard for sourcing quality
- If fewer than 10 sources can be found, flag this as a data quality concern in the profile header
- Source confidence tiers:
  - Primary (company website, press releases, filings): HIGH
  - News articles (reputable outlets): MEDIUM-HIGH
  - Industry reports, databases: MEDIUM
  - LinkedIn/social: MEDIUM (verify independently)
  - Estimates/inferences: LOW (must flag explicitly)

## Output Template

```markdown
# Company Profile: [Company Name]

**Generated:** [Date]
**Confidence:** [High/Medium/Low] - based on data availability
**Mode:** [Full Profile / Meeting Prep One-Pager]
**Sources:** [X sources] [⚠️ Below 10-source minimum if applicable]

---

## 1. Executive Summary

[3-4 sentence narrative overview. What does this company do, why does it matter, and what's the headline Ken needs to know before any meeting? Include the core opportunity or angle.]

---

## 2. Company Overview

### 2.1 Basic Information
| Field | Value | Confidence | Source |
|-------|-------|------------|--------|
| Legal Name | | | |
| Location | | | |
| Industry | | | |
| Founded | | | |
| Website | | | |

### 2.2 Company Description

[Narrative description of what this company does. Not a table — a paragraph that Ken can quickly scan to understand the business. What would you tell someone at a cocktail party about this company?]

### 2.3 Products & Services

[What do they sell or deliver? Break down their product/service lines. Include any notable specializations, proprietary technology, or unique offerings.]

- **[Product/Service 1]**: [Description] — [Source](URL)
- **[Product/Service 2]**: [Description] — [Source](URL)
- **[Product/Service 3]**: [Description] — [Source](URL)

### 2.4 Company History

[Key milestones in the company's story. When was it founded? By whom? What are the defining moments? This is the narrative Ken should know — the story behind the business.]

| Year | Milestone | Source |
|------|-----------|--------|
| | | |

---

## 3. People

### 3.1 Key Decision Makers
| Name | Title | Age (est.) | Tenure | LinkedIn | Source |
|------|-------|------------|--------|----------|--------|
| | | | | | |

### 3.2 Board of Directors
| Name | Role | Background | Source |
|------|------|------------|--------|
| | | | |

### 3.3 Management Team
| Name | Title | Notable | Source |
|------|-------|---------|--------|
| | | | |

### 3.4 LinkedIn Intelligence

#### [Person Name] — LinkedIn Insights
- **Headline**: [Their LinkedIn headline]
- **Professional Narrative**: [Summary of their about section and career arc]
- **Recent Themes** (last 6 months):
  - [Theme 1 — e.g., "Workforce development and skilled trades shortage"]
  - [Theme 2 — e.g., "Atlantic Canada economic growth"]
  - [Theme 3 — e.g., "Family business succession"]
- **Conversation Starters for Ken**:
  1. [Specific hook — e.g., "Their Jan post about skilled trades shortage aligns with MPA's manufacturing client base"]
  2. [Specific hook — e.g., "They commented on a Dalhousie alumni event — Ken has Dal connections"]
  3. [Specific hook — e.g., "Shared interest in Atlantic Canada community building"]
- **Notable Recent Posts**:
  - [Date]: [Post summary, engagement metrics] — [Source URL]
  - [Date]: [Post summary, engagement metrics] — [Source URL]
- **Profile**: [Full LinkedIn URL]
- **Data freshness**: Scraped [date]

[Repeat for each key person]

*If LinkedIn enrichment was unavailable, note: "LinkedIn Intelligence: [reason — API unavailable / no LinkedIn profile found / profile restricted]"*

---

## 4. Size & Market Position

### 4.1 Size Indicators
| Metric | Estimate | Confidence | Source |
|--------|----------|------------|--------|
| Revenue | | | |
| Employees | | | |
| Locations | | | |

### 4.2 Markets, Customers & Geography

[What markets do they serve? Where are their customers? What geographies do they cover? This tells Ken what questions to ask in a meeting.]

- **Markets served**: [List]
- **Key geographies**: [List]
- **Customer segments**: [List]

### 4.3 Major Customers & Projects

[Notable customers, contracts, or projects. This gives Ken specific talking points.]

| Customer/Project | Details | Source |
|-----------------|---------|--------|
| | | |

### 4.4 Competitive Position & Moats

[What makes this company defensible? Why can't competitors easily replicate what they do? Market share, brand, IP, relationships, regulatory advantages, etc.]

- **Competitive advantages**: [List]
- **Key competitors**: [List with context]
- **Market position**: [Description]

---

## 5. Ownership & Succession

### 5.1 Ownership Structure
| Owner | Role | Ownership % | Notes | Source |
|-------|------|-------------|-------|--------|
| | | | | |

**Ownership Type:** [Founder-owned / Family-held / PE-backed / Public / Other]

### 5.2 Succession Scorecard

| Dimension | Score (1-5) | Evidence |
|-----------|-------------|----------|
| Owner Age | [1: <55, 2: 55-60, 3: 60-65, 4: 65-72, 5: >72] | |
| Tenure | [1: <10yr, 2: 10-15yr, 3: 15-25yr, 4: 25-35yr, 5: >35yr] | |
| Next-Gen Clarity | [1: Clear successor, 3: Unclear, 5: No successor] | |
| Legacy Signals | [1: None, 3: Some (awards), 5: Strong (philanthropy, foundation)] | |
| Activity Trajectory | [1: Active M&A, 3: Steady, 5: Slowing/divesting] | |

**Composite Score:** [X]/25
**Succession Readiness:** [Low (<10) / Medium (10-15) / High (16-20) / Very High (>20)]
**Assessment:** [Narrative summary]

### 5.3 Succession Signals

[Specific observable signals: retirement-age founder, philanthropy ramp-up, board additions, slowing investment, next-gen involvement or lack thereof. See reference/succession-signals.md.]

---

## 6. Activity & Intelligence

### 6.1 Deal Activity

[M&A activity, capital raises, PE interest, strategic partnerships. Separated from general news to highlight transaction-relevant signals.]

| Date | Activity | Source |
|------|----------|--------|
| | | |

### 6.2 Recent News & Events

| Date | Event | Source |
|------|-------|--------|
| [Date] | [Event description] | [Source name](URL) |

### 6.3 Industry Memberships & Associations

[Chambers, industry groups, boards. These are connection paths for Ken.]

| Organization | Role/Membership | Source |
|-------------|----------------|--------|
| | | |

---

## 7. MPA Opportunity Assessment

### 7.1 MPA Fit Summary

[2-3 sentence assessment: Is this a fit for Morrison Park? Why or why not? What's the angle?]

### 7.2 Deal Readiness Indicators
| Factor | Assessment | Notes |
|--------|------------|-------|
| Financial health | | |
| Market position | | |
| Management depth | | |
| Clean ownership | | |
| Industry dynamics | | |

### 7.3 Deal Hypotheses
Based on this research, potential advisory opportunities:
1. **[Hypothesis]**: [Rationale]
2. **[Hypothesis]**: [Rationale]

### 7.4 Potential Acquirers

**CRITICAL: Every acquirer entry MUST include source URLs for recent deals and rationale.**

#### Strategic Buyers
| Company | Rationale | Recent Relevant Deals | Source |
|---------|-----------|----------------------|--------|
| [Name] | [Why they would acquire] | [Deal name, value, date] | [Source URL] |

#### Financial Buyers (PE)
| Firm | Investment Thesis Fit | Relevant Portfolio Cos | Source |
|------|----------------------|------------------------|--------|
| [Name] | [Why thesis fits] | [Portfolio examples] | [Source URL] |

### 7.5 Comparable Transactions

**CRITICAL: Every transaction MUST include a source URL for deal value/multiple.**

| Date | Target | Acquirer | Deal Value | Multiple | Source |
|------|--------|----------|------------|----------|--------|
| | | | | | |

### 7.6 Market Context ("Why Now")

| Factor | Data Point | Source | Implication |
|--------|------------|--------|-------------|
| Industry Consolidation | [stat] | [Source URL] | [what it means] |
| Owner Demographics | [stat] | [Source URL] | [timing window] |
| Capital Availability | [stat] | [Source URL] | [buyer appetite] |
| Sector Tailwinds | [stat] | [Source URL] | [strategic drivers] |

**Timing Assessment:** [Summary of why now is/isn't a good time for a transaction]

### 7.7 Connection Opportunities

**CRITICAL: Every connection MUST include a verifiable source URL.**

| Connection Type | Detail | Source |
|-----------------|--------|--------|
| Board/Association | [e.g., "JA New Brunswick board member"] | [Source URL] |
| Conference Circuit | [e.g., "Spoke at ACG Atlantic 2024"] | [Source URL] |
| Philanthropy | [e.g., "Major donor to Dalhousie"] | [Source URL] |
| Shared Advisors | [e.g., "Uses McInnes Cooper (per press)"] | [Source URL] |
| University/Alumni | [e.g., "Dalhousie MBA, active alumni"] | [Source URL] |

**Warm Intro Paths:** [Narrative on best connection angles]

### 7.8 Red Flags / Disqualifiers
- [Any concerns that might disqualify this opportunity]

### 7.9 Information Gaps
- [What we couldn't find that would be valuable]

### 7.10 Recommended Next Steps
1. [Specific action]
2. [Specific action]

---

## 8. Research Sources

**CRITICAL: Consolidate ALL sources used in this profile. Every claim must be traceable. Minimum 10 sources required.**

| # | Source | URL | Data Points Sourced |
|---|--------|-----|---------------------|
| 1 | [Source name] | [Full URL] | [List what data came from this source] |
| 2 | [Source name] | [Full URL] | [List what data came from this source] |

**Source Quality Notes:**
- Primary sources (company website, press releases, filings): HIGH confidence
- News articles (reputable outlets): MEDIUM-HIGH confidence
- Industry reports: MEDIUM confidence
- LinkedIn/social: MEDIUM confidence (verify independently)
- Estimates/inferences: LOW confidence (must flag)

---
*Research conducted using public sources. All data points include source citations for verification. Critical information should be independently verified before engagement.*
```

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
- `companies` - Core company data with succession scores and enriched profile fields
- `key_people` - Executives, owners, and board members (with person type)
- `research_sources` - All sources with URLs
- `potential_acquirers` - Strategic and PE buyers
- `user_feedback` - Ken's scoring (accuracy, novelty, actionability)

### How to Save Data

Use the Supabase MCP tools to insert data:

1. **Insert company** using `execute_sql`:
```sql
INSERT INTO companies (
  name, legal_name, location, province, industry, founded_year, website,
  ownership_type, revenue_estimate, employee_count,
  -- Enriched profile fields
  executive_summary, company_description, products_services,
  company_history, markets_customers, major_projects,
  competitive_position, deal_activity, industry_memberships,
  -- Succession scores
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
  -- Enriched profile fields (text)
  'Executive summary narrative...',
  'Company description narrative...',
  'Products and services summary...',
  'Company history milestones...',
  'Markets, customers, geography...',
  'Major projects and contracts...',
  'Competitive position and moats...',
  'Deal activity and M&A signals...',
  'Industry memberships and associations...',
  -- Succession scores
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
  company_id, name, title, role, person_type,
  ownership_percentage, age_estimate, tenure_years,
  linkedin_url, notes, source_url
) VALUES (
  '[company_id from step 1]',
  'Person Name',
  'Chairman',
  'board',  -- owner, executive, board, other
  'board',  -- executive, board, founder, owner
  0,
  65,
  20,
  'https://linkedin.com/in/person',
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
