import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useHiemsAdmin } from "@/hooks/useHiemsAdmin";
import { availablePackages } from "@/components/dashboard/PackagesData";

export interface UserProduct {
  id: string;
  product_id: string;
  stripe_price_id: string;
  purchased_at: string;
  status: string;
  tier?: string;
  minutes_purchased?: number;
}

export const useUserProducts = () => {
  const { user } = useAuth();
  const { isHiemsAdmin: isAdmin, loading: adminLoading } = useHiemsAdmin();
  const [products, setProducts] = useState<string[]>([]);
  const [productDetails, setProductDetails] = useState<UserProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = async () => {
    if (!user) {
      setProducts([]);
      setProductDetails([]);
      setLoading(false);
      return;
    }

    // If admin, show all available packages as owned
    if (isAdmin) {
      const allProducts = availablePackages.map(pkg => pkg.id);
      const mockProductDetails: UserProduct[] = availablePackages.map(pkg => ({
        id: `admin-${pkg.id}`,
        product_id: pkg.id,
        stripe_price_id: 'admin_access',
        purchased_at: new Date().toISOString(),
        status: 'active',
        tier: 'enterprise',
        minutes_purchased: pkg.hasMinutes ? 10000 : undefined,
      }));
      
      setProducts(allProducts);
      setProductDetails(mockProductDetails);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('user_products')
        .select('*')
        .eq('status', 'active')
        .order('purchased_at', { ascending: false });

      if (fetchError) throw fetchError;

      const productIds = (data || []).map(p => p.product_id);
      setProducts(productIds);
      setProductDetails(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching user products:', err);
      setError(err as Error);
      setProducts([]);
      setProductDetails([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Wait for admin status to load before fetching products
    if (adminLoading) return;
    
    fetchProducts();

    // Set up realtime subscription (not needed for admins)
    if (user && !isAdmin) {
      const channel = supabase
        .channel('user_products_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_products',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchProducts();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, isAdmin, adminLoading]);

  const hasProduct = (productId: string) => products.includes(productId);

  return {
    products,
    productDetails,
    loading: loading || adminLoading,
    error,
    hasProduct,
    refetch: fetchProducts,
    isAdmin,
  };
};
