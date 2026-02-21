import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      <div className="container-main flex items-center justify-center py-20">
        <div className="w-full max-w-md rounded-xl border bg-card p-8 card-shadow text-center">
          <div className="flex justify-center">
            <XCircle className="h-16 w-16 text-destructive" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-foreground">Payment Cancelled</h1>
          <p className="mt-2 text-muted-foreground">
            Your payment was cancelled. No charges were made. You can try again anytime.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button asChild>
              <Link to="/dashboard/contractor/subscription">Try Again</Link>
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
