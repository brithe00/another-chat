import { authClient } from "@/lib/auth-client";

export const authKeys = {
  session: () => ["auth", "session"],
};

export const authApi = {
  getSession: async () => {
    return authClient.getSession();
  },
};
