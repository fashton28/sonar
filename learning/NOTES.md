# Teaching Notes — Sonar / tRPC

## Learner profile
- Strong React + JS/TS. Solid Next.js App Router foundations: routing, RSC vs `"use client"`,
  component modularization (subcomponents → shell → simple `page.tsx`). **Do not re-teach these.**
- Building Sonar (TTS app) for real. Highly motivated, sat down for a focused session.
- Currently parked in `src/trpc/routers/_app.ts` thinking "this is where the API gets built."

## Editor / environment
- Uses **Neovim + LazyVim** (NOT VS Code/Cursor). Stop using "VS Code red squiggles" framing —
  say "LSP diagnostics" and reference `:LspInfo`, Trouble (`<leader>xx`), `]d`/`[d`.
- Session 4: was getting NO inline diagnostics because the TS language server wasn't running.
  Fix given: enable `lang.typescript` (vtsls) + `linting.eslint` via `:LazyExtras`. Confirm once
  they report it works — until then, assume they may not see type/syntax errors as they type, so
  keep being explicit about exact line-level mistakes when reviewing their code.

## Preferences
- Teach against the **real Sonar files**, not toy examples. Always cite the actual path.
- **Learn by progressively building the app.** (Stated explicitly in session 2.) Every concept
  should arrive *as a thing we build and run*, not as theory first. Lessons should be
  build-alongs with a "run it and see it work" feedback loop wherever possible.
- Wants mastery but in short lessons. Keep each lesson to one tangible win.
- Likes the "why," not just the "how." Justify every piece.

## Pedagogy plan (REORDERED in session 2 per "build it as we learn" preference)
1. ✅ 0001 — Anatomy of a tRPC request (the 7 files + the lifecycle). Mental model.
2. ✅ 0002 — First real round-trip: `healthcheck` query consumed client-side in `(dashboard)/test`.
   Working `ok` on screen. (Detoured to fix LazyVim LSP diagnostics — now resolved & confirmed.)
3. 🟡 0003 — Real context: Clerk `auth()` + Prisma in `ctx`; `baseProcedure` vs
   `protectedProcedure` + `isAuthed` middleware + a `me` query (server-derived identity, no
   client input). Kills `userId: 'user_123'`. Requires both userId AND orgId (Sonar is org-scoped).
4. ⬜ 0004 — First real router: `voices.list` query (Zod input, Prisma, org-scoped via `ctx.orgId`).
5. ⬜ 0005 — Mutations: `generations.create` + input validation + return types.
6. ⬜ 0006 — Wire the real TTS form (`useMutation`, optimistic-ish UX).
7. ⬜ 0007 — Server Components: prefetch + HydrateClient; the no-HTTP server caller.
8. ⬜ 0008 — Transformers (superjson), error handling, `TRPCError`.

## Misconceptions to watch for
- Thinking the router file is "where the whole backend lives" — it's the *registry*; logic,
  context, and transport are spread across init/context/route/server/client by design.
- Expecting an Express-style request/response object inside procedures (it's `ctx` + `input`).
