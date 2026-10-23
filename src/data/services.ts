import type { Glyph } from "../types";

/**
 * Structural facts about each reading. All display copy lives in the locale
 * dictionaries (`t.serviceCopy[id]`) so it can be translated — only data that
 * is the same in every language stays here.
 */
export interface Service {
  id: string;
  slug: string;
  durationMinutes: number;
  glyph: Glyph;
  /** Collects a second person's birth data (synastry / composite). */
  requiresPartner?: boolean;
  /** Collects a target year (solar return, forecasting). */
  requiresYear?: boolean;
}

export const services: Service[] = [
  { id: "svc_natal",      slug: "natal-chart",            durationMinutes: 90,  glyph: "chart" },
  { id: "svc_forecast",   slug: "previsional-forecasting", durationMinutes: 90,  glyph: "transits", requiresYear: true },
  { id: "svc_synastry",   slug: "relationship-chart",      durationMinutes: 90,  glyph: "venus",  requiresPartner: true },
  { id: "svc_solar",      slug: "solar-return",            durationMinutes: 90,  glyph: "sun",    requiresYear: true },
  { id: "svc_progressed", slug: "progressed-chart",        durationMinutes: 90,  glyph: "moon" },
];

export const getService = (slug?: string) => services.find((s) => s.slug === slug);
