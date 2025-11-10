import { apiFetch } from "@/lib/api-client";
import type { ApiResponse, Organization } from "@/types/api";

export const fetchOrganizations = async () =>
  apiFetch<ApiResponse<Organization[]>>("/orgs");
