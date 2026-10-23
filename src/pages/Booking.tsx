import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Languages, Lock, ShieldCheck, TriangleAlert } from "lucide-react";
import { getService } from "../data/services";
import { useCart } from "../context/CartContext";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { useI18n } from "../i18n/I18nProvider";
import { Select } from "../components/ui/Select";
import { Checkbox } from "../components/ui/Checkbox";
import { CalBooking } from "../components/CalBooking";
import type { BookedSlot } from "../components/CalBooking";
import { CAL_LINK_BY_CURRENCY } from "../lib/pricing";
import type { IntakeData, IntakePerson } from "../types";
import NotFound from "./NotFound";

type Errors = Record<string, string>;

const blankPerson = (): IntakePerson => ({
  fullName: "",
  birthDate: "",
  birthTime: "",
  timeUnknown: false,
  birthPlace: "",
});

/** Validation keys in the order they appear on the page. */
const FIELD_ORDER = [
  "youName", "youPlace", "youDate", "youTime",
  "partnerName", "partnerPlace", "partnerDate", "partnerTime",
  "email", "focus", "gdpr",
] as const;

/** The element each validation key labels and scrolls to. */
const FIELD_ANCHORS: Record<string, string> = {
  youName: "you-name",
  youPlace: "you-place",
  youDate: "you-date",
  youTime: "you-time",
  partnerName: "partner-name",
  partnerPlace: "partner-place",
  partnerDate: "partner-date",
  partnerTime: "partner-time",
  email: "email",
  focus: "focus",
  gdpr: "gdpr-consent",
};

const thisYear = new Date().getFullYear();
const years = Array.from({ length: 6 }, (_, i) => String(thisYear + i - 1));

