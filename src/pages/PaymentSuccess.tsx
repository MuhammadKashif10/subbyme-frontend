import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { refreshUser } = useAuth();

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      <div className="container-main flex items-center justify-center py-20">
        <div className="w-full max-w-md rounded-xl border bg-card p-8 card-shadow text-center">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-success" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-foreground">Payment Successful!</h1>
          <p className="mt-2 text-muted-foreground">
            Your payment has been processed successfully. Your account has been updated.
          </p>
          {sessionId && (
            <p className="mt-2 text-xs text-muted-foreground font-mono">
              Session: {sessionId.slice(0, 20)}...
            </p>
          )}
          <div className="mt-6 flex flex-col gap-2">
            <Button asChild>
              <Link to="/dashboard/contractor/subscription">View Subscription</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
