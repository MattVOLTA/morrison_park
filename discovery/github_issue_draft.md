# GitHub Issue Draft

**Title**: Improve atlantic-company-enricher accuracy through multi-agent architecture and intelligent pre-screening

**Labels**: enhancement, skill-improvement, phase-1

---

## Summary

After analyzing feedback from 13 rated companies, the atlantic-company-enricher skill is performing well (avg 3.4/5 accuracy, 3.7/5 novelty, 3.5/5 actionability) but clear patterns show we can significantly improve by adding intelligent pre-screening and implementing a multi-agent pipeline architecture.

**Goal**: Increase the ratio of "magic" findings like Imperial Manufacturing (5/4/5) and reduce low-value discoveries like post-transaction companies or wrong company types.

**Expected Impact**: Projected 20% improvement across all metrics (accuracy 3.4→4.2, novelty 3.7→4.3, actionability 3.5→4.1)

## ⚠️ CRITICAL: Test-Driven Development Required

**This issue involves skill instruction improvements and architectural changes that will affect future company research outputs. While not traditional code, the validation approach follows TDD principles:**

1. **Test-first approach**: Define success criteria based on feedback patterns before implementing changes
2. **Validation**: Test improved instructions against known companies (Imperial Manufacturing should score 5/4/5, Elanco should be caught by transaction recency check)
3. **Iteration**: Refine instructions based on validation results

### TDD Workflow for This Issue

**Phase 1: Pre-screening Logic (Quick Wins)**
- **RED**: Current skill doesn't detect post-transaction companies (Elanco error: 1/5/2)
- **GREEN**: Add transaction recency check that catches companies sold in last 24 months
- **TEST**: Re-run on Elanco - should flag "TRANSACTION ALERT: Sold to Merck in 2024"
- **REFACTOR**: Optimize search queries for efficiency

**Phase 2: Company Type Filtering**
- **RED**: Current skill treats all companies equally (CBCL professional services: 2/3/4)
- **GREEN**: Add ICP-based prioritization (manufacturing/industrials prioritized over professional services)
- **TEST**: Re-run on CBCL - should output "DEPRIORITIZED - Professional services, employee-owned"
- **REFACTOR**: Ensure filtering logic is clear and maintainable

**Phase 3: Succession Scorecard Enhancement**
- **RED**: Current scorecard doesn't weight "capstone events" (Order of Canada, major philanthropy)
- **GREEN**: Add bonus points for legacy signals (Order of Canada +2, major gift +2, etc.)
- **TEST**: Re-run on Imperial Manufacturing - should score 18 base + 2 bonus = 20 (was 19)
- **REFACTOR**: Document bonus point rationale

### Why This Matters

From `/CLAUDE.md`:
> This is a POC with explicit failure conditions:
> - atlantic-company-enricher: Kill if avg novelty < 2.5 after 5 companies

We're currently at 3.7/5 novelty (well above threshold), but these improvements will systematically optimize for the highest-value outputs.

### Reference

- Skill file: `.claude/skills/atlantic-company-enricher/SKILL.md`
- Feedback analysis: `discovery/feedback_analysis_and_recommendations.md`

## Background: Feedback Analysis

### High-Scoring Companies (What Works)

**Imperial Manufacturing Group (5/4/5 - "This one is magic")**
- ✅ Founder-owned, age ~70 (succession window)
- ✅ $137M revenue manufacturing company
- ✅ Found BEFORE any transaction activity
- ✅ Not previously known to Ken
- ✅ Clear succession signals (Order of Canada, philanthropy)

**Why this scored high**: The system identified a founder in prime succession window (65-72), in Ken's sweet spot industry (manufacturing), with no PE involvement, BEFORE any deal activity. This is the target state.

### Low-Scoring Companies (What Fails)

**Elanco Aquaculture (1/5/2)**
- ❌ Already sold to Merck in 2024
- Issue: System didn't verify transaction recency
- Ken's feedback: "I should know this"

**CBCL Limited (2/3/4)**
- ❌ Employee-owned professional services firm
- Issue: Doesn't fit MPA's ideal customer profile
- Ken's feedback: "Professional/partnership service firms are not top priority for us"

