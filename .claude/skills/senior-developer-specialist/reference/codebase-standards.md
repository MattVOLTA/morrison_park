# Codebase Standards

Apply these standards from PRINCIPLES.md holistically.

## Code Quality

- ✅ TypeScript strict mode compliance
- ✅ No `any` types (except unavoidable third-party scenarios)
- ✅ Explicit return types for functions/components
- ✅ DRY principle - extract reusable utilities
- ✅ Small, focused functions - Single Responsibility

## Security

- ✅ RLS policies for all data access
- ✅ CSRF protection on mutations
- ✅ Input validation with Zod schemas
- ✅ Secure error messages (no sensitive data leakage)
- ✅ Rate limiting on public endpoints

## Performance

- ✅ Optimize database queries (explain plans, indexes)
- ✅ Minimize client-side JavaScript
- ✅ Code splitting and lazy loading
- ✅ Proper caching strategies (client + server)
- ✅ Core Web Vitals compliance

## Best Practices

- ✅ Server Components by default (Client only when needed)
- ✅ Error boundaries for resilience
- ✅ Accessibility standards (semantic HTML, ARIA)
- ✅ Mobile-first responsive design

## Project-Specific Context

### Current Architecture
- **Framework**: Next.js 15 with TypeScript
- **Database**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Deployment**: Netlify with edge functions
- **State**: React Query (limited adoption)
- **AI/ML**: Hybrid search (vector + keyword RRF)

### Key Files
- `PRINCIPLES.md` - Code quality, security, performance standards
- `CLAUDE.md` - Project overview and development guidance
- `docs/architecture/auth-best-practices.md` - **Auth architecture (CRITICAL)**
- `src/lib/services/` - Core business logic
- `src/hooks/useProfiles.ts` - Primary data fetching pattern
