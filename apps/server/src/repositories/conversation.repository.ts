import prisma from "@another-chat/db";
import type { Conversation } from "@another-chat/db/types";

export class ConversationRepository {
  async create(
    userId: string,
    title: string,
    model: string,
    provider: string
  ): Promise<Conversation> {
    return await prisma.conversation.create({
      data: {
        userId,
        title,
        model,
        provider,
      },
      include: {
        messages: true,
      },
    });
  }

  async findById(id: string, userId: string): Promise<Conversation | null> {
    return await prisma.conversation.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  async findByUser(
    userId: string,
    options?: {
      includeInactive?: boolean;
      limit?: number;
      cursor?: string;
    }
  ): Promise<Conversation[]> {
    const where = {
      userId,
      ...(options?.includeInactive ? {} : { isActive: true }),
    };

    return await prisma.conversation.findMany({
      where,
      include: {
        messages: {
          take: 1,
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: options?.limit || 50,
      ...(options?.cursor
        ? {
            cursor: { id: options.cursor },
            skip: 1,
          }
        : {}),
    });
  }

  async updateTitle(
    id: string,
    userId: string,
    title: string
  ): Promise<Conversation> {
    return await prisma.conversation.update({
      where: { id, userId },
      data: {
        title,
      },
    });
  }

  async updateActive(
    id: string,
    userId: string,
    isActive: boolean
  ): Promise<Conversation> {
    return await prisma.conversation.update({
      where: { id, userId },
      data: {
        isActive,
      },
    });
  }

  async touch(id: string, userId: string): Promise<Conversation> {
    return await prisma.conversation.update({
      where: { id, userId },
      data: {
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string, userId: string): Promise<Conversation> {
    return await prisma.conversation.delete({
      where: { id, userId },
    });
  }
}

export const conversationRepository = new ConversationRepository();
