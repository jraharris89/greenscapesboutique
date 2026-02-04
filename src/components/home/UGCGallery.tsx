"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram, Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui";

// Mock UGC data - in production this would come from Instagram API
const ugcPosts = [
  {
    id: "1",
    imageUrl:
      "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400&q=80",
    username: "plant_lover_boise",
    likes: 234,
    permalink: "https://instagram.com/p/1",
  },
  {
    id: "2",
    imageUrl:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80",
    username: "urban_jungle_id",
    likes: 189,
    permalink: "https://instagram.com/p/2",
  },
  {
    id: "3",
    imageUrl:
      "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80",
    username: "green_thumb_gal",
    likes: 312,
    permalink: "https://instagram.com/p/3",
  },
  {
    id: "4",
    imageUrl:
      "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400&q=80",
    username: "boise_botanicals",
    likes: 156,
    permalink: "https://instagram.com/p/4",
  },
  {
    id: "5",
    imageUrl:
      "https://images.unsplash.com/photo-1446071103084-c257b5f70672?w=400&q=80",
    username: "treasure_valley_plants",
    likes: 278,
    permalink: "https://instagram.com/p/5",
  },
  {
    id: "6",
    imageUrl:
      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&q=80",
    username: "idaho_indoor_garden",
    likes: 201,
    permalink: "https://instagram.com/p/6",
  },
];

export function UGCGallery() {
  return (
    <section className="section bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-terracotta-500 font-medium mb-4">
            <Instagram className="h-5 w-5" />
            <span>#GreenscapesBoutique</span>
          </div>
          <h2 className="section-title">Show Us Your Space</h2>
          <p className="section-subtitle mx-auto">
            Tag us on Instagram and get featured! We love seeing our plants in
            their new homes.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {ugcPosts.map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-xl overflow-hidden"
            >
              <Image
                src={post.imageUrl}
                alt={`Photo by @${post.username}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-sage-950/0 group-hover:bg-sage-950/70 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="text-center text-white">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Heart className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </div>
                  <p className="text-xs">@{post.username}</p>
                </div>
              </div>
              {/* External link icon */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="h-4 w-4 text-white" />
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href="https://instagram.com/greenscapesboutique"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              leftIcon={<Instagram className="h-5 w-5" />}
            >
              Follow @greenscapesboutique
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
