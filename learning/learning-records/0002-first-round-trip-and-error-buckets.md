# Completed first full tRPC round-trip; understands the three error buckets

In session 2–4 the user authored a `healthcheck` query, consumed it client-side with
`useTRPC()` + `useQuery` in a `(dashboard)/test` route, and got a live `ok` response on screen.
Along the way they debugged (with guidance) a syntax error (`fucntion`, stray `}`), a React
component-casing error (`<healthCheck/>` → `<HealthCheck/>`), and a procedure-name mismatch
(`healthcheck` vs `healthCheck`).

**Why it matters:** This sets a real new floor. The user now understands, with evidence:
(1) the full client→server→client lifecycle in practice, (2) the procedure-name contract
(server key must match the client path string exactly, case-sensitive — distinct from the
PascalCase component rule), and (3) the three error buckets — **syntax** (won't parse),
**type** (LSP/TS squiggle), **runtime** (error branch / message). Do not re-teach these.
Future debugging help can assume they'll read `error.message` and reason about which bucket a
failure falls in. Next floor to build on: real context + auth (LR will follow when demonstrated).

**Environment note:** Their Neovim/LazyVim diagnostics are now working (TS + ESLint extras
enabled), so from here they SEE type/syntax errors as they type — lean on that ("watch the
squiggle") instead of VS Code framing.
