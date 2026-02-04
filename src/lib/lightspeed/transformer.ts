/**
 * Lightspeed Data Transformer
 *
 * Transforms Lightspeed API data into our application's data format.
 * This keeps the Lightspeed-specific logic isolated from the rest of the app.
 */

import type { Product, ProductCategory, PlantAttributes } from "@/types";
import type { LightspeedItem, LightspeedCategory } from "./client";

// Map Lightspeed category IDs to our category types
const CATEGORY_MAP: Record<string, ProductCategory> = {
  // These IDs should be configured based on actual Lightspeed categories
  "1": "tropical",
  "2": "succulent",
  "3": "cacti",
  "4": "air-plants",
  "5": "carnivorous",
  "6": "rare",
  "7": "pots",
  "8": "soil",
  "9": "tools",
  "10": "bundles",
  "11": "outdoor",
  "12": "accessories",
};

// Custom field mappings for plant attributes
// These would be configured based on your Lightspeed custom fields
interface CustomFields {
  lightLevel?: string;
  petSafe?: string;
  airPurifying?: string;
  humidity?: string;
  careLevel?: string;
  wateringFrequency?: string;
  size?: string;
  rare?: string;
}

/**
 * Parse custom fields from Lightspeed item description or notes
 * Format expected: [key:value] pairs in description
 */
function parseCustomFields(description: string): CustomFields {
  const fields: CustomFields = {};
  const regex = /\[(\w+):([^\]]+)\]/g;
  let match;

  while ((match = regex.exec(description)) !== null) {
    const [, key, value] = match;
    fields[key as keyof CustomFields] = value.trim();
  }

  return fields;
}

/**
 * Clean description by removing custom field tags
 */
function cleanDescription(description: string): string {
  return description.replace(/\[(\w+):([^\]]+)\]/g, "").trim();
}

/**
 * Generate URL-friendly slug from product name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Get price from Lightspeed prices array
 */
function getPrice(item: LightspeedItem): { price: number; compareAtPrice?: number } {
  if (!item.Prices?.ItemPrice) {
    return { price: parseFloat(item.defaultCost) || 0 };
  }

  const prices = Array.isArray(item.Prices.ItemPrice)
    ? item.Prices.ItemPrice
    : [item.Prices.ItemPrice];

  // Find default retail price (useType "Default")
  const defaultPrice = prices.find((p) => p.useType === "Default");
  const msrpPrice = prices.find((p) => p.useType === "MSRP");

  const price = parseFloat(defaultPrice?.amount || item.defaultCost) || 0;
  const compareAtPrice = msrpPrice ? parseFloat(msrpPrice.amount) : undefined;

  return {
    price,
    compareAtPrice: compareAtPrice && compareAtPrice > price ? compareAtPrice : undefined,
  };
}

/**
 * Get inventory quantity from Lightspeed item shops
 */
function getInventory(item: LightspeedItem): { inStock: boolean; quantity: number } {
  if (!item.ItemShops?.ItemShop) {
    return { inStock: false, quantity: 0 };
  }

  const shops = Array.isArray(item.ItemShops.ItemShop)
    ? item.ItemShops.ItemShop
    : [item.ItemShops.ItemShop];

  // Sum quantity across all shops (or filter to specific shop)
  const totalQty = shops.reduce((sum, shop) => sum + parseInt(shop.qoh || "0"), 0);

  return {
    inStock: totalQty > 0,
    quantity: totalQty,
  };
}

/**
 * Get images from Lightspeed item
 */
function getImages(item: LightspeedItem) {
  if (!item.Images?.Image) {
    return [
      {
        id: "placeholder",
        url: "/images/placeholder-plant.jpg",
        alt: item.description,
        width: 600,
        height: 600,
        isPrimary: true,
      },
    ];
  }

  const images = Array.isArray(item.Images.Image)
    ? item.Images.Image
    : [item.Images.Image];

  return images.map((img, index) => ({
    id: img.imageID,
    url: `${img.baseImageURL}${img.publicID}.jpg`,
    alt: img.description || item.description,
    width: 600,
    height: 600,
    isPrimary: index === 0,
  }));
}

/**
 * Map light level string to enum
 */
function mapLightLevel(value?: string): PlantAttributes["lightLevel"] {
  const normalized = value?.toLowerCase();
  if (normalized === "low") return "low";
  if (normalized === "medium") return "medium";
  if (normalized === "direct") return "direct";
  return "bright"; // default
}

