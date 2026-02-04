import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sage-50 flex items-center justify-center">
      <div className="text-center px-4">
        {/* 404 illustration */}
        <div className="mb-8">
          <span className="font-serif text-9xl md:text-[180px] text-sage-200">
            404
          </span>
        </div>

        <h1 className="font-serif text-3xl md:text-4xl text-sage-900 mb-4">
          Oops! This page wandered off
        </h1>

        <p className="text-lg text-sage-600 max-w-md mx-auto mb-8">
          Like a plant seeking sunlight, sometimes pages move around. Let&apos;s
          get you back to our garden.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" leftIcon={<Home className="h-5 w-5" />}>
              Go Home
            </Button>
          </Link>
          <Link href="/products">
            <Button
              variant="outline"
              size="lg"
              leftIcon={<ArrowLeft className="h-5 w-5" />}
            >
              Browse Plants
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
