import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, Info } from "lucide-react";
import { useState } from "react";

export interface PackageData {
  id: string;
  name: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  icon: React.ReactNode;
  color: string;
  detailedDescription: string;
}

interface PackageCardProps {
  package: PackageData;
}

export function PackageCard({ package: pkg }: PackageCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-elegant hover:scale-105 ${
        isHovered ? "border-primary" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {pkg.isPopular && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-gradient-gold text-primary font-semibold">
            Populär
          </Badge>
        </div>
      )}

      <CardHeader>
        <div className={`p-3 rounded-lg ${pkg.color} w-fit mb-3`}>
          {pkg.icon}
        </div>
        <CardTitle className="text-xl">{pkg.name}</CardTitle>
        <CardDescription>{pkg.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          {pkg.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full group">
              <Info className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Läs mer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-3">
                <div className={`p-2 rounded-lg ${pkg.color}`}>
                  {pkg.icon}
                </div>
                {pkg.name}
              </DialogTitle>
              <DialogDescription className="text-base mt-4">
                {pkg.detailedDescription}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6">
              <h4 className="font-semibold mb-3">Funktioner:</h4>
              <div className="grid gap-3">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
