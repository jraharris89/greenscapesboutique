/**
 * Lightspeed Retail (R-Series) API Client
 *
 * This module handles all communication with the Lightspeed Retail API.
 * API Documentation: https://developers.lightspeedhq.com/retail/
 *
 * Important: Never call this API directly from client-side code.
 * All calls should go through our API routes or cron jobs.
 */

const LIGHTSPEED_API_URL = "https://api.lightspeedapp.com/API/V3/Account";
const ACCOUNT_ID = process.env.LIGHTSPEED_ACCOUNT_ID!;
const ACCESS_TOKEN = process.env.LIGHTSPEED_ACCESS_TOKEN!;
const REFRESH_TOKEN = process.env.LIGHTSPEED_REFRESH_TOKEN!;
const CLIENT_ID = process.env.LIGHTSPEED_CLIENT_ID!;
const CLIENT_SECRET = process.env.LIGHTSPEED_CLIENT_SECRET!;

interface LightspeedResponse<T> {
  "@attributes": {
    count: string;
    offset: string;
    limit: string;
  };
  Item?: T | T[];
  Category?: T | T[];
  Sale?: T | T[];
  Customer?: T | T[];
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
}

// In-memory token storage (in production, use Redis or database)
let currentAccessToken = ACCESS_TOKEN;
let tokenExpiresAt = Date.now() + 3600 * 1000;

/**
 * Refresh the access token using the refresh token
 */
