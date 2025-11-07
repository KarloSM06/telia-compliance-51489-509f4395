import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useHiemsAdmin } from '@/hooks/useHiemsAdmin';
import { useAdminRequests, RequestData } from '@/hooks/useAdminRequests';
import { RequestsTable } from '@/components/admin/RequestsTable';
import { RequestFilters } from '@/components/admin/RequestFilters';
import { RequestDetailsModal } from '@/components/admin/RequestDetailsModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Download, ShieldCheck, Inbox } from 'lucide-react';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import hiemsLogoSnowflake from '@/assets/hiems-logo-snowflake.png';

export default function AdminRequests() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { isHiemsAdmin, loading: adminLoading } = useHiemsAdmin();
  
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: '',
  });

  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const { data: requests = [], isLoading, refetch } = useAdminRequests(filters);

  // Refetch when admin status is confirmed
  useEffect(() => {
    if (isHiemsAdmin) {
      refetch();
    }
  }, [isHiemsAdmin, refetch]);

  const handleViewDetails = (request: RequestData) => {
    setSelectedRequest(request);
    setDetailsModalOpen(true);
  };

  const handleExport = () => {
    const csvContent = [
      ['Typ', 'Namn', 'Företag', 'Email', 'Telefon', 'Status', 'Skapad'].join(','),
      ...requests.map((req) =>
        [
          req.type === 'booking' ? 'Bokning' : 'AI-konsultation',
          req.name,
          req.company || '',
          req.email,
          req.phone,
          req.status,
          req.created_at,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `förfrågningar-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Export klar');
  };

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  // Show loading while checking admin status
  if (adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Redirect if not admin
  if (!isHiemsAdmin) {
    toast.error('Åtkomst nekad', {
      description: 'Du har inte behörighet att se denna sida.',
    });
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
        {/* Radial gradient overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
        
        {/* Snowflakes */}
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] opacity-5 pointer-events-none">
          <img
            src={hiemsLogoSnowflake}
            alt=""
            className="w-full h-full object-contain animate-[spin_60s_linear_infinite]"
          />
        </div>
        <div className="absolute -top-20 -left-20 w-[450px] h-[450px] opacity-[0.03] pointer-events-none">
          <img
            src={hiemsLogoSnowflake}
            alt=""
            className="w-full h-full object-contain animate-[spin_40s_linear_infinite_reverse]"
          />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-block">
                <span className="text-sm font-semibold tracking-wider text-primary uppercase">
                  Kundhantering
                </span>
                <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50 mt-2" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Förfrågningar
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Hantera AI-konsultationer från kunder
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Quick Actions Bar */}
      <section className="relative py-8 border-y border-primary/10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={100}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
                  <ShieldCheck className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
                    Admin Access
                  </span>
                </div>
                {session?.user?.email && (
                  <div className="text-sm text-muted-foreground">
                    Inloggad som: <span className="font-medium">{session.user.email}</span>
                  </div>
                )}
                <Badge variant="outline">
                  {requests.length} totalt
                </Badge>
                {pendingCount > 0 && (
                  <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                    <Inbox className="h-3 w-3 mr-1" />
                    {pendingCount} väntande
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={() => refetch()} variant="outline" size="sm">
                  Uppdatera
                </Button>
                <Button onClick={handleExport} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportera
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Filters Section */}
      <section className="container mx-auto px-6 lg:px-8 py-8">
        <RequestFilters filters={filters} onFilterChange={setFilters} />
      </section>

      {/* Requests Table */}
      <section className="container mx-auto px-6 lg:px-8 pb-16">
        <RequestsTable
          requests={requests}
          loading={isLoading}
          onViewDetails={handleViewDetails}
        />
      </section>

      {/* Details Modal */}
      <RequestDetailsModal
        request={selectedRequest}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        onUpdate={refetch}
      />
    </div>
  );
}
