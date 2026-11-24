import Link from "next/link";
import type { Metadata } from "next";
import { categories, products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = { title: "Shop" };

export default async function Shop({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  const active = categories.find((x) => x.id === c)?.id;
  const list = active ? products.filter((p) => p.category === active) : products;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-12">
      <header className="max-w-3xl">
        <p className="eyebrow mb-4">Shop with purpose</p>
        <h1 className="font-display text-5xl sm:text-6xl font-light leading-tight">Keep their memory in sight.</h1>
        <p className="mt-5 text-lg text-fg/75 leading-relaxed">
          Personalize yard signs and ambassador cards with your loved one&apos;s photo and see your proof before you order.
          Every purchase supports awareness and prevention.
        </p>
      </header>

      <nav className="mt-10 flex flex-wrap gap-2" aria-label="Categories">
        {[{ id: undefined, label: "All" }, ...categories].map((cat) => {
          const on = cat.id === active;
          return (
            <Link
              key={cat.label}
              href={cat.id ? `/shop?c=${cat.id}` : "/shop"}
              className={`rounded-full px-4 py-2 text-sm font-medium border transition ${
                on ? "bg-brand border-brand text-white" : "border-line text-fg/80 hover:border-lilac"
              }`}
            >
              {cat.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((p) => <ProductCard key={p.slug} product={p} />)}
      </div>
    </div>
  );
}
