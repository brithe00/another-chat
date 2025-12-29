import { z } from "zod";

export const messageRoleSchema = z.enum(["user", "assistant", "system"]);

export const messageSchema = z.object({
  id: z.string(),
  role: messageRoleSchema,
  content: z.string(),
  model: z.string().optional(),
  createdAt: z.union([z.date(), z.string()]),
  conversationId: z.string(),
});

export const conversationSchema = z.object({
  id: z.string(),
  title: z.string(),
  model: z.string(),
  provider: z.string(),
  isActive: z.boolean(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
  userId: z.string(),
  messages: z.array(messageSchema).optional(),
});

export const createConversationSchema = z.object({
  title: z.string().optional(),
  model: z.string().min(1, "Model is required"),
  provider: z.string().min(1, "Provider is required"),
  initialMessage: z.string().optional(),
  saveInitialMessage: z.boolean().optional(),
});

export const streamChatSchema = z.object({
  conversationId: z.string().min(1, "Conversation ID is required"),
  message: z.string().min(1, "Message cannot be empty"),
});

export const updateTitleSchema = z.object({
  id: z.string().min(1, "ID is required"),
  title: z.string().min(1, "Title cannot be empty"),
});

export const toggleActiveSchema = z.object({
  id: z.string().min(1, "ID is required"),
  isActive: z.boolean(),
});

export const addMessageSchema = z.object({
  role: messageRoleSchema,
  content: z.string().min(1, "Content cannot be empty"),
  model: z.string().min(1, "Model is required"),
});

export type MessageRole = z.infer<typeof messageRoleSchema>;
export type Message = z.infer<typeof messageSchema>;
export type Conversation = z.infer<typeof conversationSchema>;
export type CreateConversationInput = z.infer<typeof createConversationSchema>;
export type StreamChatInput = z.infer<typeof streamChatSchema>;
export type UpdateTitleInput = z.infer<typeof updateTitleSchema>;
export type ToggleActiveInput = z.infer<typeof toggleActiveSchema>;
export type AddMessageInput = z.infer<typeof addMessageSchema>;
