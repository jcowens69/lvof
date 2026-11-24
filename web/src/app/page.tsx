import Image from "next/image";
import Link from "next/link";
import { products, money } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

const banners = [1, 2, 3, 4, 5, 6, 7].map((n) => `/images/banners/banner-${n}.jpg`);

function BannerRow({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const loop = [...items, ...items];
  return (
    <div className={`flex gap-4 w-max ${reverse ? "animate-marquee-rev" : "animate-marquee"}`}>
      {loop.map((src, i) => (
        <Image key={i} src={src} alt="" width={1500} height={762} className="h-[34vh] min-h-56 w-auto rounded-xl" priority={i < 3} />
      ))}
    </div>
  );
}

const facts = [
  {
    title: "What is illicit fentanyl?",
    body: "Illicit fentanyl is not the prescription-grade product used in U.S. medicine. The base molecule is modified to increase potency, or chemical substitutes are added during processing, making it exceedingly potent and unfit for human use.",
  },
  {
    title: "Where is it coming from?",
    body: "China began mass-manufacturing illicit fentanyl products as early as 2013 and remains the number-one global source of illicit fentanyl and its precursor chemicals, working with Mexico's drug cartels.",
  },
  {
    title: "How is it harming the public?",
    body: "Fake pills made to look like Xanax, Adderall, Percocet and Oxycodone have flooded U.S. black markets, and fentanyl now contaminates cocaine, ecstasy, meth, marijuana and more.",
  },
];

const actions = [
  {
    href: "/victims/submit",
    eyebrow: "Remember",
    title: "Add your loved one to our banners",
    body: "Share their photo and story so their face is seen at rallies, schools and capitols across the country.",
    cta: "Submit a loved one",
  },
  {
    href: "/victims/search",
    eyebrow: "Find",
    title: "See which banner they're on",
    body: "Search our records to find your loved one's banner and order a print for your home or vehicle.",
    cta: "Find a loved one",
  },
  {
    href: "/resources",
    eyebrow: "Educate",
    title: "Spread the facts",
    body: "Free printable postcards, flyers and brochures for schools, events, and your community board.",
    cta: "Printable resources",
  },
];

export default function Home() {
  const featured = products.filter((p) => p.featured);

  return (
    <>
      {/* HERO */}
      <section className="relative -mt-18 overflow-hidden min-h-[92vh] flex items-center">
        <div className="absolute inset-0 flex flex-col justify-center gap-4 opacity-55 -rotate-3 scale-110" aria-hidden>
          <BannerRow items={banners.slice(0, 4)} />
          <BannerRow items={banners.slice(3)} reverse />
          <BannerRow items={[banners[5], banners[1], banners[6], banners[0]]} />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,9,16,.96)_0%,rgba(11,9,16,.85)_40%,rgba(11,9,16,.45)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-32 pb-24 w-full">
          <div className="max-w-3xl">
            <p className="eyebrow mb-6">Bereaved families fighting illicit fentanyl</p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-light leading-[1.04] tracking-tight">
              The days of crying behind closed doors are <em className="text-lilac not-italic font-normal">over.</em>
            </h1>
            <p className="mt-7 text-lg text-fg/80 max-w-2xl leading-relaxed">
              Every face behind these words was a son, a daughter, a parent, a friend. We carry their voices into
              schools, rallies and capitols so no other family has to lose someone to fentanyl poisoning.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/victims/submit" className="btn btn-primary">Honor your loved one</Link>
              <Link href="/donate" className="btn btn-ghost">Donate to the fight</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CALLOUT */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-24 text-center">
        <p className="eyebrow mb-6">Words matter · Just say it</p>
        <h2 className="font-display text-4xl sm:text-5xl font-light leading-tight">
          Most victims <span className="text-candle">did not know</span> they were about to consume fentanyl.
        </h2>
        <p className="mt-8 text-lg text-fg/75 max-w-3xl mx-auto leading-relaxed">
          When someone hides a deadly substance in something another person takes, without their knowledge or intent,
          it is a <strong className="text-fg font-semibold">poisoning</strong>, not an overdose. There is no safe dose of
          illicit fentanyl, and no instructions being ignored.
        </p>
      </section>

      {/* FACTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="eyebrow mb-3">The facts</p>
            <h2 className="font-display text-3xl sm:text-4xl font-light">Illicit fentanyl, explained</h2>
          </div>
          <Link href="/resources" className="text-sm font-semibold text-lilac hover:text-fg">Download fact sheets →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {facts.map((f, i) => (
            <article key={f.title} className="rounded-3xl border border-line bg-surface p-8 relative overflow-hidden">
              <span className="block font-display text-5xl font-light text-brand/50 mb-6" aria-hidden>0{i + 1}</span>
              <h3 className="font-display text-2xl mb-4">{f.title}</h3>
              <p className="text-fg/75 leading-relaxed">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* BANNERS FEATURE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-28 grid lg:grid-cols-[1fr_1.3fr] gap-12 items-center">
        <div>
          <p className="eyebrow mb-3">Victim banners</p>
          <h2 className="font-display text-4xl sm:text-5xl font-light leading-tight">Their faces, impossible to ignore.</h2>
          <p className="mt-6 text-fg/75 text-lg leading-relaxed">
            Our banners carry the faces of the people fentanyl has taken, each one forever the age they were lost.
            Families bring them to rallies, hearings and vigils, and display them at home.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/victims/banners" className="btn btn-primary">View all banners</Link>
            <Link href="/shop/victim-banner" className="btn btn-ghost">Order a banner</Link>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 bg-brand/20 blur-3xl rounded-full" aria-hidden />
          <Image src={banners[0]} alt="A Lost Voices of Fentanyl victim banner showing 56 faces" width={1500} height={762} className="relative rounded-2xl glow-ring" />
        </div>
      </section>

      {/* ACTIONS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid md:grid-cols-3 gap-5">
          {actions.map((a) => (
            <Link key={a.href} href={a.href} className="group rounded-3xl border border-line bg-gradient-to-b from-surface-2 to-surface p-8 hover:border-brand/60 transition">
              <p className="eyebrow mb-4">{a.eyebrow}</p>
              <h3 className="font-display text-2xl leading-snug">{a.title}</h3>
              <p className="text-fg/70 mt-3 leading-relaxed">{a.body}</p>
              <p className="mt-6 text-sm font-semibold text-lilac group-hover:text-fg transition">{a.cta} →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* SHOP */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-28">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="eyebrow mb-3">Shop with purpose</p>
            <h2 className="font-display text-3xl sm:text-4xl font-light">Keep their memory in sight</h2>
            <p className="text-fg/70 mt-3 max-w-xl">Personalized yard signs, cards and banners. Every purchase funds awareness and prevention.</p>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-lilac hover:text-fg">Shop everything →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>

      {/* DONATE BAND */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-brand/40 bg-[radial-gradient(ellipse_at_top_left,#3b2785_0%,#1a1328_55%,#120e1b_100%)] px-8 py-16 sm:px-16 sm:py-20">
          <Image src="/images/hummingbird.png" alt="" width={541} height={443} className="absolute -right-10 -bottom-10 w-80 opacity-10 rotate-12" aria-hidden />
          <div className="relative max-w-2xl">
            <p className="eyebrow mb-4 !text-candle">Stand with us</p>
            <h2 className="font-display text-4xl sm:text-5xl font-light leading-tight">Your gift puts their faces where decisions are made.</h2>
            <p className="mt-6 text-fg/80 text-lg leading-relaxed">
              Donations fund banners, printed resources and the events where families speak for the ones they lost.
              Lost Voices of Fentanyl is a 501(c)(3); your gift is tax-deductible.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              {[25, 50, 100].map((n) => (
                <Link key={n} href={`/donate?amount=${n}`} className="btn btn-ghost !px-6">{money(n)}</Link>
              ))}
              <Link href="/donate" className="btn btn-candle">Give now</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
