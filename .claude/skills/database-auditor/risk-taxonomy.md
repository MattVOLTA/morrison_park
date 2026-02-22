# Risk Taxonomy

Classification rules for database change risk assessment.

## 🔴 Critical - Immediate Action Required

Changes that could cause **data loss, security issues, or system-wide outages**.

### Data Loss Risks
| Pattern | Example | Why Critical |
|---------|---------|--------------|
| Removing columns with data | `ALTER TABLE DROP COLUMN email` | Irreversible data loss |
| Dropping tables | `DROP TABLE old_reports` | All data destroyed |
| Truncating tables | `TRUNCATE companies` | Production data wiped |

### Security Risks
| Pattern | Example | Why Critical |
|---------|---------|--------------|
| Modifying auth tables | Changes to `users`, `tenants`, `organization_members` | Auth/authz compromise |
| Removing RLS policies | `DROP POLICY tenant_isolation ON companies` | Cross-tenant data exposure |
| Changing tenant_id column | Rename, remove, or change type | Multi-tenant isolation breach |
| Weakening RLS conditions | `USING (true)` instead of tenant filter | All tenants see all data |

### Structural Risks
| Pattern | Example | Why Critical |
|---------|---------|--------------|
| Changing primary key | Modify `id` column type or structure | Breaks all FK references |
| Modifying foreign keys with CASCADE | Could delete related data unexpectedly | Cascade data loss |
| Changing column from nullable to NOT NULL without default | Existing NULL rows will fail | Migration will error |

### impactOS-Specific Critical
| Table | Why Critical |
|-------|--------------|
| `tenants` | Core multi-tenant isolation |
| `organization_members` | User access control |
| `users` | Authentication |
| `contact_emails` | Primary communication channel |

**Required Actions:**
- STOP and discuss with team lead
- Document rollback plan before proceeding
- Consider if change is truly necessary
- May require downtime window

---

## 🟠 High - Address Within 24-48 Hours

Changes that could cause **application errors or require careful coordination**.

### Constraint Risks
| Pattern | Example | Why High |
|---------|---------|----------|
| Adding NOT NULL to existing column | `ALTER COLUMN status SET NOT NULL` | Existing NULLs will block |
| Adding UNIQUE constraint | `ADD CONSTRAINT unique_email` | Duplicates may exist |
| Adding CHECK constraint | `ADD CHECK (amount > 0)` | Existing data may violate |
| Adding foreign key to populated column | `ADD FOREIGN KEY (company_id)` | Orphaned references |

### Type Change Risks
| Pattern | Example | Why High |
|---------|---------|----------|
| Changing column type | `ALTER COLUMN price TYPE decimal` | Precision loss, conversion errors |
| Changing varchar length | `ALTER COLUMN name TYPE varchar(50)` | Truncation of existing data |
| Changing enum values | Remove or rename enum options | Application errors |

### High-Impact Tables
| Pattern | Why High |
|---------|----------|
| Modifying `companies` | Core entity, many dependencies |
| Modifying `contacts` | Used throughout reporting |
| Modifying `programs` | Links companies to cohorts |
| Modifying `reports` | Output artifacts |

### Operational Risks
| Pattern | Why High |
|---------|----------|
| Column rename with 5+ references | Many code changes required |
| Adding index on table > 100k rows | Lock time considerations |
| Modifying heavily-queried tables | Performance impact |

**Required Actions:**
- Review all affected code paths
- Write data verification migration
- Test on staging with production-like data
- Coordinate deployment timing
- Have rollback ready

---

## 🟡 Medium - Address Within 1 Week

Changes that **require attention but are generally safe with proper migration**.

### Safe-ish Additions
| Pattern | Example | Notes |
|---------|---------|-------|
| Adding nullable column | `ADD COLUMN notes TEXT` | Verify NULL handling in code |
| Creating table with FK | `CREATE TABLE milestones` | Must add RLS policy |
| Adding index on small table | `CREATE INDEX idx_name` | Minimal lock time |
| Adding new enum value | Add to end of enum | Don't reorder existing |

### Medium-Impact Changes
| Pattern | Notes |
|---------|-------|
| Adding columns to medium-traffic tables | Watch for lock contention |
| Modifying non-critical columns | Normal review process |
| Creating views | Ensure RLS passes through |
| Adding triggers | Consider performance |

### impactOS-Specific Medium
| Table | Notes |
|-------|-------|
| `commitments` | Feature-specific, limited blast radius |
| `milestone_definitions` | Configuration data |
| `form_submissions` | Write-heavy, watch locks |

**Required Actions:**
- Follow standard migration patterns
- Update affected code in same PR
- Add/update tests
- Normal code review process

---

## 🟢 Low - Minimal Risk

**Additive changes with minimal downstream impact**.

### Safe Patterns
| Pattern | Example | Why Low |
|---------|---------|---------|
| New standalone table | `CREATE TABLE feature_flags` | No dependencies yet |
| Nullable column, no FK | `ADD COLUMN metadata JSONB` | Pure addition |
| Adding comments | `COMMENT ON COLUMN` | Metadata only |
| Index on empty table | New table setup | No existing data |
| Adding documentation | Schema comments | No runtime impact |

**Required Actions:**
- Standard development workflow
- Normal code review
- Verify RLS if tenant data

---

## Cumulative Risk Assessment

When multiple changes are proposed:

| Combination | Overall Risk |
|-------------|--------------|
| Any Critical | Critical |
| 2+ High | Critical |
| 3+ Medium | High |
| High + 2 Medium | High |
| Otherwise | Highest individual |

---

## Special Considerations for impactOS

### Multi-Tenant Checklist

Every schema change must verify:

1. **New tables storing tenant data:**
   - [ ] Has `tenant_id UUID NOT NULL` column
   - [ ] Has FK to `tenants(id)` with CASCADE
   - [ ] Has RLS enabled
   - [ ] Has policy: `USING (tenant_id = auth.jwt()->>'tenant_id'::uuid)`
   - [ ] Has `WITH CHECK` clause matching `USING`

2. **Modifying existing tenant tables:**
   - [ ] RLS policy still valid after change
   - [ ] tenant_id relationship preserved
   - [ ] No cross-tenant data exposure

3. **Aggregate queries:**
   - [ ] Include tenant filter
   - [ ] Don't expose counts across tenants

### Contact Emails Pattern

Remember: Email addresses are in `contact_emails` table, NOT `contacts.email`.

If changes involve contact communication:
- Check `contact_emails` table references
- Verify primary email flag handling
- Test email display in UI components
