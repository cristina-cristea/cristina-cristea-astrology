import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { services } from "../data/services";
import { Glyph } from "../components/ui/Glyph";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { useI18n } from "../i18n/I18nProvider";

export default function Services() {
  const { t, price } = useI18n();
  useDocumentTitle(t.services.pageTitle);

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="eyebrow">{t.services.pageEyebrow}</p>
          <h1>{t.services.pageTitle}</h1>
          <p className="lead page-head__lead">{t.services.pageLead}</p>
        </div>
      </section>

      <div className="wrap"><hr className="rule" /></div>

      <section className="section--tight">
        <div className="wrap svc-list">
          {services.map((s, i) => {
            const c = t.serviceCopy[s.id];
            return (
              <article key={s.id} className="svc-row">
                <div className="svc-row__art" aria-hidden="true">
                  <Glyph name={s.glyph} />
                  <span className="svc-row__num">{String(i + 1).padStart(2, "0")}</span>
                </div>

                <div className="svc-row__body">
                  <h2>{c.name}</h2>
                  <p className="svc-row__tag">{c.tagline}</p>
                  <p className="lead">{c.summary}</p>
                  <ul className="svc-row__inc">
                    {c.includes.slice(0, 3).map((inc) => (
                      <li key={inc}>
                        <Check size={13} strokeWidth={1.5} aria-hidden="true" /> {inc}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="svc-row__buy">
                  <span className="svc-row__price">{price(s.price)}</span>
                  <span className="svc-row__meta">{s.durationMinutes} {t.common.minutes}</span>
                  <span className="svc-row__meta muted">{c.delivery}</span>
                  <Link to={`/services/${s.slug}`} className="btn btn--ghost btn--sm">
                    {t.services.viewReading} <ArrowRight size={14} strokeWidth={1.4} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section section--sand">
        <div className="wrap wrap--narrow center">
          <p className="eyebrow eyebrow--center">{t.services.giftEyebrow}</p>
          <h2>{t.services.giftTitle}</h2>
          <p className="lead" style={{ marginTop: "1.25rem" }}>{t.services.giftBody}</p>
          <Link to="/contact" className="btn btn--ghost" style={{ marginTop: "2rem" }}>
            {t.services.giftCta}
          </Link>
        </div>
      </section>
    </>
  );
}
