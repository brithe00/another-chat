import prisma from "@another-chat/db";
import type { Model } from "@another-chat/db/types";

export class ModelRepository {
  async findAllActive(): Promise<Model[]> {
    return await prisma.model.findMany({
      where: { isActive: true },
      orderBy: [{ provider: "asc" }, { displayName: "asc" }],
    });
  }

  async findByProvider(provider: string): Promise<Model[]> {
    return await prisma.model.findMany({
      where: {
        provider,
        isActive: true,
      },
      orderBy: { displayName: "asc" },
    });
  }
}

export const modelRepository = new ModelRepository();
