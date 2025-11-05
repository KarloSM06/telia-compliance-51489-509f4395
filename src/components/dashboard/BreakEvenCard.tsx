import { TrendingUp, Calendar, DollarSign } from "lucide-react";
import { PremiumCard, PremiumCardContent, PremiumCardHeader, PremiumCardTitle } from "@/components/ui/premium-card";
import { BreakEvenMetrics } from "@/lib/roiCalculations";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
interface BreakEvenCardProps {
  breakEven: BreakEvenMetrics;
}
export function BreakEvenCard({
  breakEven
}: BreakEvenCardProps) {
  return;
}