import { useQuery } from "@tanstack/react-query";
import { fetchOrganizations } from "@/api/organizations";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api-client";
import type { Organization } from "@/types/api";

export const ORGANIZATIONS_QUERY_KEY = ["organizations"];

export const useOrganizations = () => {
  const { token, clearToken } = useAuth();

  return useQuery<Organization[]>({
    queryKey: ORGANIZATIONS_QUERY_KEY,
    enabled: Boolean(token),
    queryFn: async () => {
      const response = await fetchOrganizations();
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