async function refreshAccessToken(): Promise<string> {
  const response = await fetch(
    "https://cloud.lightspeedapp.com/oauth/access_token.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        refresh_token: REFRESH_TOKEN,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "refresh_token",
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to refresh token: ${response.statusText}`);
  }

  const data: TokenResponse = await response.json();
  currentAccessToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000;

  return currentAccessToken;
}

/**
 * Get a valid access token, refreshing if necessary
 */
async function getAccessToken(): Promise<string> {
  // Refresh token if it expires within 5 minutes
  if (Date.now() > tokenExpiresAt - 5 * 60 * 1000) {
    return refreshAccessToken();
  }
  return currentAccessToken;
}

/**
 * Make an authenticated request to the Lightspeed API
 */
async function lightspeedRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAccessToken();

  const response = await fetch(
    `${LIGHTSPEED_API_URL}/${ACCOUNT_ID}/${endpoint}`,
    {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    }
  );

  // Handle rate limiting
  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After");
    const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 5000;
    await new Promise((resolve) => setTimeout(resolve, waitTime));
    return lightspeedRequest<T>(endpoint, options);
  }

  if (!response.ok) {
    throw new Error(`Lightspeed API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch all items (products) from Lightspeed
 * Uses pagination to handle large inventories
 */
export async function fetchAllItems(
  limit = 100,
  offset = 0
): Promise<LightspeedItem[]> {
  const allItems: LightspeedItem[] = [];
  let hasMore = true;
  let currentOffset = offset;

  while (hasMore) {
    const response = await lightspeedRequest<LightspeedResponse<LightspeedItem>>(
      `Item.json?limit=${limit}&offset=${currentOffset}&load_relations=["Category","Images","ItemShops","Prices"]`
    );

    const items = response.Item;
    if (!items) {
      hasMore = false;
      break;
    }

    const itemArray = Array.isArray(items) ? items : [items];
    allItems.push(...itemArray);

    const totalCount = parseInt(response["@attributes"].count);
    currentOffset += limit;
    hasMore = currentOffset < totalCount;

    // Respect rate limits - Lightspeed allows 1 request per second
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return allItems;
}

/**
 * Fetch a single item by ID
 */
export async function fetchItem(itemId: string): Promise<LightspeedItem | null> {
  try {
    const response = await lightspeedRequest<{ Item: LightspeedItem }>(
      `Item/${itemId}.json?load_relations=["Category","Images","ItemShops","Prices"]`
    );
    return response.Item;
  } catch (error) {
    console.error(`Error fetching item ${itemId}:`, error);
    return null;
  }
}

/**
 * Fetch inventory levels for all items
 */
export async function fetchInventory(): Promise<LightspeedItemShop[]> {
  const allInventory: LightspeedItemShop[] = [];
  let hasMore = true;
  let offset = 0;
  const limit = 100;

  while (hasMore) {
    const response = await lightspeedRequest<LightspeedResponse<LightspeedItemShop>>(
      `ItemShop.json?limit=${limit}&offset=${offset}`
    );

    const inventory = response.Item;
    if (!inventory) {
      hasMore = false;
      break;
    }

    const inventoryArray = Array.isArray(inventory) ? inventory : [inventory];
    allInventory.push(...inventoryArray);

    const totalCount = parseInt(response["@attributes"].count);
    offset += limit;
    hasMore = offset < totalCount;

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return allInventory;
}

/**
 * Fetch all categories
 */
export async function fetchCategories(): Promise<LightspeedCategory[]> {
  const response = await lightspeedRequest<LightspeedResponse<LightspeedCategory>>(
    "Category.json"
  );

  const categories = response.Category;
  if (!categories) return [];

  return Array.isArray(categories) ? categories : [categories];
}

/**
 * Fetch all vendors
 */
export async function fetchVendors(): Promise<LightspeedVendor[]> {
  const response = await lightspeedRequest<LightspeedResponse<LightspeedVendor>>(
    "Vendor.json"
  );

  const vendors = response.Item;
  if (!vendors) return [];

  return Array.isArray(vendors) ? vendors : [vendors];
}

/**
 * Fetch customer by email
 */
export async function fetchCustomerByEmail(
  email: string
): Promise<LightspeedCustomer | null> {
  try {
    const response = await lightspeedRequest<LightspeedResponse<LightspeedCustomer>>(
      `Customer.json?email=${encodeURIComponent(email)}`
    );

    const customers = response.Customer;
    if (!customers) return null;

    const customerArray = Array.isArray(customers) ? customers : [customers];
    return customerArray[0] || null;
  } catch (error) {
    console.error(`Error fetching customer ${email}:`, error);
    return null;
  }
}

/**
 * Create a new customer in Lightspeed
 */
export async function createCustomer(
  customer: Partial<LightspeedCustomer>
): Promise<LightspeedCustomer> {
  const response = await lightspeedRequest<{ Customer: LightspeedCustomer }>(
    "Customer.json",
    {
      method: "POST",
      body: JSON.stringify(customer),
    }
  );

  return response.Customer;
}

/**
 * Create a sale (order) in Lightspeed
 */
export async function createSale(sale: Partial<LightspeedSale>): Promise<LightspeedSale> {
  const response = await lightspeedRequest<{ Sale: LightspeedSale }>(
    "Sale.json",
    {
      method: "POST",
      body: JSON.stringify(sale),
    }
  );

  return response.Sale;
}

// Type definitions for Lightspeed API responses
export interface LightspeedItem {
  itemID: string;
  systemSku: string;
  customSku: string;
  description: string;
  defaultCost: string;
  avgCost: string;
  discountable: boolean;
  tax: boolean;
  archived: boolean;
  itemType: string;
  publishToEcom: boolean;
  categoryID: string;
  manufacturerID: string;
  defaultVendorID: string;
  createTime: string;
  timeStamp: string;
  Category?: LightspeedCategory;
  Images?: { Image: LightspeedImage | LightspeedImage[] };
  ItemShops?: { ItemShop: LightspeedItemShop | LightspeedItemShop[] };
  Prices?: { ItemPrice: LightspeedPrice | LightspeedPrice[] };
}

export interface LightspeedItemShop {
  itemShopID: string;
  qoh: string;
  backorder: string;
  shopID: string;
  itemID: string;
  reorderPoint: string;
  reorderLevel: string;
}

export interface LightspeedCategory {
  categoryID: string;
  name: string;
  nodeDepth: string;
  parentID: string;
  leftNode: string;
  rightNode: string;
}

export interface LightspeedImage {
  imageID: string;
  filename: string;
  description: string;
  ordering: string;
  publicID: string;
  baseImageURL: string;
}

export interface LightspeedPrice {
  amount: string;
  useTypeID: string;
  useType: string;
}

export interface LightspeedVendor {
  vendorID: string;
  name: string;
  archived: boolean;
}

export interface LightspeedCustomer {
  customerID: string;
  firstName: string;
  lastName: string;
  company: string;
  customerTypeID: string;
  taxCategoryID: string;
  Contact?: {
    email: string;
    phone: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface LightspeedSale {
  saleID: string;
  timeStamp: string;
  completed: boolean;
  archived: boolean;
  customerID: string;
  shopID: string;
  registerID: string;
  employeeID: string;
  taxCategoryID: string;
  SaleLines?: { SaleLine: LightspeedSaleLine | LightspeedSaleLine[] };
  SalePayments?: { SalePayment: LightspeedSalePayment | LightspeedSalePayment[] };
}

export interface LightspeedSaleLine {
  saleLineID: string;
  itemID: string;
  qty: string;
  unitPrice: string;
  unitCost: string;
  discountPercent: string;
}

export interface LightspeedSalePayment {
  salePaymentID: string;
  amount: string;
  paymentTypeID: string;
}
