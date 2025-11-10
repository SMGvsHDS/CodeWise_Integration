import { apiFetch } from "@/lib/api-client";
import type {
  ApiResponse,
  Page,
  Question,
  QuestionCreatePayload,
  QuestionSession,
  QuestionStatus,
} from "@/types/api";

type FetchQuestionsParams = {
  page?: number;
  size?: number;
  status?: QuestionStatus;
  sessionId?: number | string;
};

const buildQuery = (params: FetchQuestionsParams = {}) => {
  const searchParams = new URLSearchParams();

  if (typeof params.page === "number") {
    searchParams.set("page", String(params.page));
  }
  if (typeof params.size === "number") {
    searchParams.set("size", String(params.size));
  }
  if (params.status) {
    searchParams.set("status", params.status);
  }
  if (params.sessionId) {
    searchParams.set("sessionId", String(params.sessionId));
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const fetchQuestions = async (
  repoId: number | string,
  params: FetchQuestionsParams = {},
) =>
  apiFetch<ApiResponse<Page<Question>>>(
    `/repos/${repoId}/questions${buildQuery(params)}`,
  );

export const fetchQuestion = async (repoId: number | string, questionId: number | string) =>
  apiFetch<ApiResponse<Question>>(`/repos/${repoId}/questions/${questionId}`);

export const createQuestion = async (
  repoId: number | string,
  payload: QuestionCreatePayload,
) =>
  apiFetch<ApiResponse<Question>>(`/repos/${repoId}/questions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

type SessionCreatePayload = {
  title?: string;
};

export const fetchSessions = async (repoId: number | string) =>
  apiFetch<ApiResponse<QuestionSession[]>>(`/repos/${repoId}/sessions`);

export const createSession = async (
  repoId: number | string,
  payload: SessionCreatePayload = {},
) =>
  apiFetch<ApiResponse<QuestionSession>>(`/repos/${repoId}/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

export const deleteSession = async (repoId: number | string, sessionId: number | string) =>
  apiFetch<ApiResponse<void>>(`/repos/${repoId}/sessions/${sessionId}`, {
    method: "DELETE",
  });

export const deleteQuestion = async (repoId: number | string, questionId: number | string) =>
  apiFetch<ApiResponse<void>>(`/repos/${repoId}/questions/${questionId}`, {
    method: "DELETE",
  });

export const deleteAllQuestions = async (repoId: number | string) =>
  apiFetch<ApiResponse<void>>(`/repos/${repoId}/questions`, {
    method: "DELETE",
  });
