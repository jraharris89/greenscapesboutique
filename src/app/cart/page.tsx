"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, MapPin, Truck } from "lucide-react";
import { Button } from "@/components/ui";
import { useCartStore } from "@/lib/store/cart";
import type { CartItem } from "@/types";

export default function CartPage() {
  const { items, subtotal, itemCount, updateQuantity, removeItem, clearCart } =
    useCartStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

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
              <ShoppingBag className="h-10 w-10 text-sage-400" />
            </div>
            <h1 className="font-serif text-3xl text-sage-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-sage-600 mb-8">
              Looks like you haven&apos;t added any plants to your cart yet.
              Let&apos;s find your perfect green companion!
            </p>
            <Link href="/products">
              <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tax = subtotal * 0.06; // 6% Idaho sales tax
  const shippingThreshold = 75;
  const freeShipping = subtotal >= shippingThreshold;
  const shippingCost = freeShipping ? 0 : 9.99;
  const total = subtotal + tax + shippingCost;

  return (
    <div className="min-h-screen bg-sage-50">
      <div className="container-custom py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl md:text-4xl text-sage-900">
            Shopping Cart
          </h1>
          <span className="text-sage-600">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItemCard
                key={item.productId}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}

            {/* Clear cart button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={clearCart}
                className="text-sm text-sage-500 hover:text-sage-700 underline"
              >
                Clear all items
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-sage-200 p-6 sticky top-28">
              <h2 className="font-serif text-xl text-sage-900 mb-6">
                Order Summary
              </h2>

              {/* Shipping progress */}
              {!freeShipping && (
                <div className="mb-6 p-4 bg-sage-50 rounded-lg">
                  <p className="text-sm text-sage-600 mb-2">
                    Add{" "}
                    <span className="font-semibold text-sage-900">
                      ${(shippingThreshold - subtotal).toFixed(2)}
                    </span>{" "}
                    more for free shipping!
                  </p>
                  <div className="h-2 bg-sage-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sage-600 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((subtotal / shippingThreshold) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Summary lines */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sage-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sage-600">
                  <span>Shipping</span>
                  <span>
                    {freeShipping ? (
                      <span className="text-moss-600">Free</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sage-600">
                  <span>Estimated Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-sage-200 pt-3 flex justify-between text-lg font-semibold text-sage-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout button */}
              <Link href="/checkout">
                <Button
                  size="lg"
                  className="w-full mb-4"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Proceed to Checkout
                </Button>
              </Link>

              {/* Fulfillment options preview */}
              <div className="space-y-3 pt-4 border-t border-sage-200">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-sage-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sage-900">Local Pickup</p>
                    <p className="text-sage-500">Free • Ready in 2 hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center">
                    <Truck className="h-4 w-4 text-sage-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sage-900">Shipping</p>
                    <p className="text-sage-500">
                      {freeShipping ? "Free" : `$${shippingCost.toFixed(2)}`} •
                      3-5 business days
                    </p>
                  </div>
                </div>
              </div>

              {/* Continue shopping */}
              <div className="mt-6 text-center">
                <Link
                  href="/products"
                  className="text-sage-600 hover:text-sage-900 text-sm font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  const { product, quantity } = item;
  const itemTotal = product.price * quantity;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-sage-200 p-4 md:p-6">
      <div className="flex gap-4 md:gap-6">
        {/* Product Image */}
        <Link
          href={`/products/${product.slug}`}
          className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden flex-shrink-0"
        >
          <Image
            src={product.images[0]?.url || "/images/placeholder-plant.jpg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="128px"
          />
        </Link>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between gap-4">
            <div>
              <Link
                href={`/products/${product.slug}`}
                className="font-serif text-lg text-sage-900 hover:text-sage-700 line-clamp-1"
              >
                {product.name}
              </Link>
              <p className="text-sm text-sage-500 capitalize mt-1">
                {product.category.replace("-", " ")}
              </p>
            </div>
            <button
              onClick={() => onRemove(product.id)}
              className="text-sage-400 hover:text-terracotta-500 transition-colors"
              aria-label="Remove item"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          {/* Price and Quantity */}
          <div className="flex items-end justify-between mt-4">
            {/* Quantity selector */}
            <div className="flex items-center border border-sage-300 rounded-lg">
              <button
                onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                className="p-2 text-sage-600 hover:text-sage-900 disabled:opacity-50"
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button
                onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                className="p-2 text-sage-600 hover:text-sage-900 disabled:opacity-50"
                disabled={quantity >= product.quantity}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="font-semibold text-sage-900">
                ${itemTotal.toFixed(2)}
              </p>
              {quantity > 1 && (
                <p className="text-sm text-sage-500">
                  ${product.price.toFixed(2)} each
                </p>
              )}
            </div>
          </div>

          {/* Low stock warning */}
          {product.quantity <= product.lowStockThreshold && (
            <p className="text-sm text-terracotta-600 mt-2">
              Only {product.quantity} left in stock
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
