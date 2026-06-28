import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "../init";
import { env } from "@/lib/env";

// Voice cloning v1 — no storage. The reference clip rides IN the request as base64
// and is discarded after. (See learning/lessons/0008.)
const generateInput = z.object({
  text: z.string().min(1).max(5000),
  audioBase64: z.string().min(1), // the reference voice clip, base64-encoded
});

export const cloningRouter = createTRPCRouter({
  generate: protectedProcedure
    .input(generateInput)
    .mutation(async ({ input }) => {
      const res = await fetch(env.MODAL_TTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: input.text,
          voice_b64: input.audioBase64, // Modal decodes this → audio_prompt_path → clone
        }),
      });

      if (!res.ok) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `TTS service responded ${res.status}`,
        });
      }

      const bytes = await res.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      return { audio: `data:audio/wav;base64,${base64}` };
    }),
});
