import { HealthCheck } from "./health-check";

export default function TestPage() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">
        tRPC Health Check
      </h1>
      <HealthCheck />
    </div>
  );
}
