import { Link } from "react-router-dom";
import { ArrowRight, Award } from "lucide-react";
import { services } from "../data/services";
import { Glyph } from "../components/ui/Glyph";
import { StarField } from "../components/ui/StarField";
import { Constellations } from "../components/ui/Constellations";
import { SolarSystem } from "../components/ui/SolarSystem";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { useI18n } from "../i18n/I18nProvider";

export default function Home() {
  useDocumentTitle(undefined);
  const { t } = useI18n();

  return (
    <>
      {/* ---------------- hero ---------------- */}
      <section className="hero">
        <StarField />
        <Constellations />
        <div className="hero__orbit" aria-hidden="true">
          <SolarSystem />
        </div>

        <div className="wrap hero__inner">
          <p className="eyebrow rise">{t.home.eyebrow}</p>
          <h1 className="hero__title rise" style={{ animationDelay: "80ms" }}>
            {t.home.titleA}
            <br />
            <em>{t.home.titleB}</em>
          </h1>
          <p className="lead hero__lead rise" style={{ animationDelay: "160ms" }}>
            {t.home.lead}
          </p>
          <div className="hero__cta rise" style={{ animationDelay: "240ms" }}>
            <Link to="/services" className="btn">
              {t.home.bookCta} <ArrowRight size={15} strokeWidth={1.4} aria-hidden="true" />
            </Link>
            <Link to="/about" className="link-u">{t.home.meetCta}</Link>
          </div>
        </div>
      </section>

      {/* ---------------- intro ---------------- */}
      <section className="section section--sand">
        <div className="wrap intro">
          <div className="intro__l">
            <p className="eyebrow">{t.home.practiceEyebrow}</p>
            <h2>{t.home.practiceTitle}</h2>
          </div>
          <div className="intro__r">
            <p className="lead">{t.home.practiceBodyA}</p>
            <p className="lead">{t.home.practiceBodyB}</p>
            <div className="intro__stats">
              <div>
                <Award size={18} strokeWidth={1.1} aria-hidden="true" />
                <strong>{t.home.statCertified}</strong>
                <span>{t.home.statCertifiedSub}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- services ---------------- */}
      <section className="section" id="services">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">{t.home.readingsEyebrow}</p>
              <h2>{t.home.readingsTitle}</h2>
            </div>
            <p className="lead sec-head__note">{t.home.readingsNote}</p>
          </div>

          <div className="svc-grid">
            {services.map((s, i) => {
              const c = t.serviceCopy[s.id];
              return (
                <Link key={s.id} to={`/services/${s.slug}`} className="svc-card">
                  <span className="svc-card__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="svc-card__art" aria-hidden="true">
                    <Glyph name={s.glyph} />
                  </span>
                  <h3>{c.name}</h3>
                  <p className="svc-card__tag">{c.tagline}</p>
                  <p className="svc-card__sum">{c.summary}</p>
                  <span className="svc-card__foot">
                    <span className="svc-card__dur">{s.durationMinutes} {t.common.minutes}</span>
                    <ArrowRight className="svc-card__arrow" size={16} strokeWidth={1.3} aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
            <div className="svc-card svc-card--cta">
              <h3>{t.home.notSure}</h3>
              <p className="svc-card__sum">{t.home.notSureBody}</p>
              <Link to="/contact" className="link-u">{t.home.askCristina}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- process ---------------- */}
      <section className="section section--linen">
        <div className="wrap">
          <p className="eyebrow eyebrow--center center">{t.home.stepsEyebrow}</p>
          <h2 className="center steps__title">{t.home.stepsTitle}</h2>
          <ol className="steps">
            {t.home.steps.map(([title, body], i) => (
              <li key={title}>
                <span className="steps__n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p className="muted">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

    </>
  );
}
