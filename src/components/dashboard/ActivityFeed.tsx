import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageSquare, Calendar, FileAudio, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Activity {
  id: string;
  type: 'call' | 'message' | 'booking' | 'analysis';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

export function ActivityFeed() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchActivities();
    }
  }, [user]);

  const fetchActivities = async () => {
    try {
      const allActivities: Activity[] = [];

      // Fetch recent call history
      const { data: callData } = await supabase
        .from('call_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (callData) {
        allActivities.push(...callData.map(call => ({
          id: call.id,
          type: 'call' as const,
          title: 'Samtal',
          description: `Samtal med ${call.caller || 'okänd'}`,
          timestamp: call.created_at,
          status: call.outcome,
        })));
      }

      // Fetch recent messages
      const { data: messageData } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (messageData) {
        allActivities.push(...messageData.map(msg => ({
          id: msg.id,
          type: 'message' as const,
          title: 'SMS',
          description: msg.direction === 'outbound' ? 'Skickat SMS' : 'Mottaget SMS',
          timestamp: msg.created_at,
        })));
      }

      // Fetch recent bookings
      const { data: bookingData } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (bookingData) {
        allActivities.push(...bookingData.map(booking => ({
          id: booking.id,
          type: 'booking' as const,
          title: 'Bokning',
          description: `${booking.kundnamn || 'Kund'} - ${booking.bokningstyp || 'Bokning'}`,
          timestamp: booking.created_at,
          status: booking.status,
        })));
      }

      // Fetch recent call analyses
      const { data: analysisData } = await supabase
        .from('calls')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (analysisData) {
        allActivities.push(...analysisData.map(call => ({
          id: call.id,
          type: 'analysis' as const,
          title: 'Samtalsanalys',
          description: call.file_name,
          timestamp: call.created_at,
          status: call.status,
        })));
      }

      // Sort all activities by timestamp
      allActivities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setActivities(allActivities.slice(0, 10));
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      case 'booking':
        return <Calendar className="h-4 w-4" />;
      case 'analysis':
        return <FileAudio className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'call':
        return 'bg-blue-100 text-blue-700';
      case 'message':
        return 'bg-green-100 text-green-700';
      case 'booking':
        return 'bg-purple-100 text-purple-700';
      case 'analysis':
        return 'bg-orange-100 text-orange-700';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just nu';
    if (diffMins < 60) return `${diffMins} min sedan`;
    if (diffHours < 24) return `${diffHours} h sedan`;
    if (diffDays < 7) return `${diffDays} dagar sedan`;
    return date.toLocaleDateString('sv-SE');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Senaste aktiviteter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Senaste aktiviteter
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Inga aktiviteter än</p>
            <p className="text-sm mt-2">Aktiviteter kommer att visas här när de sker</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
                <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">{activity.title}</p>
                    {activity.status && (
                      <Badge variant="secondary" className="text-xs">
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
