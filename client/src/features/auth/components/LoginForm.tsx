import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { AuthContext } from "@/shared/context/AuthContext";
import { Loader2, AlertCircle, Mail, Lock, ArrowRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ForgotPasswordDialog } from "./ForgotPasswordDialog";

// Define the error shape (same as we did in Register)
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  // 1. Hook into your real Auth Context
  const { login } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);

    // Client-side validation
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    try {
      // 2. REAL API CALL (Replaces the simulation)
      await login(formData);

      console.log("Login successful");
      navigate("/"); // Redirect to dashboard
    } catch (err: unknown) {
      const apiError = err as ApiError;
      const status = apiError.response?.status;
      const errorMessage =
        apiError.response?.data?.message || apiError.message || "Login failed.";

      // 3. Map Backend Errors to UI Alerts
      if (status === 404 || errorMessage.toLowerCase().includes("not found")) {
        setError("No account found with this email address.");
      } else if (
        status === 401 ||
        status === 400 ||
        errorMessage.toLowerCase().includes("invalid")
      ) {
        setError("Invalid credentials. Please check your password.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit();
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Card className="border-border shadow-lg">
        <CardHeader className="space-y-1 pb-6 pt-8 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error && (
            <Alert
              variant="destructive"
              className="animate-in fade-in-50 bg-destructive/10 border-destructive/20 text-destructive"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-muted-foreground">
                <Mail className="h-4 w-4" />
              </div>
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
                onKeyPress={handleKeyPress}
                className={cn(
                  "pl-9 h-10 bg-background",
                  error && "border-destructive focus-visible:ring-destructive",
                )}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(true)}
                className="text-sm font-medium text-primary hover:text-primary/80 hover:underline underline-offset-4"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute left-3 top-3 text-muted-foreground">
                <Lock className="h-4 w-4" />
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
                  "pl-9 h-10 bg-background",
                  error && "border-destructive focus-visible:ring-destructive",
                )}
                required
              />
            </div>
          </div>

          <Button
            className="mt-2 w-full h-10 font-semibold transition-all"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Sign In <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-primary hover:underline underline-offset-4"
        >
          Sign up
        </Link>
      </div>

      <ForgotPasswordDialog
        open={isForgotPasswordOpen}
        onOpenChange={setIsForgotPasswordOpen}
      />
    </div>
  );
}
