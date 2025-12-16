import { useState, useContext } from "react";
import { AuthContext } from "@/shared/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import authService from "@/features/auth/services/authService";
import { cn } from "@/shared/lib/utils";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError(""); // Clear error on type
  };

  // Define this interface outside or inside the component
  interface ApiError {
    response?: {
      data?: {
        message?: string;
      };
      status?: number;
    };
    message?: string;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const registerPayload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      await authService.register(registerPayload);
      await login({ email: formData.email, password: formData.password });
      navigate("/");
    } catch (err: unknown) {
      // 1. Change 'any' to 'unknown'

      // 2. Cast 'err' to the specific shape we expect
      const apiError = err as ApiError;

      const errorMessage =
        apiError.response?.data?.message ||
        apiError.message ||
        "Registration failed.";

      if (
        errorMessage.toLowerCase().includes("already exists") ||
        errorMessage.toLowerCase().includes("taken") ||
        errorMessage.toLowerCase().includes("duplicate") ||
        apiError.response?.status === 409
      ) {
        setError(
          "This email address is already chosen. Please use another one.",
        );
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      const syntheticEvent = {
        ...e,
        preventDefault: () => e.preventDefault(),
        currentTarget: (e.currentTarget as HTMLElement).closest(
          "form",
        ) as HTMLFormElement,
        target: (e.currentTarget as HTMLElement).closest(
          "form",
        ) as HTMLFormElement,
      } as unknown as React.FormEvent<HTMLFormElement>;
      handleSubmit(syntheticEvent);
    }
  };

  // --- RENDERING ---
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {/* Header Section - Clean text, no card header */}
      <div className="flex flex-col space-y-2 text-left">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Create an account
        </h1>
        <p className="text-sm text-slate-500">
          Enter your details to set up your clinic workspace and start managing
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

      {/* Form Fields - No Card Wrapper */}
      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name" className="text-slate-600">
            Full Name
          </Label>
          <Input
            id="name"
            placeholder="Dr. Juan Dela Cruz"
            disabled={isLoading}
            value={formData.name}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className={cn(
              "h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all",
              error && "border-destructive focus-visible:ring-destructive",
            )}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email" className="text-slate-600">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="doctor@clinic.com"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            value={formData.email}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className={cn(
              "h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all",
              error && "border-destructive focus-visible:ring-destructive",
            )}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password" className="text-slate-600">
            Password
          </Label>
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

        <div className="grid gap-2">
          <Label htmlFor="confirmPassword" className="text-slate-600">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            value={formData.confirmPassword}
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
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account →"
          )}
        </Button>
      </form>

      {/* Footer Links */}
      <div className="flex flex-col items-center gap-4 text-center text-sm text-slate-500">
        <p>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
