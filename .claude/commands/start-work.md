# /start-work - Begin Working on a GitHub Issue

Start work on a GitHub issue with proper environment setup, branch creation, and workflow enforcement.

## Usage

```
/start-work <issue-number>
```

## Arguments

- `issue-number` (required): The GitHub issue number to work on (e.g., `198`)

---

## Workflow Steps

Execute these steps in order. **STOP and report if any step fails.**

### Step 1: Pre-flight Checks

```bash
# Check for uncommitted changes
git status --porcelain
```

**If output is not empty:**
> "You have uncommitted changes. Please commit or stash them before starting new work."
> Show the uncommitted files and STOP.

**If clean:** Proceed.

### Step 2: Fetch GitHub Issue

```bash
gh issue view $ISSUE_NUMBER
```

**Extract from issue:**
- Title
- Labels (to determine: feature, bug, docs, etc.)
- Description/body

**Report to user:**
> "Starting work on #[number]: [title]"

### Step 3: Review Available MCP Tools

**BEFORE planning implementation, review available MCP servers and tools that might be useful for this issue.**

Use the `ListMcpResourcesTool` to see all available MCP servers and their capabilities:

```typescript
// Review all MCP servers
ListMcpResourcesTool({})
```

**Consider which tools might be relevant:**
- **Supabase MCP** (Multi_Tenant/Single_Tenant): Database queries, migrations, logs, advisors
- **GitHub MCP**: Issue management, PR operations, code search
- **Context7 MCP**: Library documentation lookup (Next.js, Supabase, React, etc.)
- **Apify MCP**: Web scraping, data extraction (if relevant)
- **Railway MCP**: Deployment, logs, environment management
- **Netlify MCP**: Deployment, forms, serverless functions
- **Fireflies MCP**: Meeting transcripts, user data
- **Cloudflare MCP**: DNS, Workers, deployment
- **Claude in Chrome MCP**: Browser automation (if UI testing needed)
- **Inngest Dev MCP**: Function testing, event sending, run monitoring

**Report to user:**
> "Available MCP tools reviewed. Relevant for this issue: [list applicable tools]"

### Step 4: Consider Subagent Usage

**CRITICAL: Assess whether specialized subagents would be advantageous for this issue.**

**Use subagents (Task tool) when:**
- Issue requires deep codebase exploration (use `explore` agent)
- Issue involves database schema changes (use `database-auditor` agent)
- Issue requires security review (use `review` agent)
- Issue is complex with multiple independent research tasks (use `general-purpose` agent)
- Issue requires web performance analysis (use `web-performance-analyzer` agent)
- Issue needs QA strategy design (use `qa-strategy-designer` agent)

**Recommended subagent strategy by issue type:**

| Issue Type | Recommended Subagents | Purpose |
|------------|----------------------|---------|
| Database refactoring | `database-auditor` | Analyze schema change risks |
| Complex features | `explore` + `Plan` | Explore codebase, design approach |
| Security-sensitive | `review` or `multi-tenant-security-auditor` | Audit for vulnerabilities |
| Performance issues | `web-performance-analyzer` | Identify bottlenecks |
| Large refactoring | `explore` + `general-purpose` | Map dependencies, plan phases |

**Report to user:**
> "Subagent assessment: [Will use X agent for Y task] or [No subagents needed - straightforward implementation]"

### Step 5: Parse Issue for Workflow Requirements

**CRITICAL: Scan the issue body for TDD requirements.**

**TDD is REQUIRED if the issue contains ANY of these patterns:**
- "TDD Required" or "TDD required"
- "Test-Driven Development Required"
- "Write tests FIRST"
- "test-driven-development skill"
- "RED" and "GREEN" in the context of testing workflow
- "Write failing test" or "failing test first"
- A "TDD Workflow" section
- References to the `test-driven-development` skill

**Set workflow flags:**
```
TDD_REQUIRED = true/false  (based on pattern detection)
```

**If TDD patterns detected:**
> "⚠️ TDD DETECTED: This issue explicitly requires Test-Driven Development."

### Step 6: Sync with Main

```bash
git checkout main
git pull origin main
```

**If conflicts or errors:** Report and STOP.

### Step 7: Create Feature Branch

**Determine branch type from issue labels:**
- `bug` label → `fix/`
- `documentation` label → `docs/`
- `enhancement` or `feature` label → `feature/`
- Default → `feature/`

**Create branch:**
```bash
# Format: <type>/<issue-number>-<short-description>
# Example: feature/198-email-reminders
git checkout -b <type>/<issue-number>-<kebab-case-description>
```

**Branch name rules:**
- Lowercase
- Kebab-case (hyphens)
- Include issue number
- Short but descriptive (3-5 words max)

### Step 8: Establish Baseline - Build

```bash
cd /Volumes/SD/impactOS_MT/app
npm run build
```

**If build fails:**
> "Build is failing on main. This is a pre-existing issue."
> Show errors and ask: "Continue anyway or fix first?"

**If build passes:** Record success.

### Step 9: Establish Baseline - Tests

```bash
npm test 2>&1 | tail -20
```

**Record:**
- Number of passing tests
- Number of failing tests (if any)
- Note: Pre-existing failures are acceptable baseline

