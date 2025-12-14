import { client } from "@/lib/api-client";
import { handleApiError } from "@/lib/errors";
import {
  saveApiKeySchema,
  toggleActiveSchema,
  updateLabelSchema,
  deleteApiKeySchema,
  type SaveApiKeyInput,
  type ToggleActiveInput,
  type UpdateLabelInput,
  type DeleteApiKeyInput,
  type ApiKeyListItem,
} from "../schemas";

export const apiKeyApi = {
  saveApiKey: async (data: SaveApiKeyInput) => {
    try {
      const validatedData = saveApiKeySchema.parse(data);

      const response = await client.api.keys.$post({
        json: validatedData,
      });

      if (!response.ok) {
        throw new Error("Failed to save API key");
      }

      return response.json();
    } catch (error) {
      handleApiError(error, "An unexpected error occurred while saving the API key");
    }
  },

  listApiKeys: async (): Promise<ApiKeyListItem[]> => {
    try {
      const response = await client.api.keys.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch API keys");
      }

      return response.json() as Promise<ApiKeyListItem[]>;
    } catch (error) {
      handleApiError(error, "An unexpected error occurred while fetching API keys");
    }
  },

  toggleActive: async (data: ToggleActiveInput) => {
    try {
      const validatedData = toggleActiveSchema.parse(data);

      const response = await client.api.keys[":keyId"].toggle.$patch({
        param: { keyId: validatedData.keyId },
        json: { isActive: validatedData.isActive },
      });

      if (!response.ok) {
        throw new Error("Failed to update API key status");
      }

      return response.json();
    } catch (error) {
      handleApiError(error, "An unexpected error occurred while updating the API key status");
    }
  },

  updateLabel: async (data: UpdateLabelInput) => {
    try {
      const validatedData = updateLabelSchema.parse(data);

      const response = await client.api.keys[":keyId"].label.$patch({
        param: { keyId: validatedData.keyId },
        json: { label: validatedData.label },
      });

      if (!response.ok) {
        throw new Error("Failed to update API key label");
      }

      return response.json();
    } catch (error) {
      handleApiError(error, "An unexpected error occurred while updating the API key label");
    }
  },

  deleteApiKey: async (data: DeleteApiKeyInput) => {
    try {
      const validatedData = deleteApiKeySchema.parse(data);

      const response = await client.api.keys[":keyId"].$delete({
        param: { keyId: validatedData.keyId },
      });

      if (!response.ok) {
        throw new Error("Failed to delete API key");
      }

      return response.json();
    } catch (error) {
      handleApiError(error, "An unexpected error occurred while deleting the API key");
    }
  },
};
