import { useQuery } from "@tanstack/react-query";
import type { GetModelsByProviderInput } from "../schemas";
import { modelApi } from "../api";

export const modelsKeys = {
  all: ["models"] as const,
  lists: () => [...modelsKeys.all, "list"] as const,
  list: () => [...modelsKeys.lists()] as const,
  byProvider: (provider: string) =>
    [...modelsKeys.all, "by-provider", provider] as const,
};

export function useModels() {
  return useQuery({
    queryKey: modelsKeys.list(),
    queryFn: modelApi.listModels,
  });
}

export function useModelsByProvider(data: GetModelsByProviderInput) {
  return useQuery({
    queryKey: modelsKeys.byProvider(data.provider),
    queryFn: () => modelApi.listModelsByProvider(data),
    enabled: !!data.provider,
  });
}
