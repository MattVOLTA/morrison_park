# Migration Patterns

Safe migration strategies for common schema changes in impactOS.

## General Principles

1. **Additive First**: Add new, migrate data, then remove old
2. **Zero Downtime**: Avoid migrations that lock tables
3. **Reversible**: Every migration should have a rollback plan
4. **Tenant-Safe**: Never expose cross-tenant data during migration
5. **Test with Production Data**: Staging should mirror production volume

---

## Column Removal (3-Phase Deploy)

**Risk Level:** 🔴 Critical if column has data

### The Wrong Way
```sql
-- DON'T DO THIS - Instant breakage
ALTER TABLE companies DROP COLUMN old_field;
```

### The Right Way

**Phase 1: Stop Writing**
```typescript
// Remove all writes to the column
// Deploy and verify no new data is written
```

**Phase 2: Stop Reading**
```typescript
// Remove all reads from the column
// Update types to remove the field
// Deploy and verify app works without column
```

**Phase 3: Remove Column**
```sql
-- Now safe to remove
ALTER TABLE companies DROP COLUMN old_field;
```

### Rollback Plan
- Keep column backup in separate table
- Or use `pg_dump` for the column data before removal

---

## Column Rename (Dual-Write Pattern)

**Risk Level:** 🟠 High

### The Wrong Way
```sql
-- DON'T DO THIS - Breaks all references instantly
ALTER TABLE contacts RENAME COLUMN old_name TO new_name;
```

### The Right Way

**Phase 1: Add New Column**
```sql
ALTER TABLE contacts ADD COLUMN new_name TEXT;
```

**Phase 2: Dual Write**
```typescript
// Write to BOTH columns
await db.update(contacts).set({
  old_name: value,
  new_name: value  // Write to both
});
```

**Phase 3: Backfill**
```sql
UPDATE contacts SET new_name = old_name WHERE new_name IS NULL;
```

**Phase 4: Switch Reads**
```typescript
// Read from new column
const name = contact.new_name;
```

**Phase 5: Stop Old Writes**
```typescript
// Write only to new column
await db.update(contacts).set({
  new_name: value
});
```

**Phase 6: Remove Old Column**
```sql
ALTER TABLE contacts DROP COLUMN old_name;
```

---

## Adding NOT NULL Constraint

**Risk Level:** 🟠 High

### The Wrong Way
```sql
-- DON'T DO THIS - Fails if any NULLs exist
ALTER TABLE companies ALTER COLUMN status SET NOT NULL;
```

### The Right Way

**Step 1: Add with Default**
```sql
ALTER TABLE companies
ADD COLUMN status TEXT DEFAULT 'active';
```

**Step 2: Backfill Existing**
```sql
UPDATE companies
SET status = 'active'
WHERE status IS NULL;
```

**Step 3: Add Constraint**
```sql
ALTER TABLE companies
ALTER COLUMN status SET NOT NULL;
```

**Step 4: Remove Default (Optional)**
```sql
ALTER TABLE companies
ALTER COLUMN status DROP DEFAULT;
```

---

## Adding Foreign Key

**Risk Level:** 🟠 High (orphaned data risk)

### The Wrong Way
```sql
-- DON'T DO THIS - Fails if orphaned references exist
ALTER TABLE contacts
ADD CONSTRAINT fk_company
FOREIGN KEY (company_id) REFERENCES companies(id);
```

### The Right Way

**Step 1: Find Orphans**
```sql
SELECT c.id, c.company_id
FROM contacts c
LEFT JOIN companies co ON c.company_id = co.id
WHERE c.company_id IS NOT NULL
  AND co.id IS NULL;
```

**Step 2: Handle Orphans**
```sql
-- Option A: Delete orphans (if appropriate)
DELETE FROM contacts
WHERE company_id NOT IN (SELECT id FROM companies);

-- Option B: Set to NULL (if nullable)
UPDATE contacts SET company_id = NULL
WHERE company_id NOT IN (SELECT id FROM companies);

-- Option C: Create placeholder company
INSERT INTO companies (id, tenant_id, name)
SELECT DISTINCT company_id, tenant_id, 'Unknown Company'
FROM contacts
WHERE company_id NOT IN (SELECT id FROM companies);
```

**Step 3: Add Constraint**
```sql
ALTER TABLE contacts
ADD CONSTRAINT fk_company
FOREIGN KEY (company_id) REFERENCES companies(id);
```

---

## Adding Index on Large Table

**Risk Level:** 🟡 Medium (lock concerns)

### The Wrong Way
```sql
-- DON'T DO THIS - Locks table for writes
CREATE INDEX idx_companies_name ON companies(name);
```