### Step 10: Report Ready State and Enforce Workflow

**If TDD_REQUIRED = true:**

```
============================================
⚠️  TDD ENFORCEMENT ACTIVE
============================================

Issue:    #[number] - [title]
Branch:   [branch-name]
Base:     main @ [commit-hash]

Baseline Status:
  Build:  [PASS/FAIL]
  Tests:  [X passing, Y failing]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 THIS ISSUE REQUIRES TEST-DRIVEN DEVELOPMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The issue explicitly requires TDD. You MUST:

1. Write a failing test FIRST (RED)
2. Watch the test fail
3. Write minimal code to pass (GREEN)
4. Refactor while keeping tests green
5. Repeat for each feature/behavior

⛔ DO NOT write implementation code before tests.
⛔ DO NOT skip the "watch it fail" step.
⛔ DO NOT rationalize "just this once."

Invoking test-driven-development skill now...
============================================
```

**Then IMMEDIATELY invoke the `test-driven-development` skill:**
> Use the Skill tool to invoke `test-driven-development`

**After TDD skill completes, show issue details:**
```
Issue Details:
---
[Issue body/description]
---

Ready to begin TDD workflow. Start with your first failing test.
```

---

**If TDD_REQUIRED = false:**

```
============================================
READY TO START WORK
============================================

Issue:    #[number] - [title]
Branch:   [branch-name]
Base:     main @ [commit-hash]

Baseline Status:
  Build:  [PASS/FAIL]
  Tests:  [X passing, Y failing]

Next Steps:
1. Review the issue requirements below
2. Plan your implementation approach
3. Consider TDD for new features (recommended)
4. Implement the feature
5. Run /ship-it when complete

Issue Details:
---
[Issue body/description]
---
============================================
```

---

## TDD Detection Patterns

The following patterns in the issue body trigger TDD enforcement:

| Pattern | Example |
|---------|---------|
| Explicit requirement | "TDD Required", "Test-Driven Development Required" |
| Skill reference | "invoke the `test-driven-development` skill" |
| Workflow markers | "RED:", "GREEN:", "REFACTOR:" in testing context |
| Process instructions | "Write tests FIRST", "Write failing test" |
| Section headers | "## TDD Workflow", "### TDD Workflow" |
| Critical markers | "⚠️ CRITICAL: Test-Driven Development" |

**When in doubt, assume TDD is required for:**
- New features with business logic
- Bug fixes (prove the fix with a test)
- Database operations
- API endpoints

---

## Error Handling

| Error | Action |
|-------|--------|
| Uncommitted changes | STOP - user must commit/stash first |
| Issue not found | STOP - verify issue number |
| Git pull fails | STOP - report conflict |
| Build fails | WARN - note baseline, ask to continue |
| Tests fail | WARN - note baseline failures, continue |
| TDD required but skipped | BLOCK - do not allow implementation without TDD |

---

## What This Command Does NOT Do

- Does not write any code
- Does not create worktrees (invoke the `using-git-worktrees` skill manually if workspace isolation is needed)
- Does not skip any verification steps
- Does not auto-commit anything
- Does not bypass TDD requirements when detected in issue

---

## Example: Issue WITH TDD Requirement

```
User: /start-work 262

Claude:
Checking for uncommitted changes... Clean.
Fetching issue #262 from GitHub...
Found: "feat(ux): Settings and interaction page UX improvements"

⚠️ TDD DETECTED: This issue explicitly requires Test-Driven Development.
  - Found: "⚠️ CRITICAL: Test-Driven Development Required"
  - Found: "Invoke the `test-driven-development` skill"
  - Found: "TDD Workflow" sections

Syncing with main... Done.
Creating branch: feature/262-ux-ui-improvements
Running build... PASS
Running tests... 1086 passing, 0 failing

============================================
⚠️  TDD ENFORCEMENT ACTIVE
============================================

Issue:    #262 - feat(ux): Settings and interaction page UX improvements
Branch:   feature/262-ux-ui-improvements
Base:     main @ abc1234

Baseline Status:
  Build:  PASS
  Tests:  1086 passing, 0 failing

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 THIS ISSUE REQUIRES TEST-DRIVEN DEVELOPMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Invoking test-driven-development skill now...

[TDD skill content displayed]

Issue Details:
---
[Full issue body with TDD workflow sections]
---

Ready to begin TDD workflow. Start with your first failing test.
```

## Example: Issue WITHOUT TDD Requirement

```
User: /start-work 198

Claude:
Checking for uncommitted changes... Clean.
Fetching issue #198 from GitHub...
Found: "Update README with new setup instructions"
Syncing with main... Done.
Creating branch: docs/198-update-readme
Running build... PASS
Running tests... 1086 passing, 0 failing

============================================
READY TO START WORK
============================================

Issue:    #198 - Update README with new setup instructions
Branch:   docs/198-update-readme
Base:     main @ abc1234

Baseline Status:
  Build:  PASS
  Tests:  1086 passing, 0 failing

Next Steps:
1. Review the issue requirements below
2. Plan your implementation approach
3. Consider TDD for new features (recommended)
4. Implement the feature
5. Run /ship-it when complete

Issue Details:
---
[Issue body]
---
============================================
```
