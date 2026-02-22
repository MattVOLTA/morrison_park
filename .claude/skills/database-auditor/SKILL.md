---
name: database-auditor
description: "Analyzes proposed database schema changes for risks and codebase impact. Use when planning table/column changes, migrations, or schema modifications. Spawns subagents for comprehensive impact analysis."
triggers:
  - planning database changes
  - schema modifications
  - migration risk assessment
  - data model changes
---

# Database Change Auditor

## When to Use

This skill is automatically invoked when:
- A GitHub issue contains `## Proposed Data Model Changes`
- A developer requests database schema analysis
- Planning features that involve data model modifications

The database-auditor agent reads this skill to understand how to analyze changes in the context of this specific system.

## System Context

**Platform**: impactOS - Multi-tenant SaaS for accelerator/incubator reporting
**Database**: Supabase (PostgreSQL with Row-Level Security)
**ORM**: Drizzle
**Critical Pattern**: All database operations through `app/lib/dal/` (Data Access Layer)

### Multi-Tenant Architecture

Every tenant-data table MUST have:
1. `tenant_id` column (UUID, NOT NULL)
2. RLS policy filtering by `auth.jwt()->>'tenant_id'`
3. Foreign key to `tenants(id)` with appropriate cascade

**Test Tenants** (do not modify production data):
- Day One: `8b1ef478-...` (Primary Test)
- Beta: `2222...` (Isolation Tests)
- Gamma: `3333...` (Restricted)
- Volta: `1111...` (Legacy Demo)

## Analysis Workflow

### Step 1: Parse Proposed Changes

Extract from the issue:
```markdown
## Proposed Data Model Changes

### Change Type
- [ ] New table(s)
- [ ] Modified existing table(s)
- [ ] Removed table(s) or column(s)
- [ ] No database changes

### Tables Affected
**Table:** [name]
**Action:** [create | modify | remove]
**Changes:** [column definitions]
```

### Step 2: Load Current Schema

Use Supabase MCP tools to query live schema:
```
mcp__Multi_Tenant__list_tables
mcp__Multi_Tenant__execute_sql
```

Or read from migration history if MCP unavailable.

### Step 3: Spawn Subagents

Delegate specialized analysis:

1. **Reference Scanner** - Find all codebase references
2. **Schema Parser** - Understand current structure
3. **Risk Classifier** - Evaluate against taxonomy

### Step 4: Synthesize Results

Combine findings into actionable audit report.

## Reference Files

Load these for domain knowledge:

| File | Purpose |
|------|---------|
| `risk-taxonomy.md` | Risk classification rules |
| `migration-patterns.md` | Safe migration strategies |
| `codebase-conventions.md` | Where queries live in this codebase |
| `schema-reference.md` | Current schema documentation |
| `known-issues.md` | Historical problems to watch for |

## Output Format

The audit comment must include:

```markdown
## 🔍 Database Audit Results

**Risk Level:** 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low

### Proposed Changes (As Understood)
[Summary of what changes are being proposed]

### Affected Code
| File | Line | Reference Type | Impact |
|------|------|----------------|--------|
| path/to/file.ts | 23 | DAL function | Must update |

### Risk Assessment
- **[Risk 1]**: [reasoning]
- **[Risk 2]**: [reasoning]

### Recommended Migration Approach
1. [Step 1]
2. [Step 2]

### Questions
- [Clarifying questions if any]
```

## Key Principles

1. **Catch issues early** - The goal is to identify problems before code is written
2. **Be specific** - Reference exact files, lines, and reasons
3. **Be actionable** - Every risk should have a remediation path
4. **Respect multi-tenancy** - Always verify tenant isolation
5. **Document intent** - The issue becomes the record of why changes were made
