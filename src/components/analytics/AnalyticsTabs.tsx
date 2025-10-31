import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  Radio, 
  Phone,
  Sparkles 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsTabsProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const AnalyticsTabs = ({ value, onValueChange }: AnalyticsTabsProps) => {
  const tabs = [
    { value: "overview", label: "Översikt", icon: LayoutDashboard },
    { value: "revenue", label: "Intäkter", icon: TrendingUp },
    { value: "customers", label: "Kunder", icon: Users },
    { value: "channels", label: "Kanaler", icon: Radio },
    { value: "telephony", label: "Telefoni", icon: Phone },
    { value: "predictive", label: "Prediktiv AI", icon: Sparkles },
  ];

  return (
    <div className="px-6 -mt-4 mb-6">
      <div className="max-w-7xl mx-auto">
        <Tabs value={value} onValueChange={onValueChange} className="w-full">
          <TabsList className={cn(
            "inline-flex h-14 items-center justify-start",
            "rounded-xl bg-card/80 backdrop-blur-xl p-2",
            "border border-border/50 shadow-card",
            "gap-2 w-full md:w-auto overflow-x-auto"
          )}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-lg",
                    "text-sm font-semibold whitespace-nowrap",
                    "transition-all duration-500",
                    "data-[state=inactive]:text-muted-foreground",
                    "data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90",
                    "data-[state=active]:text-primary-foreground",
                    "data-[state=active]:shadow-elegant",
                    "hover:scale-105 hover:shadow-card",
                    "data-[state=active]:border-none"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
