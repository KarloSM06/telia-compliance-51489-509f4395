import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardWidget, DataSource } from "@/types/widget.types";
import { X, Settings, Database, Palette } from "lucide-react";

interface WidgetConfigPanelProps {
  widget: DashboardWidget | null;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<DashboardWidget>) => void;
}

const dataSourceOptions: { value: DataSource; label: string }[] = [
  { value: 'calls', label: 'Samtal' },
  { value: 'bookings', label: 'Bokningar' },
  { value: 'messages', label: 'Meddelanden' },
  { value: 'subscriptions', label: 'Prenumerationer' },
];

export const WidgetConfigPanel = ({ widget, onClose, onUpdate }: WidgetConfigPanelProps) => {
  if (!widget) {
    return (
      <div className="w-80 border-l bg-card p-4 flex items-center justify-center">
        <p className="text-sm text-muted-foreground text-center">
          Välj en widget för att konfigurera
        </p>
      </div>
    );
  }

  const handleConfigChange = (key: string, value: any) => {
    onUpdate(widget.id, {
      config: { ...widget.config, [key]: value }
    });
  };

  const handleDataSourceChange = (key: string, value: any) => {
    onUpdate(widget.id, {
      data_source: { ...widget.data_source, [key]: value }
    });
  };

  return (
    <div className="w-80 border-l bg-card flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Widget-inställningar</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* General Settings */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-medium">Allmänt</h4>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="title">Titel</Label>
                <Input
                  id="title"
                  value={widget.config.title || ''}
                  onChange={(e) => handleConfigChange('title', e.target.value)}
                  placeholder="Widget-titel"
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Undertitel</Label>
                <Input
                  id="subtitle"
                  value={widget.config.subtitle || ''}
                  onChange={(e) => handleConfigChange('subtitle', e.target.value)}
                  placeholder="Valfri undertitel"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Data Source */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Database className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-medium">Datakälla</h4>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="dataSource">Källa</Label>
                <Select
                  value={widget.data_source.type}
                  onValueChange={(value) => handleDataSourceChange('type', value as DataSource)}
                >
                  <SelectTrigger id="dataSource">
                    <SelectValue placeholder="Välj datakälla" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataSourceOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="refreshInterval">Uppdateringsintervall (sek)</Label>
                <Input
                  id="refreshInterval"
                  type="number"
                  value={widget.data_source.refreshInterval || 0}
                  onChange={(e) => handleDataSourceChange('refreshInterval', parseInt(e.target.value))}
                  placeholder="0 = Ingen automatisk uppdatering"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Styling */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-medium">Utseende</h4>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="color">Färg</Label>
                <Input
                  id="color"
                  type="color"
                  value={widget.config.color || '#000000'}
                  onChange={(e) => handleConfigChange('color', e.target.value)}
                  className="h-10"
                />
              </div>

              {widget.widget_type.includes('chart') && (
                <div>
                  <Label htmlFor="height">Höjd (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={widget.config.height || 300}
                    onChange={(e) => handleConfigChange('height', parseInt(e.target.value))}
                  />
                </div>
              )}

              {(widget.widget_type === 'progress' || widget.widget_type === 'objective-card') && (
                <>
                  <div>
                    <Label htmlFor="target">Målvärde</Label>
                    <Input
                      id="target"
                      type="number"
                      value={widget.config.target || 100}
                      onChange={(e) => handleConfigChange('target', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit">Enhet</Label>
                    <Input
                      id="unit"
                      value={widget.config.unit || ''}
                      onChange={(e) => handleConfigChange('unit', e.target.value)}
                      placeholder="t.ex. kr, st, %"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
