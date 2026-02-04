import { notFound } from "next/navigation";
import { getMockProductBySlug, getMockProducts } from "@/data/mockProducts";
import { ProductDetail } from "@/components/products/ProductDetail";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getMockProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export async function generateStaticParams() {
  const products = getMockProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getMockProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Get related products
  const allProducts = getMockProducts();
  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category ||
          p.tags.some((t) => product.tags.includes(t)))
    )
    .slice(0, 4);

  // Get accessories (pots, soil, tools)
  const accessories = allProducts
    .filter(
      (p) =>
        ["pots", "soil", "tools"].includes(p.category) && p.inStock
    )
    .slice(0, 4);

  return (
    <ProductDetail
      product={product}
      relatedProducts={relatedProducts}
      accessories={accessories}
    />
  );
}
