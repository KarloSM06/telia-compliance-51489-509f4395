import { useAuth } from "@/hooks/useAuth";
import { useUserProducts } from "@/hooks/useUserProducts";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, TrendingUp, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { EmptyDashboard } from "@/components/dashboard/EmptyDashboard";
import { ROIHeroSection } from "@/components/dashboard/ROIHeroSection";
import { EnhancedActivityFeed } from "@/components/dashboard/EnhancedActivityFeed";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { UpcomingBookings } from "@/components/dashboard/UpcomingBookings";
import { RecentMessages } from "@/components/dashboard/RecentMessages";
import { RecentReviews } from "@/components/dashboard/RecentReviews";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { Activity } from "@/hooks/useAllActivities";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { StatCard } from "@/components/dashboard/charts/StatCard";
import { MessageSquare, Phone, Calendar as CalendarIcon, Star } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { products, productDetails, loading: productsLoading } = useUserProducts();
  const { data: analyticsData, loading: analyticsLoading } = useAnalyticsData();
  const navigate = useNavigate();

  const handleActivityClick = (activity: Activity) => {
    switch (activity.sourceTable) {
      case 'telephony_events':
        navigate('/dashboard/telephony', { 
          state: { 
            openEventId: activity.id,
            scrollToEvent: true 
          } 
        });
        break;
        
      case 'message_logs':
        if (activity.type === 'sms') {
          navigate('/dashboard/sms', { 
            state: { openMessageId: activity.id } 
          });
        } else {
          navigate('/dashboard/email', { 
            state: { openMessageId: activity.id } 
          });
        }
        break;
        
      case 'calendar_events':
        navigate('/dashboard/calendar', { 
          state: { 
            openEventId: activity.id,
            date: format(new Date(activity.metadata.start_time), 'yyyy-MM-dd')
          } 
        });
        break;
        
      case 'reviews':
        navigate('/dashboard/reviews', { 
          state: { openReviewId: activity.id } 
        });
        break;
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (productsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Laddar dashboard...</p>
        </div>
      </div>
    );
  }

  // Show empty dashboard if user has no products
  if (products.length === 0) {
    return <EmptyDashboard />;
  }

  // Calculate quick stats
  const newBookings = analyticsData?.bookings.length || 0;
  const totalMessages = analyticsData?.messages.length || 0;
  const totalCalls = analyticsData?.telephony.length || 0;
  const totalReviews = analyticsData?.reviews.length || 0;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Din centrala hub för all affärsaktivitet
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Uppdatera
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard/analytics">
              <TrendingUp className="h-4 w-4 mr-2" />
              Full Analytics
            </Link>
          </Button>
        </div>
      </div>

      {/* ROI HERO SECTION */}
      <ROIHeroSection data={analyticsData} loading={analyticsLoading} />

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Nya Bokningar"
          value={newBookings}
          icon={<CalendarIcon className="h-5 w-5" />}
        />
        <StatCard
          title="Samtal"
          value={totalCalls}
          icon={<Phone className="h-5 w-5" />}
        />
        <StatCard
          title="Meddelanden"
          value={totalMessages}
          icon={<MessageSquare className="h-5 w-5" />}
        />
        <StatCard
          title="Recensioner"
          value={totalReviews}
          icon={<Star className="h-5 w-5" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Activity (klickbar) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Senaste Händelser
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EnhancedActivityFeed onActivityClick={handleActivityClick} limit={15} />
          </CardContent>
        </Card>

        {/* Right: Quick Actions & Upcoming */}
        <div className="space-y-6">
          <QuickActions />
          <UpcomingBookings />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentMessages />
        <RecentReviews />
      </div>
    </div>
  );
};

export default Dashboard;