import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
}

export function RatingStars({ rating, size = 16, showValue = true, reviewCount }: RatingStarsProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={star <= Math.round(rating) ? "fill-warning text-warning" : "text-border"}
          />
        ))}
      </div>
      {showValue && <span className="text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>}
      {reviewCount !== undefined && (
        <span className="text-sm text-muted-foreground">({reviewCount})</span>
      )}
    </div>
  );
}
