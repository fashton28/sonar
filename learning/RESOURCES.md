# tRPC + Next.js Resources

## Knowledge

- [tRPC Docs — Set up with React Server Components](https://trpc.io/docs/client/tanstack-react-query/server-components)
  The canonical guide for the *exact* integration Sonar uses (`@trpc/tanstack-react-query`
  + App Router). Use for: the `server.tsx`, `client.tsx`, `query-client.ts` patterns and
  prefetch/hydrate flow.
- [tRPC Docs — Authorization](https://trpc.io/docs/server/authorization)
  Official `createContext` → `isAuthed` middleware → `protectedProcedure` pattern. Use for:
  turning Sonar's fake context into real auth and gating procedures.
- [tRPC Docs — Middlewares](https://trpc.io/docs/server/middlewares)
  How `.use()` wraps a procedure, context extension, reusable procedure builders. Use for:
  logging, auth, org-scoping middleware.
- [tRPC Docs — Define Procedures](https://trpc.io/docs/server/procedures)
  Queries vs mutations, `.input()` with Zod, `.output()`. Use for: writing the voices /
  generations routers.
- [Clerk Docs — Integrate Clerk into Next.js + tRPC](https://clerk.com/docs/guides/development/trpc)
  Sonar's exact auth provider. Use for: `createContext = async () => ({ auth: await auth() })`
  and the Clerk-flavored `protectedProcedure`.
- [tRPC Docs — Data Transformers (SuperJSON)](https://trpc.io/docs/server/data-transformers)
  Why the commented-out `transformer: superjson` lines exist in Sonar. Use for: when Dates /
  Maps / undefined need to survive the network boundary.
- [Prisma Docs — Next.js + Prisma best practices](https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help)
  The global-singleton pattern Sonar already uses in `src/lib/db.ts`. Use for: avoiding
  hot-reload connection exhaustion.

## Wisdom (Communities)

- [tRPC Discord](https://trpc.io/discord)
  Maintainers + power users are active. Use for: "is this the idiomatic pattern?" questions,
  RSC edge cases, type-inference puzzles.
- [r/nextjs](https://reddit.com/r/nextjs)
  Use for: App Router + data-fetching architecture debates, sanity-checking decisions.
- [Theo / t3.gg ecosystem](https://www.youtube.com/@t3dotgg)
  create-t3-app popularized this exact stack. Use for: opinionated takes on structure and
  trade-offs (watch critically — opinions, not gospel).

## Gaps
- No single authoritative source ties **Clerk org-scoping** (`orgId`) + **Prisma** +
  **tRPC middleware** together for a multi-tenant app like Sonar. We will synthesize this
  ourselves across lessons and validate against the tRPC + Clerk docs above.
