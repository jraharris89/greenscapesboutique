"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Droplet, Sun, Shield, ArrowRight } from "lucide-react";
import { Button, Badge } from "@/components/ui";

// This would come from the API in production
const plantOfTheMonth = {
  id: "potm-2026-01",
  name: "Philodendron Pink Princess",
  slug: "philodendron-pink-princess",
  description:
    "The Philodendron Pink Princess is a stunning variegated plant known for its dark green leaves splashed with vibrant pink. Each leaf is unique, making it a true collector's piece that adds drama and elegance to any room.",
  price: 79.99,
  compareAtPrice: 99.99,
  image:
    "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&q=80",
  careLevel: "Moderate",
  light: "Bright indirect",
  water: "Weekly",
  petSafe: false,
  discount: 20,
};

export function PlantOfTheMonth() {
  return (
    <section className="section bg-cream-50">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden">
            <Image
              src={plantOfTheMonth.image}
              alt={plantOfTheMonth.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Discount badge */}
            <div className="absolute top-6 left-6">
              <div className="bg-terracotta-500 text-white px-4 py-2 rounded-full font-semibold">
                {plantOfTheMonth.discount}% OFF
              </div>
            </div>
            {/* Monthly badge */}
            <div className="absolute top-6 right-6">
              <Badge variant="info" className="text-sm px-3 py-1">
                January 2026
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 text-terracotta-600 font-medium mb-4">
              <Star className="h-5 w-5 fill-current" />
              <span>Plant of the Month</span>
            </div>

            <h2 className="font-serif text-4xl md:text-5xl text-sage-900 mb-4">
              {plantOfTheMonth.name}
            </h2>

            <p className="text-lg text-sage-600 mb-6">
              {plantOfTheMonth.description}
            </p>

            {/* Care info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 text-center">
                <Sun className="h-6 w-6 text-cream-600 mx-auto mb-2" />
                <span className="block text-sm text-sage-600">Light</span>
                <span className="block font-medium text-sage-900">
                  {plantOfTheMonth.light}
                </span>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <Droplet className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <span className="block text-sm text-sage-600">Water</span>
                <span className="block font-medium text-sage-900">
                  {plantOfTheMonth.water}
                </span>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <Shield className="h-6 w-6 text-sage-500 mx-auto mb-2" />
                <span className="block text-sm text-sage-600">Care</span>
                <span className="block font-medium text-sage-900">
                  {plantOfTheMonth.careLevel}
                </span>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <svg
                  className="h-6 w-6 text-bark-500 mx-auto mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="block text-sm text-sage-600">Pet Safe</span>
                <span className="block font-medium text-sage-900">
                  {plantOfTheMonth.petSafe ? "Yes" : "No"}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-4xl font-serif text-sage-900">
                ${plantOfTheMonth.price.toFixed(2)}
              </span>
              {plantOfTheMonth.compareAtPrice && (
                <span className="text-xl text-sage-400 line-through">
                  ${plantOfTheMonth.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/products/${plantOfTheMonth.slug}`}>
                <Button
                  size="lg"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Shop Now
                </Button>
              </Link>
              <Link href="/products?filter=featured">
                <Button variant="outline" size="lg">
                  View All Featured
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
