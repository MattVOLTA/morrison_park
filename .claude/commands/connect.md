---
description: Find warm introduction paths to a target company
argument-hint: <company-name>
---

Run the MPA Deal Intelligence Connector Agent to find warm introduction paths to $ARGUMENTS.

Execute by running `cd agents && npx tsx src/index.ts --intro "$ARGUMENTS"`.

This will:
1. Use the Connector Agent to map all possible connection types
2. Use the Researcher Agent to profile key decision makers
3. Rank introduction options by quality (Tier 1-5)
4. Recommend approach strategy

Deliver:
- Decision maker profiles
- All connection paths found (investors, board, professional network, university/philanthropy)
- Recommended introduction approach
- Conversation starters
- What Ken should know before reaching out

Connection Quality Tiers:
- Tier 1: Direct personal relationship
- Tier 2: Shared board/investor
- Tier 3: Same professional network
- Tier 4: Conference/event connection
- Tier 5: Cold (no connection found)

Run this command and report the best introduction paths.
