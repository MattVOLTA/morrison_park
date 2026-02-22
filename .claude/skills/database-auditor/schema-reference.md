# Schema Reference

Current database schema documentation for impactOS.

> **Note:** This file should be updated when significant schema changes are made.
> For live schema, use: `mcp__Multi_Tenant__list_tables` and `mcp__Multi_Tenant__execute_sql`

## Core Tables

### Multi-Tenant Foundation

#### `tenants`
The root table for multi-tenant isolation.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | NO | Primary key |
| name | TEXT | NO | Organization name |
| slug | TEXT | NO | URL-friendly identifier |
| settings | JSONB | YES | Tenant configuration |
| created_at | TIMESTAMPTZ | NO | Creation timestamp |

**Relationships:**
- Referenced by: Almost every other table via `tenant_id`

#### `organization_members`
Links users to tenants with roles.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | NO | Primary key |
| user_id | UUID | NO | FK to auth.users |
| tenant_id | UUID | NO | FK to tenants |
| role | TEXT | NO | 'owner', 'admin', 'member' |
| invited_by | UUID | YES | FK to auth.users |
| created_at | TIMESTAMPTZ | NO | Creation timestamp |

**Unique Constraint:** (user_id, tenant_id)

### Business Entities

#### `companies`
Portfolio companies being tracked.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | NO | Primary key |
| tenant_id | UUID | NO | FK to tenants |
| name | TEXT | NO | Company name |
| industry | TEXT | YES | Industry classification |
| website | TEXT | YES | Company website |
| logo_url | TEXT | YES | Logo image URL |
| status | TEXT | YES | 'active', 'alumni', etc. |
| created_at | TIMESTAMPTZ | NO | Creation timestamp |
| updated_at | TIMESTAMPTZ | NO | Last update |

**Referenced by:** contacts, programs, reports, commitments, milestones

#### `contacts`
People associated with companies.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | NO | Primary key |
| tenant_id | UUID | NO | FK to tenants |
| company_id | UUID | YES | FK to companies |
| first_name | TEXT | NO | First name |
| last_name | TEXT | YES | Last name |
| title | TEXT | YES | Job title |
| is_primary | BOOLEAN | NO | Primary contact for company |
| created_at | TIMESTAMPTZ | NO | Creation timestamp |

**Important:** Email addresses are in `contact_emails` table, NOT here.

#### `contact_emails`
Email addresses for contacts (supports multiple per contact).

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | NO | Primary key |
| tenant_id | UUID | NO | FK to tenants |
| contact_id | UUID | NO | FK to contacts |
| email | TEXT | NO | Email address |
| is_primary | BOOLEAN | NO | Primary email flag |
| created_at | TIMESTAMPTZ | NO | Creation timestamp |

**Unique Constraint:** (tenant_id, email)

#### `programs`
Cohorts/programs that companies participate in.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | NO | Primary key |
| tenant_id | UUID | NO | FK to tenants |
| name | TEXT | NO | Program name |
| description | TEXT | YES | Program description |
| start_date | DATE | YES | Program start |
| end_date | DATE | YES | Program end |
| status | TEXT | YES | 'active', 'completed', etc. |
| created_at | TIMESTAMPTZ | NO | Creation timestamp |

#### `program_enrollments`
Links companies to programs.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | NO | Primary key |
| tenant_id | UUID | NO | FK to tenants |
| program_id | UUID | NO | FK to programs |
| company_id | UUID | NO | FK to companies |
| enrolled_at | TIMESTAMPTZ | NO | Enrollment date |

### Reporting

#### `reports`
Generated progress reports.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | NO | Primary key |
| tenant_id | UUID | NO | FK to tenants |
| company_id | UUID | NO | FK to companies |
| title | TEXT | NO | Report title |
| content | TEXT | YES | Report content (markdown) |
| status | TEXT | NO | 'draft', 'published' |
| generated_at | TIMESTAMPTZ | YES | AI generation timestamp |
| created_at | TIMESTAMPTZ | NO | Creation timestamp |

#### `report_templates`
Templates for report generation.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | NO | Primary key |
| tenant_id | UUID | NO | FK to tenants |
| name | TEXT | NO | Template name |
| prompt | TEXT | NO | AI prompt template |
| is_default | BOOLEAN | NO | Default template flag |
| created_at | TIMESTAMPTZ | NO | Creation timestamp |

