# /ship-it - Commit, Push, and Create PR

Ship your completed work with proper commits, PR creation, and cleanup guidance.

## Usage

```
/ship-it
```

No arguments - operates on current branch.

---

## Pre-Conditions

**This command will STOP if:**
- You're on the `main` branch
- Build fails
- There are no changes to commit

---

## Workflow Steps

Execute these steps in order. **STOP and report if any step fails.**

### Step 1: Verify Not on Main

```bash
current_branch=$(git branch --show-current)
```

**If `main`:**
> "You're on the main branch. You should never commit directly to main."
> "Use `/start-work <issue>` to create a feature branch first."
> STOP.

### Step 2: Extract Issue Number from Branch

```bash
# Branch format: type/123-description
# Extract: 123
issue_number=$(git branch --show-current | grep -oE '[0-9]+' | head -1)
```

**If no issue number found:**
> "Could not detect issue number from branch name."
> Ask user: "What issue number is this work for? (or 'none')"

### Step 3: Run Build

```bash
cd /Volumes/SD/impactOS_MT/app
npm run build
```

**If build fails:**
> "Build is failing. You must fix build errors before shipping."
> Show errors and STOP.

**If build passes:** Proceed.

### Step 4: Run Tests

```bash
npm test 2>&1 | tail -30
```

**Record results.** Note: Some pre-existing test failures may be acceptable.

**If NEW test failures (compared to baseline):**
> "Tests are failing. Review the failures:"
> Show failures
> Ask: "Are these pre-existing failures? [y/n]"

### Step 5: Gather Changes

```bash
# Staged and unstaged changes
git status

# Full diff
git diff HEAD --stat

# Detailed diff for commit message
git diff HEAD
```

**Present to user:**
```
Changes to be committed:
  [file list with status]

Summary:
  [X] files changed
  [Y] insertions(+)
  [Z] deletions(-)
```

### Step 6: Compose Commit Message

**Analyze changes and draft conventional commit message.**

**Determine type from changes:**
| Change Type | Commit Type |
|-------------|-------------|
| New feature | `feat` |
| Bug fix | `fix` |
| Documentation | `docs` |
| Refactoring | `refactor` |
| Tests only | `test` |
| Build/deps | `build` |
| Maintenance | `chore` |

**Draft message format:**
```
type(scope): description

[Body explaining what and why]

Closes #[issue-number]
```

**Present to user for approval:**
```
Proposed commit message:
─────────────────────────────────────
feat(reminders): add email reminder scheduling

Implement scheduled email reminders for company update forms.
- Add reminder scheduler script
- Add template variable replacement
- Add Resend email integration
- Add GitHub Actions workflow for daily execution

Closes #198

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
─────────────────────────────────────

Proceed with this message? [yes/edit/cancel]
```

**Wait for user confirmation.** Do not proceed without explicit approval.

### Step 7: Update Changelog (Conditional)

**Determine if changelog entry is needed based on commit type:**

| Commit Type | Changelog Action |
|-------------|------------------|
| `feat` | Always generate entry |
| `fix` (user-facing bug) | Generate entry |
| `fix` (internal/dev bug) | Ask user |
| `refactor`, `chore`, `test`, `build`, `ci`, `docs` | Skip (offer to add if user wants) |

**If changelog entry IS needed:**

1. **Read current CHANGELOG.md** to find insertion point:
   ```bash
   head -50 /Volumes/SD/impactOS_MT/CHANGELOG.md
   ```

2. **Determine insertion point:**
   - If today's date section exists → append to it
   - If today's date section doesn't exist → create new date header
   - If current month section doesn't exist → create new month header

3. **Transform commit message to changelog entry** using changelog-writer skill patterns:

   **Language transformation:**
   | Commit Style | Changelog Style |
   |--------------|-----------------|
   | "add feature X" | "We've added **Feature X**..." |
   | "implement Y" | "We've launched **Y**..." |
   | "improve Z" | "We've improved Z..." |
   | "fix bug in W" | "We've resolved an issue with W..." |

   **Apply security reframing** if commit touches security:
   - Never mention: vulnerability, exploit, security issue, XSS, injection
   - Reframe as: "Added validation", "Enhanced access controls", "Improved data handling"
   - See `.claude/skills/changelog-writer/reference/security-phrasing.md`

