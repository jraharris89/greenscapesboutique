/**
 * Supabase Product Operations
 *
 * Functions for managing products in the Supabase database.
 * This is the primary data source for the website - Lightspeed syncs to here.
 */

import { supabaseAdmin, createServerClient } from "./client";
import type { Product, ProductFilters, SortOption } from "@/types";

/**
 * Get all products with optional filtering and sorting
 */
export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  const supabase = createServerClient();

  let query = supabase
    .from("products")
    .select("*")
    .eq("is_archived", false);

  // Apply filters
  if (filters?.categories?.length) {
    query = query.in("category", filters.categories);
  }

  if (filters?.isPetSafe) {
    query = query.eq("attributes->isPetSafe", true);
  }

  if (filters?.isAirPurifying) {
    query = query.eq("attributes->isAirPurifying", true);
  }

  if (filters?.inStockOnly) {
    query = query.eq("in_stock", true);
  }

  if (filters?.priceRange) {
    const [min, max] = filters.priceRange;
    query = query.gte("price", min).lte("price", max);
  }

  if (filters?.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  // Apply sorting
  switch (filters?.sortBy) {
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "price-low":
      query = query.order("price", { ascending: true });
      break;
    case "price-high":
      query = query.order("price", { ascending: false });
      break;
    case "name-az":
      query = query.order("name", { ascending: true });
      break;
    case "name-za":
      query = query.order("name", { ascending: false });
      break;
    case "featured":
    default:
      query = query
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data.map(transformDbProduct);
}

/**
 * Get a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return null;
  }

  return transformDbProduct(data);
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return transformDbProduct(data);
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .eq("is_archived", false)
    .eq("in_stock", true)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }

  return data.map(transformDbProduct);
}

/**
 * Get plant of the month
 */
export async function getPlantOfTheMonth(): Promise<Product | null> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_plant_of_month", true)
    .eq("is_archived", false)
    .single();

  if (error || !data) {
    return null;
  }

  return transformDbProduct(data);
}

/**
 * Get related products
 */
export async function getRelatedProducts(
  productId: string,
  category: string,
  tags: string[],
  limit = 4
): Promise<Product[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .neq("id", productId)
    .eq("is_archived", false)
    .or(`category.eq.${category},tags.ov.{${tags.join(",")}}`)
    .eq("in_stock", true)
    .limit(limit);

  if (error) {
    console.error("Error fetching related products:", error);
    return [];
  }

  return data.map(transformDbProduct);
}

/**
 * Upsert products from Lightspeed sync
 * This is called by the cron job
 */
export async function upsertProducts(products: Product[]): Promise<void> {
  const dbProducts = products.map((product) => ({
    id: product.id,
    sku: product.sku,
    name: product.name,
    slug: product.slug,
    description: product.description,
    short_description: product.shortDescription,
    price: product.price,
    compare_at_price: product.compareAtPrice || null,
    images: product.images,
    category: product.category,
    subcategory: product.subcategory || null,
    tags: product.tags,
    in_stock: product.inStock,
    quantity: product.quantity,
    low_stock_threshold: product.lowStockThreshold,
    attributes: product.attributes,
    care_guide: product.careGuide || null,
    related_products: product.relatedProducts || null,
    accessories: product.accessories || null,
    vendor: product.vendor || null,
    lightspeed_item_id: product.id,
    is_archived: product.isArchived,
    is_featured: product.isFeatured,
    is_plant_of_month: product.isPlantOfTheMonth,
    created_at: product.createdAt,
    updated_at: product.updatedAt,
    synced_at: new Date().toISOString(),
  }));

  const { error } = await supabaseAdmin
    .from("products")
    .upsert(dbProducts, { onConflict: "lightspeed_item_id" });

  if (error) {
    console.error("Error upserting products:", error);
    throw error;
  }
}

/**
 * Update inventory levels only
 * Used for frequent inventory-only syncs
 */
export async function updateInventory(
  updates: Array<{ id: string; quantity: number; inStock: boolean }>
): Promise<void> {
  for (const update of updates) {
    const { error } = await supabaseAdmin
      .from("products")
      .update({
        quantity: update.quantity,
        in_stock: update.inStock,
        synced_at: new Date().toISOString(),
      })
      .eq("lightspeed_item_id", update.id);

    if (error) {
      console.error(`Error updating inventory for ${update.id}:`, error);
    }
  }
}

/**
 * Archive products that are no longer in Lightspeed
 */
export async function archiveRemovedProducts(activeIds: string[]): Promise<void> {
  const { error } = await supabaseAdmin
    .from("products")
    .update({ is_archived: true })
    .not("lightspeed_item_id", "in", `(${activeIds.join(",")})`);

  if (error) {
    console.error("Error archiving products:", error);
  }
}

/**
 * Transform database row to Product type
 */
function transformDbProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    sku: row.sku as string,
    name: row.name as string,
    slug: row.slug as string,
    description: row.description as string,
    shortDescription: row.short_description as string,
    price: row.price as number,
    compareAtPrice: row.compare_at_price as number | undefined,
    images: row.images as Product["images"],
    category: row.category as Product["category"],
    subcategory: row.subcategory as string | undefined,
    tags: row.tags as string[],
    inStock: row.in_stock as boolean,
    quantity: row.quantity as number,
    lowStockThreshold: row.low_stock_threshold as number,
    attributes: row.attributes as Product["attributes"],
    careGuide: row.care_guide as Product["careGuide"],
    relatedProducts: row.related_products as string[] | undefined,
    accessories: row.accessories as string[] | undefined,
    vendor: row.vendor as string | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    isArchived: row.is_archived as boolean,
    isFeatured: row.is_featured as boolean,
    isPlantOfTheMonth: row.is_plant_of_month as boolean,
  };
}
