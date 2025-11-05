import { Download, Maximize2, Share2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ChartActionMenuProps {
  onExportPNG?: () => void;
  onExportCSV?: () => void;
  onFullscreen?: () => void;
  onShare?: () => void;
}

export const ChartActionMenu = ({
  onExportPNG,
  onExportCSV,
  onFullscreen,
  onShare,
}: ChartActionMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {onExportPNG && (
          <DropdownMenuItem onClick={onExportPNG}>
            <Download className="mr-2 h-4 w-4" />
            Exportera PNG
          </DropdownMenuItem>
        )}
        {onExportCSV && (
          <DropdownMenuItem onClick={onExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Exportera CSV
          </DropdownMenuItem>
        )}
        {onFullscreen && (
          <DropdownMenuItem onClick={onFullscreen}>
            <Maximize2 className="mr-2 h-4 w-4" />
            Fullskärm
          </DropdownMenuItem>
        )}
        {onShare && (
          <DropdownMenuItem onClick={onShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Dela
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
