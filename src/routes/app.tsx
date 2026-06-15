import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { UnreadCountsProvider } from "@/hooks/useUnreadCounts";

export const Route = createFileRoute("/app")({
  component: () => (
    <UnreadCountsProvider>
      <AppLayout />
    </UnreadCountsProvider>
  ),
});