/**
 * Map care level string to enum
 */
function mapCareLevel(value?: string): PlantAttributes["careLevel"] {
  const normalized = value?.toLowerCase();
  if (normalized === "easy" || normalized === "beginner") return "easy";
  if (normalized === "expert" || normalized === "advanced") return "expert";
  return "moderate"; // default
}

/**
 * Map watering frequency string to enum
 */
function mapWateringFrequency(
  value?: string
): PlantAttributes["wateringFrequency"] {
  const normalized = value?.toLowerCase();
  if (normalized === "bi-weekly" || normalized === "biweekly") return "bi-weekly";
  if (normalized === "monthly") return "monthly";
  if (normalized === "infrequent" || normalized === "rare") return "infrequent";
  return "weekly"; // default
}

/**
 * Map size string to enum
 */
function mapSize(value?: string): PlantAttributes["size"] {
  const normalized = value?.toLowerCase();
  if (normalized === "mini" || normalized === "tiny") return "mini";
  if (normalized === "desk" || normalized === "small") return "desk";
  if (normalized === "large") return "large";
  if (normalized === "statement" || normalized === "xl") return "statement";
  return "medium"; // default
}

/**
 * Transform a Lightspeed item into our Product format
 */
export function transformItem(
  item: LightspeedItem,
  categories: Map<string, LightspeedCategory>
): Product {
  const customFields = parseCustomFields(item.description);
  const cleanedDescription = cleanDescription(item.description);
  const { price, compareAtPrice } = getPrice(item);
  const { inStock, quantity } = getInventory(item);
  const images = getImages(item);

  // Get category
  const category = categories.get(item.categoryID);
  const categoryType = CATEGORY_MAP[item.categoryID] || "tropical";

  // Parse tags from description or custom fields
  const tags: string[] = [];
  if (customFields.rare === "true") tags.push("rare");
  if (customFields.petSafe === "true") tags.push("pet-safe");
  if (customFields.airPurifying === "true") tags.push("air-purifying");

  const product: Product = {
    id: item.itemID,
    sku: item.customSku || item.systemSku,
    name: item.description.split("\n")[0] || item.description, // First line as name
    slug: generateSlug(item.description.split("\n")[0] || item.description),
    description: cleanedDescription,
    shortDescription:
      cleanedDescription.substring(0, 150) +
      (cleanedDescription.length > 150 ? "..." : ""),
    price,
    compareAtPrice,
    images,
    category: categoryType,
    subcategory: category?.name,
    tags,
    inStock,
    quantity,
    lowStockThreshold: parseInt(item.ItemShops?.ItemShop
      ? (Array.isArray(item.ItemShops.ItemShop)
          ? item.ItemShops.ItemShop[0]
          : item.ItemShops.ItemShop
        ).reorderPoint || "5"
      : "5"),
    attributes: {
      lightLevel: mapLightLevel(customFields.lightLevel),
      isPetSafe: customFields.petSafe === "true",
      isAirPurifying: customFields.airPurifying === "true",
      humidity: (customFields.humidity as PlantAttributes["humidity"]) || "medium",
      careLevel: mapCareLevel(customFields.careLevel),
      wateringFrequency: mapWateringFrequency(customFields.wateringFrequency),
      size: mapSize(customFields.size),
      plantType: categoryType,
      isRare: customFields.rare === "true",
    },
    vendor: item.defaultVendorID || undefined,
    createdAt: item.createTime,
    updatedAt: item.timeStamp,
    isArchived: item.archived,
    isFeatured: false, // Set based on your business logic
    isPlantOfTheMonth: false, // Set based on your business logic
  };

  return product;
}

/**
 * Transform multiple Lightspeed items into Products
 */
export function transformItems(
  items: LightspeedItem[],
  categories: LightspeedCategory[]
): Product[] {
  // Create category lookup map
  const categoryMap = new Map<string, LightspeedCategory>();
  categories.forEach((cat) => {
    categoryMap.set(cat.categoryID, cat);
  });

  return items
    .filter((item) => !item.archived && item.publishToEcom)
    .map((item) => transformItem(item, categoryMap));
}

/**
 * Filter out archived/inactive vendors' products
 * Used for inventory cleanup logic
 */
export function filterActiveProducts(
  products: Product[],
  activeVendorIds: Set<string>
): Product[] {
  return products.filter(
    (product) => !product.vendor || activeVendorIds.has(product.vendor)
  );
}
