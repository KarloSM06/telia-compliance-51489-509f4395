import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import { DashboardWidget } from "@/types/widget.types";
import { getWidgetDefinition } from "@/lib/widget-registry";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2 } from "lucide-react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardCanvasProps {
  widgets: DashboardWidget[];
  onLayoutChange: (layouts: Layout[]) => void;
  onWidgetClick: (id: string) => void;
  onWidgetRemove: (id: string) => void;
  selectedWidget: string | null;
}

export const DashboardCanvas = ({
  widgets,
  onLayoutChange,
  onWidgetClick,
  onWidgetRemove,
  selectedWidget,
}: DashboardCanvasProps) => {
  const layouts = widgets.map(w => ({
    i: w.id,
    x: w.position.x,
    y: w.position.y,
    w: w.position.w,
    h: w.position.h,
  }));

  return (
    <div className="flex-1 p-6 bg-muted/30 overflow-auto">
      {widgets.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md">
            <h3 className="text-lg font-semibold mb-2">Din dashboard är tom</h3>
            <p className="text-muted-foreground">
              Börja genom att lägga till widgets från biblioteket till vänster
            </p>
          </div>
        </div>
      ) : (
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: layouts }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={60}
          onLayoutChange={(layout) => onLayoutChange(layout)}
          draggableHandle=".drag-handle"
        >
          {widgets.map((widget) => {
            const definition = getWidgetDefinition(widget.widget_type);
            const WidgetComponent = definition.component;

            return (
              <div key={widget.id} onClick={() => onWidgetClick(widget.id)}>
                <Card 
                  className={`h-full relative group transition-all ${
                    selectedWidget === widget.id ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
                    <div className="drag-handle cursor-grab active:cursor-grabbing bg-background/95 rounded p-1">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        onWidgetRemove(widget.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="h-full overflow-hidden">
                    <WidgetComponent
                      id={widget.id}
                      config={widget.config}
                      dataSource={widget.data_source}
                      isEditing={selectedWidget === widget.id}
                    />
                  </div>
                </Card>
              </div>
            );
          })}
        </ResponsiveGridLayout>
      )}
    </div>
  );
};
