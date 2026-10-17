import type { Glyph } from "../types";

/**
 * Structural facts about each reading. All display copy lives in the locale
 * dictionaries (`t.serviceCopy[id]`) so it can be translated — only data that
 * is the same in every language stays here.
 */
export interface Service {
  id: string;
  slug: string;
  price: number;            // EUR
  durationMinutes: number;
  glyph: Glyph;
  /** Collects a second person's birth data (synastry / composite). */
  requiresPartner?: boolean;
  /** Collects a target year (solar return, forecasting). */
  requiresYear?: boolean;
}

export const services: Service[] = [
  { id: "svc_natal",      slug: "natal-chart",            price: 180, durationMinutes: 90,  glyph: "chart" },
  { id: "svc_forecast",   slug: "previsional-forecasting", price: 210, durationMinutes: 90,  glyph: "transits", requiresYear: true },
  { id: "svc_synastry",   slug: "relationship-chart",      price: 240, durationMinutes: 105, glyph: "venus",  requiresPartner: true },
  { id: "svc_solar",      slug: "solar-return",            price: 165, durationMinutes: 75,  glyph: "sun",    requiresYear: true },
  { id: "svc_progressed", slug: "progressed-chart",        price: 190, durationMinutes: 90,  glyph: "moon" },
];

export const getService = (slug?: string) => services.find((s) => s.slug === slug);
