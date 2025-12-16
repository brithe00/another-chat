import { client } from "@/lib/api-client";
import { handleApiError } from "@/lib/errors";
import type { CreateConversationInput, Message } from "../types";
import {
  createConversationSchema,
  updateTitleSchema,
  toggleActiveSchema,
  addMessageSchema,
} from "../schemas";

export const conversationApi = {
  createConversation: async (data: CreateConversationInput) => {
    try {
      const validatedData = createConversationSchema.parse(data);

      const response = await client.api.conversations.$post({
        json: validatedData,
      });

      if (!response.ok) {
        throw new Error("Failed to create conversation");
      }

      return response.json();
    } catch (error) {
      handleApiError(
        error,
        "An unexpected error occurred while creating the conversation"
      );
    }
  },

  listConversations: async (params?: {
    includeInactive?: boolean;
    limit?: number;
    cursor?: string;
  }) => {
    try {
      const searchParams = new URLSearchParams();

      if (params?.includeInactive !== undefined) {
        searchParams.set("includeInactive", String(params.includeInactive));
      }
      if (params?.limit) {
        searchParams.set("limit", String(params.limit));
      }
      if (params?.cursor) {
        searchParams.set("cursor", params.cursor);
      }

      const response = await client.api.conversations.$get({
        query: Object.fromEntries(searchParams) as any,
      });

      if (!response.ok) {
        throw new Error("Failed to list conversations");
      }

      return response.json();
    } catch (error) {
      handleApiError(error, "An unexpected error occurred while listing conversations");
    }
  },

  getConversation: async (id: string) => {
    try {
      const response = await client.api.conversations[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to get conversation");
      }

      return response.json();
    } catch (error) {
      handleApiError(error, "An unexpected error occurred while getting the conversation");
    }
  },

  updateTitle: async (id: string, title: string) => {
    try {
      const validatedData = updateTitleSchema.parse({ id, title });

      const response = await client.api.conversations[":id"].title.$patch({
        param: { id: validatedData.id },
        json: { title: validatedData.title },
      });

      if (!response.ok) {
        throw new Error("Failed to update conversation title");
      }

      return response.json();
    } catch (error) {
      handleApiError(
        error,
        "An unexpected error occurred while updating the conversation title"
      );
    }
  },

  toggleActive: async (id: string, isActive: boolean) => {
    try {
      const validatedData = toggleActiveSchema.parse({ id, isActive });

      const response = await client.api.conversations[":id"].active.$patch({
        param: { id: validatedData.id },
        json: { isActive: validatedData.isActive },
      });

      if (!response.ok) {
        throw new Error("Failed to toggle conversation status");
      }

      return response.json();
    } catch (error) {
      handleApiError(
        error,
        "An unexpected error occurred while toggling the conversation status"
      );
    }
  },

  deleteConversation: async (id: string) => {
    try {
      const response = await client.api.conversations[":id"].$delete({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to delete conversation");
      }

      return response.json();
    } catch (error) {
      handleApiError(error, "An unexpected error occurred while deleting the conversation");
    }
  },

  addMessage: async (
    conversationId: string,
    data: { role: Message["role"]; content: string; model: string }
  ) => {
    try {
      const validatedData = addMessageSchema.parse(data);

      const response = await client.api.conversations[
        ":conversationId"
      ].messages.$post({
        param: { conversationId },
        json: validatedData,
      });

      if (!response.ok) {
        throw new Error("Failed to add message");
      }

      return response.json();
    } catch (error) {
      handleApiError(
        error,
        "An unexpected error occurred while adding the message"
      );
    }
  },
};
