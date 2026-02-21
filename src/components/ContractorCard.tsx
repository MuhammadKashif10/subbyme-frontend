import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import type { User } from "@/lib/types";
import { RatingStars } from "./RatingStars";
import { VerifiedBadge } from "./VerifiedBadge";
import { Button } from "./ui/button";

export function ContractorCard({ contractor }: { contractor: User }) {
  const id = contractor._id || contractor.id;
  const avatarUrl = contractor.profileImage?.url || contractor.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${contractor.name}`;

  return (
    <div className="group rounded-lg border bg-card p-4 card-shadow transition-all hover:card-shadow-hover">
      <div className="flex gap-4">
        <img
          src={avatarUrl}
          alt={contractor.name}
          className="h-20 w-20 shrink-0 rounded-lg bg-secondary object-cover"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                {contractor.name}
              </h3>
              <p className="text-sm font-medium text-primary">{contractor.trade || "General"}</p>
            </div>
            {contractor.isVerified && <VerifiedBadge />}
          </div>
          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin size={14} />
            {contractor.location || "Location not set"}
          </div>
          <div className="mt-1">
            <RatingStars rating={contractor.averageRating || 0} size={14} reviewCount={contractor.reviewCount || 0} />
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{contractor.bio || "No description provided."}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">
              {contractor.hourlyRate ? `$${contractor.hourlyRate}/hr` : "Rate not set"}
            </span>
            <Button asChild size="sm">
              <Link to={`/contractors/${id}`}>View Profile</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
