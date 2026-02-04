"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Droplet, Sun } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  showQuickAdd?: boolean;
}

const lightLevelIcons: Record<string, React.ReactNode> = {
  low: <Sun className="h-3.5 w-3.5 text-sage-400" />,
  medium: <Sun className="h-3.5 w-3.5 text-cream-500" />,
  bright: <Sun className="h-3.5 w-3.5 text-cream-600" />,
  direct: <Sun className="h-3.5 w-3.5 text-terracotta-500" />,
};

const wateringIcons: Record<string, React.ReactNode> = {
  weekly: <Droplet className="h-3.5 w-3.5 text-blue-400" />,
  "bi-weekly": <Droplet className="h-3.5 w-3.5 text-blue-300" />,
  monthly: <Droplet className="h-3.5 w-3.5 text-blue-200" />,
  infrequent: <Droplet className="h-3.5 w-3.5 text-blue-100" />,
};

export function ProductCard({ product, showQuickAdd = true }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  const isWishlisted = isInWishlist(product.id);
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="product-card group block"
    >
      {/* Image Container */}
      <div className="product-card-image relative">
        {/* Primary Image */}
        <Image
          src={product.images[0]?.url || "/images/placeholder-plant.jpg"}
          alt={product.images[0]?.alt || product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {!product.inStock && (
            <Badge variant="error">Out of Stock</Badge>
          )}
          {product.inStock && product.quantity <= product.lowStockThreshold && (
            <Badge variant="warning">Low Stock</Badge>
          )}
          {hasDiscount && (
            <Badge variant="success">{discountPercent}% OFF</Badge>
          )}
          {product.isPlantOfTheMonth && (
            <Badge variant="info">Plant of the Month</Badge>
          )}
          {product.attributes.isPetSafe && (
            <Badge variant="success">Pet Safe</Badge>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleToggleWishlist}
          className={`
            absolute top-3 right-3 p-2 rounded-full transition-all duration-200
            ${isWishlisted
              ? "bg-terracotta-500 text-white"
              : "bg-white/90 text-sage-600 hover:bg-white hover:text-terracotta-500"
            }
          `}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
          />
        </button>

        {/* Quick add button (appears on hover) */}
        {showQuickAdd && product.inStock && (
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="w-full"
              leftIcon={<ShoppingBag className="h-4 w-4" />}
            >
              Add to Cart
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-sage-500 uppercase tracking-wide mb-1">
          {product.category.replace("-", " ")}
        </p>

        {/* Name */}
        <h3 className="font-serif text-lg text-sage-900 mb-2 line-clamp-1 group-hover:text-sage-700 transition-colors">
          {product.name}
        </h3>

        {/* Quick attributes */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1" title={`Light: ${product.attributes.lightLevel}`}>
            {lightLevelIcons[product.attributes.lightLevel]}
            <span className="text-xs text-sage-500 capitalize">
              {product.attributes.lightLevel}
            </span>
          </div>
          <div className="flex items-center gap-1" title={`Water: ${product.attributes.wateringFrequency}`}>
            {wateringIcons[product.attributes.wateringFrequency]}
            <span className="text-xs text-sage-500 capitalize">
              {product.attributes.wateringFrequency.replace("-", " ")}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className={`font-semibold text-lg ${hasDiscount ? "text-terracotta-600" : "text-sage-900"}`}>
            ${product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-sage-400 line-through">
              ${product.compareAtPrice!.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
