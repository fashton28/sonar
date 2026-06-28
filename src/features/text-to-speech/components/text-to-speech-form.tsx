"use client";
import { createContext, useContext, useState } from "react";
import { z } from "zod";
import { formOptions } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { useAppForm } from "@/hooks/use-app-form";
import { useTRPC } from "@/trpc/client";

const ttsFormSchema = z.object({
  text: z.string().min(1, "Please enter some text"),
  exaggeration: z.number().min(0).max(1),
  temperature: z.number().min(0).max(2),
  cfgWeight: z.number().min(0).max(1),
});

export type TTSFormValues = z.infer<typeof ttsFormSchema>;

export const defaultTTSValues: TTSFormValues = {
  text: "",
  exaggeration: 0.5,
  temperature: 0.8,
  cfgWeight: 0.5,
};

export const ttsFormOptions = formOptions({
  defaultValues: defaultTTSValues,
});

// Lets the preview pane read the latest generated clip without prop-drilling.
const TTSResultContext = createContext<{ audioUrl: string | null }>({
  audioUrl: null,
});
export const useTTSResult = () => useContext(TTSResultContext);

export function TextToSpeechForm({ children }: { children: React.ReactNode }) {
  const trpc = useTRPC();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const generate = useMutation(trpc.tts.generate.mutationOptions());

  const form = useAppForm({
    ...ttsFormOptions,
    defaultValues: defaultTTSValues,
    validators: {
      onSubmit: ttsFormSchema,
    },
    onSubmit: async ({ value }) => {
      // TanStack Form keeps isSubmitting=true while this awaits — the existing
      // GenerateButton spinner just works.
      try {
        const { audio } = await generate.mutateAsync(value);
        setAudioUrl(audio);
      } catch {
        toast.error("Generation failed. Please try again.");
      }
    },
  });

  return (
    <TTSResultContext.Provider value={{ audioUrl }}>
      <form.AppForm>{children}</form.AppForm>
    </TTSResultContext.Provider>
  );
}
