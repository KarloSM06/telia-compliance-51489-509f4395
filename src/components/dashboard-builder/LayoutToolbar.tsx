import { Button } from "@/components/ui/button";
import { Save, Share2, Download, LayoutTemplate, Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardPage } from "@/types/dashboard.types";

interface LayoutToolbarProps {
  title: string;
  currentPage: string;
  pages: DashboardPage[];
  onPageChange: (pageId: string) => void;
  onAddPage: () => void;
  onSave: () => void;
  onShare: () => void;
  onExport: () => void;
  onTemplate: () => void;
}

export const LayoutToolbar = ({
  title,
  currentPage,
  pages,
  onPageChange,
  onAddPage,
  onSave,
  onShare,
  onExport,
  onTemplate,
}: LayoutToolbarProps) => {
  return (
    <div className="border-b bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">Dashboard Builder</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onTemplate}>
            <LayoutTemplate className="mr-2 h-4 w-4" />
            Mallar
          </Button>
          <Button variant="outline" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportera
          </Button>
          <Button variant="outline" onClick={onShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Dela
          </Button>
          <Button onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            Spara
          </Button>
        </div>
      </div>

      {pages.length > 1 && (
        <Tabs value={currentPage} onValueChange={onPageChange}>
          <TabsList>
            {pages.map(page => (
              <TabsTrigger key={page.id} value={page.id}>
                {page.name}
              </TabsTrigger>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 h-9"
              onClick={onAddPage}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TabsList>
        </Tabs>
      )}
    </div>
  );
};
