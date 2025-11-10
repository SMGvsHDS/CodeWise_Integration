import { apiFetch } from "@/lib/api-client";
import type { ApiResponse, UserProfile } from "@/types/api";

export const fetchCurrentUser = async () =>
  apiFetch<ApiResponse<UserProfile>>("/users/me");
