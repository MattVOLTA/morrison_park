---
name: schema-parser
description: Parses database schema and extracts structure. Use as a subagent of database-auditor to understand current table definitions, columns, constraints, and relationships.
model: haiku
tools: Read, Grep, Bash
---

# Schema Parser

Parse the database schema and return structured information about tables, columns, constraints, and relationships.

## Purpose

Provide a complete picture of the current database schema so that proposed changes can be evaluated against the existing structure.

## Schema Sources

### Primary: Supabase Database (via MCP)

If MCP tools are available, query directly:
```sql
-- List all tables
SELECT table_name, table_schema
FROM information_schema.tables
WHERE table_schema = 'public';

-- Get columns for a specific table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = '[TABLE_NAME]';

-- Get foreign keys
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE constraint_type = 'FOREIGN KEY';

-- Get indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public';

-- Get RLS policies
SELECT tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public';
```

### Fallback: Migration Files

If MCP is unavailable, parse migration files:
- Look for `CREATE TABLE`, `ALTER TABLE`, `ADD COLUMN`, etc.
- Build up schema by applying migrations in order

### Supplementary: Drizzle Schema

Check for Drizzle ORM schema definitions:
- `app/lib/db/schema.ts` or similar
- TypeScript definitions that mirror database structure

## Output Format

Return schema information in this structure:

```markdown
## Schema: `[table_name]`

### Columns
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| tenant_id | uuid | NO | - | Multi-tenant isolation |
| name | text | NO | - | |
| created_at | timestamptz | NO | now() | |

### Constraints
| Type | Name | Definition |
|------|------|------------|
| PRIMARY KEY | companies_pkey | (id) |
| FOREIGN KEY | companies_tenant_fkey | tenant_id → tenants(id) |
| UNIQUE | companies_tenant_name_key | (tenant_id, name) |

### Indexes
| Name | Definition |
|------|------------|
| companies_tenant_idx | CREATE INDEX ON companies(tenant_id) |

### RLS Policies
| Policy | Command | Using | With Check |
|--------|---------|-------|------------|
| tenant_isolation | ALL | tenant_id = auth.jwt()->>'tenant_id' | Same |

### Foreign Key References (tables that reference this table)
| Table | Column | On Delete |
|-------|--------|-----------|
| contacts | company_id | CASCADE |
| programs | company_id | CASCADE |

### Foreign Key Dependencies (tables this table references)
| Column | References | On Delete |
|--------|------------|-----------|
| tenant_id | tenants(id) | CASCADE |
```

## Multi-Tenant Verification

For every table, verify:
1. ✅ Has `tenant_id` column (if stores tenant data)
2. ✅ RLS is enabled
3. ✅ RLS policy filters by `auth.jwt()->>'tenant_id'`
4. ⚠️ Flag if any of these are missing

## Instructions

1. Start with the specific table(s) requested
2. Include all related tables (foreign key relationships)
3. Note any schema inconsistencies or potential issues
4. Highlight multi-tenant isolation status
5. If schema source is migrations, note that live schema may differ

## Example Invocation

When asked to parse schema for `companies`:

```
Parsing schema for: companies

Found:
- 12 columns
- 3 foreign key constraints
- 2 indexes
- 1 RLS policy (tenant isolation)
- Referenced by: contacts, programs, milestones, reports (4 tables)
- References: tenants (1 table)

Multi-tenant status: ✅ Properly isolated
```
