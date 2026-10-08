import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { CartLine, IntakeData } from "../types";

/**
 * The cart stores the product name as it was shown when added, so a basket
 * built in one language keeps its labels if the visitor switches. Callers
 * pass the already-localised name rather than a data record.
 */
interface LineSeed {
  id: string;
  slug: string;
  name: string;
  price: number;
}

const STORAGE_KEY = "cs.cart.v1";

interface CartValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  addService: (service: LineSeed, intake: IntakeData) => void;
  addMerch: (item: LineSeed, variant?: string, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartValue | null>(null);

/** Stable identity for a line: merch of the same variant stacks, services never do. */
export const lineKey = (l: CartLine) =>
  l.kind === "service" ? `${l.id}:${l.intake.submittedAt}` : `${l.id}:${l.variant ?? "-"}`;

const read = (): CartLine[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(read);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable — cart stays in memory for this session */
    }
  }, [lines]);

  const addService = useCallback((service: LineSeed, intake: IntakeData) => {
    setLines((prev) => [
      ...prev,
      {
        kind: "service",
        id: service.id,
        slug: service.slug,
        name: service.name,
        price: service.price,
        qty: 1,
        intake,
      },
    ]);
  }, []);

  const addMerch = useCallback((item: LineSeed, variant?: string, qty = 1) => {
    setLines((prev) => {
      const i = prev.findIndex(
        (l) => l.kind === "merch" && l.id === item.id && l.variant === variant
      );
      if (i > -1) {
        const next = [...prev];
        const line = next[i];
        if (line.kind === "merch") next[i] = { ...line, qty: line.qty + qty };
        return next;
      }
      return [
        ...prev,
        { kind: "merch", id: item.id, slug: item.slug, name: item.name, price: item.price, qty, variant },
      ];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      prev.flatMap((l) => {
        if (lineKey(l) !== key) return [l];
        if (qty < 1) return [];
        return l.kind === "merch" ? [{ ...l, qty }] : [l];
      })
    );
  }, []);

  const remove = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => lineKey(l) !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartValue>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + l.price * l.qty, 0);
    return { lines, count, subtotal, addService, addMerch, setQty, remove, clear };
  }, [lines, addService, addMerch, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
