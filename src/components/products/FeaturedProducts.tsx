import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { ProductCard } from "./ProductCard";
import { getMockProducts } from "@/data/mockProducts";

export async function FeaturedProducts() {
  // In production, this would fetch from the API/database
  const products = getMockProducts().filter((p) => p.isFeatured).slice(0, 8);

  return (
    <section className="section bg-sage-50">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="section-title">New Arrivals</h2>
            <p className="section-subtitle">
              Fresh plants just added to our collection
            </p>
          </div>
          <Link href="/products?sort=newest">
            <Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
              View All
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
