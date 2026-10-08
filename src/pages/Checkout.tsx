import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CreditCard, Lock, ShieldCheck, TriangleAlert } from "lucide-react";
import { lineKey, useCart } from "../context/CartContext";
import { orderRef } from "../lib/format";
import { useI18n } from "../i18n/I18nProvider";
import { Select } from "../components/ui/Select";
import { Checkbox } from "../components/ui/Checkbox";
import { RadioGroup, RadioOption } from "../components/ui/RadioGroup";
import { createCheckoutSession } from "../lib/checkout";
import { useDocumentTitle } from "../lib/useDocumentTitle";

export default function Checkout() {
  const { lines, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const { t, price } = useI18n();
  useDocumentTitle(t.checkout.title);
  const summaryRef = useRef<HTMLDivElement>(null);

  const firstService = lines.find((l) => l.kind === "service");
  const prefill = firstService?.kind === "service" ? firstService.intake : undefined;

  const [email, setEmail] = useState(prefill?.email ?? "");
  const [name, setName] = useState(prefill?.fullName ?? "");
  const [country, setCountry] = useState("Portugal");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [city, setCity] = useState("");
  const [method, setMethod] = useState<"card" | "paypal">("card");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const needsShipping = lines.some((l) => l.kind === "merch");
  const shipping = needsShipping && subtotal < 120 ? 8 : 0;
  const total = subtotal + shipping;

  if (!lines.length && !busy) {
    return (
      <section className="section empty">
        <div className="wrap wrap--narrow center">
          <h1>{t.cart.empty}</h1>
          <p className="lead">{t.cart.emptyLead}</p>
          <div className="empty__cta">
            <Link to="/services" className="btn">{t.cart.browse}</Link>
            <Link to="/merch" className="btn btn--ghost">{t.cart.visitShop}</Link>
          </div>
        </div>
      </section>
    );
  }

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (busy) return; // aria-disabled keeps the button focusable, so guard here
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = t.errors.nameShort;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) e.email = t.errors.emailInvalid;
    if (needsShipping) {
      if (!address.trim()) e.address = t.errors.address;
      if (!city.trim()) e.city = t.errors.city;
      if (!postcode.trim()) e.postcode = t.errors.postcode;
    }
    if (!terms) e.terms = t.errors.terms;
    setErrors(e);
    if (Object.keys(e).length) {
      requestAnimationFrame(() => {
        summaryRef.current?.focus();
        summaryRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
      });
      return;
    }

    setBusy(true);
    const ref = orderRef();

    // Hands the basket to the payment provider. In production this calls the
    // server, which creates the session and returns a hosted-checkout URL.
    await createCheckoutSession({
      reference: ref,
      email: email.trim(),
      name: name.trim(),
      method,
      total,
      lines,
    });

    clear();
    navigate("/confirmation", {
      state: { reference: ref, email: email.trim(), total, lines },
    });
  };

  const err = (k: string) => errors[k];

  const describedBy = (...ids: (string | false | undefined)[]) => {
    const list = ids.filter(Boolean).join(" ");
    return list || undefined;
  };

  const ANCHORS: Record<string, string> = {
    name: "co-name", email: "co-email", address: "co-addr",
    city: "co-city", postcode: "co-post", terms: "co-terms",
  };
  const ORDER = ["name", "email", "address", "city", "postcode", "terms"];
  const errorList = ORDER.filter((k) => errors[k]);

  return (
    <section className="section--tight">
      <div className="wrap">
        <ol className="progress" aria-label={t.booking.steps[1]}>
          <li className="is-done">
            <span aria-hidden="true">01</span> {t.booking.steps[0]}
            <span className="sr-only">{t.common.completed}</span>
          </li>
          <li className="is-current">
            <span aria-hidden="true">02</span> {t.booking.steps[1]}
            <span className="sr-only">{t.common.currentStep}</span>
          </li>
          <li><span aria-hidden="true">03</span> {t.booking.steps[2]}</li>
        </ol>

        <div className="booking__grid">
          <form className="booking__form" onSubmit={submit} noValidate>
            <header className="booking__head">
              <p className="eyebrow">{t.checkout.step}</p>
              <h1>{t.checkout.title}</h1>
              <p className="lead">
                {t.checkout.lead}
              </p>
            </header>

            <div className="err-summary-wrap" role="alert" tabIndex={-1} ref={summaryRef}>
              {errorList.length > 0 && (
                <div className="err-summary">
                  <h2>
                    <TriangleAlert size={17} strokeWidth={1.4} aria-hidden="true" />
                    {errorList.length === 1 ? t.booking.problemsOne : t.booking.problemsMany.replace("{n}", String(errorList.length))}
                  </h2>
                  <ul>
                    {errorList.map((k) => (
                      <li key={k}>
                        <a
                          href={`#${ANCHORS[k]}`}
                          onClick={(ev) => {
                            ev.preventDefault();
                            const el = document.getElementById(ANCHORS[k]);
                            el?.scrollIntoView({ block: "center", behavior: "smooth" });
                            el?.focus({ preventScroll: true });
                          }}
                        >
                          {errors[k]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <fieldset className="fs">
              <legend className="legend">{t.checkout.billing}</legend>
              <div className="grid-2">
                <div className={`field${err("name") ? " field--error" : ""}`}>
                  <label htmlFor="co-name">{t.checkout.fullName}</label>
                  <input
                    id="co-name" value={name} onChange={(e) => setName(e.target.value)}
                    autoComplete="name" required
                    aria-invalid={err("name") ? true : undefined}
                    aria-describedby={describedBy(err("name") && "co-name-error")}
                  />
                  {err("name") && <span className="field-error" id="co-name-error">{err("name")}</span>}
                </div>
                <div className={`field${err("email") ? " field--error" : ""}`}>
                  <label htmlFor="co-email">{t.common.email}</label>
                  <input
                    id="co-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email" required
                    aria-invalid={err("email") ? true : undefined}
                    aria-describedby={describedBy(err("email") ? "co-email-error" : "co-email-hint")}
                  />
                  {err("email") ? (
                    <span className="field-error" id="co-email-error">{err("email")}</span>
                  ) : (
                    <span className="field-hint" id="co-email-hint">{t.checkout.emailHint}</span>
                  )}
                </div>
              </div>
            </fieldset>

            {needsShipping && (
              <fieldset className="fs">
                <legend className="legend">{t.checkout.delivery}</legend>
                <div className="grid-2">
                  <div className={`field${err("address") ? " field--error" : ""}`}>
                    <label htmlFor="co-addr">{t.checkout.street}</label>
                    <input
                      id="co-addr" value={address} onChange={(e) => setAddress(e.target.value)}
                      autoComplete="street-address" required
                      aria-invalid={err("address") ? true : undefined}
                      aria-describedby={describedBy(err("address") && "co-addr-error")}
                    />
                    {err("address") && <span className="field-error" id="co-addr-error">{err("address")}</span>}
                  </div>
                  <div className={`field${err("city") ? " field--error" : ""}`}>
                    <label htmlFor="co-city">{t.checkout.city}</label>
                    <input
                      id="co-city" value={city} onChange={(e) => setCity(e.target.value)}
                      autoComplete="address-level2" required
                      aria-invalid={err("city") ? true : undefined}
                      aria-describedby={describedBy(err("city") && "co-city-error")}
                    />
                    {err("city") && <span className="field-error" id="co-city-error">{err("city")}</span>}
                  </div>
                  <div className={`field${err("postcode") ? " field--error" : ""}`}>
                    <label htmlFor="co-post">{t.checkout.postcode}</label>
                    <input
                      id="co-post" value={postcode} onChange={(e) => setPostcode(e.target.value)}
                      autoComplete="postal-code" required
                      aria-invalid={err("postcode") ? true : undefined}
                      aria-describedby={describedBy(err("postcode") && "co-post-error")}
                    />
                    {err("postcode") && <span className="field-error" id="co-post-error">{err("postcode")}</span>}
                  </div>
                  <div className="field">
                    <label htmlFor="co-country">{t.checkout.country}</label>
                    <Select
                      id="co-country"
                      value={country}
                      onChange={setCountry}
                      options={t.checkout.countries}
                    />
                  </div>
                </div>
              </fieldset>
            )}

            <fieldset className="fs">
              <legend className="legend">{t.checkout.paymentMethod}</legend>
              <RadioGroup
                value={method}
                onChange={(v) => setMethod(v as "card" | "paypal")}
                label={t.checkout.paymentMethod}
              >
                <RadioOption
                  value="card"
                  icon={<CreditCard size={17} strokeWidth={1.2} aria-hidden="true" />}
                  title={t.checkout.card}
                  hint={t.checkout.cardSub}
                />
                <RadioOption
                  value="paypal"
                  icon={<ShieldCheck size={17} strokeWidth={1.2} aria-hidden="true" />}
                  title={t.checkout.paypal}
                  hint={t.checkout.paypalSub}
                />
              </RadioGroup>
              <p className="gdpr-note">
                <Lock size={15} strokeWidth={1.2} />
                {t.checkout.secureNote}
              </p>
            </fieldset>

            <fieldset className="fs fs--consent">
              <Checkbox
                id="co-terms"
                checked={terms}
                onChange={setTerms}
                required
                invalid={!!err("terms")}
                describedBy={describedBy(err("terms") && "co-terms-error")}
              >
                <span>
                  {t.checkout.terms}
                  <strong className="req"> {t.common.required}</strong>
                </span>
              </Checkbox>
              {err("terms") && (
                <span className="field-error consent-err" id="co-terms-error">{err("terms")}</span>
              )}
            </fieldset>

            <button
              type="submit"
              className="btn btn--full"
              aria-disabled={busy || undefined}
            >
              {busy ? (
                t.checkout.redirecting
              ) : (
                <>{t.checkout.pay} {price(total)} <ArrowRight size={15} strokeWidth={1.4} aria-hidden="true" /></>
              )}
            </button>
            <p className="sr-only" role="status">
              {busy ? t.checkout.redirecting : ""}
            </p>
          </form>

          <aside className="booking__aside">
            <div className="summary-card">
              <h2 className="eyebrow">{t.checkout.orderSummary}</h2>
              <ul className="summary-card__lines">
                {lines.map((l) => (
                  <li key={lineKey(l)}>
                    <span>
                      {l.name}
                      {l.kind === "merch" && l.variant && <em> · {l.variant}</em>}
                      {l.qty > 1 && <em> × {l.qty}</em>}
                    </span>
                    <span>{price(l.price * l.qty)}</span>
                  </li>
                ))}
              </ul>
              <hr className="rule" />
              <dl className="summary-card__dl">
                <div><dt>{t.common.subtotal}</dt><dd>{price(subtotal)}</dd></div>
                {needsShipping && (
                  <div><dt>{t.common.shipping}</dt><dd>{shipping ? price(shipping) : t.common.free}</dd></div>
                )}
              </dl>
              <hr className="rule" />
              <div className="summary-card__total">
                <span>{t.common.total}</span>
                <strong>{price(total)}</strong>
              </div>
              <Link to="/cart" className="link-u cart__cont">{t.checkout.editBasket}</Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
