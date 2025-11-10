import { apiFetch } from "@/lib/api-client";
import type { ApiResponse, Repository } from "@/types/api";

export const fetchRepositories = async (orgId: string | number) =>
  apiFetch<ApiResponse<Repository[]>>(`/orgs/${orgId}/repos`);
