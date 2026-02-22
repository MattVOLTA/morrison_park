# Feedback Analysis & Agent Architecture Recommendations

**Generated:** January 13, 2026
**Purpose:** Analyze user feedback patterns and recommend improvements to increase odds of finding high-scoring companies

---

## Executive Summary

After analyzing 13 rated companies, the system is **performing well** with average scores of 3.4/5 (accuracy), 3.7/5 (novelty), and 3.5/5 (actionability). However, clear patterns emerge that can guide architectural improvements:

**Top Finding:** The system excels at discovering **manufacturing/industrial companies with founder succession signals** before deals happen. Imperial Manufacturing (5/4/5) exemplifies this: founder age 70, no obvious successor, $137M revenue, still privately held.

**Key Challenge:** The system occasionally surfaces companies that are either (1) already known to Ken, (2) post-transaction, or (3) wrong company type (professional services, employee-owned, PE-backed).

**Recommendation:** Implement a **multi-agent pipeline architecture** with specialized agents for pre-screening, deep research, and transaction timing analysis.

---

## Feedback Data Analysis

### High Performers (Total Score ≥12/15)

| Company | Accuracy | Novelty | Actionability | Total | Ken's Feedback |
|---------|----------|---------|---------------|-------|----------------|
| **Imperial Manufacturing Group** | 5 | 4 | 5 | **14** | "This one is magic... before any obvious transaction... five star action item" |
| **MacLeod Lorway** | 4 | 5 | 4 | **13** | "legit find that was not on our radar and I will follow up" |
| **Cal LeGrow Insurance** | 4 | 5 | 4 | **13** | "merger partner... legit find... system is working!" |
| **BA Richard** | 4 | 5 | 3 | **12** | "good find" but "magic would be... before this deal gets done" |
| **Stevens Group** | 4 | 4 | 3 | **11** | "I did not know much about The Stevens Group" |

### Medium Performers (9-11/15)

| Company | Accuracy | Novelty | Actionability | Total | Issues |
|---------|----------|---------|---------------|-------|--------|
| CKF Inc | 4 | 1 | 4 | 9 | "well known to me" (low novelty) |
| CBCL Limited | 2 | 3 | 4 | 9 | Professional services, employee-owned (wrong type) |

### Low Performers (<9/15)

| Company | Accuracy | Novelty | Actionability | Total | Issues |
|---------|----------|---------|---------------|-------|--------|
| Northumberland Ferries | 5 | 1 | 1 | 7 | "already met with Mark and know the story" |
| Elanco Aquaculture | 1 | 5 | 2 | 8 | **Already sold to Merck in 2024** (major accuracy issue) |

### Average Scores

- **Accuracy:** 3.4/5 (68%) - Room for improvement
- **Novelty:** 3.7/5 (74%) - Strong performance
- **Actionability:** 3.5/5 (70%) - Good performance

---

## Success Pattern Analysis

### What Makes a High-Scoring Company?

