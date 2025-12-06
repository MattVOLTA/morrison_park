---
description: Review the M&A deal pipeline status
---

Run the MPA Deal Intelligence system to conduct a pipeline review.

Execute by running `cd agents && npx tsx src/index.ts --pipeline`.

This will:
1. Get current pipeline status across all stages
2. For each company in "researching" stage, check for new signals
3. Identify stale prospects (no activity 30+ days)
4. Recommend priority actions

Pipeline Stages:
- Prospect: Just identified, needs research
- Researching: Deep dive in progress
- Outreach: Ready for Ken to reach out
- Engaged: In discussions
- Active Deal: Mandate in progress
- Closed: Deal completed
- Passed: Not pursuing

Deliver:
- Pipeline summary by stage
- Top priorities for this week
- Companies needing attention
- Recommended next actions

Run this command and report the pipeline status with recommendations.
