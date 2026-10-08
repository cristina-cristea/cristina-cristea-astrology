# Cristina Cristea — Astrology

Marketing site and storefront for a certified astrologer. React + TypeScript +
Vite, client-side routed, no backend.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview
```

## Structure

```
src/
  data/services.ts    the five chart readings, each its own product
  data/merch.ts       shop items
  context/CartContext.tsx   basket, persisted to localStorage
  lib/checkout.ts     payment-provider handoff  ← wire this up
  pages/              one file per route
  components/ui/Glyph.tsx   the celestial line artwork
  styles/components.css     component styles
  index.css                 design tokens + base
```

## The two purchase flows

**Readings** — deliberately gated. `/services/:slug` → `/services/:slug/booking`
(birth data + explicit GDPR consent, all validated) → `/checkout` → `/confirmation`.
A reading cannot reach the basket without intake data; the type system enforces
it (`CartLine` of kind `service` requires an `IntakeData`).

**Merch** — no intake. `/merch/:slug` → add to basket → `/checkout`. The
delivery-address fieldset and the €8 under-€120 shipping charge appear only when
the basket holds a physical item.

Services that need extra fields declare it in `data/services.ts`:
`requiresPartner` adds a second birth-data block (relationship chart),
`requiresYear` adds a year selector (solar return, forecasting).

## Wiring up payment

`src/lib/checkout.ts` is the single seam. It currently resolves after a short
delay so the flow is walkable end to end. Card data must never touch this front
end — replace the stub with:

1. `POST` the payload to your own endpoint (`/api/checkout`).
2. Server-side, create the session with your provider's secret key
   (Stripe: `stripe.checkout.sessions.create`).
3. Return `session.url` and `window.location.href = session.url`.
4. Fulfil from the provider's **webhook**, never from the browser returning to
   the success page.

Store the intake data against the order server-side and reference it by id — do
not send birth data to the payment provider.

## GDPR

Birth data is special-category personal data, so the booking form blocks on an
unticked consent box, marketing opt-in is separate and optional, and
`/privacy` documents purpose, retention (24 months) and erasure. Whoever
operates the site still needs to honour erasure requests in whatever store the
server writes to.

## Accessibility

Audited against WCAG 2.1 AA and remediated. Notes for anyone changing the design:

- **Two border tokens.** `--line` is decorative only (dividers, card edges).
  Anything forming the boundary of a control — input underlines, checkbox and
  radio borders, outlined buttons — must use `--line-strong`, which meets the
  3:1 non-text contrast minimum (1.4.11).
- **Two gold tokens.** `--gold` (3.25:1 worst case) is for icons, rules and
  display text 24px and over. Small text uses `--gold-ink` (4.64:1).
- `--ink-muted` is the floor for body-adjacent text at 4.90:1. Do not lighten
  any of these without re-checking against `--paper`, `--paper-warm` and
  `--sand`, the three surfaces text sits on.
- **Forms** wire `aria-describedby` to hint and error ids, set `aria-invalid`,
  and render a `role="alert"` summary that takes focus on failed submit. New
  fields must follow the same pattern, and error text must say which chart it
  refers to when a form collects two.
- **Route changes** set `document.title` via `useDocumentTitle` and move focus
  to `<main>`. Every new page needs the hook.
- **The mobile drawer** marks `<main>` and `<footer>` inert while open. Prefer
  `inert` over a hand-written Tab trap — the close button sits before the
  drawer in DOM order, so "last focusable element" is not the last tab stop.
- **Reflow**: grid and flex children in the layout containers carry
  `min-width: 0`, and `fieldset` needs it explicitly to override a UA
  `min-width: min-content`. Without these a long heading at a large user font
  size forces horizontal scrolling.
- Interactive targets are 44x44 minimum.

Still outstanding: this was verified with contrast math, DOM inspection and
keyboard walks, not with a real screen reader. A VoiceOver/NVDA pass over the
booking flow is worth doing before launch.

## Deploying

Pushing to `main` builds and publishes to GitHub Pages via
`.github/workflows/deploy.yml`.

Pages serves a project site from `/<repo>/`, so the workflow sets
`VITE_BASE=/cristina-cristea-astrology/` and the router reads
`import.meta.env.BASE_URL` as its basename — no `<Link>` needs changing.
Pages has no rewrite rules, so the workflow also copies `index.html` to
`404.html`; a deep link returns the app shell and the client router resolves
it. If the repository is renamed, update `VITE_BASE` to match.

SPA rewrites are also included for Vercel (`vercel.json`) and Netlify
(`public/_redirects`) if you move hosts.
