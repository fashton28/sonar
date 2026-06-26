import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export const createTRPCContext = cache(async () => {
  /**
   * Establish identity on the SERVER, from the Clerk session — never from client input.
   * @see https://clerk.com/docs/guides/development/trpc
   */
  const authState = await auth();
  return { auth: authState, prisma };
});

// Tell tRPC the shape of ctx so `ctx.auth` / `ctx.prisma` are typed in every procedure.
export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

// Sonar is org-scoped: every real action needs BOTH a signed-in user AND a selected org.
// This middleware guards access AND narrows the types (userId/orgId become non-null strings).
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.auth.userId || !ctx.auth.orgId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      userId: ctx.auth.userId, // was string | null  →  now string
      orgId: ctx.auth.orgId, // was string | null  →  now string
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);
