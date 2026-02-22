# Known Issues

Historical problems and gotchas to watch for when modifying the impactOS database schema.

> **Purpose:** This file captures lessons learned from past schema changes. Add new entries when issues are discovered during development or production incidents.

---

## Active Issues

### Contact Emails Table Separation

**Added:** December 2024
**Severity:** 🟠 High (data integrity)

**Issue:** Email addresses are stored in `contact_emails` table, NOT as a column on `contacts` table.

**Why This Matters:**
- Supports multiple emails per contact
- Primary email flagged with `is_primary`
- Legacy code may assume `contacts.email` exists (it doesn't)

**Watch For:**
- Code referencing `contact.email` - should be `contact.emails[0]` or similar
- Queries that SELECT from contacts expecting email field
- Form submissions that try to update `contacts.email`

**Correct Pattern:**
```typescript
// Get primary email
const primaryEmail = await db.query.contactEmails.findFirst({
  where: and(
    eq(contactEmails.contactId, contactId),
    eq(contactEmails.isPrimary, true)
  )
});

// Or via join
const contactWithEmail = await getContactWithPrimaryEmail(contactId);
```

---

### Tenant ID in JWT Claims

**Added:** December 2024
**Severity:** 🔴 Critical (security)

**Issue:** The `tenant_id` for RLS comes from JWT claims, not from a request parameter.

**Why This Matters:**
- RLS policies use `auth.jwt()->>'tenant_id'`
- Custom access token hook injects this claim
- If hook fails, tenant_id is null and RLS blocks all access

**Watch For:**
- New tables must have RLS that checks JWT tenant_id
- Service role connections bypass this (use carefully)
- Token refresh issues may cause temporary access loss

**Debug Pattern:**
```sql
-- Check current JWT claims
SELECT auth.jwt();

-- Verify tenant_id claim exists
SELECT auth.jwt()->>'tenant_id';
```

---

### Form Submission JSON Schema

**Added:** December 2024
**Severity:** 🟡 Medium (compatibility)

**Issue:** `form_submissions.data` uses JSONB with dynamic schema based on `forms.schema`.

**Why This Matters:**
- Schema validation happens at application layer, not database
- Old submissions may not match current form schema
- Reporting queries must handle schema evolution

**Watch For:**
- Adding required fields to forms - old submissions won't have them
- Renaming form fields - breaks historical data access
- Type changes in form fields - may cause query errors

**Safe Pattern:**
```typescript
// Always use optional chaining for form data access
const revenue = submission.data?.revenue ?? null;

// Handle missing fields gracefully
const metrics = {
  revenue: submission.data?.revenue ?? 'N/A',
  employees: submission.data?.employeeCount ?? 'Not reported',
};
```

---

## Resolved Issues

### Migration: contacts.email → contact_emails

**Resolved:** November 2024
**Original Severity:** 🔴 Critical

**What Happened:**
- Original schema had `contacts.email` column
- Migrated to separate `contact_emails` table
- Some DAL functions still referenced old column

**Resolution:**
- Created migration to move data to `contact_emails`
- Updated all DAL functions
- Added is_primary flag for backwards compatibility
- Dropped old column after verification

**Lessons:**
1. Search ALL code for column references before migration
2. Use TypeScript to catch missing properties
3. Run migration on staging with production data copy

---

### RLS Policy Missing on milestone_tracks

**Resolved:** December 2024
**Original Severity:** 🔴 Critical

**What Happened:**
- `milestone_tracks` table was created without RLS
- Tenants could see each other's milestone configurations
- Caught during security audit

**Resolution:**
- Added RLS policy with tenant isolation
- Verified no data leakage occurred
- Added RLS check to table creation checklist

**Lessons:**
1. New table creation should include RLS as step 1
2. Security audit should run after every schema change
3. Added RLS verification to Database Auditor checks

---

### Cascade Delete on Programs

**Resolved:** November 2024
**Original Severity:** 🟠 High

**What Happened:**
- `programs` had ON DELETE CASCADE for `program_enrollments`
- Deleting a program deleted all enrollment history
- Business wanted to preserve historical data

**Resolution:**
- Changed to ON DELETE SET NULL for archived programs
- Added `archived_at` timestamp instead of deletion
- Updated DAL to filter out archived programs by default

**Lessons:**
1. Consider historical data needs before adding CASCADE
2. Soft delete often better than hard delete
3. Audit what will be deleted before migration

---

## Patterns to Avoid

### 1. Direct Supabase Queries Outside DAL

**Don't:**
```typescript
// In a component or server action
const { data } = await supabase.from('companies').select();
```

**Do:**
```typescript
// In DAL
export async function getCompanies() { ... }

// In component/action
const companies = await getCompanies();
```

### 2. Hardcoded Tenant IDs

**Don't:**
```typescript
const companies = await db.query.companies.findMany({
  where: eq(companies.tenantId, '8b1ef478-...')
});
```

**Do:**
```typescript
// Tenant ID comes from session
const { tenantId } = await getSession();
const companies = await db.query.companies.findMany({
  where: eq(companies.tenantId, tenantId)
});
```

### 3. Raw SQL Without RLS Consideration

**Don't:**
```typescript
// Bypasses RLS if using service role
await supabase.rpc('custom_aggregate', { table: 'companies' });
```

**Do:**
```typescript
// Ensure function respects RLS or add explicit tenant filter
await supabase.rpc('custom_aggregate', {
  table: 'companies',
  tenant_id: tenantId
});
```

---

## Adding New Issues

When you discover a schema-related issue:

1. **Determine severity:**
   - 🔴 Critical: Security or data loss risk
   - 🟠 High: Application errors or coordination required
   - 🟡 Medium: Needs attention but manageable
   - 🟢 Low: Nice to know

2. **Document:**
   - What the issue is
   - Why it matters
   - What to watch for
   - Correct pattern to follow

3. **If resolved:**
   - Move to "Resolved Issues" section
   - Add lessons learned
   - Keep for historical reference
