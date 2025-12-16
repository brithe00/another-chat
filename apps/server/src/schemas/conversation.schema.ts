import { z } from "zod";

export const messageRoleSchema = z.enum(["user", "assistant", "system"]);

export const createConversationSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(200, "Title is too long")
    .optional(),
  model: z
    .string()
    .min(1, "Model cannot be empty")
    .max(100, "Model name is too long"),
  provider: z
    .string()
    .min(1, "Provider cannot be empty")
    .max(50, "Provider name is too long")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Provider can only contain letters, numbers, underscores, and hyphens"
    ),
  initialMessage: z.string().max(10000, "Message is too long").optional(),
  saveInitialMessage: z.boolean().optional().default(true),
});

export const getConversationParamSchema = z.object({
  id: z.uuid("Invalid conversation ID"),
});

export const listConversationsQuerySchema = z.object({
  includeInactive: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1).max(100))
    .optional(),
  cursor: z.uuid("Invalid cursor").optional(),
});

export const addMessageParamSchema = z.object({
  conversationId: z.uuid("Invalid conversation ID"),
});

export const addMessageBodySchema = z.object({
  role: messageRoleSchema,
  content: z
    .string()
    .min(1, "Message content cannot be empty")
    .max(10000, "Message is too long"),
  model: z
    .string()
    .min(1, "Model cannot be empty")
    .max(100, "Model name is too long"),
});

export const updateConversationTitleParamSchema = z.object({
  id: z.uuid("Invalid conversation ID"),
});

export const updateConversationTitleBodySchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(200, "Title is too long"),
});

export const updateConversationActiveParamSchema = z.object({
  id: z.uuid("Invalid conversation ID"),
});

export const updateConversationActiveBodySchema = z.object({
  isActive: z.boolean(),
});

export const deleteConversationParamSchema = z.object({
  id: z.uuid("Invalid conversation ID"),
});

export const streamChatParamSchema = z.object({
  conversationId: z.uuid("Invalid conversation ID"),
});

export const streamChatBodySchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string(),
    })
  ),
});

export type MessageRole = z.infer<typeof messageRoleSchema>;
export type CreateConversationInput = z.infer<typeof createConversationSchema>;
export type GetConversationParam = z.infer<typeof getConversationParamSchema>;
export type ListConversationsQuery = z.infer<
  typeof listConversationsQuerySchema
>;
export type AddMessageParam = z.infer<typeof addMessageParamSchema>;
export type AddMessageBody = z.infer<typeof addMessageBodySchema>;
export type UpdateConversationTitleParam = z.infer<
  typeof updateConversationTitleParamSchema
>;
export type UpdateConversationTitleBody = z.infer<
  typeof updateConversationTitleBodySchema
>;
export type UpdateConversationActiveParam = z.infer<
  typeof updateConversationActiveParamSchema
>;
export type UpdateConversationActiveBody = z.infer<
  typeof updateConversationActiveBodySchema
>;
export type DeleteConversationParam = z.infer<
  typeof deleteConversationParamSchema
>;
export type StreamChatParam = z.infer<typeof streamChatParamSchema>;
export type StreamChatBody = z.infer<typeof streamChatBodySchema>;
