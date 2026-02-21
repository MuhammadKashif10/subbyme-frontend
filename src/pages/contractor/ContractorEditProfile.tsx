import { useState } from "react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { contractorNavItems } from "./ContractorOverview";
import { useAuth, getApiError } from "@/context/AuthContext";
import { useUpdateProfile, useToggleAvailability } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { ProfileImageUpload } from "@/components/ProfileImageUpload";

export default function ContractorEditProfile() {
  const { user, refreshUser } = useAuth();
  const updateProfile = useUpdateProfile();
  const toggleAvailability = useToggleAvailability();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: user?.name || "",
    trade: user?.trade || "",
    location: user?.location || "",
    hourlyRate: user?.hourlyRate?.toString() || "",
    bio: user?.bio || "",
    skills: user?.skills?.join(", ") || "",
    phone: user?.phone || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = user?._id || user?.id;
    if (!userId) return;
    try {
      await updateProfile.mutateAsync({
        id: userId,
        data: {
          name: form.name,
          trade: form.trade,
          location: form.location,
          hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : undefined,
          bio: form.bio,
          skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
          phone: form.phone,
        },
      });
      await refreshUser();
      toast({ title: "Saved", description: "Profile updated successfully" });
    } catch (error) {
      toast({ title: "Error", description: getApiError(error), variant: "destructive" });
    }
  };

  const handleToggleAvailability = async () => {
    try {
      await toggleAvailability.mutateAsync();
      await refreshUser();
      toast({
        title: user?.isActive ? "Set to Unavailable" : "Set to Available",
        description: user?.isActive
          ? "You won't appear in search results"
          : "You're now visible to clients",
      });
    } catch (error) {
      toast({ title: "Error", description: getApiError(error), variant: "destructive" });
    }
  };

  return (
    <DashboardLayout title="Contractor Dashboard" navItems={contractorNavItems}>
      <div className="max-w-2xl space-y-6">
        {/* Availability Toggle */}
        <div className="rounded-lg border bg-card p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Availability Status</h3>
              <p className="text-sm text-muted-foreground">
                {user?.isActive ? "You're available for work and visible in search." : "You're currently unavailable."}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${user?.isActive ? "text-success" : "text-destructive"}`}>
                {user?.isActive ? "Available" : "Unavailable"}
              </span>
              <Switch
                checked={user?.isActive ?? false}
                onCheckedChange={handleToggleAvailability}
                disabled={toggleAvailability.isPending}
              />
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 card-shadow">
          <h2 className="text-lg font-semibold text-foreground">Edit Profile</h2>

          <div className="mt-4">
            <ProfileImageUpload />
          </div>

          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Trade / Specialty</Label>
                <Input value={form.trade} onChange={(e) => setForm({ ...form, trade: e.target.value })} placeholder="e.g. Electrician" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Sydney, NSW" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Hourly Rate ($)</Label>
                <Input type="number" value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Describe your experience and services..." />
            </div>
            <div className="space-y-2">
              <Label>Skills (comma-separated)</Label>
              <Input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="e.g. Wiring, Lighting, Solar" />
            </div>
            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
