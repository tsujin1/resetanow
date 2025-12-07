import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
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
import { Loader2, User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import authService from "@/services/authService";
import { cn } from "@/lib/utils";

export function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "",
    confirmPassword: ""
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
    } catch (err: unknown) { // 1. Change 'any' to 'unknown'
      
      // 2. Cast 'err' to the specific shape we expect
      const apiError = err as ApiError;
      
      const errorMessage = apiError.response?.data?.message || apiError.message || "Registration failed.";

      if (
        errorMessage.toLowerCase().includes("already exists") || 
        errorMessage.toLowerCase().includes("taken") ||
        errorMessage.toLowerCase().includes("duplicate") ||
        apiError.response?.status === 409
      ) {
        setError("This email address is already chosen. Please use another one.");
      } else {
        setError(errorMessage);
      }

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Card className="border-border shadow-lg">
        <CardHeader className="space-y-1 pb-6 pt-8 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create an account
          </CardTitle>
          <CardDescription>
            Enter your details to set up your clinic workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {error && (
              <Alert variant="destructive" className="animate-in fade-in-50 bg-destructive/10 border-destructive/20 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Full Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-muted-foreground">
                  <User className="h-4 w-4" />
                </div>
                <Input 
                  id="name" 
                  placeholder="Dr. Juan Dela Cruz" 
                  className="pl-9 h-10 bg-background"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                </div>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="doctor@clinic.com" 
                  className={cn("pl-9 h-10 bg-background", error.includes("email") && "border-destructive focus-visible:ring-destructive")}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  className="pl-9 h-10 bg-background"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="••••••••"
                  className="pl-9 h-10 bg-background"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <Button 
              className="mt-2 w-full h-10 font-semibold transition-all" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Creating account...
                </>
              ) : (
                <>
                  Register <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link 
          to="/login" 
          className="font-medium text-primary hover:underline underline-offset-4"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}