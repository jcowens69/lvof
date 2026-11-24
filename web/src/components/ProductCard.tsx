import Image from "next/image";
import Link from "next/link";
import { Product, money } from "@/lib/products";
import { Bird } from "./Logo";

export function ProductImage({ product, className = "" }: { product: Product; className?: string }) {
  if (!product.image)
    return (
      <div className={`grid place-items-center bg-[radial-gradient(ellipse_at_top,#3b2785,#14111c_70%)] ${className}`}>
        <div className="text-center px-6">
          <Bird className="h-16 w-auto mx-auto opacity-90" />
          <p className="mt-4 font-display text-lg leading-snug">{product.name}</p>
        </div>
      </div>
    );
  return (
    <div className={`relative bg-[#0f0d15] ${className}`}>
      <Image
        src={product.image}
        alt={product.name}
        fill
        sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
        className={product.imageFit === "contain" ? "object-contain p-6" : "object-cover"}
      />
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/shop/${product.slug}`} className="group block rounded-3xl border border-line bg-surface overflow-hidden hover:border-brand/60 transition">
      <ProductImage product={product} className="aspect-[4/3] transition duration-500 group-hover:scale-[1.02]" />
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-semibold leading-snug">{product.name}</h3>
          <p className="text-lilac font-semibold whitespace-nowrap">
            {product.variants ? <span className="text-xs text-muted font-normal mr-1">from</span> : null}
            {money(product.variants ? Math.min(...product.variants.map((v) => v.price)) : product.price)}
          </p>
        </div>
        <p className="text-sm text-fg/65 mt-2 leading-relaxed">{product.short}</p>
        {product.personalization && (
          <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-candle">
            <span className="h-1.5 w-1.5 rounded-full bg-candle" /> Personalized with your loved one
          </p>
        )}
      </div>
    </Link>
  );
}
