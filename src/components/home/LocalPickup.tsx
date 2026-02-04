import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Car, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";

export function LocalPickup() {
  return (
    <section className="section bg-sage-800 text-white overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 text-cream-300 font-medium mb-4">
              <MapPin className="h-5 w-5" />
              <span>Boise Local</span>
            </div>

            <h2 className="font-serif text-4xl md:text-5xl mb-6">
              Skip the Shipping.
              <br />
              <span className="text-cream-300">Pick Up Today.</span>
            </h2>

            <p className="text-lg text-sage-200 mb-8">
              Order online and pick up at our Boise store. Get expert advice,
              see your plants in person, and take them home the same day &mdash;
              no shipping stress, no waiting.
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-sage-700 flex items-center justify-center flex-shrink-0">
                  <Car className="h-5 w-5 text-cream-300" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Curbside Available</h3>
                  <p className="text-sage-300 text-sm">
                    We&apos;ll bring your order right to your car
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-sage-700 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-cream-300" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Ready in 2 Hours</h3>
                  <p className="text-sage-300 text-sm">
                    Orders placed before 3pm are ready same day
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-sage-700 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-cream-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Free, Always</h3>
                  <p className="text-sage-300 text-sm">
                    No fees, no minimum &mdash; just happy plants
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button
                  size="lg"
                  variant="secondary"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Start Shopping
                </Button>
              </Link>
              <Link href="/visit">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-sage-900"
                >
                  Get Directions
                </Button>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80"
                alt="Inside Greenscapes Boutique store"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Store info card */}
            <div className="absolute -bottom-6 -left-6 bg-white text-sage-900 rounded-2xl p-6 shadow-xl max-w-xs">
              <h4 className="font-serif text-xl mb-2">Visit Our Store</h4>
              <p className="text-sage-600 text-sm mb-3">
                123 Garden Way
                <br />
                Boise, ID 83702
              </p>
              <div className="text-sm">
                <span className="text-sage-500">Today:</span>{" "}
                <span className="font-medium">10am - 7pm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
