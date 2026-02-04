/**
 * Products API
 *
 * REST API for fetching products with filtering and sorting.
 * Data is served from Supabase (synced from Lightspeed).
 */

import { NextRequest, NextResponse } from "next/server";
import { getProducts, getFeaturedProducts, getPlantOfTheMonth } from "@/lib/supabase/products";
import type { ProductFilters, SortOption, ProductCategory } from "@/types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Check for special queries
  const featured = searchParams.get("featured");
  const plantOfMonth = searchParams.get("plantOfMonth");

  if (featured === "true") {
    const limit = parseInt(searchParams.get("limit") || "8");
    const products = await getFeaturedProducts(limit);
    return NextResponse.json({ products });
  }

  if (plantOfMonth === "true") {
    const product = await getPlantOfTheMonth();
    return NextResponse.json({ product });
  }

  // Build filters from query params
  const filters: ProductFilters = {};

  // Categories
  const categories = searchParams.get("categories");
  if (categories) {
    filters.categories = categories.split(",") as ProductCategory[];
  }

  // Light level
  const lightLevel = searchParams.get("lightLevel");
  if (lightLevel) {
    filters.lightLevel = lightLevel.split(",") as ProductFilters["lightLevel"];
  }

  // Care level
  const careLevel = searchParams.get("careLevel");
  if (careLevel) {
    filters.careLevel = careLevel.split(",") as ProductFilters["careLevel"];
  }

  // Size
  const size = searchParams.get("size");
  if (size) {
    filters.size = size.split(",") as ProductFilters["size"];
  }

  // Boolean filters
  if (searchParams.get("petSafe") === "true") {
    filters.isPetSafe = true;
  }
  if (searchParams.get("airPurifying") === "true") {
    filters.isAirPurifying = true;
  }
  if (searchParams.get("inStock") === "true") {
    filters.inStockOnly = true;
  }

  // Price range
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  if (minPrice || maxPrice) {
    filters.priceRange = [
      parseFloat(minPrice || "0"),
      parseFloat(maxPrice || "9999"),
    ];
  }

  // Search
  const search = searchParams.get("search");
  if (search) {
    filters.search = search;
  }

  // Sort
  const sortBy = searchParams.get("sortBy");
  if (sortBy) {
    filters.sortBy = sortBy as SortOption;
  }

  try {
    const products = await getProducts(filters);

    return NextResponse.json({
      products,
      total: products.length,
      filters,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
