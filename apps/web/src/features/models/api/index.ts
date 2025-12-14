import { client } from "@/lib/api-client";
import { handleApiError } from "@/lib/errors";
import {
  getModelsByProviderSchema,
  type GetModelsByProviderInput,
} from "../schemas";

export const modelApi = {
  listModels: async () => {
    try {
      const response = await client.api.models.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch models");
      }

      return response.json();
    } catch (error) {
      handleApiError(
        error,
        "An unexpected error occurred while fetching models"
      );
    }
  },

  listModelsByProvider: async (data: GetModelsByProviderInput) => {
    try {
      const validatedData = getModelsByProviderSchema.parse(data);

      const response = await client.api.models[":provider"].$get({
        param: { provider: validatedData.provider },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch models for provider");
      }

      return response.json();
    } catch (error) {
      handleApiError(
        error,
        "An unexpected error occurred while fetching models for provider"
      );
    }
  },
};
