"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  key: string;
  slug: string;
  name: string;
  variant?: string;
  price: number;
  qty: number;
  image?: string;
  personalization?: Record<string, string>;
};

type Cart = {
  items: CartItem[];
  add: (item: Omit<CartItem, "key">) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  count: number;
  subtotal: number;
};

const Ctx = createContext<Cart | null>(null);
const STORAGE = "lvof-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  const save = (next: CartItem[]) => {
    setItems(next);
    try { localStorage.setItem(STORAGE, JSON.stringify(next)); } catch {}
  };

  const value: Cart = {
    items,
    add: (item) => save([...items, { ...item, key: `${item.slug}-${Date.now()}` }]),
    remove: (key) => save(items.filter((i) => i.key !== key)),
    setQty: (key, qty) => save(items.map((i) => (i.key === key ? { ...i, qty: Math.max(1, qty) } : i))),
    count: items.reduce((n, i) => n + i.qty, 0),
    subtotal: items.reduce((n, i) => n + i.qty * i.price, 0),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}
