import { apiKeyController } from "@/controllers/api-key.controller";
import { requireAuth } from "@/middleware/auth";
import {
  apiKeyCreateSchema,
  apiKeyDeleteSchema,
  apiKeyToggleActiveParamSchema,
  apiKeyToggleActiveBodySchema,
  apiKeyUpdateLabelParamSchema,
  apiKeyUpdateLabelBodySchema,
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
  .patch(
    "/:keyId/toggle",
    zValidator("param", apiKeyToggleActiveParamSchema),
    zValidator("json", apiKeyToggleActiveBodySchema),
    async (c) => {
      const paramData = c.req.valid("param");
      const bodyData = c.req.valid("json");
      return apiKeyController.toggleActive(c, paramData, bodyData);
    }
  )
  .patch(
    "/:keyId/label",
    zValidator("param", apiKeyUpdateLabelParamSchema),
    zValidator("json", apiKeyUpdateLabelBodySchema),
    async (c) => {
      const paramData = c.req.valid("param");
      const bodyData = c.req.valid("json");
      return apiKeyController.updateLabel(c, paramData, bodyData);
    }
  )
  .delete("/:keyId", zValidator("param", apiKeyDeleteSchema), async (c) => {
    const validatedData = c.req.valid("param");
    return apiKeyController.deleteApiKey(c, validatedData);
  });
