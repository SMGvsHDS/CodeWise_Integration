import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "@/api/user";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api-client";
import type { UserProfile } from "@/types/api";

export const CURRENT_USER_QUERY_KEY = ["currentUser"];

export const useCurrentUser = () => {
  const { token, clearToken } = useAuth();

  return useQuery<UserProfile>({
    queryKey: CURRENT_USER_QUERY_KEY,
    enabled: Boolean(token),
    queryFn: async () => {
      const response = await fetchCurrentUser();
      return response.data;
    },
    retry: false,
    onError: (error) => {
      if (error instanceof ApiError && error.status === 401) {
        clearToken();
      }
    },
  });
};
