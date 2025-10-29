import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useIntegrations } from "@/hooks/useIntegrations";
import { useTelephonySyncJobs } from "@/hooks/useTelephonySyncJobs";
import { Loader2, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";

export function SyncStatusDashboard() {
  const { integrations, isLoading: integrationsLoading } = useIntegrations();
  const { data: syncJobs, isLoading: syncJobsLoading } = useTelephonySyncJobs();

  if (integrationsLoading || syncJobsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const activeIntegrations = integrations?.filter(i => i.is_active) || [];
  
  // Group sync jobs by integration
  const syncJobsByIntegration = syncJobs?.reduce((acc, job) => {
    if (!acc[job.account_id]) {
      acc[job.account_id] = [];
    }
    acc[job.account_id].push(job);
    return acc;
  }, {} as Record<string, typeof syncJobs>);

  const getIntegrationStatus = (integration: any) => {
    const jobs = syncJobsByIntegration?.[integration.id] || [];
    const latestJob = jobs[0];

    if (!latestJob) {
      return { status: 'unknown', label: 'Okänd', color: 'secondary' };
    }

    if (latestJob.status === 'failed') {
      return { status: 'error', label: 'Fel', color: 'destructive' };
    }

    if (latestJob.status === 'running') {
      return { status: 'syncing', label: 'Synkar', color: 'default' };
    }

    if (latestJob.status === 'completed') {
      const hoursSinceSync = latestJob.completed_at 
        ? (Date.now() - new Date(latestJob.completed_at).getTime()) / (1000 * 60 * 60)
        : 999;

      if (hoursSinceSync > 24) {
        return { status: 'warning', label: 'Varning', color: 'outline' };
      }
      return { status: 'healthy', label: 'Healthy', color: 'default' };
    }

    return { status: 'unknown', label: 'Okänd', color: 'secondary' };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'syncing':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const failedJobs = syncJobs?.filter(j => j.status === 'failed') || [];
  const pendingJobs = syncJobs?.filter(j => j.status === 'pending') || [];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Aktiva Integrationer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeIntegrations.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Misslyckade Syncs (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {failedJobs.filter(j => {
                const hoursSince = j.created_at 
                  ? (Date.now() - new Date(j.created_at).getTime()) / (1000 * 60 * 60)
                  : 999;
                return hoursSince <= 24;
              }).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Väntande Jobb</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingJobs.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Failed Jobs Alert */}
      {failedJobs.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {failedJobs.length} misslyckade sync-jobb kräver åtgärd
          </AlertDescription>
        </Alert>
      )}

      {/* Integration Status List */}
      <Card>
        <CardHeader>
          <CardTitle>Integrations Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeIntegrations.map(integration => {
              const status = getIntegrationStatus(integration);
              const jobs = syncJobsByIntegration?.[integration.id] || [];
              const latestJob = jobs[0];

              return (
                <div key={integration.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(status.status)}
                    <div>
                      <p className="font-medium">{integration.provider}</p>
                      <p className="text-sm text-muted-foreground">
                        {integration.provider_type}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge variant={status.color as any}>{status.label}</Badge>
                    {latestJob?.completed_at && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Synkat {formatDistanceToNow(new Date(latestJob.completed_at), { 
                          addSuffix: true,
                          locale: sv 
                        })}
                      </p>
                    )}
                    {latestJob?.items_synced !== undefined && latestJob.items_synced > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {latestJob.items_synced} items
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            {activeIntegrations.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Inga aktiva integrationer
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Failed Jobs Details */}
      {failedJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Misslyckade Syncs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {failedJobs.slice(0, 5).map(job => (
                <div key={job.id} className="border-l-2 border-destructive pl-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{job.provider}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(job.created_at), { 
                        addSuffix: true,
                        locale: sv 
                      })}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">{job.job_type}</p>
                  {job.error_message && (
                    <p className="text-xs text-destructive mt-1">{job.error_message}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Försök: {job.retry_count}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
