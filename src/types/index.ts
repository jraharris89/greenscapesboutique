// Product Types
export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  images: ProductImage[];
  category: ProductCategory;
  subcategory?: string;
  tags: string[];

  // Inventory
  inStock: boolean;
  quantity: number;
  lowStockThreshold: number;

  // Plant-specific attributes
  attributes: PlantAttributes;

  // Care guide
  careGuide?: CareGuide;

  // Related products for upsells
  relatedProducts?: string[];
  accessories?: string[];

  // Metadata
  vendor?: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  isFeatured: boolean;
  isPlantOfTheMonth: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  isPrimary: boolean;
}

export type ProductCategory =
  | "tropical"
  | "succulent"
  | "cacti"
  | "air-plants"
  | "carnivorous"
  | "rare"
  | "outdoor"
  | "bundles"
  | "accessories"
  | "pots"
  | "soil"
  | "tools";

export interface PlantAttributes {
  // Environment
  lightLevel: "low" | "medium" | "bright" | "direct";
  isPetSafe: boolean;
  isAirPurifying: boolean;
  humidity: "low" | "medium" | "high";

  // Maintenance
  careLevel: "easy" | "moderate" | "expert";
  wateringFrequency: "weekly" | "bi-weekly" | "monthly" | "infrequent";

  // Physical
  size: "mini" | "desk" | "medium" | "large" | "statement";
  plantType: ProductCategory;
  mature_height?: string;

  // Additional
  growthRate?: "slow" | "moderate" | "fast";
  isRare?: boolean;
}

export interface CareGuide {
  watering: string;
  light: string;
  humidity: string;
  temperature: string;
  soil: string;
  fertilizing: string;
  repotting: string;
  commonIssues: string[];
  tips: string[];
}

// Filter Types
export interface ProductFilters {
  search?: string;
  categories?: ProductCategory[];
  priceRange?: [number, number];
  lightLevel?: PlantAttributes["lightLevel"][];
  careLevel?: PlantAttributes["careLevel"][];
  size?: PlantAttributes["size"][];
  isPetSafe?: boolean;
  isAirPurifying?: boolean;
  inStockOnly?: boolean;
  sortBy?: SortOption;
}

export type SortOption =
  | "featured"
  | "newest"
  | "price-low"
  | "price-high"
  | "name-az"
  | "name-za";

// Cart Types
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
}

// Checkout Types
export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;

  // Fulfillment
  fulfillmentMethod: "shipping" | "local-pickup";

  // Shipping address (if applicable)
  shippingAddress?: Address;

  // Pickup details
  pickupDate?: string;
  pickupTime?: string;
  pickupNotes?: string;

  // Marketing
  subscribeToNewsletter: boolean;
  plantPreferences?: string[];
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Wishlist Types
export interface WishlistItem {
  productId: string;
  addedAt: string;
  notifyOnRestock: boolean;
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addresses: Address[];
  wishlist: WishlistItem[];
  preferences: UserPreferences;
  createdAt: string;
}

export interface UserPreferences {
  plantTypes: ProductCategory[];
  careLevel: PlantAttributes["careLevel"];
  notifications: {
    restockAlerts: boolean;
    newsletter: boolean;
    promotions: boolean;
  };
}

// Lightspeed API Types
export interface LightspeedProduct {
  itemID: string;
  systemSku: string;
  defaultCost: string;
  avgCost: string;
  discountable: boolean;
  tax: boolean;
  archived: boolean;
  itemType: string;
  serialized: boolean;
  description: string;
  modelYear: string;
  upc: string;
  ean: string;
  customSku: string;
  manufacturerSku: string;
  createTime: string;
  timeStamp: string;
  publishToEcom: boolean;
  categoryID: string;
  taxClassID: string;
  departmentID: string;
  itemMatrixID: string;
  manufacturerID: string;
  seasonID: string;
  defaultVendorID: string;
  Prices: {
    ItemPrice: LightspeedPrice[];
  };
  Images?: {
    Image: LightspeedImage[];
  };
  ItemShops?: {
    ItemShop: LightspeedItemShop[];
  };
}

export interface LightspeedPrice {
  amount: string;
  useTypeID: string;
  useType: string;
}

export interface LightspeedImage {
  imageID: string;
  filename: string;
  description: string;
  ordering: string;
  publicID: string;
  baseImageURL: string;
}

export interface LightspeedItemShop {
  itemShopID: string;
  qoh: string;
  backorder: string;
  componentQoh: string;
  reorderPoint: string;
  reorderLevel: string;
  shopID: string;
  itemID: string;
}

// Instagram/UGC Types
export interface UGCPost {
  id: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  caption: string;
  username: string;
  permalink: string;
  timestamp: string;
  taggedProducts?: string[];
}

// Review Types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  body: string;
  images?: string[];
  createdAt: string;
  isVerifiedPurchase: boolean;
}

// Newsletter/Marketing Types
export interface NewsletterSubscription {
  email: string;
  firstName?: string;
  segments: string[];
  subscribedAt: string;
}

export type MarketingSegment =
  | "indoor-plant-buyers"
  | "succulent-lovers"
  | "rare-plant-collectors"
  | "local-pickup"
  | "high-value-customers";
