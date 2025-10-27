import { useAuth } from "@/hooks/useAuth";
import { useUserProducts } from "@/hooks/useUserProducts";
import { EmptyDashboard } from "@/components/dashboard/EmptyDashboard";
import { ProductOverview } from "@/components/dashboard/ProductOverview";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { UpcomingBookings } from "@/components/dashboard/UpcomingBookings";
import { RecentMessages } from "@/components/dashboard/RecentMessages";
import { RecentReviews } from "@/components/dashboard/RecentReviews";

const Dashboard = () => {
  const { user } = useAuth();
  const { products, productDetails, loading } = useUserProducts();

  if (loading) {
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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Product Overview */}
      <div className="animate-scale-in">
        <ProductOverview />
      </div>

      {/* Stats Overview */}
      <StatsOverview />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <ActivityFeed />
          <UpcomingBookings />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <RecentMessages />
          <RecentReviews />
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
};

export default Dashboard;