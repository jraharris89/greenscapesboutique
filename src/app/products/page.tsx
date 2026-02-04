import { Suspense } from "react";
import { ProductsContent } from "./ProductsContent";

// Loading fallback for products page
function ProductsLoading() {
  return (
    <div className="min-h-screen bg-sage-50">
      {/* Page Header */}
      <div className="bg-sage-800 text-white py-12 md:py-16">
        <div className="container-custom">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">Shop Plants</h1>
          <p className="text-sage-200 text-lg max-w-2xl">
            Discover our curated collection of tropical plants, succulents, rare
            finds, and everything you need to create your perfect indoor jungle.
          </p>
        </div>
      </div>

      <div className="container-custom py-8 md:py-12">
        {/* Search bar skeleton */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <div className="w-full h-12 bg-sage-200 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Product grid skeleton */}
        <div className="flex gap-8">
          <div className="hidden lg:block w-64">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-sage-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-sage-200 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  );
}
