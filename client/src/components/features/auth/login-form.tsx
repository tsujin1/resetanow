import { useState } from "react"
import { Link } from "react-router-dom"
import { Loader2, AlertCircle, Mail, Lock, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
    // Clear error when user starts typing again
    if (error) setError("")
  }

  const handleSubmit = async () => {
    setError("")
    setIsLoading(true)
    
    // Simulate API call with specific error handling
    setTimeout(() => {
      // 1. Check for empty fields (Client-side validation)
      if (!formData.email || !formData.password) {
        setError("Please enter both email and password.")
        setIsLoading(false)
        return
      }

      // --- SIMULATION LOGIC (Replace this with your actual authService.login call) ---
      // This demonstrates the specific alerts you requested.
      
      // Scenario A: Simulate "No existing account"
      // (In a real app, this comes from the backend, e.g., 404 Not Found)
      if (formData.email !== "demo@gmail.com") {
        setError("No account found with this email address.")
        setIsLoading(false)
        return
      }

      // Scenario B: Simulate "Wrong Password"
      // (In a real app, this comes from the backend, e.g., 401 Unauthorized)
      if (formData.password !== "password123") {
        setError("Invalid email or password. Please try again.")
        setIsLoading(false)
        return
      }

      // Scenario C: Success
      console.log("Login successful")
      setIsLoading(false)
      // Navigate to dashboard here...
      
      // --- END SIMULATION ---

    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit()
    }
  }

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
            <Alert variant="destructive" className="animate-in fade-in-50 bg-destructive/10 border-destructive/20 text-destructive">
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
                className={cn("pl-9 h-10 bg-background", error && "border-destructive focus-visible:ring-destructive")}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-sm font-medium text-primary hover:text-primary/80 hover:underline underline-offset-4"
              >
                Forgot password?
              </a>
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
                className={cn("pl-9 h-10 bg-background", error && "border-destructive focus-visible:ring-destructive")}
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
    </div>
  )
}