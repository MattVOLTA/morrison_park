# Documentation Usage with Context7

**ALWAYS use context7 MCP tools to lookup current documentation** before making recommendations.

## When to Use Context7

### 1. Supabase Patterns
```
Use: mcp__context7__resolve-library-id with "supabase"
Then: mcp__context7__get-library-docs for specific topics
```
Topics: authentication, RLS, connection pooling, SSR, etc.

### 2. React/Next.js Optimization
```
Use: mcp__context7__resolve-library-id with "next.js" or "react"
Topics: server components, caching, streaming, etc.
```

### 3. TypeScript Patterns
```
Use: mcp__context7__resolve-library-id with "typescript"
Topics: generics, utility types, strict mode
```

### 4. React Query Best Practices
```
Use: mcp__context7__resolve-library-id with "tanstack react-query"
Topics: caching, mutations, optimistic updates
```

## Documentation Priority

1. **Official docs first** (context7) - Always reference current best practices
2. **Existing codebase patterns** - Check how similar problems were solved
3. **Project standards** (PRINCIPLES.md, CLAUDE.md) - Ensure alignment
