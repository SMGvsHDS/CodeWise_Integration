import { useQuery } from "@tanstack/react-query";
import { fetchRepositories } from "@/api/repositories";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api-client";
import type { Repository } from "@/types/api";

export const repositoriesQueryKey = (orgId: string | number) => [
  "repositories",
  String(orgId),
];

export const useRepositories = (orgId: string | number | undefined) => {
  const { token, clearToken } = useAuth();

  return useQuery<Repository[]>({
    queryKey: repositoriesQueryKey(orgId ?? "unknown"),
    enabled: Boolean(token && orgId),
    queryFn: async () => {
      if (!orgId) {
        return [];
      }
      const response = await fetchRepositories(orgId);
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
