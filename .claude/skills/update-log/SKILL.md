---
name: update-log
description: "Appends a structured session update to the project's update-log.md. Reviews what was accomplished in the current session, links to artifacts and sources, and records decisions made. Use at the end of a working session or when the user says 'log this' or 'update the log'."
disable-model-invocation: true
argument-hint: [optional summary hint]
---

# Update Log Writer

## Purpose

Capture what was accomplished in the current session as a permanent, linkable record in `update-log.md`. Each entry should be useful to future-you (or a collaborator) who needs to understand what changed and why.

## Execution Steps

### Step 1: Gather Context

1. Read `context-map.md` in the project root to understand the project's data sources and structure
2. Read the existing `update-log.md` if it exists — note the last entry date and format for consistency
3. Review the current session: what files were created, modified, or read; what tools were called; what decisions were made; what the user asked for and what was delivered

### Step 2: Identify Accomplishments

Scan the session for meaningful work products. Categorize each as one of:

| Category | Examples |
|----------|---------|
| **Created** | New files, database records, Todoist tasks, calendar events |
| **Modified** | Edited files, updated records, patched documents |
| **Discovered** | New information from exploration, research findings, data patterns |
| **Decided** | Architectural choices, workflow decisions, scope changes |
| **Resolved** | Bugs fixed, blockers removed, questions answered |

Skip trivial actions (reading files for orientation, failed attempts that led nowhere). Focus on outcomes, not process.

### Step 3: Collect Artifact Links

For every accomplishment, find the most specific reference possible:

| Artifact Type | Link Format |
|---------------|-------------|
| Local file created/modified | `[filename](relative/path/to/file)` |
| Git commit | `[short message](commit-hash)` — run `git log --oneline -5` if in a repo |
| GitHub PR/issue | `[#number](url)` — use `gh` CLI to get URLs |
| Database record | `[table.field](record-id)` with the query used to find/create it |
| Supabase record | `[table: description](project-id/table/record-id)` |
| Email/thread | `[subject](message-id or search query used)` |
| Calendar event | `[event title](event-id or date)` |
| Todoist task | `[task title](task-id)` |
| External URL | `[page title](url)` |
| Fireflies transcript | `[meeting title](transcript-id)` |
| Sanity document | `[doc title](document-id)` with dataset context |

If an artifact lives in a system from the project's Data Source Registry (in context-map.md), use the access pattern documented there to construct the reference.

### Step 4: Draft the Entry

Use this format — adapt sections based on what actually happened:

```markdown
## YYYY-MM-DD — [Session Title]

> [1-2 sentence summary of what this session accomplished]

### What Changed

- **[Category]**: [Description] → [artifact link]
- **[Category]**: [Description] → [artifact link]

### Decisions

- [Decision made and rationale, if any decisions were made this session]

### Sources Consulted

- [Source]: [What was pulled and why] → [link if applicable]

### Next Steps

- [ ] [Actionable follow-up identified during this session]
```

**Formatting rules:**
- Date format: `YYYY-MM-DD` (use today's date: !`date +%Y-%m-%d`)
- Session title: short, descriptive — what the session was *about*, not what you did
- Use `→` to visually separate description from artifact link
- Keep each bullet to one line when possible
- Only include "Decisions", "Sources Consulted", and "Next Steps" sections if they have content — omit empty sections

### Step 5: Write the Entry

1. If `update-log.md` does not exist, create it with a header:
   ```markdown
   # Update Log

   Chronological record of project sessions and what was accomplished.

   ---
   ```
2. **Append** the new entry to the end of `update-log.md` (do NOT overwrite existing entries)
3. Add a `---` separator after the entry

### Step 6: Confirm with User

Present the entry to the user before writing. Ask:
- "Does this capture the session accurately?"
- "Anything to add, remove, or rephrase?"

Write only after confirmation. If the user provides `$ARGUMENTS`, use that as a hint for the session title or focus area.

## Edge Cases

- **No meaningful work done**: If the session was purely exploratory with no tangible output, still log it under "Discovered" — orientation has value
- **Multiple topics in one session**: Use a general session title and group bullets by topic
- **Sensitive information**: Do not log credentials, tokens, or private keys. Reference them abstractly ("refreshed Google OAuth token")
- **First session after setup**: The first entry should reference the context-map creation itself as the primary accomplishment
