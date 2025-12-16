import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { conversationApi } from "../api";
import type { CreateConversationInput } from "../types";

export const conversationKeys = {
  all: ["conversations"] as const,
  lists: () => [...conversationKeys.all, "list"] as const,
  list: (params?: { includeInactive?: boolean }) =>
    [...conversationKeys.lists(), params] as const,
  details: () => [...conversationKeys.all, "detail"] as const,
  detail: (id: string) => [...conversationKeys.details(), id] as const,
};

export function useConversations(params?: { includeInactive?: boolean }) {
  return useQuery({
    queryKey: conversationKeys.list(params),
    queryFn: () => conversationApi.listConversations(params),
  });
}

export function useConversation(id: string | undefined) {
  return useQuery({
    queryKey: conversationKeys.detail(id!),
    queryFn: () => conversationApi.getConversation(id!),
    enabled: !!id,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateConversationInput) =>
      conversationApi.createConversation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      toast.success("Conversation created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create conversation");
    },
  });
}

export function useUpdateConversationTitle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      conversationApi.updateTitle(id, title),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: conversationKeys.detail(variables.id),
      });
      toast.success("Title updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update title");
    },
  });
}

export function useToggleConversationActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      conversationApi.toggleActive(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: conversationKeys.detail(variables.id),
      });
      toast.success(
        variables.isActive ? "Conversation restored" : "Conversation archived"
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update conversation");
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => conversationApi.deleteConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      toast.success("Conversation deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete conversation");
    },
  });
}