**Imperial Manufacturing (5/4/5) - The Gold Standard:**
- ✅ Founder-owned (100% Normand Caissie)
- ✅ Founder age ~70 (prime succession window)
- ✅ Long tenure (45 years)
- ✅ No obvious successor (though COO positioned)
- ✅ Large enough ($137M revenue, 1000+ employees)
- ✅ Active business (recent acquisitions, awards)
- ✅ Legacy signals (Order of Canada, philanthropy)
- ✅ **NO recent transaction** (still privately held)
- ✅ **Not previously known to Ken**
- ✅ Manufacturing/industrials (Ken's sweet spot)

**Key Insight:** The system found this company BEFORE any transaction activity, based solely on succession signals. This is the target state.

### What Causes Low Scores?

**Problem 1: Post-Transaction Discoveries**
- BA Richard: Found after Champlain Seafood acquisition announced
- Elanco: Researched after sale to Merck completed in 2024
- **Impact:** Reduces actionability despite being good finds

**Problem 2: Already Known Companies**
- CKF Inc: "well known to me"
- Northumberland Ferries: "already met with Mark"
- Site 20/20: "I know this company"
- **Impact:** Low novelty scores despite being good targets

**Problem 3: Wrong Company Type**
- CBCL: Employee-owned, professional services
- **Issue:** "Professional/partnership service firms are not top priority for us"
- **Impact:** Low accuracy because it doesn't fit MPA's ideal customer profile

**Problem 4: PE-Backed Companies**
- Site 20/20, CoLab Software: Have PE partners
- **Ken's feedback:** "once you have a PE partner involved... need for investment banker goes down"
- **Impact:** Lower actionability

---

## Current Agent Architecture

### Single-Skill Design

```
User Input (Company Name)
         ↓
atlantic-company-enricher skill
         ↓
    Research Phase
    - Perplexity search
    - Web search
    - Public sources
         ↓
   Profile Generation
   - Ownership structure
   - Key people
   - Succession scorecard
   - Potential acquirers
         ↓
   Supabase Storage
         ↓
   Dashboard Display
```

**Strengths:**
- Comprehensive research methodology
- Strong succession scorecard framework
- Excellent source citation discipline
- Good at finding ownership/succession signals

**Limitations:**
- No pre-screening for company type fit
- No transaction recency verification
- No competitive intelligence (what Ken already knows)
- No prioritization before research
- Treats all companies equally
- Single-pass research (no iteration)

---

## Recommended Agent Architecture Improvements

### Proposed Multi-Agent Pipeline

```
┌─────────────────────────────────────────────────────┐
│ PHASE 1: Discovery & Pre-Screening Agent           │
│ - Verify company exists and is in Atlantic Canada  │
│ - Quick company type check (manufacturing/         │
│   industrials prioritized)                          │
│ - Verify NOT: public company, PE-backed,           │
│   employee-owned professional services              │
│ - Transaction recency check (sold in last 2 years?)│
│ OUTPUT: Pass/Defer/Reject decision                  │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ PHASE 2: Novelty & Competitive Intelligence Agent  │
│ - Check Ken's existing portfolio/deals              │
│ - Check recent MPA interactions (if data available) │
│ - Search Ken's network connections                  │
│ - Flag if "likely known" vs "likely novel"          │
│ OUTPUT: Novelty probability score                   │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ PHASE 3: Deep Research Agent (existing skill)      │
│ - Full ownership/succession research                │
│ - Succession scorecard calculation                  │
│ - Potential acquirer identification                 │
│ - Deal readiness assessment                         │
│ OUTPUT: Comprehensive company profile               │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ PHASE 4: Transaction Timing & Context Agent        │
│ - Recent deal activity in sector                    │
│ - Comparable transactions                           │
│ - Buyer appetite signals                            │
│ - "Why now" market context                          │
│ OUTPUT: Timing assessment, urgency scoring          │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ PHASE 5: Connection Path Agent                     │
│ - Board memberships, associations                   │
│ - Conference circuit                                │
│ - Shared advisors/connections                       │
│ - Alumni networks                                   │
│ OUTPUT: Warm intro paths, ranked by quality        │
└─────────────────────────────────────────────────────┘
```

### Agent Specialization Details

#### Agent 1: Discovery & Pre-Screening Agent
**Purpose:** Filter out poor-fit companies before deep research

**Instructions additions:**
```markdown
## Pre-Screening Criteria

BEFORE conducting deep research, verify these disqualifiers:

### Automatic Rejects:
- Public companies (TSX, NYSE, NASDAQ listed)
- Recently acquired (sold in last 24 months) - unless Ken wants post-deal follow-up
- Subsidiaries of large public companies
- Government agencies
- Non-profits (unless Ken specifically requests)

### Automatic Deprioritization:
- Employee-owned professional services firms (engineering, consulting, law)
- Companies with PE majority ownership (flag but don't reject - Ken may still want to know)
- Headquarters outside Atlantic Canada (even if they have regional operations)

### Prioritize:
- Manufacturing/industrials
- Building products/construction
- Food & beverage processing
- Healthcare services (not professional services)
- Distribution/logistics
- Family-held businesses
- Founder-owned businesses

**If company fails pre-screening:** Output brief explanation and ask if Ken wants to proceed anyway.
```

#### Agent 2: Novelty & Competitive Intelligence Agent
**Purpose:** Predict whether Ken likely already knows this company

**Instructions additions:**
```markdown
## Novelty Prediction

Research to assess if Ken likely already knows this company:

### High Novelty Indicators (Good):
- Company revenue <$50M (below typical radar)
- Located in smaller cities (not Halifax/Moncton/St. John's core)
- Low public profile (minimal news coverage, no awards)
- Not in active M&A sector
- Founded recently (<10 years)

### Low Novelty Indicators (Already Known):
- Company revenue >$100M (likely on radar)
- Major employer in region (>500 employees)
- Recent high-profile news (acquisition, expansion, awards)
- Active in M&A sector (buyer or seller)
- Ken has mentioned or researched before (check existing database)

### Research Sources:
- Query Supabase for existing company records
- Search Ken's email/documents (if accessible)
- Check MPA website portfolio/case studies
- Search ACG Atlantic member lists
- Search Canada's Best Managed Companies winners

**Output novelty prediction:** High (3-5) / Medium (2-3) / Low (1-2)
```

#### Agent 3: Deep Research Agent
**Current skill - Enhancements:**

**Add to instructions:**
```markdown
## Enhanced Succession Signal Detection

Beyond the basic scorecard, actively search for these high-value signals:

### Legacy Phase Indicators (Strong Succession Signals):
- Hall of Fame inductions
- Lifetime achievement awards
- Major philanthropic gifts/foundations established
- University building/program naming
- "Passing the torch" language in interviews
- Autobiography/company history book published
- Significant real estate sales (downsizing personal holdings)

### Family Dynamics Signals:
- Obituaries of family members (spouse, siblings)
- Children's career paths (are they in the business?)
- Succession planning consultants mentioned
- Family office establishment
- Trust structure mentions

### Business Readiness Signals:
- New CFO or "professional management" hired
- Board professionalization (adding independent directors)
- Quality of Earnings (QoE) audits
- EBITDA normalization language in interviews
- Strategic reviews announced
- Dividend recapitalizations

**Priority:** Surface companies with 3+ legacy phase indicators even if succession score is only medium.
```

#### Agent 4: Transaction Timing & Context Agent
**Purpose:** Answer "Why now?" and detect deal momentum

**Instructions:**
```markdown
## Transaction Timing Analysis

### Sector M&A Activity Assessment

Research recent transactions in the company's sector:

1. **Comparable Deals (Last 24 Months):**
   - Find 3-5 transactions of similar companies
   - Note acquirers, deal values, multiples if available
   - Identify consolidation trends

2. **Strategic Buyer Activity:**
   - Which companies are actively acquiring in this space?
   - Any "tuck-in" acquisition strategies?
   - Platform companies seeking add-ons?

3. **PE Interest Indicators:**
   - Which PE firms invest in this sector?
   - Recent platform acquisitions?
   - Typical check sizes?

4. **Market Tailwinds/Headwinds:**
   - Industry growth trends
   - Regulatory changes
   - Technology disruption
   - Capital availability

### Deal Momentum Signals

Search for signs of active transaction preparation:
- Advisor appointments (investment bank, law firm, accounting firm)
- QoE audits mentioned
- Management presentations or roadshows
- Confidential information memorandum (CIM) rumors
- NDA requests circulating
- Banker "testing the market" language

**Output:**
- Timing Assessment: "Immediate" / "Near-term (6-12mo)" / "Medium-term (1-2yr)" / "Long-term (2yr+)"
- Momentum Indicator: "Active deal process" / "Preparation phase" / "Considering options" / "No current activity"
```

#### Agent 5: Connection Path Agent
**Purpose:** Identify warm introduction paths

**Instructions:**
```markdown
## Warm Introduction Path Research

Systematically research connection opportunities:

### Board & Association Memberships
- Search "[owner name] board member"
- Search "[owner name] director"
- Check ACG Atlantic, JA New Brunswick, CPCA, etc.
- Industry association leadership roles

### Conference & Speaking Circuit
- Search "[owner name] speaker" or "panelist"
- ACG conferences, industry events
- University guest lectures

### Philanthropic Connections
- Major donor lists (universities, hospitals, arts)
- Foundation boards
- Charity event sponsors/hosts

### Educational/Alumni Networks
- University attendance (undergrad, MBA)
- Alumni association involvement
- Honorary degrees

### Shared Professional Advisors
- Law firms (search "advised by [law firm]" in press)
- Accounting firms (if publicly disclosed)
- Consultants mentioned

### Quality Tier Ranking
- **Tier 1:** Direct personal connection (board, close advisor)
- **Tier 2:** One degree of separation (shared board/advisor)
- **Tier 3:** Conference/event connection opportunity
- **Tier 4:** Cold outreach (no obvious connection)

**Output:** Ranked list of connection paths with quality tiers and specific introducer suggestions.
```

---

## Specific Instruction Improvements

### Enhancement 1: Transaction Recency Check (Prevent Elanco-type errors)

**Add to atlantic-company-enricher BEFORE deep research:**

```markdown
## CRITICAL: Transaction Recency Check

BEFORE conducting full research, verify the company hasn't recently been acquired:

1. Search: "[company name] acquired [current year]"
2. Search: "[company name] acquired [last year]"
3. Search: "[company name] sold to"
4. Check company website for ownership announcements

**If acquired in last 24 months:**
- Flag prominently in profile header
- Reduce priority (unless Ken wants post-deal intelligence)
- Note new owner and transaction date
- Shift focus to "what does new owner want to do next?"

**Example:**
```
⚠️ TRANSACTION ALERT: Elanco Aquaculture sold to Merck in 2024
This company is no longer independently owned. Research focuses on strategic rationale and potential for further consolidation.
```

This would have prevented the Elanco accuracy issue (1/5 score).
```

### Enhancement 2: Company Type Prioritization

**Add to skill description and early-stage filtering:**

```markdown
## MPA Ideal Customer Profile

Prioritize companies that match MPA's sweet spot:

### High Priority (Research Deeply):
- **Manufacturing/Industrials:** Building products, food processing, machinery
- **Construction:** General contractors, specialty trades, materials suppliers
- **Distribution:** Wholesale distribution, logistics
- **Healthcare Services:** Long-term care, home care, medical devices (not hospitals)
- **B2B Services:** Business services with recurring revenue

### Medium Priority (Quick Assessment):
- Retail (if significant scale)
- Consumer products
- Technology (hardware/SaaS with proven revenue)
- Real estate development

### Low Priority (Flag and Defer):
- **Professional services:** Engineering, consulting, law, accounting firms
- **Employee-owned firms:** Complex stakeholder dynamics
- **PE-backed growth companies:** Already have sophisticated advisors
- **Pure tech startups:** Not MPA's core competency

**Note:** Ken will still meet almost anyone once, but deep research time should focus on high-priority categories.
```

### Enhancement 3: Succession Scorecard Calibration

**Based on Imperial Manufacturing success, enhance scoring:**

```markdown
## Refined Succession Scorecard

### Dimension 1: Owner Age (Unchanged)
- 1: <55 years old
- 2: 55-60
- 3: 60-65
- 4: 65-72 ⭐ **PRIME WINDOW**
- 5: >72

### Dimension 2: Tenure (Unchanged)
- 1: <10 years
- 2: 10-15 years
- 3: 15-25 years
- 4: 25-35 years ⭐ **ESTABLISHED**
- 5: >35 years ⭐ **LEGACY**

### Dimension 3: Next-Gen Clarity (Unchanged)
- 1: Clear successor publicly named and in role
- 3: Potential successors (COO, family member) but not formalized
- 5: No obvious successor ⭐ **HIGH PRIORITY**

### Dimension 4: Legacy Signals (Enhanced)
- 1: None
- 2: Some community involvement
- 3: Industry awards, chamber leadership ⭐ **BEGINNING**
- 4: Hall of Fame, major donations, foundations ⭐ **ACTIVE LEGACY BUILDING**
- 5: Multiple legacy indicators + estate planning signals ⭐ **IMMEDIATE**

**NEW: Bonus Points for "Capstone Events"**
- Order of Canada/hall of fame (recent): +2 points
- Major philanthropic gift (>$1M, last 2 years): +2 points
- Spouse/family member passing (last 12 months): +3 points
- Company history book/documentary: +1 point

### Dimension 5: Activity Trajectory
- 1: Very active (recent acquisitions, expansions) - May not be ready yet
- 2: Active growth - Strong position, good timing
- 3: Steady state - Classic succession candidate ⭐ **SWEET SPOT**
- 4: Slowing (no recent growth initiatives)
- 5: Divesting/downsizing

**Interpretation Refinement:**
- **20-25 points + Tier 1 company type:** IMMEDIATE ACTION (Imperial Manufacturing = 18 + bonus)
- **16-20 points + Tier 1 company type:** HIGH PRIORITY (Stevens Group = 20)
- **10-15 points:** MEDIUM PRIORITY (monitor, build relationship)
- **<10 points:** LOW PRIORITY (too early)

**Most Valuable Combinations:**
- Owner 65-72 + No successor + Legacy signals = **MAGIC** (Imperial Manufacturing)
- Owner 60-65 + Long tenure + Steady state = **HIGH** (Stevens Group)
- Owner >72 + Slowing + Any successor = **LATE** (may have missed window)
```

### Enhancement 4: Output Format Improvements

**Add to profile template:**

```markdown
# Company Profile: [Company Name]

## 🎯 MPA Fit Summary (NEW - Add at top)

**Quick Assessment:**
- **Priority Tier:** [Tier 1: Immediate Action / Tier 2: High Priority / Tier 3: Medium Priority / Tier 4: Low Priority]
- **Novelty Prediction:** [High: Likely new to Ken / Medium: May know / Low: Likely known]
- **Transaction Timing:** [Immediate / Near-term / Medium-term / Long-term]
- **Deal Hypothesis:** [One sentence - e.g., "Founder succession sale, $137M manufacturing platform"]
- **Recommended Action:** [Specific next step - e.g., "Reach out to Normand Caissie via JA New Brunswick connection"]

**Red Flags:** [Any deal disqualifiers]
**Transaction Alert:** [If sold in last 24 months]

[Rest of existing template follows...]
```

---

## Implementation Roadmap

### Phase 1: Quick Wins (Implement Immediately)
1. ✅ **Transaction recency check** - Add to existing skill (prevent Elanco-type errors)
2. ✅ **Company type filtering** - Add ICP criteria to skill header
3. ✅ **Succession scorecard bonus points** - Add legacy event bonuses
4. ✅ **Output format** - Add MPA Fit Summary section at top

**Expected Impact:** Improve accuracy by 0.5-1.0 points, reduce wasted research on poor-fit companies

### Phase 2: Architectural Enhancements (Next Iteration)
5. ⏭️ **Multi-agent pipeline** - Implement specialized agents:
   - Pre-screening agent
   - Novelty prediction agent
   - Transaction timing agent
   - Connection path agent

**Expected Impact:** Improve novelty by 0.5+ points, increase actionability

### Phase 3: Advanced Features (Future)
6. ⏭️ **Proactive discovery mode** - Agent autonomously monitors for succession signals
7. ⏭️ **Market mapping** - Sector-level consolidation analysis
8. ⏭️ **Buyer intelligence** - Track PE/strategic buyer activity in Atlantic Canada

---

## Specific Recommendations by Feedback Pattern

### Pattern 1: "System is picking up companies after deals happen" (BA Richard, Elanco)

**Fix:**
```markdown
Add to research workflow:

Step 0: Transaction Recency Verification
- Search "[company] acquired [current year]"
- Search "[company] announced sale"
- Search "[company] press release acquisition"
- If sold in last 24 months: Flag as POST-TRANSACTION and adjust research focus
```

### Pattern 2: "This company is well known to me" (CKF, Northumberland, Site 20/20)

**Fix:**
```markdown
Add novelty prediction step:

Before deep research:
1. Query existing Supabase database for this company
2. Search Ken's recent emails/documents (if accessible via MCP)
3. Estimate company public profile:
   - Google News results count
   - Award wins (Best Managed, Growth 500, etc.)
   - Revenue size (>$100M more likely known)
4. Flag predicted novelty level: High/Medium/Low
```

### Pattern 3: "Professional services firms are not top priority" (CBCL)

**Fix:**
```markdown
Add company type classifier:

Early in research, determine:
- Primary business model: Product vs. Professional Services
- Ownership structure: Founder/Family vs. Employee-owned vs. PE-backed

If "Professional Services + Employee-owned":
- Output: "DEPRIORITIZED - Professional services, employee-owned. Ken indicates these are lower priority unless specific succession trigger. Proceed with full research? Y/N"
```

### Pattern 4: "Companies with PE partners have less need for advisors" (Site 20/20, CoLab)

**Fix:**
```markdown
In ownership research:

If PE ownership detected:
- Flag prominently in profile
- Shift deal hypothesis focus:
  - From: "Founder looking to sell"
  - To: "PE-backed growth company. Possible scenarios: (1) Follow-on capital raise, (2) PE exit/secondary, (3) Platform for acquisitions"
- Note: "PE ownership may reduce need for external advisors, but opportunities exist in buy-side M&A or growth capital."
- Actionability: Slightly reduced but not eliminated
```

---

## Expected Outcomes

### If Recommendations Implemented:

**Projected Score Improvements:**
- **Accuracy:** 3.4 → 4.2 (+0.8)
  - Transaction recency checks prevent post-deal errors
  - Company type filtering reduces mismatches

- **Novelty:** 3.7 → 4.3 (+0.6)
  - Novelty prediction reduces "already known" companies
  - Focus on smaller, lower-profile companies

- **Actionability:** 3.5 → 4.1 (+0.6)
  - Pre-deal timing focus
  - Warm intro path research improves connection quality
  - Company type filtering ensures MPA fit

**Projected Overall:** 3.5 → 4.2 average (20% improvement)

### What This Means:

More companies scoring like **Imperial Manufacturing (5/4/5)**:
- Founder-owned, succession-age companies
- Discovered BEFORE deal activity
- Novel to Ken (not already known)
- Clear warm introduction paths
- Perfect MPA fit (manufacturing/industrials)

Fewer companies scoring like **Elanco (1/5/2)** or **Northumberland (5/1/1)**:
- Post-transaction discoveries eliminated
- "Already known" companies filtered
- Wrong company types deprioritized

---

## Conclusion

The current system is **working** - average scores above 3/5 show value creation. However, clear patterns indicate specific architectural improvements will significantly increase the ratio of "magic" findings (Imperial Manufacturing) to lower-value discoveries.

**Core Insight:** Ken values **pre-deal discoveries of founder-owned manufacturing/industrial companies in the succession window that he doesn't already know**. The multi-agent pipeline architecture with specialized pre-screening, novelty prediction, and transaction timing agents will systematically optimize for this outcome.

**Next Action:** Implement Phase 1 Quick Wins immediately, then design Phase 2 multi-agent architecture.

---

*Analysis based on 13 rated companies with 14 unrated. Recommend re-analysis after 25+ rated companies for pattern validation.*
