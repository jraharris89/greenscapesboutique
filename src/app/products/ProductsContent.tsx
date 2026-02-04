"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { getMockProducts } from "@/data/mockProducts";
import type { ProductFilters as FilterType, SortOption } from "@/types";

export function ProductsContent() {
  const searchParams = useSearchParams();

  // Initialize filters from URL params
  const initialFilters: FilterType = {
    categories: searchParams.get("category")
      ? [searchParams.get("category") as FilterType["categories"] extends (infer U)[] ? U : never]
      : undefined,
    isPetSafe: searchParams.get("petSafe") === "true" || undefined,
    sortBy: (searchParams.get("sort") as SortOption) || "featured",
  };

  const [filters, setFilters] = useState<FilterType>(initialFilters);
  const [searchQuery, setSearchQuery] = useState("");

  // Get all products (in production, this would use React Query + API)
  const allProducts = useMemo(() => getMockProducts(), []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (filters.categories?.length) {
      result = result.filter((p) =>
        filters.categories!.includes(p.category)
      );
    }

    // Light level filter
    if (filters.lightLevel?.length) {
      result = result.filter((p) =>
        filters.lightLevel!.includes(p.attributes.lightLevel)
      );
    }

    // Care level filter
    if (filters.careLevel?.length) {
      result = result.filter((p) =>
        filters.careLevel!.includes(p.attributes.careLevel)
      );
    }

    // Size filter
    if (filters.size?.length) {
      result = result.filter((p) =>
        filters.size!.includes(p.attributes.size)
      );
    }

    // Pet safe filter
    if (filters.isPetSafe) {
      result = result.filter((p) => p.attributes.isPetSafe);
    }

    // Air purifying filter
    if (filters.isAirPurifying) {
      result = result.filter((p) => p.attributes.isAirPurifying);
    }

    // In stock filter
    if (filters.inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      result = result.filter((p) => p.price >= min && p.price <= max);
    }

    // Sort
    switch (filters.sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-az":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-za":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "featured":
      default:
        result.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
        });
    }

    return result;
  }, [allProducts, filters, searchQuery]);

  // Update URL when filters change (optional)
  useEffect(() => {
    // Could update URL params here for shareable filter states
  }, [filters]);

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
        {/* Search bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-sage-400" />
            <input
              type="text"
              placeholder="Search plants, pots, and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-white border border-sage-300 rounded-lg text-sage-900 placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Results count and sort (desktop) */}
        <div className="hidden lg:flex items-center justify-between mb-6">
          <p className="text-sage-600">
            Showing{" "}
            <span className="font-medium text-sage-900">
              {filteredProducts.length}
            </span>{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </p>
          <select
            value={filters.sortBy || "featured"}
            onChange={(e) =>
              setFilters({ ...filters, sortBy: e.target.value as SortOption })
            }
            className="px-4 py-2 bg-white border border-sage-300 rounded-lg text-sage-900 focus:ring-sage-500 focus:border-sage-500"
          >
            <option value="featured">Sort by: Featured</option>
            <option value="newest">Sort by: Newest</option>
            <option value="price-low">Sort by: Price Low to High</option>
            <option value="price-high">Sort by: Price High to Low</option>
            <option value="name-az">Sort by: Name A-Z</option>
            <option value="name-za">Sort by: Name Z-A</option>
          </select>
        </div>

        {/* Main content */}
        <div className="flex gap-8">
          {/* Filters sidebar */}
          <ProductFilters
            filters={filters}
            onFilterChange={setFilters}
            productCount={filteredProducts.length}
          />

          {/* Product grid */}
          <div className="flex-1">
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
    </div>
  );
}
