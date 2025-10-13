import { useAuth } from "@/hooks/useAuth";
import { useUserProducts } from "@/hooks/useUserProducts";
import { EmptyDashboard } from "@/components/dashboard/EmptyDashboard";
import { CallAnalysisSection } from "@/components/dashboard/CallAnalysisSection";

const Dashboard = () => {
  const { user } = useAuth();
  const { products, productDetails, loading } = useUserProducts();

  const hasCompliancePackage = products.includes('thor');
  const complianceProduct = productDetails.find(p => p.product_id === 'thor');

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
      {hasCompliancePackage && (
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold">AI Compliance & Coaching</h2>
            {complianceProduct?.tier && (
              <p className="text-muted-foreground">
                Din plan: <span className="font-semibold capitalize">{complianceProduct.tier}</span>
              </p>
            )}
          </div>
          <CallAnalysisSection />
        </div>
      )}
      
      {/* Future: Add other product sections here based on product_id */}
      {/* {products.includes('krono') && <KronoSection />} */}
      {/* {products.includes('gastro') && <GastroSection />} */}
    </div>
  );
};

export default Dashboard;
