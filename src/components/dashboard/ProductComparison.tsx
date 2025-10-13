import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Lock } from "lucide-react";
import { useUserProducts } from "@/hooks/useUserProducts";
import { useNavigate } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

export function ProductComparison() {
  const { products } = useUserProducts();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const allProducts = [
    { id: 'krono', name: 'Krono', color: 'hsl(222, 47%, 18%)' },
    { id: 'gastro', name: 'Gastro', color: 'hsl(38, 92%, 50%)' },
    { id: 'thor', name: 'Thor', color: 'hsl(142, 76%, 36%)' },
    { id: 'talent', name: 'Talent', color: 'hsl(280, 65%, 60%)' },
    { id: 'lead', name: 'Lead', color: 'hsl(0, 72%, 51%)' },
  ];

  const features = [
    { name: 'Samtalshant.', products: ['krono', 'gastro', 'thor'] },
    { name: 'Bokningar', products: ['krono', 'gastro'] },
    { name: 'AI Analys', products: ['thor'] },
    { name: 'Rekrytering', products: ['talent'] },
    { name: 'Prospektering', products: ['lead'] },
    { name: '24/7 Support', products: ['krono', 'gastro', 'thor', 'talent', 'lead'] },
  ];

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CardHeader>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 hover:bg-transparent">
              <CardTitle className="text-left">Vad kan du göra mer? 🚀</CardTitle>
              <span className="text-sm text-muted-foreground">
                {isOpen ? 'Dölj' : 'Visa'} jämförelse
              </span>
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Feature</th>
                    {allProducts.map(product => (
                      <th key={product.id} className="p-3 text-center font-semibold">
                        {product.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, idx) => (
                    <tr key={idx} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-3 font-medium">{feature.name}</td>
                      {allProducts.map(product => {
                        const hasFeature = feature.products.includes(product.id);
                        return (
                          <td key={product.id} className="p-3 text-center">
                            {hasFeature ? (
                              <Check className="h-5 w-5 text-success mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr className="bg-muted/30">
                    <td className="p-3 font-semibold">Du har</td>
                    {allProducts.map(product => {
                      const owned = products.includes(product.id);
                      return (
                        <td key={product.id} className="p-3 text-center">
                          {owned ? (
                            <span className="text-success font-semibold">Äger</span>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="gap-1"
                              onClick={() => navigate('/dashboard/packages')}
                            >
                              <Lock className="h-3 w-3" />
                              Köp
                            </Button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
