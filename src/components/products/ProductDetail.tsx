"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  Truck,
  MapPin,
  Shield,
  Droplet,
  Sun,
  Thermometer,
  Leaf,
  ChevronRight,
  Minus,
  Plus,
  Bell,
  Share2,
  Check,
} from "lucide-react";
import { Button, Badge, Card } from "@/components/ui";
import { ProductCard } from "./ProductCard";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import type { Product } from "@/types";

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
  accessories: Product[];
}

export function ProductDetail({
  product,
  relatedProducts,
  accessories,
}: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showBackInStockForm, setShowBackInStockForm] = useState(false);

  const addToCart = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  const careGuide = product.careGuide || {
    watering:
      "Water when the top inch of soil feels dry. Reduce watering in winter.",
    light: `Prefers ${product.attributes.lightLevel} light conditions.`,
    humidity: `Thrives in ${product.attributes.humidity} humidity environments.`,
    temperature: "Keep between 65-80°F (18-27°C). Avoid cold drafts.",
    soil: "Well-draining potting mix. Add perlite for extra drainage.",
    fertilizing:
      "Feed monthly during spring and summer with balanced liquid fertilizer.",
    repotting: "Repot every 1-2 years in spring when roots outgrow the pot.",
    commonIssues: [
      "Yellow leaves - usually overwatering",
      "Brown tips - low humidity or underwatering",
      "Drooping - needs water or light adjustment",
    ],
    tips: [
      "Rotate plant regularly for even growth",
      "Wipe leaves monthly to remove dust",
      "Check for pests during watering",
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-sage-50 border-b border-sage-200">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-sage-600">
            <Link href="/" className="hover:text-sage-900">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/products" className="hover:text-sage-900">
              Shop
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href={`/products?category=${product.category}`}
              className="hover:text-sage-900 capitalize"
            >
              {product.category.replace("-", " ")}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-sage-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="container-custom py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-50">
              <Image
                src={
                  product.images[activeImageIndex]?.url ||
                  "/images/placeholder-plant.jpg"
                }
                alt={product.images[activeImageIndex]?.alt || product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {!product.inStock && (
                  <Badge variant="error">Out of Stock</Badge>
                )}
                {product.inStock &&
                  product.quantity <= product.lowStockThreshold && (
                    <Badge variant="warning">
                      Only {product.quantity} left!
                    </Badge>
                  )}
                {hasDiscount && (
                  <Badge variant="success">{discountPercent}% OFF</Badge>
                )}
                {product.isPlantOfTheMonth && (
                  <Badge variant="info">Plant of the Month</Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setActiveImageIndex(index)}
                    className={`
                      relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0
                      ${activeImageIndex === index ? "ring-2 ring-sage-600" : "ring-1 ring-sage-200"}
                    `}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Category & SKU */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm text-sage-500 uppercase tracking-wide">
                {product.category.replace("-", " ")}
              </span>
              <span className="text-sage-300">|</span>
              <span className="text-sm text-sage-400">SKU: {product.sku}</span>
            </div>

            {/* Name */}
            <h1 className="font-serif text-3xl md:text-4xl text-sage-900 mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span
                className={`text-3xl font-semibold ${hasDiscount ? "text-terracotta-600" : "text-sage-900"}`}
              >
                ${product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xl text-sage-400 line-through">
                  ${product.compareAtPrice!.toFixed(2)}
                </span>
              )}
            </div>

            {/* Short description */}
            <p className="text-sage-600 text-lg mb-6">
              {product.shortDescription}
            </p>

            {/* Quick attributes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              <div className="bg-sage-50 rounded-xl p-3 text-center">
                <Sun className="h-5 w-5 text-cream-600 mx-auto mb-1" />
                <span className="block text-xs text-sage-500">Light</span>
                <span className="block text-sm font-medium text-sage-900 capitalize">
                  {product.attributes.lightLevel}
                </span>
              </div>
              <div className="bg-sage-50 rounded-xl p-3 text-center">
                <Droplet className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                <span className="block text-xs text-sage-500">Water</span>
                <span className="block text-sm font-medium text-sage-900 capitalize">
                  {product.attributes.wateringFrequency.replace("-", " ")}
                </span>
              </div>
              <div className="bg-sage-50 rounded-xl p-3 text-center">
                <Shield className="h-5 w-5 text-moss-500 mx-auto mb-1" />
                <span className="block text-xs text-sage-500">Care</span>
                <span className="block text-sm font-medium text-sage-900 capitalize">
                  {product.attributes.careLevel}
                </span>
              </div>
              <div className="bg-sage-50 rounded-xl p-3 text-center">
                <Leaf className="h-5 w-5 text-sage-500 mx-auto mb-1" />
                <span className="block text-xs text-sage-500">Pet Safe</span>
                <span className="block text-sm font-medium text-sage-900">
                  {product.attributes.isPetSafe ? "Yes" : "No"}
                </span>
              </div>
            </div>

            {/* Add to cart section */}
            {product.inStock ? (
              <div className="space-y-4 mb-8">
                {/* Quantity selector */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-sage-700">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-sage-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-sage-600 hover:text-sage-900"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.quantity, quantity + 1))
                      }
                      className="p-2 text-sage-600 hover:text-sage-900"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    leftIcon={<ShoppingBag className="h-5 w-5" />}
                    className="flex-1"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => toggleItem(product.id)}
                    variant={isWishlisted ? "secondary" : "outline"}
                    size="lg"
                    className="px-4"
                    aria-label={
                      isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                    }
                  >
                    <Heart
                      className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-4"
                    aria-label="Share"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                <div className="bg-terracotta-50 text-terracotta-700 p-4 rounded-lg">
                  <p className="font-medium">
                    This plant is currently out of stock
                  </p>
                  <p className="text-sm mt-1">
                    Sign up to be notified when it&apos;s back!
                  </p>
                </div>
                {!showBackInStockForm ? (
                  <Button
                    onClick={() => setShowBackInStockForm(true)}
                    variant="outline"
                    size="lg"
                    leftIcon={<Bell className="h-5 w-5" />}
                    className="w-full"
                  >
                    Notify Me When Available
                  </Button>
                ) : (
                  <form className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 border border-sage-300 rounded-lg focus:ring-sage-500 focus:border-sage-500"
                    />
                    <Button type="submit">Notify Me</Button>
                  </form>
                )}
              </div>
            )}

            {/* Shipping & Pickup info */}
            <div className="space-y-3 p-4 bg-sage-50 rounded-xl mb-8">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-sage-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sage-900">
                    Free Local Pickup in Boise
                  </p>
                  <p className="text-sm text-sage-600">
                    Ready in 2 hours when ordered before 3pm
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-sage-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sage-900">
                    Shipping Available
                  </p>
                  <p className="text-sm text-sage-600">
                    Free shipping on orders over $75
                  </p>
                </div>
              </div>
            </div>

            {/* Full description */}
            <div className="prose prose-sage max-w-none mb-8">
              <h3 className="font-serif text-xl text-sage-900 mb-3">
                About This Plant
              </h3>
              <p className="text-sage-600">{product.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Care Guide Section */}
      <section className="bg-cream-50 py-12 md:py-16">
        <div className="container-custom">
          <h2 className="font-serif text-3xl text-sage-900 mb-8 text-center">
            Care Guide
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card padding="md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Droplet className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-sage-900">Watering</h3>
              </div>
              <p className="text-sm text-sage-600">{careGuide.watering}</p>
            </Card>

            <Card padding="md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center">
                  <Sun className="h-5 w-5 text-cream-700" />
                </div>
                <h3 className="font-semibold text-sage-900">Light</h3>
              </div>
              <p className="text-sm text-sage-600">{careGuide.light}</p>
            </Card>

            <Card padding="md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center">
                  <Thermometer className="h-5 w-5 text-sage-600" />
                </div>
                <h3 className="font-semibold text-sage-900">Temperature</h3>
              </div>
              <p className="text-sm text-sage-600">{careGuide.temperature}</p>
            </Card>

            <Card padding="md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-moss-100 flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-moss-600" />
                </div>
                <h3 className="font-semibold text-sage-900">Soil</h3>
              </div>
              <p className="text-sm text-sage-600">{careGuide.soil}</p>
            </Card>
          </div>

          {/* Pro tips */}
          <div className="mt-8 bg-white rounded-2xl p-6 md:p-8">
            <h3 className="font-serif text-xl text-sage-900 mb-4">Pro Tips</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {careGuide.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-moss-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sage-600">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Complete the Look - Accessories */}
      {accessories.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-serif text-3xl text-sage-900 mb-2">
                  Complete the Look
                </h2>
                <p className="text-sage-600">
                  Pair with the perfect pot and accessories
                </p>
              </div>
              <Link
                href="/products?category=accessories"
                className="text-sage-600 hover:text-sage-900 font-medium flex items-center gap-1"
              >
                View All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {accessories.map((accessory) => (
                <ProductCard key={accessory.id} product={accessory} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="bg-sage-50 py-12 md:py-16">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-serif text-3xl text-sage-900 mb-2">
                  You May Also Like
                </h2>
                <p className="text-sage-600">Similar plants you might love</p>
              </div>
              <Link
                href={`/products?category=${product.category}`}
                className="text-sage-600 hover:text-sage-900 font-medium flex items-center gap-1"
              >
                View All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
