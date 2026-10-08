import type { CartLine } from "../types";

export interface CheckoutRequest {
  reference: string;
  email: string;
  name: string;
  method: "card" | "paypal";
  total: number;
  lines: CartLine[];
}

/**
 * Hands the basket to the payment provider.
 *
 * ── Wiring this up for real ───────────────────────────────────────────────
 * Card data must never touch this front end. The production flow is:
 *
 *   1. POST this payload to your own server endpoint (e.g. /api/checkout).
 *   2. The server creates the payment session with the provider's secret key
 *      — Stripe: `stripe.checkout.sessions.create({ line_items, mode:
 *      'payment', success_url, cancel_url })`.
 *   3. The server returns `session.url`.
 *   4. Redirect the browser to it: `window.location.href = session.url`.
 *   5. Fulfil the order from the provider's server-side webhook, never from
 *      the browser returning to the success page.
 *
 * Birth data collected at intake should be stored against the order server
 * side and referenced by id — do not send it to the payment provider.
 *
 * Until an endpoint exists, this resolves after a short delay so the rest of
 * the flow (confirmation screen, basket clearing) can be used and tested.
 */
export async function createCheckoutSession(req: CheckoutRequest): Promise<void> {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info("[checkout] session request", req);
  }

  // Replace this block with the fetch + redirect described above.
  await new Promise((resolve) => setTimeout(resolve, 1100));
}
