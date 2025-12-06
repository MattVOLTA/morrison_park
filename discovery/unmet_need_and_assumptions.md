# Unmet Need & Core Assumptions

## The Unmet Need (Clearly Stated)

**What exists today:**
- Relationship CRMs (4Degrees, Affinity) - track who knows whom
- Company databases (Grata, PitchBook, SourceScrub) - find and filter targets
- Research tools (AlphaSense, Perplexity) - answer questions on demand
- Deal platforms (Axial) - match buyers and sellers

**What does NOT exist:**
> An AI layer that proactively synthesizes relationship data, company intelligence, and market signals to generate specific, actionable deal hypotheses ("Idea Cards") with rationale, stakeholders, and recommended next actions.

---

## The Gap in One Sentence

Existing tools help you **search** for opportunities. Nothing helps you **discover** opportunities you didn't know to look for.

---

## Ken's Problem Restated

Ken has:
- A database of Atlantic Canada companies
- Relationship history from 1.5 years of meetings
- Analyst capacity doing manual research
- His own pattern-matching expertise from decades of dealmaking

Ken lacks:
- A system that connects these dots **proactively**
- Recommendations that surface **before** he thinks to ask
- A way to scale his pattern-matching beyond his own memory

**The constraint:** "Nothing happens unless I do it."

**The unlock:** What if a system could do the "noticing" so Ken only does the "deciding"?

---

## Core Assumptions to Validate

### Assumption 1: Proactive beats reactive
**Hypothesis:** AI-generated deal hypotheses (unprompted) will surface opportunities Ken's current process misses.

**How to test:**
- Generate 10-20 "Idea Cards" from Ken's existing database + public data
- Have Ken score each: (a) Already knew this, (b) Knew but forgot, (c) New insight
- Success = >30% are (b) or (c)

**Fastest invalidation:** If Ken says "I already know all of this" for every card, the system adds no value.

---

### Assumption 2: AI can match Ken's qualification criteria
**Hypothesis:** Given Ken's criteria (ownership structure, succession signals, deal readiness), AI can qualify companies as well as Ken's analysts.

**How to test:**
- Take 20 companies Ken has already qualified (10 good, 10 bad)
- Have AI qualify them blind
- Measure agreement rate with Ken's judgment

**Fastest invalidation:** If AI qualification disagrees with Ken >50% of the time, the criteria can't be codified.

---

### Assumption 3: Relationship paths add value
**Hypothesis:** Surfacing "warm intro paths" (Ken → X → Target) will increase meeting conversion rates.

**How to test:**
- For Ken's next 10 outreach attempts, identify if a warm path exists
- Track response rates: cold outreach vs. warm intro identified
- Success = measurable lift in response rate

**Fastest invalidation:** If warm paths don't improve response rates, relationship mapping is noise.

---

### Assumption 4: Signal monitoring catches inflection points
**Hypothesis:** Monitoring public signals (news, leadership changes, funding, regulatory) will identify companies at deal-ready moments.

**How to test:**
- Set up monitoring for 50 companies in Ken's database
- Track signals over 30-60 days
- Have Ken rate: (a) Irrelevant, (b) Interesting, (c) Actionable
- Success = >20% rated (c) Actionable

**Fastest invalidation:** If signals are mostly noise, monitoring creates alert fatigue without value.

---

### Assumption 5: Ken will act on recommendations
**Hypothesis:** Ken will change his behavior (outreach, meeting priorities) based on system recommendations.

**How to test:**
- Track how many recommendations Ken acts on vs. ignores
- Success = >50% action rate on high-confidence recommendations

**Fastest invalidation:** If Ken ignores recommendations (even good ones), the system doesn't fit his workflow.

---

## What We're NOT Building (Scope Boundaries)

| In Scope | Out of Scope |
|----------|--------------|
| AI intelligence layer | CRM rebuild |
| Idea Card generation | Deal execution workflow |
| Signal monitoring | Document management |
| Relationship path identification | Marketing automation |
| Integration with existing tools | New database infrastructure |

**Principle:** Integrate, don't replace. The value is in the **thinking**, not the **plumbing**.

---

## Minimum Viable Test

**Simplest possible validation:**

1. Export Ken's company database (CSV or similar)
2. Enrich with public data (AI research on each company)
3. Apply Ken's qualification criteria
4. Generate 20 "Idea Cards" with:
   - Company name
   - Hypothesis (why this is an opportunity)
   - Evidence (what signals suggest this)
   - Stakeholders (who to talk to)
   - Next action (what Ken should do)
5. Ken reviews and scores

**Timeline:** 1-2 weeks
**Cost:** Matt's time only
**Decision gate:** Does Ken see value? Would he want more?

---

## Success Metrics for POC

| Metric | Target | Measurement |
|--------|--------|-------------|
| Novel insights | >30% of Idea Cards are new to Ken | Ken's self-report |
| Qualification accuracy | >70% agreement with Ken's judgment | Blind comparison |
| Actionability | >20% of recommendations lead to action | Track over 30 days |
| Time saved | Ken reports meaningful time savings | Qualitative feedback |

---

## Key Risk to Address First

**Fit Risk** remains the highest priority to validate:

> Is there a segment of Atlantic Canada companies where (a) the system can identify them, (b) they need advisory services, AND (c) MPA is positioned to win?

If the answer is no, better Idea Cards don't matter - they'll just surface opportunities MPA can't capture.

**Question for Ken (#12-14 in questions file):** What's MPA's actual sweet spot in Atlantic Canada?

---

*Last updated: December 2025*
