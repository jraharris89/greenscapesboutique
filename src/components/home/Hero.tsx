"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1545241047-6083a3684587?w=1920&q=80"
          alt="Lush indoor plants in a bright, modern space"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sage-950/80 via-sage-950/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 py-20">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-6">
            <MapPin className="h-4 w-4" />
            <span>Boise&apos;s Premier Plant Boutique</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6">
            Bring Nature
            <br />
            <span className="text-cream-300">Into Your Home</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg">
            Discover rare tropical plants, unique succulents, and beautiful
            accessories curated for plant lovers in the Treasure Valley.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/products">
              <Button
                size="lg"
                rightIcon={<ArrowRight className="h-5 w-5" />}
                className="w-full sm:w-auto"
              >
                Shop All Plants
              </Button>
            </Link>
            <Link href="/visit">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-sage-900"
              >
                Visit Our Store
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="flex flex-wrap gap-6 md:gap-10 text-white/70 text-sm">
              <div>
                <span className="block text-2xl font-serif text-white mb-1">
                  1,500+
                </span>
                Plants in Stock
              </div>
              <div>
                <span className="block text-2xl font-serif text-white mb-1">
                  Free
                </span>
                Local Pickup
              </div>
              <div>
                <span className="block text-2xl font-serif text-white mb-1">
                  Expert
                </span>
                Care Advice
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-8 h-12 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/70 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
