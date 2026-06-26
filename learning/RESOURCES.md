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

### Modal + Chatterbox (TTS infrastructure)

- [Modal — Chatterbox TTS example](https://modal.com/docs/examples/chatterbox_tts)
  THE reference app we adapt. Image (`uv_pip_install chatterbox-tts`, `fastapi[standard]`,
  `peft`), GPU class (`a10g`), `@modal.enter` model load, `generate()`, `@modal.fastapi_endpoint`,
  HF-token secret, voices Volume. Use for: the Python Modal app, the deploy command.
- [Modal — Web endpoints (webhooks)](https://modal.com/docs/guide/webhooks)
  How `@modal.fastapi_endpoint` exposes an HTTPS URL, request/response semantics, and auth
  (bearer token via Secret, or proxy `Modal-Key`/`Modal-Secret` headers). Use for: securing the
  endpoint and calling it from tRPC.
- [Modal — Language support](https://modal.com/docs/guide#programming-language-support)
  Modal is Python-native; JS/Go SDKs exist for invoking, but HTTP endpoints are the
  language-agnostic seam. Use for: justifying the architecture (see LR-0003).
- [Chatterbox (Resemble AI) — GitHub](https://github.com/resemble-ai/chatterbox)
  The model itself. Use for: the real `generate()` parameter names (exaggeration, cfg_weight,
  temperature) so we can reconcile the form's sliders. VERIFY the signature here before wiring.

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