**Northumberland Ferries (5/1/1)**
- ❌ Ken had already met with owner Mark
- Issue: Low novelty despite being good target
- Ken's feedback: "I already met with Mark and know the story"

### Success Pattern: The "Imperial Manufacturing Formula"

High-scoring companies share these characteristics:
1. **Manufacturing/industrial** (not professional services)
2. **Founder-owned** (not PE-backed or employee-owned)
3. **Succession age** (65-72, the "prime window")
4. **Legacy signals** (Order of Canada, major philanthropy, hall of fame)
5. **Pre-deal timing** (still privately held, no recent transaction)
6. **Novel to Ken** (not already in his network)

## Current Architecture Limitations

### Single-Skill Design
```
User Input (Company Name)
         ↓
atlantic-company-enricher skill (treats all companies equally)
         ↓
    Research Phase (no pre-screening)
         ↓
   Profile Generation
         ↓
   Supabase Storage
```

**Problems:**
- No pre-screening for company type fit
- No transaction recency verification (leads to Elanco-type errors)
- No novelty prediction (can't estimate if Ken already knows company)
- Single-pass research (no prioritization)
- Treats professional services same as manufacturing

## Proposed Solution: Phase 1 Quick Wins

Implement these improvements to `.claude/skills/atlantic-company-enricher/SKILL.md` immediately:

### 1. Add Transaction Recency Check

**Location**: Add new section before "Research systematically" in workflow

**Current issue**: System researches companies without verifying if they were recently sold (Elanco was acquired by Merck in 2024 but system didn't catch this).

**Proposed addition**:
```markdown
## CRITICAL: Transaction Recency Check

BEFORE conducting full research, verify the company hasn't recently been acquired:

### Required Searches:
1. Search: "[company name] acquired [current year]"
2. Search: "[company name] acquired [last year]"
3. Search: "[company name] sold to"
4. Check company website ownership section
5. Check LinkedIn company page for ownership changes

### If Acquired in Last 24 Months:
- Add prominent flag to profile header:
  ```
  ⚠️ TRANSACTION ALERT: [Company] sold to [Acquirer] in [Date]
  This company is no longer independently owned.
  ```
- Reduce research priority (unless Ken wants post-deal intelligence)
- Note new owner and transaction date
- Shift research focus to "What does new owner want to do next?"

### Example Output:
```markdown
⚠️ TRANSACTION ALERT: Elanco Aquaculture sold to Merck in 2024
This company is no longer independently owned. Research focuses on Merck's
strategic rationale and potential for further consolidation in PEI aquaculture sector.
```

**Why this matters**: Prevents wasted research on already-transacted companies. Would have caught Elanco error (1/5 accuracy score).
```

### 2. Add Company Type Prioritization

**Location**: Add new section at top of workflow, before company identity confirmation

**Current issue**: System treats employee-owned professional services firms (CBCL) the same as founder-owned manufacturers (Imperial Manufacturing), despite very different MPA fit.

**Proposed addition**:
```markdown
## MPA Ideal Customer Profile - Pre-Screening

Prioritize companies that match MPA's sweet spot before conducting deep research:

### High Priority (Research Deeply):
- **Manufacturing/Industrials**: Building products, food processing, machinery, HVAC
- **Construction**: General contractors, specialty trades, materials suppliers, concrete
- **Distribution**: Wholesale distribution, logistics, supply chain
- **Healthcare Services**: Long-term care, home care, medical devices (NOT hospitals)
- **B2B Services**: Business services with recurring revenue, facilities management

**Key indicators**: Founder-owned, family-held, $50M-$500M revenue, 45+ year tenure

### Medium Priority (Quick Assessment):
- Retail (if >$100M scale)
- Consumer products (branded, regional)
- Technology (hardware/SaaS with proven >$10M revenue)
- Real estate development (commercial/industrial)

### Low Priority (Flag and Defer):
- **Professional services**: Engineering, consulting, law, accounting firms
  - *Rationale*: Usually handle succession internally through partnership structures
  - *Ken's note*: "Professional/partnership service firms are not top priority for us"

- **Employee-owned firms**: Complex stakeholder dynamics, no single decision-maker
  - *Example*: CBCL Limited (2/3/4 score) - "Employee-owned adds complexity"

- **PE-backed growth companies**: Already have sophisticated advisors
  - *Ken's note*: "once you have a PE partner involved... need for investment banker goes down"

- **Pure tech startups**: Not MPA's core competency unless proven revenue

### Pre-Screening Output:
If company is Low Priority, output:
```
⚠️ DEPRIORITIZED: [Company] is [reason - e.g., "employee-owned professional services firm"]

Based on feedback, this company type typically scores lower on MPA fit criteria.
- Professional services firms: Usually handle succession internally
- Employee ownership: Complex stakeholder consensus required

Proceed with full research? [User decision required]
```

**Why this matters**: Focuses research time on high-value targets. Would have flagged CBCL before deep research (saved time, set expectations).
```

### 3. Enhance Succession Scorecard with Bonus Points

**Location**: Modify "Succession Scorecard" section in output template (line ~104-117 in SKILL.md)

**Current issue**: Scorecard doesn't weight "capstone events" like Order of Canada, hall of fame inductions, or major philanthropic gifts - these are strong succession signals but only counted as part of "Legacy Signals" dimension.

**Proposed enhancement**:
```markdown
## Succession Scorecard

### Dimension 1: Owner Age (Unchanged)
- 1: <55 years old
- 2: 55-60
- 3: 60-65
- 4: 65-72 ⭐ **PRIME SUCCESSION WINDOW**
- 5: >72

### Dimension 2: Tenure (Unchanged)
- 1: <10 years
- 2: 10-15 years
- 3: 15-25 years
- 4: 25-35 years ⭐ **ESTABLISHED**
- 5: >35 years ⭐ **LEGACY BUILDER**

### Dimension 3: Next-Gen Clarity (Unchanged)
- 1: Clear successor publicly named and in role
- 3: Potential successors (COO, family member) but not formalized
- 5: No obvious successor ⭐ **HIGH SUCCESSION RISK**

### Dimension 4: Legacy Signals (Enhanced)
- 1: None
- 2: Some community involvement (chamber, rotary)
- 3: Industry awards, chamber leadership ⭐ **BEGINNING LEGACY PHASE**
- 4: Hall of Fame, major donations, family foundation ⭐ **ACTIVE LEGACY BUILDING**
- 5: Multiple legacy indicators + estate planning signals ⭐ **IMMEDIATE TRANSITION LIKELY**

**NEW: Bonus Points for "Capstone Events" (Last 3 Years)**

Add these bonus points to base score when detected:

| Event | Bonus | Rationale |
|-------|-------|-----------|
| Order of Canada / Provincial Order | +2 | Lifetime achievement recognition, often signals legacy completion phase |
| Hall of Fame induction | +2 | Industry capstone, "I've arrived" moment |
| Major philanthropic gift (>$1M) | +2 | Wealth distribution, estate planning activity |
| Family foundation established | +1 | Formalized legacy structure |
| Spouse/co-founder passing | +3 | Major life transition, triggers succession planning |
| Company history book/documentary | +1 | Formal legacy documentation |
| University building/program naming | +2 | Permanent legacy monument |

**Example - Imperial Manufacturing:**
- Base score: Owner Age (4) + Tenure (5) + Next-Gen (3) + Legacy (4) + Activity (2) = 18
- Bonus: Order of Canada (2024) = +2
- **Total: 20 points** → "Very High" succession readiness

### Dimension 5: Activity Trajectory (Refined)
- 1: Very active acquirer (multiple deals in last 2 years) - May not be ready yet, building for sale
- 2: Active growth (recent expansion, one acquisition) - Strong position, good timing ⭐
- 3: Steady state (no major growth initiatives) - Classic succession candidate ⭐ **SWEET SPOT**
- 4: Slowing (no growth in 3+ years, divesting assets)
- 5: Downsizing/restructuring - May have missed optimal window

### Score Interpretation (Revised)

| Score | Readiness | Priority | Action |
|-------|-----------|----------|--------|
| 20-25 + High Priority Industry | **IMMEDIATE** | Tier 1 | Contact within 30 days |
| 16-20 + High Priority Industry | **High** | Tier 1 | Add to pipeline, build relationship |
| 10-15 | **Medium** | Tier 2 | Monitor, network building |
| <10 | **Low** | Tier 3 | Too early, check back in 2-3 years |

**Most Valuable Combinations:**
- Owner 65-72 + No successor + Legacy signals + Bonus points = **MAGIC** ⭐⭐⭐
  - *Example*: Imperial Manufacturing (5/4/5 score)

- Owner 60-65 + Long tenure + Steady state = **HIGH** ⭐⭐
  - *Example*: Stevens Group (4/4/3 score)

- Owner >72 + Slowing + Any successor = **LATE** ⭐
  - May have already transitioned or committed to internal succession

**Composite Score:** [Sum of 5 dimensions + Bonus Points]/25 (max 30 with bonuses)
**Succession Readiness:** [Low (<10) / Medium (10-15) / High (16-20) / Very High (>20)]
**Assessment:** [Narrative summary incorporating bonus point events]
```

**Why this matters**:
- Weights "capstone events" appropriately (Order of Canada, major gifts are strong signals)
- Would have given Imperial Manufacturing proper credit for Order of Canada (2024)
- Helps distinguish "very high" from "high" readiness more accurately

### 4. Add MPA Fit Summary at Top of Profiles

**Location**: Add new section at top of profile template, immediately after company name header

**Current issue**: Ken has to read entire profile to understand if company is worth pursuing. Key assessment should be up front.

**Proposed addition**:
```markdown
# Company Profile: [Company Name]

**Generated:** [Date]
**Confidence:** [High/Medium/Low]

---

## 🎯 MPA Fit Summary

**Quick Assessment:**
- **Priority Tier:** [Tier 1: Immediate Action / Tier 2: High Priority / Tier 3: Medium Priority / Tier 4: Low Priority]
- **Company Type:** [Manufacturing/Industrial / Construction / Professional Services / etc.]
- **Succession Score:** [X]/25 (includes bonus points if applicable)
- **Novelty Estimate:** [High: Likely new to Ken / Medium: May know / Low: Likely known]
- **Transaction Status:** [Active (no recent transaction) / Post-transaction (sold in [date])]
- **Deal Hypothesis:** [One sentence - e.g., "Founder succession sale, $137M manufacturing platform, owner age 70, Order of Canada 2024"]

**Recommended Action:** [Specific next step - e.g., "IMMEDIATE: Reach out to Normand Caissie via JA New Brunswick board connection"]

**Red Flags:** [Any deal disqualifiers - e.g., "PE-backed", "Post-transaction", "Professional services"]

---

[Rest of existing profile follows...]
```

**Example - Imperial Manufacturing:**
```markdown
## 🎯 MPA Fit Summary

**Quick Assessment:**
- **Priority Tier:** Tier 1: Immediate Action ⭐⭐⭐
- **Company Type:** Manufacturing/Industrial (HVAC, Building Products) - MPA sweet spot
- **Succession Score:** 20/25 (includes +2 bonus for Order of Canada 2024)
- **Novelty Estimate:** High - Not previously on MPA radar
- **Transaction Status:** Active (no recent transaction, still founder-owned)
- **Deal Hypothesis:** Founder succession sale opportunity - $137M manufacturing platform, 70-year-old founder with 45-year tenure, no obvious successor despite COO positioning, recent Order of Canada (legacy phase), active acquirer (strong position)

**Recommended Action:** IMMEDIATE - Research warm intro path via JA New Brunswick, Wallace McCain Institute, or Université de Moncton connections. Consider direct outreach given strong succession signals.

**Red Flags:** None - ideal MPA fit across all dimensions
```

**Why this matters**: Ken can make go/no-go decision in first 30 seconds of reading profile. Critical information is surfaced immediately.

## Files to Modify

### Primary File: `.claude/skills/atlantic-company-enricher/SKILL.md`

**Location in repo**: `.claude/skills/atlantic-company-enricher/SKILL.md`

**Specific changes**:

1. **Lines ~23-24** (Before "Research systematically"): Add "Transaction Recency Check" section
2. **Lines ~24-26** (Before "Confirm company identity"): Add "MPA Ideal Customer Profile - Pre-Screening" section
3. **Lines ~104-117** (Succession Scorecard section): Replace with enhanced scorecard including bonus points
4. **Lines ~59-76** (Output Template header): Add "MPA Fit Summary" section after confidence line

**Validation approach**:
- Test enhanced instructions against known companies
- Imperial Manufacturing should produce Tier 1 rating with 20/25 score
- Elanco should trigger "TRANSACTION ALERT"
- CBCL should trigger "DEPRIORITIZED" message

### Supporting Analysis Document (Already Created)

**File**: `discovery/feedback_analysis_and_recommendations.md`

This file contains:
- Complete feedback analysis for 13 rated companies
- Success pattern analysis ("Imperial Manufacturing Formula")
- Failure pattern analysis (what causes low scores)
- Detailed architectural recommendations for Phase 2 (multi-agent pipeline)

## UX / UI Updates

### Dashboard Impact (index.html)

**User-facing changes**: The HTML dashboard (`idea_cards/index.html`) will display enhanced company profiles, but the dashboard UI itself doesn't need modification - it already reads from Supabase and displays markdown content.

**What users will see**:
1. **MPA Fit Summary section** at top of each company profile (visible immediately when selecting company)
2. **Transaction alerts** prominently displayed for post-deal companies (e.g., "⚠️ TRANSACTION ALERT: Sold to Merck in 2024")
3. **Priority tier badges** may be reflected in sidebar company list (future enhancement)
4. **Enhanced succession scores** with bonus points explanation (e.g., "20/25 (includes +2 for Order of Canada)")

**No code changes required** - dashboard already renders markdown from `company_dashboard_view.markdown_content` column.

### User Flow for Ken's Workflow

**Current flow**:
1. Ken provides company name to research
2. System generates profile (all companies treated equally)
3. Ken reads entire profile to assess fit
4. Ken rates company (accuracy/novelty/actionability)

**Improved flow**:
1. Ken provides company name to research
2. **NEW**: System pre-screens for transaction recency and company type fit
3. **NEW**: If low priority, system asks "Proceed with full research?" (saves time)
4. System generates profile with **MPA Fit Summary at top**
5. Ken can make go/no-go decision in 30 seconds (vs. reading full profile)
6. Ken rates company (expected higher scores due to better filtering)

**Loading states**: No changes needed - existing Perplexity/web search already has loading indicators

**Success/error messages**:
- Add success message when transaction recency check catches post-deal company: "✅ Transaction recency check: Caught recent acquisition"
- Add info message when company is deprioritized: "ℹ️ Company type: Professional services (typically lower MPA fit)"

## Proposed Data Model Changes

### Change Type
- [x] No database changes

**Explanation**: This issue involves improvements to the `atlantic-company-enricher` skill instructions only. The skill outputs to Supabase using existing schema:
- `companies` table (already has `succession_composite`, `markdown_content` columns)
- `key_people` table
- `research_sources` table
- `potential_acquirers` table

The enhanced skill will produce better-quality data in these existing tables, but no schema modifications are required.

**Future consideration**: Phase 2 (multi-agent architecture) may benefit from adding:
- `companies.priority_tier` enum column (tier_1, tier_2, tier_3, tier_4)
- `companies.novelty_prediction` enum column (high, medium, low)
- `companies.transaction_alert` text column

But these are not required for Phase 1 quick wins.

## Testing Strategy

### Validation with Known Companies

After implementing changes, re-run enhanced skill on these test cases:

**1. Imperial Manufacturing (Expected: 5/4/5, Tier 1)**
- Should produce "MPA Fit Summary" with Tier 1 rating
- Succession score should be 20/25 (18 base + 2 bonus for Order of Canada)
- Should highlight "⭐ PRIME SUCCESSION WINDOW" markers
- No transaction alert, no deprioritization

**2. Elanco Aquaculture (Expected: Caught by transaction check)**
- Should trigger "⚠️ TRANSACTION ALERT: Sold to Merck in 2024"
- Should flag before deep research begins
- Should shift focus to post-deal intelligence

**3. CBCL Limited (Expected: Deprioritized with explanation)**
- Should trigger "⚠️ DEPRIORITIZED: Employee-owned professional services firm"
- Should prompt "Proceed with full research? Y/N"
- If proceed, should note in MPA Fit Summary: "Red Flags: Professional services, employee-owned"

**4. Stevens Group (Expected: High priority, 20/25 score)**
- Should produce Tier 1 or Tier 2 rating
- Succession score should include bonus for Hall of Fame induction (2025)
- Should note family involvement (multi-generational)

### Success Criteria

Phase 1 is successful if:
- ✅ Transaction recency check catches Elanco before deep research
- ✅ Company type filtering deprioritizes CBCL appropriately
- ✅ Imperial Manufacturing gets 20/25 score (includes Order of Canada bonus)
- ✅ MPA Fit Summary appears at top of all profiles
- ✅ No regression on existing high-scoring companies

### Manual Review

Ken should review enhanced profiles for:
- Are "Tier 1" companies truly immediate action items?
- Do transaction alerts catch all post-deal companies?
- Is deprioritization logic sensible? (not too aggressive)
- Does MPA Fit Summary save time vs. reading full profile?

## Future Work: Phase 2 (Multi-Agent Architecture)

Phase 1 focuses on quick wins. Phase 2 (separate issue) will implement a multi-agent pipeline:

**Proposed agents**:
1. **Pre-screening Agent** - Automatic filtering before research
2. **Novelty Prediction Agent** - Estimates if Ken already knows company (queries existing DB, checks public profile)
3. **Deep Research Agent** - Enhanced current skill
4. **Transaction Timing Agent** - Sector M&A activity, comparable deals, "why now" analysis
5. **Connection Path Agent** - Warm intro research (board memberships, alumni networks, advisors)

**Expected Phase 2 impact**: Additional 10-15% improvement in scores by systematically optimizing for novelty and actionability.

See `discovery/feedback_analysis_and_recommendations.md` for full Phase 2 architectural design.

## Dependencies

- None - skill instruction improvements only
- Existing Perplexity MCP and web search tools are sufficient
- Supabase schema already supports enhanced data (no migrations required)

## Risks and Considerations

### Risk: Over-filtering (Missing Good Opportunities)

**Mitigation**:
- Deprioritization prompts for user decision, doesn't auto-reject
- Ken can override and proceed with full research
- Monitor feedback to see if false negatives emerge

### Risk: Bonus Points Inflation

**Concern**: Bonus points might over-weight capstone events

**Mitigation**:
- Bonus points are substantial but not overwhelming (+2-3 points on 25-point scale)
- Validate against known companies (Imperial Manufacturing should score 20/25, not 25+)
- Ken's feedback will calibrate if scores become inflated

### Risk: Transaction Recency False Positives

**Concern**: Search might flag companies that aren't actually sold (e.g., "Company X looking to acquire others")

**Mitigation**:
- Require multiple confirming signals (press release, LinkedIn update, website change)
- Human verification before flagging as post-transaction
- Ken reviews all profiles anyway (catches errors)

## Acceptance Criteria

- [ ] Transaction recency check added to skill workflow (before deep research)
- [ ] Company type prioritization added (MPA Ideal Customer Profile section)
- [ ] Succession scorecard enhanced with bonus points for capstone events
- [ ] MPA Fit Summary section added to output template (appears at top of profiles)
- [ ] Validation testing completed on 4 test companies (Imperial, Elanco, CBCL, Stevens)
- [ ] No regressions on existing high-scoring companies
- [ ] Ken reviews and approves enhanced profile format
- [ ] Documentation updated in `discovery/feedback_analysis_and_recommendations.md`

## Related Issues

- None yet (this is first architectural improvement to atlantic-company-enricher skill)
- Phase 2 issue (multi-agent pipeline) will reference this issue

## References

- Skill file: `.claude/skills/atlantic-company-enricher/SKILL.md`
- Feedback analysis: `discovery/feedback_analysis_and_recommendations.md`
- Dashboard: `idea_cards/index.html` (reads from Supabase)
- Project context: `CLAUDE.md` (POC kill criteria, Atlantic Canada context)

---

**Implementation Priority**: HIGH - Phase 1 quick wins can be implemented immediately and will have measurable impact on next batch of companies researched.
