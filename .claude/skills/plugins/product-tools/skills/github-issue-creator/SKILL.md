---
name: github-issue-creator
description: "Creates comprehensive GitHub issues that serve as source of truth for changes. Use when user asks to create a GitHub issue for a bug fix, feature, update, or any other change. Captures all research, analysis, and implementation context for the next developer."
---

# GitHub Issue Creator

## Purpose

This skill helps create detailed, comprehensive GitHub issues that serve as the **source of truth** for all changes to the codebase. When you've completed research, bug investigation, or feature planning, this skill ensures that all your findings, analysis, and implementation context are captured in a GitHub issue.

## Core Principle: Write for the Next Developer

**CRITICAL**: You are writing this issue for another AI developer (or human developer) who will implement the changes. They won't have access to:
- The conversation we just had
- The research you just performed
- The code analysis you just completed
- The decisions and tradeoffs you just considered

**Your job**: Transfer ALL of that knowledge into the issue so they can successfully implement the changes without having to redo your research.

## When to Use This Skill

Activate this skill when the user explicitly asks you to:
- "Create a GitHub issue for this"
- "Add this to GitHub"
- "Document this as an issue"
- "Create an issue for this bug/feature/fix"
- Any variation of requesting a GitHub issue be created

## Guiding Principles

### 1. Benefit from Your Research
Don't just describe WHAT needs to be done. Include:
- **Why** you chose this approach over alternatives
- **What** you discovered during investigation
- **How** existing code patterns informed your decision
- **Where** the relevant code lives (specific file paths and line numbers)
- **What** edge cases or gotchas you identified

### 2. Provide Complete Context
Include everything the next developer needs:
- Background on the problem/feature
- Current state of the system
- Related code/files with specific references (e.g., `src/app/profile/page.tsx:123`)
- Dependencies or prerequisites
- Testing considerations
- Potential risks or concerns

### 3. Be Specific and Actionable
- Reference specific files and line numbers
- Include code snippets showing current vs. desired state
- Link to related issues, PRs, or documentation
- Explain technical decisions with rationale
- Provide enough detail that implementation can begin immediately

### 4. Structure for Clarity
While you have flexibility in structure, organize information logically:
- Start with clear problem statement or feature description
- Provide necessary background and context
- Include research findings and analysis
- Present implementation approach with specific details
- Call out testing requirements and acceptance criteria
- Note any risks, dependencies, or open questions

### 5. ⚠️ MANDATORY: UX / UI Updates Section
**CRITICAL - DO NOT SKIP**: Every GitHub issue MUST include a "UX / UI Updates" section that maps out how the user will interact with the feature once completed.

This section should describe:
- **User-facing changes**: What new buttons, screens, or interactions will users see?
- **User flow**: Step-by-step walkthrough of the user experience
- **Visual changes**: Any layout, styling, or design modifications
- **Feedback mechanisms**: Loading states, success/error messages, notifications

**If there are NO user-facing changes** (e.g., backend refactoring, database migrations, internal tooling), mark the section as:
```markdown
## UX / UI Updates

**No Changes** - This issue involves [backend/database/internal] changes only with no user-facing impact.
```

### 6. ⚠️ MANDATORY: Proposed Data Model Changes Section
**CRITICAL - DO NOT SKIP**: Every GitHub issue MUST include a "Proposed Data Model Changes" section. This enables the Database Auditor to automatically analyze risks before implementation begins.

**Format:**
```markdown
## Proposed Data Model Changes

### Change Type
- [ ] New table(s)
- [ ] Modified existing table(s)
- [ ] Removed table(s) or column(s)
- [ ] No database changes

### Tables Affected
List each table that will be created, modified, or removed.

**Table:** [table_name]
**Action:** [create | modify | remove]
**Changes:**
- Column: [column_name], Type: [data_type], Nullable: [yes/no], Default: [value]
- [additional columns...]

### Relationships
Describe foreign key relationships to existing tables.

### Migration Strategy
- [ ] Additive only (no breaking changes)
- [ ] Requires data backfill
- [ ] Requires deployment coordination
- [ ] Requires downtime

### Additional Context
[Any other relevant information about the data model changes]
```

**If there are NO database changes**, mark the section as:
```markdown
## Proposed Data Model Changes

### Change Type
- [x] No database changes

This issue involves frontend/UI changes only with no database modifications.
```

**Why This Matters:**
- The Database Auditor GitHub Action automatically triggers when issues contain this section
- Catches breaking changes, migration risks, and tenant isolation issues BEFORE code is written
- Creates a forcing function to think through data implications upfront
- Documents intent - the issue becomes a record of WHY schema changes were made

