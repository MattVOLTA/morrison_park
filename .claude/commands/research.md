---
description: Deep research on a specific company for M&A intelligence
argument-hint: <company-name>
---

Run the MPA Deal Intelligence Researcher Agent to conduct comprehensive research on $ARGUMENTS.

Execute by running `cd agents && npx tsx src/index.ts --research "$ARGUMENTS"`.

This will:
1. Use the Researcher Agent for a full deep dive on the company
2. Use the Connector Agent to map relationship/introduction paths
3. Synthesize findings into a deal thesis
4. Update the pipeline appropriately

Deliver:
- Executive summary
- Succession assessment (Scorecard 1-5 on 5 dimensions)
- Deal hypothesis
- Best introduction path
- Recommended next steps

CRITICAL: Ensure every data point has a source URL for verification.

Run this command and report the comprehensive findings.
