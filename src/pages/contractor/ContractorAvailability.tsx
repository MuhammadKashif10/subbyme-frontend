import { useState } from "react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { contractorNavItems } from "./ContractorOverview";
import { useMyAvailability, useAddUnavailableDates, useRemoveUnavailableDates } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getApiError } from "@/context/AuthContext";
import { Loader2, Calendar } from "lucide-react";
import { format, addDays, startOfDay, isBefore, isAfter } from "date-fns";

export default function ContractorAvailability() {
  const { data: availability, isLoading } = useMyAvailability();
  const addDates = useAddUnavailableDates();
  const removeDates = useRemoveUnavailableDates();
  const { toast } = useToast();

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const today = startOfDay(new Date());

  const unavailableDates = (availability?.unavailableDates ?? []).map((d) =>
    startOfDay(new Date(typeof d === "string" ? d : (d as Date)))
  );

  const toggleDate = (date: Date) => {
    if (isBefore(date, today)) return;
    const d = startOfDay(date);
    const isUnavail = unavailableDates.some(
      (u) => u.getTime() === d.getTime()
    );
    const isSelected = selectedDates.some(
      (s) => s.getTime() === d.getTime()
    );

    if (isSelected) {
      setSelectedDates(selectedDates.filter((s) => s.getTime() !== d.getTime()));
    } else if (isUnavail) {
      removeDates.mutate([format(d, "yyyy-MM-dd")], {
        onSuccess: () => toast({ title: "Date removed" }),
        onError: (e) => toast({ title: "Error", description: getApiError(e), variant: "destructive" }),
      });
    } else {
      setSelectedDates([...selectedDates, d].sort((a, b) => a.getTime() - b.getTime()));
    }
  };

  const handleAddSelected = async () => {
    if (selectedDates.length === 0) return;
    const dates = selectedDates.map((d) => format(d, "yyyy-MM-dd"));
    try {
      await addDates.mutateAsync(dates);
      toast({ title: "Dates marked unavailable" });
      setSelectedDates([]);
    } catch (error) {
      toast({ title: "Error", description: getApiError(error), variant: "destructive" });
    }
  };

  const handleRemoveSelected = async () => {
    if (selectedDates.length === 0) return;
    const dates = selectedDates.map((d) => format(d, "yyyy-MM-dd"));
    try {
      await removeDates.mutateAsync(dates);
      toast({ title: "Dates removed" });
      setSelectedDates([]);
    } catch (error) {
      toast({ title: "Error", description: getApiError(error), variant: "destructive" });
    }
  };

  const renderCalendar = () => {
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      days.push(addDays(today, i - 7));
    }
    return (
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-1 text-center text-xs font-medium text-muted-foreground">
            {d}
          </div>
        ))}
        {days.map((date) => {
          const isPast = isBefore(date, today);
          const isUnavail = unavailableDates.some(
            (u) => u.getTime() === date.getTime()
          );
          const isSel = selectedDates.some(
            (s) => s.getTime() === date.getTime()
          );
          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => toggleDate(date)}
              disabled={isPast}
              className={`rounded p-2 text-sm transition-colors ${
                isPast
                  ? "cursor-not-allowed bg-muted/30 text-muted-foreground"
                  : isUnavail
                    ? "bg-destructive/20 text-destructive hover:bg-destructive/30"
                    : isSel
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "hover:bg-muted"
              }`}
            >
              {format(date, "d")}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <DashboardLayout title="Availability Calendar" navItems={contractorNavItems}>
      <div className="rounded-lg border bg-card p-6 card-shadow">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Calendar size={20} />
          Mark Unavailable Dates
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Click a future date to mark it as unavailable. Clients will not be able to book you for these dates.
        </p>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="mb-4 max-w-md">{renderCalendar()}</div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground">
                Gray = past (cannot select) • Red = unavailable • Blue = selected
              </span>
            </div>
            {selectedDates.length > 0 && (
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAddSelected}
                  disabled={addDates.isPending}
                >
                  {addDates.isPending ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
                  Mark {selectedDates.length} date(s) unavailable
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedDates([])}
                >
                  Clear selection
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
