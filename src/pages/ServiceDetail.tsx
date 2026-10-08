import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Clock, FileText, Package } from "lucide-react";
import { getService, services } from "../data/services";
import { Glyph } from "../components/ui/Glyph";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { useI18n } from "../i18n/I18nProvider";
import NotFound from "./NotFound";

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = getService(slug);
  const { t, price } = useI18n();
  useDocumentTitle(service ? t.serviceCopy[service.id].name : undefined);

  if (!service) return <NotFound />;

  const c = t.serviceCopy[service.id];
  const others = services.filter((s) => s.id !== service.id).slice(0, 3);

  return (
    <>
      <article className="pd">
        <div className="wrap">
          <Link to="/services" className="pd__back">
            <ArrowLeft size={14} strokeWidth={1.4} aria-hidden="true" /> {t.common.allReadings}
          </Link>

          <div className="pd__grid">
            <div className="pd__art" aria-hidden="true"><Glyph name={service.glyph} /></div>

            <div className="pd__head">
              <p className="eyebrow">{t.services.readingLabel}</p>
              <h1>{c.name}</h1>
              <p className="pd__tag">{c.tagline}</p>
              <p className="lead">{c.summary}</p>

              <dl className="pd__specs">
                <div>
                  <dt><Clock size={14} strokeWidth={1.2} aria-hidden="true" /> {t.services.session}</dt>
                  <dd>{service.durationMinutes} {t.common.minutes}</dd>
                </div>
                <div>
                  <dt><Package size={14} strokeWidth={1.2} aria-hidden="true" /> {t.services.deliveryLabel}</dt>
                  <dd>{c.delivery}</dd>
                </div>
                <div>
                  <dt><FileText size={14} strokeWidth={1.2} aria-hidden="true" /> {t.services.availability}</dt>
                  <dd>{c.turnaround}</dd>
                </div>
              </dl>

              <div className="pd__buy">
                <span className="pd__price">{price(service.price)}</span>
                <Link to={`/services/${service.slug}/booking`} className="btn">
                  {t.services.beginBooking} <ArrowRight size={15} strokeWidth={1.4} aria-hidden="true" />
                </Link>
              </div>
              <p className="pd__note muted">{t.services.bookingNote}</p>
            </div>
          </div>
        </div>
      </article>

      <section className="section section--sand">
        <div className="wrap pd__cols">
          <div className="pd__prose">
            <p className="eyebrow">{t.services.whatThisIs}</p>
            {c.description.map((p) => <p key={p.slice(0, 24)} className="lead">{p}</p>)}
          </div>

          <aside className="pd__aside">
            <div className="pd__box">
              <h3>{t.services.whatYouReceive}</h3>
              <ul className="ticks">
                {c.includes.map((i) => (
                  <li key={i}><Check size={13} strokeWidth={1.6} aria-hidden="true" /> {i}</li>
                ))}
              </ul>
            </div>
            <div className="pd__box">
              <h3>{t.services.suitedTo}</h3>
              <ul className="ticks ticks--dot">
                {c.goodFor.map((g) => <li key={g}>{g}</li>)}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">{t.services.alsoConsider}</p>
              <h2>{t.services.otherReadings}</h2>
            </div>
            <Link to="/services" className="link-u">{t.common.allReadings}</Link>
          </div>
          <div className="merch-strip">
            {others.map((s) => (
              <Link key={s.id} to={`/services/${s.slug}`} className="merch-card">
                <span className="merch-card__art" aria-hidden="true"><Glyph name={s.glyph} /></span>
                <span className="merch-card__cat">{s.durationMinutes} {t.common.minutes}</span>
                <h3>{t.serviceCopy[s.id].name}</h3>
                <span className="merch-card__price">{price(s.price)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
