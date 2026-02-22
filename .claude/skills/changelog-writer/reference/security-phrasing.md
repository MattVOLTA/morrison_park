# Security Phrasing Patterns

## Golden Rule

**Never describe what was wrong. Only describe what is now possible or improved.**

Anthropic's approach: They never mention vulnerabilities, exploits, or security issues in changelogs. Instead, they describe capability improvements or simply omit entries that would require explaining a vulnerability.

## Reframing Patterns

### Pattern 1: Capability Addition
Transform "fixed X vulnerability" into "added X capability":

| Actual Issue | Changelog Entry |
|--------------|-----------------|
| Fixed SQL injection in search | "We've added parameterized query handling to search" |
| Fixed XSS in email templates | "We've added context-aware template handling for email content" |
| Fixed CSRF vulnerability | "We've added request origin validation for form submissions" |
| Fixed open redirect | **OMIT** (or) "We've updated authentication redirect handling" |

### Pattern 2: Access Control Enhancement
Transform "fixed missing authorization" into "enhanced access controls":

| Actual Issue | Changelog Entry |
|--------------|-----------------|
| Fixed missing RLS on table | "We've enabled enhanced access policies on [table] data" |
| Fixed tenant data leakage | "Data access is now properly scoped to your organization" |
| Fixed unauthorized API access | "We've added [type] validation to the [endpoint] API" |
| Fixed privilege escalation | "[Action] now requires [role]-level permissions" |

### Pattern 3: Improved Validation
Transform "fixed bypass" into "improved validation":

| Actual Issue | Changelog Entry |
|--------------|-----------------|
| Fixed auth bypass | "We've improved authentication validation" |
| Fixed input validation bypass | "We've enhanced input validation for [feature]" |
| Fixed rate limit bypass | "We've improved rate limiting for [endpoint]" |

### Pattern 4: Complete Omission
Some fixes should simply not appear in changelogs:

**Always omit:**
- Open redirect fixes
- Session fixation fixes
- Cryptographic weakness fixes
- Information disclosure fixes
- Any fix that would require explaining the attack vector

**Rationale:** Including these would either:
1. Alert attackers to previously exploitable vulnerabilities
2. Damage user trust by revealing security gaps
3. Require technical explanations inappropriate for user-facing docs

## Real Examples from impactOS

### Example 1: Public API Vulnerability
**Commit:** `fix(security): address critical and high priority security audit findings`

**What happened:** Public companies API allowed unauthorized tenant data enumeration

**BAD changelog entry:**
> Fixed security vulnerability in public companies API that allowed unauthorized access to other tenants' data

**GOOD changelog entry:**
> We've added form-based validation to the public companies API for improved data access controls.

### Example 2: Missing RLS
**Commit:** `fix(security): address critical and high priority security audit findings`

**What happened:** Reference tables (demographic_categories, industries) had no RLS policies

**BAD changelog entry:**
> Fixed missing Row Level Security on reference tables that exposed data

**GOOD changelog entry:**
> We've enabled enhanced access policies on demographic and industry reference data.

### Example 3: XSS in Emails
**Commit:** `feat(email): add round-trip tests and XSS protection for reminder emails`

**What happened:** Company names weren't HTML-escaped in email templates

**BAD changelog entry:**
> Fixed XSS vulnerability in email templates where company names could inject malicious scripts

**GOOD changelog entry:**
> We've added context-aware template handling for email content, ensuring special characters display correctly across email clients.

### Example 4: Role Check Issue
**Commit:** `fix(security): address critical and high priority security audit findings`

**What happened:** Admins could delete organizations (should require owner)

**BAD changelog entry:**
> Fixed security issue where admin users could delete organizations

**GOOD changelog entry:**
> Organization deletion now requires owner-level permissions.

## Severity-Based Guidelines

### Critical/High Severity
Usually best to either:
1. Reframe as capability addition (if possible without hinting at the issue)
2. Omit entirely

### Medium Severity
Can often be mentioned with careful reframing:
- Focus on the improvement, not the fix
- Use passive voice if needed to avoid explaining the issue

### Low Severity
May be mentioned more directly, but still avoid:
- Words like "vulnerability", "exploit", "attack"
- Technical details of the issue
- Any information useful to attackers

## Words to Never Use

| Forbidden | Acceptable Alternative |
|-----------|----------------------|
| vulnerability | improvement, enhancement |
| exploit | (omit) |
| attack | (omit) |
| injection | validation, handling |
| bypass | (omit or restructure) |
| leak | (omit or use "scoped") |
| unauthorized | validation, verification |
| malicious | (omit) |
| security hole | (omit) |
| patch | update, improvement |
| CVE | (never mention) |

## Verification Checklist

Before publishing any changelog entry related to security:

- [ ] Entry does not mention what was broken
- [ ] Entry does not use any forbidden words
- [ ] Entry could not help an attacker understand past vulnerabilities
- [ ] Entry focuses on what users can now do, not what was fixed
- [ ] Entry sounds like a feature addition, not a bug fix
- [ ] A non-technical user would not suspect a security issue was involved
