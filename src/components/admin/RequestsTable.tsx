import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RequestStatusBadge } from './RequestStatusBadge';
import { RequestData } from '@/hooks/useAdminRequests';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';

interface RequestsTableProps {
  requests: RequestData[];
  loading: boolean;
  onViewDetails: (request: RequestData) => void;
}

export function RequestsTable({ requests, loading, onViewDetails }: RequestsTableProps) {
  if (loading) {
    return (
      <Card className="p-8">
        <LoadingState />
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card className="p-8">
        <EmptyState />
      </Card>
    );
  }

  const getTypeLabel = (type: string) => {
    return type === 'booking' ? 'Bokning' : 'AI-konsultation';
  };

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Typ</TableHead>
              <TableHead>Namn</TableHead>
              <TableHead>Företag</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Skapad</TableHead>
              <TableHead className="text-right">Åtgärder</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={`${request.type}-${request.id}`}>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {getTypeLabel(request.type)}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{request.name}</TableCell>
                <TableCell>{request.company || '-'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {request.email}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {request.phone}
                </TableCell>
                <TableCell>
                  <RequestStatusBadge status={request.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(request.created_at), 'PPP', { locale: sv })}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(request)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="p-4 border-t text-sm text-muted-foreground text-center">
        Visar {requests.length} förfrågan{requests.length !== 1 ? 'ar' : ''}
      </div>
    </Card>
  );
}
