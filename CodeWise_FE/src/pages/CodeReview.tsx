import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Bot, Send, User, History, Plus, Trash2 } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useOrganization } from "@/context/OrganizationContext";
import { createQuestion, createSession, deleteSession, fetchQuestions, fetchSessions } from "@/api/questions";
import type { Question, QuestionSession } from "@/types/api";
import { ApiError } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import MarkdownContent from "@/components/MarkdownContent";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  convention?: string;
  tone?: "error";
}

const REVIEW_SESSION_STORAGE_KEY = "codewise-review-session";
const REVIEW_SELECTED_SESSION_KEY = "codewise-review-selected-session";

interface ReviewSession {
  code: string;
}

const CodeReview = () => {
  const navigate = useNavigate();
  const { repoId } = useParams();
  const location = useLocation();
  const locationState = location.state as { repoName?: string } | null;
  const { t } = useLanguage();
  const { selectedOrganization } = useOrganization();
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [question, setQuestion] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sessions, setSessions] = useState<QuestionSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [pendingMessagesMap, setPendingMessagesMap] = useState<Record<number, Message[]>>({});
  const [deletingSessionId, setDeletingSessionId] = useState<number | null>(null);
  const createDefaultMessages = useCallback(
    () => [
      {
        id: "welcome",
        role: "assistant" as const,
        content: t('review.welcome'),
      },
    ],
    [t],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(false);
  const [isSessionsLoading, setIsSessionsLoading] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const repoNameQuery = searchParams.get("repoName") ?? undefined;
  const repoName = locationState?.repoName ?? repoNameQuery ?? (repoId ? `#${repoId}` : "");
  const repositoryListPath = selectedOrganization
    ? `/repositories/${selectedOrganization.id}`
    : "/organizations";
  const hasPersistedRef = useRef(false);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const hasRepo = Boolean(repoId);
  const hasAskContent = question.trim().length > 0 || code.trim().length > 0;

  const loadQuestions = useCallback(async () => {
    if (!hasRepo || !repoId || !selectedSessionId) {
      setQuestions([]);
      setIsQuestionsLoading(false);
      return;
    }

    setIsQuestionsLoading(true);
    try {
      const response = await fetchQuestions(repoId, { size: 100, sessionId: selectedSessionId });
      const page = response?.data;
      setQuestions(page?.content ?? []);
    } catch (error) {
      const description =
        error instanceof ApiError ? error.message : t('review.toast_generic_error');
      toast({
        variant: "destructive",
        title: t('review.toast_questions_load_failed'),
        description,
      });
    } finally {
      setIsQuestionsLoading(false);
    }
  }, [hasRepo, repoId, selectedSessionId, toast, t]);

  const loadSessions = useCallback(async () => {
    if (!hasRepo || !repoId) {
      setSessions([]);
      setSelectedSessionId(null);
      setIsSessionsLoading(false);
      return;
    }

    setIsSessionsLoading(true);
    try {
      const response = await fetchSessions(repoId);
      const list = response?.data ?? [];
      setSessions(list);

      let nextSelected: number | null = null;
      if (list.length > 0) {
        let storedId: number | null = null;
        if (typeof window !== "undefined") {
          try {
            const raw = localStorage.getItem(REVIEW_SELECTED_SESSION_KEY);
            if (raw) {
              const parsed = JSON.parse(raw) as Record<string, number>;
              const candidate = parsed[String(repoId)];
              if (typeof candidate === "number") {
                storedId = candidate;
              }
            }
          } catch {
            storedId = null;
          }
        }
        const matching = storedId ? list.find((session) => session.id === storedId) : undefined;
        nextSelected = matching ? matching.id : list[0]?.id ?? null;
      }

      setSelectedSessionId(nextSelected);
    } catch (error) {
      const description =
        error instanceof ApiError ? error.message : t('review.toast_generic_error');
      toast({
        variant: "destructive",
        title: t('review.toast_sessions_load_failed'),
        description,
      });
      setSessions([]);
      setSelectedSessionId(null);
    } finally {
      setIsSessionsLoading(false);
    }
  }, [hasRepo, repoId, t, toast]);

  useEffect(() => {
    hasPersistedRef.current = false;
    setPendingMessagesMap({});
    setQuestions([]);
    setSessions([]);
    setSelectedSessionId(null);
    if (typeof window === "undefined") {
      return;
    }
    if (!repoId) {
      setCode("");
      return;
    }
    try {
      const stored = localStorage.getItem(REVIEW_SESSION_STORAGE_KEY);
      if (!stored) {
        setCode("");
        return;
      }
      const parsed = JSON.parse(stored) as Record<string, ReviewSession>;
      const session = parsed[repoId];
      if (session) {
        setCode(session.code ?? "");
      } else {
        setCode("");
      }
    } catch {
      setCode("");
    }
  }, [repoId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!repoId) return;
    if (!hasPersistedRef.current) {
      hasPersistedRef.current = true;
      return;
    }
    try {
      const stored = localStorage.getItem(REVIEW_SESSION_STORAGE_KEY);
      const parsed = stored ? (JSON.parse(stored) as Record<string, ReviewSession>) : {};
      parsed[repoId] = {
        ...(parsed[repoId] ?? {}),
        code,
      };
      localStorage.setItem(REVIEW_SESSION_STORAGE_KEY, JSON.stringify(parsed));
    } catch {
      // ignore storage errors
    }
  }, [code, repoId]);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    if (typeof window === "undefined" || !repoId) return;
    try {
      const raw = localStorage.getItem(REVIEW_SELECTED_SESSION_KEY);
      const parsed = raw ? (JSON.parse(raw) as Record<string, number>) : {};
      if (selectedSessionId) {
        parsed[String(repoId)] = selectedSessionId;
      } else {
        delete parsed[String(repoId)];
      }
      localStorage.setItem(REVIEW_SELECTED_SESSION_KEY, JSON.stringify(parsed));
    } catch {
      // ignore selection persistence failures
    }
  }, [repoId, selectedSessionId]);

  useEffect(() => {
    void loadQuestions();
  }, [loadQuestions]);

  useEffect(() => {
    setQuestions([]);
  }, [selectedSessionId]);

  const buildUserMessageContent = useCallback(
    (questionText: string, codeSnippet?: string | null) => {
      if (codeSnippet && codeSnippet.trim().length > 0) {
        return `${questionText}\n\n\`\`\`\n${codeSnippet}\n\`\`\``;
      }
      return questionText;
    },
    [],
  );

  const formatSessionTimestamp = useCallback((isoString: string | null) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) {
      return "";
    }
    return date.toLocaleString();
  }, []);

  const conversationMessages = useMemo(() => {
    const pendingMessages = selectedSessionId
      ? pendingMessagesMap[selectedSessionId] ?? []
      : [];
    const initial = createDefaultMessages();
    const sorted = [...questions].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    const built = [...initial];

    sorted.forEach((item) => {
      built.push({
        id: `question-${item.id}`,
        role: "user" as const,
        content: buildUserMessageContent(item.question, item.codeSnippet ?? undefined),
      });

      if (item.status === "FAILED") {
        built.push({
          id: `question-${item.id}-failed`,
          role: "assistant" as const,
          content: item.failureReason ?? t('review.failed_to_answer'),
          tone: "error",
        });
      } else if (item.aiResponse?.answer) {
        built.push({
          id: `question-${item.id}-answer`,
          role: "assistant" as const,
          content: item.aiResponse.answer,
          convention: item.aiResponse.matchedConvent ?? undefined,
        });
      } else {
        built.push({
          id: `question-${item.id}-pending`,
          role: "assistant" as const,
          content: t('review.analyzing'),
        });
      }
    });

    if (pendingMessages.length > 0) {
      built.push(...pendingMessages);
    }

    return built;
  }, [
    buildUserMessageContent,
    createDefaultMessages,
    pendingMessagesMap,
    questions,
    selectedSessionId,
    t,
  ]);

  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [conversationMessages, selectedSessionId]);

  const activeSession = useMemo(
    () =>
      selectedSessionId ? sessions.find((session) => session.id === selectedSessionId) ?? null : null,
    [selectedSessionId, sessions],
  );

  const handleViewHistory = () => {
    if (!repoId) return;
    const query = repoName ? `?repoName=${encodeURIComponent(repoName)}` : "";
    navigate(`/review/${repoId}/history${query}`, { state: { repoName } });
  };

  const handleDeleteSession = useCallback(
    async (sessionId: number) => {
      if (!repoId || deletingSessionId !== null) return;
      setDeletingSessionId(sessionId);
      try {
        await deleteSession(repoId, sessionId);
        setSessions((prev) => {
          const next = prev.filter((session) => session.id !== sessionId);
          if (selectedSessionId === sessionId) {
            const fallback = next[0]?.id ?? null;
            setSelectedSessionId(fallback);
          }
          return next;
        });
        setPendingMessagesMap((prev) => {
          if (!(sessionId in prev)) {
            return prev;
          }
          const next = { ...prev };
          delete next[sessionId];
          return next;
        });
        toast({
          title: t('review.toast_session_deleted'),
        });
      } catch (error) {
        const description =
          error instanceof ApiError ? error.message : t('review.toast_generic_error');
        toast({
          variant: "destructive",
          title: t('review.toast_session_delete_failed'),
          description,
        });
      } finally {
        setDeletingSessionId(null);
      }
    },
    [deletingSessionId, repoId, selectedSessionId, t, toast],
  );

  const handleCreateSession = useCallback(
    async ({
      resetInputs = false,
    }: { resetInputs?: boolean } = {}): Promise<QuestionSession | null> => {
      if (!repoId || !hasRepo) {
        return null;
      }
      setIsCreatingSession(true);
      try {
        const response = await createSession(repoId);
        const created = response?.data ?? null;
        if (created) {
          setSessions((prev) => {
            const filtered = prev.filter((item) => item.id !== created.id);
            return [created, ...filtered];
          });
          setSelectedSessionId(created.id);
          setQuestions([]);
          setPendingMessagesMap((prev) => ({
            ...prev,
            [created.id]: [],
          }));
          if (resetInputs) {
            setCode("");
            setQuestion("");
          }
        }
        return created;
      } catch (error) {
        const description =
          error instanceof ApiError ? error.message : t('review.toast_generic_error');
        toast({
          variant: "destructive",
          title: t('review.toast_session_create_failed'),
          description,
        });
        return null;
      } finally {
        setIsCreatingSession(false);
      }
    },
    [hasRepo, repoId, t, toast],
  );

  const handleAskAI = async () => {
    const trimmedQuestion = question.trim();
    const trimmedCode = code.trim();
    const hasQuestion = trimmedQuestion.length > 0;
    const hasCode = trimmedCode.length > 0;
    if (!hasQuestion && !hasCode) {
      toast({
        variant: "destructive",
        title: t('review.toast_question_failed'),
        description: t('review.toast_code_required'),
      });
      return;
    }
    if (!repoId) {
      toast({
        variant: "destructive",
        title: t('review.toast_question_failed'),
        description: t('review.toast_generic_error'),
      });
      return;
    }

    let activeSessionId = selectedSessionId;
    if (!activeSessionId) {
      const newSession = await handleCreateSession();
      if (!newSession) {
        return;
      }
      activeSessionId = newSession.id;
    }
    if (!activeSessionId) {
      toast({
        variant: "destructive",
        title: t('review.toast_question_failed'),
        description: t('review.toast_generic_error'),
      });
      return;
    }

    const sessionId = activeSessionId;
    const basePrompt = hasQuestion ? trimmedQuestion : t('review.default_prompt');
    const codeSnippet = hasCode ? code : undefined;
    const userContent = buildUserMessageContent(basePrompt, codeSnippet);

    const userMessage: Message = {
      id: `pending-user-${Date.now()}`,
      role: "user",
      content: userContent,
    };

    const pendingResponse: Message = {
      id: `pending-assistant-${Date.now()}`,
      role: "assistant",
      content: t('review.analyzing'),
    };

    setPendingMessagesMap((prev) => ({
      ...prev,
      [sessionId]: [userMessage, pendingResponse],
    }));
    setIsSubmitting(true);
    setQuestion("");

    try {
      const response = await createQuestion(repoId, {
        question: basePrompt,
        codeSnippet,
        sessionId,
      });
      const created = response?.data;
      if (created) {
        setQuestions((prev) => {
          if (created.sessionId !== sessionId) {
            return prev;
          }
          const filtered = prev.filter((item) => item.id !== created.id);
          return [...filtered, created];
        });
      }
      if (selectedSessionId === sessionId) {
        await loadQuestions();
      }
    } catch (error) {
      const description =
        error instanceof ApiError ? error.message : t('review.toast_generic_error');
      toast({
        variant: "destructive",
        title: t('review.toast_question_failed'),
        description,
      });
    } finally {
      setPendingMessagesMap((prev) => {
        const next = { ...prev };
        delete next[sessionId];
        return next;
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Code<span className="text-primary">wise</span> {t('review.title')}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleViewHistory}
              >
                <History className="w-4 h-4" />
                {t('review.view_history')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => navigate(repositoryListPath)}
              >
                <ArrowLeft className="w-4 h-4" />
                {t('review.back_to_repositories')}
              </Button>
              <Badge variant="outline" className="text-primary border-primary">
                {repoName || t('review.repository')}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {!hasRepo ? (
          <div className="h-full flex items-center justify-center p-6">
            <Card className="p-8 text-center space-y-3 border-dashed border-border/60 bg-card/60">
              <h3 className="text-lg font-semibold text-foreground">
                {t('review.no_repo_selected_title')}
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {t('review.no_repo_selected_description')}
              </p>
              <div className="pt-2">
                <Button
                  variant="hero"
                  onClick={() => navigate(repositoryListPath)}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('review.no_repo_selected_button')}
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row h-full">
            <aside className="w-full md:w-52 lg:w-60 border-r border-border bg-card/60 flex-shrink-0 flex flex-col min-h-0">
              <div className="px-4 py-3 border-b border-border/60">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('review.sessions_title')}
                </span>
              </div>
              <div className="flex-1 overflow-auto scrollbar-custom">
                {isSessionsLoading ? (
                  <div className="p-4 text-sm text-muted-foreground">
                    {t('review.sessions_loading')}
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground text-center">
                    {t('review.sessions_empty')}
                  </div>
                ) : (
                  <div className="py-2">
                    {sessions.map((session) => {
                      const isActive = session.id === selectedSessionId;
                      const isDeleting = deletingSessionId === session.id;
                      return (
                        <div
                          key={session.id}
                          className={`group flex items-center gap-2 px-4 py-3 transition ${
                            isActive
                              ? "bg-background text-primary border-l-2 border-primary"
                              : "hover:bg-card/80 text-foreground"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedSessionId(session.id)}
                            className="flex-1 text-left"
                            disabled={isDeleting}
                          >
                            <div className="text-sm font-semibold truncate">
                              {session.title}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {formatSessionTimestamp(session.lastMessageAt)}
                            </div>
                          </button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="shrink-0 opacity-70 hover:opacity-100 text-muted-foreground hover:text-destructive disabled:opacity-40"
                            aria-label={t('review.session_delete')}
                            title={t('review.session_delete')}
                            onClick={(event) => {
                              event.stopPropagation();
                              void handleDeleteSession(session.id);
                            }}
                            disabled={isDeleting}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </aside>

            <div className="flex flex-col md:w-[45%] lg:w-[40%] border-r border-border bg-code-bg min-h-0">
              <div className="border-b border-border bg-card px-6 py-3">
                <h2 className="text-lg font-semibold">{t('review.your_code')}</h2>
              </div>
              <div className="flex-1 flex flex-col px-6 pt-4 pb-0 gap-4">
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={t('review.paste_code')}
                  className="flex-1 w-full border border-border/70 bg-code-bg font-mono text-sm resize-none focus-visible:ring-0 rounded-md px-4 py-3 min-h-[300px] max-h-[50vh]"
                  disabled={!hasRepo}
                />
                <form
                  className="flex flex-col gap-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void handleAskAI();
                  }}
                >
                  <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={t('review.ask_question')}
                    className="bg-input border-border resize-y min-h-[120px] max-h-[220px]"
                    disabled={!hasRepo}
                    rows={5}
                  />
                  <Button
                    type="submit"
                    variant="hero"
                    className="w-full"
                    disabled={
                      !hasRepo ||
                      isSubmitting ||
                      isQuestionsLoading ||
                      isCreatingSession ||
                      !hasAskContent
                    }
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? t('review.analyzing') : t('review.ask_ai')}
                  </Button>
                </form>
              </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              <div className="border-b border-border bg-card px-6 py-3 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">{t('review.ai_assistant')}</h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    void handleCreateSession({ resetInputs: true });
                  }}
                  disabled={isCreatingSession}
                >
                  <Plus className="w-4 h-4" />
                  {isCreatingSession ? t('review.creating_chat') : t('review.new_chat')}
                </Button>
              </div>
              <div className="border-b border-border/80 px-6 py-4 flex flex-col gap-1">
                <h3 className="text-base font-semibold">
                  {activeSession?.title || t('review.session_placeholder_title')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {activeSession?.lastMessageAt
                    ? `${t('review.session_last_active')}: ${formatSessionTimestamp(activeSession.lastMessageAt)}`
                    : t('review.session_last_active_empty')}
                </p>
              </div>
              <div
                ref={messageContainerRef}
                className="flex-1 overflow-auto scrollbar-custom p-6 space-y-4"
              >
                {selectedSessionId === null ? (
                  <Card className="p-8 text-center space-y-3 border-dashed border-border/60 bg-card/60">
                    <h3 className="text-lg font-semibold text-foreground">
                      {t('review.session_placeholder_title')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('review.session_start_prompt')}
                    </p>
                  </Card>
                ) : isQuestionsLoading ? (
                  <Card className="p-8 text-center space-y-3 border-dashed border-border/60 bg-card/60">
                    <Bot className="w-8 h-8 mx-auto text-primary animate-pulse" />
                    <p className="text-sm text-muted-foreground">
                      {t('review.loading_chat')}
                    </p>
                  </Card>
                ) : (
                  conversationMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === "user" ? "justify-end" : ""
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] ${
                          message.role === "user" ? "order-first" : ""
                        }`}
                      >
                        <Card
                          className={`p-4 ${
                            message.role === "user"
                              ? "bg-chat-user text-primary-foreground border-primary/30"
                              : message.tone === "error"
                                ? "bg-destructive/10 border-destructive/40 text-destructive-foreground"
                                : "bg-chat-ai border-border"
                          }`}
                        >
                          <MarkdownContent content={message.content} />
                          {message.convention && (
                            <Badge
                              variant="outline"
                              className="mt-3 border-primary/50 text-primary"
                            >
                              📋 {message.convention}
                            </Badge>
                          )}
                        </Card>
                      </div>
                      {message.role === "user" && (
                        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeReview;
