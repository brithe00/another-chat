import { z } from "zod";

export const apiKeyCreateSchema = z.object({
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

export const apiKeyDeleteSchema = z.object({
  keyId: z.cuid().min(1, "Key ID cannot be empty"),
});

export type ApiKeyCreateInput = z.infer<typeof apiKeyCreateSchema>;
export type ApiKeyDeleteInput = z.infer<typeof apiKeyDeleteSchema>;