4. **Present changelog entry to user:**
   ```
   Proposed changelog entry:
   ─────────────────────────────────────
   ### January 6, 2026
   - We've launched **Email Reminder Scheduling**, enabling automated
     reminders for company update forms.
     - Configurable reminder schedules
     - Template variable replacement
     - Daily automated execution at 8 AM UTC
   ─────────────────────────────────────

   Add to CHANGELOG.md? [yes/edit/skip]
   ```

5. **If approved:**
   - Insert entry at correct position in CHANGELOG.md

6. **Update public changelog page** (`app/(marketing)/changelog/page.tsx`):

   **Map commit type to entry type:**
   | Commit Type | Entry Type |
   |-------------|------------|
   | `feat` | `'feature'` |
   | `fix` | `'fix'` |
   | `refactor`, `chore`, `build`, `ci`, `docs` | `'improvement'` |

   **Read the changelog page and find the `changelogData` array.**

   **If today's date entry exists** in the current month's entries:
   - Append new item to that entry's `items[]` array
   - Update the entry's `title` if needed (e.g., "Bug Fixes" → "Bug Fixes & Improvements")

   **If today's date entry doesn't exist:**
   - Create new entry at the start of the current month's `entries[]` array:
   ```typescript
   {
     date: 'January 6, 2026',
     title: 'Generated Title Based on Content',  // e.g., "AI Reports Bug Fix"
     items: [
       {
         type: 'fix',  // mapped from commit type
         content: 'We\'ve resolved a scrolling issue...',
       }
     ]
   }
   ```

   **Generate day title:**
   - For features: Use feature name (e.g., "Email Reminder Scheduling")
   - For fixes: "Bug Fixes" or specific area (e.g., "AI Reports Bug Fix")
   - For mixed: "Updates & Improvements"

   **If current month section doesn't exist:**
   - Create new month group at the start of `changelogData` array

   - Both CHANGELOG.md and changelog page will be staged in Step 8

**If changelog entry is NOT needed:**
> "This commit type (`refactor`/`test`/etc.) typically doesn't need a changelog entry."
> "Add changelog entry anyway? [yes/no]"

**If user selects 'skip':** Proceed without changelog update.

**If CHANGELOG.md doesn't exist:**
> "No CHANGELOG.md found. Create one? [yes/no]"
> If yes, create with standard header and first entry.

### Step 8: Stage and Commit

```bash
# Stage all changes (includes CHANGELOG.md if updated)
git add -A

# Commit with approved message
git commit -m "$(cat <<'EOF'
[approved commit message here]
EOF
)"
```

### Step 9: Push Branch

```bash
git push -u origin $(git branch --show-current)
```

**If push fails (e.g., remote exists):**
```bash
git push --force-with-lease origin $(git branch --show-current)
```

### Step 10: Create Pull Request

**Compose PR description:**

```markdown
## Summary
[2-3 bullet points from commit]

## Changes
[List of significant changes]

## Test Plan
- [ ] Build passes
- [ ] Tests pass
- [ ] Manual verification completed

## Related Issues
Closes #[issue-number]

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

**Create PR:**
```bash
gh pr create \
  --title "type(scope): description" \
  --body "[PR description]" \
  --base main
```

### Step 11: Report Success and Post-Merge Instructions

```
============================================
PR CREATED SUCCESSFULLY
============================================

PR:       #[pr-number]
URL:      [pr-url]
Branch:   [branch-name] → main

Status:
  Build:     PASS
  Tests:     [X passing]
  Commit:    [commit-hash]
  Changelog: [Updated/Skipped] (CHANGELOG.md + /changelog page)

============================================
⚠️  POST-MERGE CLEANUP (DO THIS AFTER PR MERGES)
============================================

After the PR is merged, run these commands:

  git checkout main
  git pull origin main
  git branch -d [branch-name]

