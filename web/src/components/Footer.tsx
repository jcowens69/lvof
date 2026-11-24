import Link from "next/link";
import { Bird } from "./Logo";

const cols = [
  {
    title: "Remember",
    links: [
      ["Memorial Wall", "/victims"],
      ["Find a Loved One", "/victims/search"],
      ["Submit a Loved One", "/victims/submit"],
      ["Victim Banners", "/victims/banners"],
    ],
  },
  {
    title: "Take Action",
    links: [
      ["Shop", "/shop"],
      ["Printable Resources", "/resources"],
      ["Donate", "/donate"],
      ["Blog", "/blog"],
    ],
  },
  {
    title: "Organization",
    links: [
      ["About Us", "/about"],
      ["Contact", "/contact"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface/60 mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 grid gap-12 lg:grid-cols-[1.4fr_2fr]">
        <div className="max-w-sm">
          <Bird className="h-12 w-auto mb-5" />
          <p className="font-display text-2xl leading-snug">The days of crying behind closed doors are over.</p>
          <p className="text-sm text-muted mt-4 leading-relaxed">
            A 501(c)(3) nonprofit of bereaved families devoted to public awareness, education and prevention of illicit fentanyl poisonings.
          </p>
          <p className="text-xs text-muted mt-4">Tax ID / EIN 87-2271656</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
          {cols.map((c) => (
            <div key={c.title}>
              <p className="eyebrow mb-4">{c.title}</p>
              <ul className="space-y-2.5">
                {c.links.map(([label, href]) => (
                  <li key={href}><Link href={href} className="text-sm text-fg/80 hover:text-fg">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 sm:col-span-3 text-sm text-muted leading-relaxed">
            <p className="eyebrow mb-3">Reach us</p>
            P.O. Box 21753, Dundalk, MD 21222 ·{" "}
            <a href="mailto:aprilbb33@icloud.com" className="text-fg/80 hover:text-fg underline decoration-line underline-offset-4">aprilbb33@icloud.com</a>
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row gap-2 justify-between text-xs text-muted">
          <p>© {new Date().getFullYear()} Lost Voices of Fentanyl. All rights reserved.</p>
          <p>If you or someone you know needs help, call or text <a className="text-fg/80" href="tel:988">988</a> or SAMHSA at <a className="text-fg/80" href="tel:18006624357">1-800-662-4357</a>.</p>
        </div>
      </div>
    </footer>
  );
}
