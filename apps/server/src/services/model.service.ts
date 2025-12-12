import { modelRepository } from "@/repositories/model.repository";
import type { Model } from "node_modules/@another-chat/db/prisma/generated/client";

export class ModelService {
  async getAvailableModels(): Promise<Model[]> {
    return await modelRepository.findAllActive();
  }

  async getModelsByProvider(provider: string): Promise<Model[]> {
    return await modelRepository.findByProvider(provider);
  }
}

export const modelService = new ModelService();