export default function Booking() {
  const { slug } = useParams();
  const service = getService(slug);
  const navigate = useNavigate();
  const { addService } = useCart();
  const { t, price, currency, sessionPrice } = useI18n();
  const copy = service ? t.serviceCopy[service.id] : undefined;
  useDocumentTitle(copy?.name);

  const [you, setYou] = useState<IntakePerson>(blankPerson);
  const [partner, setPartner] = useState<IntakePerson>(blankPerson);
  const [email, setEmail] = useState("");
  const [targetYear, setTargetYear] = useState(String(thisYear));
  const [focus, setFocus] = useState("");
  const [gdpr, setGdpr] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const summaryRef = useRef<HTMLDivElement>(null);
  /** Set once the details are valid; the page then shows the calendar. */
  const [pending, setPending] = useState<IntakeData | null>(null);
  const timeHeadingRef = useRef<HTMLHeadingElement>(null);

  // Moving between the two steps happens without a route change, so focus
  // and scroll are handled here (useDocumentTitle only covers navigation).
  useEffect(() => {
    if (!pending) return;
    window.scrollTo({ top: 0 });
    timeHeadingRef.current?.focus({ preventScroll: true });
  }, [pending]);

  if (!service || !copy) return <NotFound />;

  const setYouField = <K extends keyof IntakePerson>(k: K, v: IntakePerson[K]) =>
    setYou((p) => ({ ...p, [k]: v }));
  const setPartnerField = <K extends keyof IntakePerson>(k: K, v: IntakePerson[K]) =>
    setPartner((p) => ({ ...p, [k]: v }));

  /**
   * `scope` disambiguates the two charts. Without it a relationship booking
   * produces two identical "full name" errors and the summary is unusable —
   * the messages are read aloud with no indication of which chart they mean.
   */
  const validatePerson = (p: IntakePerson, prefix: string, scope: string, e: Errors) => {
    if (!p.fullName.trim()) e[`${prefix}Name`] = `${scope}: ${t.errors.name}`;
    if (!p.birthDate) e[`${prefix}Date`] = `${scope}: ${t.errors.date}`;
    else if (new Date(p.birthDate) > new Date()) e[`${prefix}Date`] = `${scope}: ${t.errors.futureDate}`;
    if (!p.timeUnknown && !p.birthTime) e[`${prefix}Time`] = `${scope}: ${t.errors.time}`;
    if (!p.birthPlace.trim()) e[`${prefix}Place`] = `${scope}: ${t.errors.place}`;
  };

  const validate = (): Errors => {
    const e: Errors = {};
    validatePerson(you, "you", service.requiresPartner ? t.booking.yourChart : t.booking.title, e);
    if (!email.trim()) e.email = t.errors.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()))
      e.email = t.errors.emailInvalid;
    if (service.requiresPartner) validatePerson(partner, "partner", t.booking.secondChart, e);
    if (focus.trim().length < 10) e.focus = t.errors.focus;
    if (!gdpr) e.gdpr = t.errors.gdpr;
    return e;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);

    if (Object.keys(e).length) {
      // Focus the summary rather than the first field, so a screen reader
      // announces every problem at once and the user can jump to any of them.
      requestAnimationFrame(() => {
        summaryRef.current?.focus();
        summaryRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
      });
      return;
    }

    const intake: IntakeData = {
      ...you,
      fullName: you.fullName.trim(),
      birthPlace: you.birthPlace.trim(),
      email: email.trim(),
      partner: service.requiresPartner ? { ...partner, fullName: partner.fullName.trim() } : undefined,
      targetYear: service.requiresYear ? targetYear : undefined,
      focus: focus.trim(),
      gdprConsent: gdpr,
      submittedAt: new Date().toISOString(),
    };

    setPending(intake);
  };

  /** Everything Cristina needs before the session, attached to the Cal.com booking. */
  const bookingNotes = (i: IntakeData) => {
    const person = (p: typeof i | NonNullable<typeof i.partner>) => [
      `${p.fullName}`,
      `${t.booking.dateOfBirth}: ${p.birthDate}`,
      `${t.booking.timeOfBirth}: ${p.timeUnknown ? "—" : p.birthTime}`,
      `${t.booking.placeOfBirth}: ${p.birthPlace}`,
    ];
    const lines = [copy.name, "", ...person(i)];
    if (i.partner) lines.push("", `${t.booking.secondChart}:`, ...person(i.partner));
    if (i.targetYear)
      lines.push("", `${service.slug === "solar-return" ? t.booking.solarYear : t.booking.forecastYear}: ${i.targetYear}`);
    lines.push("", `${t.booking.focusLabel}`, i.focus);
    return lines.join("\n");
  };

  const onBooked = (slot: BookedSlot) => {
    if (!pending) return;
    addService(
      { id: service.id, slug: service.slug, name: copy.name, price: sessionPrice, currency },
      { ...pending, slot },
    );
    navigate("/checkout");
  };

  const err = (key: string) => errors[key];

  /** Joins the hint and error ids a field is described by, or undefined. */
  const describedBy = (...ids: (string | false | undefined)[]) => {
    const list = ids.filter(Boolean).join(" ");
    return list || undefined;
  };

  const errorList = FIELD_ORDER.filter((k) => errors[k]);

  const personFields = (
    p: IntakePerson,
    set: <K extends keyof IntakePerson>(k: K, v: IntakePerson[K]) => void,
    prefix: string,
    nameLabel: string
  ) => {
    const isYou = prefix === "you";
    return (
      <>
        <div className={`field${err(`${prefix}Name`) ? " field--error" : ""}`}>
          <label htmlFor={`${prefix}-name`}>{nameLabel}</label>
          <input
            id={`${prefix}-name`}
            value={p.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            placeholder="First and last name"
            autoComplete={isYou ? "name" : "off"}
            required
            aria-invalid={err(`${prefix}Name`) ? true : undefined}
            aria-describedby={describedBy(err(`${prefix}Name`) && `${prefix}-name-error`)}
          />
          {err(`${prefix}Name`) && (
            <span className="field-error" id={`${prefix}-name-error`}>
              {err(`${prefix}Name`)}
            </span>
          )}
        </div>

        <div className={`field${err(`${prefix}Place`) ? " field--error" : ""}`}>
          <label htmlFor={`${prefix}-place`}>{t.booking.placeOfBirth}</label>
          <input
            id={`${prefix}-place`}
            value={p.birthPlace}
            onChange={(e) => set("birthPlace", e.target.value)}
            placeholder="Town or city, country"
            required
            aria-invalid={err(`${prefix}Place`) ? true : undefined}
            aria-describedby={describedBy(
              err(`${prefix}Place`) ? `${prefix}-place-error` : `${prefix}-place-hint`
            )}
          />
          {err(`${prefix}Place`) ? (
            <span className="field-error" id={`${prefix}-place-error`}>
              {err(`${prefix}Place`)}
            </span>
          ) : (
            <span className="field-hint" id={`${prefix}-place-hint`}>
              {t.booking.placeHint}
            </span>
          )}
        </div>

        <div className={`field${err(`${prefix}Date`) ? " field--error" : ""}`}>
          <label htmlFor={`${prefix}-date`}>{t.booking.dateOfBirth}</label>
          <input
            id={`${prefix}-date`}
            type="date"
            value={p.birthDate}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => set("birthDate", e.target.value)}
            autoComplete={isYou ? "bday" : "off"}
            required
            aria-invalid={err(`${prefix}Date`) ? true : undefined}
            aria-describedby={describedBy(err(`${prefix}Date`) && `${prefix}-date-error`)}
          />
          {err(`${prefix}Date`) && (
            <span className="field-error" id={`${prefix}-date-error`}>
              {err(`${prefix}Date`)}
            </span>
          )}
        </div>

        <div className={`field${err(`${prefix}Time`) ? " field--error" : ""}`}>
          <label htmlFor={`${prefix}-time`}>{t.booking.timeOfBirth}</label>
          <input
            id={`${prefix}-time`}
            type="time"
            value={p.birthTime}
            disabled={p.timeUnknown}
            onChange={(e) => set("birthTime", e.target.value)}
            required={!p.timeUnknown}
            aria-invalid={err(`${prefix}Time`) ? true : undefined}
            aria-describedby={describedBy(
              err(`${prefix}Time`) ? `${prefix}-time-error` : `${prefix}-time-hint`
            )}
          />
          {err(`${prefix}Time`) ? (
            <span className="field-error" id={`${prefix}-time-error`}>
              {err(`${prefix}Time`)}
            </span>
          ) : (
            <span className="field-hint" id={`${prefix}-time-hint`}>
              {t.booking.timeHint}
            </span>
          )}
          <Checkbox
            id={`${prefix}-time-unknown`}
            checked={p.timeUnknown}
            onChange={(v) => {
              set("timeUnknown", v);
              if (v) set("birthTime", "");
            }}
            inline
          >
            <span>{t.booking.timeUnknown}</span>
          </Checkbox>
        </div>
      </>
    );
  };

  return (
    <section className="section--tight booking">
      <div className="wrap">
        <Link to={`/services/${service.slug}`} className="pd__back">
          <ArrowLeft size={14} strokeWidth={1.4} /> {t.common.back} {copy.name}
        </Link>

        <ol className="progress" aria-label={t.booking.steps[pending ? 1 : 0]}>
          <li className={pending ? "is-done" : "is-current"}>
            <span aria-hidden="true">01</span> {t.booking.steps[0]}
            <span className="sr-only">{pending ? t.common.completed : t.common.currentStep}</span>
          </li>
          <li className={pending ? "is-current" : undefined}>
            <span aria-hidden="true">02</span> {t.booking.steps[1]}
            {pending && <span className="sr-only">{t.common.currentStep}</span>}
          </li>
          <li><span aria-hidden="true">03</span> {t.booking.steps[2]}</li>
          <li><span aria-hidden="true">04</span> {t.booking.steps[3]}</li>
        </ol>

        <div className="booking__grid">
          {pending ? (
            <div className="booking__form booking__time">
              <header className="booking__head">
                <p className="eyebrow">{t.booking.timeStep}</p>
                <h1 ref={timeHeadingRef} tabIndex={-1}>{t.booking.timeTitle}</h1>
                <p className="lead">{t.booking.timeLead}</p>
                <p className="booking__lang">
                  <Languages size={16} strokeWidth={1.3} aria-hidden="true" />
                  <strong>{t.booking.languageNote}</strong>
                </p>
              </header>
              <button type="button" className="btn btn--line booking__edit" onClick={() => setPending(null)}>
                <ArrowLeft size={14} strokeWidth={1.4} aria-hidden="true" /> {t.booking.editDetails}
              </button>
              <CalBooking
                calLink={CAL_LINK_BY_CURRENCY[currency]}
                name={pending.fullName}
                email={pending.email}
                notes={bookingNotes(pending)}
                onBooked={onBooked}
              />
            </div>
          ) : (
          <form className="booking__form" onSubmit={onSubmit} noValidate>
            <header className="booking__head">
              <p className="eyebrow">{t.booking.step}</p>
              <h1>{t.booking.title}</h1>
              <p className="lead">
                {t.booking.lead}
              </p>
            </header>

            {/* Announced on submit; each entry jumps to the field it names. */}
            <div
              className="err-summary-wrap"
              role="alert"
              tabIndex={-1}
              ref={summaryRef}
            >
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
                          href={`#${FIELD_ANCHORS[k]}`}
                          onClick={(e) => {
                            e.preventDefault();
                            const el = document.getElementById(FIELD_ANCHORS[k]);
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
              <legend className="legend">{t.booking.yourChart}</legend>
              <div className="grid-2">
                {personFields(you, setYouField, "you", t.booking.fullNameAtBirth)}
              </div>
            </fieldset>

            {service.requiresPartner && (
              <fieldset className="fs">
                <legend className="legend">{t.booking.secondChart}</legend>
                <p className="field-hint fs__intro">
                  {t.booking.secondChartHint}
                </p>
                <div className="grid-2">
                  {personFields(partner, setPartnerField, "partner", t.booking.theirFullName)}
                </div>
              </fieldset>
            )}

            <fieldset className="fs">
              <legend className="legend">{t.booking.contact}</legend>
              <div className="grid-2">
                <div className={`field${err("email") ? " field--error" : ""}`}>
                  <label htmlFor="email">{t.booking.emailLabel}</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    aria-invalid={err("email") ? true : undefined}
                    aria-describedby={describedBy(err("email") ? "email-error" : "email-hint")}
                  />
                  {err("email") ? (
                    <span className="field-error" id="email-error">{err("email")}</span>
                  ) : (
                    <span className="field-hint" id="email-hint">
                      {t.booking.emailHint}
                    </span>
                  )}
                </div>

                {service.requiresYear && (
                  <div className="field">
                    <label htmlFor="year">
                      {service.slug === "solar-return" ? t.booking.solarYear : t.booking.forecastYear}
                    </label>
                    <Select
                      id="year"
                      value={targetYear}
                      onChange={setTargetYear}
                      options={years}
                      describedBy="year-hint"
                    />
                    <span className="field-hint" id="year-hint">
                      {service.slug === "solar-return" ? t.booking.solarYearHint : t.booking.forecastYearHint}
                    </span>
                  </div>
                )}
              </div>

              <div className={`field${err("focus") ? " field--error" : ""}`} style={{ marginTop: "1.75rem" }}>
                <label htmlFor="focus">{t.booking.focusLabel}</label>
                <textarea
                  id="focus"
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  placeholder={t.booking.focusPlaceholder}
                  required
                  aria-invalid={err("focus") ? true : undefined}
                  aria-describedby={describedBy(err("focus") && "focus-error")}
                />
                {err("focus") && <span className="field-error" id="focus-error">{err("focus")}</span>}
              </div>
            </fieldset>

            <fieldset className="fs fs--consent">
              <legend className="legend">{t.booking.consent}</legend>

              <Checkbox
                id="gdpr-consent"
                checked={gdpr}
                onChange={setGdpr}
                required
                invalid={!!err("gdpr")}
                describedBy={describedBy(err("gdpr") && "gdpr-error")}
              >
                <span>
                  {t.booking.gdprConsent}{" "}
                  <Link to="/privacy">{t.booking.privacyNotice}</Link>.
                  <strong className="req"> {t.common.required}</strong>
                </span>
              </Checkbox>
              {err("gdpr") && (
                <span className="field-error consent-err" id="gdpr-error">{err("gdpr")}</span>
              )}

              <p className="gdpr-note">
                <ShieldCheck size={15} strokeWidth={1.2} aria-hidden="true" />
                {t.booking.dataNote}
              </p>
            </fieldset>

            <button type="submit" className="btn btn--full">
              {t.booking.submit} <ArrowRight size={15} strokeWidth={1.4} aria-hidden="true" />
            </button>
            <p className="booking__foot muted">
              <Lock size={12} strokeWidth={1.3} aria-hidden="true" /> {t.booking.reviewNote}
            </p>
          </form>
          )}

          <aside className="booking__aside">
            <div className="summary-card">
              <h2 className="eyebrow">{t.booking.yourBooking}</h2>
              <h3>{copy.name}</h3>
              <p className="muted summary-card__tag">{copy.tagline}</p>
              <hr className="rule" />
              <dl className="summary-card__dl">
                <div><dt>{t.services.session}</dt><dd>{service.durationMinutes} {t.common.minutes}</dd></div>
                <div><dt>{t.services.deliveryLabel}</dt><dd>{copy.delivery}</dd></div>
                <div><dt>{t.services.availability}</dt><dd>{copy.turnaround}</dd></div>
                <div><dt>{t.services.languageLabel}</dt><dd>{t.services.languageValue}</dd></div>
              </dl>
              <hr className="rule" />
              <div className="summary-card__total">
                <span>{t.common.total}</span>
                <strong>{price(sessionPrice)}</strong>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
