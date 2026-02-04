import {
  Hero,
  FeaturedCategories,
  PlantOfTheMonth,
  LocalPickup,
  UGCGallery,
  Testimonials,
} from "@/components/home";
import { FeaturedProducts } from "@/components/products/FeaturedProducts";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts />
      <PlantOfTheMonth />
      <LocalPickup />
      <UGCGallery />
      <Testimonials />
    </>
  );
}
