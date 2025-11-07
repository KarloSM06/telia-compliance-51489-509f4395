import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RequestStatusBadge } from './RequestStatusBadge';
import { RequestData, updateRequestStatus } from '@/hooks/useAdminRequests';
import { toast } from 'sonner';
import { useState } from 'react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface RequestDetailsModalProps {
  request: RequestData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function RequestDetailsModal({
  request,
  open,
  onOpenChange,
  onUpdate,
}: RequestDetailsModalProps) {
  const [status, setStatus] = useState<string>(request?.status || 'pending');
  const [updating, setUpdating] = useState(false);

  if (!request) return null;

  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      await updateRequestStatus(request.id, request.type, status);
      toast.success('Status uppdaterad');
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Kunde inte uppdatera status');
    } finally {
      setUpdating(false);
    }
  };

  const typeName = request.type === 'booking' ? 'Bokning' : 'AI-konsultation';
  
  const getSourceLabel = (source?: string) => {
    switch (source) {
      case 'enterprise_contact':
        return { label: 'Enterprise Kontakt', icon: '🏢', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' };
      case 'krono_quote':
        return { label: 'Krono AI-assistent', icon: '🤖', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' };
      case 'ai_consultation':
        return { label: 'AI-konsultation', icon: '🎯', color: 'bg-green-500/10 text-green-600 border-green-500/20' };
      case 'ai_consultation_detailed':
        return { label: 'AI-konsultation (Detaljerad)', icon: '🎯', color: 'bg-green-500/10 text-green-600 border-green-500/20' };
      default:
        return { label: 'Webbformulär', icon: '📄', color: 'bg-gray-500/10 text-gray-600 border-gray-500/20' };
    }
  };

  const sourceInfo = getSourceLabel(request.source);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 flex-wrap">
            <span>{request.name}</span>
            <Badge variant="outline">{typeName}</Badge>
            <Badge variant="secondary" className={sourceInfo.color}>
              <span className="mr-1">{sourceInfo.icon}</span>
              {sourceInfo.label}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Mottagen {format(new Date(request.created_at), 'PPP', { locale: sv })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Contact Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Kontaktinformation
            </h3>
            <div className="grid gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Namn</Label>
                <p className="font-medium">{request.name}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <p className="font-medium">{request.email}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Telefon</Label>
                <p className="font-medium">{request.phone}</p>
              </div>
              {request.company && (
                <div>
                  <Label className="text-xs text-muted-foreground">Företag</Label>
                  <p className="font-medium">{request.company}</p>
                </div>
              )}
            </div>
          </div>

          {/* Message/Description */}
          {request.message && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Meddelande
              </h3>
              <p className="text-sm leading-relaxed whitespace-pre-wrap bg-muted/50 p-4 rounded-lg">
                {request.message}
              </p>
            </div>
          )}

          {/* Type-specific data */}
          {request.type === 'booking' && request.raw_data && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Bokningsdetaljer
              </h3>
              <div className="grid gap-2 text-sm">
                {request.raw_data.bokningstyp && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Typ:</span>
                    <span className="font-medium">{request.raw_data.bokningstyp}</span>
                  </div>
                )}
                {request.raw_data.datum_tid && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Datum/Tid:</span>
                    <span className="font-medium">{request.raw_data.datum_tid}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {request.type === 'ai_consultation' && request.raw_data && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Detaljerad AI-Konsultation
              </h3>

              {/* Section 2: Goals & Vision */}
              {(request.raw_data.ai_goals || request.raw_data.success_definition) && (
                <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-sm">Mål & Vision</h4>
                  {request.raw_data.ai_goals && request.raw_data.ai_goals.length > 0 && (
                    <div>
                      <span className="text-xs text-muted-foreground">AI-mål:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {request.raw_data.ai_goals.map((goal: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {goal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {request.raw_data.success_definition && (
                    <div>
                      <span className="text-xs text-muted-foreground">Framgångsdefinition:</span>
                      <p className="text-sm mt-1">{request.raw_data.success_definition}</p>
                    </div>
                  )}
                  {request.raw_data.ai_priority && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Prioritet:</span>
                      <span className="font-medium">{request.raw_data.ai_priority}/5</span>
                    </div>
                  )}
                </div>
              )}

              {/* Section 3: Current Situation */}
              {(request.raw_data.manual_processes || request.raw_data.existing_ai || request.raw_data.current_systems) && (
                <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-sm">Nuvarande Situation</h4>
                  {request.raw_data.manual_processes && (
                    <div>
                      <span className="text-xs text-muted-foreground">Manuella processer:</span>
                      <p className="text-sm mt-1">{request.raw_data.manual_processes}</p>
                    </div>
                  )}
                  {request.raw_data.existing_ai && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Befintlig AI:</span>
                      <span className="font-medium">{request.raw_data.existing_ai}</span>
                    </div>
                  )}
                  {request.raw_data.current_systems && (
                    <div>
                      <span className="text-xs text-muted-foreground">Nuvarande system:</span>
                      <p className="text-sm mt-1">{request.raw_data.current_systems}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Section 4: Data */}
              {(request.raw_data.data_types || request.raw_data.historical_data || request.raw_data.data_quality || request.raw_data.gdpr_compliant) && (
                <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-sm">Data</h4>
                  {request.raw_data.data_types && request.raw_data.data_types.length > 0 && (
                    <div>
                      <span className="text-xs text-muted-foreground">Datatyper:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {request.raw_data.data_types.map((type: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {request.raw_data.historical_data && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Historisk data:</span>
                      <span className="font-medium">{request.raw_data.historical_data}</span>
                    </div>
                  )}
                  {request.raw_data.data_quality && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Datakvalitet:</span>
                      <span className="font-medium">{request.raw_data.data_quality}/5</span>
                    </div>
                  )}
                  {request.raw_data.gdpr_compliant && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">GDPR-efterlevnad:</span>
                      <span className="font-medium">{request.raw_data.gdpr_compliant}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Section 5: Resources & Budget */}
              {(request.raw_data.internal_resources || request.raw_data.budget || request.raw_data.timeframe) && (
                <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-sm">Resurser & Budget</h4>
                  {request.raw_data.internal_resources && request.raw_data.internal_resources.length > 0 && (
                    <div>
                      <span className="text-xs text-muted-foreground">Interna resurser:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {request.raw_data.internal_resources.map((resource: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {resource}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {request.raw_data.budget && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Budget:</span>
                      <span className="font-medium">{request.raw_data.budget}</span>
                    </div>
                  )}
                  {request.raw_data.timeframe && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tidsram:</span>
                      <span className="font-medium">{request.raw_data.timeframe}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Section 6: Users & Operations */}
              {(request.raw_data.ai_users || request.raw_data.training_needed) && (
                <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-sm">Användare & Drift</h4>
                  {request.raw_data.ai_users && request.raw_data.ai_users.length > 0 && (
                    <div>
                      <span className="text-xs text-muted-foreground">AI-användare:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {request.raw_data.ai_users.map((user: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {user}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {request.raw_data.training_needed && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Träning behövs:</span>
                      <span className="font-medium">{request.raw_data.training_needed}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Section 7: Risks & Limitations */}
              {(request.raw_data.regulatory_requirements || request.raw_data.sensitive_data || request.raw_data.ethical_limitations) && (
                <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-sm">Risker & Begränsningar</h4>
                  {request.raw_data.regulatory_requirements && (
                    <div>
                      <span className="text-xs text-muted-foreground">Regulatoriska krav:</span>
                      <p className="text-sm mt-1">{request.raw_data.regulatory_requirements}</p>
                    </div>
                  )}
                  {request.raw_data.sensitive_data && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Känslig data:</span>
                      <span className="font-medium">{request.raw_data.sensitive_data}</span>
                    </div>
                  )}
                  {request.raw_data.ethical_limitations && (
                    <div>
                      <span className="text-xs text-muted-foreground">Etiska begränsningar:</span>
                      <p className="text-sm mt-1">{request.raw_data.ethical_limitations}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Section 8: Future Vision */}
              {(request.raw_data.long_term_goals || request.raw_data.open_to_experiments) && (
                <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-sm">Framtidsvision</h4>
                  {request.raw_data.long_term_goals && (
                    <div>
                      <span className="text-xs text-muted-foreground">Långsiktiga mål:</span>
                      <p className="text-sm mt-1">{request.raw_data.long_term_goals}</p>
                    </div>
                  )}
                  {request.raw_data.open_to_experiments && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Öppen för experiment:</span>
                      <span className="font-medium">{request.raw_data.open_to_experiments}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Status Management */}
          {request.type === 'booking' && (
            <div className="space-y-3 pt-4 border-t">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Statushantering
              </h3>
              <div className="space-y-2">
                <Label htmlFor="status">Nuvarande status</Label>
                <div className="flex items-center gap-2">
                  <RequestStatusBadge status={request.status} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-status">Uppdatera status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="new-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Väntande</SelectItem>
                    <SelectItem value="contacted">Kontaktad</SelectItem>
                    <SelectItem value="closed">Stängd</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleUpdateStatus}
                disabled={updating || status === request.status}
                className="w-full"
              >
                {updating ? 'Uppdaterar...' : 'Spara status'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
