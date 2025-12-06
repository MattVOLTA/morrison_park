# Skills-Based POC Approach

## The Idea

Instead of building an application, we build **Claude Code skills** that:
1. Take Ken's data as input
2. Do the research/analysis/synthesis
3. Output "Idea Cards" or other deliverables
4. Let Ken score the value

**Matt stays in the loop** as the orchestrator - running skills, reviewing outputs, refining prompts, and learning the patterns. This creates:
- Fast iteration cycles
- Domain knowledge transfer to Matt
- Cheap failure (delete a skill, not an app)
- Clear signal on what's valuable

---

## Revised Approach (Per Skill Developer Best Practices)

### Key Principles Applied

1. **Challenge every line** - Skills only include what Claude doesn't already know
2. **Build evaluations first** - Create test scenarios BEFORE writing extensive documentation
3. **Progressive disclosure** - Metadata → SKILL.md body → Reference files (one level deep)
4. **Interview-then-execute pattern** - Skills ask clarifying questions before acting
5. **Develop iteratively** - Minimal skill → test with real data → observe → refine
6. **Appropriate degrees of freedom** - High freedom for research, low freedom for output formats

### Development Process

```
1. Define the gap (what does Ken need that Claude doesn't do well?)
2. Create minimal test scenario (one company, real data)
3. Draft minimal SKILL.md (under 500 lines)
4. Test with real usage
5. Observe unexpected behaviors
6. Refine based on observations (not assumptions)
7. Add reference files only if gaps remain
```

---

## Skills Mapped to Assumptions

### Skill 1: atlantic-company-enricher
**Gap:** Claude can research, but doesn't know Ken's specific intelligence needs for Atlantic Canada M&A

**Activation:** When user asks to research an Atlantic Canada company for M&A purposes

**Degree of freedom:** HIGH for research, LOW for output format (structured profile)

**Test scenario first:**
- Input: "Clearwater Seafoods, Halifax NS"
- Expected output: Ownership, key people, succession signals, recent news, deal readiness indicators
- Validation: Ken compares to what his analysts would produce

**Minimal SKILL.md structure:**
```
atlantic-company-enricher/
├── SKILL.md (workflow, output template, Atlantic Canada context)
└── reference/
    └── succession-signals.md (what to look for)
```

**Kill test:** If enrichment doesn't surface anything beyond what analysts already have, public data isn't the unlock.

---

### Skill 2: mpa-qualification-scorer
**Gap:** Claude doesn't know Ken's specific qualification criteria for MPA fit

**Activation:** When user asks to qualify/score a company for MPA

**Degree of freedom:** LOW - must apply Ken's specific criteria consistently

**Test scenario first:**
- Input: 10 companies Ken has already judged (5 good, 5 bad) + his criteria
- Expected output: Scores that match Ken's judgment
- Validation: >70% agreement = criteria successfully codified

**Minimal SKILL.md structure:**
```
mpa-qualification-scorer/
├── SKILL.md (scoring workflow, output format)
└── reference/
    └── qualification-criteria.md (Ken's criteria - TO BE CAPTURED)
```

**Kill test:** If <70% agreement with Ken's judgment, criteria can't be codified this way.

---

### Skill 3: deal-hypothesis-generator
**Gap:** Claude doesn't proactively generate investment banking hypotheses

**Activation:** When user asks to generate deal ideas/opportunities for a company or set of companies

**Degree of freedom:** MEDIUM - structured output, creative hypothesis generation

**Test scenario first:**
- Input: 5 enriched + qualified companies
- Expected output: Idea Cards with hypothesis, evidence, stakeholders, risks, next action
- Validation: Ken rates novelty (1-5) and actionability (1-5)

**Minimal SKILL.md structure:**
```
deal-hypothesis-generator/
├── SKILL.md (hypothesis framework, Idea Card template)
└── reference/
    └── mpa-services.md (what MPA offers - for matching)
```

**Kill test:** If Ken says "I already knew all of this" for every card, no novel value.

---

### Skill 4: meeting-prep-briefer
**Gap:** Claude doesn't know what Ken needs to prepare for M&A conversations

**Activation:** When user asks to prepare for a meeting with an Atlantic Canada company

**Degree of freedom:** LOW for format, MEDIUM for content (research-driven)

**Test scenario first:**
- Input: Company name + attendees + meeting purpose
- Expected output: 1-2 page brief with talking points, deal angles, questions to ask
- Validation: Ken uses it for a real meeting, rates helpfulness

**Minimal SKILL.md structure:**
```
meeting-prep-briefer/
├── SKILL.md (brief template, workflow)
```

**Kill test:** If Ken doesn't use the briefs, wrong format or content.

---

### Skill 5: signal-monitor (Phase 2)
**Gap:** No proactive alerting on company changes

**Defer until:** Skills 1-4 validated. This requires ongoing monitoring, more complex to test.

---

### Skill 6: relationship-path-finder (Phase 2)
**Gap:** No warm intro path identification

**Defer until:** Ken provides network data. Depends on relationship intelligence we don't have yet.

---

## Data Ken Needs to Provide

### For Skill 1 (Enrichment) - Minimum to Start
| Data | Format | Purpose |
|------|--------|---------|
| 3-5 company names | Simple list | Test enrichment quality |
| What he already knows | Notes per company | Baseline comparison |
| What he wants to know | List of questions | Define output requirements |

