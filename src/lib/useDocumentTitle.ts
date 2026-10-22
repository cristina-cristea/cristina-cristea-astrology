import { useEffect } from "react";
import { useI18n } from "../i18n/I18nProvider";
import { BRAND } from "./brand";

/** Brand and name are proper nouns, so the suffix is the same in every locale. */
const SUFFIX = `${BRAND} — Cristina Cristea`;

/**
 * Sets the document title for a route. A single-page app keeps one HTML
 * document, so without this every route announces the same title to screen
 * readers and lands in browser history identically (WCAG 2.4.2).
 */
export function useDocumentTitle(title?: string) {
  const { locale } = useI18n();

  useEffect(() => {
    document.title = title ? `${title} — ${SUFFIX}` : SUFFIX;
  }, [title, locale]);
}
