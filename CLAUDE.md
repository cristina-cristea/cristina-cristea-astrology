# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

A marketing and booking site for Cristina Cristea, a certified astrologer. It
sells five chart readings as separate products. There is no backend and no
shop — readings only.

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

## Known stubs — not bugs

- `src/lib/checkout.ts` is a **stub**. It resolves after a delay so the flow
  is walkable. No payment is taken. The file documents the real wiring.
- The biography, credentials, testimonial, statistics and the operator details
  in the privacy notice are **invented placeholder copy** and are publicly
  visible. They need replacing with real information before launch.
- Google Fonts loads from Google's CDN. Self-host if German/Swiss privacy
  exposure matters.
- The booking form's marketing opt-in offers a newsletter that has no signup
  form any more.
