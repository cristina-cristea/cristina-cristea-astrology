import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { LOCALES, LOCALE_META } from "./types";
import type { Dict, Locale } from "./types";
import { en } from "./locales/en";
import { frCH } from "./locales/fr-CH";
import { deCH } from "./locales/de-CH";
import { ro } from "./locales/ro";

const DICTS: Record<Locale, Dict> = { en, "fr-CH": frCH, "de-CH": deCH, ro };
const STORAGE_KEY = "cs.locale.v1";

interface I18nValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dict;
  /** Currency, formatted for the active locale. */
  price: (n: number) => string;
  /** Plain number, locale-grouped (Swiss locales use an apostrophe). */
  num: (n: number) => string;
  /** Date and time of an ISO timestamp, in the visitor's own time zone. */
  dateTime: (iso: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

const isLocale = (v: unknown): v is Locale =>
  typeof v === "string" && (LOCALES as readonly string[]).includes(v);

/** Stored choice first, then the browser's preference, then English. */
function initialLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved)) return saved;
  } catch {
    /* storage unavailable */
  }
  for (const pref of navigator.languages ?? []) {
    const exact = LOCALES.find((l) => l.toLowerCase() === pref.toLowerCase());
    if (exact) return exact;
    // "de" or "de-AT" both fall through to the Swiss variant we ship
    const base = pref.split("-")[0].toLowerCase();
    const loose = LOCALES.find((l) => l.split("-")[0].toLowerCase() === base);
    if (loose) return loose;
  }
  return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    // Screen readers switch voice/pronunciation from this. WCAG 3.1.1.
    document.documentElement.lang = LOCALE_META[locale].htmlLang;
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* storage unavailable — choice lasts for this session only */
    }
  }, [locale]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);

  const value = useMemo<I18nValue>(() => {
    const intl = LOCALE_META[locale].intl;
    return {
      locale,
      setLocale,
      t: DICTS[locale],
      price: (n: number) =>
        new Intl.NumberFormat(intl, {
          style: "currency",
          currency: "EUR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(n),
      num: (n: number) => new Intl.NumberFormat(intl).format(n),
      dateTime: (iso: string) =>
        new Intl.DateTimeFormat(intl, {
          weekday: "long",
          day: "numeric",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(iso)),
    };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
