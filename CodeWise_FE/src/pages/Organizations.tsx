import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useOrganization } from "@/context/OrganizationContext";
import { useOrganizations } from "@/hooks/useOrganizations";
import type { Organization } from "@/types/api";

const Organizations = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { selectOrganization } = useOrganization();
  const {
    data: organizations,
    isLoading,
    isError,
    refetch,
  } = useOrganizations();

  const handleOrgClick = (org: Organization) => {
    selectOrganization({ id: String(org.id), name: org.name });
    navigate(`/repositories/${org.id}`);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            {t("org.title")}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t("org.subtitle")}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div>
              <p className="text-lg font-semibold">{t("org.error")}</p>
              <p className="text-sm text-muted-foreground">
                {t("org.error_hint")}
              </p>
            </div>
            <Button variant="outline" onClick={() => refetch()}>
              {t("org.retry")}
            </Button>
          </div>
        ) : organizations && organizations.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {organizations.map((org) => (
              <Card
                key={org.id}
                className="p-6 cursor-pointer border-2 glow-hover group"
                onClick={() => handleOrgClick(org)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-card-foreground/10 flex items-center justify-center overflow-hidden border border-border">
                    {org.avatarUrl ? (
                      <img
                        src={org.avatarUrl}
                        alt={org.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-semibold text-foreground">
                        {org.login?.slice(0, 2)?.toUpperCase() ?? "ORG"}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold truncate group-hover:text-primary transition-colors">
                      {org.name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      @{org.login}
                    </p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-3">
            <h2 className="text-2xl font-semibold">{t("org.empty")}</h2>
            <p className="text-muted-foreground">{t("org.empty_hint")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Organizations;
