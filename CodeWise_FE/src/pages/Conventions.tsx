import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  FileText,
  Trash2,
  Pencil,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import {
  useConventions,
  useConventionMutations,
} from "@/hooks/useConventions";
import { ApiError } from "@/lib/api-client";
import type { CodeConvention, CodeConventionPayload } from "@/types/api";

type ConventionFormState = CodeConventionPayload;

const EMPTY_FORM_STATE: ConventionFormState = {
  title: "",
  language: "",
  content: "",
};

const Conventions = () => {
  const { repoId } = useParams<{ repoId: string }>();
  const location = useLocation();
  const locationState = location.state as { repoName?: string } | null;
  const { t } = useLanguage();
  const { toast } = useToast();
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const repoNameQuery = searchParams.get("repoName") ?? undefined;
  const repoName = repoNameQuery ?? locationState?.repoName;
  const repoDisplayName =
    repoName ?? (repoId ? `#${repoId}` : t("conv.repo_unknown"));

  const {
    data: conventions = [],
    isLoading,
    isError,
    refetch,
  } = useConventions(repoId);
  const { createMutation, updateMutation, deleteMutation } =
    useConventionMutations(repoId);

  const [selectedConventionId, setSelectedConventionId] = useState<
    number | null
  >(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ConventionFormState>(() => ({
    ...EMPTY_FORM_STATE,
  }));

  useEffect(() => {
    if (!conventions || conventions.length === 0) {
      setSelectedConventionId(null);
      return;
    }

    setSelectedConventionId((prev) => {
      if (prev == null) {
        return conventions[0].id;
      }
      return conventions.some((item) => item.id === prev)
        ? prev
        : conventions[0].id;
    });
  }, [conventions]);

  const selectedConvention = useMemo(() => {
    if (!conventions) {
      return null;
    }
    return conventions.find((item) => item.id === selectedConventionId) ?? null;
  }, [conventions, selectedConventionId]);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const extractErrorMessage = (error: unknown) => {
    if (error instanceof ApiError && error.message) {
      return error.message;
    }
    if (error instanceof Error && error.message) {
      return error.message;
    }
    return t("conv.error_generic");
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ ...EMPTY_FORM_STATE });
    setShowForm(false);
  };

  const handleToggleForm = () => {
    if (showForm && editingId == null) {
      resetForm();
      return;
    }
    setEditingId(null);
    setFormData({ ...EMPTY_FORM_STATE });
    setShowForm((prev) => !prev);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!repoId) {
      toast({
        variant: "destructive",
        title: t("conv.toast_error"),
        description: t("conv.error_generic"),
      });
      return;
    }

    try {
      if (editingId != null) {
        const updated = await updateMutation.mutateAsync({
          id: editingId,
          payload: formData,
        });
        toast({
          title: t("conv.toast_updated"),
        });
        setSelectedConventionId(updated.id);
      } else {
        const created = await createMutation.mutateAsync(formData);
        toast({
          title: t("conv.toast_created"),
        });
        setSelectedConventionId(created.id);
      }
      resetForm();
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("conv.toast_error"),
        description: extractErrorMessage(error),
      });
    }
  };

  const handleEdit = (event: React.MouseEvent, convention: CodeConvention) => {
    event.stopPropagation();
    setEditingId(convention.id);
    setFormData({
      title: convention.title,
      language: convention.language,
      content: convention.content,
    });
    setShowForm(true);
    setSelectedConventionId(convention.id);
  };

  const handleDeleteClick = async (event: React.MouseEvent, id: number) => {
    event.stopPropagation();
    if (!window.confirm(t("conv.delete_confirm"))) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: t("conv.toast_deleted"),
      });
      if (selectedConventionId === id) {
        setSelectedConventionId(null);
      }
      resetForm();
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("conv.toast_error"),
        description: extractErrorMessage(error),
      });
    }
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) {
      return isoString;
    }
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              {t("conv.title")}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t("conv.subtitle")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("conv.repo_label")}{" "}
              <span className="text-foreground font-medium">
                {repoDisplayName}
              </span>
            </p>
          </div>
          <Button variant="hero" onClick={handleToggleForm}>
            <Plus className="w-4 h-4" />
            {t("conv.add")}
          </Button>
        </div>

        {showForm && (
          <Card className="border-primary/50 shadow-lg">
            <CardHeader>
              <CardTitle>
                {editingId != null ? t("conv.edit_title") : t("conv.add_title")}
              </CardTitle>
              <CardDescription>{t("conv.form_description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t("conv.form_title")}</Label>
                  <Input
                    id="title"
                    placeholder={t("conv.form_title_placeholder")}
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">{t("conv.form_language")}</Label>
                  <Input
                    id="language"
                    placeholder={t("conv.form_language_placeholder")}
                    value={formData.language}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        language: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">{t("conv.form_content")}</Label>
                  <Textarea
                    id="content"
                    placeholder={t("conv.form_content_placeholder")}
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    rows={6}
                    className="font-mono text-sm"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    variant="hero"
                    disabled={isSaving}
                    className="gap-2"
                  >
                    {isSaving && (
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                    )}
                    {t("conv.save")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={isSaving}
                  >
                    {t("conv.cancel")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div>
              <p className="text-lg font-semibold">{t("conv.error")}</p>
              <p className="text-sm text-muted-foreground">
                {t("conv.error_hint")}
              </p>
            </div>
            <Button variant="outline" onClick={() => refetch()}>
              {t("conv.retry")}
            </Button>
          </div>
        ) : conventions.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t("conv.no_conventions")}</p>
            <p className="text-muted-foreground text-sm mt-2">
              {t("conv.empty_hint")}
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">{t("conv.title")}</h2>
            <div className="grid gap-4">
              {conventions.map((convention) => {
                const isSelected = selectedConventionId === convention.id;
                const detail = isSelected ? convention : null;

                return (
                  <Card
                    key={convention.id}
                    className={`border-2 transition-colors cursor-pointer ${
                      isSelected
                        ? "border-primary"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() =>
                      setSelectedConventionId((prev) =>
                        prev === convention.id ? null : convention.id,
                      )
                    }
                  >
                    <CardHeader className="flex-row items-center justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl flex items-center gap-2">
                          <span className="truncate">{convention.title}</span>
                          <Badge variant="secondary" className="font-mono">
                            {convention.language}
                          </Badge>
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(event) => handleEdit(event, convention)}
                          aria-label={t("conv.edit")}
                          disabled={deleteMutation.isPending}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(event) =>
                            handleDeleteClick(event, convention.id)
                          }
                          className="text-destructive hover:text-destructive"
                          aria-label={t("conv.delete")}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    {detail && (
                      <CardContent className="pt-0 pb-6">
                        <div className="space-y-4 border-t border-border pt-4">
                          <CardDescription className="flex flex-wrap items-center gap-3 text-sm">
                            <Badge variant="secondary" className="font-mono">
                              {detail.language}
                            </Badge>
                            <span>
                              {t("conv.created_by")}: {detail.created_by_login}
                            </span>
                            <span>
                              {t("conv.created_at")}:{" "}
                              {formatDateTime(detail.created_at)}
                            </span>
                          </CardDescription>
                          <div className="space-y-2">
                            <Label>{t("conv.detail_content")}</Label>
                            <p className="text-muted-foreground whitespace-pre-wrap">
                              {detail.content}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    )}
                    {isSelected && !detail && (
                      <CardContent className="pt-0 pb-6">
                        <div className="border-t border-border pt-4 text-sm text-muted-foreground">
                          {t("conv.detail_missing")}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Conventions;
