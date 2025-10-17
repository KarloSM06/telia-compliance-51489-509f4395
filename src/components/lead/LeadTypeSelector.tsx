import { Card, CardContent } from "@/components/ui/card";
import { Home, Building } from "lucide-react";

interface LeadTypeSelectorProps {
  onSelect: (type: 'brf' | 'business') => void;
  selected?: 'brf' | 'business';
}

export function LeadTypeSelector({ onSelect, selected }: LeadTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg ${
          selected === 'brf' ? 'ring-2 ring-primary' : ''
        }`}
        onClick={() => onSelect('brf')}
      >
        <CardContent className="pt-8 pb-6 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 mb-4">
            <Home className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Bostadsrättsföreningar</h3>
          <p className="text-sm text-muted-foreground">
            Hitta föreningar som behöver dina tjänster
          </p>
        </CardContent>
      </Card>
      
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg ${
          selected === 'business' ? 'ring-2 ring-primary' : ''
        }`}
        onClick={() => onSelect('business')}
      >
        <CardContent className="pt-8 pb-6 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 mb-4">
            <Building className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Företag</h3>
          <p className="text-sm text-muted-foreground">
            Prospektera B2B-leads automatiskt
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
