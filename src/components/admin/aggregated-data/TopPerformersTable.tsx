import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy } from "lucide-react";

interface TopPerformer {
  userId: string;
  userName: string;
  totalCalls: number;
  avgScore: number;
  successRate: number;
  revenue: number;
}

interface TopPerformersTableProps {
  performers: TopPerformer[];
}

export const TopPerformersTable = ({ performers }: TopPerformersTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Topppresterande Användare
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rang</TableHead>
                <TableHead>Användare</TableHead>
                <TableHead>Samtal</TableHead>
                <TableHead>Snitt Betyg</TableHead>
                <TableHead>Framgång %</TableHead>
                <TableHead>Intäkt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Ingen data tillgänglig
                  </TableCell>
                </TableRow>
              ) : (
                performers.map((performer, index) => (
                  <TableRow key={performer.userId}>
                    <TableCell>
                      <span className={`font-bold ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-600' : ''}`}>
                        #{index + 1}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{performer.userName}</TableCell>
                    <TableCell>{performer.totalCalls}</TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary">
                        {performer.avgScore.toFixed(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-green-600">
                        {performer.successRate.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>{performer.revenue.toLocaleString()} kr</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
