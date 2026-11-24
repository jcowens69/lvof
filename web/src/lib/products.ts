export type Personalization =
  | { kind: "yard-sign" }          // live proof of the memorial yard sign
  | { kind: "ambassador-card" }    // live proof of the 5x7 card
  | { kind: "banner-lookup" };     // customer tells us which loved one / banner

export type Variant = { id: string; label: string; price: number };

export type Product = {
  slug: string;
  name: string;
  category: "memorial" | "awareness" | "banners";
  price: number;                 // starting price in dollars
  variantLabel?: string;
  variants?: Variant[];
  image?: string;
  imageFit?: "cover" | "contain";
  short: string;
  details: string[];
  personalization?: Personalization;
  fulfilledBy?: "lvof" | "signs365";
  featured?: boolean;
};

export const categories: { id: Product["category"]; label: string }[] = [
  { id: "memorial", label: "Memorial & Personalized" },
  { id: "banners", label: "Victim Banners" },
  { id: "awareness", label: "Awareness" },
];

export const products: Product[] = [
  {
    slug: "custom-memorial-yard-sign",
    name: "Custom Memorial Yard Sign",
    category: "memorial",
    price: 25,
    image: "/images/products/custom-yard-sign.jpg",
    imageFit: "contain",
    short: "Your loved one's photo, name and dates on a weatherproof yard sign.",
    details: ['24" × 18" Coroplast sign', "Single-sided, full-color print", "Weatherproof for indoor or outdoor use", "Stake not included"],
    personalization: { kind: "yard-sign" },
    fulfilledBy: "lvof",
    featured: true,
  },
  {
    slug: "victim-banner",
    name: "Victim Banner",
    category: "banners",
    price: 35,
    variantLabel: "Size",
    variants: [
      { id: "4x8", label: "4′ × 8′ vinyl banner", price: 120 },
      { id: "2x3", label: "2′ × 3′ vinyl banner", price: 46 },
      { id: "magnet", label: "1′ × 2′ car magnet", price: 35 },
    ],
    image: "/images/banners/banner-1.jpg",
    imageFit: "contain",
    short: "The LVOF banner your loved one appears on, printed for rallies, homes and vehicles.",
    details: ["All-weather vinyl", "Grommets every 2′ for easy hanging", "Car magnet option for vehicles", "Printed and shipped by our banner partner"],
    personalization: { kind: "banner-lookup" },
    fulfilledBy: "signs365",
    featured: true,
  },
  {
    slug: "banner-yard-sign",
    name: "Victim Banner Yard Sign",
    category: "banners",
    price: 31,
    image: "/images/banners/banner-2.jpg",
    imageFit: "contain",
    short: "The banner featuring your loved one, sized for your yard.",
    details: ['24" × 18" Coroplast sign', 'Metal "H" stake included', "Single-sided print"],
    personalization: { kind: "banner-lookup" },
    fulfilledBy: "lvof",
  },
  {
    slug: "ambassador-cards",
    name: "Ambassador Cards",
    category: "memorial",
    price: 70,
    short: "Hand-out cards with your loved one's name and photo for rallies, events and info booths.",
    details: ['5" × 7" cards', "Pack of 200", "Featuring your loved one's photo and name"],
    personalization: { kind: "ambassador-card" },
    fulfilledBy: "lvof",
    featured: true,
  },
  {
    slug: "dont-die-for-one-high-yard-sign",
    name: "“Don’t Die for One High” Yard Sign",
    category: "awareness",
    price: 25,
    image: "/images/products/ddfoh-yard-sign.jpg",
    short: "Build awareness in your neighborhood.",
    details: ['24" × 18" Coroplast sign', "Single-sided print"],
    fulfilledBy: "lvof",
  },
  {
    slug: "thank-you-president-trump-yard-sign",
    name: "“Thank You President Trump” Yard Sign",
    category: "awareness",
    price: 25,
    short: "Corrugated yard sign, weatherproof for indoor or outdoor use.",
    details: ['18" × 24" corrugated sign', "Single-sided", "Stand not included"],
    fulfilledBy: "lvof",
  },
  {
    slug: "dont-die-for-one-high-bumper-sticker",
    name: "“Don’t Die for One High” Bumper Stickers",
    category: "awareness",
    price: 37,
    variantLabel: "Bundle",
    variants: [
      { id: "10", label: "Bundle of 10", price: 37 },
      { id: "20", label: "Bundle of 20", price: 67 },
      { id: "50", label: "Bundle of 50", price: 120 },
    ],
    image: "/images/products/ddfoh-sticker.jpg",
    imageFit: "contain",
    short: "Show your support and spread the word.",
    details: ["Sold in bundles", "Outdoor-rated vinyl"],
    fulfilledBy: "lvof",
  },
  {
    slug: "fentanyl-dealers-bumper-sticker",
    name: "“F*ck Fentanyl Dealers” Bumper Stickers",
    category: "awareness",
    price: 37,
    variantLabel: "Bundle",
    variants: [
      { id: "10", label: "Bundle of 10", price: 37 },
      { id: "20", label: "Bundle of 20", price: 67 },
      { id: "50", label: "Bundle of 50", price: 120 },
    ],
    image: "/images/products/dealers-sticker.jpg",
    imageFit: "contain",
    short: "Show your support and spread the word.",
    details: ["Sold in bundles", "Outdoor-rated vinyl"],
    fulfilledBy: "lvof",
  },
  {
    slug: "banner-binder",
    name: "Banner Binder",
    category: "banners",
    price: 120,
    image: "/images/products/banner-binder.jpg",
    short: "Every LVOF victim banner available on the date you order, collected in one binder.",
    details: ["Includes every current banner", "Ideal for events, schools and legislators"],
    fulfilledBy: "lvof",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: n % 1 ? 2 : 0 });
