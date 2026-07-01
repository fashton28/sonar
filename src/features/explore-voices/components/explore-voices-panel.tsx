import { quickActions } from "@/features/dashboard/data/quick-actions";
import { QuickVoiceCard } from "./voice-card";

export function QuickVoicePanel() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Quick actions</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {quickActions.map((action) => (
          <QuickVoiceCard
            key={action.title}
            name={action.title}
            description={action.description}
            gradient={action.gradient}
            href={action.href}
          />
        ))}
      </div>
    </div>
  );
}
