import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createConvention,
  deleteConvention,
  fetchConventions,
  updateConvention,
} from "@/api/conventions";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api-client";
import type { CodeConvention, CodeConventionPayload } from "@/types/api";

export const conventionsQueryKey = (repoId: string | number) => [
  "conventions",
  String(repoId),
];

export const useConventions = (repoId: string | number | undefined) => {
  const { token, clearToken } = useAuth();

  return useQuery<CodeConvention[]>({
    queryKey: conventionsQueryKey(repoId ?? "unknown"),
    enabled: Boolean(token && repoId),
    queryFn: async () => {
      if (!repoId) {
        return [];
      }
      const response = await fetchConventions(repoId);
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

const handleAuthError =
  (clearToken: () => void) =>
  (error: unknown): void => {
    if (error instanceof ApiError && error.status === 401) {
      clearToken();
    }
  };

export const useConventionMutations = (
  repoId: string | number | undefined,
) => {
  const queryClient = useQueryClient();
  const { clearToken } = useAuth();

  const invalidateList = () => {
    if (!repoId) return;
    queryClient.invalidateQueries({ queryKey: conventionsQueryKey(repoId) });
  };

  const onError = handleAuthError(clearToken);

  const createMutation = useMutation({
    mutationFn: async (payload: CodeConventionPayload) => {
      if (!repoId) {
        throw new Error("Repository ID is required");
      }
      const response = await createConvention(repoId, payload);
      return response.data;
    },
    onSuccess: () => {
      invalidateList();
    },
    onError,
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<CodeConventionPayload>;
    }) => {
      const response = await updateConvention(id, payload);
      return response.data;
    },
    onSuccess: (updated) => {
      invalidateList();
      queryClient.setQueryData<CodeConvention[] | undefined>(
        conventionsQueryKey(repoId ?? "unknown"),
        (prev) => {
          if (!prev) return prev;
          return prev.map((item) => (item.id === updated.id ? updated : item));
        },
      );
    },
    onError,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await deleteConvention(id);
    },
    onSuccess: () => {
      invalidateList();
    },
    onError,
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
