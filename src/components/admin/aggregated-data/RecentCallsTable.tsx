import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface Call {
  id: string;
  user_id: string;
  file_name: string;
  created_at: string;
  score: number | null;
  sale_outcome: boolean | null;
  duration: string | null;
}

interface RecentCallsTableProps {
  calls: Call[];
  onViewTranscript: (callId: string) => void;
}

export const RecentCallsTable = ({ calls, onViewTranscript }: RecentCallsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Senaste Samtal (Alla Användare)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Filnamn</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Längd</TableHead>
                <TableHead>Betyg</TableHead>
                <TableHead>Försäljning</TableHead>
                <TableHead>Åtgärd</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calls.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Inga samtal hittades
                  </TableCell>
                </TableRow>
              ) : (
                calls.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell className="font-medium">{call.file_name}</TableCell>
                    <TableCell>
                      {format(new Date(call.created_at), 'PPp', { locale: sv })}
                    </TableCell>
                    <TableCell>{call.duration || '-'}</TableCell>
                    <TableCell>
                      {call.score !== null ? (
                        <span className={`font-semibold ${call.score >= 7 ? 'text-green-600' : call.score >= 4 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {call.score.toFixed(1)}
                        </span>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      {call.sale_outcome !== null ? (
                        <span className={`font-semibold ${call.sale_outcome ? 'text-green-600' : 'text-red-600'}`}>
                          {call.sale_outcome ? 'Ja' : 'Nej'}
                        </span>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewTranscript(call.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Visa
                      </Button>
                    </TableCell>
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
