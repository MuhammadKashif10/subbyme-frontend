import { AdminLayout } from "@/layouts/AdminLayout";
import { adminNavItems } from "./AdminOverview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdminUsers, useSetSubscription } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import { getApiError } from "@/context/AuthContext";
import { Loader2, CreditCard } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { useState } from "react";

type SubFilter = "all" | "active" | "none" | "expired";

export default function AdminSubscriptions() {
  const { data, isLoading } = useAdminUsers({ role: "contractor", limit: 100 });
  const setSub = useSetSubscription();
  const { toast } = useToast();
  const [filter, setFilter] = useState<SubFilter>("all");

  const allContractors = data?.users ?? [];

  const activeSubs = allContractors.filter((c) => c.subscriptionStatus === "active" || c.subscriptionStatus === "trialing");
  const noSubs = allContractors.filter((c) => !c.subscriptionStatus || c.subscriptionStatus === "cancelled");
  const expiredSubs = allContractors.filter((c) => c.subscriptionStatus === "past_due");

  const filtered = filter === "all" ? allContractors
    : filter === "active" ? activeSubs
    : filter === "none" ? noSubs
    : expiredSubs;

  const handleDeactivate = async (id: string) => {
    try {
      await setSub.mutateAsync({ id, status: "cancelled", plan: null });
      toast({ title: "Deactivated", description: "Subscription cancelled for this contractor." });
    } catch (error) {
      toast({ title: "Error", description: getApiError(error), variant: "destructive" });
    }
  };

  const handleActivate = async (id: string, plan: "standard" | "premium") => {
    try {
      await setSub.mutateAsync({ id, status: "active", plan });
      toast({ title: "Activated", description: `${plan} subscription activated.` });
    } catch (error) {
      toast({ title: "Error", description: getApiError(error), variant: "destructive" });
    }
  };

  return (
    <AdminLayout navItems={adminNavItems}>
      <h2 className="mb-4 text-lg font-semibold text-foreground">Subscription Management</h2>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <StatsCard title="Active Subscriptions" value={activeSubs.length} icon={CreditCard} />
        <StatsCard title="No Subscription" value={noSubs.length} icon={CreditCard} />
        <StatsCard title="Expired / Past Due" value={expiredSubs.length} icon={CreditCard} />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {([
          { label: `All (${allContractors.length})`, value: "all" },
          { label: `Active (${activeSubs.length})`, value: "active" },
          { label: `None (${noSubs.length})`, value: "none" },
          { label: `Expired (${expiredSubs.length})`, value: "expired" },
        ] as { label: string; value: SubFilter }[]).map((tab) => (
          <Button
            key={tab.value}
            size="sm"
            variant={filter === tab.value ? "default" : "outline"}
            onClick={() => setFilter(tab.value)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-card card-shadow">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary">
                <th className="p-3 text-left font-medium text-muted-foreground">Contractor</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Email</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Trade</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Plan</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Expires</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Verified</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c._id} className="border-b last:border-0">
                  <td className="p-3 font-medium text-foreground">{c.name}</td>
                  <td className="p-3 text-muted-foreground text-xs">{c.email}</td>
                  <td className="p-3 text-muted-foreground">{c.trade || "—"}</td>
                  <td className="p-3">
                    {c.subscriptionPlan ? (
                      <Badge variant="secondary" className="capitalize">{c.subscriptionPlan}</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">None</span>
                    )}
                  </td>
                  <td className="p-3">
                    <Badge variant={
                      c.subscriptionStatus === "active" || c.subscriptionStatus === "trialing" ? "default" :
                      c.subscriptionStatus === "past_due" ? "destructive" : "outline"
                    } className="capitalize">
                      {c.subscriptionStatus || "None"}
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground text-xs">
                    {c.subscriptionExpiresAt
                      ? new Date(c.subscriptionExpiresAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="p-3">
                    <Badge variant={c.isVerified ? "default" : "outline"}>
                      {c.isVerified ? "Yes" : "No"}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      {(c.subscriptionStatus === "active" || c.subscriptionStatus === "trialing") ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeactivate(c._id)}
                          disabled={setSub.isPending}
                        >
                          Deactivate
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleActivate(c._id, "standard")}
                            disabled={setSub.isPending}
                          >
                            Activate Std
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleActivate(c._id, "premium")}
                            disabled={setSub.isPending}
                          >
                            Activate Pro
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">No contractors found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
