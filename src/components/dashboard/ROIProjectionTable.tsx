import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CumulativeMetrics } from "@/lib/roiCalculations";
import { CheckCircle } from "lucide-react";

interface ROIProjectionTableProps {
  data: CumulativeMetrics[];
  breakEvenMonth?: number;
}

export function ROIProjectionTable({ data, breakEvenMonth }: ROIProjectionTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Månad</TableHead>
            <TableHead className="text-right">Ack. Kostnad</TableHead>
            <TableHead className="text-right">Ack. Intäkt</TableHead>
            <TableHead className="text-right">Netto</TableHead>
            <TableHead className="text-right">ROI %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => {
            const isBreakEven = breakEvenMonth === row.month;
            const isProfitable = row.netProfit >= 0;
            
            return (
              <TableRow 
                key={row.month}
                className={isBreakEven ? "bg-green-50 dark:bg-green-950" : ""}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {isBreakEven && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {row.monthName}
                  </div>
                </TableCell>
                <TableCell className="text-right text-red-600">
                  {row.accumulatedCost.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK
                </TableCell>
                <TableCell className="text-right text-green-600">
                  {row.accumulatedRevenue.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK
                </TableCell>
                <TableCell className={`text-right font-semibold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                  {row.netProfit >= 0 ? '+' : ''}{row.netProfit.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK
                </TableCell>
                <TableCell className={`text-right font-semibold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                  {row.roi.toFixed(1)}%
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
