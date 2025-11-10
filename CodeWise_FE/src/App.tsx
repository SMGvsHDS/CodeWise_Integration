import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { OrganizationProvider } from "./context/OrganizationContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import { LOGIN_SUCCESS_REDIRECT_PATH } from "./config";
import Login from "./pages/Login";
import LoginSuccess from "./pages/LoginSuccess";
import Organizations from "./pages/Organizations";
import Repositories from "./pages/Repositories";
import CodeReview from "./pages/CodeReview";
import Conventions from "./pages/Conventions";
import QuestionHistory from "./pages/QuestionHistory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/" || location.pathname === LOGIN_SUCCESS_REDIRECT_PATH;

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className={hideNavbar ? "" : "pt-[60px]"}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route
            path={LOGIN_SUCCESS_REDIRECT_PATH}
            element={<LoginSuccess />}
          />
          <Route path="/repositories/:orgId" element={<Repositories />} />
          <Route path="/review" element={<CodeReview />} />
          <Route path="/review/:repoId" element={<CodeReview />} />
          <Route path="/review/:repoId/history" element={<QuestionHistory />} />
          <Route path="/conventions/:repoId" element={<Conventions />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <OrganizationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </OrganizationProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
