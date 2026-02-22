# Changelog Entry Templates

## Major Feature Launch

Use for significant new capabilities that deserve highlighting.

```markdown
### [Date]
- We've launched **[Feature Name]**, [one-sentence user benefit].
  - [Key capability 1]
  - [Key capability 2]
  - [Key capability 3]
```

**Example:**
```markdown
### January 3, 2026
- We've launched **Advisor Profiles**, a new module for managing external advisors and mentors.
  - Create advisor profiles linked to existing contacts
  - Automatic LinkedIn enrichment pulls professional background
  - Track advisor engagements and assign support activities
```

## Feature Enhancement

Use for meaningful improvements to existing features.

```markdown
### [Date]
- We've improved [existing feature] with [specific enhancement].
```

**Example:**
```markdown
### December 15, 2025
- We've improved the enrichment pipeline with Axial API integration, enabling more reliable data extraction with real-time status updates.
```

## New Capability (Non-Major)

Use for smaller additions that don't warrant a full feature callout.

```markdown
### [Date]
- We've added [capability] to [feature/area], enabling [user benefit].
```

**Example:**
```markdown
### November 28, 2025
- We've added Google OAuth as an authentication option alongside email/password login.
```

## Bug Fix (User-Facing)

Use sparingly, only for fixes users would have noticed. Focus on the resolution, not the problem.

```markdown
### [Date]
- [Feature/Area] now [correct behavior].
```

**Example:**
```markdown
### December 28, 2025
- Form submission status now accurately reflects enrollment state, preventing false "overdue" warnings for non-enrolled companies.
```

**Alternative format:**
```markdown
- We've resolved a display issue affecting [specific element] in [location].
```

## UI/UX Improvement

Use for visual or usability changes.

```markdown
### [Date]
- We've [updated/redesigned/standardized] [UI element] for [benefit].
```

**Example:**
```markdown
### January 5, 2026
- We've standardized spacing and data table patterns across the platform for improved visual consistency.
```

## Integration Update

Use for third-party service changes.

```markdown
### [Date]
- We've [integrated/updated/migrated to] [service] for [feature], providing [user benefit].
```

**Example:**
```markdown
### December 5, 2025
- We've migrated LinkedIn enrichment to ScrapingDog, providing more accurate employee counts and additional company data.
```

## Access Control Change (Security Reframe)

Use for permission/role changes. Never mention what was wrong.

```markdown
### [Date]
- [Action] now requires [role]-level permissions.
```

**Example:**
```markdown
### December 21, 2025
- Organization deletion now requires owner-level permissions.
```

## Data Policy Enhancement (Security Reframe)

Use for RLS/access policy additions. Never mention missing policies.

```markdown
### [Date]
- We've enabled enhanced access policies on [data type] data.
```

**Example:**
```markdown
### December 21, 2025
- We've enabled enhanced access policies on demographic and industry reference data.
```

## Validation Improvement (Security Reframe)

Use for input validation, API security additions.

```markdown
### [Date]
- We've added [type] validation to the [endpoint/feature] for improved [data integrity/access controls].
```

**Example:**
```markdown
### December 21, 2025
- We've added form-based validation to the public companies API for improved data access controls.
```

## Removal/Deprecation

Use when removing features (rare in changelogs).

```markdown
### [Date]
- We've removed [feature] in favor of [replacement/reason].
```

**Example:**
```markdown
### November 15, 2025
- We've removed the Dashboard in favor of Companies as the default landing page, streamlining navigation.
```

## Multi-Item Day

When multiple changes on one day, group logically:

```markdown
### December 21, 2025
- We've added form-based validation to the public companies API for improved data access controls.
- We've enabled enhanced access policies on demographic and industry reference data.
- Organization deletion now requires owner-level permissions.
```

## Monthly Summary Header

For month groupings:

```markdown
## [Month] [Year]

### [Full Date]
- Entry 1
- Entry 2
```

**Example:**
```markdown
## December 2025

### December 30, 2025
- We've launched **Support Engagements with OKR Tracking**, a structured way to document and measure advisor support.
```

## Category Markers (Optional)

For in-app changelogs, you may add visual markers:

```markdown
### January 5, 2026

#### ✨ New
- **Advisor Profiles** - Create and manage external advisor profiles with LinkedIn enrichment

#### 🔧 Improved
- Standardized spacing and data table patterns across the platform

#### 🐛 Fixed
- Form submission status now accurately reflects enrollment state
```

## Common Phrases Library

**Feature launches:**
- "We've launched..."
- "We've introduced..."
- "...is now available"

**Improvements:**
- "We've improved..."
- "We've enhanced..."
- "We've updated..."
- "...now supports..."
- "...now includes..."

**Fixes (use sparingly):**
- "We've resolved..."
- "...now correctly..."
- "...now properly..."
- "...now accurately..."

**Removals:**
- "We've removed..."
- "We've retired..."
- "...has been deprecated"

**Avoid:**
- "Fixed bug where..."
- "Patched..."
- "Addressed issue..."
- "Bug fix:"
- "Hotfix:"
