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

const STORAGE_KEY = "cs.cart.v1";

/**
 * Callers pass the already-localised name, so a basket built in one language
 * keeps its labels if the visitor switches.
 */
interface LineSeed {
  id: string;
  slug: string;
  name: string;
  price: number;
}

interface CartValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  addService: (service: LineSeed, intake: IntakeData) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartValue | null>(null);

/**
 * Two bookings of the same reading are distinct lines — they carry different
 * birth data — so the submission timestamp disambiguates them.
 */
export const lineKey = (l: CartLine) => `${l.id}:${l.intake.submittedAt}`;

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
    setLines((prev) => [...prev, { ...service, intake }]);
  }, []);

  const remove = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => lineKey(l) !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartValue>(() => ({
    lines,
    count: lines.length,
    subtotal: lines.reduce((n, l) => n + l.price, 0),
    addService,
    remove,
    clear,
  }), [lines, addService, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
