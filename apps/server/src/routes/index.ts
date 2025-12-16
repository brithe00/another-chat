import { Hono } from "hono";
import { modelRoutes } from "./model.route";
import { apiKeyRoutes } from "./api-key.route";
import { conversationRoutes } from "./conversation.route";

export const apiRoutes = new Hono()
  .route("/models", modelRoutes)
  .route("/keys", apiKeyRoutes)
  .route("/conversations", conversationRoutes);
