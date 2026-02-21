import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  positive?: boolean;
}

export function StatsCard({ title, value, change, icon: Icon, positive }: StatsCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6 card-shadow">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <Icon size={20} className="text-muted-foreground" />
      </div>
      <p className="mt-2 text-3xl font-bold text-card-foreground">{value}</p>
      {change && (
        <p className={`mt-1 text-sm ${positive ? "text-success" : "text-destructive"}`}>
          {change}
        </p>
      )}
    </div>
  );
}
