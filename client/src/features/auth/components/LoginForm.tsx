import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "@/shared/context/AuthContext";
import { Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ForgotPasswordDialog } from "./ForgotPasswordDialog";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const { login } = useContext(AuthContext)!;
  const navigate = useNavigate();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "invalid_reset_link") {
      setError("Invalid or expired password reset link.");
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      setIsLoading(false);
      return;
    }
    try {
      await login(formData);
      navigate("/");
    } catch {
      setError("Login failed. Please check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) handleSubmit();
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {/* Header Section */}
      <div className="flex flex-col space-y-2 text-left">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Sign in to continue
        </h1>
        <p className="text-sm text-slate-500">
          Login with your credentials to access your clinic dashboard and manage
          patients securely.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form Fields */}
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-slate-600">
            Email address
          </Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            value={formData.email}
            onChange={handleChange}
            className={cn(
              "h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all",
              error && "border-destructive focus-visible:ring-destructive",
            )}
            required
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-slate-600">
              Password
            </Label>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            value={formData.password}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className={cn(
              "h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all",
              error && "border-destructive focus-visible:ring-destructive",
            )}
            required
          />
        </div>

        <Button
          className="mt-2 h-12 w-full rounded-xl text-base font-medium shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Sign in →"
          )}
        </Button>
      </div>

      {/* Footer Links */}
      <div className="flex flex-col items-center gap-4 text-center text-sm text-slate-500">
        <button
          type="button"
          onClick={() => setIsForgotPasswordOpen(true)}
          className="hover:text-primary hover:underline underline-offset-4"
        >
          Forgot your password?
        </button>

        <p>
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-primary hover:underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </div>

      <ForgotPasswordDialog
        open={isForgotPasswordOpen}
        onOpenChange={setIsForgotPasswordOpen}
      />
    </div>
  );
}
