"use client";

import { useState } from "react";
import Link from "next/link";
import { Product, money } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { Memorial, emptyMemorial, foreverAge, photoToDataUrl, shortDate } from "@/lib/memorial";
import { YardSignProof, AmbassadorCardProof } from "@/components/proofs/Proofs";
import { ProductImage } from "@/components/ProductCard";

export default function ProductDetail({ product }: { product: Product }) {
  const cart = useCart();
  const [variantId, setVariantId] = useState(product.variants?.[0]?.id);
  const [qty, setQty] = useState(1);
  const [m, setM] = useState<Memorial>(emptyMemorial);
  const [banner, setBanner] = useState({ lovedOne: "", bannerNo: "", notes: "" });
  const [approved, setApproved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  const variant = product.variants?.find((v) => v.id === variantId);
  const price = variant?.price ?? product.price;
  const kind = product.personalization?.kind;
  const hasProof = kind === "yard-sign" || kind === "ambassador-card";
  const update = (p: Partial<Memorial>) => { setM((s) => ({ ...s, ...p })); setApproved(false); setAdded(false); };
  const age = foreverAge(m.dob, m.dod);

  async function onPhoto(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Please choose a photo (JPG, PNG or HEIC exported as JPG).");
    setError(""); setBusy(true);
    try { update({ photo: await photoToDataUrl(file), x: 50, y: 35, zoom: 1 }); }
    catch { setError("We couldn't read that photo. Try a JPG or PNG."); }
    finally { setBusy(false); }
  }

  function addToCart() {
    setError("");
    let personalization: Record<string, string> | undefined;
    if (hasProof) {
      if (!m.photo) return setError("Please upload a photo of your loved one.");
      if (!m.firstName.trim()) return setError("Please enter your loved one's name.");
      if (age === null) return setError("Please enter valid birth and passing dates.");
      if (!approved) return setError("Please review the proof and check the approval box.");
      personalization = {
        Name: `${m.firstName.trim()} ${m.lastName.trim()}`.trim(),
        Dates: `${shortDate(m.dob)} – ${shortDate(m.dod)}`,
        Age: `Forever ${age}`,
        photo: m.photo,
        crop: JSON.stringify({ x: m.x, y: m.y, zoom: m.zoom }),
      };
    } else if (kind === "banner-lookup") {
      if (!banner.lovedOne.trim()) return setError("Please tell us whose banner you'd like.");
      personalization = { "Loved one": banner.lovedOne.trim(), ...(banner.bannerNo && { "Banner #": banner.bannerNo }), ...(banner.notes && { Notes: banner.notes }) };
    }
    cart.add({ slug: product.slug, name: product.name, variant: variant?.label, price, qty, image: product.image, personalization });
    setAdded(true);
  }

  return (
    <div className="grid lg:grid-cols-[1.25fr_1fr] gap-10 lg:gap-16 items-start">
      {/* Left: proof or product image */}
      <div className="lg:sticky lg:top-24">
        {hasProof ? (
          <div className="rounded-3xl border border-line bg-[radial-gradient(ellipse_at_top,#2a1f4a,#120e1b_70%)] p-6 sm:p-10">
            <div className="flex items-center justify-between mb-5">
              <p className="eyebrow">Live proof</p>
              {m.photo && <p className="text-xs text-muted">Drag the photo to reposition</p>}
            </div>
            {kind === "yard-sign" ? <YardSignProof m={m} onChange={update} /> : <AmbassadorCardProof m={m} onChange={update} />}
            {m.photo && (
              <label className="mt-6 flex items-center gap-4 text-sm text-muted">
                Zoom
                <input type="range" min={1} max={3} step={0.01} value={m.zoom} onChange={(e) => update({ zoom: +e.target.value })} className="flex-1 accent-[#8f6cff]" />
              </label>
            )}
          </div>
        ) : (
          <ProductImage product={product} className="aspect-[4/3] rounded-3xl border border-line overflow-hidden" />
        )}
      </div>

      {/* Right: details + form */}
      <div>
        <h1 className="font-display text-4xl sm:text-5xl font-light leading-tight">{product.name}</h1>
        <p className="text-2xl font-semibold text-lilac mt-4">{money(price)}</p>
        <p className="text-fg/75 mt-5 text-lg leading-relaxed">{product.short}</p>
        <ul className="mt-5 space-y-1.5 text-sm text-fg/70">
          {product.details.map((d) => (
            <li key={d} className="flex gap-2"><span className="text-brand">•</span>{d}</li>
          ))}
        </ul>

        {product.variants && (
          <fieldset className="mt-8">
            <legend className="text-sm font-semibold mb-3">{product.variantLabel}</legend>
            <div className="grid gap-2">
              {product.variants.map((v) => (
                <label key={v.id} className={`flex items-center justify-between rounded-xl border px-4 py-3 cursor-pointer transition ${variantId === v.id ? "border-brand bg-brand/10" : "border-line hover:border-lilac/60"}`}>
                  <span className="flex items-center gap-3">
                    <input type="radio" name="variant" className="accent-[#8f6cff]" checked={variantId === v.id} onChange={() => setVariantId(v.id)} />
                    {v.label}
                  </span>
                  <span className="font-semibold">{money(v.price)}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {hasProof && (
          <section className="mt-10 rounded-3xl border border-line bg-surface p-6 sm:p-8">
            <h2 className="font-display text-2xl">Personalize</h2>
            <p className="text-sm text-muted mt-1">Your proof updates as you type.</p>

            <label className="mt-6 block">
              <span className="text-sm font-semibold">Photo of your loved one</span>
              <div
                className="mt-2 rounded-2xl border-2 border-dashed border-line hover:border-brand/70 transition p-5 text-center cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); onPhoto(e.dataTransfer.files[0]); }}
              >
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => onPhoto(e.target.files?.[0])} />
                <p className="text-sm">{busy ? "Preparing photo…" : m.photo ? "Replace photo" : "Choose or drop a photo"}</p>
                <p className="text-xs text-muted mt-1">A clear, well-lit photo of their face works best.</p>
              </div>
            </label>

            <div className="grid sm:grid-cols-2 gap-4 mt-5">
              <label className="block"><span className="text-sm font-semibold">First name</span>
                <input className="field mt-2" value={m.firstName} onChange={(e) => update({ firstName: e.target.value })} autoComplete="off" /></label>
              <label className="block"><span className="text-sm font-semibold">Last name</span>
                <input className="field mt-2" value={m.lastName} onChange={(e) => update({ lastName: e.target.value })} autoComplete="off" /></label>
              <label className="block"><span className="text-sm font-semibold">Date of birth</span>
                <input type="date" className="field mt-2" value={m.dob} onChange={(e) => update({ dob: e.target.value })} /></label>
              <label className="block"><span className="text-sm font-semibold">Date of passing</span>
                <input type="date" className="field mt-2" value={m.dod} onChange={(e) => update({ dod: e.target.value })} /></label>
            </div>
            {age !== null && <p className="mt-3 text-sm text-lilac">Forever {age}</p>}

            <label className="mt-6 flex items-start gap-3 text-sm cursor-pointer">
              <input type="checkbox" className="mt-0.5 accent-[#8f6cff] h-4 w-4" checked={approved} onChange={(e) => setApproved(e.target.checked)} />
              <span>I&apos;ve checked the spelling, dates and photo, and I approve this proof for printing.</span>
            </label>
          </section>
        )}

        {kind === "banner-lookup" && (
          <section className="mt-10 rounded-3xl border border-line bg-surface p-6 sm:p-8">
            <h2 className="font-display text-2xl">Whose banner?</h2>
            <p className="text-sm text-muted mt-1">
              Tell us who you&apos;re ordering for and we&apos;ll match the banner they appear on.{" "}
              <Link href="/victims/search" className="text-lilac underline underline-offset-4">Find their banner</Link>
            </p>
            <div className="grid gap-4 mt-5">
              <label className="block"><span className="text-sm font-semibold">Loved one&apos;s full name</span>
                <input className="field mt-2" value={banner.lovedOne} onChange={(e) => setBanner({ ...banner, lovedOne: e.target.value })} /></label>
              <label className="block"><span className="text-sm font-semibold">Banner number <span className="text-muted font-normal">(if you know it)</span></span>
                <input className="field mt-2" value={banner.bannerNo} onChange={(e) => setBanner({ ...banner, bannerNo: e.target.value })} /></label>
              <label className="block"><span className="text-sm font-semibold">Notes <span className="text-muted font-normal">(optional)</span></span>
                <textarea rows={3} className="field mt-2" value={banner.notes} onChange={(e) => setBanner({ ...banner, notes: e.target.value })} /></label>
            </div>
          </section>
        )}

        <div className="mt-8 flex items-center gap-3">
          <div className="flex items-center rounded-full border border-line">
            <button className="px-4 py-3 text-lg" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
            <span className="w-8 text-center font-semibold" aria-live="polite">{qty}</span>
            <button className="px-4 py-3 text-lg" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">+</button>
          </div>
          <button className="btn btn-primary flex-1" onClick={addToCart} disabled={busy}>
            Add to cart · {money(price * qty)}
          </button>
        </div>
        {error && <p className="mt-4 text-sm text-[#ff9b9b]" role="alert">{error}</p>}
        {added && (
          <p className="mt-4 text-sm text-candle" role="status">
            Added to your cart. <Link href="/cart" className="underline underline-offset-4">View cart</Link> or keep shopping.
          </p>
        )}
        {product.fulfilledBy === "signs365" && (
          <p className="mt-6 text-xs text-muted">Banners are printed and shipped directly by our banner partner.</p>
        )}
      </div>
    </div>
  );
}
