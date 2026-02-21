import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ContractorCard } from "@/components/ContractorCard";
import { useSavedContractors, useUnsaveContractor } from "@/hooks/use-api";
import { clientNavItems } from "./ClientOverview";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getApiError } from "@/context/AuthContext";
import { Loader2, HeartOff } from "lucide-react";

export default function ClientSaved() {
  const { data: contractors, isLoading } = useSavedContractors();
  const unsave = useUnsaveContractor();
  const { toast } = useToast();

  const handleUnsave = async (id: string) => {
    try {
      await unsave.mutateAsync(id);
      toast({ title: "Removed", description: "Contractor removed from saved list" });
    } catch (error) {
      toast({ title: "Error", description: getApiError(error), variant: "destructive" });
    }
  };

  return (
    <DashboardLayout title="Client Dashboard" navItems={clientNavItems}>
      <h2 className="mb-4 text-lg font-semibold text-foreground">Saved Contractors</h2>
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : !contractors || contractors.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center card-shadow">
          <p className="text-muted-foreground">No saved contractors yet. Browse contractors and save the ones you like!</p>
          <Button asChild variant="outline" className="mt-4">
            <a href="/contractors">Browse Contractors</a>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {contractors.map((c) => (
            <div key={c._id} className="relative">
              <ContractorCard contractor={c} />
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-3 right-3"
                onClick={() => handleUnsave(c._id)}
                disabled={unsave.isPending}
              >
                <HeartOff size={14} className="mr-1" /> Unsave
              </Button>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
