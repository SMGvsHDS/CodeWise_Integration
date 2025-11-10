import { apiFetch } from "@/lib/api-client";
import type { ApiResponse, CodeConvention, CodeConventionPayload } from "@/types/api";

export const fetchConventions = async (repoId: string | number) =>
  apiFetch<ApiResponse<CodeConvention[]>>(`/repos/${repoId}/code-conventions`);

export const createConvention = async (
  repoId: string | number,
  payload: CodeConventionPayload,
) =>
  apiFetch<ApiResponse<CodeConvention>>(`/repos/${repoId}/code-conventions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

export const updateConvention = async (
  conventionId: number,
  payload: Partial<CodeConventionPayload>,
) =>
  apiFetch<ApiResponse<CodeConvention>>(`/code-conventions/${conventionId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

export const deleteConvention = async (conventionId: number) =>
  apiFetch<ApiResponse<null>>(`/code-conventions/${conventionId}`, {
    method: "DELETE",
  });
