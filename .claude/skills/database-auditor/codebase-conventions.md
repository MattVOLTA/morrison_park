# Codebase Conventions

Where database-related code lives in impactOS and patterns to search for.

## Directory Structure

```
app/
├── app/                    # Next.js App Router pages
│   ├── (protected)/        # Authenticated routes
│   │   ├── companies/      # Company management
│   │   ├── contacts/       # Contact management
│   │   ├── programs/       # Program management
│   │   └── settings/       # Org settings
│   └── api/                # API routes (minimal use)
├── components/             # Shared React components
├── lib/
│   ├── dal/                # 🔴 DATA ACCESS LAYER (all DB ops here)
│   ├── clients/            # External service clients
│   ├── types/              # TypeScript interfaces
│   └── utils/              # Utility functions
└── __tests__/              # Jest test files
```

## Data Access Layer (Critical)

**Location:** `app/lib/dal/`

**Pattern:** One file per domain entity:
- `companies.ts` - Company CRUD operations
- `contacts.ts` - Contact CRUD operations
- `programs.ts` - Program CRUD operations
- `reports.ts` - Report operations
- `commitments.ts` - Commitment tracking
- `milestones.ts` - Milestone operations

**Naming Convention:**
```typescript
// Get operations
export async function getCompanyById(id: string): Promise<Company | null>
export async function getCompaniesForTenant(): Promise<Company[]>

// Mutation operations
export async function createCompany(data: CreateCompanyInput): Promise<Company>
export async function updateCompany(id: string, data: UpdateCompanyInput): Promise<Company>
export async function deleteCompany(id: string): Promise<void>
```

**Critical Rule:** ALL database operations MUST go through DAL. Never:
- Import Supabase client directly in components
- Write raw SQL in server actions
- Perform DB operations in API routes without DAL

## Search Patterns

When looking for references to a table, search for:

### Table Name Patterns

For a table called `companies`:
```bash
# Exact table name (SQL/Supabase queries)
grep -r "companies" app/lib/dal/
grep -r "\.from\('companies" app/

# PascalCase (TypeScript interfaces)
grep -r "Company" app/lib/types/

# camelCase (variable names)
grep -r "company\." app/

# Plural camelCase (arrays)
grep -r "companies\." app/
```

### Column Name Patterns

For a column called `primary_contact_id`:
```bash
# Snake_case (database column)
grep -r "primary_contact_id" app/

# camelCase (TypeScript property)
grep -r "primaryContactId" app/

# Partial match (related references)
grep -r "primaryContact" app/
```

### Drizzle ORM Patterns

```typescript
// Schema definition (if using Drizzle schema files)
export const companies = pgTable('companies', {
  id: uuid('id').primaryKey(),
  tenantId: uuid('tenant_id').notNull(),
  name: text('name').notNull(),
});

// Query patterns
db.select().from(companies).where(eq(companies.tenantId, tenantId))
db.insert(companies).values(data)
db.update(companies).set(data).where(eq(companies.id, id))
db.delete(companies).where(eq(companies.id, id))
```

### Supabase Client Patterns

```typescript
// Direct Supabase queries (should be in DAL only)
supabase.from('companies').select('*')
supabase.from('companies').insert(data)
supabase.from('companies').update(data).eq('id', id)
supabase.from('companies').delete().eq('id', id)

// RPC calls
supabase.rpc('function_name', { params })
```

## Server Actions

**Location:** `app/app/(protected)/[feature]/actions.ts`

**Pattern:**
```typescript
'use server'

import { createCompany, updateCompany } from '@/lib/dal/companies'

export async function createCompanyAction(formData: FormData) {
  // Validate input
  // Call DAL function
  // Revalidate paths
}
```

**Search for actions:**
```bash
grep -r "'use server'" app/app/
grep -r "revalidatePath" app/app/
```

## API Routes

**Location:** `app/app/api/`

**Usage:** Minimal - prefer server actions. Used for:
- Webhooks (Fireflies, external integrations)
- Public endpoints
- File uploads

**Pattern:**
```typescript
// app/app/api/webhooks/route.ts
export async function POST(request: Request) {
  // Handle webhook
}
```

## Type Definitions

**Location:** `app/lib/types/`

**Pattern:**
```typescript
// Database row types (match table structure)
export interface Company {
  id: string
  tenant_id: string
  name: string
  created_at: string
}

// Input types (for mutations)
export interface CreateCompanyInput {
  name: string
  // ... other fields
}

// Extended types (with joined data)
export interface CompanyWithContacts extends Company {
  contacts: Contact[]
}
```

## Test Files

**Location:** `app/__tests__/`

**Pattern:** Mirror source structure:
- `__tests__/companies/` - Company tests
- `__tests__/contacts/` - Contact tests
- `__tests__/dal/` - DAL-specific tests

**Test data patterns:**
```typescript
// Look for test fixtures
const testCompany = {
  id: 'test-company-id',
  tenant_id: TEST_TENANT_ID,
  name: 'Test Company',
}

// Test tenant constants
const TEST_TENANT_ID = '8b1ef478-...'  // Day One test tenant
```

## Migration Files

**Location:** Supabase migrations (accessed via MCP)

**To list migrations:**
```
mcp__Multi_Tenant__list_migrations
```

**Migration naming:** `YYYYMMDDHHMMSS_description.sql`

## Quick Reference: Where to Look

| Looking For | Location |
|-------------|----------|
| DB queries for `companies` | `app/lib/dal/companies.ts` |
| Company type definition | `app/lib/types/company.ts` or inline |
| Server action that creates company | `app/app/(protected)/companies/actions.ts` |
| Component using company data | `app/components/company-*.tsx` |
| Tests for company CRUD | `app/__tests__/companies/` |
| API endpoint for companies | `app/app/api/companies/route.ts` (if exists) |

## Anti-Patterns to Flag

When auditing, flag these violations:

1. **DB operations outside DAL:**
   ```typescript
   // ❌ Wrong - in a component or page
   const { data } = await supabase.from('companies').select()
   ```

2. **Missing tenant filter:**
   ```typescript
   // ❌ Wrong - no tenant isolation
   const companies = await supabase.from('companies').select()

   // ✅ Correct - filtered by tenant (handled by RLS + DAL)
   const companies = await getCompaniesForTenant()
   ```

3. **Raw SQL without RLS consideration:**
   ```typescript
   // ❌ Dangerous - might bypass RLS
   await supabase.rpc('custom_function', { ... })
   ```

4. **Service role in application code:**
   ```typescript
   // ❌ Critical - bypasses all RLS
   const supabase = createClient(url, SERVICE_ROLE_KEY)
   ```