### 7. ⚠️ MANDATORY: Test-Driven Development (TDD) Requirement
**CRITICAL - DO NOT SKIP**: Every GitHub issue for features, bug fixes, or refactoring MUST include a prominent TDD workflow section.

**From project CLAUDE.md**:
> **`test-driven-development` skill**: MUST BE USED when implementing ANY feature or bugfix. ALWAYS invoke BEFORE writing implementation code. Write test first, watch it fail, then write minimal code to pass. **NEVER skip this - if you write code before tests, delete it and start over.**

**Required in EVERY issue**:
1. **Explicit TDD invocation reminder** at the top of the issue
2. **Phase-by-phase TDD workflow** showing RED-GREEN-REFACTOR cycle
3. **Test-first implementation steps** for each component/feature
4. **Reference to `test-driven-development` skill** that must be invoked

**Format**:
```markdown
## ⚠️ CRITICAL: Test-Driven Development Required

**BEFORE implementing ANY phase of this issue:**

1. **Invoke the `test-driven-development` skill**
2. **Write tests FIRST** (before any implementation code)
3. **Watch tests FAIL** (red phase)
4. **Write minimal code** to make tests pass (green phase)
5. **Refactor** while keeping tests green

### TDD Workflow for This Issue

[Phase-by-phase breakdown showing TDD cycle for each component]
```

This section is NON-NEGOTIABLE and must appear prominently in every issue for code changes.

## Flexible Structure Examples

The structure should match the issue type and context. Here are examples, not rigid templates:

### For Bug Fixes
- **⚠️ TDD Requirement**: Mandatory TDD workflow (invoke skill, write failing tests, implement fix)
- **Problem Description**: What's broken and how it manifests
- **Root Cause Analysis**: What you discovered during investigation
- **Affected Code**: Specific files and functions with line references
- **Proposed Solution**: How to fix it and why this approach
- **UX / UI Updates**: How the user experience changes after the fix (or "No Changes" if backend-only)
- **Proposed Data Model Changes**: Database changes required (or "No database changes" if none)
- **TDD Workflow**: Step-by-step RED-GREEN-REFACTOR cycle for the fix
- **Testing Strategy**: How to verify the fix works
- **Related Issues**: Links to similar bugs or relevant context

### For New Features
- **⚠️ TDD Requirement**: Mandatory TDD workflow (invoke skill, write tests first, implement)
- **Feature Overview**: What we're building and why
- **User Story/Use Case**: How this will be used
- **Technical Approach**: Architecture and implementation strategy
- **UX / UI Updates**: User interaction walkthrough - what screens/buttons/flows the user will see
- **Proposed Data Model Changes**: New tables, columns, or modifications required
- **TDD Workflow**: Phase-by-phase breakdown showing test-first implementation
- **Key Components**: Files to create/modify with specific details
- **Integration Points**: How this connects to existing systems
- **Acceptance Criteria**: What "done" looks like
- **Design References**: Links to prototypes, mockups, or specs

### For Refactoring
- **⚠️ TDD Requirement**: Mandatory TDD workflow (write characterization tests first)
- **Current State**: What exists now and why it needs refactoring
- **Problems with Current Approach**: Technical debt, performance issues, etc.
- **Proposed Changes**: What the new structure should look like
- **UX / UI Updates**: "No Changes" if internal refactoring, or describe any user-facing impacts
- **Proposed Data Model Changes**: Schema modifications if any (or "No database changes")
- **TDD Workflow**: Test-first refactoring approach (characterization tests → refactor → verify)
- **Migration Strategy**: How to transition without breaking things
- **Files Affected**: Complete list with specific changes needed
- **Benefits**: Why this refactoring is worth doing

### For Performance Improvements
- **Performance Issue**: What's slow and how you measured it
- **Profiling Results**: Data from investigation
- **Root Cause**: Why it's slow (specific code patterns, queries, etc.)
- **Optimization Strategy**: Specific changes to improve performance
- **UX / UI Updates**: User-perceived changes (e.g., faster load times, loading states) or "No Changes" if invisible
- **Proposed Data Model Changes**: Index additions, query optimizations, or schema changes (or "No database changes")
- **Expected Impact**: Measurable improvement goals
- **Testing/Benchmarking**: How to verify improvements

## Workflow

When user asks you to create a GitHub issue:

### Step 1: Gather Context
- Review the conversation to capture all relevant research and analysis
- Identify key decisions, tradeoffs, and technical findings
- Note specific file references, code patterns, and implementation details
- Consider what the next developer absolutely needs to know

