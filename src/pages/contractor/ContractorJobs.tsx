import { useState } from "react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppPagination } from "@/components/AppPagination";
import { contractorNavItems } from "./ContractorOverview";
import {
  useListings, useCategories, useCreateApplication, useSubscriptionStatus,
} from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import { getApiError } from "@/context/AuthContext";
import {
  Search, MapPin, Loader2, DollarSign, Clock, ChevronDown, ChevronUp, Send, AlertTriangle,
} from "lucide-react";
import type { Listing } from "@/lib/types";

const PAGE_SIZE = 8;

export default function ContractorJobs() {
  const { toast } = useToast();
  const { data: subStatus } = useSubscriptionStatus();
  const { data: categoriesData } = useCategories();
  const categories = categoriesData ?? [];
  const subActive = subStatus?.status === "active" || subStatus?.status === "trialing";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useListings({
    search: search || undefined,
    category: category || undefined,
    location: location || undefined,
    status: "open",
    page,
    limit: PAGE_SIZE,
  });

  const listings = data?.listings ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [applyForm, setApplyForm] = useState({ coverLetter: "", proposedRate: "", proposedTimeline: "" });
  const createApp = useCreateApplication();

  const handleApply = async (listingId: string) => {
    if (!subActive) {
      toast({
        title: "Subscription Required",
        description: "You need an active subscription to apply for jobs.",
        variant: "destructive",
      });
      return;
    }
    try {
      await createApp.mutateAsync({
        listingId,
        coverLetter: applyForm.coverLetter,
        proposedRate: applyForm.proposedRate ? Number(applyForm.proposedRate) : undefined,
        proposedTimeline: applyForm.proposedTimeline || undefined,
      });
      toast({ title: "Applied!", description: "Your application has been submitted." });
      setExpandedId(null);
      setApplyForm({ coverLetter: "", proposedRate: "", proposedTimeline: "" });
    } catch (error) {
      toast({ title: "Error", description: getApiError(error), variant: "destructive" });
    }
  };

  const urgencyColor: Record<string, string> = {
    low: "bg-slate-100 text-slate-700",
    medium: "bg-blue-100 text-blue-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
  };

  return (
    <DashboardLayout title="Contractor Dashboard" navItems={contractorNavItems}>
      {!subActive && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-yellow-500/30 bg-yellow-50/50 dark:bg-yellow-900/10 p-4">
          <AlertTriangle className="text-yellow-600 shrink-0" size={20} />
          <p className="text-sm text-foreground">
            <span className="font-semibold">Subscription required.</span> You must have an active subscription to apply for jobs.
          </p>
        </div>
      )}

      <h2 className="mb-4 text-lg font-semibold text-foreground">Browse Available Jobs</h2>

      {/* Search & Filters */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c.name}>{c.name}</option>
          ))}
        </select>
        <div className="relative">
          <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter by location..."
            className="pl-9"
            value={location}
            onChange={(e) => { setLocation(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : listings.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center card-shadow">
          <p className="text-lg font-medium text-muted-foreground">No open jobs found.</p>
          <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or check back later.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((listing: Listing) => {
            const isExpanded = expandedId === listing._id;
            return (
              <div key={listing._id} className="rounded-lg border bg-card card-shadow overflow-hidden">
                <div
                  className="flex items-start justify-between gap-4 p-4 cursor-pointer hover:bg-secondary/30 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : listing._id)}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground">{listing.title}</h3>
                      <Badge variant="secondary">{listing.category}</Badge>
                      {listing.urgency && (
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${urgencyColor[listing.urgency] || ""}`}>
                          {listing.urgency}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin size={14} />{listing.location}</span>
                      {listing.budget && (
                        <span className="flex items-center gap-1">
                          <DollarSign size={14} />
                          ${listing.budget.min} – ${listing.budget.max}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : ""}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{listing.description}</p>
                    {listing.skills && listing.skills.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {listing.skills.map((s) => (
                          <span key={s} className="rounded bg-accent px-2 py-0.5 text-xs text-accent-foreground">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground">{listing.applicationCount} apps</span>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t bg-secondary/20 p-4">
                    <h4 className="text-sm font-semibold text-foreground mb-3">Apply to this Job</h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Cover Letter *</Label>
                        <Textarea
                          rows={3}
                          placeholder="Why are you a good fit for this job?"
                          value={applyForm.coverLetter}
                          onChange={(e) => setApplyForm({ ...applyForm, coverLetter: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Proposed Rate ($/hr)</Label>
                          <Input
                            type="number"
                            placeholder="e.g. 50"
                            value={applyForm.proposedRate}
                            onChange={(e) => setApplyForm({ ...applyForm, proposedRate: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Timeline</Label>
                          <Input
                            placeholder="e.g. 2 weeks"
                            value={applyForm.proposedTimeline}
                            onChange={(e) => setApplyForm({ ...applyForm, proposedTimeline: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApply(listing._id)}
                          disabled={createApp.isPending || !applyForm.coverLetter.trim()}
                        >
                          {createApp.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Send size={14} className="mr-2" />
                          )}
                          Submit Application
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setExpandedId(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4">
        <AppPagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </DashboardLayout>
  );
}
