import { useEffect } from "react";
import { useI18n } from "../i18n/I18nProvider";
import type { Locale } from "../i18n/types";

/** The name is a proper noun and never translates; the descriptor does. */
const SUFFIX: Record<Locale, string> = {
  en: "Cristina Cristea — Astrology",
  "fr-CH": "Cristina Cristea — Astrologie",
  "de-CH": "Cristina Cristea — Astrologie",
  ro: "Cristina Cristea — Astrologie",
};

/**
 * Sets the document title for a route. A single-page app keeps one HTML
 * document, so without this every route announces the same title to screen
 * readers and lands in browser history identically (WCAG 2.4.2).
 */
export function useDocumentTitle(title?: string) {
  const { locale } = useI18n();

  useEffect(() => {
    const suffix = SUFFIX[locale];
    document.title = title ? `${title} — ${suffix}` : suffix;
  }, [title, locale]);
}
