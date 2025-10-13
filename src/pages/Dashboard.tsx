import { useAuth } from "@/hooks/useAuth";
import { useUserProducts } from "@/hooks/useUserProducts";
import { EmptyDashboard } from "@/components/dashboard/EmptyDashboard";
import { CallAnalysisSection } from "@/components/dashboard/CallAnalysisSection";
import { ProductOverview } from "@/components/dashboard/ProductOverview";
import { KronoSection } from "@/components/dashboard/KronoSection";
import { GastroSection } from "@/components/dashboard/GastroSection";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const { user } = useAuth();
  const { products, productDetails, loading } = useUserProducts();

  const hasCompliancePackage = products.includes('thor');
  const hasKronoPackage = products.includes('krono');
  const hasGastroPackage = products.includes('gastro');
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
    <div className="space-y-8 animate-fade-in">
      {/* Product Overview */}
      <div className="animate-scale-in">
        <ProductOverview />
      </div>

      {/* Main Content - Tabs for different products */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4 animate-slide-in-right">
          <TabsTrigger value="overview" className="hover-scale">Översikt</TabsTrigger>
          {hasKronoPackage && <TabsTrigger value="krono" className="hover-scale">Krono</TabsTrigger>}
          {hasGastroPackage && <TabsTrigger value="gastro" className="hover-scale">Gastro</TabsTrigger>}
          {hasCompliancePackage && <TabsTrigger value="thor" className="hover-scale">Thor</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-enter">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 animate-scale-in">
              <QuickActions />
            </div>
            <div className="lg:col-span-1 animate-scale-in" style={{ animationDelay: '100ms' }}>
              <ActivityFeed />
            </div>
          </div>
        </TabsContent>

        {hasKronoPackage && (
          <TabsContent value="krono" className="animate-enter">
            <KronoSection />
          </TabsContent>
        )}

        {hasGastroPackage && (
          <TabsContent value="gastro" className="animate-enter">
            <GastroSection />
          </TabsContent>
        )}

        {hasCompliancePackage && (
          <TabsContent value="thor" className="animate-enter">
            <div>
              <div className="mb-4 animate-fade-in">
                <h2 className="text-2xl font-bold">AI Compliance & Coaching</h2>
                {complianceProduct?.tier && (
                  <p className="text-muted-foreground">
                    Din plan: <span className="font-semibold capitalize">{complianceProduct.tier}</span>
                  </p>
                )}
              </div>
              <div className="animate-scale-in" style={{ animationDelay: '100ms' }}>
                <CallAnalysisSection />
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Dashboard;
