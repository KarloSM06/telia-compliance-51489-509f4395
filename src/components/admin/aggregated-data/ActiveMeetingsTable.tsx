import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface Meeting {
  id: string;
  title: string;
  start_time: string;
  contact_person: string | null;
  expected_revenue: number | null;
  status: string;
}

interface ActiveMeetingsTableProps {
  meetings: Meeting[];
}

export const ActiveMeetingsTable = ({ meetings }: ActiveMeetingsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Kommande Möten (Alla Kunder)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titel</TableHead>
                <TableHead>Starttid</TableHead>
                <TableHead>Kontakt</TableHead>
                <TableHead>Förväntad Intäkt</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Inga kommande möten
                  </TableCell>
                </TableRow>
              ) : (
                meetings.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell className="font-medium">{meeting.title}</TableCell>
                    <TableCell>
                      {format(new Date(meeting.start_time), 'PPp', { locale: sv })}
                    </TableCell>
                    <TableCell>{meeting.contact_person || '-'}</TableCell>
                    <TableCell>
                      {meeting.expected_revenue 
                        ? `${meeting.expected_revenue.toLocaleString()} kr` 
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${meeting.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                          meeting.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          'bg-gray-100 text-gray-800'}`}
                      >
                        {meeting.status}
                      </span>
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
