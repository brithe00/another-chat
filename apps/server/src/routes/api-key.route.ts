import { apiKeyController } from "@/controllers/api-key.controller";
import { requireAuth } from "@/middleware/auth";
import {
  apiKeyCreateSchema,
  apiKeyDeleteSchema,
} from "@/schemas/api-key.schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

export const apiKeyRoutes = new Hono()
  .use(requireAuth)
  .post("/", zValidator("json", apiKeyCreateSchema), async (c) => {
    const validatedData = c.req.valid("json");
    return apiKeyController.saveApiKey(c, validatedData);
  })
  .get("/", async (c) => {
    return apiKeyController.listApiKeys(c);
  })
  .delete("/:keyId", zValidator("param", apiKeyDeleteSchema), async (c) => {
    const validatedData = c.req.valid("param");
    return apiKeyController.deleteApiKey(c, validatedData);
  });
