import type {
  AddMessageBody,
  AddMessageParam,
  CreateConversationInput,
  DeleteConversationParam,
  GetConversationParam,
  ListConversationsQuery,
  UpdateConversationActiveBody,
  UpdateConversationActiveParam,
  UpdateConversationTitleBody,
  UpdateConversationTitleParam,
} from "@/schemas/conversation.schema";
import { conversationService } from "@/services/conversation.service";
import { aiService } from "@/services/ai.service";
import { toServerSentEventsStream } from "@tanstack/ai";
import type { Context } from "hono";

export class ConversationController {
  async createConversation(c: Context, data: CreateConversationInput) {
    try {
      const user = c.get("user");
      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const conversation = await conversationService.createConversation(
        user.id,
        data.title,
        data.model,
        data.provider,
        data.initialMessage,
        data.saveInitialMessage ?? true
      );

      return c.json({ conversation }, 201);
    } catch (error) {
      console.error("Error creating conversation:", error);

      if (error instanceof Error) {
        return c.json({ error: error.message }, 400);
      }

      return c.json({ error: "Failed to create conversation" }, 500);
    }
  }

  async listConversations(c: Context, data: ListConversationsQuery) {
    try {
      const user = c.get("user");
      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const conversations = await conversationService.listConversations(
        user.id,
        {
          includeInactive: data.includeInactive,
          limit: data.limit,
          cursor: data.cursor,
        }
      );

      return c.json(conversations);
    } catch (error) {
      console.error("Error listing conversations:", error);

      if (error instanceof Error) {
        return c.json({ error: error.message }, 400);
      }

      return c.json({ error: "Failed to list conversations" }, 500);
    }
  }

  async getConversation(c: Context, data: GetConversationParam) {
    try {
      const user = c.get("user");
      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const conversation = await conversationService.getConversation(
        data.id,
        user.id
      );

      return c.json(conversation);
    } catch (error) {
      console.error("Error getting conversation:", error);

      if (error instanceof Error) {
        return c.json({ error: error.message }, 400);
      }

      return c.json({ error: "Failed to get conversation" }, 500);
    }
  }

  async updateTitle(
    c: Context,
    paramData: UpdateConversationTitleParam,
    bodyData: UpdateConversationTitleBody
  ) {
    try {
      const user = c.get("user");
      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const conversation = await conversationService.updateTitle(
        paramData.id,
        user.id,
        bodyData.title
      );

      return c.json(conversation);
    } catch (error) {
      console.error("Error updating conversation title:", error);

      if (error instanceof Error) {
        return c.json({ error: error.message }, 400);
      }

      return c.json({ error: "Failed to update conversation title" }, 500);
    }
  }

  async updateActive(
    c: Context,
    paramData: UpdateConversationActiveParam,
    bodyData: UpdateConversationActiveBody
  ) {
    try {
      const user = c.get("user");
      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const conversation = await conversationService.updateActive(
        paramData.id,
        user.id,
        bodyData.isActive
      );

      return c.json(conversation);
    } catch (error) {
      console.error("Error updating conversation status:", error);

      if (error instanceof Error) {
        return c.json({ error: error.message }, 400);
      }

      return c.json({ error: "Failed to update conversation status" }, 500);
    }
  }

  async deleteConversation(c: Context, data: DeleteConversationParam) {
    try {
      const user = c.get("user");
      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      await conversationService.deleteConversation(data.id, user.id);

      return c.json({ message: "Conversation deleted successfully" }, 200);
    } catch (error) {
      console.error("Error deleting conversation:", error);

      if (error instanceof Error) {
        return c.json({ error: error.message }, 400);
      }

      return c.json({ error: "Failed to delete conversation" }, 500);
    }
  }

  async addMessage(
    c: Context,
    paramData: AddMessageParam,
    bodyData: AddMessageBody
  ) {
    try {
      const user = c.get("user");
      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const message = await conversationService.addMessage(
        paramData.conversationId,
        user.id,
        bodyData.role,
        bodyData.content,
        bodyData.model
      );

      return c.json(message, 201);
    } catch (error) {
      console.error("Error adding message:", error);

      if (error instanceof Error) {
        return c.json({ error: error.message }, 400);
      }

      return c.json({ error: "Failed to add message" }, 500);
    }
  }

  async stream(
    c: Context,
    conversationId: string,
    messages: Array<{ role: string; content: string }>
  ) {
    try {
      const user = c.get("user");
      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const lastMessage = messages[messages.length - 1];
      const userMessage = lastMessage?.content || "";

      const stream = await aiService.streamConversation(
        conversationId,
        userMessage,
        user.id
      );

      const sseStream = toServerSentEventsStream(stream);

      return new Response(sseStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } catch (error) {
      console.error("Error in stream:", error);
      return c.json(
        {
          error:
            error instanceof Error ? error.message : "Failed to stream chat",
        },
        500
      );
    }
  }
}

export const conversationController = new ConversationController();
