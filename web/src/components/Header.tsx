"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { useCart } from "@/lib/cart";

const nav = [
  { href: "/about", label: "About" },
  {
    href: "/victims",
    label: "Victims",
    children: [
      { href: "/victims", label: "Memorial Wall", desc: "Faces of the lives we've lost" },
      { href: "/victims/search", label: "Find a Loved One", desc: "See which banner they're on" },
      { href: "/victims/submit", label: "Submit a Loved One", desc: "Add them to our banners" },
      { href: "/victims/banners", label: "Victim Banners", desc: "View every banner" },
    ],
  },
  { href: "/shop", label: "Shop" },
  { href: "/resources", label: "Resources" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { count } = useCart();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "bg-bg/85 backdrop-blur-xl border-b border-line" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-18 flex items-center gap-6">
        <Logo />
        <nav className="hidden lg:flex items-center gap-1 ml-auto" aria-label="Main">
          {nav.map((item) =>
            item.children ? (
              <div key={item.label} className="relative group">
                <Link href={item.href} className="px-3 py-2 text-sm font-medium text-fg/85 hover:text-fg inline-flex items-center gap-1">
                  {item.label}
                  <svg width="10" height="10" viewBox="0 0 10 10" className="opacity-60" aria-hidden><path d="M2 3.5l3 3 3-3" stroke="currentColor" fill="none" strokeWidth="1.5" /></svg>
                </Link>
                <div className="invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 transition absolute left-1/2 -translate-x-1/2 pt-3">
                  <div className="w-72 rounded-2xl border border-line bg-surface/95 backdrop-blur-xl p-2 shadow-2xl">
                    {item.children.map((c) => (
                      <Link key={c.href + c.label} href={c.href} className="block rounded-xl px-4 py-3 hover:bg-surface-2">
                        <span className="block text-sm font-semibold">{c.label}</span>
                        <span className="block text-xs text-muted mt-0.5">{c.desc}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium hover:text-fg ${pathname.startsWith(item.href) ? "text-fg" : "text-fg/85"}`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <div className="flex items-center gap-2 ml-auto lg:ml-4">
          <Link href="/cart" className="relative p-2 rounded-full hover:bg-surface-2" aria-label={`Cart, ${count} items`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M6 7h12l-1 13H7L6 7z" /><path d="M9 7a3 3 0 016 0" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-brand text-[11px] font-bold grid place-items-center">{count}</span>
            )}
          </Link>
          <Link href="/donate" className="btn btn-candle !py-2.5 !px-5 hidden sm:inline-flex">Donate</Link>
          <button
            className="lg:hidden p-2 rounded-full hover:bg-surface-2"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-line px-4 pb-6 pt-2 max-h-[80vh] overflow-y-auto">
          {nav.map((item) => (
            <div key={item.label} className="border-b border-line/60 py-1">
              {item.children ? (
                <>
                  <p className="eyebrow pt-3 pb-1">{item.label}</p>
                  {item.children.map((c) => (
                    <Link key={c.label} href={c.href} className="block py-2.5 text-lg">{c.label}</Link>
                  ))}
                </>
              ) : (
                <Link href={item.href} className="block py-3 text-lg">{item.label}</Link>
              )}
            </div>
          ))}
          <Link href="/donate" className="btn btn-candle w-full mt-5">Donate</Link>
        </div>
      )}
    </header>
  );
}
