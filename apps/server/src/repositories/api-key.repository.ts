import prisma from "@another-chat/db";
import type { ApiKey, ApiKeyWithoutHash } from "@another-chat/db/types";

export class ApiKeyRepository {
  async create(
    userId: string,
    provider: string,
    apiKeyEncrypted: string,
    label?: string
  ): Promise<ApiKey> {
    return await prisma.apiKey.create({
      data: {
        userId,
        provider,
        keyHash: apiKeyEncrypted,
        label: label || `${provider} key`,
        isActive: true,
      },
    });
  }

  async findApiKeyByUserAndProvider(
    userId: string,
    provider: string
  ): Promise<ApiKey | null> {
    return await prisma.apiKey.findFirst({
      where: {
        userId,
        provider,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findAllApiKeys(userId: string): Promise<Partial<ApiKeyWithoutHash>[]> {
    return await prisma.apiKey.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        provider: true,
        label: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async delete(userId: string, keyId: string): Promise<ApiKey> {
    return await prisma.apiKey.delete({
      where: {
        id: keyId,
        userId,
      },
    });
  }

  async updateActive(
    userId: string,
    keyId: string,
    isActive: boolean
  ): Promise<ApiKey> {
    return await prisma.apiKey.update({
      where: {
        id: keyId,
        userId,
      },
      data: {
        isActive,
      },
    });
  }

  async updateLabel(
    userId: string,
    keyId: string,
    label?: string
  ): Promise<ApiKey> {
    return await prisma.apiKey.update({
      where: {
        id: keyId,
        userId,
      },
      data: {
        label,
      },
    });
  }
}

export const apiKeyRepository = new ApiKeyRepository();
