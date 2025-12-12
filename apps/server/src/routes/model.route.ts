import { modelController } from "@/controllers/model.controller";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { providerParamSchema } from "@/schemas/model.schema";

export const modelRoutes = new Hono()
  .get("/", async (c) => {
    return modelController.listModels(c);
  })
  .get("/:provider", zValidator("param", providerParamSchema), async (c) => {
    const validatedData = c.req.valid("param");
    return modelController.listModelsByProvider(c, validatedData);
  });
