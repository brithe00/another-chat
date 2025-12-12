import { auth } from "@another-chat/auth";
import type { MiddlewareHandler } from "hono";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
};

export const requireAuth: MiddlewareHandler = async (c, next) => {
  const user = c.get("user");

  if (!user) {
    return c.json({ message: "Unauthorized." }, 401);
  }

  await next();
};
