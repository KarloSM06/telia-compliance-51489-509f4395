import { useState, useEffect } from "react";
import { CartItem } from "@/components/cart/ShoppingCart";

const CART_STORAGE_KEY = "hiems-cart";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems(prev => [...prev, item]);
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter((_, index) => 
      index !== prev.findIndex(item => item.productId === productId)
    ));
  };

  const clearCart = () => {
    setItems([]);
  };

  return {
    items,
    addItem,
    removeItem,
    clearCart,
  };
}
