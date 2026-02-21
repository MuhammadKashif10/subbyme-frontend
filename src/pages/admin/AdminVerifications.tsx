import { AdminLayout } from "@/layouts/AdminLayout";
import { adminNavItems } from "./AdminOverview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdminUsers, useSetUserVerified } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import { getApiError } from "@/context/AuthContext";
import { Loader2, ShieldCheck, ShieldX } from "lucide-react";
import { useState } from "react";

type VerifyFilter = "all" | "unverified" | "verified";

export default function AdminVerifications() {
  const { data, isLoading } = useAdminUsers({ role: "contractor", limit: 100 });
  const setVerified = useSetUserVerified();
  const { toast } = useToast();
  const [filter, setFilter] = useState<VerifyFilter>("all");

  const allContractors = data?.users ?? [];
  const contractors = filter === "all"
    ? allContractors
    : filter === "verified"
      ? allContractors.filter((c) => c.isVerified)
      : allContractors.filter((c) => !c.isVerified);

  const unverifiedCount = allContractors.filter((c) => !c.isVerified).length;
  const verifiedCount = allContractors.filter((c) => c.isVerified).length;

  const handleToggleVerify = async (id: string, currentlyVerified: boolean) => {
    try {
      await setVerified.mutateAsync({ id, isVerified: !currentlyVerified });
      toast({
        title: currentlyVerified ? "Revoked" : "Verified",
        description: currentlyVerified
          ? "Contractor verification revoked"
          : "Contractor verified successfully",
      });
    } catch (error) {
      toast({ title: "Error", description: getApiError(error), variant: "destructive" });
    }
  };

  return (
    <AdminLayout navItems={adminNavItems}>
      <h2 className="mb-4 text-lg font-semibold text-foreground">Contractor Verifications</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
          All ({allContractors.length})
        </Button>
        <Button size="sm" variant={filter === "unverified" ? "default" : "outline"} onClick={() => setFilter("unverified")}>
          Unverified ({unverifiedCount})
        </Button>
        <Button size="sm" variant={filter === "verified" ? "default" : "outline"} onClick={() => setFilter("verified")}>
          Verified ({verifiedCount})
        </Button>
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
                <th className="p-3 text-left font-medium text-muted-foreground">Location</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Rating</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Subscription</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contractors.map((c) => (
                <tr key={c._id} className="border-b last:border-0">
                  <td className="p-3 font-medium text-foreground">{c.name}</td>
                  <td className="p-3 text-muted-foreground text-xs">{c.email}</td>
                  <td className="p-3 text-muted-foreground">{c.trade || "Not set"}</td>
                  <td className="p-3 text-muted-foreground">{c.location || "Not set"}</td>
                  <td className="p-3 text-muted-foreground">
                    {c.averageRating > 0 ? `${c.averageRating.toFixed(1)} (${c.reviewCount})` : "—"}
                  </td>
                  <td className="p-3">
                    {c.subscriptionPlan ? (
                      <Badge variant="secondary" className="capitalize">{c.subscriptionPlan}</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">None</span>
                    )}
                  </td>
                  <td className="p-3">
                    <Badge variant={c.isVerified ? "default" : "outline"}>
                      {c.isVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Button
                      size="sm"
                      variant={c.isVerified ? "outline" : "default"}
                      onClick={() => handleToggleVerify(c._id, c.isVerified)}
                      disabled={setVerified.isPending}
                    >
                      {c.isVerified ? (
                        <><ShieldX size={14} className="mr-1" /> Revoke</>
                      ) : (
                        <><ShieldCheck size={14} className="mr-1" /> Verify</>
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
              {contractors.length === 0 && (
                <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">No contractors found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
