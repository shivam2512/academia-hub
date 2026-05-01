import { createFileRoute, Outlet, useParams } from "@tanstack/react-router";
import { BatchSubNav } from "@/components/AppLayout";

export const Route = createFileRoute("/app/batches/$batchId")({ component: BatchLayout });

function BatchLayout() {
  const { batchId } = useParams({ from: "/app/batches/$batchId" });
  return (
    <div className="flex flex-col min-h-full">
      <BatchSubNav batchId={batchId} />
      <div className="flex-1"><Outlet /></div>
    </div>
  );
}