### Forms & Submissions

#### `forms`
Company update forms.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | NO | Primary key |
| tenant_id | UUID | NO | FK to tenants |
| title | TEXT | NO | Form title |
| description | TEXT | YES | Form description |
| schema | JSONB | NO | Form field definitions |
| is_active | BOOLEAN | NO | Whether form accepts submissions |
| created_at | TIMESTAMPTZ | NO | Creation timestamp |

#### `form_submissions`
Responses to forms.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | NO | Primary key |
| tenant_id | UUID | NO | FK to tenants |
| form_id | UUID | NO | FK to forms |
| company_id | UUID | NO | FK to companies |
| contact_id | UUID | YES | FK to contacts (submitter) |
| data | JSONB | NO | Form response data |
| status | TEXT | NO | 'pending', 'reviewed', etc. |
| submitted_at | TIMESTAMPTZ | NO | Submission timestamp |

### Commitments & Milestones

#### `commitments`
Tracked commitments from meetings.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | NO | Primary key |
| tenant_id | UUID | NO | FK to tenants |
| company_id | UUID | NO | FK to companies |
| description | TEXT | NO | Commitment text |
| owner | TEXT | YES | Person responsible |
| due_date | DATE | YES | Target completion date |
| status | TEXT | NO | 'open', 'completed', 'cancelled' |
| source | TEXT | YES | 'meeting', 'form', 'manual' |
| created_at | TIMESTAMPTZ | NO | Creation timestamp |

#### `milestone_tracks`
Milestone journey definitions.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | NO | Primary key |
| tenant_id | UUID | NO | FK to tenants |
| name | TEXT | NO | Track name |
| description | TEXT | YES | Track description |
| display_order | INTEGER | NO | Sort order |
| created_at | TIMESTAMPTZ | NO | Creation timestamp |

#### `milestone_definitions`
Individual milestones within tracks.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | NO | Primary key |
| tenant_id | UUID | NO | FK to tenants |
| track_id | UUID | NO | FK to milestone_tracks |
| name | TEXT | NO | Milestone name |
| description | TEXT | YES | Milestone description |
| stage_order | INTEGER | NO | Order within track |
| created_at | TIMESTAMPTZ | NO | Creation timestamp |

#### `company_milestones`
Company progress on milestones.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | NO | Primary key |
| tenant_id | UUID | NO | FK to tenants |
| company_id | UUID | NO | FK to companies |
| milestone_id | UUID | NO | FK to milestone_definitions |
| completed_at | TIMESTAMPTZ | YES | Completion timestamp |
| notes | TEXT | YES | Completion notes |
| created_at | TIMESTAMPTZ | NO | Creation timestamp |

### Integrations

#### `fireflies_meetings`
Meeting transcripts from Fireflies.ai.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | NO | Primary key |
| tenant_id | UUID | NO | FK to tenants |
| fireflies_id | TEXT | NO | Fireflies meeting ID |
| title | TEXT | YES | Meeting title |
| transcript | TEXT | YES | Full transcript |
| summary | JSONB | YES | AI-generated summary |
| attendees | JSONB | YES | Attendee list |
| meeting_date | TIMESTAMPTZ | YES | Meeting timestamp |
| processed_at | TIMESTAMPTZ | YES | Processing timestamp |
| created_at | TIMESTAMPTZ | NO | Creation timestamp |

## RLS Policy Pattern

All tenant-data tables follow this RLS pattern:

```sql
-- Enable RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Tenant isolation policy
CREATE POLICY tenant_isolation ON table_name
  FOR ALL
  USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid)
  WITH CHECK (tenant_id = (auth.jwt()->>'tenant_id')::uuid);
```

## Index Patterns

Common indexes across tables:

```sql
-- Tenant isolation (required on all tenant tables)
CREATE INDEX idx_[table]_tenant ON [table](tenant_id);

-- Frequently filtered columns
CREATE INDEX idx_[table]_status ON [table](status);
CREATE INDEX idx_[table]_created ON [table](created_at);

-- Foreign key lookups
CREATE INDEX idx_[table]_[fk_column] ON [table]([fk_column]);
```

## Schema Update Process

When modifying this reference:

1. Make the database change via migration
2. Update this file to reflect current state
3. Add entry to `known-issues.md` if there are gotchas
4. Update `codebase-conventions.md` if new patterns emerge
