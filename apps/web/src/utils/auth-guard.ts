import { authApi, authKeys } from "@/features/auth/api";
import type { User, Session } from "@another-chat/db/types";
import type { QueryClient } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";

export interface AuthResponse {
  data: {
    user: User | null;
    session: Session | null;
  };
  error: any;
}

export async function requireAuth(
  queryClient: QueryClient,
  currentPath?: string
) {
  const session = await queryClient.ensureQueryData({
    queryKey: authKeys.session(),
    queryFn: authApi.getSession,
    staleTime: 30 * 1000,
  });

  if (!session?.data?.user) {
    queryClient.removeQueries({ queryKey: authKeys.session() });

    throw redirect({
      to: "/login",
      search: {
        redirect: currentPath || "/",
      },
    });
  }

  return session;
}
