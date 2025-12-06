---
description: Run daily M&A prospecting for Atlantic Canada signals
---

Run the MPA Deal Intelligence Prospector Agent to scan for new M&A signals in Atlantic Canada.

Execute the daily prospecting workflow by running `cd agents && npx tsx src/index.ts --prospect`.

This will:
1. Scan news for sell-side signals (owner retirement, succession issues)
2. Check for buy-side signals (acquisition announcements, BD hires)
3. Find growth signals (new contracts, expansion news)
4. Prioritize top 3 opportunities
5. Update the pipeline with new prospects

Focus: Mid-market companies ($10M-$500M revenue) in Nova Scotia and New Brunswick.

Run this command and report the findings, including any new prospects identified and recommended next actions.
