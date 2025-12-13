import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/layout/components/app-sidebar";
import { requireAuth } from "@/utils/auth-guard";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
  shouldReload: false,
  beforeLoad: ({ context, location }) =>
    requireAuth(context.queryClient, location.pathname),
});

function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Outlet />
    </SidebarProvider>
  );
}
