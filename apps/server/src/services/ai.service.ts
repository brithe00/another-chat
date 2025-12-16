import { chat, type StreamChunk } from "@tanstack/ai";
import { createOpenAI } from "@tanstack/ai-openai";
import { createOllama } from "@tanstack/ai-ollama";
import type { Message } from "@another-chat/db/types";
import { apiKeyService } from "./api-key.service";
import { conversationService } from "./conversation.service";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export class AIService {
  private readonly localProviders = ["ollama"];

  private async getAdapter(userId: string, provider: string) {
    const providerLower = provider.toLowerCase();

    if (this.localProviders.includes(providerLower)) {
      return this.createLocalAdapter(providerLower);
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

    return this.createCloudAdapter(providerLower, apiKeyRecord.apiKey);
  }

  private createLocalAdapter(provider: string) {
    switch (provider) {
      case "ollama":
        return createOllama();

      default:
        throw new Error(`Unsupported local provider: ${provider}`);
    }
  }

  private createCloudAdapter(provider: string, apiKey: string) {
    switch (provider) {
      case "openai":
        return createOpenAI(apiKey);
      // TODO: Add more providers
      // case "anthropic":
      //   return anthropic(apiKey);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  private convertMessages(messages: Message[]): ChatMessage[] {
    return messages
      .filter((msg) => msg.role !== "system")
      .map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));
  }

  private extractSystemPrompts(messages: Message[]): string[] {
    return messages
      .filter((msg) => msg.role === "system")
      .map((msg) => msg.content);
  }

  /* WIP */
  async streamChatCompletion(
    conversationId: string,
    userMessage: string,
    userId: string
  ): Promise<AsyncIterable<StreamChunk>> {
    console.log("🚀 streamChatCompletion called", {
      conversationId,
      userMessage,
    });

    const conversation = await conversationService.getConversation(
      conversationId,
      userId
    );

    if (!conversation) {
      throw new Error("Conversation not found or access denied");
    }

    console.log("✅ Conversation found", {
      model: conversation.model,
      provider: conversation.provider,
      messagesCount: conversation.messages?.length || 0,
    });

    const adapter = await this.getAdapter(userId, conversation.provider);
    console.log("✅ Adapter created");

    const messages = conversation.messages || [];
    const chatMessages = this.convertMessages(messages);
    const systemPrompts = this.extractSystemPrompts(messages);

    chatMessages.push({
      role: "user",
      content: userMessage,
    });

    console.log("📤 Chat config:", {
      model: conversation.model,
      messagesCount: chatMessages.length,
      messages: chatMessages,
      systemPromptsCount: systemPrompts.length,
      systemPrompts,
    });

    const stream = chat({
      adapter: adapter as any,
      messages: chatMessages,
      model: conversation.model as any,
      ...(systemPrompts.length > 0 ? { systemPrompts } : {}),
    });

    return this.logStream(stream);
  }

  private async *logStream(
    stream: AsyncIterable<StreamChunk>
  ): AsyncIterable<StreamChunk> {
    console.log("🌊 Stream started");
    let chunkCount = 0;

    for await (const chunk of stream) {
      chunkCount++;
      console.log(`📦 Chunk ${chunkCount}:`, chunk.type, chunk);
      yield chunk;
    }

    console.log(`✅ Stream completed - ${chunkCount} chunks`);
  }
}

export const aiService = new AIService();
