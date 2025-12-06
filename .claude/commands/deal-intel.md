---
description: Run a custom deal intelligence task
argument-hint: <task-description>
---

Run a custom task through the MPA Deal Intelligence multi-agent system: $ARGUMENTS

Execute by running `cd agents && npx tsx src/index.ts "$ARGUMENTS"`.

The orchestrator will:
1. Analyze the task and determine which agents to use
2. Route to appropriate specialized agents:
   - Prospector: For signal scanning, market maps, finding prospects
   - Researcher: For deep dives, validation, competitor analysis
   - Connector: For relationship mapping, introduction paths
3. Synthesize findings
4. Update the database with results

Example custom tasks:
- "Find companies with succession signals in the tech sector"
- "Who are the major PE firms investing in Atlantic Canada manufacturing?"
- "What seafood companies have announced expansions this year?"
- "Map the board network in Nova Scotia's healthcare industry"

Run this command and report the findings.
