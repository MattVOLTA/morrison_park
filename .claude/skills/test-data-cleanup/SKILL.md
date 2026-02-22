---
name: test-data-cleanup
description: "Analyzes test code and database to safely identify and remove TDD test data. Use when user asks to clean up test data, purge test records, or remove TDD artifacts from the database. Generates preview for approval before any deletion."
---

# Test Data Cleanup

## Purpose
Safely identify and remove test data created by TDD tests from the Multi_Tenant database. Analyzes both test code patterns and database contents to make informed recommendations.

## Critical Safety Constraints

### NEVER VIOLATE THESE RULES
1. **Database**: Only use `mcp__Multi_Tenant__*` tools - NEVER Single_Tenant
2. **Tenant**: Only clean Volta tenant (`11111111-1111-1111-1111-111111111111`) - NEVER other tenants
3. **Approval**: ALWAYS generate preview file and wait for explicit user approval before ANY deletion
4. **Verification**: After deletion, ALWAYS generate cleanup report

## Workflow

### Phase 1: Analyze Test Code
Examine test files in `app/__tests__/` to understand:
- How tests create data (helper functions, direct inserts)
- Naming patterns used (timestamps, prefixes, known fixtures)
- Which tables receive test data
- Cleanup patterns (what tests should delete but may fail to)

Key files to examine:
- `app/__tests__/helpers/cleanup.ts` - cleanup utilities and patterns
- `app/__tests__/api/helpers.ts` - test data creation helpers
- Test files that create users, companies, contacts, forms

### Phase 2: Analyze Database
Query the Multi_Tenant database for Volta tenant data matching test patterns.

#### User Patterns (auth.users)
```sql
SELECT id, email, created_at
FROM auth.users
WHERE (
    -- New standardized pattern (preferred)
    email LIKE '%@test.impactos.internal'
    -- Legacy patterns
    OR email LIKE '%@test.com'
    OR email LIKE '%@tenant%.test'
    OR email LIKE 'test-%'
    OR email LIKE '%-test-%'
  )
  -- Age threshold: Only consider records created in last 7 days
  -- This prevents false positives from legitimate "Test Kitchen LLC" type companies
  AND created_at > NOW() - INTERVAL '7 days';
```

#### Company Patterns (companies)
```sql
SELECT id, business_name, created_at
FROM companies
WHERE tenant_id = '11111111-1111-1111-1111-111111111111'
  AND (
    -- New standardized pattern (preferred)
    business_name LIKE 'TEST_%'
    -- Legacy patterns
    OR business_name LIKE 'Test Company %'
    OR business_name = 'Tenant 1 Test Company'
    -- NOTE: Do NOT use "Company Without Commitments" - could be legitimate
    -- NOTE: Avoid broad patterns like ILIKE '%test%' - too many false positives
  )
  -- Age threshold: Only consider records created in last 7 days
  AND created_at > NOW() - INTERVAL '7 days';
```

#### Program Patterns (programs)
```sql
SELECT id, name, description, created_at
FROM programs
WHERE tenant_id = '11111111-1111-1111-1111-111111111111'
  AND (
    -- New standardized pattern (preferred)
    name LIKE 'TEST_%'
    -- Legacy test fixtures from contact enrollment tests
    OR name = 'Second Program'
    OR name = 'First Program'
    OR name = 'Test Program'
  )
ORDER BY created_at DESC;
-- NOTE: Programs may not need 7-day filter - exact name matches are reliable
```

#### Contact Patterns (contacts)
```sql
SELECT id, first_name, last_name, created_at
FROM contacts
WHERE tenant_id = '11111111-1111-1111-1111-111111111111'
  AND (
    -- New standardized pattern (preferred): first_name starts with 'Test'
    first_name LIKE 'Test%'
    -- Legacy fixture names
    OR first_name IN (
      'NotEnrolled', 'Mixed', 'Alumni', 'Active', 'BothEnrollments',
      'MultipleCompanies', 'AlumniWithActiveCompany', 'CompanyBased',
      'DirectlyEnrolled', 'Delete'
    )
  )
  -- Age threshold: Only consider records created in last 7 days
  AND created_at > NOW() - INTERVAL '7 days';
```

#### Orphaned Test Tenants
```sql
SELECT id, name, created_at
FROM tenants
WHERE (
    name LIKE 'Delete Test Org%'
    OR name LIKE '%Test Org %'
  )
  -- Age threshold: Only consider records created in last 7 days
  AND created_at > NOW() - INTERVAL '7 days';
```

#### Form Patterns (forms in test tenants)
```sql
SELECT id, title, tenant_id, created_at
FROM forms
WHERE tenant_id = '11111111-1111-1111-1111-111111111111'
  AND (
    title LIKE 'Tenant % Form'
    OR title LIKE 'Test %'
    OR title LIKE 'TEST_%'
  )
  -- Age threshold: Only consider records created in last 7 days
  AND created_at > NOW() - INTERVAL '7 days';
```

### Phase 3: Generate Preview File
Create a markdown file at `app/scripts/test-data-cleanup-preview.md` containing:

1. **Summary**: Total counts per table
2. **Detailed Breakdown**: By pattern type with sample records
3. **SQL Statements**: Exact DELETE statements that will be executed
4. **Warnings**: Any ambiguous cases requiring user decision
5. **Foreign Key Order**: Deletion sequence to avoid constraint violations

