import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, Search } from 'lucide-react';
import { 
  formatDuration, 
  formatCost, 
  formatPhoneNumber,
  formatFullTimestamp,
  getEventTypeLabel,
  getProviderDisplayName,
  getDirectionLabel,
  getStatusLabel,
  getStatusVariant,
  getDirectionBadgeVariant,
} from '@/lib/telephonyFormatters';
import { EventDetailModal } from './EventDetailModal';

export const DetailedMetricsTable = ({ events }: { events: any[] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const filteredEvents = events.filter(event => 
    event.from_number?.includes(searchQuery) ||
    event.to_number?.includes(searchQuery) ||
    event.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.event_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sök efter nummer, provider, typ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportera
          </Button>
        </div>

        <div className="border rounded-lg overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Från</TableHead>
                <TableHead>Till</TableHead>
                <TableHead>Längd</TableHead>
                <TableHead>Kostnad</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Datum/Tid</TableHead>
                <TableHead>Åtgärder</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    Inga händelser hittades
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvents.map(event => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">
                      {getProviderDisplayName(event.provider)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getEventTypeLabel(event.event_type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getDirectionBadgeVariant(event.direction)}>
                        {getDirectionLabel(event.direction)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatPhoneNumber(event.from_number)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatPhoneNumber(event.to_number)}
                    </TableCell>
                    <TableCell>{formatDuration(event.duration_seconds)}</TableCell>
                    <TableCell>{formatCost(event.cost_amount, event.cost_currency)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(event.status)}>
                        {getStatusLabel(event.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatFullTimestamp(event.event_timestamp)}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="text-sm text-muted-foreground">
          Visar {filteredEvents.length} av {events.length} händelser
        </div>
      </Card>

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          open={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
};
