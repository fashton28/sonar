import { z } from 'zod';
import { currentUser } from '@clerk/nextjs/server';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import { ttsRouter } from './tts';
import { cloningRouter } from './cloning';

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),

  healthcheck: baseProcedure.query(() => {
    return {
      status: "ok" as const,
      timestamp: new Date().toISOString(),
    };
  }),

  // Server-derived identity. The client sends nothing — `auth()` (in context) read the
  // Clerk session; `currentUser()` fetches the full profile for the name.
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await currentUser();
    return {
      userId: ctx.userId,
      orgId: ctx.orgId,
      name: user?.firstName ?? "there",
    };
  }),

  tts: ttsRouter,
  cloning: cloningRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
