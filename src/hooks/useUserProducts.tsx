import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

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
    fetchProducts();

    // Set up realtime subscription
    if (user) {
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
  }, [user]);

  const hasProduct = (productId: string) => products.includes(productId);

  return {
    products,
    productDetails,
    loading,
    error,
    hasProduct,
    refetch: fetchProducts,
  };
};
