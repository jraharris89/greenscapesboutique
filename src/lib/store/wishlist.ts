import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WishlistItem } from "@/types";

interface WishlistState {
  items: WishlistItem[];

  // Actions
  addItem: (productId: string, notifyOnRestock?: boolean) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  updateNotifyOnRestock: (productId: string, notify: boolean) => void;
  clearWishlist: () => void;

  // Computed
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId: string, notifyOnRestock = false) => {
        const { items, isInWishlist } = get();

        if (isInWishlist(productId)) return;

        set({
          items: [
            ...items,
            {
              productId,
              addedAt: new Date().toISOString(),
              notifyOnRestock,
            },
          ],
        });
      },

      removeItem: (productId: string) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        });
      },

      toggleItem: (productId: string) => {
        const { isInWishlist, addItem, removeItem } = get();

        if (isInWishlist(productId)) {
          removeItem(productId);
        } else {
          addItem(productId);
        }
      },

      updateNotifyOnRestock: (productId: string, notify: boolean) => {
        set({
          items: get().items.map((item) =>
            item.productId === productId
              ? { ...item, notifyOnRestock: notify }
              : item
          ),
        });
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      isInWishlist: (productId: string) => {
        return get().items.some((item) => item.productId === productId);
      },
    }),
    {
      name: "greenscapes-wishlist",
    }
  )
);
