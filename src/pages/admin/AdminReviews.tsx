import { useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { adminNavItems } from "./AdminOverview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppPagination } from "@/components/AppPagination";
import { RatingStars } from "@/components/RatingStars";
import { useAdminReviews, useAdminDeleteReview } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import { getApiError } from "@/context/AuthContext";
import { Loader2, Trash2 } from "lucide-react";
import type { User, Listing } from "@/lib/types";

const PAGE_SIZE = 20;

export default function AdminReviews() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminReviews({ page, limit: PAGE_SIZE });
  const deleteReview = useAdminDeleteReview();
  const { toast } = useToast();

  const reviews = data?.reviews ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review? This cannot be undone.")) return;
    try {
      await deleteReview.mutateAsync(id);
      toast({ title: "Deleted", description: "Review removed." });
    } catch (error) {
      toast({ title: "Error", description: getApiError(error), variant: "destructive" });
    }
  };

  return (
    <AdminLayout navItems={adminNavItems}>
      <h2 className="mb-4 text-lg font-semibold text-foreground">Reviews Moderation ({total})</h2>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : reviews.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center card-shadow">
          <p className="text-muted-foreground">No reviews yet.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {reviews.map((r) => {
              const reviewer = typeof r.reviewerId === "object" ? (r.reviewerId as User) : null;
              const reviewee = typeof r.revieweeId === "object" ? (r.revieweeId as User) : null;
              const listing = typeof r.listingId === "object" ? (r.listingId as Listing) : null;
              return (
                <div key={r._id} className="rounded-lg border bg-card p-4 card-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-foreground">{reviewer?.name || "Unknown"}</span>
                        <span className="text-muted-foreground text-xs">reviewed</span>
                        <span className="font-medium text-foreground">{reviewee?.name || "Unknown"}</span>
                        {reviewee?.role && (
                          <Badge variant="secondary" className="capitalize text-xs">{reviewee.role}</Badge>
                        )}
                      </div>
                      {listing && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Job: {typeof listing === "object" && "title" in listing ? listing.title : "—"}
                        </p>
                      )}
                      <div className="mt-1 flex items-center gap-2">
                        <RatingStars rating={r.rating} size={14} />
                        <span className="text-xs text-muted-foreground">
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(r._id)}
                      disabled={deleteReview.isPending}
                      title="Delete review"
                    >
                      <Trash2 size={16} className="text-destructive" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4">
            <AppPagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      )}
    </AdminLayout>
  );
}
