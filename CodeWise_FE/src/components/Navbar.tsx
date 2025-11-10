import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Globe, Menu, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/context/LanguageContext";
import { useOrganization } from "@/context/OrganizationContext";
import { useAuth } from "@/context/AuthContext";
import { useCurrentUser, CURRENT_USER_QUERY_KEY } from "@/hooks/useCurrentUser";
import { ORGANIZATIONS_QUERY_KEY } from "@/hooks/useOrganizations";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { selectedOrganization, clearOrganization } = useOrganization();
  const { clearToken, isAuthenticated } = useAuth();
  const { data: currentUser } = useCurrentUser();

  const isActive = (path: string) => location.pathname.startsWith(path);
  const isOrganizationsPage = location.pathname.startsWith("/organizations");

  const repositoriesPath = selectedOrganization
    ? `/repositories/${selectedOrganization.id}`
    : null;
  const showRepositoriesNav = Boolean(repositoriesPath) && !isOrganizationsPage;
  const repositoryNavPath = showRepositoriesNav ? repositoriesPath : null;

  const displayName =
    currentUser?.name?.trim() || currentUser?.login || "User";

  const initialsSource =
    currentUser?.name?.trim() || currentUser?.login?.trim() || "";
  const avatarFallback =
    initialsSource.slice(0, 2).toUpperCase() || "CW";

  const handleLogout = () => {
    clearToken();
    clearOrganization();
    queryClient.removeQueries({ queryKey: CURRENT_USER_QUERY_KEY });
    queryClient.removeQueries({ queryKey: ORGANIZATIONS_QUERY_KEY });
    navigate("/", { replace: true });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[60px] bg-[#0F172A] border-b border-[#1E293B]">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate('/organizations')}
          className="text-xl font-bold hover:opacity-80 transition-opacity"
        >
          Code<span className="text-primary">wise</span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => navigate('/organizations')}
            className={`text-sm font-medium transition-colors pb-1 border-b-2 ${
              isActive('/organizations')
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground hover:border-primary'
            }`}
          >
            {t('nav.organizations')}
          </button>
          {repositoryNavPath && (
            <button
              onClick={() => navigate(repositoryNavPath)}
              className={`text-sm font-medium transition-colors pb-1 border-b-2 ${
                isActive(repositoryNavPath)
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground hover:border-primary'
              }`}
            >
              {t('nav.repositories')}
            </button>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarImage
                    src={currentUser?.avatarUrl ?? undefined}
                    alt={displayName ?? undefined}
                  />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col text-left max-w-[140px]">
                  <span className="text-sm font-medium text-foreground truncate">
                    {displayName}
                  </span>
                  {currentUser?.login && (
                    <span className="text-xs text-muted-foreground truncate">
                      @{currentUser.login}
                    </span>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                {t("nav.logout")}
              </Button>
            </div>
          )}
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{language.toUpperCase()}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem
                onClick={() => setLanguage('en')}
                className={language === 'en' ? 'bg-primary/20 text-primary' : ''}
              >
                English
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage('ko')}
                className={language === 'ko' ? 'bg-primary/20 text-primary' : ''}
              >
                한국어
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F172A] border-t border-[#1E293B]">
          <div className="container mx-auto px-6 py-4 space-y-3">
            <button
              onClick={() => {
                navigate('/organizations');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                isActive('/organizations')
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted-foreground hover:bg-card'
              }`}
            >
              {t('nav.organizations')}
            </button>
            {repositoryNavPath && (
              <button
                onClick={() => {
                  navigate(repositoryNavPath);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  isActive(repositoryNavPath)
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted-foreground hover:bg-card'
                }`}
              >
                {t('nav.repositories')}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
