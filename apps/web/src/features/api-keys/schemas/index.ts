import { z } from "zod";

export const saveApiKeySchema = z.object({
  provider: z
    .string()
    .min(1, "Provider cannot be empty")
    .max(50, "Provider name is too long")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Provider can only contain letters, numbers, underscores, and hyphens"
    ),
  apiKey: z
    .string()
    .min(1, "API key cannot be empty")
    .max(500, "API key is too long"),
  label: z.string().max(100, "Label is too long").optional(),
});

export const toggleActiveSchema = z.object({
  keyId: z.string().uuid("Invalid key ID"),
  isActive: z.boolean(),
});

export const updateLabelSchema = z.object({
  keyId: z.uuid("Invalid key ID"),
  label: z.string().max(100, "Label is too long").optional(),
});

export const deleteApiKeySchema = z.object({
  keyId: z.uuid("Invalid key ID"),
});

export type SaveApiKeyInput = z.infer<typeof saveApiKeySchema>;
export type ToggleActiveInput = z.infer<typeof toggleActiveSchema>;
export type UpdateLabelInput = z.infer<typeof updateLabelSchema>;
export type DeleteApiKeyInput = z.infer<typeof deleteApiKeySchema>;

export interface ApiKeyListItem {
  id?: string;
  provider?: string;
  label?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}
