import { useAuth } from "@/hooks/useAuth";
import { useUserProducts } from "@/hooks/useUserProducts";
import { EmptyDashboard } from "@/components/dashboard/EmptyDashboard";
import { CallAnalysisSection } from "@/components/dashboard/CallAnalysisSection";
import { ProductOverview } from "@/components/dashboard/ProductOverview";
import { KronoSection } from "@/components/dashboard/KronoSection";
import { GastroSection } from "@/components/dashboard/GastroSection";
import { TalentSection } from "@/components/dashboard/TalentSection";
import { LeadSection } from "@/components/dashboard/LeadSection";
import { EkoSection } from "@/components/dashboard/EkoSection";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const Dashboard = () => {
  const {
    user
  } = useAuth();
  const {
    products,
    productDetails,
    loading
  } = useUserProducts();
  const hasCompliancePackage = products.includes('thor');
  const hasKronoPackage = products.includes('krono');
  const hasGastroPackage = products.includes('gastro');
  const hasTalentPackage = products.includes('talent');
  const hasLeadPackage = products.includes('lead');
  const hasEkoPackage = products.includes('eko');
  const complianceProduct = productDetails.find(p => p.product_id === 'thor');
  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Laddar dashboard...</p>
        </div>
      </div>;
  }

  // Show empty dashboard if user has no products
  if (products.length === 0) {
    return <EmptyDashboard />;
  }
  return <div className="space-y-8 animate-fade-in">
      {/* Product Overview */}
      <div className="animate-scale-in">
        <ProductOverview />
      </div>

      {/* Main Content - Product Sections */}
      <div className="space-y-8">
        {hasCompliancePackage && <CallAnalysisSection />}
        {hasKronoPackage && <KronoSection />}
        {hasGastroPackage && <GastroSection />}
        {hasTalentPackage && <TalentSection />}
        {hasLeadPackage && <LeadSection />}
        {hasEkoPackage && <EkoSection />}
      </div>
    </div>;
};

export default Dashboard;