"use client";

import { useEffect } from "react";
import { AudioLines, Sparkles, Volume2 } from "lucide-react";

import {
  AudioPlayerProvider,
  AudioPlayerButton,
  AudioPlayerProgress,
  AudioPlayerTime,
  AudioPlayerDuration,
  AudioPlayerSpeed,
  useAudioPlayer,
} from "@/components/ui/audio-player";
import { useVoiceCloning } from "./voice-cloning-form";

function ClonePlayer({ audioUrl }: { audioUrl: string }) {
  const player = useAudioPlayer();

  useEffect(() => {
    player.setActiveItem({ id: audioUrl, src: audioUrl });
  }, [audioUrl, player]);

  return (
    <div className="flex w-full max-w-md items-center gap-3">
      <AudioPlayerButton variant="outline" size="icon" className="shrink-0" />
      <AudioPlayerTime className="text-xs tabular-nums" />
      <AudioPlayerProgress className="flex-1" />
      <AudioPlayerDuration className="text-xs tabular-nums" />
      <AudioPlayerSpeed variant="ghost" size="icon" />
    </div>
  );
}

export function CloningPreview() {
  const { audioUrl } = useVoiceCloning();

  return (
    <div className="hidden flex-1 flex-col items-center justify-center gap-4 border-l p-6 lg:flex">
      {audioUrl ? (
        <>
          <p className="text-sm font-medium tracking-tight text-foreground">
            Cloned result
          </p>
          <AudioPlayerProvider>
            <ClonePlayer audioUrl={audioUrl} />
          </AudioPlayerProvider>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="relative flex w-32 items-center justify-center">
            <div className="absolute left-0 -rotate-30 rounded-full bg-muted p-4">
              <Volume2 className="size-5 text-muted-foreground" />
            </div>
            <div className="relative z-10 rounded-full bg-foreground p-4">
              <Sparkles className="size-5 text-background" />
            </div>
            <div className="absolute right-0 -rotate-30 rounded-full bg-muted p-4">
              <AudioLines className="size-5 text-muted-foreground" />
            </div>
          </div>
          <p className="text-lg font-semibold tracking-tight text-foreground">
            Your clone will appear here
          </p>
          <p className="max-w-64 text-sm text-muted-foreground">
            Upload a voice, type some text, and hit generate.
          </p>
        </div>
      )}
    </div>
  );
}
