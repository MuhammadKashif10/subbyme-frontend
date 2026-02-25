import { useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { adminNavItems } from "./AdminOverview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { AppPagination } from "@/components/AppPagination";
import {
  useAdminPromoCodes,
  useCreatePromoCode,
  useUpdatePromoCode,
  useDeletePromoCode,
} from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import { getApiError } from "@/context/AuthContext";
import { Loader2, Trash2, Plus, Pencil } from "lucide-react";
import type { PromoCode, CreatePromoCodeData } from "@/services/admin.service";

const PAGE_SIZE = 15;

const emptyForm: CreatePromoCodeData = {
  code: "",
  discountType: "percentage",
  discountValue: 10,
  expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  usageLimit: null,
  isActive: true,
};

export default function AdminPromoCodes() {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PromoCode | null>(null);
  const [form, setForm] = useState<CreatePromoCodeData>(emptyForm);

  const { data, isLoading } = useAdminPromoCodes(page, PAGE_SIZE);
  const createPromo = useCreatePromoCode();
  const updatePromo = useUpdatePromoCode();
  const deletePromo = useDeletePromoCode();
  const { toast } = useToast();

  const promoCodes = data?.promoCodes ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const resetForm = () => {
    setForm(emptyForm);
    setEditing(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpen(true);
  };

  const handleOpenEdit = (p: PromoCode) => {
    setEditing(p);
    setForm({
      code: p.code,
      discountType: p.discountType,
      discountValue: p.discountValue,
      expiryDate: p.expiryDate.slice(0, 10),
      usageLimit: p.usageLimit,
      isActive: p.isActive,
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await updatePromo.mutateAsync({
          id: editing._id,
          data: { ...form, code: undefined },
        });
        toast({ title: "Updated", description: "Promo code updated." });
      } else {
        await createPromo.mutateAsync(form);
        toast({ title: "Created", description: "Promo code created." });
      }
      setOpen(false);
      resetForm();
    } catch (error) {
      toast({ title: "Error", description: getApiError(error), variant: "destructive" });
    }
  };

  const handleDelete = async (p: PromoCode) => {
    if (!confirm(`Delete promo code "${p.code}"?`)) return;
    try {
      await deletePromo.mutateAsync(p._id);
      toast({ title: "Deleted", description: "Promo code removed." });
    } catch (error) {
      toast({ title: "Error", description: getApiError(error), variant: "destructive" });
    }
  };

  const handleToggleActive = async (p: PromoCode) => {
    try {
      await updatePromo.mutateAsync({
        id: p._id,
        data: { isActive: !p.isActive },
      });
      toast({ title: p.isActive ? "Deactivated" : "Activated", description: `Promo code ${p.isActive ? "disabled" : "enabled"}.` });
    } catch (error) {
      toast({ title: "Error", description: getApiError(error), variant: "destructive" });
    }
  };

  const isExpired = (date: string) => new Date(date) < new Date();

  return (
    <AdminLayout navItems={adminNavItems}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Promo Codes ({total})</h2>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenCreate}>
              <Plus size={16} className="mr-2" /> Create Promo Code
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Promo Code" : "Create Promo Code"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Code</Label>
                <Input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="SUBBY10"
                  disabled={!!editing}
                  className="uppercase"
                />
              </div>
              <div>
                <Label>Discount Type</Label>
                <select
                  value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value as "percentage" | "free_time" })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="percentage">Percentage (% off)</option>
                  <option value="free_time">Free time (weeks)</option>
                </select>
              </div>
              <div>
                <Label>{form.discountType === "percentage" ? "Discount %" : "Free Weeks"}</Label>
                <Input
                  type="number"
                  min={1}
                  max={form.discountType === "percentage" ? 100 : 52}
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Expiry Date</Label>
                <Input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Usage Limit (optional)</Label>
                <Input
                  type="number"
                  min={1}
                  placeholder="Unlimited"
                  value={form.usageLimit ?? ""}
                  onChange={(e) => setForm({ ...form, usageLimit: e.target.value ? Number(e.target.value) : null })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                />
                <Label>Active</Label>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createPromo.isPending || updatePromo.isPending}>
                  {(createPromo.isPending || updatePromo.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editing ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border bg-card card-shadow">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-secondary">
                  <th className="p-3 text-left font-medium text-muted-foreground">Code</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Type</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Value</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Expiry</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Usage</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {promoCodes.map((p) => (
                  <tr key={p._id} className="border-b last:border-0 hover:bg-secondary/50">
                    <td className="p-3 font-mono font-medium text-foreground">{p.code}</td>
                    <td className="p-3 text-muted-foreground capitalize">{p.discountType.replace("_", " ")}</td>
                    <td className="p-3 text-muted-foreground">
                      {p.discountType === "percentage" ? `${p.discountValue}%` : `${p.discountValue} weeks`}
                    </td>
                    <td className="p-3 text-muted-foreground text-xs">
                      {new Date(p.expiryDate).toLocaleDateString()}
                      {isExpired(p.expiryDate) && <span className="ml-1 text-destructive">(expired)</span>}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {p.usedCount} / {p.usageLimit ?? "∞"}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={p.isActive}
                          onCheckedChange={() => handleToggleActive(p)}
                          disabled={updatePromo.isPending}
                        />
                        <Badge variant={p.isActive ? "default" : "secondary"}>
                          {p.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleOpenEdit(p)}>
                          <Pencil size={14} />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(p)}>
                          <Trash2 size={14} className="text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {promoCodes.length === 0 && (
                  <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">No promo codes yet.</td></tr>
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
