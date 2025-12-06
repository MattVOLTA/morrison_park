---
description: Build a comprehensive market map for an industry sector
argument-hint: <industry> [province]
---

Build a comprehensive market map for the industry/province specified in $ARGUMENTS.

Execute by running `cd agents && npx tsx src/index.ts --market-map $ARGUMENTS`.

This will:
1. Use the Prospector Agent to identify all major players
2. Use the Researcher Agent to profile top 10 by size
3. Use the Connector Agent to map shared investors and board connections
4. Identify consolidation opportunities

Deliver:
- Market structure overview
- Key players ranked by size
- Ownership patterns (family-held, PE-backed, strategic)
- Shared investor network
- Board connections across companies
- Top 3 M&A opportunities
- Recommended next steps

Atlantic Canada provinces: NS (Nova Scotia), NB (New Brunswick), PEI (Prince Edward Island), NL (Newfoundland & Labrador)

Run this command and report the market map findings.
