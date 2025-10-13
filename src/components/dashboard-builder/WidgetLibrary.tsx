import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getAllWidgets, getWidgetsByCategory } from "@/lib/widget-registry";
import { Plus, BarChart3, Table, Activity, Filter } from "lucide-react";
import { WidgetType } from "@/types/widget.types";

interface WidgetLibraryProps {
  onAddWidget: (type: WidgetType) => void;
}

const categoryIcons = {
  data: Activity,
  chart: BarChart3,
  table: Table,
  interactive: Filter,
};

const categoryNames = {
  data: 'Data',
  chart: 'Diagram',
  table: 'Tabeller',
  interactive: 'Interaktiva',
};

export const WidgetLibrary = ({ onAddWidget }: WidgetLibraryProps) => {
  const categories = ['data', 'chart', 'table', 'interactive'] as const;

  return (
    <div className="w-64 border-r bg-card p-4 flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-1">Widget-bibliotek</h3>
        <p className="text-xs text-muted-foreground">Dra eller klicka för att lägga till</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-6">
          {categories.map(category => {
            const widgets = getWidgetsByCategory(category);
            const Icon = categoryIcons[category];

            return (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {categoryNames[category]}
                  </h4>
                </div>
                
                <div className="space-y-2">
                  {widgets.map(widget => {
                    const WidgetIcon = widget.icon;
                    return (
                      <Button
                        key={widget.type}
                        variant="outline"
                        className="w-full justify-start gap-2 h-auto py-3 hover:bg-accent"
                        onClick={() => onAddWidget(widget.type)}
                      >
                        <WidgetIcon className="h-4 w-4 flex-shrink-0" />
                        <div className="text-left flex-1">
                          <div className="font-medium text-sm">{widget.name}</div>
                          <div className="text-xs text-muted-foreground">{widget.description}</div>
                        </div>
                        <Plus className="h-4 w-4 flex-shrink-0" />
                      </Button>
                    );
                  })}
                </div>
                {category !== 'interactive' && <Separator className="my-4" />}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
