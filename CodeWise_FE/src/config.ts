const DEFAULT_API_BASE_URL = "http://localhost:8080";
const DEFAULT_PUBLIC_BACKEND_URL = "http://localhost:8080";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL;

export const PUBLIC_BACKEND_URL =
  import.meta.env.VITE_PUBLIC_BACKEND_URL ?? DEFAULT_PUBLIC_BACKEND_URL;

export const GITHUB_LOGIN_URL = `${PUBLIC_BACKEND_URL}/auth/github/login`;
export const LOGIN_SUCCESS_REDIRECT_PATH = "/login/success";

export const AUTH_TOKEN_STORAGE_KEY = "codewise.jwt";
