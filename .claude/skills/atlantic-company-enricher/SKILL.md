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

3. **Synthesize into structured profile**
   - Use the output template below
   - Flag confidence levels for uncertain data
   - Note gaps (what couldn't be found)

4. **Identify deal hypotheses**
   - Based on findings, suggest why this company might need advisory services
   - Flag any red flags or disqualifiers

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
- [Date]: [Event]
- [Date]: [Event]

## Succession Signals
| Signal | Present? | Evidence |
|--------|----------|----------|
| Owner age 55+ | | |
| Long tenure (15+ years) | | |
| No obvious successor | | |
| Recent health/life event | | |
| Slowing growth/investment | | |
| Key person departures | | |
| Estate/wealth planning activity | | |

**Succession Risk Assessment:** [High/Medium/Low/Unknown]

## Deal Readiness Indicators
| Factor | Assessment | Notes |
|--------|------------|-------|
| Financial health | | |
| Market position | | |
| Management depth | | |
| Clean ownership | | |
| Industry dynamics | | |

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

---
*Research conducted using public sources. Verify critical data points before engagement.*
```

## Research Priorities

When time/resources are limited, prioritize in this order:

1. **Ownership** - Who owns it? This determines everything.
2. **Owner profile** - Age, tenure, family situation
3. **Size** - Revenue/employees (is it in the sweet spot?)
4. **Recent news** - Any transaction triggers?
5. **Competitive context** - Industry consolidation?

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
