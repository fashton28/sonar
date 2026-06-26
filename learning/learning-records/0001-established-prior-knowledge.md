# Established prior knowledge: React/TS + Next.js App Router foundations

The user arrives with solid React + JavaScript/TypeScript and confirmed Next.js App Router
foundations: routing, the `"use client"` vs Server Component boundary, and component
modularization (building subcomponents → composing a shell → rendering it simply from
`page.tsx`). They have already scaffolded the tRPC setup in Sonar via the official guide
(`init.ts`, `routers/_app.ts`, `route.ts`, `server.tsx`, `client.tsx`, `query-client.ts`)
and a placeholder `hello` procedure exists.

**Why it matters:** Do not spend lessons re-teaching React/Next fundamentals or the boilerplate
they've already pasted. The zone of proximal development starts at *understanding the wiring
they already have* (Lesson 0001 — mental model) and moves straight to *making it real*: Clerk
auth context, Prisma in `ctx`, and authoring genuine routers (voices, generations). The gap is
conceptual ("why is the setup split across so many files, and where does my logic go?"), not
syntactic.
