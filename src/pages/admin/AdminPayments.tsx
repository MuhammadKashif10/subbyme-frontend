import { useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { adminNavItems } from "./AdminOverview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppPagination } from "@/components/AppPagination";
import { useAdminTransactions, useAdminStats } from "@/hooks/use-api";
import { StatsCard } from "@/components/StatsCard";
import { Loader2, DollarSign, CreditCard, TrendingUp } from "lucide-react";

const PAGE_SIZE = 20;
type TypeFilter = "" | "subscription" | "qualification_upgrade" | "job_payment";

export default function AdminPayments() {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminTransactions({
    type: typeFilter || undefined,
    page,
    limit: PAGE_SIZE,
  });
  const { data: stats } = useAdminStats();

  const transactions = data?.transactions ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const statusBadge: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
    completed: "default",
    released: "default",
    escrow: "secondary",
    pending: "outline",
    failed: "destructive",
    refunded: "destructive",
  };

  return (
    <AdminLayout navItems={adminNavItems}>
      <h2 className="mb-4 text-lg font-semibold text-foreground">Payment & Transaction Management</h2>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <StatsCard
          title="Total Revenue"
          value={`$${((stats?.revenue.total ?? 0) / 100).toFixed(2)}`}
          icon={DollarSign}
        />
        <StatsCard
          title="Transactions"
          value={stats?.revenue.transactionCount ?? 0}
          icon={TrendingUp}
        />
        <StatsCard
          title="Active Subscriptions"
          value={stats?.subscriptions.total ?? 0}
          icon={CreditCard}
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {([
          { label: "All", value: "" },
          { label: "Subscriptions", value: "subscription" },
          { label: "Qualification", value: "qualification_upgrade" },
          { label: "Job Payments", value: "job_payment" },
        ] as { label: string; value: TypeFilter }[]).map((tab) => (
          <Button
            key={tab.value}
            size="sm"
            variant={typeFilter === tab.value ? "default" : "outline"}
            onClick={() => { setTypeFilter(tab.value); setPage(1); }}
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
                  <th className="p-3 text-left font-medium text-muted-foreground">Date</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Type</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">User</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Job</th>
                  <th className="p-3 text-right font-medium text-muted-foreground">Amount</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const user = typeof tx.userId === "object" && tx.userId
                    ? (tx.userId as unknown as { _id: string; name: string; email: string })
                    : null;
                  const listing = typeof tx.listingId === "object" && tx.listingId
                    ? (tx.listingId as { _id: string; title: string })
                    : null;
                  return (
                    <tr key={tx._id} className="border-b last:border-0 hover:bg-secondary/50">
                      <td className="p-3 text-muted-foreground text-xs">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <Badge variant="secondary" className="capitalize text-xs">
                          {tx.type.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div>
                          <span className="text-foreground text-xs">{user?.name || "—"}</span>
                          {user?.email && (
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground text-xs">{listing?.title || "—"}</td>
                      <td className="p-3 text-right font-medium text-foreground">
                        ${(tx.amount / 100).toFixed(2)}
                      </td>
                      <td className="p-3">
                        <Badge variant={statusBadge[tx.status] || "outline"} className="capitalize">
                          {tx.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
                {transactions.length === 0 && (
                  <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No transactions found.</td></tr>
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
