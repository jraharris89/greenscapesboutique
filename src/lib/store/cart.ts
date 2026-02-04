import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  itemCount: number;
  subtotal: number;

  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Computed
  getItem: (productId: string) => CartItem | undefined;
  isInCart: (productId: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      subtotal: 0,

      addItem: (product: Product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find((item) => item.productId === product.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [...items, { productId: product.id, product, quantity }],
          });
        }

        // Update computed values
        const newItems = get().items;
        set({
          itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
          subtotal: newItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          ),
        });

        // Track analytics event
        if (typeof window !== "undefined" && window.fbq) {
          window.fbq("track", "AddToCart", {
            content_ids: [product.id],
            content_name: product.name,
            content_type: "product",
            value: product.price,
            currency: "USD",
          });
        }
      },

      removeItem: (productId: string) => {
        const { items } = get();
        const newItems = items.filter((item) => item.productId !== productId);

        set({
          items: newItems,
          itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
          subtotal: newItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          ),
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }

        const { items } = get();
        const newItems = items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );

        set({
          items: newItems,
          itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
          subtotal: newItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          ),
        });
      },

      clearCart: () => {
        set({
          items: [],
          itemCount: 0,
          subtotal: 0,
        });
      },

      getItem: (productId: string) => {
        return get().items.find((item) => item.productId === productId);
      },

      isInCart: (productId: string) => {
        return get().items.some((item) => item.productId === productId);
      },
    }),
    {
      name: "greenscapes-cart",
      partialize: (state) => ({
        items: state.items,
        itemCount: state.itemCount,
        subtotal: state.subtotal,
      }),
    }
  )
);

// Type augmentation for Meta Pixel
declare global {
  interface Window {
    fbq?: (
      track: string,
      event: string,
      params?: Record<string, unknown>
    ) => void;
  }
}
