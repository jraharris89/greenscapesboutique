/**
 * Inventory Sync Cron Job
 *
 * This endpoint is called by Vercel Cron to sync inventory from Lightspeed.
 * It runs every 5 minutes to keep inventory levels current.
 *
 * Vercel Cron configuration is in vercel.json
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchAllItems, fetchCategories, fetchVendors } from "@/lib/lightspeed/client";
import { transformItems, filterActiveProducts } from "@/lib/lightspeed/transformer";
import { upsertProducts, archiveRemovedProducts } from "@/lib/supabase/products";
import { supabaseAdmin } from "@/lib/supabase/client";

// Verify cron secret to prevent unauthorized access
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const syncType = request.nextUrl.searchParams.get("type") || "full";

  try {
    // Log sync start
    const { data: syncLog } = await supabaseAdmin
      .from("sync_logs")
      .insert({
        sync_type: syncType,
        status: "started",
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    let itemsSynced = 0;

    if (syncType === "full") {
      // Full sync - fetch all data from Lightspeed
      console.log("Starting full inventory sync...");

      // Fetch all data in parallel where possible
      const [items, categories, vendors] = await Promise.all([
        fetchAllItems(),
        fetchCategories(),
        fetchVendors(),
      ]);

      console.log(`Fetched ${items.length} items from Lightspeed`);

      // Get active vendor IDs (for inventory cleanup)
      const activeVendorIds = new Set(
        vendors.filter((v) => !v.archived).map((v) => v.vendorID)
      );

      // Transform Lightspeed items to our product format
      const products = transformItems(items, categories);

      // Filter out products from archived vendors
      const activeProducts = filterActiveProducts(products, activeVendorIds);

      console.log(`Transformed ${activeProducts.length} active products`);

      // Upsert products to Supabase
      await upsertProducts(activeProducts);
      itemsSynced = activeProducts.length;

      // Archive products no longer in Lightspeed
      const activeIds = activeProducts.map((p) => p.id);
      await archiveRemovedProducts(activeIds);

      console.log("Full sync completed successfully");
    } else {
      // Inventory-only sync - just update quantities
      console.log("Starting inventory-only sync...");

      const items = await fetchAllItems();

      const inventoryUpdates = items.map((item) => {
        const shops = item.ItemShops?.ItemShop;
        const quantity = shops
          ? (Array.isArray(shops) ? shops : [shops]).reduce(
              (sum, shop) => sum + parseInt(shop.qoh || "0"),
              0
            )
          : 0;

        return {
          id: item.itemID,
          quantity,
          inStock: quantity > 0,
        };
      });

      // Import updateInventory function
      const { updateInventory } = await import("@/lib/supabase/products");
      await updateInventory(inventoryUpdates);
      itemsSynced = inventoryUpdates.length;

      console.log("Inventory sync completed successfully");
    }

    // Update sync log with success
    if (syncLog?.id) {
      await supabaseAdmin
        .from("sync_logs")
        .update({
          status: "completed",
          items_synced: itemsSynced,
          completed_at: new Date().toISOString(),
        })
        .eq("id", syncLog.id);
    }

    return NextResponse.json({
      success: true,
      syncType,
      itemsSynced,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Sync error:", error);

    // Log error to sync_logs
    await supabaseAdmin.from("sync_logs").insert({
      sync_type: syncType,
      status: "failed",
      errors: { message: error instanceof Error ? error.message : "Unknown error" },
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: "Sync failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request);
}
