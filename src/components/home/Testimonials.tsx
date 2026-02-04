import Image from "next/image";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    location: "Boise, ID",
    rating: 5,
    text: "The staff at Greenscapes is incredibly knowledgeable. They helped me find the perfect plants for my low-light apartment and gave me care tips that have kept them thriving!",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    plantPurchased: "Pothos Collection",
  },
  {
    id: 2,
    name: "Mike T.",
    location: "Meridian, ID",
    rating: 5,
    text: "I drove from Meridian specifically for their rare plant selection. Found a stunning Pink Princess that I'd been hunting for months. Worth every mile!",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    plantPurchased: "Pink Princess Philodendron",
  },
  {
    id: 3,
    name: "Emily R.",
    location: "Eagle, ID",
    rating: 5,
    text: "The local pickup option is a game changer. I ordered online and had my plants within 2 hours. They were perfectly packaged and even healthier than expected!",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    plantPurchased: "Monstera Deliciosa",
  },
];

export function Testimonials() {
  return (
    <section className="section bg-sage-50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="section-title">What Plant Parents Say</h2>
          <p className="section-subtitle mx-auto">
            Join thousands of happy customers who&apos;ve found their perfect
            plant match
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Quote icon */}
              <Quote className="h-8 w-8 text-sage-200 mb-4" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-cream-500 fill-current"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-sage-700 mb-6 leading-relaxed">
                &quot;{testimonial.text}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <p className="font-semibold text-sage-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-sage-500">{testimonial.location}</p>
                </div>
              </div>

              {/* Plant purchased badge */}
              <div className="mt-4 pt-4 border-t border-sage-100">
                <p className="text-xs text-sage-500">
                  Purchased:{" "}
                  <span className="text-sage-700">
                    {testimonial.plantPurchased}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <span className="block font-serif text-4xl text-sage-900 mb-1">
              4.9
            </span>
            <div className="flex justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-cream-500 fill-current" />
              ))}
            </div>
            <span className="text-sage-600 text-sm">Google Reviews</span>
          </div>
          <div>
            <span className="block font-serif text-4xl text-sage-900 mb-1">
              2,500+
            </span>
            <span className="text-sage-600 text-sm">Happy Customers</span>
          </div>
          <div>
            <span className="block font-serif text-4xl text-sage-900 mb-1">
              98%
            </span>
            <span className="text-sage-600 text-sm">Would Recommend</span>
          </div>
          <div>
            <span className="block font-serif text-4xl text-sage-900 mb-1">
              5+
            </span>
            <span className="text-sage-600 text-sm">Years in Boise</span>
          </div>
        </div>
      </div>
    </section>
  );
}
