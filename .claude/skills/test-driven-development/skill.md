---
name: test-driven-development
description: "Use when implementing any feature or bugfix: write the test FIRST, watch it fail, then write minimal code to pass. Ensures tests verify behavior by requiring failure before implementation."
version: 2.0.0
triggers:
  - implementing a feature
  - fixing a bug
  - writing new code
  - adding functionality
---

# Test-Driven Development (TDD)

## The Iron Law

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

Write code before the test? **Delete it. Start over. No exceptions.**

## The Cycle

```
RED → Verify Fails → GREEN → Verify Passes → REFACTOR → Repeat
```

### 1. RED - Write Failing Test

Write ONE minimal test showing what SHOULD happen.

```typescript
test('rejects empty email', async () => {
  const result = await submitForm({ email: '' });
  expect(result.error).toBe('Email required');
});
```

### 2. Verify RED - Watch It Fail

**MANDATORY. Never skip.** Run the test, confirm it fails for the expected reason.

### 3. GREEN - Minimal Code

Write the **simplest** code to pass the test. Don't add features beyond the test.

### 4. Verify GREEN - Watch It Pass

**MANDATORY.** All tests pass, no warnings.

### 5. REFACTOR - Clean Up

Only after green. Keep tests green. Don't add behavior.

## Before Writing Tests

**ALWAYS investigate the codebase first:**

1. Find existing tests (`**/*.test.ts`, `__tests__/`)
2. Identify test framework (Jest, Vitest, etc.)
3. Discover patterns and helpers
4. Check for cleanup scripts in `package.json`

## Test Data Cleanup

**Tests MUST NOT pollute the database.** See: `reference/database-cleanup-strategies.md`

## Supabase Auth (impactOS Critical)

Test these BEFORE implementing:
1. **Tenant isolation** - RLS blocks cross-tenant access
2. **JWT claims** - tenant_id in access token
3. **DAL pattern** - requireAuth() enforced

See: `reference/supabase-auth-patterns.md`

## Red Flags - STOP and Start Over

- Code written before test
- Test passes immediately
- Can't explain why test failed
- Rationalizing "just this once"

See: `reference/common-rationalizations.md`

## Verification Checklist

- [ ] Every new function has a test
- [ ] Watched each test fail first
- [ ] Wrote minimal code to pass
- [ ] Test data cleanup implemented

## When Stuck

| Problem | Solution |
|---------|----------|
| Don't know how to test | Write wished-for API first |
| Test too complicated | Design too complicated |
| Must mock everything | Code too coupled |

See: `reference/troubleshooting.md`

## Final Rule

```
Production code → test exists and failed first
Otherwise → not TDD
```

No exceptions without human approval.
