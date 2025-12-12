import { z } from "zod";

export const providerParamSchema = z.object({
  provider: z
    .string()
    .min(1, "Provider cannot be empty")
    .max(50, "Provider name is too long")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Provider can only contain letters, numbers, underscores, and hyphens"
    ),
});

export type ProviderParam = z.infer<typeof providerParamSchema>;
