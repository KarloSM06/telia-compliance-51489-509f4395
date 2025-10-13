import { useMemo } from "react";
import { useUserProducts } from "./useUserProducts";
import { useDashboardSummary } from "./useDashboardSummary";

interface Recommendation {
  type: 'upgrade' | 'cross-sell' | 'upsell';
  title: string;
  description: string;
  productId?: string;
  priority: number;
}

export const useProductRecommendations = () => {
  const { products, productDetails } = useUserProducts();
  const { summary } = useDashboardSummary();

  const recommendations = useMemo<Recommendation[]>(() => {
    const recs: Recommendation[] = [];

    // Check for high usage - recommend upgrade
    const thorProduct = productDetails.find(p => p.product_id === 'thor');
    if (thorProduct && summary) {
      const usagePercent = thorProduct.minutes_purchased 
        ? (summary.totalMinutesUsed / thorProduct.minutes_purchased) * 100 
        : 0;

      if (usagePercent > 80) {
        recs.push({
          type: 'upgrade',
          title: 'Du använder 89% av dina minuter',
          description: 'Uppgradera till nästa tier för fler minuter och spara 15%',
          productId: 'thor',
          priority: 1,
        });
      }
    }

    // Cross-sell Thor if they have Krono but not Thor
    if (products.includes('krono') && !products.includes('thor')) {
      recs.push({
        type: 'cross-sell',
        title: 'Baserat på din användning av Krono',
        description: 'Överväg Thor för att automatiskt analysera och förbättra samtalen',
        productId: 'thor',
        priority: 2,
      });
    }

    // Cross-sell Krono if they have Thor but not Krono
    if (products.includes('thor') && !products.includes('krono')) {
      recs.push({
        type: 'cross-sell',
        title: 'Baserat på din användning av Thor',
        description: 'Överväg Krono för att automatisera bokningar och minska manuellt arbete',
        productId: 'krono',
        priority: 2,
      });
    }

    // Suggest Gastro if they have Krono
    if (products.includes('krono') && !products.includes('gastro')) {
      recs.push({
        type: 'cross-sell',
        title: 'Perfekt för restaurangbranschen',
        description: 'Gastro ger dig specialiserad AI för restaurang och café med bordsbokning',
        productId: 'gastro',
        priority: 3,
      });
    }

    // If no products, recommend most popular
    if (products.length === 0) {
      recs.push({
        type: 'upsell',
        title: 'Kom igång med AI',
        description: 'Thor är vår mest populära produkt - börja analysera samtal idag',
        productId: 'thor',
        priority: 1,
      });
    }

    // If only 1 product, suggest complementary
    if (products.length === 1) {
      recs.push({
        type: 'upsell',
        title: 'Maximera din AI-investering',
        description: 'Kunder som använder flera produkter ser i genomsnitt 40% bättre ROI',
        priority: 2,
      });
    }

    // Sort by priority
    return recs.sort((a, b) => a.priority - b.priority);
  }, [products, productDetails, summary]);

  return {
    recommendations,
    hasRecommendations: recommendations.length > 0,
  };
};
