import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingRowProps {
  icon?: LucideIcon;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function SettingRow({ 
  icon: Icon, 
  label, 
  description, 
  checked, 
  onCheckedChange,
  className 
}: SettingRowProps) {
  return (
    <div className={cn(
      "flex items-center justify-between py-3 px-4 rounded-lg hover:bg-muted/50 transition-colors",
      className
    )}>
      <div className="flex items-start gap-3 flex-1">
        {Icon && (
          <div className={cn(
            "rounded-md p-2 mt-0.5",
            checked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          )}>
            <Icon className="h-4 w-4" />
          </div>
        )}
        <div className="flex-1">
          <Label htmlFor={label} className="cursor-pointer font-medium">
            {label}
          </Label>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <Switch 
        id={label} 
        checked={checked} 
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}
