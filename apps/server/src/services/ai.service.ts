import { chat, type StreamChunk } from "@tanstack/ai";
import { openaiText } from "@tanstack/ai-openai";
import { ollamaText } from "@tanstack/ai-ollama";
import type { Message } from "@another-chat/db/types";
import { apiKeyService } from "./api-key.service";
import { conversationService } from "./conversation.service";

type ChatMessage = {
  role: "user" | "assistant" | "tool";
  content: string;
};

export class AIService {
  private readonly localProviders = ["ollama"];

  async streamConversation(
    conversationId: string,
    userMessage: string,
    userId: string
  ): Promise<AsyncIterable<StreamChunk>> {
    const conversation = await conversationService.getConversation(
      conversationId,
      userId
    );

    const dbMessages = conversation.messages || [];
    const chatMessages: ChatMessage[] = this.convertMessages(dbMessages);

    chatMessages.push({
      role: "user",
      content: userMessage,
    });

    const systemPrompts = this.extractSystemPrompts(dbMessages);

    const adapter = await this.getAdapter(
      userId,
      conversation.provider,
      conversation.model
    );

    const stream = chat({
      adapter: adapter as any,
      messages: chatMessages,
      ...(systemPrompts.length > 0 ? { systemPrompts } : {}),
    });

    return this.streamWithSave(
      stream,
      conversationId,
      userMessage,
      conversation.model,
      userId
    );
  }

  private async *streamWithSave(
    stream: AsyncIterable<StreamChunk>,
    conversationId: string,
    userMessage: string,
    model: string,
    userId: string
  ): AsyncIterable<StreamChunk> {
    let assistantResponse = "";

    for await (const chunk of stream) {
      if (chunk.type === "content") {
        assistantResponse = chunk.content;
      }
      yield chunk;
    }

    try {
      await conversationService.addMessage(
        conversationId,
        userId,
        "user",
        userMessage,
        model
      );

      if (assistantResponse.trim()) {
        await conversationService.addMessage(
          conversationId,
          userId,
          "assistant",
          assistantResponse,
          model
        );
      }

      console.log("✅ Messages saved to DB");
    } catch (error) {
      console.error("❌ Failed to save messages:", error);
    }
  }

  private convertMessages(messages: Message[]): ChatMessage[] {
    return messages
      .filter((msg) => msg.role !== "system")
      .map((msg) => ({
        role: msg.role as "user" | "assistant" | "tool",
        content: msg.content,
      }));
  }

  private extractSystemPrompts(messages: Message[]): string[] {
    return messages
      .filter((msg) => msg.role === "system")
      .map((msg) => msg.content);
  }

  private async getAdapter(userId: string, provider: string, model: string) {
    const providerLower = provider.toLowerCase();

    if (this.localProviders.includes(providerLower)) {
      return this.createLocalAdapter(providerLower, model);
    }

    const apiKeyRecord = await apiKeyService.getApiKeyByUserAndProvider(
      userId,
      provider
    );

    if (!apiKeyRecord) {
      throw new Error(
        `No API key found for provider: ${provider}. Please add one in settings.`
      );
    }

    return this.createCloudAdapter(providerLower, apiKeyRecord.apiKey, model);
  }

  private createLocalAdapter(provider: string, model: string) {
    switch (provider) {
      case "ollama":
        return ollamaText(model as any);
      default:
        throw new Error(`Unsupported local provider: ${provider}`);
    }
  }

  private createCloudAdapter(provider: string, apiKey: string, model: string) {
    switch (provider) {
      case "openai":
        return openaiText(model as any, { apiKey });
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}

export const aiService = new AIService();
