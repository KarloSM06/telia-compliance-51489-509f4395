import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, TrendingUp, Users, ShoppingCart } from "lucide-react";

interface TemplateSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
}

const templates = [
  {
    id: 'executive',
    name: 'Executive Dashboard',
    description: 'Översikt för ledning med nyckeltal',
    icon: LayoutDashboard,
  },
  {
    id: 'sales',
    name: 'Försäljning',
    description: 'Pipeline och försäljningsmetrik',
    icon: TrendingUp,
  },
  {
    id: 'operations',
    name: 'Operations',
    description: 'Realtidsövervakning och resurser',
    icon: Users,
  },
  {
    id: 'ecommerce',
    name: 'E-handel',
    description: 'Produkter, beställningar och kunder',
    icon: ShoppingCart,
  },
];

export const TemplateSelector = ({ open, onClose, onSelectTemplate }: TemplateSelectorProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Välj en mall</DialogTitle>
          <DialogDescription>
            Börja med en fördefinierad mall eller bygg från scratch
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          {templates.map(template => {
            const Icon = template.icon;
            return (
              <Card
                key={template.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => {
                  onSelectTemplate(template.id);
                  onClose();
                }}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{template.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Avbryt
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
