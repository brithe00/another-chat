export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  model?: string;
  createdAt: Date | string;
  conversationId: string;
}

export interface Conversation {
  id: string;
  title: string;
  model: string;
  provider: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: string;
  messages?: Message[];
}

export interface CreateConversationInput {
  title?: string;
  model: string;
  provider: string;
  initialMessage?: string;
  saveInitialMessage?: boolean;
}

export interface StreamChatInput {
  conversationId: string;
  message: string;
}
