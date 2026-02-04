import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Tropical Plants",
    description: "Lush, vibrant foliage to transform any space",
    image:
      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&q=80",
    href: "/products?category=tropical",
    color: "bg-moss-600",
  },
  {
    name: "Succulents & Cacti",
    description: "Low-maintenance beauty that thrives on neglect",
    image:
      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&q=80",
    href: "/products?category=succulent",
    color: "bg-terracotta-500",
  },
  {
    name: "Rare & Unusual",
    description: "Collector's plants for the discerning enthusiast",
    image:
      "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=600&q=80",
    href: "/products?category=rare",
    color: "bg-bark-600",
  },
  {
    name: "Pet Safe",
    description: "Beautiful plants that are safe for your furry friends",
    image:
      "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&q=80",
    href: "/products?petSafe=true",
    color: "bg-sage-600",
  },
];

export function FeaturedCategories() {
  return (
    <section className="section bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle mx-auto">
            Find the perfect plant for your space, skill level, and lifestyle
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden"
            >
              {/* Background Image */}
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-sage-950/90 via-sage-950/40 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div
                  className={`w-12 h-1 ${category.color} rounded-full mb-4 transition-all duration-300 group-hover:w-20`}
                />
                <h3 className="font-serif text-2xl text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  {category.description}
                </p>
                <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                  <span>Explore</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