### The Right Way (PostgreSQL)
```sql
-- CONCURRENTLY prevents write locks
CREATE INDEX CONCURRENTLY idx_companies_name ON companies(name);
```

**Notes:**
- Takes longer but doesn't block writes
- Cannot run inside a transaction
- Monitor for lock contention
- Schedule during low-traffic period for very large tables

---

## Adding Unique Constraint

**Risk Level:** 🟠 High (duplicate data risk)

### The Wrong Way
```sql
-- DON'T DO THIS - Fails if duplicates exist
ALTER TABLE contacts ADD CONSTRAINT unique_email UNIQUE(email);
```

### The Right Way

**Step 1: Find Duplicates**
```sql
SELECT email, COUNT(*), array_agg(id)
FROM contacts
WHERE email IS NOT NULL
GROUP BY email
HAVING COUNT(*) > 1;
```

**Step 2: Resolve Duplicates**
```sql
-- Keep most recent, delete others
DELETE FROM contacts a
USING contacts b
WHERE a.email = b.email
  AND a.created_at < b.created_at;
```

**Step 3: Add Constraint**
```sql
ALTER TABLE contacts
ADD CONSTRAINT unique_email UNIQUE(email);
```

---

## Creating New Table (Multi-Tenant)

**Risk Level:** 🟡 Medium

### Required Pattern for impactOS

```sql
-- Step 1: Create table with tenant isolation
CREATE TABLE new_feature (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  -- your columns here
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Step 2: Enable RLS
ALTER TABLE new_feature ENABLE ROW LEVEL SECURITY;

-- Step 3: Create tenant isolation policy
CREATE POLICY tenant_isolation ON new_feature
  FOR ALL
  USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid)
  WITH CHECK (tenant_id = (auth.jwt()->>'tenant_id')::uuid);

-- Step 4: Create index on tenant_id
CREATE INDEX idx_new_feature_tenant ON new_feature(tenant_id);

-- Step 5: Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON new_feature TO authenticated;
```

---

## Changing Column Type

**Risk Level:** 🟠 High

### Assessment Questions
1. Is the new type compatible? (e.g., TEXT to VARCHAR is usually safe)
2. Is there data that won't convert?
3. What's the table size?

### Safe Type Changes
| From | To | Notes |
|------|-----|-------|
| VARCHAR(N) | TEXT | Always safe |
| INTEGER | BIGINT | Always safe |
| TIMESTAMP | TIMESTAMPTZ | Usually safe |
| TEXT | VARCHAR(N) | Check max length first |

### Unsafe Type Changes (Require Migration)
| From | To | Risk |
|------|-----|------|
| TEXT | INTEGER | Parse failures |
| DECIMAL(10,2) | DECIMAL(8,2) | Precision loss |
| JSONB | TEXT | Loss of query capability |

### Safe Pattern
```sql
-- Check data first
SELECT MAX(LENGTH(column_name)) FROM table_name;

-- Verify conversion
SELECT column_name, column_name::new_type
FROM table_name
WHERE column_name IS NOT NULL
LIMIT 100;

-- Then alter
ALTER TABLE table_name
ALTER COLUMN column_name TYPE new_type;
```

---

## Enum Modifications

**Risk Level:** 🟡 Medium

### Adding Values (Safe)
```sql
ALTER TYPE status_enum ADD VALUE 'new_status';
```

### Removing Values (Dangerous)
1. Verify no rows use the value
2. Update rows to new value
3. Cannot easily remove from enum in PostgreSQL
4. Consider migrating to TEXT with CHECK constraint

### Renaming Values (Complex)
```sql
-- Create new enum
CREATE TYPE status_enum_new AS ENUM ('active', 'inactive', 'renamed');

-- Update column
ALTER TABLE companies
ALTER COLUMN status TYPE status_enum_new
USING status::text::status_enum_new;

-- Drop old enum
DROP TYPE status_enum;

-- Rename new enum
ALTER TYPE status_enum_new RENAME TO status_enum;
```

---

## Rollback Strategies

### For Additive Changes
```sql
-- Simply drop what was added
ALTER TABLE companies DROP COLUMN new_column;
DROP TABLE new_table;
```

### For Destructive Changes
1. **Before migration**: Create backup
```sql
CREATE TABLE _backup_old_column AS
SELECT id, old_column FROM table_name;
```

2. **To rollback**: Restore from backup
```sql
ALTER TABLE table_name ADD COLUMN old_column TYPE;
UPDATE table_name t SET old_column = b.old_column
FROM _backup_old_column b WHERE t.id = b.id;
```

### For Data Migrations
- Always keep source data until migration is verified
- Log transformation mappings for reversal
- Test rollback procedure before production deployment
