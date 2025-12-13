import { hc } from "hono/client";
import type { AppType } from "server";

export const client = hc<AppType>(import.meta.env.VITE_SERVER_URL, {
  init: {
    credentials: "include",
  },
});
