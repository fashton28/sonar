import { QuickVoicePanel } from "@/features/explore-voices/components/explore-voices-panel";

export default function ExploreVoicesDash() {
  return (
    <div className="relative flex-1 w-full">
      <div className="relative space-y-8 p-4 lg:p-16">
        <QuickVoicePanel />
      </div>
    </div>
  );
}
