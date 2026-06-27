import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "../init";
import { env } from "@/lib/env";

// The form's sliders map to Chatterbox's REAL knobs (see lesson 0006), not the
// generic LLM params the UI was scaffolded with.
const generateInput = z.object({
  text: z.string().min(1).max(5000),
  exaggeration: z.number().min(0).max(1),
  cfgWeight: z.number().min(0).max(1),
  temperature: z.number().min(0).max(2),
});

export const ttsRouter = createTRPCRouter({
  // A write (spends GPU money) → a mutation, and protected (real, org-scoped user).
  generate: protectedProcedure
    .input(generateInput)
    .mutation(async ({ input }) => {
      const res = await fetch(env.MODAL_TTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: input.text,
          exaggeration: input.exaggeration,
          cfg_weight: input.cfgWeight, // camelCase (TS) → snake_case (Python) at the boundary
          temperature: input.temperature,
        }),
      });

      if (!res.ok) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `TTS service responded ${res.status}`,
        });
      }

      // tRPC speaks JSON; audio is binary. base64-encode the bytes into a data URL
      // the browser can drop straight into <audio src>. (R2 phase later returns a real URL.)
      const bytes = await res.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      return { audio: `data:audio/wav;base64,${base64}` };
    }),
});
