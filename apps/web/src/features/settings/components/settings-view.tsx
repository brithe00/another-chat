import { SidebarInset } from "@/components/ui/sidebar";
import { PageHeader } from "@/features/layout/components/page-header";
import { ApiKeyCard } from "@/features/api-keys/components/api-key-card";
import { AddApiKeyDialog } from "@/features/api-keys/components/add-api-key-dialog";
import { Key, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  useApiKeys,
  useSaveApiKey,
  useToggleActiveApiKey,
  useDeleteApiKey,
  useUpdateApiKeyLabel,
} from "@/features/api-keys/hooks/use-api-keys";

export function SettingsView() {
  const { data: apiKeys } = useApiKeys();
  const saveApiKey = useSaveApiKey();
  const toggleActiveApiKey = useToggleActiveApiKey();
  const deleteApiKey = useDeleteApiKey();
  const updateApiKeyLabel = useUpdateApiKeyLabel();

  const handleAddApiKey = async (data: {
    provider: string;
    apiKey: string;
    label?: string;
  }) => {
    await saveApiKey.mutateAsync(data);
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    toggleActiveApiKey.mutate({ keyId: id, isActive });
  };

  const handleDeleteApiKey = async (id: string) => {
    await deleteApiKey.mutateAsync({ keyId: id });
  };

  const handleRenameApiKey = async (id: string, newLabel: string) => {
    await updateApiKeyLabel.mutateAsync({ keyId: id, label: newLabel });
  };

  return (
    <SidebarInset>
      <div className="flex flex-col h-full">
        <PageHeader title="Settings" />

        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-4xl p-6 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <Key className="h-6 w-6" />
                    API Keys
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Manage your API keys for different AI providers (BYOK -
                    Bring Your Own Key)
                  </p>
                </div>
                <AddApiKeyDialog onAdd={handleAddApiKey} />
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Security Notice</AlertTitle>
                <AlertDescription>
                  Your API keys are encrypted and stored securely. We never
                  store your keys in plain text, and they are only used to make
                  requests on your behalf.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {!apiKeys || apiKeys.length === 0 ? (
                  <div className="text-center py-12 border border-dashed">
                    <Key className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No API keys yet
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add your first API key to start using AI models
                    </p>
                    <AddApiKeyDialog onAdd={handleAddApiKey} />
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {apiKeys.map((apiKey) => (
                      <ApiKeyCard
                        key={apiKey.id}
                        apiKey={{
                          id: apiKey.id!,
                          provider: apiKey.provider!,
                          label: apiKey.label || undefined,
                          isActive: apiKey.isActive!,
                          createdAt: new Date(apiKey.createdAt!),
                        }}
                        onToggleActive={handleToggleActive}
                        onDelete={handleDeleteApiKey}
                        onRename={handleRenameApiKey}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
