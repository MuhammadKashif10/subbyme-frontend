import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import { useCategories } from "@/hooks/use-api";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function HeroSearch() {
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  const { data: categories } = useCategories();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (category) params.set("category", category);
    navigate(`/contractors?${params.toString()}`);
  };

  return (
    <div className="mx-auto w-full max-w-3xl rounded-xl border bg-card p-2 card-shadow sm:flex sm:items-center sm:gap-2">
      <div className="flex flex-1 items-center gap-2 rounded-lg bg-secondary px-3 py-2">
        <MapPin size={18} className="shrink-0 text-muted-foreground" />
        <Input
          placeholder="Enter your location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
        />
      </div>
      <div className="mt-2 sm:mt-0 sm:w-48">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="border-0 bg-secondary shadow-none">
            <SelectValue placeholder="All Trades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Trades</SelectItem>
            {(categories ?? []).map((c) => (
              <SelectItem key={c._id} value={c.name}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleSearch} size="lg" className="mt-2 w-full sm:mt-0 sm:w-auto">
        <Search size={18} className="mr-2" />
        Search
      </Button>
    </div>
  );
}
