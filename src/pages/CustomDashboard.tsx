import { useState } from "react";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, RotateCcw, Save, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface WidgetData {
  i: string;
  title: string;
  content: React.ReactNode;
}

export default function CustomDashboard() {
  const { toast } = useToast();
  const [layouts, setLayouts] = useState<{ [key: string]: Layout[] }>({
    lg: [
      { i: "widget-1", x: 0, y: 0, w: 4, h: 2 },
      { i: "widget-2", x: 4, y: 0, w: 4, h: 2 },
      { i: "widget-3", x: 8, y: 0, w: 4, h: 2 },
      { i: "widget-4", x: 0, y: 2, w: 6, h: 3 },
      { i: "widget-5", x: 6, y: 2, w: 6, h: 3 },
    ],
  });

  const widgets: WidgetData[] = [
    {
      i: "widget-1",
      title: "Samtal idag",
      content: (
        <div className="text-4xl font-bold text-primary">24</div>
      ),
    },
    {
      i: "widget-2",
      title: "Genomsnitt poäng",
      content: (
        <div className="text-4xl font-bold text-success">85%</div>
      ),
    },
    {
      i: "widget-3",
      title: "Aktiva kampanjer",
      content: (
        <div className="text-4xl font-bold text-accent">12</div>
      ),
    },
    {
      i: "widget-4",
      title: "Senaste samtal",
      content: (
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 rounded bg-muted/50">
            <span className="text-sm">Samtal #1234</span>
            <span className="text-xs text-success">95%</span>
          </div>
          <div className="flex justify-between items-center p-2 rounded bg-muted/50">
            <span className="text-sm">Samtal #1235</span>
            <span className="text-xs text-warning">72%</span>
          </div>
          <div className="flex justify-between items-center p-2 rounded bg-muted/50">
            <span className="text-sm">Samtal #1236</span>
            <span className="text-xs text-success">88%</span>
          </div>
        </div>
      ),
    },
    {
      i: "widget-5",
      title: "Trender",
      content: (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          <p>Diagram kommer här</p>
        </div>
      ),
    },
  ];

  const handleLayoutChange = (layout: Layout[], layouts: { [key: string]: Layout[] }) => {
    setLayouts(layouts);
  };

  const handleSaveLayout = () => {
    localStorage.setItem("customDashboardLayout", JSON.stringify(layouts));
    toast({
      title: "Layout sparad",
      description: "Din anpassade dashboard har sparats",
    });
  };

  const handleResetLayout = () => {
    const defaultLayouts = {
      lg: [
        { i: "widget-1", x: 0, y: 0, w: 4, h: 2 },
        { i: "widget-2", x: 4, y: 0, w: 4, h: 2 },
        { i: "widget-3", x: 8, y: 0, w: 4, h: 2 },
        { i: "widget-4", x: 0, y: 2, w: 6, h: 3 },
        { i: "widget-5", x: 6, y: 2, w: 6, h: 3 },
      ],
    };
    setLayouts(defaultLayouts);
    toast({
      title: "Layout återställd",
      description: "Dashboard har återställts till standardlayout",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8" />
            Custom Dashboard
          </h2>
          <p className="text-muted-foreground">
            Dra och släpp för att anpassa din dashboard
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleResetLayout}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Återställ
          </Button>
          <Button variant="outline" onClick={handleSaveLayout}>
            <Save className="mr-2 h-4 w-4" />
            Spara
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Dela
          </Button>
        </div>
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".drag-handle"
      >
        {widgets.map((widget) => (
          <div key={widget.i}>
            <Card className="h-full hover:shadow-card transition-shadow cursor-move">
              <CardHeader className="drag-handle cursor-grab active:cursor-grabbing pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {widget.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {widget.content}
              </CardContent>
            </Card>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}
