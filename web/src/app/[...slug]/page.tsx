import Link from "next/link";
import { notFound } from "next/navigation";

const pages: Record<string, { title: string; blurb: string }> = {
  about: { title: "About Us", blurb: "Our story, our families, and our mission." },
  victims: { title: "Memorial Wall", blurb: "The faces of the lives we've lost to fentanyl poisoning." },
  "victims/search": { title: "Find a Loved One", blurb: "Search our records to see which banner your loved one is on." },
  "victims/submit": { title: "Submit a Loved One", blurb: "Register your loved one with Lost Voices of Fentanyl." },
  "victims/banners": { title: "Victim Banners", blurb: "Every Lost Voices of Fentanyl banner." },
  resources: { title: "Printable Resources", blurb: "Postcards, flyers and brochures to share the facts." },
  blog: { title: "Blog", blurb: "News, stories and updates from our families." },
  contact: { title: "Contact", blurb: "We're here to help." },
  donate: { title: "Donate", blurb: "Support the fight against illicit fentanyl." },
};

export function generateStaticParams() {
  return Object.keys(pages).map((k) => ({ slug: k.split("/") }));
}

export default async function Placeholder({ params }: { params: Promise<{ slug: string[] }> }) {
  const key = (await params).slug.join("/");
  const page = pages[key];
  if (!page) notFound();
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-20 text-center">
      <p className="eyebrow mb-4">Coming soon</p>
      <h1 className="font-display text-5xl font-light">{page.title}</h1>
      <p className="mt-5 text-lg text-fg/75">{page.blurb}</p>
      <p className="mt-3 text-sm text-muted">This page is being rebuilt as part of the new site.</p>
      <Link href="/" className="btn btn-ghost mt-10">Back home</Link>
    </div>
  );
}
