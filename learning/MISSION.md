# Mission: Master the tRPC + Next.js backend stack by building Sonar

## Why
The user is building **Sonar** (a voice-cloning / text-to-speech app, a cheaper ElevenLabs
alternative) and wants to come out the other side genuinely *fluent* in building modern,
type-safe backends — not just copy a tutorial. The UI foundation is done; the backend is
the next frontier and the part they feel least confident in.

## Success looks like
- Can explain, from memory, the full lifecycle of a tRPC call from React component →
  network → router → procedure → back, and name which file in Sonar does each job.
- Can author a new tRPC router (queries + mutations) with Zod input validation, wired to
  Prisma, scoped to the current Clerk org — without copying from a tutorial.
- Can implement real auth context: replace the hardcoded `userId: 'user_123'` with Clerk
  `auth()`, and write a `protectedProcedure` via middleware.
- Can prefetch a query in a Server Component and hydrate it into a Client Component.
- Understands *why* each piece exists (context, transformer, batching, the RSC caller),
  not just the incantation.

## Constraints
- Learns best hands-on, mapped to the *actual Sonar files* (not toy examples).
- Has solid React + JavaScript/TypeScript and Next.js App Router foundations already
  (routing, RSC vs `"use client"`, component modularization). Do not re-teach these.
- Wants a master-level outcome but in short, digestible sessions.

## Out of scope (for now)
- The actual TTS model inference / R2 audio storage integration (comes after the tRPC
  backend skeleton is solid).
- Deep React Query internals beyond what tRPC needs.
- Deployment / infra.