### Step 2: Draft the Issue
Write a comprehensive issue following these principles:
- **Title**: Clear, specific, action-oriented (e.g., "Fix network page performance issue with profile fetching" not "Network page slow")
- **Body**: Well-structured markdown with all context and details
- **⚠️ TDD Section**: MANDATORY - Include prominent TDD workflow section (see Guiding Principle #5)
- **Code References**: Use format `file_path:line_number` for easy navigation
- **Links**: Include relevant URLs, PRs, issues, documentation
- **Formatting**: Use markdown effectively (headings, lists, code blocks, emphasis)

**TDD Section Template** (REQUIRED for all code changes):
```markdown
## ⚠️ CRITICAL: Test-Driven Development Required

**BEFORE implementing ANY phase of this issue:**

1. **Invoke the `test-driven-development` skill**
2. **Write tests FIRST** (before any implementation code)
3. **Watch tests FAIL** (red phase)
4. **Write minimal code** to make tests pass (green phase)
5. **Refactor** while keeping tests green

### TDD Workflow for This Issue

[Include phase-by-phase breakdown showing specific TDD steps]

### Why This Matters

From `/app/CLAUDE.md`:

> **`test-driven-development` skill**: MUST BE USED when implementing ANY feature or bugfix. ALWAYS invoke BEFORE writing implementation code. Write test first, watch it fail, then write minimal code to pass. **NEVER skip this - if you write code before tests, delete it and start over.**

### Reference

- Skill: `test-driven-development`
- Documentation: `/app/CLAUDE.md` - TDD workflow enforcement
```

### Step 3: Show for Approval
Present the drafted issue to the user in a readable format:
```markdown
# I've drafted this GitHub issue:

**Title**: [Issue Title]

**Body**:
[Full issue markdown content]

---
Would you like me to create this issue in GitHub?
```

### Step 4: Detect Repository Info
When user approves, automatically detect:
- Repository owner from git remote (e.g., "MattVOLTA")
- Repository name from git remote (e.g., "builders")
- Use `git remote get-url origin` to extract this information

### Step 5: Create Issue via GitHub MCP
Use the `mcp__github__create_issue` tool with:
- `owner`: Detected repository owner
- `repo`: Detected repository name
- `title`: The issue title you drafted
- `body`: The complete markdown body you drafted

### Step 6: Return Success
After creation, provide the user with:
- ✅ Success confirmation
- Direct link to the created issue
- Issue number for reference

Example:
```
✅ Issue created successfully!

📝 Issue #123: Fix network page performance issue with profile fetching
🔗 https://github.com/MattVOLTA/builders/issues/123
```

## Error Handling

If issue creation fails:
1. Show the error message to the user
2. Offer to save the drafted content locally as backup
3. Suggest troubleshooting steps (check permissions, network, etc.)
4. Keep the drafted content available for retry

## Quality Checklist

Before showing the drafted issue, verify:
- [ ] **⚠️ UX / UI UPDATES SECTION INCLUDED** - Mandatory section describing user-facing changes (or "No Changes" if none)
- [ ] **⚠️ PROPOSED DATA MODEL CHANGES SECTION INCLUDED** - Mandatory section for database changes (or "No database changes" if none)
- [ ] **⚠️ TDD SECTION INCLUDED** - Mandatory TDD workflow with skill invocation reminder
- [ ] **⚠️ PHASE-BY-PHASE TDD BREAKDOWN** - Specific RED-GREEN-REFACTOR steps for each component
- [ ] Title is clear and action-oriented
- [ ] Includes WHY (rationale) not just WHAT (tasks)
- [ ] Contains specific file references with paths/line numbers
- [ ] Captures research findings and technical analysis
- [ ] Explains decisions and tradeoffs considered
- [ ] Provides enough context for immediate implementation
- [ ] Includes testing considerations beyond TDD workflow
- [ ] Uses proper markdown formatting
- [ ] Links to related issues/PRs/docs where relevant
- [ ] Anticipates questions the next developer might have
- [ ] References `test-driven-development` skill explicitly

## Remember

- **Your research has value** - don't let it disappear after this conversation
- **Be thorough, not brief** - the next developer will thank you for details
- **Specific is better than general** - file paths beat vague descriptions
- **Show your work** - explain how you arrived at conclusions
- **Think like a teacher** - you're transferring knowledge to someone who wasn't here

The goal is that another developer can pick up this issue and successfully implement the changes because you've given them everything they need.
