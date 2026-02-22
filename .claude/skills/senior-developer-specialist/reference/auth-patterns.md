# Authentication Architecture Patterns

**CRITICAL**: Verify all auth code against `docs/architecture/auth-best-practices.md`

## Auth Anti-Pattern Detection

When reviewing auth code, check for these common mistakes:

1. **Component-level auth checks** → Should be in Data Access Layer
2. **Using `getSession()` on server** → Must use `getUser()`
3. **Auth logic in middleware** → Middleware only refreshes sessions
4. **Multiple Supabase client creations** → Create once per request context
5. **Missing `cookies()` call** → Required to opt out of Next.js caching
6. **Using deprecated `@supabase/auth-helpers`** → Must use `@supabase/ssr`
7. **Missing RLS policies** → Defense in depth requires both app + DB checks
8. **Auth state in multiple contexts** → Causes unnecessary re-renders

## Auth Review Checklist

For any auth-related analysis, verify:

- [ ] **Data Access Layer**: All auth checks centralized in `src/lib/dal/`
- [ ] **Security**: Using `getUser()` not `getSession()` on server
- [ ] **Performance**: User retrieved once per request (cached with React `cache()`)
- [ ] **RLS**: Database policies match application auth logic
- [ ] **Multi-tenant**: `tenant_id` in JWT claims via Custom Access Token Hook
- [ ] **Packages**: Using `@supabase/ssr` for Next.js integration
- [ ] **Caching**: `cookies()` called before auth queries
- [ ] **Testing**: RLS isolation tested with multiple tenants

## Quick Auth Architecture Validation

```typescript
// ✅ Good signs:
- Auth checks in src/lib/dal/*.ts files
- supabase.auth.getUser() in server code
- RLS policies on all tables
- Minimal auth context (just user object)
- Single client creation per request

// ❌ Red flags:
- supabase.auth.getUser() in component files
- supabase.auth.getSession() in Server Components
- Auth logic in middleware.ts (beyond session refresh)
- Multiple createClient() calls in same function
- Large auth context with loading/error states
```
