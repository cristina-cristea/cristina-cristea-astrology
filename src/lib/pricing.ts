/**
 * One price for every reading, set by where the visitor is:
 * Switzerland pays in CHF, Romania in RON, the Americas in USD, and everyone
 * else (the rest of Europe and any other country) in EUR.
 *
 * The visitor's region comes from their device's time zone. That needs no
 * location lookup or third-party service, so nothing about the visitor
 * leaves the browser. It can be wrong for someone travelling or using a VPN,
 * which is acceptable for showing a price.
 */
export type Currency = "CHF" | "EUR" | "USD" | "RON";

export const SESSION_PRICE: Record<Currency, number> = {
  CHF: 180,
  EUR: 180,
  USD: 199,
  RON: 350,
};

/**
 * Cal.com booking link per currency. Each Cal.com link carries one price in
 * one currency (set in Cal.com once Stripe is connected). All four share the
 * same availability, buffer and notice settings, so they cannot double-book.
 */
export const CAL_LINK_BY_CURRENCY: Record<Currency, string> = {
  CHF: "cristina-cristea/consultatie-chf",
  EUR: "cristina-cristea/consultatie-eur",
  USD: "cristina-cristea/consultatie-usd",
  RON: "cristina-cristea/consultatie",
};

const CHF_ZONES = ["Europe/Zurich", "Europe/Vaduz", "Europe/Busingen"];
const RON_ZONES = ["Europe/Bucharest"];

export function currencyForTimeZone(tz: string | undefined): Currency {
  if (!tz) return "EUR";
  if (CHF_ZONES.includes(tz)) return "CHF";
  if (RON_ZONES.includes(tz)) return "RON";
  if (tz.startsWith("America/")) return "USD";
  return "EUR";
}

export function detectCurrency(): Currency {
  try {
    return currencyForTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  } catch {
    return "EUR";
  }
}

/**
 * Formats an amount the way people in that language expect to read it:
 * "350 lei" in Romanian, "$199" in English, "CHF 180" in Swiss German.
 */
export function formatPrice(amount: number, currency: Currency, intlLocale: string): string {
  const narrow =
    (currency === "RON" && intlLocale.startsWith("ro")) ||
    (currency === "USD" && intlLocale.startsWith("en"));
  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency,
    currencyDisplay: narrow ? "narrowSymbol" : "symbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
