"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Truck,
  Clock,
  ChevronLeft,
  Check,
  Lock,
  Calendar,
} from "lucide-react";
import { Button, Input, Card } from "@/components/ui";
import { useCartStore } from "@/lib/store/cart";
import type { CheckoutFormData } from "@/types";

type FulfillmentMethod = "local-pickup" | "shipping";

const pickupTimes = [
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 1:00 PM",
  "1:00 PM - 2:00 PM",
  "2:00 PM - 3:00 PM",
  "3:00 PM - 4:00 PM",
  "4:00 PM - 5:00 PM",
  "5:00 PM - 6:00 PM",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, itemCount, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [fulfillmentMethod, setFulfillmentMethod] =
    useState<FulfillmentMethod>("local-pickup");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CheckoutFormData>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    fulfillmentMethod: "local-pickup",
    subscribeToNewsletter: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-sage-50 flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const tax = subtotal * 0.06;
  const shippingCost =
    fulfillmentMethod === "shipping" && subtotal < 75 ? 9.99 : 0;
  const total = subtotal + tax + shippingCost;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Here you would:
    // 1. Create the order in Lightspeed
    // 2. Process payment (Stripe, etc.)
    // 3. Send confirmation email
    // 4. Trigger review request automation

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Clear cart and redirect to confirmation
    clearCart();
    router.push("/checkout/confirmation");
  };

  // Get tomorrow's date for pickup
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-sage-50">
      <div className="container-custom py-8 md:py-12">
        {/* Back to cart link */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-900 mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to cart
        </Link>

        <h1 className="font-serif text-3xl md:text-4xl text-sage-900 mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Information */}
              <Card>
                <h2 className="font-serif text-xl text-sage-900 mb-6">
                  Contact Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="md:col-span-2"
                  />
                  <Input
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="md:col-span-2"
                    helperText="We'll text you pickup/delivery updates"
                  />
                </div>
              </Card>

              {/* Fulfillment Method */}
              <Card>
                <h2 className="font-serif text-xl text-sage-900 mb-6">
                  How would you like to receive your plants?
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Local Pickup */}
                  <button
                    type="button"
                    onClick={() => setFulfillmentMethod("local-pickup")}
                    className={`
                      p-4 rounded-xl border-2 text-left transition-all
                      ${
                        fulfillmentMethod === "local-pickup"
                          ? "border-sage-600 bg-sage-50"
                          : "border-sage-200 hover:border-sage-300"
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        ${fulfillmentMethod === "local-pickup" ? "bg-sage-600 text-white" : "bg-sage-100 text-sage-600"}
                      `}
                      >
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sage-900">
                          Local Pickup
                        </p>
                        <p className="text-sm text-sage-600 mt-1">
                          Free • Ready in 2 hours
                        </p>
                        <p className="text-xs text-sage-500 mt-2">
                          123 Garden Way, Boise, ID 83702
                        </p>
                      </div>
                    </div>
                    {fulfillmentMethod === "local-pickup" && (
                      <div className="absolute top-3 right-3">
                        <Check className="h-5 w-5 text-sage-600" />
                      </div>
                    )}
                  </button>

                  {/* Shipping */}
                  <button
                    type="button"
                    onClick={() => setFulfillmentMethod("shipping")}
                    className={`
                      p-4 rounded-xl border-2 text-left transition-all
                      ${
                        fulfillmentMethod === "shipping"
                          ? "border-sage-600 bg-sage-50"
                          : "border-sage-200 hover:border-sage-300"
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        ${fulfillmentMethod === "shipping" ? "bg-sage-600 text-white" : "bg-sage-100 text-sage-600"}
                      `}
                      >
                        <Truck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sage-900">Shipping</p>
                        <p className="text-sm text-sage-600 mt-1">
                          {subtotal >= 75 ? "Free" : "$9.99"} • 3-5 business
                          days
                        </p>
                        <p className="text-xs text-sage-500 mt-2">
                          Plants carefully packaged for safe delivery
                        </p>
                      </div>
                    </div>
                    {fulfillmentMethod === "shipping" && (
                      <div className="absolute top-3 right-3">
                        <Check className="h-5 w-5 text-sage-600" />
                      </div>
                    )}
                  </button>
                </div>

                {/* Pickup Details */}
                {fulfillmentMethod === "local-pickup" && (
                  <div className="mt-6 p-4 bg-sage-50 rounded-xl">
                    <h3 className="font-medium text-sage-900 mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Schedule Your Pickup
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Pickup Date</label>
                        <input
                          type="date"
                          name="pickupDate"
                          min={minDate}
                          value={formData.pickupDate || ""}
                          onChange={handleInputChange}
                          className="input"
                          required={fulfillmentMethod === "local-pickup"}
                        />
                      </div>
                      <div>
                        <label className="label">Pickup Time</label>
                        <select
                          name="pickupTime"
                          value={formData.pickupTime || ""}
                          onChange={handleInputChange}
                          className="input"
                          required={fulfillmentMethod === "local-pickup"}
                        >
                          <option value="">Select a time</option>
                          {pickupTimes.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mt-4 flex items-start gap-2 text-sm text-sage-600">
                      <Clock className="h-4 w-4 mt-0.5" />
                      <p>
                        Orders placed before 3pm are ready for same-day pickup.
                        We&apos;ll text you when your order is ready!
                      </p>
                    </div>
                  </div>
                )}

                {/* Shipping Address */}
                {fulfillmentMethod === "shipping" && (
                  <div className="mt-6">
                    <h3 className="font-medium text-sage-900 mb-4">
                      Shipping Address
                    </h3>
                    <div className="grid gap-4">
                      <Input
                        label="Street Address"
                        name="addressLine1"
                        placeholder="123 Main St"
                        required={fulfillmentMethod === "shipping"}
                      />
                      <Input
                        label="Apt, Suite, etc. (optional)"
                        name="addressLine2"
                        placeholder="Apt 4B"
                      />
                      <div className="grid md:grid-cols-3 gap-4">
                        <Input
                          label="City"
                          name="city"
                          required={fulfillmentMethod === "shipping"}
                        />
                        <Input
                          label="State"
                          name="state"
                          required={fulfillmentMethod === "shipping"}
                        />
                        <Input
                          label="ZIP Code"
                          name="zip"
                          required={fulfillmentMethod === "shipping"}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              {/* Payment (placeholder) */}
              <Card>
                <h2 className="font-serif text-xl text-sage-900 mb-6">
                  Payment
                </h2>
                <div className="p-8 bg-sage-50 rounded-xl text-center">
                  <Lock className="h-8 w-8 text-sage-400 mx-auto mb-4" />
                  <p className="text-sage-600">
                    Secure payment form would go here
                  </p>
                  <p className="text-sm text-sage-500 mt-2">
                    (Stripe Elements integration)
                  </p>
                </div>
              </Card>

              {/* Newsletter opt-in */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="newsletter"
                  name="subscribeToNewsletter"
                  checked={formData.subscribeToNewsletter}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 rounded border-sage-300 text-sage-600 focus:ring-sage-500"
                />
                <label htmlFor="newsletter" className="text-sm text-sage-600">
                  Keep me updated with plant care tips, new arrivals, and
                  exclusive offers. Unsubscribe anytime.
                </label>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-sage-200 p-6 sticky top-28">
                <h2 className="font-serif text-xl text-sage-900 mb-6">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={
                            item.product.images[0]?.url ||
                            "/images/placeholder-plant.jpg"
                          }
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-sage-600 text-white text-xs rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-sage-900 line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-sage-500">
                          ${item.product.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-sage-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 pt-4 border-t border-sage-200">
                  <div className="flex justify-between text-sage-600">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sage-600">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-moss-600">Free</span>
                      ) : (
                        `$${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sage-600">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-semibold text-sage-900 pt-3 border-t border-sage-200">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-6"
                  isLoading={isSubmitting}
                  leftIcon={<Lock className="h-5 w-5" />}
                >
                  {isSubmitting
                    ? "Processing..."
                    : `Pay $${total.toFixed(2)}`}
                </Button>

                <p className="text-xs text-sage-500 text-center mt-4">
                  Your payment is secured with SSL encryption
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
