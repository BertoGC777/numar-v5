import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { Product } from "@/data/products";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  pricePix: number;
  priceCard: number;
  color: string;
  colorIdx: number;
  size: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  addItem: (product: Product, color: string, size: string, qty?: number) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
};

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "numar.cart.v1";
const itemKey = (i: Pick<CartItem, "productId" | "color" | "size">) => `${i.productId}-${i.color}-${i.size}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem: CartContextType["addItem"] = (product, color, size, qty = 1, colorIdx = 0) => {
    setItems((prev) => {
      const key = itemKey({ productId: product.id, color, size });
      const existing = prev.find((i) => itemKey(i) === key);
      if (existing) {
        return prev.map((i) => (itemKey(i) === key ? { ...i, quantity: i.quantity + qty } : i));
      }
      return [
        ...prev,
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.images[colorIdx] ?? product.images[0],
          pricePix: product.pricePix,
          priceCard: product.priceCard,
          color,
          colorIdx,
          size,
          quantity: qty,
        },
      ];
    });
    setIsOpen(true);
  };

  const removeItem = (key: string) => setItems((prev) => prev.filter((i) => itemKey(i) !== key));
  const updateQty = (key: string, qty: number) =>
    setItems((prev) => prev.map((i) => (itemKey(i) === key ? { ...i, quantity: Math.max(1, qty) } : i)));

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.pricePix * i.quantity, 0), [items]);
  const count = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        toggle: () => setIsOpen((v) => !v),
        addItem,
        removeItem,
        updateQty,
        clear: () => setItems([]),
        subtotal,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export { itemKey };
