import { CallAnalysisSection } from "@/components/dashboard/CallAnalysisSection";
import { useUserProducts } from "@/hooks/useUserProducts";

const ThorPage = () => {
  const { productDetails } = useUserProducts();
  const complianceProduct = productDetails.find(p => p.product_id === 'thor');

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Bakgrundsgradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
      
      <div className="relative z-10 space-y-6">
        {complianceProduct?.tier && (
          <div className="mb-4">
            <p className="text-muted-foreground">
              Din plan: <span className="font-semibold capitalize">{complianceProduct.tier}</span>
            </p>
          </div>
        )}
        <CallAnalysisSection />
      </div>
    </div>
  );
};

export default ThorPage;