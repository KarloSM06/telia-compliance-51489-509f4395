import { CallAnalysisSection } from "@/components/dashboard/CallAnalysisSection";
import { useUserProducts } from "@/hooks/useUserProducts";

const ThorPage = () => {
  const { productDetails } = useUserProducts();
  const complianceProduct = productDetails.find(p => p.product_id === 'thor');

  return (
    <div className="animate-fade-in space-y-6">
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
  );
};

export default ThorPage;