import type { Glyph } from "../types";

/** Structural facts only; display copy lives in `t.merchCopy[id]`. */
export interface MerchItem {
  id: string;
  slug: string;
  price: number;            // EUR
  /** Index into the locale's `merch.categories` array. 0 is "All". */
  categoryIndex: number;
  glyph: Glyph;
}

export const merch: MerchItem[] = [
  { id: "mrc_natal_print",          slug: "custom-natal-chart-print", price: 68, categoryIndex: 1, glyph: "chart" },
  { id: "mrc_lunar_journal",        slug: "lunar-journal",            price: 34, categoryIndex: 2, glyph: "moon" },
  { id: "mrc_ephemeris",            slug: "pocket-ephemeris",         price: 42, categoryIndex: 2, glyph: "orbit" },
  { id: "mrc_constellation_candle", slug: "constellation-candle",     price: 46, categoryIndex: 3, glyph: "star" },
  { id: "mrc_zodiac_tee",           slug: "zodiac-glyph-tee",         price: 52, categoryIndex: 4, glyph: "rising" },
  { id: "mrc_card_deck",            slug: "aspect-card-deck",         price: 38, categoryIndex: 2, glyph: "comet" },
];

export const getMerch = (slug?: string) => merch.find((m) => m.slug === slug);
