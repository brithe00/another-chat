import { conversationRepository } from "@/repositories/conversation.repository";
import { messageRepository } from "@/repositories/message.repository";
import type { Conversation } from "@another-chat/db/types";

export type MessageRole = "user" | "assistant" | "system";

export class ConversationService {
  async createConversation(
    userId: string,
    title: string | undefined,
    model: string,
    provider: string,
    initialMessage?: string,
    saveInitialMessage: boolean = true
  ) {
    const convoTitle = title?.trim() || this.generateTitle(initialMessage);

    const conversation = await conversationRepository.create(
      userId,
      convoTitle,
      model,
      provider
    );

    if (initialMessage?.trim() && saveInitialMessage) {
      await messageRepository.create({
        conversationId: conversation.id,
        role: "user",
        content: initialMessage.trim(),
        model: conversation.model,
      });
    }

    return conversation;
  }

  async getConversation(id: string, userId: string): Promise<Conversation> {
    const conversation = await conversationRepository.findById(id, userId);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    return conversation;
  }

  async listConversations(
    userId: string,
    options?: {
      includeInactive?: boolean;
      limit?: number;
      cursor?: string;
    }
  ): Promise<Conversation[]> {
    return await conversationRepository.findByUser(userId, options);
  }

  async addMessage(
    conversationId: string,
    userId: string,
    role: MessageRole,
    content: string,
    model: string
  ) {
    if (!content?.trim()) {
      throw new Error("Message content cannot be empty");
    }

    const conversation = await conversationRepository.findById(
      conversationId,
      userId
    );

    if (!conversation) {
      throw new Error("Conversation not found or access denied");
    }

    const message = await messageRepository.create({
      conversationId,
      role,
      content: content.trim(),
      model,
    });

    await conversationRepository.touch(conversationId, userId);

    return message;
  }

  async updateTitle(id: string, userId: string, title: string) {
    const trimmedTitle = title?.trim();
    if (!trimmedTitle) {
      throw new Error("Title cannot be empty");
    }

    return await conversationRepository.updateTitle(id, userId, trimmedTitle);
  }

  async updateActive(id: string, userId: string, isActive: boolean) {
    return await conversationRepository.updateActive(id, userId, isActive);
  }

  async deleteConversation(id: string, userId: string) {
    return await conversationRepository.delete(id, userId);
  }

  private generateTitle(content?: string): string {
    if (!content) return "New conversation";

    const truncated = content.substring(0, 50);
    return truncated.length < content.length ? `${truncated}...` : truncated;
  }
}

export const conversationService = new ConversationService();
