import { conversationController } from "@/controllers/conversation.controller";
import { requireAuth } from "@/middleware/auth";
import {
  addMessageBodySchema,
  addMessageParamSchema,
  createConversationSchema,
  deleteConversationParamSchema,
  getConversationParamSchema,
  listConversationsQuerySchema,
  streamChatBodySchema,
  streamChatParamSchema,
  updateConversationActiveBodySchema,
  updateConversationActiveParamSchema,
  updateConversationTitleBodySchema,
  updateConversationTitleParamSchema,
} from "@/schemas/conversation.schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

export const conversationRoutes = new Hono()
  .use(requireAuth)
  .post("/", zValidator("json", createConversationSchema), async (c) => {
    const validatedData = c.req.valid("json");
    return conversationController.createConversation(c, validatedData);
  })
  .get(
    "/",
    zValidator("query", listConversationsQuerySchema),
    async (c) => {
      const validatedData = c.req.valid("query");
      return conversationController.listConversations(c, validatedData);
    }
  )
  .get(
    "/:id",
    zValidator("param", getConversationParamSchema),
    async (c) => {
      const validatedData = c.req.valid("param");
      return conversationController.getConversation(c, validatedData);
    }
  )
  .patch(
    "/:id/title",
    zValidator("param", updateConversationTitleParamSchema),
    zValidator("json", updateConversationTitleBodySchema),
    async (c) => {
      const paramData = c.req.valid("param");
      const bodyData = c.req.valid("json");
      return conversationController.updateTitle(c, paramData, bodyData);
    }
  )
  .patch(
    "/:id/active",
    zValidator("param", updateConversationActiveParamSchema),
    zValidator("json", updateConversationActiveBodySchema),
    async (c) => {
      const paramData = c.req.valid("param");
      const bodyData = c.req.valid("json");
      return conversationController.updateActive(c, paramData, bodyData);
    }
  )
  .delete(
    "/:id",
    zValidator("param", deleteConversationParamSchema),
    async (c) => {
      const validatedData = c.req.valid("param");
      return conversationController.deleteConversation(c, validatedData);
    }
  )
  .post(
    "/:conversationId/messages",
    zValidator("param", addMessageParamSchema),
    zValidator("json", addMessageBodySchema),
    async (c) => {
      const paramData = c.req.valid("param");
      const bodyData = c.req.valid("json");
      return conversationController.addMessage(c, paramData, bodyData);
    }
  )
  .post(
    "/:conversationId/stream",
    zValidator("param", streamChatParamSchema),
    zValidator("json", streamChatBodySchema),
    async (c) => {
      const paramData = c.req.valid("param");
      const bodyData = c.req.valid("json");
      return conversationController.streamChat(
        c,
        paramData.conversationId,
        bodyData.messages
      );
    }
  );
