import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth, getApiError } from "@/context/AuthContext";
import type { UserRole } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("client");
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const redirectTo = searchParams.get("redirect");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast({ title: "Success", description: "Signed in successfully" });
      navigate(redirectTo || (role === "admin" ? "/admin" : `/dashboard/${role}`));
    } catch (error) {
      toast({ title: "Error", description: getApiError(error), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    loginWithGoogle(role);
  };

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      <div className="container-main flex items-center justify-center py-16">
        <div className="w-full max-w-md rounded-xl border bg-card p-8 card-shadow">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to your SubbyMe account</p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label>Sign in as</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["client", "contractor", "admin"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-all ${role === r ? "border-primary bg-accent text-primary" : "border-border text-muted-foreground hover:bg-secondary"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <GoogleSignInButton
              onClick={handleGoogleSignIn}
              text="Continue with Google"
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account? <Link to="/register" className="font-medium text-primary hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
