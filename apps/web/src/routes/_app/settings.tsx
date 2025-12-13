import { createFileRoute } from "@tanstack/react-router";
import { SettingsView } from "@/features/settings/components/settings-view";
import { apiKeysKeys } from "@/features/api-keys/hooks/use-api-keys";
import { apiKeyApi } from "@/features/api-keys/api";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsView,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: apiKeysKeys.list(),
      queryFn: apiKeyApi.listApiKeys,
    });
  },
});
