export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type UserProfile = {
  id: number;
  githubId: number;
  login: string;
  name: string | null;
  email: string | null;
  role: string;
  avatarUrl: string | null;
  lastLoginAt: string | null;
};

export type Organization = {
  id: number;
  githubOrgId: number;
  login: string;
  name: string;
  avatarUrl: string | null;
};

export type Repository = {
  id: number;
  githubRepoId: number;
  name: string;
  fullName: string;
  description: string | null;
  defaultBranch: string | null;
  visibility: string;
  language: string | null;
};

export type CodeConvention = {
  id: number;
  repo_id: number;
  title: string;
  language: string;
  content: string;
  created_by: number;
  created_by_login: string;
  created_at: string;
};

export type CodeConventionPayload = {
  title: string;
  language: string;
  content: string;
};

export type PageSort = {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
};

export type PageMetadata = {
  sort: PageSort;
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
};

export type Page<T> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  sort: PageSort;
  pageable: PageMetadata;
};

export type QuestionStatus = "PENDING" | "IN_PROGRESS" | "ANSWERED" | "FAILED";

export type AiResponse = {
  id: number;
  questionId: number | null;
  provider: string | null;
  model: string | null;
  promptTokens: number | null;
  completionTokens: number | null;
  totalTokens: number | null;
  latencyMs: number | null;
  answer: string | null;
  matchedConvent: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Question = {
  id: number;
  question: string;
  codeSnippet: string | null;
  language: string | null;
  status: QuestionStatus;
  failureReason: string | null;
  userId: number | null;
  userLogin: string | null;
  organizationId: number | null;
  organizationName: string | null;
  repositoryId: number;
  repositoryName: string | null;
  sessionId: number | null;
  sessionTitle: string | null;
  createdAt: string;
  updatedAt: string;
  aiResponse: AiResponse | null;
};

export type QuestionCreatePayload = {
  question?: string;
  codeSnippet?: string;
  sessionId: number;
};

export type QuestionSession = {
  id: number;
  title: string;
  repositoryId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string | null;
};
