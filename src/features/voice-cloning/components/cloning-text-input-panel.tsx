"use client";
import { Textarea } from "@/components/ui/textarea";
import { GenerateButton } from "@/features/text-to-speech/components/generate-button";
import { TEXT_MAX_LENGTH } from "@/features/text-to-speech/data/constants";
import { useVoiceCloning } from "./voice-cloning-form";

export function CloningTextInputPanel() {
  const { text, setText, isGenerating, canGenerate, generate } = useVoiceCloning();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative min-h-0 flex-1">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type the text you want spoken in the cloned voice…"
          className="absolute inset-0 resize-none border-0 bg-transparent p-4 lg:p-6 text-base! leading-relaxed tracking-tight shadow-none focus-visible:ring-0"
          maxLength={TEXT_MAX_LENGTH}
          disabled={isGenerating}
        />
      </div>
      <div className="flex shrink-0 items-center justify-between border-t p-4 lg:p-6">
        <p className="text-xs tracking-tight text-muted-foreground tabular-nums">
          {text.length.toLocaleString()} / {TEXT_MAX_LENGTH.toLocaleString()}
        </p>
        <GenerateButton
          size="sm"
          disabled={!canGenerate}
          isSubmitting={isGenerating}
          onSubmit={() => generate()}
        />
      </div>
    </div>
  );
}
