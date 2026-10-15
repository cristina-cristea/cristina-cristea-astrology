# Cristina Cristea — Astrology

Marketing and booking site for a certified astrologer. React + TypeScript +
Vite, client-side routed, no backend.

**Live:** https://dianadaminescu05-del.github.io/cristina-cristea-astrology/

## Getting started on a new machine

You need [Node.js](https://nodejs.org) 20 or newer and [git](https://git-scm.com).

```bash
git clone https://github.com/dianadaminescu05-del/cristina-cristea-astrology.git
cd cristina-cristea-astrology
npm install
npm run dev      # http://localhost:5173
```

| Command | What it does |
|---|---|
| `npm run dev` | local preview, reloads on every save |
| `npm run build` | typechecks and builds to `dist/` |
| `npm run lint` | oxlint |
| `npm run preview` | serves the built `dist/` |

`npm run build` is the real typecheck — `tsc --noEmit` on the root config
checks nothing, because `tsconfig.json` only holds project references.

## Structure

```
src/
  data/services.ts            the five chart readings, each its own product
  i18n/                       en, fr-CH, de-CH, ro
  context/CartContext.tsx     basket, persisted to localStorage
  lib/checkout.ts             payment-provider handoff  ← wire this up
  pages/                      one file per route
  components/ui/              Radix wrappers + the celestial artwork
  styles/components.css       component styles
  index.css                   design tokens + base
```

## The booking flow

Readings are deliberately gated. `/services/:slug` →
`/services/:slug/booking` (birth data + explicit GDPR consent, all validated)
→ `/checkout` → `/confirmation`. A reading cannot reach the basket without
intake data; the type system enforces it (`CartLine` always carries an
`IntakeData`).

Services that need extra fields declare it in `data/services.ts`:
`requiresPartner` adds a second birth-data block (relationship chart),
`requiresYear` adds a year selector (solar return, forecasting).

## Languages

Four locales live in `src/i18n/locales/`: English, Swiss French, Swiss German
and Romanian. The `Dict` interface in `src/i18n/types.ts` is the contract —
adding a key there deliberately breaks the build until all four locales
define it, so no language can silently fall behind.

The Swiss variants are real variants, not relabels: de-CH never uses ß (always
`ss`), fr-CH uses *septante* and *nonante*, and both group thousands with an
apostrophe. Money is formatted with `Intl.NumberFormat`, never by hand.

## Wiring up payment

`src/lib/checkout.ts` is the single seam. It currently resolves after a short
delay so the flow is walkable end to end — **no payment is taken**. Card data
must never touch this front end; replace the stub with:

1. `POST` the payload to your own endpoint (`/api/checkout`).
2. Server-side, create the session with your provider's secret key
   (Stripe: `stripe.checkout.sessions.create`).
3. Return `session.url` and `window.location.href = session.url`.
4. Fulfil from the provider's **webhook**, never from the browser returning to
   the success page.

Store the intake data against the order server-side and reference it by id —
do not send birth data to the payment provider.

## GDPR

The booking form blocks on an unticked consent box, marketing opt-in is
separate and optional, and `/privacy` documents purpose, retention
(24 months) and erasure. Whoever operates the site still needs to honour
erasure requests in whatever store the server writes to.

The site sets no cookies and no analytics; the only browser storage is the
basket and the chosen language, which are strictly necessary and exempt from
the consent-banner requirement. Adding analytics changes that.

## Accessibility

Audited against WCAG 2.1 AA and remediated. Notes for anyone changing the design:

- **Two border tokens.** `--line` is decorative only (dividers, card edges).
  Anything forming the boundary of a control — input borders, checkbox and
  radio borders, outlined buttons — must use `--line-strong`, which meets the
  3:1 non-text contrast minimum (1.4.11).
- **Two gold tokens.** `--gold` is for icons, rules and display text 24px and
  over. Small text uses `--gold-ink`.
- `--ink-muted` is the floor for body-adjacent text. Do not lighten any of
  these without re-checking against `--paper`, `--paper-warm` and `--sand`,
  the three surfaces text sits on.
- **Forms** wire `aria-describedby` to hint and error ids, set `aria-invalid`,
  and render a `role="alert"` summary that takes focus on failed submit. New
  fields must follow the same pattern, and error text must say which chart it
  refers to when a form collects two.
- **Route changes** set `document.title` via `useDocumentTitle` and move focus
  to `<main>`. Every new page needs the hook.
- **The mobile drawer** is a Radix Dialog; its close button must stay inside
  the Dialog content, since Radix aria-hides everything outside it.
- **Reflow**: grid and flex children carry `min-width: 0`, and `fieldset`
  needs it explicitly to override a UA `min-width: min-content`. Without
  these a long heading at a large user font size forces horizontal scrolling.
- Interactive targets are 44×44 minimum.

Still outstanding: this was verified with contrast math, DOM inspection and
keyboard walks, not with a real screen reader. A VoiceOver/NVDA pass over the
booking flow is worth doing before launch.

## Before launch

- [ ] Replace the invented biography, credentials, testimonial, statistics and
      the operator details in the privacy notice with real information.
- [ ] Wire up payment (`src/lib/checkout.ts`) and a real contact-form
      destination — the contact form currently sends nothing.
- [ ] Decide what the booking form's marketing opt-in subscribes people to;
      the footer newsletter signup it referred to has been removed.
- [ ] Self-host the fonts if you want no requests to Google's CDN.
- [ ] Screen-reader pass over the booking flow.

## Deploying

Pushing to `main` builds and publishes to GitHub Pages via
`.github/workflows/deploy.yml`. Nothing goes live until it is pushed — the
cycle is `commit → push → Actions (~1 min) → live`.

Pages serves a project site from `/<repo>/`, so the workflow sets
`VITE_BASE=/cristina-cristea-astrology/` and the router reads
`import.meta.env.BASE_URL` as its basename — no `<Link>` needs changing.
Pages has no rewrite rules, so the workflow also copies `index.html` to
`404.html`; a deep link returns the app shell and the client router resolves
it. **If the repository is renamed or moved to another account, update
`VITE_BASE` to match.**

SPA rewrites are also included for Vercel (`vercel.json`) and Netlify
(`public/_redirects`) if you move hosts.

## Working on this with Claude Code

`CLAUDE.md` holds the conventions Claude should follow — the token rules, the
accessibility invariants, the i18n contract and the list of deliberate stubs.
Claude reads it automatically at the start of a session. Keep it current when
the conventions change.
