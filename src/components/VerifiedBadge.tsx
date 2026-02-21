import { ShieldCheck } from "lucide-react";

export function VerifiedBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground ${className}`}>
      <ShieldCheck size={14} />
      Verified
    </span>
  );
}
