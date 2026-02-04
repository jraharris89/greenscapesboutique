/**
 * Lightspeed Webhook Handler
 *
 * Receives real-time updates from Lightspeed when inventory changes.
 * This provides instant inventory updates without waiting for cron jobs.
 *
 * Webhook events supported:
 * - item.updated - Product updated
 * - item.created - New product created
 * - item.deleted - Product deleted
 * - sale.completed - Sale completed (inventory decreased)
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchItem } from "@/lib/lightspeed/client";
import { transformItem } from "@/lib/lightspeed/transformer";
import { upsertProducts, updateInventory } from "@/lib/supabase/products";
import { supabaseAdmin } from "@/lib/supabase/client";

// Verify webhook signature
const WEBHOOK_SECRET = process.env.LIGHTSPEED_WEBHOOK_SECRET;

interface WebhookPayload {
  event: string;
  data: {
    itemID?: string;
    saleID?: string;
    [key: string]: unknown;
  };
}

async function verifyWebhookSignature(
  request: NextRequest,
  body: string
): Promise<boolean> {
  const signature = request.headers.get("x-lightspeed-signature");
  if (!signature || !WEBHOOK_SECRET) return false;

  // Lightspeed uses HMAC-SHA256 for webhook signatures
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(WEBHOOK_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(body)
  );

  const expectedSignature = Buffer.from(signatureBuffer).toString("hex");
  return signature === expectedSignature;
}

export async function POST(request: NextRequest) {
  const body = await request.text();

  // Verify webhook signature
  const isValid = await verifyWebhookSignature(request, body);
  if (!isValid) {
    console.error("Invalid webhook signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { event, data } = payload;

  console.log(`Received webhook: ${event}`, data);

  try {
    switch (event) {
      case "item.updated":
      case "item.created": {
        if (!data.itemID) break;

        // Fetch the updated item from Lightspeed
        const item = await fetchItem(data.itemID);
        if (!item) {
          console.error(`Item ${data.itemID} not found`);
          break;
        }

        // Transform and upsert to database
        const product = transformItem(item, new Map());
        await upsertProducts([product]);

        console.log(`Updated product: ${product.name}`);
        break;
      }

      case "item.deleted": {
        if (!data.itemID) break;

        // Archive the product
        await supabaseAdmin
          .from("products")
          .update({ is_archived: true })
          .eq("lightspeed_item_id", data.itemID);

        console.log(`Archived product: ${data.itemID}`);
        break;
      }

      case "sale.completed": {
        // When a sale is completed, fetch updated inventory for sold items
        // The sale data contains the items sold
        if (!data.saleID) break;

        // In a full implementation, you would:
        // 1. Fetch the sale details to get sold item IDs
        // 2. Fetch current inventory for those items
        // 3. Update the database

        // For now, we'll trigger a quick inventory sync
        // This is handled by the cron job for efficiency
        console.log(`Sale completed: ${data.saleID}`);
        break;
      }

      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Processing failed" },
      { status: 500 }
    );
  }
}

// Return 200 for GET requests (webhook verification)
export async function GET() {
  return NextResponse.json({ status: "Webhook endpoint active" });
}
