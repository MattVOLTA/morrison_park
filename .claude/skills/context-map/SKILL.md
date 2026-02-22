---
name: context-map
description: "Creates a project context map by interviewing the user, exploring connected data sources, and scaffolding project configuration (CLAUDE.md, settings.json, custom agents). Use when starting a new project or needing to map all systems of record for a project."
---

# Context Map Creator

## Purpose

Build a high-fidelity context map that inventories all data sources, systems of record, and project context so Claude can rapidly orient, process new information, and maintain a running timeline for any project.

## Prerequisites

Before running this skill, the user should have:
- Created the project directory
- Set up `.claude/` directory
- Configured `.env` with relevant credentials (if applicable)
- Set up `mcp.json` with MCP server connections (if applicable)

The skill verifies these exist and recommends additions as needed.

## Workflow

Execute these phases in order. Do not skip phases.

### Phase 0: Connection Verification

Before exploring data sources, verify that external service credentials are valid. Broken auth wastes time in later phases.

**Google OAuth check:**
1. Run `./scripts/google-auth.sh --check` to test the Google refresh token
2. If the token is **valid**, proceed to Phase 1
3. If the token is **invalid or expired**:
   - Tell the user their Google token needs to be refreshed
   - Run `./scripts/google-auth.sh` which will:
     - Start a local callback server on port 5555
     - Open the browser for Google authorization
     - Automatically capture the callback and exchange for a new refresh token
     - Update `.env` with the new token
   - **Important**: The redirect URI `http://localhost:5555/oauth/callback` must be registered in [Google Cloud Console](https://console.cloud.google.com/apis/credentials) under the OAuth client's authorized redirect URIs
   - After re-auth completes, verify again with `--check` before proceeding
4. If Google workspace MCP tools are available, also verify they can reach the API (e.g., try listing a single Gmail message)

**Other MCP services**: Spot-check any other configured MCP connections (Supabase, GitHub, Fireflies) by making a lightweight test call. Flag any that fail so the user can fix them before Phase 3 exploration.

**Todoist check** (no MCP server — all access is via curl):
If `TODOIST_API_TOKEN` exists in `.env`, verify the token works:
```bash
source .env
curl -s -X POST https://api.todoist.com/api/v1/sync \
  -H "Authorization: Bearer $TODOIST_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sync_token": "*", "resource_types": ["projects"]}' \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Todoist: {len(d.get(\"projects\",[]))} projects found')"
```
If this fails or returns an auth error, flag it for the user before Phase 3. See `todoist_api_reference.md` in the project root for full API patterns.

### Phase 1: Model & Capability Research

Before making any configuration decisions, look up current Claude documentation:

1. Use ToolSearch to find the context7 documentation tools (search "context7"), then use them to look up the latest Claude Code documentation on model configuration, agent teams, and subagent capabilities
2. Supplement with web search if context7 lacks recent info
3. Identify: current model lineup and aliases, agent team configuration, subagent features, memory options
4. Store findings for use in Phase 5 scaffolding

This can run as a background task while Phase 2 begins.

### Phase 2: Interview

Ask these questions ONE AT A TIME. Adapt follow-ups based on responses. Do not rush - each answer shapes the exploration phase.

1. **Project identity**: "What is this project? Give me the name, a one-liner description, and what we're trying to accomplish."

2. **People**: "Who's involved besides you? Any clients, collaborators, or stakeholders? For each: name, email, role. Or is it just you?"

3. **Data sources**: Present what MCP connections and tools are available (scan mcp.json and environment). Then ask: "Which of these systems are relevant to this project?" For each confirmed source, ask: "What specific data in [source] matters?"

4. **Existing files**: "Are there existing files in this project folder I should know about? Prior work, exports, reference docs, data files?"

5. **Rules & constraints**: "Any rules I should always follow for this project? Things to avoid, naming conventions, specific databases to use or not use?"

6. **Timeline dimension**: "Is there a timeline dimension to this project? Do we need to track events chronologically across sources?"

7. **Task management**: "Do you have an existing Todoist project for this, or should we create one? Or is Todoist not needed here?"

After the interview, summarize what you heard back to the user for confirmation before proceeding.

### Phase 3: Exploration

Based on interview answers, aggressively explore each named data source. The goal is to discover specific IDs, table schemas, relationships, and access patterns - don't wait for the user to provide these.

**For each data source type:**

- **Supabase/Database**: List all tables, examine schemas of relevant ones, identify key IDs and foreign key relationships, find the specific record IDs that matter for this project
- **GitHub**: Scan repo structure, recent issues/PRs/commits, identify key branches and workflows
- **Fireflies**: Search transcripts by participant email or project keywords, identify meeting cadence and participants
- **Gmail/Calendar**: Search email threads and calendar events related to the project, identify communication patterns
- **Todoist** (curl, not MCP): If the user linked a Todoist project in the interview, pull its tasks and sections:
  ```bash
  source .env
  curl -s -X POST https://api.todoist.com/api/v1/sync \
    -H "Authorization: Bearer $TODOIST_API_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"sync_token": "*", "resource_types": ["items", "sections", "projects"]}' \
    | python3 -c "
  import sys, json
  data = json.load(sys.stdin)
  pid = 'TARGET_PROJECT_ID'
  tasks = [t for t in data.get('items', []) if t.get('project_id') == pid]
  sections = [s for s in data.get('sections', []) if s.get('project_id') == pid]
  print(f'Sections ({len(sections)}):')
  for s in sections: print(f'  - {s[\"name\"]} (id: {s[\"id\"]})')
  print(f'Tasks ({len(tasks)}):')
  for t in tasks:
      status = 'DONE' if t.get('checked') else 'OPEN'
      due = t.get('due', {}).get('date', 'no date') if t.get('due') else 'no date'
      print(f'  [{status}] {t[\"content\"]} (due: {due}, id: {t[\"id\"]})')
  "
  ```
  Replace `TARGET_PROJECT_ID` with the actual project ID. See `todoist_api_reference.md` for full API patterns
- **Local files**: Scan the project directory, read key files to understand existing context

**Discovery loop**: After exploring each source, present findings to the user. Ask clarifying questions if anything is ambiguous or incomplete. Continue exploring until you are confident you have:
- All relevant entity IDs mapped
- All table/resource relationships understood
- All access patterns documented
- All cross-system keys identified (how the same person/entity appears across systems)

Do NOT proceed to Phase 4 until you are confident the inventory is complete.

### Phase 4: Draft & Iterate

Generate a draft `context-map.md` using adaptive sections (see reference/section-templates.md). Include only sections relevant to this project:

| Section | Include when... |
|---------|----------------|
| Quick Reference | Always |
| Project Purpose | Always |
| People | External people are involved |
| Data Source Registry | Always |
| Rules & Constraints | Any project-specific rules exist |
| Timeline Playbook | Project has temporal data across sources |
| Refresh Checklist | Always |

Present the full draft to the user. Iterate based on feedback until approved.

### Phase 5: Generate Outputs

Once the context map is approved, generate all project scaffolding:

1. **`context-map.md`** in project root - the approved map
2. **`CLAUDE.md`** in project root - lightweight pointer file (see reference/scaffolding-templates.md)
3. **`.claude/settings.json`** - model config based on Phase 1 research, agent teams enabled, appropriate effort level
4. **`.claude/agents/`** - custom subagents if the project warrants them (e.g., researcher with project memory for complex engagements)
5. **`timeline.md`** - initial timeline pull if the project has temporal data
6. **Todoist** - If the user wants a Todoist project, either note the existing project ID in the context map, or create a new one:
   ```bash
   source .env
   curl -s -X POST https://api.todoist.com/api/v1/sync \
     -H "Authorization: Bearer $TODOIST_API_TOKEN" \
     -H "Content-Type: application/json" \
     -d "{
       \"commands\": [{
         \"type\": \"project_add\",
         \"uuid\": \"$(uuidgen)\",
         \"temp_id\": \"$(uuidgen)\",
         \"args\": {\"name\": \"PROJECT_NAME\"}
       }]
     }"
   ```
   Record the project ID from `temp_id_mapping` in the context map's Data Source Registry. If sections are needed, batch `section_add` commands in the same call. See `todoist_api_reference.md` for full command reference

Use templates from reference/scaffolding-templates.md, adapted based on Phase 1 findings for current model capabilities.

## Key Principles

- **Source of truth stays where it is** - the context map points to data, never duplicates it
- **Aggressive exploration** - probe sources deeply, don't wait for the user to provide IDs or table names
- **Iterate until confident** - loop on discovery until the map is complete
- **Progressive disclosure** - CLAUDE.md is the lightweight index, context-map.md is the deep reference
- **Current model docs** - always check latest documentation before configuring agents and models
- **Adaptive structure** - only include sections the project actually needs
