import { VoiceCloningLayout } from "@/features/voice-cloning/views/voice-cloning-layout";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <VoiceCloningLayout>{children}</VoiceCloningLayout>;
}
