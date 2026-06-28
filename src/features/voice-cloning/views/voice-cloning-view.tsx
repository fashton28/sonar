"use client";

import { VoiceCloningProvider } from "../components/voice-cloning-form";
import { VoiceUploadPanel } from "../components/voice-upload-panel";
import { CloningTextInputPanel } from "../components/cloning-text-input-panel";
import { CloningPreview } from "../components/cloning-preview";

export function VoiceCloningView() {
  return (
    <VoiceCloningProvider>
      <div className="flex min-h-0 flex-1 overflow-x-hidden">
        <div className="flex min-h-0 flex-1 flex-col">
          <VoiceUploadPanel />
          <CloningTextInputPanel />
        </div>
        <CloningPreview />
      </div>
    </VoiceCloningProvider>
  );
}
