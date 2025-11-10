import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { deleteAllQuestions, deleteQuestion, fetchQuestions } from "@/api/questions";
import type { Question, QuestionStatus } from "@/types/api";
import { ApiError } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import MarkdownContent from "@/components/MarkdownContent";

const QuestionHistory = () => {
  const { repoId } = useParams<{ repoId: string }>();
  const location = useLocation();
  const locationState = location.state as { repoName?: string } | null;
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const repoNameQuery = searchParams.get("repoName") ?? undefined;
  const repoName = locationState?.repoName ?? repoNameQuery ?? (repoId ? `#${repoId}` : "");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingQuestionId, setDeletingQuestionId] = useState<number | null>(null);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const loadHistory = async () => {
      if (!repoId) {
        setQuestions([]);
        setExpandedId(null);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetchQuestions(repoId, { size: 100 });
        if (isCancelled) return;
        const page = response?.data;
        setQuestions(page?.content ?? []);
      } catch (error) {
        if (isCancelled) return;
        const description =
          error instanceof ApiError ? error.message : t("review.toast_generic_error");
        toast({
          variant: "destructive",
          title: t("review.toast_questions_load_failed"),
          description,
        });
        setQuestions([]);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadHistory();

    return () => {
      isCancelled = true;
    };
  }, [repoId, t, toast]);

  useEffect(() => {
    if (questions.length === 0) {
      setExpandedId(null);
      return;
    }

    setExpandedId((prev) => {
      if (prev && questions.some((question) => question.id === prev)) {
        return prev;
      }
      const latest = [...questions]
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .pop();
      return latest ? latest.id : null;
    });
  }, [questions]);

  const history = useMemo(() => {
    return [...questions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [questions]);

  const hasHistory = history.length > 0;

  const handleDeleteQuestion = useCallback(
    async (questionId: number) => {
      if (!repoId || deletingQuestionId !== null || isDeletingAll) return;
      if (!window.confirm(t("review.delete_question_confirm"))) {
        return;
      }

      setDeletingQuestionId(questionId);
      try {
        await deleteQuestion(repoId, questionId);
        setQuestions((prev) => prev.filter((item) => item.id !== questionId));
        toast({
          title: t("review.toast_question_deleted"),
        });
      } catch (error) {
        const description =
          error instanceof ApiError ? error.message : t("review.toast_generic_error");
        toast({
          variant: "destructive",
          title: t("review.toast_question_delete_failed"),
          description,
        });
      } finally {
        setDeletingQuestionId(null);
      }
    },
    [deletingQuestionId, isDeletingAll, repoId, t, toast],
  );

  const handleDeleteAll = useCallback(async () => {
    if (!repoId || isDeletingAll || deletingQuestionId !== null || !hasHistory) return;
    if (!window.confirm(t("review.delete_all_confirm"))) {
      return;
    }
    setIsDeletingAll(true);
    try {
      await deleteAllQuestions(repoId);
      setQuestions([]);
      toast({
        title: t("review.toast_history_cleared"),
      });
    } catch (error) {
      const description =
        error instanceof ApiError ? error.message : t("review.toast_generic_error");
      toast({
        variant: "destructive",
        title: t("review.toast_history_clear_failed"),
        description,
      });
    } finally {
      setIsDeletingAll(false);
    }
  }, [deletingQuestionId, hasHistory, isDeletingAll, repoId, t, toast]);

  const formatHistoryTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) {
      return "";
    }
    return date.toLocaleString();
  };

  const handleBackToReview = () => {
    if (!repoId) {
      navigate("/repositories");
      return;
    }
    const query = repoName ? `?repoName=${encodeURIComponent(repoName)}` : "";
    navigate(`/review/${repoId}${query}`, { state: { repoName } });
  };

  const formatStatus = (status: QuestionStatus) => {
    switch (status) {
      case "ANSWERED":
        return t("review.status.ANSWERED");
      case "FAILED":
        return t("review.status.FAILED");
      case "IN_PROGRESS":
        return t("review.status.IN_PROGRESS");
      case "PENDING":
      default:
        return t("review.status.PENDING");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <History className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">
                {t("review.question_history")}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              {repoName || t("review.repository")}
            </h1>
            <p className="text-muted-foreground text-sm">
              {t("review.history_description")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteAll}
              className="gap-2"
              disabled={!hasHistory || isDeletingAll || deletingQuestionId !== null}
            >
              <Trash2 className="w-4 h-4" />
              {isDeletingAll ? t("review.deleting") : t("review.delete_all_history")}
            </Button>
            <Button variant="outline" onClick={handleBackToReview} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t("review.back_to_review")}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {isLoading ? (
          <Card className="p-12 text-center space-y-4">
            <History className="w-12 h-12 mx-auto text-muted-foreground animate-pulse" />
            <div>
              <h2 className="text-lg font-semibold text-muted-foreground">
                {t("review.loading_history")}
              </h2>
              <p className="text-sm text-muted-foreground/80">
                {t("review.history_description")}
              </p>
            </div>
          </Card>
        ) : !hasHistory ? (
          <Card className="p-12 text-center space-y-4">
            <History className="w-12 h-12 mx-auto text-muted-foreground" />
            <div>
              <h2 className="text-lg font-semibold text-muted-foreground">
                {t("review.no_history")}
              </h2>
              <p className="text-sm text-muted-foreground/80">
                {t("review.history_empty_hint")}
              </p>
            </div>
            <Button variant="hero" onClick={handleBackToReview} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t("review.ask_new_question")}
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {history.map((item, index) => (
                <Card
                  key={item.id}
                  className={`transition border-2 ${
                    expandedId === item.id ? "border-primary" : "border-border"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId((prev) => (prev === item.id ? null : item.id))
                    }
                    className="w-full text-left p-6 flex items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      <Badge
                        variant="secondary"
                        className="mb-2"
                      >
                        {t("review.question_label")} {history.length - index}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="mb-2 ml-2 text-xs border-border text-muted-foreground uppercase tracking-wide"
                      >
                        {formatStatus(item.status)}
                      </Badge>
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap break-words max-h-16 overflow-hidden">
                        {item.question}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatHistoryTimestamp(item.createdAt)}
                    </span>
                  </button>
                  {expandedId === item.id && (
                    <div className="px-6 pb-6 space-y-4">
                      <Separator />
                      <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              {t("review.detail_status")}
                            </h4>
                            <p className="text-sm text-foreground">{formatStatus(item.status)}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              {t("review.detail_created_at")}
                            </h4>
                            <p className="text-sm text-foreground">
                              {formatHistoryTimestamp(item.createdAt)}
                            </p>
                          </div>
                          {item.language && (
                            <div>
                              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                {t("review.detail_language")}
                              </h4>
                              <p className="text-sm text-foreground">{item.language}</p>
                            </div>
                          )}
                          {item.aiResponse?.model && (
                            <div>
                              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                {t("review.detail_model")}
                              </h4>
                              <p className="text-sm text-foreground">
                                {[item.aiResponse.provider, item.aiResponse.model]
                                  .filter(Boolean)
                                  .join(" / ")}
                              </p>
                            </div>
                          )}
                          {(() => {
                            const response = item.aiResponse;
                            if (!response) return null;
                            const tokens =
                              response.totalTokens ?? response.completionTokens ?? null;
                            if (!tokens) return null;
                            return (
                              <div>
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                  {t("review.detail_tokens")}
                                </h4>
                                <p className="text-sm text-foreground">{tokens}</p>
                              </div>
                            );
                          })()}
                          {item.aiResponse?.latencyMs != null && (
                            <div>
                              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                {t("review.detail_latency")}
                              </h4>
                              <p className="text-sm text-foreground">
                                {item.aiResponse.latencyMs} ms
                              </p>
                            </div>
                          )}
                        </div>

                        {item.codeSnippet && item.codeSnippet.trim().length > 0 && (
                          <div className="space-y-2">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                              {t("review.detail_code")}
                            </h3>
                            <div className="bg-muted/40 border border-border rounded-md p-4 overflow-x-auto">
                              <pre className="text-sm font-mono whitespace-pre leading-relaxed">
                                <code>{item.codeSnippet}</code>
                              </pre>
                            </div>
                          </div>
                        )}

                        {item.status === "FAILED" && (
                          <div className="space-y-2">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-destructive">
                              {t("review.detail_failure_reason")}
                            </h3>
                            <p className="text-sm text-destructive whitespace-pre-wrap leading-relaxed">
                              {item.failureReason ?? t("review.failed_to_answer")}
                            </p>
                          </div>
                        )}

                        {item.aiResponse?.matchedConvent && (
                          <div className="space-y-2">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                              {t("review.detail_matched_conventions")}
                            </h3>
                            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                              {item.aiResponse.matchedConvent}
                            </p>
                          </div>
                        )}

                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            {t("review.detail_answer")}
                          </h3>
                          {item.aiResponse?.answer ? (
                            <MarkdownContent content={item.aiResponse.answer} />
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              {t("review.detail_no_answer")}
                            </p>
                          )}
                        </div>
                      </div>
                      <Separator />
                      <div className="flex flex-wrap justify-between gap-2">
                        <Button
                          type="button"
                          variant="destructive"
                          className="gap-2 text-sm"
                          onClick={(event) => {
                            event.stopPropagation();
                            void handleDeleteQuestion(item.id);
                          }}
                          disabled={deletingQuestionId !== null || isDeletingAll}
                        >
                          <Trash2 className="w-4 h-4" />
                          {deletingQuestionId === item.id
                            ? t("review.deleting")
                            : t("review.delete_question")}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="gap-2 text-sm text-primary hover:text-primary"
                          onClick={(event) => {
                            event.stopPropagation();
                            if (!repoId) return;
                            const queryParts = [];
                            if (repoName) {
                              queryParts.push(`repoName=${encodeURIComponent(repoName)}`);
                            }
                            queryParts.push(`ref=${item.id}`);
                            const query = queryParts.length ? `?${queryParts.join("&")}` : "";
                            navigate(`/review/${repoId}${query}`, {
                              state: { repoName, focusQuestionId: item.id },
                            });
                          }}
                        >
                          {t("review.revisit_question")}
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionHistory;
