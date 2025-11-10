import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { GITHUB_LOGIN_URL } from "@/config";

const Login = () => {
  const { t } = useLanguage();

  const handleGitHubLogin = () => {
    window.location.href = GITHUB_LOGIN_URL;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4">
          <div className="inline-block p-4 rounded-2xl bg-card border border-primary/20">
            <div className="text-6xl font-bold text-primary">
              {"</>"}
            </div>
          </div>
          <h1 className="text-5xl font-bold tracking-tight">
            Code<span className="text-primary">wise</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('login.subtitle')}
          </p>
        </div>

        <div className="space-y-6 pt-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">{t('login.welcome')} 👋</h2>
            <p className="text-muted-foreground">
              Connect your GitHub account to get started with intelligent code reviews
            </p>
          </div>

          <Button
            variant="github"
            size="lg"
            className="w-full text-base font-semibold"
            onClick={handleGitHubLogin}
          >
            <Github className="w-5 h-5" />
            {t('login.signin')}
          </Button>

          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
