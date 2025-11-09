// Stub hook - cart removed from public site
export function useCart() {
  return {
    items: [],
    addItem: (item: any) => {},
    removeItem: (id: string) => {},
    clearCart: () => {},
  };
}
