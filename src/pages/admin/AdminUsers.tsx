import { useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { adminNavItems } from "./AdminOverview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppPagination } from "@/components/AppPagination";
import { useAdminUsers, useSetUserStatus, useAdminDeleteUser, useAdminRemoveProfileImage } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import { getApiError } from "@/context/AuthContext";
import { Loader2, Trash2, ShieldCheck, ImageOff } from "lucide-react";

const PAGE_SIZE = 15;
type RoleFilter = "" | "client" | "contractor" | "admin";

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminUsers({
    search: search || undefined,
    role: roleFilter || undefined,
    page,
    limit: PAGE_SIZE,
  });
  const setStatus = useSetUserStatus();
  const deleteUser = useAdminDeleteUser();
  const removeImage = useAdminRemoveProfileImage();
  const { toast } = useToast();

  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleToggleStatus = async (id: string, currentlyActive: boolean) => {
    try {
      await setStatus.mutateAsync({ id, isActive: !currentlyActive });
      toast({ title: "Updated", description: `User ${currentlyActive ? "suspended" : "activated"}` });
    } catch (error) {
      toast({ title: "Error", description: getApiError(error), variant: "destructive" });
    }
  };

  const handleRemoveImage = async (id: string) => {
    try {
      await removeImage.mutateAsync(id);
      toast({ title: "Removed", description: "Profile image removed." });
    } catch (error) {
      toast({ title: "Error", description: getApiError(error), variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await deleteUser.mutateAsync(id);
      toast({ title: "Deleted", description: "User removed" });
    } catch (error) {
      toast({ title: "Error", description: getApiError(error), variant: "destructive" });
    }
  };

  return (
    <AdminLayout navItems={adminNavItems}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold text-foreground">Users Management ({total})</h2>
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="max-w-xs"
        />
      </div>

      {/* Role Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {([
          { label: "All", value: "" },
          { label: "Clients", value: "client" },
          { label: "Contractors", value: "contractor" },
          { label: "Admins", value: "admin" },
        ] as { label: string; value: RoleFilter }[]).map((tab) => (
          <Button
            key={tab.value}
            size="sm"
            variant={roleFilter === tab.value ? "default" : "outline"}
            onClick={() => { setRoleFilter(tab.value); setPage(1); }}
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
                  <th className="p-3 text-left font-medium text-muted-foreground">Name</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Email</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Role</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Verified</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Subscription</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Joined</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const avatarUrl = u.profileImage?.url || u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`;
                  return (
                  <tr key={u._id} className="border-b last:border-0 hover:bg-secondary/50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <img src={avatarUrl} alt="" className="h-8 w-8 rounded-full bg-secondary object-cover shrink-0" />
                        <span className="font-medium text-foreground">{u.name}</span>
                        {u.isVerified && <ShieldCheck size={14} className="text-primary" />}
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{u.email}</td>
                    <td className="p-3"><Badge variant="secondary" className="capitalize">{u.role}</Badge></td>
                    <td className="p-3">
                      <Badge variant={u.isActive ? "default" : "destructive"}>
                        {u.isActive ? "Active" : "Suspended"}
                      </Badge>
                    </td>
                    <td className="p-3">
                      {u.role === "contractor" && (
                        <Badge variant={u.isVerified ? "default" : "outline"}>
                          {u.isVerified ? "Yes" : "No"}
                        </Badge>
                      )}
                    </td>
                    <td className="p-3">
                      {u.role === "contractor" && u.subscriptionPlan ? (
                        <Badge variant="secondary" className="capitalize">{u.subscriptionPlan}</Badge>
                      ) : u.role === "contractor" ? (
                        <span className="text-xs text-muted-foreground">None</span>
                      ) : null}
                    </td>
                    <td className="p-3 text-muted-foreground text-xs">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ""}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => handleToggleStatus(u._id, u.isActive)}>
                          {u.isActive ? "Suspend" : "Activate"}
                        </Button>
                        {u.profileImage?.url && (
                          <Button size="sm" variant="ghost" onClick={() => handleRemoveImage(u._id)} title="Remove profile image">
                            <ImageOff size={14} className="text-orange-500" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(u._id, u.name)}>
                          <Trash2 size={14} className="text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
                {users.length === 0 && (
                  <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">No users found.</td></tr>
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
