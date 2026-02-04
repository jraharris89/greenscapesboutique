"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ArrowRight, ShoppingBag, Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui";
import { ProductCard } from "@/components/products/ProductCard";
import { useWishlistStore } from "@/lib/store/wishlist";
import { getMockProductById } from "@/data/mockProducts";
import type { Product } from "@/types";

export default function WishlistPage() {
  const { items, removeItem, updateNotifyOnRestock, clearWishlist } =
    useWishlistStore();
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Fetch products for wishlist items
    // In production, this would be an API call
    const wishlistProducts = items
      .map((item) => getMockProductById(item.productId))
      .filter((p): p is Product => p !== undefined);
    setProducts(wishlistProducts);
  }, [items]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-sage-50 flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-sage-50">
        <div className="container-custom py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 text-sage-400" />
            </div>
            <h1 className="font-serif text-3xl text-sage-900 mb-4">
              Your wishlist is empty
            </h1>
            <p className="text-sage-600 mb-8">
              Save plants you love to your wishlist so you can easily find them
              later. We&apos;ll even notify you when out-of-stock items come
              back!
            </p>
            <Link href="/products">
              <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                Browse Plants
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage-50">
      <div className="container-custom py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-sage-900">
              My Wishlist
            </h1>
            <p className="text-sage-600 mt-1">
              {items.length} {items.length === 1 ? "plant" : "plants"} saved
            </p>
          </div>
          <button
            onClick={clearWishlist}
            className="text-sm text-sage-500 hover:text-sage-700 underline"
          >
            Clear wishlist
          </button>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => {
            const wishlistItem = items.find(
              (item) => item.productId === product.id
            );

            return (
              <div key={product.id} className="relative">
                <ProductCard product={product} />

                {/* Restock notification toggle */}
                {!product.inStock && wishlistItem && (
                  <div className="absolute bottom-16 left-4 right-4">
                    <button
                      onClick={() =>
                        updateNotifyOnRestock(
                          product.id,
                          !wishlistItem.notifyOnRestock
                        )
                      }
                      className={`
                        w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                        ${
                          wishlistItem.notifyOnRestock
                            ? "bg-moss-100 text-moss-700"
                            : "bg-sage-100 text-sage-700 hover:bg-sage-200"
                        }
                      `}
                    >
                      {wishlistItem.notifyOnRestock ? (
                        <>
                          <Bell className="h-4 w-4" />
                          Notification On
                        </>
                      ) : (
                        <>
                          <BellOff className="h-4 w-4" />
                          Notify Me
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Continue Shopping CTA */}
        <div className="mt-12 text-center">
          <Link href="/products">
            <Button
              variant="outline"
              rightIcon={<ShoppingBag className="h-5 w-5" />}
            >
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
