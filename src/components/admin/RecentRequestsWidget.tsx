import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RequestStatusBadge } from './RequestStatusBadge';
import { Inbox, ExternalLink, Building2, Phone } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useAdminRequests } from '@/hooks/useAdminRequests';

export function RecentRequestsWidget() {
  const navigate = useNavigate();
  const { data: allRequests = [], isLoading } = useAdminRequests();
  
  // Get the 5 most recent requests
  const recentRequests = allRequests.slice(0, 5);
  const pendingCount = allRequests.filter((r) => r.status === 'pending').length;

  const getSourceIcon = (source?: string) => {
    switch (source) {
      case 'enterprise_contact':
        return '🏢';
      case 'krono_quote':
        return '🤖';
      case 'ai_consultation':
        return '🎯';
      default:
        return '📄';
    }
  };

  const getSourceLabel = (source?: string) => {
    switch (source) {
      case 'enterprise_contact':
        return 'Enterprise Kontakt';
      case 'krono_quote':
        return 'Krono AI';
      case 'ai_consultation':
        return 'AI-konsultation';
      default:
        return 'Webb';
    }
  };

  if (isLoading) {
    return (
      <Card className="hover-scale transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Inbox className="h-5 w-5" />
            Senaste Förfrågningar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover-scale transition-all">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Inbox className="h-5 w-5" />
              Senaste Förfrågningar
            </CardTitle>
            <CardDescription>
              De 5 senaste förfrågningarna från kunder
            </CardDescription>
          </div>
          {pendingCount > 0 && (
            <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
              {pendingCount} väntande
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {recentRequests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Inbox className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Inga förfrågningar ännu</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentRequests.map((request) => (
              <div
                key={`${request.type}-${request.id}`}
                className="p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors border border-border/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg" title={getSourceLabel(request.source)}>
                        {getSourceIcon(request.source)}
                      </span>
                      <p className="font-medium truncate">{request.name}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {request.company && (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {request.company}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {request.phone}
                      </span>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(new Date(request.created_at), {
                          addSuffix: true,
                          locale: sv,
                        })}
                      </span>
                    </div>
                  </div>
                  <RequestStatusBadge status={request.status} />
                </div>
              </div>
            ))}
          </div>
        )}
        
        <Button
          onClick={() => navigate('/dashboard/admin/requests')}
          variant="outline"
          className="w-full mt-4"
        >
          Visa alla förfrågningar
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}