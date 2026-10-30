# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

A marketing and booking site for Cristina Cristea (brand: Astro Kat), a
certified astrologer. It offers five chart readings, each booked and paid
through Cal.com. There is no backend, no cart and no shop.

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build -> dist/
npm run lint     # oxlint
```

`npm run build` is the real typecheck. `tsc --noEmit` on the root config is a
no-op for application files, because `tsconfig.json` only holds project
references — use `npm run build` (or `tsc -b --force`) to verify types.

## Stack

React 19 + TypeScript + Vite, `react-router-dom`, `lucide-react` for icons,
Radix primitives (via the `radix-ui` package) for Dialog, Select, Checkbox,
RadioGroup and DropdownMenu.

**There is no CSS framework.** No Tailwind, no CSS-in-JS. Styling is
hand-written CSS in two files:

- `src/index.css` — design tokens (`:root` custom properties) and base styles
- `src/styles/components.css` — component styles

Never introduce a hardcoded colour. Every colour comes from a token.

## Design tokens and accessibility

The site is audited against WCAG 2.1 AA. The token names encode contrast
decisions — picking the wrong one silently breaks the audit:

| Token          | Use for                                            |
|----------------|----------------------------------------------------|
| `--line`       | decorative only: dividers, card edges              |
| `--line-strong`| any boundary of a **control** (3:1, SC 1.4.11)     |
| `--gold`       | icons, rules, display text 24px and over           |
| `--gold-ink`   | small gold text (4.5:1)                            |
| `--ink-muted`  | the lightest permitted body-adjacent text          |
| `--error`      | error text and error borders                       |

Do not lighten any of these without re-checking against all three surfaces
text sits on: `--paper`, `--paper-warm`, `--sand`.

Other rules that are easy to break:

- **Every new page** must call `useDocumentTitle` — it sets the title and
  moves focus to `<main>` on route change (SC 2.4.2).
- **Form fields** wire `aria-describedby` to hint and error ids, set
  `aria-invalid`, and render a `role="alert"` summary that takes focus on a
  failed submit. New fields follow the same pattern.
- **Targets are 44×44 minimum.** Small visual controls (the 20px checkbox)
  get an invisible `::before { inset: -12px }` hit area rather than growing.
- **Reflow at 320px / 200% font**: grid and flex children need
  `min-width: 0`, and `fieldset` needs it explicitly to beat the UA
  `min-width: min-content`. Long unbreakable strings (emails) also need
  `overflow-wrap: anywhere`.
- **The mobile drawer** is a Radix Dialog. Its close button must stay *inside*
  the Dialog content — Radix aria-hides everything outside, so a close button
  mounted in the header is invisible to screen readers.

## i18n

Four locales: `en`, `fr-CH`, `de-CH`, `ro`, in `src/i18n/locales/`. The `Dict`
interface in `src/i18n/types.ts` is the contract — adding a key there breaks
the build until all four locales define it, which is intentional. Never add
user-visible English directly in a component; add a key.

The Swiss variants are not relabelled fr/de:

- **de-CH never uses ß** — always `ss` (Strasse). The only ß in the German
  file is inside the doc comment explaining this rule.
- **fr-CH uses septante (70) and nonante (90)**, not soixante-dix /
  quatre-vingt-dix. (huitante is regional, so 80 stays quatre-vingts.)

Currency and numbers go through `Intl.NumberFormat` via the `price` and `num`
helpers from the i18n context — never format money by hand.

## Deploying

Pushing to `main` builds and publishes to GitHub Pages via
`.github/workflows/deploy.yml`. **Changes are not live until pushed.**

Pages serves a project site from `/<repo>/`, so the workflow sets
`VITE_BASE=/cristina-cristea-astrology/` and the router reads
`import.meta.env.BASE_URL` as its basename. Pages has no rewrite rules, so the
workflow also copies `index.html` to `404.html` so deep links resolve. If the
repository is renamed, `VITE_BASE` must be updated to match.

## Contact form

`src/lib/contact.ts` posts the contact form to Web3Forms, which emails it to
cristina.cristea17@gmail.com (the address the access key was issued for).
The key is public by design. The visitor's email is sent as `email`, so
replying to the notification replies to the visitor. A hidden `botcheck`
honeypot filters basic spam. Messages pass through Web3Forms, so the privacy
notice should name them as a processor.

## Booking and scheduling

Booking is three steps: birth details, then date, time and payment, both on
one page (`src/pages/Booking.tsx`), then `/confirmation`. Step two embeds the
Cal.com link for the visitor's currency (`src/components/CalBooking.tsx`),
prefilled with name, email and a notes block holding the birth data and the
client's question, above a language note and the cancellation policy. Payment
is taken by Stripe inside the Cal.com embed; this site never sees card data.

`bookingSuccessfulV2` fires when Cal.com creates the booking. If
`paymentRequired` is set, the page stays on the calendar (the client pays
there) and shows a "complete your payment" note with an "I have paid" button
to the confirmation page; otherwise it goes straight to `/confirmation`,
passing reading, email, price, start time and `paymentPending` in router
state. The old cart, checkout and `checkout.ts` stub were removed on
30 Oct 2026; `/cart` and `/checkout` redirect to `/services`.

Availability (Tuesday–Friday 10:00–18:00 Europe/Bucharest), the 90-minute
length, the 30-minute buffer after each session, minimum notice and the
booking horizon live in Cal.com settings, not in this code. Every reading is
90 minutes. The privacy notice names Cal.com, Stripe, Google, Web3Forms,
GitHub Pages and Google Fonts as processors.

## Pricing

Every reading costs the same, in the visitor's currency (`src/lib/pricing.ts`):
CHF 180 (Switzerland), RON 350 (Romania), USD 200 (the Americas), EUR 190
(everyone else). The currency comes from the device time zone, decided once
per visit and exposed as `currency` / `sessionPrice` / `price()` on the i18n
context. Prices are shown on Services, the service pages, booking and the
confirmation, but **not on the home page** (it shows only "90 minutes").

`CAL_LINK_BY_CURRENCY` maps each currency to its Cal.com link:
`consultatie` (RON 350), `consultatie-chf` (CHF 180), `consultatie-eur`
(EUR 190), `consultatie-usd` (USD 200). They share one schedule, buffer and
48-hour notice. **Prices live in two places** — Cal.com charges, the site
displays — so change both together.

## Cancellation and refund policy

Chosen by Cristina on 23 Oct 2026. Shown on the date-and-time step in all four
locales (`booking.policy`) and set in each Cal.com link's Stripe refund
setting:

- Cancels 48 hours or more before: full refund, or free rescheduling
- Cancels less than 48 hours before: no refund, may reschedule once
- No-show: no refund
- Cristina cancels: full refund, always

She may revise it after checking the EU 14-day withdrawal right with Solo or
her accountant.

## Brand and social links

The public brand is **Astro Kat** (`src/lib/brand.ts`), with Cristina's name
shown smaller beneath it. It matches the Stripe statement descriptor.

Footer social links (`src/components/layout/Footer.tsx`): Instagram
`astrokat.official`, TikTok `@astrokat.official`. That TikTok is Cristina's
**Romanian-language** profile. When she creates an English TikTok, the
Romanian locale should keep this link and en / fr-CH / de-CH should point to
the English profile.

## Content status

- Real copy from Cristina: the About biography ("In her words") and her one
  qualification: certified astrologer (occupation "astrolog"), graduate of
  Școala de Științe Spirituale, Bucharest, Romania (plain "Graduate", without
  "in astrology"). She says the school is ministry-accredited but has not named
  the authority, so the site does not claim any ministry. The school name is
  translated per locale: School of Spiritual Sciences / École des sciences
  spirituelles / Schule für spirituelle Wissenschaften.
  The invented FAS diploma, memberships, "fifteen years", chart counts and
  the "Marta R." testimonial were removed on 23 Oct 2026. **Never add
  credentials, statistics or client reviews she has not supplied.**
- Cristina reads **only in Romanian and English** (she does not speak French
  or German); the fr-CH and de-CH versions of the site exist for visitors,
  not as session languages. This is stated on every service page, in the
  booking summary and as a highlighted note on the date-and-time step.
- Every client receives the session recording automatically (not "on
  request"), and she works with both Whole sign and Placidus houses. Still
  unconfirmed: the four About "values".
- Google Fonts loads from Google's CDN. Self-host if German/Swiss privacy
  exposure matters.
- There is no newsletter; the opt-in was removed from booking.
- The privacy notice (30 Oct 2026) uses Cristina's real details: Cristea
  Cristina PFA, Dumbrăvița, Timiș, Romania, cristina.cristea17@gmail.com,
  ANSPDCP as authority. The 24-month retention for birth data and notes is
  inherited placeholder policy she has not confirmed. Not reviewed by a lawyer.
