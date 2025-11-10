import { AUTH_TOKEN_STORAGE_KEY } from "@/config";

export const loadAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
};

const persistToken = (token: string | null) => {
  if (typeof window === "undefined") return;

  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  }
};

export const saveAuthToken = (token: string) => persistToken(token);

export const clearAuthToken = () => persistToken(null);
