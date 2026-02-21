import { DashboardLayout } from "@/layouts/DashboardLayout";
import { clientNavItems } from "./ClientOverview";
import { useMyTransactions, useReleaseJobPayment } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getApiError } from "@/context/AuthContext";
import { Loader2, CreditCard, CheckCircle } from "lucide-react";

export default function ClientPayments() {
  const { data: transactions, isLoading } = useMyTransactions();
  const release = useReleaseJobPayment();
  const { toast } = useToast();

  const handleRelease = async (txId: string) => {
    if (!confirm("Release this payment to the contractor? This cannot be undone.")) return;
    try {
      await release.mutateAsync(txId);
      toast({ title: "Released", description: "Payment released to contractor" });
    } catch (error) {
      toast({ title: "Error", description: getApiError(error), variant: "destructive" });
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "completed": case "released": return "default";
      case "escrow": return "secondary";
      case "pending": return "outline";
      case "failed": case "refunded": return "destructive";
      default: return "outline";
    }
  };

  return (
    <DashboardLayout title="Client Dashboard" navItems={clientNavItems}>
      <h2 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
        <CreditCard size={18} /> Payment History
      </h2>
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : !transactions || transactions.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center card-shadow">
          <p className="text-muted-foreground">No payments yet. Payments will appear here once you pay for a job.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-card card-shadow">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary">
                <th className="p-3 text-left font-medium text-muted-foreground">Date</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Type</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Listing</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Contractor</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Amount</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const listing = typeof tx.listingId === "object" ? tx.listingId : null;
                const contractor = typeof tx.contractorId === "object" ? tx.contractorId : null;
                return (
                  <tr key={tx._id} className="border-b last:border-0">
                    <td className="p-3 text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 text-foreground capitalize">{tx.type.replace(/_/g, " ")}</td>
                    <td className="p-3 text-foreground">{listing?.title || "–"}</td>
                    <td className="p-3 text-foreground">{contractor?.name || "–"}</td>
                    <td className="p-3 text-foreground font-medium">${(tx.amount / 100).toFixed(2)}</td>
                    <td className="p-3">
                      <Badge variant={statusColor(tx.status)} className="capitalize">{tx.status}</Badge>
                    </td>
                    <td className="p-3">
                      {tx.status === "escrow" && tx.type === "job_payment" && (
                        <Button size="sm" onClick={() => handleRelease(tx._id)} disabled={release.isPending}>
                          {release.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle size={14} className="mr-1" />}
                          Release
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
