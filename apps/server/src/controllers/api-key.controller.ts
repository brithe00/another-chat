import type {
  ApiKeyCreateInput,
  ApiKeyDeleteInput,
  ApiKeyToggleActiveParam,
  ApiKeyToggleActiveBody,
  ApiKeyUpdateLabelParam,
  ApiKeyUpdateLabelBody,
} from "@/schemas/api-key.schema";
import { apiKeyService } from "@/services/api-key.service";
import type { Context } from "hono";

export class ApiKeyController {
  async saveApiKey(c: Context, data: ApiKeyCreateInput): Promise<Response> {
    try {
      const user = c.get("user");
      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const savedKey = await apiKeyService.saveApiKey(
        user.id,
        data.provider,
        data.apiKey,
        data.label
      );

      return c.json({
        id: savedKey.id,
        provider: savedKey.provider,
        label: savedKey.label,
      });
    } catch (error) {
      console.error("Error saving API key:", error);
      return c.json({ error: "Failed to save API key" }, 500);
    }
  }

  async listApiKeys(c: Context): Promise<Response> {
    try {
      const user = c.get("user");
      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const keys = await apiKeyService.listApiKeys(user.id);
      return c.json(keys);
    } catch (error) {
      return c.json({ error: "Failed to fetch API keys" }, 500);
    }
  }

  async deleteApiKey(c: Context, data: ApiKeyDeleteInput): Promise<Response> {
    try {
      const user = c.get("user");
      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      await apiKeyService.deleteApiKey(user.id, data.keyId);
      return c.json({ message: "API key deleted successfully" }, 200);
    } catch (error) {
      return c.json({ error: "Failed to delete API key" }, 500);
    }
  }

  async toggleActive(
    c: Context,
    paramData: ApiKeyToggleActiveParam,
    bodyData: ApiKeyToggleActiveBody
  ): Promise<Response> {
    try {
      const user = c.get("user");
      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const updatedKey = await apiKeyService.toggleActive(
        user.id,
        paramData.keyId,
        bodyData.isActive
      );

      return c.json({
        id: updatedKey.id,
        provider: updatedKey.provider,
        label: updatedKey.label,
        isActive: updatedKey.isActive,
      });
    } catch (error) {
      console.error("Error toggling API key status:", error);
      return c.json({ error: "Failed to update API key status" }, 500);
    }
  }

  async updateLabel(
    c: Context,
    paramData: ApiKeyUpdateLabelParam,
    bodyData: ApiKeyUpdateLabelBody
  ): Promise<Response> {
    try {
      const user = c.get("user");
      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const updatedKey = await apiKeyService.updateLabel(
        user.id,
        paramData.keyId,
        bodyData.label
      );

      return c.json({
        id: updatedKey.id,
        provider: updatedKey.provider,
        label: updatedKey.label,
        isActive: updatedKey.isActive,
      });
    } catch (error) {
      console.error("Error updating API key label:", error);
      return c.json({ error: "Failed to update API key label" }, 500);
    }
  }
}

export const apiKeyController = new ApiKeyController();
