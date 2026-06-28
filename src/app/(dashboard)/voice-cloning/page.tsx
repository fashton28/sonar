import type { Metadata } from "next";

import { VoiceCloningView } from "@/features/voice-cloning/views/voice-cloning-view";

export const metadata: Metadata = { title: "Voice Cloning" };

export default function VoiceCloningPage() {
  return <VoiceCloningView />;
}
