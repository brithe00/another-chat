import prisma from "@another-chat/db";
import type { Message } from "@another-chat/db/types";

export class MessageRepository {
  async create(data: {
    conversationId: string;
    role: string;
    content: string;
    model: string;
  }): Promise<Message> {
    return await prisma.message.create({
      data,
    });
  }

  async findByConversation(conversationId: string, limit?: number) {
    return await prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: { createdAt: "asc" },
      ...(limit ? { take: limit } : {}),
    });
  }
}

export const messageRepository = new MessageRepository();
