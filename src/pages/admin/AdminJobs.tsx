import { useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { adminNavItems } from "./AdminOverview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppPagination } from "@/components/AppPagination";
import { useAdminListings, useUpdateListing, useDeleteListing } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import { getApiError } from "@/context/AuthContext";
import { Loader2, Trash2, XCircle } from "lucide-react";
import type { User } from "@/lib/types";

const PAGE_SIZE = 15;
type StatusFilter = "" | "open" | "in_progress" | "completed" | "cancelled";

export default function AdminJobs() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminListings({
    status: statusFilter || undefined,
    page,
    limit: PAGE_SIZE,
  });
  const updateListing = useUpdateListing();
  const deleteListing = useDeleteListing();
  const { toast } = useToast();

  const listings = data?.listings ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleForceClose = async (id: string) => {
    try {
      await updateListing.mutateAsync({ id, data: { status: "cancelled" } });
      toast({ title: "Closed", description: "Job has been force-closed." });
    } catch (error) {
      toast({ title: "Error", description: getApiError(error), variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete job "${title}"? This cannot be undone.`)) return;
    try {
      await deleteListing.mutateAsync(id);
      toast({ title: "Deleted", description: "Job removed." });
    } catch (error) {
      toast({ title: "Error", description: getApiError(error), variant: "destructive" });
    }
  };

  const statusColor: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
    open: "default",
    in_progress: "secondary",
    completed: "default",
    cancelled: "destructive",
  };

  return (
    <AdminLayout navItems={adminNavItems}>
      <h2 className="mb-4 text-lg font-semibold text-foreground">Job Management ({total})</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {([
          { label: "All", value: "" },
          { label: "Open", value: "open" },
          { label: "In Progress", value: "in_progress" },
          { label: "Completed", value: "completed" },
          { label: "Cancelled", value: "cancelled" },
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
                  <th className="p-3 text-left font-medium text-muted-foreground">Title</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Client</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Category</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Location</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Budget</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Apps</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Created</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((l) => {
                  const client = typeof l.clientId === "object" ? (l.clientId as User) : null;
                  return (
                    <tr key={l._id} className="border-b last:border-0 hover:bg-secondary/50">
                      <td className="p-3 font-medium text-foreground max-w-[200px] truncate">{l.title}</td>
                      <td className="p-3 text-muted-foreground text-xs">{client?.name || "—"}</td>
                      <td className="p-3 text-muted-foreground">{l.category}</td>
                      <td className="p-3 text-muted-foreground text-xs">{l.location}</td>
                      <td className="p-3 text-muted-foreground text-xs">
                        {l.budget ? `$${l.budget.min}–$${l.budget.max}` : "—"}
                      </td>
                      <td className="p-3">
                        <Badge variant={statusColor[l.status] || "outline"} className="capitalize">
                          {l.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">{l.applicationCount}</td>
                      <td className="p-3 text-muted-foreground text-xs">
                        {l.createdAt ? new Date(l.createdAt).toLocaleDateString() : ""}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          {l.status !== "cancelled" && l.status !== "completed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleForceClose(l._id)}
                              disabled={updateListing.isPending}
                              title="Force close"
                            >
                              <XCircle size={14} />
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(l._id, l.title)}>
                            <Trash2 size={14} className="text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {listings.length === 0 && (
                  <tr><td colSpan={9} className="p-6 text-center text-muted-foreground">No jobs found.</td></tr>
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
