import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Phone, 
  MessageSquare, 
  Calendar, 
  Settings, 
  Trash, 
  TestTube,
  Video,
  Mail,
  Radio,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Integration } from '@/hooks/useIntegrations';
import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';

interface IntegrationCardProps {
  integration: Integration;
  onEdit: (integration: Integration) => void;
  onDelete: (id: string) => void;
  onTest: (integration: Integration) => void;
  onToggle: (id: string, isActive: boolean) => void;
}

const CAPABILITY_ICONS: Record<string, React.ReactNode> = {
  voice: <Phone className="h-4 w-4" />,
  sms: <MessageSquare className="h-4 w-4" />,
  mms: <Mail className="h-4 w-4" />,
  video: <Video className="h-4 w-4" />,
  calendar_sync: <Calendar className="h-4 w-4" />,
  ai_agent: <Radio className="h-4 w-4" />,
};

const CAPABILITY_LABELS: Record<string, string> = {
  voice: 'Röstsamtal',
  sms: 'SMS',
  mms: 'MMS',
  video: 'Video',
  fax: 'Fax',
  calendar_sync: 'Kalendersynk',
  booking: 'Bokning',
  ai_agent: 'AI-agent',
  number_management: 'Nummerhantering',
  event_management: 'Event-hantering',
  payment: 'Betalning',
  realtime_streaming: 'Realtidsströmning',
};

const PROVIDER_LOGOS: Record<string, string> = {
  twilio: '/images/logos/twilio.png',
  telnyx: '/images/logos/telnyx.png',
  vapi: '/images/logos/vapi.png',
  retell: '/images/logos/retell.png',
};

export const IntegrationCard = ({ 
  integration, 
  onEdit, 
  onDelete, 
  onTest, 
  onToggle 
}: IntegrationCardProps) => {
  const getUsedBy = () => {
    const uses: string[] = [];
    if (integration.capabilities.includes('voice')) uses.push('Telefoni Dashboard');
    if (integration.capabilities.includes('sms')) uses.push('SMS-notiser');
    if (integration.capabilities.includes('calendar_sync')) uses.push('Kalender');
    return uses;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          {PROVIDER_LOGOS[integration.provider] && (
            <img 
              src={PROVIDER_LOGOS[integration.provider]} 
              alt={integration.provider}
              className="h-8 w-8 object-contain"
            />
          )}
          <div>
            <h3 className="font-semibold">{integration.provider_display_name}</h3>
            <p className="text-sm text-muted-foreground capitalize">{integration.provider}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={integration.is_active}
            onCheckedChange={(checked) => onToggle(integration.id, checked)}
          />
          <Badge variant={integration.is_active ? 'default' : 'secondary'}>
            {integration.is_active ? 'Aktiv' : 'Inaktiv'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Capabilities */}
        <div>
          <p className="text-sm font-medium mb-2">Funktioner</p>
          <div className="flex flex-wrap gap-2">
            {integration.capabilities.map(cap => (
              <Badge key={cap} variant="outline" className="flex items-center gap-1">
                {CAPABILITY_ICONS[cap]}
                {CAPABILITY_LABELS[cap] || cap}
              </Badge>
            ))}
          </div>
        </div>

        {/* Used by */}
        <div>
          <p className="text-sm font-medium mb-2">Används av</p>
          <div className="space-y-1">
            {getUsedBy().map(use => (
              <p key={use} className="text-sm text-muted-foreground">• {use}</p>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="flex items-center gap-2">
            {integration.is_verified ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm">{integration.is_verified ? 'Verifierad' : 'Ej verifierad'}</span>
          </div>
          {integration.last_used_at && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(integration.last_used_at), { 
                  addSuffix: true,
                  locale: sv 
                })}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(integration)}>
          <Settings className="h-4 w-4 mr-1" />
          Inställningar
        </Button>
        <Button variant="outline" size="sm" onClick={() => onTest(integration)}>
          <TestTube className="h-4 w-4 mr-1" />
          Testa
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => onDelete(integration.id)}
          className="ml-auto"
        >
          <Trash className="h-4 w-4 mr-1" />
          Ta bort
        </Button>
      </CardFooter>
    </Card>
  );
};
