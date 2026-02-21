import { useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { adminNavItems } from "./AdminOverview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppPagination } from "@/components/AppPagination";
import { useAdminApplications } from "@/hooks/use-api";
import { Loader2 } from "lucide-react";
import type { Listing, User } from "@/lib/types";

const PAGE_SIZE = 20;
type StatusFilter = "" | "pending" | "accepted" | "rejected" | "withdrawn";

export default function AdminApplications() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminApplications({
    status: statusFilter || undefined,
    page,
    limit: PAGE_SIZE,
  });

  const applications = data?.applications ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const statusBadge: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
    accepted: "default",
    rejected: "destructive",
    pending: "outline",
    withdrawn: "secondary",
  };

  return (
    <AdminLayout navItems={adminNavItems}>
      <h2 className="mb-4 text-lg font-semibold text-foreground">Application Monitoring ({total})</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {([
          { label: "All", value: "" },
          { label: "Pending", value: "pending" },
          { label: "Accepted", value: "accepted" },
          { label: "Rejected", value: "rejected" },
          { label: "Withdrawn", value: "withdrawn" },
        ] as { label: string; value: StatusFilter }[]).map((tab) => (
          <Button
            key={tab.value}
            size="sm"
            variant={statusFilter === tab.value ? "default" : "outline"}
            onClick={() => { setStatusFilter(tab.value); setPage(1); }}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border bg-card card-shadow">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-secondary">
                  <th className="p-3 text-left font-medium text-muted-foreground">Job</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Contractor</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Rate</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Timeline</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Applied</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => {
                  const listing = typeof app.listingId === "object" ? (app.listingId as Listing) : null;
                  const contractor = typeof app.contractorId === "object" ? (app.contractorId as User) : null;
                  return (
                    <tr key={app._id} className="border-b last:border-0 hover:bg-secondary/50">
                      <td className="p-3">
                        <div>
                          <span className="font-medium text-foreground">{listing?.title || "—"}</span>
                          {listing?.category && (
                            <span className="ml-2 text-xs text-muted-foreground">({listing.category})</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground">{contractor?.name || "—"}</span>
                          {contractor?.isVerified && (
                            <Badge variant="secondary" className="text-xs">Verified</Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {app.proposedRate ? `$${app.proposedRate}/hr` : "—"}
                      </td>
                      <td className="p-3 text-muted-foreground text-xs">{app.proposedTimeline || "—"}</td>
                      <td className="p-3">
                        <Badge variant={statusBadge[app.status] || "outline"} className="capitalize">
                          {app.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-muted-foreground text-xs">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : ""}
                      </td>
                    </tr>
                  );
                })}
                {applications.length === 0 && (
                  <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No applications found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <AppPagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      )}
    </AdminLayout>
  );
}