Or run: /cleanup-branches

IMPORTANT: Do NOT continue work on this branch after merge.
           If more work is needed, create a NEW branch.
============================================
```

---

## Error Handling

| Error | Action |
|-------|--------|
| On main branch | STOP - must use feature branch |
| Build fails | STOP - must fix before shipping |
| No changes | STOP - nothing to commit |
| Push rejected | Try --force-with-lease, else report |
| PR creation fails | Show error, provide manual steps |
| CHANGELOG.md malformed | Show error, ask user to fix manually |
| changelog/page.tsx malformed | Show error, update CHANGELOG.md only, warn user |

---

## What This Command Does NOT Do

- Does not merge the PR (that's done via GitHub after review)
- Does not delete the branch (that's post-merge cleanup)
- Does not skip build verification
- Does not commit without user approval of message
- Does not force changelog entries for non-user-facing changes

---

## Example

```
User: /ship-it

Claude:
Verifying branch... On feature/198-send-reminder-emails
Running build... PASS
Running tests... 1086 passing

Changes to commit:
  M  app/lib/email/resend.ts
  A  app/lib/email/template-utils.ts
  A  app/scripts/send-update-form-reminders.ts
  A  .github/workflows/send-reminders.yml
  +  4 files, 523 insertions

Proposed commit message:
─────────────────────────────────────
feat(reminders): add email reminder scheduling for update forms

Implement automated email reminders for company update forms:
- Add reminder scheduler script with template variable replacement
- Add Resend email integration with proper sender formatting
- Add GitHub Actions workflow for daily 8 AM UTC execution
- Add comprehensive test coverage

Closes #198

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
─────────────────────────────────────

Proceed? [yes/edit/cancel]

User: yes

Claude:
Proposed changelog entry:
─────────────────────────────────────
### January 6, 2026
- We've launched **Email Reminder Scheduling**, enabling automated
  reminders for company update forms.
  - Configurable reminder schedules per form
  - Template variable replacement for personalized messages
  - Daily automated execution at 8 AM UTC
─────────────────────────────────────

Add to CHANGELOG.md? [yes/edit/skip]

User: yes

Claude:
Updating CHANGELOG.md... Done.
Updating /changelog page... Done.
Committing... Done.
Pushing to origin... Done.
Creating PR... Done.

============================================
PR CREATED SUCCESSFULLY
============================================

PR:       #47
URL:      https://github.com/user/repo/pull/47
Branch:   feature/198-send-reminder-emails → main

Status:
  Build:     PASS
  Tests:     1086 passing
  Commit:    a1b2c3d
  Changelog: Updated (January 6, 2026) - CHANGELOG.md + /changelog page

[... rest of summary ...]
```

---

## Example: Skipping Changelog

```
User: /ship-it

Claude:
Verifying branch... On chore/update-dependencies
[... build and test pass ...]

Proposed commit message:
─────────────────────────────────────
chore(deps): update react to 19.1.0

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
─────────────────────────────────────

Proceed? [yes/edit/cancel]

User: yes

Claude:
This commit type (`chore`) typically doesn't need a changelog entry.
Add changelog entry anyway? [yes/no]

User: no

Claude:
Skipping changelog update.
Committing... Done.
[... continues ...]
```

---

## Quick Reference: The Full Workflow

```
/start-work 198        # Begin: creates branch, establishes baseline
[... do your work ...]
[... verify it works ...]
/ship-it               # End: commits, pushes, creates PR (with changelog)
[... PR is reviewed and merged via GitHub ...]
/cleanup-branches      # Cleanup: deletes merged branches
```

---

## Related Skills

- **changelog-writer**: Provides patterns for writing changelog entries
  - Location: `.claude/skills/changelog-writer/`
  - Security phrasing: `reference/security-phrasing.md`
  - Entry templates: `reference/entry-templates.md`

## Changelog Locations

| File | Purpose |
|------|---------|
| `CHANGELOG.md` | Internal markdown changelog (root of repo) |
| `app/(marketing)/changelog/page.tsx` | Public `/changelog` page (TypeScript data structure) |
