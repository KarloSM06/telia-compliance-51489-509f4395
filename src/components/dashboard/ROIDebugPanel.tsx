import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { BookingRevenue } from "@/lib/roiCalculations";

interface ROIDebugPanelProps {
  bookings: any[];
  bookingRevenues: BookingRevenue[];
  servicePricing: any[];
}

export function ROIDebugPanel({ bookings, bookingRevenues, servicePricing }: ROIDebugPanelProps) {
  const unmatchedBookings = bookings.filter(booking => {
    const revenue = bookingRevenues.find(r => r.bookingId === booking.id);
    return revenue && revenue.confidence < 70;
  });

  const hasWarnings = unmatchedBookings.length > 0 || servicePricing.length === 0;

  if (!hasWarnings && bookings.length === 0) {
    return null;
  }

  return (
    <Card className="border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Info className="h-4 w-4 text-blue-500" />
          ROI-beräkningar - Debug Info
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {servicePricing.length === 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Inga tjänster definierade</AlertTitle>
            <AlertDescription className="text-xs">
              Gå till <strong>Inställningar → ROI</strong> och lägg till tjänster med priser för mer exakta beräkningar.
            </AlertDescription>
          </Alert>
        )}

        {unmatchedBookings.length > 0 && (
          <Alert className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-900 dark:text-yellow-100">
              {unmatchedBookings.length} bokning(ar) kunde inte matchas exakt
            </AlertTitle>
            <AlertDescription className="text-xs text-yellow-800 dark:text-yellow-200 space-y-2 mt-2">
              {unmatchedBookings.map((booking, idx) => {
                const revenue = bookingRevenues.find(r => r.bookingId === booking.id);
                return (
                  <div key={idx} className="flex items-start gap-2 border-l-2 border-yellow-400 pl-2">
                    <div className="flex-1">
                      <div className="font-medium">{booking.title || 'Ingen titel'}</div>
                      <div className="text-xs opacity-75 space-y-0.5">
                        <div>service_type: {booking.service_type || 'saknas'}</div>
                        {booking.event_type && <div>event_type: {booking.event_type}</div>}
                        {booking.description && (
                          <div>description: {booking.description.substring(0, 50)}...</div>
                        )}
                        {booking.notes && <div>notes: {booking.notes.substring(0, 50)}...</div>}
                      </div>
                      {revenue && (
                        <div className="text-xs mt-1 space-y-1">
                          <div>
                            <Badge variant="outline" className="text-xs">
                              {revenue.confidence}% säkerhet
                            </Badge>
                            <span className="ml-2">{revenue.reasoning}</span>
                          </div>
                          {revenue.matchedFields && revenue.matchedFields.length > 0 && (
                            <div className="text-xs text-green-700 dark:text-green-300">
                              ✓ Matchade fält: {revenue.matchedFields.join(', ')}
                            </div>
                          )}
                          {revenue.matchDetails && revenue.matchDetails.length > 0 && (
                            <div className="text-xs space-y-0.5 pl-2 border-l border-green-400/30">
                              {revenue.matchDetails.map((detail, i) => (
                                <div key={i} className="flex justify-between">
                                  <span className="opacity-75">{detail.field}: "{detail.value}"</span>
                                  <Badge variant="secondary" className="text-xs ml-2">+{detail.score}</Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="mt-2 pt-2 border-t border-yellow-400/30">
                <strong>Tips:</strong> Lägg till fler tjänster i ROI-inställningar eller sätt <code className="px-1 py-0.5 bg-yellow-100 dark:bg-yellow-900 rounded">service_type</code> på bokningar för bättre matchning.
              </div>
            </AlertDescription>
          </Alert>
        )}

        {bookings.length > 0 && unmatchedBookings.length === 0 && servicePricing.length > 0 && (
          <Alert className="border-green-500/50 bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-900 dark:text-green-100">
              Alla bokningar matchades!
            </AlertTitle>
            <AlertDescription className="text-xs text-green-800 dark:text-green-200">
              {bookings.length} bokning(ar) matchades mot definierade tjänster med hög säkerhet.
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <div className="flex justify-between">
            <span>Totalt antal bokningar:</span>
            <strong>{bookings.length}</strong>
          </div>
          <div className="flex justify-between">
            <span>Definierade tjänster:</span>
            <strong>{servicePricing.length}</strong>
          </div>
          <div className="flex justify-between">
            <span>Matchade med hög säkerhet:</span>
            <strong className="text-green-600">
              {bookingRevenues.filter(r => r.confidence >= 70).length}
            </strong>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
