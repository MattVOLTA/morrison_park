---
name: changelog-writer
description: "Writes professional changelogs following Anthropic-style patterns. Use when creating release notes, documenting product updates, or writing changelog entries. Handles security items with appropriate positive framing. Analyzes git history to generate user-focused release notes."
---

# Changelog Writer

## Purpose

Generate professional, user-focused changelogs that follow Anthropic's release notes patterns. This skill ensures security-related changes are framed positively as capabilities rather than exposing vulnerabilities.

## When to Use

- Writing release notes for a new version
- Documenting product updates for users
- Analyzing git history to create changelog entries
- Reviewing existing changelog entries for tone/style

## Core Principles

### 1. User-Focused Language
Write for end users, not developers. Describe what users can now **do**, not what was changed internally.

| Developer-Focused | User-Focused |
|-------------------|--------------|
| "Added tenant_id validation to API" | "Form submissions now validate organization membership" |
| "Fixed RLS policy on contacts table" | "Contact data access is now properly scoped to your organization" |
| "Migrated from Apify to ScrapingDog" | "LinkedIn enrichment now provides more accurate employee counts" |

### 2. Positive Action Language
Always use active, positive phrasing. Start entries with "We've...":

- "We've launched..." (new features)
- "We've added..." (new capabilities)
- "We've improved..." (enhancements)
- "We've updated..." (changes)
- "We've resolved..." (bug fixes - use sparingly)

### 3. Security Reframing (CRITICAL)
**Never mention vulnerabilities, exploits, or security issues directly.** Always reframe as capability additions. See [reference/security-phrasing.md](reference/security-phrasing.md) for patterns.

### 4. Structure
Follow Anthropic's reverse-chronological, date-based structure:

```markdown
## January 2026

### January 5, 2026
- We've launched **Feature Name**, a new capability for [user benefit].
  - Sub-feature detail one
  - Sub-feature detail two
- We've improved [existing feature] with [enhancement].
```

## Workflow

### Step 1: Gather Commits
```bash
git log --oneline --since="YYYY-MM-DD" | head -100
```

### Step 2: Categorize Changes
Group commits into these categories (in order of importance):

1. **Major Features** (bold headers, bullet details)
2. **Improvements** (enhancements to existing features)
3. **Fixed** (resolved issues - user-facing only)
4. **Infrastructure** (usually omit unless user-impacting)

### Step 3: Identify Security Items
Scan for commits containing: security, XSS, injection, RLS, auth, vulnerability, sanitize, escape, encrypt

Apply security reframing patterns from [reference/security-phrasing.md](reference/security-phrasing.md).

### Step 4: Write Entries
Apply templates from [reference/entry-templates.md](reference/entry-templates.md).

### Step 5: Review Against Checklist
- [ ] All entries start with "We've..."
- [ ] No security vulnerabilities mentioned
- [ ] User benefits clear (not implementation details)
- [ ] Major features have bold headers
- [ ] Dates in reverse chronological order
- [ ] Consistent terminology throughout

## Categories

Use these visual markers for in-app changelogs (optional for docs):

| Category | Marker | When to Use |
|----------|--------|-------------|
| New | `✨` | Brand new features |
| Improved | `🔧` | Enhancements to existing features |
| Fixed | `🐛` | Bug fixes (user-facing only) |
| Changed | `⚠️` | Breaking changes or behavior changes |

## What to Omit

Never include in public changelogs:

- Security vulnerability fixes (reframe or omit)
- Internal refactoring without user impact
- Test infrastructure changes
- Developer tooling updates
- Build/CI pipeline changes
- Dependency updates (unless user-facing)

## Reference Files

- [Security Phrasing Patterns](reference/security-phrasing.md) - How to reframe security fixes
- [Entry Templates](reference/entry-templates.md) - Copy-paste templates for common entry types

## Example Output

```markdown
## December 2025

### December 22, 2025
- We've added context-aware template handling for email content, ensuring special characters display correctly across email clients.

### December 21, 2025
- We've added form-based validation to the public companies API for improved data access controls.
- We've enabled enhanced access policies on reference data tables.
- Organization deletion now requires owner-level permissions.

### December 18, 2025
- We've launched the **Admin Enrichment Dashboard**, providing visibility into company enrichment status across all organizations.
  - View pending and enriched companies
  - Trigger enrichment workflows manually
  - Monitor job status in real-time
```

Notice: No mention of "fixed vulnerability", "patched security issue", or "addressed exploit".
