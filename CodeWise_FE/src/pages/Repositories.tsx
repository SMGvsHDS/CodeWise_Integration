import { useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  Settings,
  Lock,
  Globe,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useOrganization } from "@/context/OrganizationContext";
import { useRepositories } from "@/hooks/useRepositories";
import { useOrganizations } from "@/hooks/useOrganizations";

const Repositories = () => {
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const { t } = useLanguage();
  const { selectedOrganization, selectOrganization } = useOrganization();
  const {
    data: repositories,
    isLoading,
    isError,
    refetch,
  } = useRepositories(orgId);
  const { data: organizations } = useOrganizations();

  useEffect(() => {
    if (!orgId) {
      navigate("/organizations", { replace: true });
    }
  }, [orgId, navigate]);

  const matchingOrganization = useMemo(
    () => organizations?.find((org) => String(org.id) === String(orgId)),
    [organizations, orgId],
  );

  const resolvedOrgName =
    matchingOrganization?.name ??
    matchingOrganization?.login ??
    selectedOrganization?.name;

  useEffect(() => {
    if (!orgId) {
      return;
    }
    const normalizedOrgId = String(orgId);

    const needsUpdate =
      !selectedOrganization || selectedOrganization.id !== normalizedOrgId;

    const nameNeedsUpdate =
      resolvedOrgName &&
      selectedOrganization &&
      selectedOrganization.id === normalizedOrgId &&
      selectedOrganization.name !== resolvedOrgName;

    if (needsUpdate || nameNeedsUpdate) {
      const payload = resolvedOrgName
        ? { id: normalizedOrgId, name: resolvedOrgName }
        : { id: normalizedOrgId };
      selectOrganization(payload);
    }
  }, [
    orgId,
    resolvedOrgName,
    selectOrganization,
    selectedOrganization,
  ]);

  const handleRepoClick = (repoId: number, repoName: string) => {
    navigate(`/review/${repoId}`, { state: { repoName } });
  };

  const handleManageConventions = (repoId: number, repoName: string) => {
    const encodedName = encodeURIComponent(repoName);
    navigate(`/conventions/${repoId}?repoName=${encodedName}`, {
      state: { repoName },
    });
  };

  if (!orgId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            {t("repo.title")}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t("repo.subtitle")}
          </p>
          {resolvedOrgName && (
            <p className="text-sm text-muted-foreground">
              {t("repo.selected_org")}{" "}
              <span className="font-medium text-foreground">
                {resolvedOrgName}
              </span>
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div>
              <p className="text-lg font-semibold">{t("repo.error")}</p>
              <p className="text-sm text-muted-foreground">
                {t("repo.error_hint")}
              </p>
            </div>
            <Button variant="outline" onClick={() => refetch()}>
              {t("repo.retry")}
            </Button>
          </div>
        ) : repositories && repositories.length > 0 ? (
          <div className="grid gap-4">
            {repositories.map((repo) => {
              const visibility =
                repo.visibility?.toLowerCase() === "private"
                  ? "private"
                  : "public";
              const description =
                repo.description?.trim() || t("repo.no_description");
              return (
                <Card
                  key={repo.id}
                  className="p-6 cursor-pointer border-2 glow-hover group"
                  onClick={() => handleRepoClick(repo.id, repo.name)}
                >
                  <div className="flex items-center gap-6">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-semibold truncate group-hover:text-primary transition-colors">
                          {repo.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 border-border"
                        >
                          {visibility === "private" ? (
                            <Lock className="w-3 h-3" />
                          ) : (
                            <Globe className="w-3 h-3" />
                          )}
                          {t(`repo.${visibility}`)}
                        </Badge>
                        {repo.language && (
                          <Badge variant="secondary" className="uppercase">
                            {repo.language}
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground">{description}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleManageConventions(repo.id, repo.name);
                        }}
                        className="gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        {t("repo.manage_conventions")}
                      </Button>
                      <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center space-y-3">
            <h2 className="text-2xl font-semibold">{t("repo.empty")}</h2>
            <p className="text-muted-foreground">{t("repo.empty_hint")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Repositories;
