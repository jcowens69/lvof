# Lost Voices of Fentanyl website

Next.js (App Router) + Tailwind CSS v4. Replaces the Squarespace site at lvof.org.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## What's here (milestone 1)

- **Home**: hero built from the victim banners, the facts, banner feature, ways to act, featured products, donate band.
- **Shop** (`/shop`): category filter, product data in `src/lib/products.ts`.
- **Product pages** (`/shop/[slug]`): personalization with a **live proof** for the memorial yard sign and ambassador cards
  (`src/components/proofs/Proofs.tsx`), banner lookup for banner products.
- **Cart** (`/cart`): stored in the browser for now.
- Other nav pages are placeholders (`src/app/[...slug]/page.tsx`).

## Next

Stripe Checkout + Stripe Tax, Shippo live rates and labels, Supabase for orders, photo uploads,
the victims database (submission, search, memorial wall) and an admin page.