### For Skill 2 (Qualification) - After Skill 1 Validated
| Data | Format | Purpose |
|------|--------|---------|
| Qualification criteria | Interview transcript or written | Codify into reference file |
| 10 judged companies | List + his verdict (good/bad) | Validation set |

### For Skills 3-4 - After Skill 2 Validated
| Data | Format | Purpose |
|------|--------|---------|
| MPA service offerings | Description of what they do | Match opportunities to services |
| Example meeting brief | What good looks like | Template calibration |

### Phase 2 Data (Defer)
| Data | Consideration |
|------|---------------|
| Relationship map | Skill 6 - only if earlier skills validate |
| CRM export | Only if we need historical context |
| Client names | May need anonymization |

---

## Build Order (Iterative, Per Best Practices)

### Phase 1: Foundation (Weeks 1-2)

**Skill 1: atlantic-company-enricher**
```
Day 1-2: Draft minimal SKILL.md + output template
Day 3:   Test on 1 real company (e.g., Clearwater Seafoods)
Day 4:   Matt reviews output, notes gaps
Day 5:   Refine skill based on observations
Day 6-7: Test on 2-3 more companies
         → Ken reviews → Kill or proceed
```

### Phase 2: Qualification (Week 3)

**Skill 2: mpa-qualification-scorer**
```
Prerequisite: Ken provides qualification criteria (interview)
Day 1:   Capture criteria in reference/qualification-criteria.md
Day 2:   Draft SKILL.md with scoring workflow
Day 3:   Test on 5 companies Ken has already judged
Day 4:   Compare scores to Ken's judgment
         → If <70% match, iterate on criteria capture
         → If ≥70% match, proceed to Skill 3
```

### Phase 3: The "Magic" (Week 4)

**Skill 3: deal-hypothesis-generator**
```
Prerequisite: Skills 1-2 validated
Day 1:   Draft Idea Card template + hypothesis framework
Day 2:   Generate cards for 3 enriched+qualified companies
Day 3:   Ken rates novelty + actionability
         → If all "already knew this" → KILL the core assumption
         → If some novel insights → iterate and expand
```

### Phase 4: Practical Value (Week 5)

**Skill 4: meeting-prep-briefer**
```
Prerequisite: Ken has upcoming Halifax trip
Day 1:   Draft brief template based on Ken's input
Day 2:   Generate brief for 1 real upcoming meeting
Day 3:   Ken uses in actual meeting
Day 4:   Ken provides feedback
         → Iterate based on what was useful/missing
```

---

## Feedback Template (Per Skill Run)

After each skill produces output, Ken answers:

```markdown
## Skill Output Review

**Company:** [name]
**Skill:** [which skill]
**Date:** [date]

### Accuracy (1-5)
[ ] 1 - Mostly wrong
[ ] 2 - Several errors
[ ] 3 - Some errors, mostly right
[ ] 4 - Minor errors only
[ ] 5 - Completely accurate

### Novelty (1-5)
[ ] 1 - Already knew all of this
[ ] 2 - Knew most, one new thing
[ ] 3 - Mix of known and new
[ ] 4 - Mostly new to me
[ ] 5 - Entirely new insights

### Actionability (1-5)
[ ] 1 - Won't do anything with this
[ ] 2 - Might follow up eventually
[ ] 3 - Added to my list
[ ] 4 - Will act on this soon
[ ] 5 - Acting on this immediately

### What was most useful?
[free text]

### What was missing or wrong?
[free text]

### Would you want this for other companies?
[ ] Yes, definitely
[ ] Maybe, with improvements
[ ] No
```

---

## Kill Criteria (Be Ruthless)

| Skill | Kill If |
|-------|---------|
| atlantic-company-enricher | Avg novelty <2.5 after 5 companies |
| mpa-qualification-scorer | <70% agreement with Ken's judgment |
| deal-hypothesis-generator | Avg novelty <3.0 AND actionability <3.0 |
| meeting-prep-briefer | Ken doesn't use the brief in actual meeting |

**If we kill 2+ skills in Phase 1-2:** Stop and reassess. The core hypothesis may be wrong.

---

## What Success Looks Like

**After 4-5 weeks:**
- 2-3 validated skills that Ken actually uses
- Clear signal on which capabilities add value
- Documented patterns (what works, what doesn't)
- Matt has learned the domain deeply
- Spec for what a product would need to do

**Decision gate:**
- Multiple skills add value → Design product/pitch to Ken on risk-reward model
- No skills add value → Kill the idea cleanly (cheap failure, lessons learned)
- Mixed results → Narrow scope to what works, iterate

---

## Next Steps

1. **Review this approach with Ken** - Get buy-in on participating
2. **Get Skill 1 input** - 3-5 companies + what he wants to know
3. **Build atlantic-company-enricher** - Minimal SKILL.md
4. **Test on 1 company** - Observe behavior
5. **Iterate** - Based on observations, not assumptions

---

## Files in This Project

| File | Purpose |
|------|---------|
| Initial_conversation.md | Original meeting transcript |
| ken_skinner_profile.md | Ken's background |
| morrison_park_overview.md | MPA company research |
| high_level_idea.md | Ken's "Informed Ideation OS" vision |
| Solution_Market_Research.md | Existing tools analysis |
| atlantic_canada_competitive_research.md | Deep competitive research |
| questions_for_ken.md | Questions to validate assumptions |
| unmet_need_and_assumptions.md | Core hypothesis + test criteria |
| skills_based_poc_approach.md | This file - implementation plan |

---

*Last updated: December 2025*
