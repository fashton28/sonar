"use client";

import { createContext, useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";

interface VoiceCloningContextValue {
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  text: string;
  setText: (text: string) => void;
  isGenerating: boolean;
  audioUrl: string | null;
  canGenerate: boolean;
  generate: () => Promise<void>;
}

const VoiceCloningContext = createContext<VoiceCloningContextValue | null>(null);

export function useVoiceCloning() {
  const ctx = useContext(VoiceCloningContext);
  if (!ctx) {
    throw new Error("useVoiceCloning must be used within a VoiceCloningProvider");
  }
  return ctx;
}

// Browser-safe File → base64 (no Node Buffer; FileReader avoids call-stack blowups).
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string; // "data:audio/wav;base64,AAAA…"
      resolve(dataUrl.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function VoiceCloningProvider({ children }: { children: React.ReactNode }) {
  const trpc = useTRPC();
  const clone = useMutation(trpc.cloning.generate.mutationOptions());

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const canGenerate = !!audioFile && text.trim().length > 0 && !isGenerating;

  async function generate() {
    if (!audioFile || !text.trim()) return;
    setIsGenerating(true);
    try {
      const audioBase64 = await fileToBase64(audioFile);
      const { audio } = await clone.mutateAsync({ text, audioBase64 });
      setAudioUrl(audio);
    } catch (err) {
      console.error(err);
      toast.error("Cloning failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <VoiceCloningContext.Provider
      value={{
        audioFile,
        setAudioFile,
        text,
        setText,
        isGenerating,
        audioUrl,
        canGenerate,
        generate,
      }}
    >
      {children}
    </VoiceCloningContext.Provider>
  );
}
