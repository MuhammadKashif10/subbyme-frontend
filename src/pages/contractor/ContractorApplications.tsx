import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMyApplications, useDeleteApplication } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import { getApiError } from "@/context/AuthContext";
import { contractorNavItems } from "./ContractorOverview";
import { Trash2, Loader2, MapPin, DollarSign, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { Listing, User } from "@/lib/types";
import { useState } from "react";

type StatusFilter = "all" | "pending" | "accepted" | "rejected" | "withdrawn";

export default function ContractorApplications() {
  const { data: applications, isLoading } = useMyApplications();
  const deleteApp = useDeleteApplication();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = statusFilter === "all"
    ? applications
    : applications?.filter((a) => a.status === statusFilter);

  const handleWithdraw = async (id: string) => {
    try {
      await deleteApp.mutateAsync(id);
      toast({ title: "Withdrawn", description: "Application has been withdrawn." });
    } catch (error) {
      toast({ title: "Error", description: getApiError(error), variant: "destructive" });
    }
  };

  const statusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      accepted: "default",
      rejected: "destructive",
      pending: "outline",
      withdrawn: "secondary",
    };
    return <Badge variant={variants[status] || "outline"} className="capitalize">{status}</Badge>;
  };

  const counts = {
    all: applications?.length ?? 0,
    pending: applications?.filter((a) => a.status === "pending").length ?? 0,
    accepted: applications?.filter((a) => a.status === "accepted").length ?? 0,
    rejected: applications?.filter((a) => a.status === "rejected").length ?? 0,
    withdrawn: applications?.filter((a) => a.status === "withdrawn").length ?? 0,
  };

  return (
    <DashboardLayout title="Contractor Dashboard" navItems={contractorNavItems}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold text-foreground">My Applications</h2>
        <Link to="/dashboard/contractor/jobs">
          <Button size="sm" variant="outline">
            <ExternalLink size={14} className="mr-1" /> Browse Jobs
          </Button>
        </Link>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["all", "pending", "accepted", "rejected", "withdrawn"] as StatusFilter[]).map((s) => (
          <Button
            key={s}
            size="sm"
            variant={statusFilter === s ? "default" : "outline"}
            onClick={() => setStatusFilter(s)}
            className="capitalize"
          >
            {s} ({counts[s]})
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !filtered || filtered.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center card-shadow">
          <p className="text-muted-foreground">
            {statusFilter === "all"
              ? "No applications yet. Browse jobs and start applying!"
              : `No ${statusFilter} applications.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const listing = typeof app.listingId === "object" ? (app.listingId as Listing) : null;
            const client = listing && typeof listing.clientId === "object" ? (listing.clientId as User) : null;
            return (
              <div key={app._id} className="rounded-lg border bg-card p-4 card-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground">{listing?.title || "Listing"}</h3>
                      {listing?.category && <Badge variant="secondary">{listing.category}</Badge>}
                      {statusBadge(app.status)}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      {listing?.location && (
                        <span className="flex items-center gap-1"><MapPin size={14} />{listing.location}</span>
                      )}
                      {listing?.budget && (
                        <span className="flex items-center gap-1">
                          <DollarSign size={14} />${listing.budget.min} – ${listing.budget.max}
                        </span>
                      )}
                      {client?.name && <span>Client: {client.name}</span>}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      {app.proposedRate && <span>Your rate: ${app.proposedRate}/hr</span>}
                      {app.proposedTimeline && <span>Timeline: {app.proposedTimeline}</span>}
                      <span>Applied: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "N/A"}</span>
                    </div>
                    {app.coverLetter && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{app.coverLetter}</p>
                    )}
                  </div>
                  {app.status === "pending" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleWithdraw(app._id)}
                      disabled={deleteApp.isPending}
                      title="Withdraw application"
                    >
                      <Trash2 size={16} className="text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
