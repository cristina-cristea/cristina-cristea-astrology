import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Clock, Globe, Mail, Send, TriangleAlert } from "lucide-react";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { useI18n } from "../i18n/I18nProvider";
import { Select } from "../components/ui/Select";
import { Checkbox } from "../components/ui/Checkbox";
import { sendContactMessage } from "../lib/contact";

export default function Contact() {
  const { t } = useI18n();
  const subjects = t.contact.subjects;
  useDocumentTitle(t.contact.title);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendFailed, setSendFailed] = useState(false);
  const [botcheck, setBotcheck] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: subjects[0],
    message: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const describedBy = (...ids: (string | false | undefined)[]) => {
    const list = ids.filter(Boolean).join(" ");
    return list || undefined;
  };

  const ANCHORS: Record<string, string> = {
    name: "c-name", email: "c-email", message: "c-msg", consent: "c-consent",
  };
  const ORDER = ["name", "email", "message", "consent"];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!form.name.trim()) err.name = t.errors.nameShort;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      err.email = t.errors.emailInvalid;
    if (form.message.trim().length < 10) err.message = t.errors.message;
    if (!form.consent) err.consent = t.errors.contactConsent;
    setErrors(err);
    if (Object.keys(err).length) {
      requestAnimationFrame(() => {
        summaryRef.current?.focus();
        summaryRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
      });
      return;
    }
    setSending(true);
    setSendFailed(false);
    try {
      await sendContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject,
        message: form.message.trim(),
        botcheck,
      });
      setSent(true);
    } catch {
      setSendFailed(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="eyebrow">{t.contact.eyebrow}</p>
          <h1>{t.contact.title}</h1>
          <p className="lead page-head__lead">
            {t.contact.lead}
          </p>
        </div>
      </section>

      <section className="section--tight">
        <div className="wrap booking__grid">
          {sent ? (
            <div className="booking__form contact-sent" role="status">
              <span className="confirm__tick" aria-hidden="true">
                <Check size={24} strokeWidth={1.2} />
              </span>
              <h2>{t.contact.sent}</h2>
              <p className="lead">
                {t.contact.sentLead} <strong>{form.email}</strong>.
              </p>
              <Link to="/services" className="btn btn--ghost">{t.cart.browse}</Link>
            </div>
          ) : (
            <form className="booking__form" onSubmit={submit} noValidate>
              <div className="err-summary-wrap" role="alert" tabIndex={-1} ref={summaryRef}>
                {ORDER.filter((k) => errors[k]).length > 0 && (
                  <div className="err-summary">
                    <h2>
                      <TriangleAlert size={17} strokeWidth={1.4} aria-hidden="true" />
                      {ORDER.filter((k) => errors[k]).length === 1 ? t.booking.problemsOne : t.booking.problemsMany.replace("{n}", String(ORDER.filter((k) => errors[k]).length))}
                    </h2>
                    <ul>
                      {ORDER.filter((k) => errors[k]).map((k) => (
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
                <legend className="legend">{t.contact.yourMessage}</legend>
                <div className="grid-2">
                  <div className={`field${errors.name ? " field--error" : ""}`}>
                    <label htmlFor="c-name">{t.contact.name}</label>
                    <input
                      id="c-name" value={form.name} onChange={(e) => set("name", e.target.value)}
                      autoComplete="name" required
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={describedBy(errors.name && "c-name-error")}
                    />
                    {errors.name && <span className="field-error" id="c-name-error">{errors.name}</span>}
                  </div>
                  <div className={`field${errors.email ? " field--error" : ""}`}>
                    <label htmlFor="c-email">{t.common.email}</label>
                    <input
                      id="c-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                      autoComplete="email" required
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={describedBy(errors.email && "c-email-error")}
                    />
                    {errors.email && <span className="field-error" id="c-email-error">{errors.email}</span>}
                  </div>
                </div>

                <div className="field" style={{ marginTop: "1.75rem" }}>
                  <label htmlFor="c-subject">{t.contact.subject}</label>
                  <Select
                    id="c-subject"
                    value={form.subject}
                    onChange={(v) => set("subject", v)}
                    options={subjects}
                  />
                </div>

                <div className={`field${errors.message ? " field--error" : ""}`} style={{ marginTop: "1.75rem" }}>
                  <label htmlFor="c-msg">{t.contact.message}</label>
                  <textarea
                    id="c-msg"
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    placeholder={t.contact.messagePlaceholder}
                    required
                    aria-invalid={errors.message ? true : undefined}
                    aria-describedby={describedBy(errors.message && "c-msg-error")}
                  />
                  {errors.message && <span className="field-error" id="c-msg-error">{errors.message}</span>}
                </div>
              </fieldset>

              <fieldset className="fs fs--consent">
                <Checkbox
                  id="c-consent"
                  checked={form.consent}
                  onChange={(v) => set("consent", v)}
                  required
                  invalid={!!errors.consent}
                  describedBy={describedBy(errors.consent && "c-consent-error")}
                >
                  <span>
                    {t.contact.consent} <Link to="/privacy">{t.booking.privacyNotice}</Link>.
                    <strong className="req"> {t.common.required}</strong>
                  </span>
                </Checkbox>
                {errors.consent && (
                  <span className="field-error consent-err" id="c-consent-error">{errors.consent}</span>
                )}
              </fieldset>

              {/* Honeypot: hidden from people and assistive tech, left for bots. */}
              <input
                type="checkbox"
                name="botcheck"
                className="hp"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                checked={botcheck}
                onChange={(e) => setBotcheck(e.target.checked)}
              />

              <div role="alert">
                {sendFailed && (
                  <div className="send-error">
                    <TriangleAlert size={16} strokeWidth={1.4} aria-hidden="true" />
                    <span>
                      {t.contact.sendFailed}{" "}
                      <a href="mailto:cristina.cristea17@gmail.com">cristina.cristea17@gmail.com</a>.
                    </span>
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn--full" disabled={sending} aria-busy={sending || undefined}>
                {sending ? t.contact.sending : t.contact.send} <Send size={15} strokeWidth={1.3} aria-hidden="true" />
              </button>
            </form>
          )}

          <aside className="booking__aside">
            <div className="summary-card">
              <h2 className="eyebrow">{t.contact.direct}</h2>
              <ul className="contact-list">
                <li>
                  <Mail size={15} strokeWidth={1.2} />
                  <div>
                    <strong>{t.contact.emailLabel}</strong>
                    <a href="mailto:cristina.cristea17@gmail.com">cristina.cristea17@gmail.com</a>
                  </div>
                </li>
                <li>
                  <Clock size={15} strokeWidth={1.2} />
                  <div>
                    <strong>{t.contact.sessions}</strong>
                    <span>{t.contact.sessionsValue}</span>
                  </div>
                </li>
                <li>
                  <Globe size={15} strokeWidth={1.2} />
                  <div>
                    <strong>{t.contact.location}</strong>
                    <span>{t.contact.locationValue}</span>
                  </div>
                </li>
              </ul>
              <hr className="rule" />
              <p className="field-hint">
                {t.contact.dataNote}{" "}
                <a href="mailto:privacy@cristinacristea.com">privacy@cristinacristea.com</a>.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
