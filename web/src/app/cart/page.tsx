"use client";

import Link from "next/link";
import { Fragment } from "react";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/products";

export default function CartPage() {
  const { items, remove, setQty, subtotal } = useCart();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-12">
      <h1 className="font-display text-5xl font-light">Your cart</h1>
      {items.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-line bg-surface p-10 text-center">
          <p className="text-fg/75">Your cart is empty.</p>
          <Link href="/shop" className="btn btn-primary mt-6">Browse the shop</Link>
        </div>
      ) : (
        <div className="mt-10 grid lg:grid-cols-[1fr_320px] gap-8 items-start">
          <ul className="space-y-4">
            {items.map((i) => {
              const photo = i.personalization?.photo;
              const details = Object.entries(i.personalization ?? {}).filter(([k]) => k !== "photo" && k !== "crop");
              return (
                <li key={i.key} className="rounded-2xl border border-line bg-surface p-5 flex gap-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo ?? i.image ?? "/images/hummingbird.png"} alt="" className="h-24 w-24 rounded-xl object-cover bg-bg shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-4">
                      <p className="font-semibold">{i.name}</p>
                      <p className="font-semibold">{money(i.price * i.qty)}</p>
                    </div>
                    {i.variant && <p className="text-sm text-muted">{i.variant}</p>}
                    {details.length > 0 && (
                      <dl className="mt-2 text-sm text-fg/70 grid grid-cols-[auto_1fr] gap-x-3">
                        {details.map(([k, v]) => (<Fragment key={k}><dt className="text-muted">{k}</dt><dd className="truncate">{v}</dd></Fragment>))}
                      </dl>
                    )}
                    <div className="mt-3 flex items-center gap-4 text-sm">
                      <label className="flex items-center gap-2 text-muted">Qty
                        <input type="number" min={1} value={i.qty} onChange={(e) => setQty(i.key, +e.target.value || 1)} className="field !w-20 !py-1.5" />
                      </label>
                      <button onClick={() => remove(i.key)} className="text-muted hover:text-fg underline underline-offset-4">Remove</button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <aside className="rounded-2xl border border-line bg-surface p-6 lg:sticky lg:top-24">
            <div className="flex justify-between font-semibold"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            <p className="text-sm text-muted mt-2">Shipping and tax are calculated at checkout.</p>
            <button className="btn btn-primary w-full mt-6 opacity-60 cursor-not-allowed" disabled title="Checkout is being connected">
              Checkout
            </button>
            <p className="text-xs text-muted mt-3 text-center">Secure checkout (Stripe) and live shipping rates are being connected next.</p>
          </aside>
        </div>
      )}
    </div>
  );
}
