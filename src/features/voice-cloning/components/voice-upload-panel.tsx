"use client";

import { useRef } from "react";
import { Mic, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useVoiceCloning } from "./voice-cloning-form";

export function VoiceUploadPanel() {
  const { audioFile, setAudioFile, isGenerating } = useVoiceCloning();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="border-b p-4 lg:p-6">
      <div className="mb-3 flex items-center gap-2">
        <Mic className="size-4 text-muted-foreground" />
        <p className="text-sm font-medium tracking-tight">Reference voice</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        disabled={isGenerating}
        onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
      />

      {audioFile ? (
        <div className="flex items-center justify-between rounded-lg border bg-card p-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{audioFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(audioFile.size / 1024).toFixed(0)} KB
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            disabled={isGenerating}
            onClick={() => setAudioFile(null)}
            aria-label="Remove voice clip"
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          disabled={isGenerating}
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-muted/50 disabled:opacity-50"
        >
          <Upload className="size-5" />
          <span className="text-sm">Upload a voice clip</span>
          <span className="text-xs">~10s, clean, single speaker (WAV / MP3)</span>
        </button>
      )}
    </div>
  );
}
