import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiKeyApi } from "../api";
import type {
  DeleteApiKeyInput,
  SaveApiKeyInput,
  ToggleActiveInput,
  UpdateLabelInput,
} from "../schemas";

export const apiKeysKeys = {
  all: ["api-keys"] as const,
  lists: () => [...apiKeysKeys.all, "list"] as const,
  list: () => [...apiKeysKeys.lists()] as const,
  details: () => [...apiKeysKeys.all, "detail"] as const,
  detail: (id: string) => [...apiKeysKeys.details(), id] as const,
};

export function useApiKeys() {
  return useQuery({
    queryKey: apiKeysKeys.list(),
    queryFn: apiKeyApi.listApiKeys,
  });
}

export function useSaveApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaveApiKeyInput) => apiKeyApi.saveApiKey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeysKeys.list() });
      toast.success("API key saved successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save API key");
    },
  });
}

export function useToggleActiveApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ToggleActiveInput) => apiKeyApi.toggleActive(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: apiKeysKeys.list() });
      toast.success(
        variables.isActive
          ? "API key activated successfully"
          : "API key deactivated successfully"
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update API key status");
    },
  });
}

export function useUpdateApiKeyLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateLabelInput) => apiKeyApi.updateLabel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeysKeys.list() });
      toast.success("API key label updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update API key label");
    },
  });
}

export function useDeleteApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteApiKeyInput) => apiKeyApi.deleteApiKey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeysKeys.list() });
      toast.success("API key deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete API key");
    },
  });
}
