import { modelService } from "@/services/model.service";
import type { Context } from "hono";
import type { ProviderParam } from "@/schemas/model.schema";

export class ModelController {
  async listModels(c: Context): Promise<Response> {
    try {
      const models = await modelService.getAvailableModels();
      return c.json(models);
    } catch (error) {
      console.error("Error listing models:", error);
      return c.json(
        {
          error: "Failed to retrieve models",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  }

  async listModelsByProvider(
    c: Context,
    data: ProviderParam
  ): Promise<Response> {
    try {
      const models = await modelService.getModelsByProvider(data.provider);
      return c.json(models);
    } catch (error) {
      console.error(
        `Error listing models for provider ${data.provider}:`,
        error
      );
      return c.json(
        {
          error: "Failed to retrieve models for provider",
          provider: data.provider,
          details: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  }
}

export const modelController = new ModelController();
