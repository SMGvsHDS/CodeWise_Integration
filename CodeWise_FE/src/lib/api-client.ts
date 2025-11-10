import { API_BASE_URL } from "@/config";
import { loadAuthToken } from "@/lib/auth-storage";

export type ApiRequestInit = RequestInit & {
  auth?: boolean;
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const apiFetch = async <T>(
  path: string,
  options: ApiRequestInit = {},
): Promise<T> => {
  const { auth = true, headers, ...rest } = options;

  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  const token = auth ? loadAuthToken() : null;
  const mergedHeaders = new Headers(headers ?? undefined);

  if (auth && token) {
    mergedHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...rest,
    headers: mergedHeaders,
  });

  let data: unknown = null;
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    data = await response.json();
  } else if (response.status !== 204) {
    data = await response.text();
  }

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data
        ? String((data as { message?: unknown }).message)
        : response.statusText || "Request failed";
    throw new ApiError(message, response.status, data);
  }

  return data as T;
};