#### Preview File Template
```markdown
# Test Data Cleanup Preview
Generated: [timestamp]

## Summary
| Table | Records to Delete |
|-------|-------------------|
| auth.users | X |
| companies | X |
| programs | X |
| company_program_enrollments | X |
| contacts | X |
| ... | ... |

## Detailed Breakdown

### auth.users (X records)
**Patterns found:**
- `test-fireflies-*@test.com`: X records
- `non-admin-*@test.com`: X records

**Sample records:**
- `test-fireflies-123456@test.com` (created: 2025-12-13)
- ...

### [Continue for each table...]

## SQL Statements (Deletion Order)
[Include exact SQL that will run]

## Warnings / Ambiguous Cases
[List any records that might be real data]

## Approval Required
Review the above and respond with "approved" to proceed.
```

### Phase 4: Wait for Approval
**DO NOT PROCEED** until user explicitly approves.

If user requests changes:
- Modify the patterns or exclusions
- Regenerate the preview
- Wait for approval again

### Phase 5: Execute Cleanup
After approval:

1. **Generate SQL script** at `app/scripts/test-data-cleanup-execute.sql`
2. **Execute deletions** using `mcp__Multi_Tenant__execute_sql` in the correct order

#### Safe Deletion Order (Foreign Key Constraints)
**See [table-dependencies.md](table-dependencies.md) for the full dependency graph.**

Delete in this order (leaf to root):
1. Deepest children: `meeting_speakers`, `company_milestones`, `form_submissions`, `interaction_contacts`, `interaction_companies`, `contact_emails`, `company_program_enrollments`
2. Middle layer: `meeting_transcripts`, `fireflies_staged_meetings`, `reports`
3. Parent tables: `interactions`, `report_sessions`, `milestone_definitions`, `contacts`
4. Core entities: `companies`, `forms`, `milestone_tracks`, `programs`
5. Org/User layer: `organization_members`, `user_sessions`, `tenant_config`
6. Root tables: `auth.users` (via admin API), `tenants` (orphaned only)

### Phase 6: Generate Cleanup Report
After execution, create `app/scripts/test-data-cleanup-report.md`:

```markdown
# Test Data Cleanup Report
Executed: [timestamp]

## Results
| Table | Deleted | Errors |
|-------|---------|--------|
| auth.users | X | 0 |
| ... | ... | ... |

## Verification
[Run analysis queries again to confirm cleanup]

## Errors Encountered
[List any errors with details]
```

## Error Handling

### Foreign Key Violations
If a DELETE fails due to FK constraint:
1. Stop execution
2. Report the specific constraint violation
3. Show the user which dependent records exist
4. Ask how to proceed

### Ambiguous Data
If data matches test patterns but might be real:
1. Flag in preview with warning
2. Show context (created_at, related records)
3. Let user decide to include or exclude

## Reference: Test Tenant IDs

| Name | ID | Action |
|------|-------|--------|
| Volta (ACME) | `11111111-1111-1111-1111-111111111111` | Clean test data |
| Beta Test Org | `22222222-2222-2222-2222-222222222222` | DO NOT TOUCH |
| Gamma | `33333333-3333-3333-3333-333333333333` | DO NOT TOUCH |

## Reference: Test Helper Locations

- `app/__tests__/helpers/cleanup.ts` - Cleanup utilities, test tenant IDs, naming helpers
- `app/__tests__/api/helpers.ts` - User/company/form creation helpers

## Reference: Standardized Naming Conventions

**NEW (Preferred)** - Use these patterns for all new tests:

| Entity | Pattern | Example |
|--------|---------|---------|
| Email | `test-{context}-{uniqueId}@test.impactos.internal` | `test-user-12345-1702567890-abc@test.impactos.internal` |
| Company | `TEST_{context}_{uniqueId}` | `TEST_acme_test-12345-1702567890-abc` |
| Contact | `first: Test{context}`, `last: {uniqueId}` | `Testadvisor`, `test-12345-1702567890-abc` |

**Helper Functions** (from `app/__tests__/helpers/cleanup.ts`):

```typescript
import { testEmail, testCompanyName, testContactName, uniqueTestId } from '@/__tests__/helpers/cleanup'

// Generate standardized test email
const email = testEmail('signup')  // test-signup-12345-1702567890-abc@test.impactos.internal

// Generate standardized test company name
const companyName = testCompanyName('widget')  // TEST_widget_test-12345-1702567890-abc

// Generate standardized test contact name
const contact = testContactName('mentor')  // { first: 'Testmentor', last: 'test-12345-1702567890-abc' }

// Generate unique test ID (includes process ID for parallel safety)
const id = uniqueTestId('custom')  // custom-12345-1702567890-abc
```

**Constants**:
- `TEST_EMAIL_DOMAIN` = `test.impactos.internal`
- `TEST_COMPANY_PREFIX` = `TEST_`
- `TEST_CONTACT_PREFIX` = `Test`

## Reference: Age Threshold

All cleanup queries include a 7-day age threshold to prevent false positives:
- Records older than 7 days are excluded from automatic cleanup
- This protects legitimate companies like "Test Kitchen LLC"
- For older test data, manually verify and use explicit IDs
