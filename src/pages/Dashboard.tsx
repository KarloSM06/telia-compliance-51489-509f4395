import { useAuth } from "@/hooks/useAuth";
import { useUserProducts } from "@/hooks/useUserProducts";
import { EmptyDashboard } from "@/components/dashboard/EmptyDashboard";
import { CallAnalysisSection } from "@/components/dashboard/CallAnalysisSection";

const Dashboard = () => {
  const { user } = useAuth();
  const { products, loading } = useUserProducts();

  const hasCompliancePackage = products.includes('ai-compliance');

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
    <div className="space-y-8">
      {/* Show AI Compliance & Coaching section if user owns it */}
      {hasCompliancePackage && <CallAnalysisSection />}
      
      {/* Future: Add other product sections here */}
      {/* {products.includes('ai-receptionist') && <ReceptionistSection />} */}
      {/* {products.includes('restaurant-cafe') && <RestaurantSection />} */}
    </div>
  );
};

export default Dashboard;
