import { Link } from "react-router-dom";
import { Award, BookOpen, GraduationCap, Users } from "lucide-react";
import { StarField } from "../components/ui/StarField";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { useI18n } from "../i18n/I18nProvider";
import portrait from "../assets/cristina-portrait.webp";

const VALUE_ICONS = [GraduationCap, Users, BookOpen, Award];

export default function About() {
  const { t } = useI18n();
  useDocumentTitle(t.about.eyebrow);

  return (
    <>
      <section className="about-hero">
        <StarField seed={19} min={80} max={300} />
        <div className="wrap about-hero__inner">
          <div>
            <p className="eyebrow">{t.about.eyebrow}</p>
            <h1>{t.about.title}</h1>
            <p className="lead about-hero__lead">{t.about.lead}</p>
          </div>
          <div className="about-hero__portrait">
            <img src={portrait} alt={t.about.portraitAlt} width={880} height={880} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap pd__cols">
          <div className="pd__prose">
            <p className="eyebrow">{t.about.wordsEyebrow}</p>
            {t.about.words.map((p) => <p key={p.slice(0, 24)} className="lead">{p}</p>)}
          </div>

          <aside className="pd__aside">
            <div className="pd__box">
              <h3>{t.about.credentials}</h3>
              <ul className="ticks ticks--dot">
                {t.about.credentialsList.map((c) => <li key={c}>{c}</li>)}
              </ul>
            </div>
            <div className="pd__box">
              <h3>{t.about.practice}</h3>
              <ul className="ticks ticks--dot">
                {t.about.practiceList.map((c) => <li key={c}>{c}</li>)}
              </ul>
            </div>
          </aside>
        </div>
      </section>


      <section className="section">
        <div className="wrap">
          <div className="values">
            {t.about.values.map(([title, body], i) => {
              const Icon = VALUE_ICONS[i] ?? Award;
              return (
                <div key={title} className="values__i">
                  <Icon size={19} strokeWidth={1.1} aria-hidden="true" />
                  <h3>{title}</h3>
                  <p className="muted">{body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--linen">
        <div className="wrap wrap--narrow center">
          <p className="eyebrow eyebrow--center">{t.about.beginEyebrow}</p>
          <h2>{t.about.beginTitle}</h2>
          <p className="lead" style={{ marginTop: "1.25rem" }}>{t.about.beginLead}</p>
          <div className="empty__cta">
            <Link to="/services/natal-chart" className="btn">{t.about.natalCta}</Link>
            <Link to="/services" className="btn btn--ghost">{t.about.allCta}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
