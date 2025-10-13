import { BarChart3, LineChart, AreaChart, Maximize2, Filter, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ChartToolbarProps {
  onChartTypeChange?: (type: "bar" | "line" | "area") => void;
  onExport?: () => void;
  showChartType?: boolean;
  showFilter?: boolean;
  showExport?: boolean;
}

export const ChartToolbar = ({
  onChartTypeChange,
  onExport,
  showChartType = true,
  showFilter = false,
  showExport = true,
}: ChartToolbarProps) => {
  const handleCopy = () => {
    toast.success("Data kopierad till urklipp");
  };

  return (
    <div className="flex items-center gap-1">
      {showChartType && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <BarChart3 className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onChartTypeChange?.("bar")}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Stapeldiagram
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onChartTypeChange?.("line")}>
              <LineChart className="mr-2 h-4 w-4" />
              Linjediagram
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onChartTypeChange?.("area")}>
              <AreaChart className="mr-2 h-4 w-4" />
              Områdesdiagram
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {showFilter && (
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Filter className="h-4 w-4" />
        </Button>
      )}

      {showExport && (
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleCopy}>
          <Copy className="h-4 w-4" />
        </Button>
      )}

      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <Maximize2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
