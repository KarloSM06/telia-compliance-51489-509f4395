import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PackageCard } from "@/components/dashboard/PackageCard";
import { TierPackageCard } from "@/components/dashboard/TierPackageCard";
import { availablePackages } from "@/components/dashboard/PackagesData";
import { Search } from "lucide-react";

export default function DashboardPackages() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const filteredPackages = availablePackages
    .filter((pkg) =>
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "popular") return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      return 0;
    });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Produkter & Paket</h2>
        <p className="text-muted-foreground">
          Utforska våra AI-lösningar för olika behov
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Sök paket..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sortera efter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Namn</SelectItem>
            <SelectItem value="popular">Populärast först</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPackages.map((pkg, index) => (
          <div
            key={pkg.id}
            className="animate-scale-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {pkg.tiers ? (
              <TierPackageCard package={pkg} />
            ) : (
              <PackageCard package={pkg} />
            )}
          </div>
        ))}
      </div>

      {filteredPackages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Inga paket matchar din sökning
          </p>
        </div>
      )}
    </div>
  );
}
