import { useState } from "react";
import { useDashboardState } from "@/hooks/useDashboardState";
import { WidgetLibrary } from "@/components/dashboard-builder/WidgetLibrary";
import { WidgetConfigPanel } from "@/components/dashboard-builder/WidgetConfigPanel";
import { DashboardCanvas } from "@/components/dashboard-builder/DashboardCanvas";
import { LayoutToolbar } from "@/components/dashboard-builder/LayoutToolbar";
import { ShareModal } from "@/components/dashboard-builder/ShareModal";
import { TemplateSelector } from "@/components/dashboard-builder/TemplateSelector";
import { WidgetType, DashboardWidget } from "@/types/widget.types";
import { getWidgetDefinition } from "@/lib/widget-registry";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "react-grid-layout";

export default function CustomDashboard() {
  const { toast } = useToast();
  const {
    widgets,
    selectedWidget,
    currentPage,
    setSelectedWidget,
    addWidget,
    updateWidget,
    removeWidget,
    updateLayout,
  } = useDashboardState();

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [pages] = useState([{ id: 'page-1', name: 'Översikt', layout: [] }]);

  const handleAddWidget = (type: WidgetType) => {
    const definition = getWidgetDefinition(type);
    const newWidget: DashboardWidget = {
      id: `widget-${Date.now()}`,
      dashboard_id: 'temp',
      page_id: currentPage,
      widget_type: type,
      config: definition.defaultConfig,
      data_source: { type: 'calls', refreshInterval: 0 },
      position: {
        x: 0,
        y: Infinity,
        w: definition.defaultSize.w,
        h: definition.defaultSize.h,
      },
      created_at: new Date().toISOString(),
    };
    addWidget(newWidget);
    toast({ title: "Widget tillagd", description: `${definition.name} har lagts till` });
  };

  const handleSave = () => {
    toast({ title: "Sparad", description: "Din dashboard har sparats" });
  };

  const handleExport = () => {
    toast({ title: "Exporterar...", description: "PDF-export kommer snart" });
  };

  return (
    <div className="flex h-screen w-full bg-background animate-fade-in">
      <div className="animate-slide-in-right">
        <WidgetLibrary onAddWidget={handleAddWidget} />
      </div>
      
      <div className="flex-1 flex flex-col animate-scale-in" style={{ animationDelay: '100ms' }}>
        <LayoutToolbar
          title="Min Custom Dashboard"
          currentPage={currentPage}
          pages={pages}
          onPageChange={() => {}}
          onAddPage={() => toast({ title: "Snart tillgängligt" })}
          onSave={handleSave}
          onShare={() => setShareModalOpen(true)}
          onExport={handleExport}
          onTemplate={() => setTemplateModalOpen(true)}
        />
        
        <DashboardCanvas
          widgets={widgets}
          onLayoutChange={(layouts: Layout[]) => updateLayout(layouts)}
          onWidgetClick={setSelectedWidget}
          onWidgetRemove={removeWidget}
          selectedWidget={selectedWidget}
        />
      </div>

      <WidgetConfigPanel
        widget={widgets.find(w => w.id === selectedWidget) || null}
        onClose={() => setSelectedWidget(null)}
        onUpdate={updateWidget}
      />

      <ShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        dashboardId="temp"
      />

      <TemplateSelector
        open={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        onSelectTemplate={(id) => toast({ title: "Mall vald", description: id })}
      />
    </div>
  );
}
