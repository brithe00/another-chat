import type { ApiKey, ApiKeyWithoutHash } from "@another-chat/db/types";
import { encryptionService } from "./encryption.service";
import { apiKeyRepository } from "@/repositories/api-key.repository";

export class ApiKeyService {
  async saveApiKey(
    userId: string,
    provider: string,
    apiKey: string,
    label?: string
  ): Promise<ApiKey> {
    const encryptedKey = encryptionService.encrypt(apiKey);
    return await apiKeyRepository.create(userId, provider, encryptedKey, label);
  }

  async getApiKeyByUserAndProvider(
    userId: string,
    provider: string
  ): Promise<{
    apiKey: string;
    label: string | null;
    provider: string;
  } | null> {
    const apiKeyRecord = await apiKeyRepository.findApiKeyByUserAndProvider(
      userId,
      provider
    );

    if (!apiKeyRecord) {
      return null;
    }

    const decryptedKey = encryptionService.decrypt(apiKeyRecord?.keyHash);

    return {
      provider: apiKeyRecord.provider,
      label: apiKeyRecord.label,
      apiKey: decryptedKey,
    };
  }

  async listApiKeys(userId: string): Promise<Partial<ApiKeyWithoutHash>[]> {
    return await apiKeyRepository.findAllApiKeys(userId);
  }

  async deleteApiKey(userId: string, keyId: string): Promise<ApiKey> {
    return await apiKeyRepository.delete(userId, keyId);
  }

  async toggleActive(
    userId: string,
    keyId: string,
    isActive: boolean
  ): Promise<ApiKey> {
    return await apiKeyRepository.updateActive(userId, keyId, isActive);
  }

  async updateLabel(
    userId: string,
    keyId: string,
    label?: string
  ): Promise<ApiKey> {
    return await apiKeyRepository.updateLabel(userId, keyId, label);
  }
}

export const apiKeyService = new ApiKeyService();
