import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getProduct, products } from "@/lib/products";
import ProductDetail from "./ProductDetail";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  return { title: p?.name ?? "Shop", description: p?.short };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-8">
      <nav className="text-sm text-muted mb-8" aria-label="Breadcrumb">
        <Link href="/shop" className="hover:text-fg">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-fg/80">{product.name}</span>
      </nav>
      <ProductDetail product={product} />
    </div>
  );
}
