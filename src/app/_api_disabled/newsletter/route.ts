/**
 * Newsletter Subscription API
 *
 * Handles email subscriptions and syncs with Mailchimp.
 */

import { NextRequest, NextResponse } from "next/server";

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;
const MAILCHIMP_SERVER = process.env.MAILCHIMP_SERVER; // e.g., "us1"

interface SubscriptionRequest {
  email: string;
  firstName?: string;
  segments?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: SubscriptionRequest = await request.json();
    const { email, firstName, segments = [] } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // If Mailchimp is configured, add to list
    if (MAILCHIMP_API_KEY && MAILCHIMP_LIST_ID && MAILCHIMP_SERVER) {
      const response = await fetch(
        `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${MAILCHIMP_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email_address: email,
            status: "subscribed",
            merge_fields: {
              FNAME: firstName || "",
            },
            tags: ["website-signup", ...segments],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        // Handle "already subscribed" gracefully
        if (errorData.title === "Member Exists") {
          return NextResponse.json({
            success: true,
            message: "You're already subscribed!",
          });
        }

        console.error("Mailchimp error:", errorData);
        return NextResponse.json(
          { error: "Failed to subscribe. Please try again." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed!",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
