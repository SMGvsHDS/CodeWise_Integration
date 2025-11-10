import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const LoginSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      setToken(token);
      navigate("/organizations", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate, setToken, token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Signing you in...</p>
      </div>
    </div>
  );
};

export default LoginSuccess;
