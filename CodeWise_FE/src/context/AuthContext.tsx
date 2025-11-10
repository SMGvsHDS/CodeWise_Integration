import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearAuthToken,
  loadAuthToken,
  saveAuthToken,
} from "@/lib/auth-storage";

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  clearToken: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = loadAuthToken();
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleSetToken = useCallback((newToken: string) => {
    saveAuthToken(newToken);
    setToken(newToken);
  }, []);

  const handleClearToken = useCallback(() => {
    clearAuthToken();
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      setToken: handleSetToken,
      clearToken: handleClearToken,
    }),
    [handleClearToken, handleSetToken, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
