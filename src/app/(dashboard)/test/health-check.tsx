"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useTRPC } from "@/trpc/client";

export function HealthCheck() {
  const trpc = useTRPC();
  const { user } = useUser();

  const health = useQuery(trpc.healthcheck.queryOptions());

  // Forgeable: the name comes from client INPUT.
  const greeting = useQuery(
    trpc.hello.queryOptions({ text: user?.firstName ?? "stranger" }),
  );

  // Trustworthy: the server derives identity from the Clerk session itself.
  const me = useQuery(trpc.me.queryOptions());

  // Guard on the discriminated-union flags (isPending/isError) — NOT isLoading —
  // so TypeScript narrows `health.data` to defined below.
  if (health.isPending) return <p>Pinging backend…</p>;
  if (health.isError) return <p>❌ {health.error.message}</p>;

  return (
    <div className="space-y-1 font-mono text-sm">
      <p>✅ status: {health.data.status}</p>
      <p>🕐 server time: {health.data.timestamp}</p>
      <p>👋 {greeting.data?.greeting}</p>
      <p>🔐 server says you are: {me.data?.name} · org {me.data?.orgId}</p>
    </div>
  );
}
