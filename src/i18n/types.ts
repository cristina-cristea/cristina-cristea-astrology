/**
 * Four locales. French and German are the Swiss standard variants, which are
 * not cosmetic relabels of fr/de — they differ in orthography and numerals:
 *
 *  - de-CH never uses ß. It is always "ss" (Strasse, nicht Straße). This is
 *    the defining rule of Schweizer Hochdeutsch and the most visible way a
 *    translation betrays itself as German rather than Swiss German.
 *  - fr-CH uses septante (70) and nonante (90) in place of soixante-dix and
 *    quatre-vingt-dix. (huitante for 80 is Vaud/Valais/Fribourg, not Geneva,
 *    so it is avoided here.)
 *  - Both Swiss locales group thousands with an apostrophe: 1'234.
 */
export const LOCALES = ["en", "fr-CH", "de-CH", "ro"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_META: Record<
  Locale,
  { label: string; short: string; htmlLang: string; intl: string }
> = {
  en:      { label: "English",  short: "EN", htmlLang: "en",    intl: "en-GB" },
  "fr-CH": { label: "Français", short: "FR", htmlLang: "fr-CH", intl: "fr-CH" },
  "de-CH": { label: "Deutsch",  short: "DE", htmlLang: "de-CH", intl: "de-CH" },
  ro:      { label: "Română",   short: "RO", htmlLang: "ro",    intl: "ro-RO" },
};

export interface ServiceCopy {
  name: string;
  tagline: string;
  summary: string;
  description: string[];
  includes: string[];
  goodFor: string[];
  delivery: string;
  turnaround: string;
}

export interface Dict {
  nav: { services: string; about: string; contact: string; home: string; basket: string; menuOpen: string; menuClose: string; skip: string; primary: string; mobile: string };
  common: { minutes: string; from: string; total: string; subtotal: string; shipping: string; free: string; required: string; optional: string; email: string; back: string; allReadings: string; allProducts: string; continueShopping: string; remove: string; quantity: string; increase: string; decrease: string; currentStep: string; completed: string };
  home: { eyebrow: string; titleA: string; titleB: string; lead: string; bookCta: string; meetCta: string; practiceEyebrow: string; practiceTitle: string; practiceBodyA: string; practiceBodyB: string; statCertified: string; statCertifiedSub: string; statCharts: string; statChartsSub: string; statYears: string; statYearsSub: string; readingsEyebrow: string; readingsTitle: string; readingsNote: string; notSure: string; notSureBody: string; askCristina: string; stepsEyebrow: string; stepsTitle: string; steps: [string, string][]; quote: string; quoteBy: string; };
  services: { pageEyebrow: string; pageTitle: string; pageLead: string; giftEyebrow: string; giftTitle: string; giftBody: string; giftCta: string; viewReading: string; readingLabel: string; session: string; deliveryLabel: string; availability: string; whatThisIs: string; whatYouReceive: string; suitedTo: string; alsoConsider: string; otherReadings: string; beginBooking: string; bookingNote: string };
  booking: { step: string; title: string; lead: string; yourChart: string; secondChart: string; secondChartHint: string; contact: string; consent: string; fullNameAtBirth: string; theirFullName: string; placeOfBirth: string; placeHint: string; dateOfBirth: string; timeOfBirth: string; timeHint: string; timeUnknown: string; emailLabel: string; emailHint: string; solarYear: string; forecastYear: string; solarYearHint: string; forecastYearHint: string; focusLabel: string; focusPlaceholder: string; gdprConsent: string; privacyNotice: string; marketingOptIn: string; dataNote: string; submit: string; reviewNote: string; yourBooking: string; problemsOne: string; problemsMany: string; steps: [string, string, string] };
  errors: { name: string; date: string; futureDate: string; time: string; place: string; emailRequired: string; emailInvalid: string; gdpr: string; terms: string; address: string; city: string; postcode: string; message: string; contactConsent: string; nameShort: string; focus: string };
  checkout: { step: string; title: string; lead: string; billing: string; delivery: string; paymentMethod: string; card: string; cardSub: string; paypal: string; paypalSub: string; secureNote: string; terms: string; pay: string; redirecting: string; orderSummary: string; editBasket: string; fullName: string; emailHint: string; street: string; city: string; postcode: string; country: string; countries: string[] };
  cart: { title: string; eyebrow: string; empty: string; emptyLead: string; browse: string; summary: string; checkout: string; reading: string; oneSession: string; name: string; born: string; timeUnknown: string; place: string; secondChart: string; year: string };
  confirmation: { order: string; thanks: string; lead: string; paid: string; chooseSlot: string; chooseSlotBody: string; nothing: string; nothingBody: string; backHome: string };
  about: { eyebrow: string; title: string; lead: string; portraitAlt: string; wordsEyebrow: string; words: string[]; credentials: string; credentialsList: string[]; practice: string; practiceList: string[]; values: [string, string][]; beginEyebrow: string; beginTitle: string; beginLead: string; natalCta: string; allCta: string };
  contact: { eyebrow: string; title: string; lead: string; yourMessage: string; name: string; subject: string; subjects: string[]; message: string; messagePlaceholder: string; consent: string; send: string; sending: string; sendFailed: string; sent: string; sentLead: string; direct: string; emailLabel: string; sessions: string; sessionsValue: string; location: string; locationValue: string; dataNote: string };
  privacy: { eyebrow: string; title: string; lead: string; sections: { h: string; p: string[] }[]; updated: string; ask: string };
  notFound: { eyebrow: string; title: string; lead: string; home: string; browse: string };
  footer: { tagline: string; readings: string; studio: string; privacy: string; disclaimer: string; instagram: string };
  serviceCopy: Record<string, ServiceCopy>;
}
