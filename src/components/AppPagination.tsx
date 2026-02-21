import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AppPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function AppPagination({ page, totalPages, onPageChange }: AppPaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        <ChevronLeft size={18} />
      </Button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Button key={p} variant={p === page ? "default" : "outline"} size="icon" onClick={() => onPageChange(p)}>
          {p}
        </Button>
      ))}
      <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        <ChevronRight size={18} />
      </Button>
    </div>
  );
}
