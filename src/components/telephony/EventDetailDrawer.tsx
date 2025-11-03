import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Copy, Phone, Clock, DollarSign, User, MessageSquare, FileJson, FileText, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { formatDuration, formatCost, formatFullTimestamp, getProviderDisplayName, getDirectionLabel } from '@/lib/telephonyFormatters';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ConversationViewer } from './ConversationViewer';
import { CostBreakdownCard } from './CostBreakdownCard';
import hiemsLogoSnowflake from '@/assets/hiems-logo-snowflake.png';

interface EventDetailDrawerProps {
  event: any;
  open: boolean;
  onClose: () => void;
}

export const EventDetailDrawer = ({ event, open, onClose }: EventDetailDrawerProps) => {
  const [showMetadata, setShowMetadata] = useState(false);

  if (!event) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} kopierad`);
  };

  const conversation = event.normalized?.conversation || event.normalized?.messages || [];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className={cn(
        "w-full sm:max-w-2xl overflow-y-auto",
        "bg-gradient-to-br from-background via-background to-background/95"
      )}>
        {/* Snowflake in drawer */}
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] opacity-[0.02] pointer-events-none">
          <img 
            src={hiemsLogoSnowflake} 
            alt="" 
            className="w-full h-full object-contain animate-[spin_60s_linear_infinite]"
          />
        </div>
        
        <SheetHeader className="relative">
          <SheetTitle className="text-2xl flex items-center gap-2">
            <Phone className="h-6 w-6 text-primary" />
            Event Details
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-full pb-6">
          <div className="space-y-4 mt-6 relative">
            {/* Tabs för bättre organisation */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Översikt</TabsTrigger>
                <TabsTrigger value="technical">Tekniskt</TabsTrigger>
                <TabsTrigger value="costs">Kostnader</TabsTrigger>
                <TabsTrigger value="conversation">Samtal</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Header Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="text-sm">
                  {getProviderDisplayName(event.provider)}
                </Badge>
                <Badge variant="outline">{event.event_type}</Badge>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">{getDirectionLabel(event.direction)}</span>
              </div>
            </div>

            {/* Phone Number */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Från:</span>
                    <span className="font-mono text-sm">{event.from_number || '-'}</span>
                  </div>
                  {event.from_number && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(event.from_number, 'Telefonnummer')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Längd</p>
                      <p className="text-lg font-semibold">
                        {formatDuration(event.duration_seconds)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Kostnad</p>
                      <p className="text-lg font-semibold">
                        {formatCost(event.aggregate_cost_amount || event.cost_amount, event.cost_currency)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status & Timestamp */}
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge>{event.status || 'Okänd'}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tidstämpel:</span>
                  <span className="text-sm font-mono">
                    {formatFullTimestamp(event.event_timestamp)}
                  </span>
                </div>
              </CardContent>
            </Card>

              </TabsContent>
              
              <TabsContent value="technical" className="space-y-4 mt-4">

            {/* Analysis Summary */}
            {event.normalized?.analysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Call Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Summary</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.normalized.analysis.summary}
                    </p>
                  </div>
                  {event.normalized.analysis.successEvaluation && (
                    <div>
                      <Label className="text-sm font-medium">Success</Label>
                      <Badge variant={event.normalized.analysis.successEvaluation === 'true' ? 'default' : 'secondary'} className="ml-2">
                        {event.normalized.analysis.successEvaluation}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Transcript */}
            {event.normalized?.transcript && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Transcript
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm whitespace-pre-wrap text-muted-foreground">
                    {event.normalized.transcript}
                  </pre>
                </CardContent>
              </Card>
            )}

            {/* Duration & Cost from normalized data */}
            {(event.normalized?.duration || event.normalized?.cost) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Call Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {event.normalized.duration?.minutes && (
                    <div className="flex justify-between">
                      <span className="text-sm">Duration:</span>
                      <span className="text-sm font-medium">{event.normalized.duration.minutes.toFixed(2)} min</span>
                    </div>
                  )}
                  {event.normalized.cost?.total && (
                    <div className="flex justify-between">
                      <span className="text-sm">Cost:</span>
                      <span className="text-sm font-medium">${event.normalized.cost.total.toFixed(4)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Recordings */}
            {event.normalized?.recordings && (event.normalized.recordings.mono || event.normalized.recordings.stereo) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Recordings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {event.normalized.recordings.mono && (
                    <a 
                      href={event.normalized.recordings.mono} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Mono Recording
                    </a>
                  )}
                  {event.normalized.recordings.stereo && (
                    <a 
                      href={event.normalized.recordings.stereo} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Stereo Recording
                    </a>
                  )}
                </CardContent>
              </Card>
            )}

                {/* Agent Info */}
                {event.agent_id && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Agent:</span>
                        </div>
                        <span className="text-sm font-mono">{event.agent_id.slice(0, 16)}...</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Metadata */}
                <Card>
                  <CardContent className="p-4">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setShowMetadata(!showMetadata)}
                    >
                      <FileJson className="h-4 w-4 mr-2" />
                      {showMetadata ? 'Dölj' : 'Visa'} Metadata
                    </Button>
                    {showMetadata && (
                      <pre className="mt-3 text-xs bg-muted p-3 rounded overflow-x-auto max-h-[300px]">
                        {JSON.stringify(event.normalized || event, null, 2)}
                      </pre>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="costs" className="space-y-4 mt-4">
                {/* Cost Breakdown */}
                {(event.cost_breakdown || event.aggregate_cost_amount) && (
                  <CostBreakdownCard event={event} />
                )}
                
                {/* Duration & Cost from normalized data */}
                {(event.normalized?.duration || event.normalized?.cost) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Call Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {event.normalized.duration?.minutes && (
                        <div className="flex justify-between">
                          <span className="text-sm">Duration:</span>
                          <span className="text-sm font-medium">{event.normalized.duration.minutes.toFixed(2)} min</span>
                        </div>
                      )}
                      {event.normalized.cost?.total && (
                        <div className="flex justify-between">
                          <span className="text-sm">Cost:</span>
                          <span className="text-sm font-medium">${event.normalized.cost.total.toFixed(4)}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="conversation" className="space-y-4 mt-4">

                {/* Analysis Summary */}
                {event.normalized?.analysis && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Call Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Summary</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.normalized.analysis.summary}
                        </p>
                      </div>
                      {event.normalized.analysis.successEvaluation && (
                        <div>
                          <Label className="text-sm font-medium">Success</Label>
                          <Badge variant={event.normalized.analysis.successEvaluation === 'true' ? 'default' : 'secondary'} className="ml-2">
                            {event.normalized.analysis.successEvaluation}
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
                
                {/* Transcript */}
                {event.normalized?.transcript && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Transcript
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-sm whitespace-pre-wrap text-muted-foreground">
                        {event.normalized.transcript}
                      </pre>
                    </CardContent>
                  </Card>
                )}
                
                {/* Conversation */}
                {conversation.length > 0 && <ConversationViewer event={event} />}

                {/* Recording URL */}
                {event.recording_url && (
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-2">Inspelning:</p>
                      <audio controls className="w-full">
                        <source src={event.recording_url} type="audio/mpeg" />
                        Din webbläsare stöder inte audio element.
                      </audio>
                    </CardContent>
                  </Card>
                )}
                
                {/* Recordings */}
                {event.normalized?.recordings && (event.normalized.recordings.mono || event.normalized.recordings.stereo) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        Recordings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {event.normalized.recordings.mono && (
                        <a 
                          href={event.normalized.recordings.mono} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Mono Recording
                        </a>
                      )}
                      {event.normalized.recordings.stereo && (
                        <a 
                          href={event.normalized.recordings.stereo} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Stereo Recording
                        </a>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
