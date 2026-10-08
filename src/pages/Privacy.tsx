import { Link } from "react-router-dom";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { useI18n } from "../i18n/I18nProvider";

export default function Privacy() {
  const { t } = useI18n();
  useDocumentTitle(t.privacy.title);

  return (
    <>
      <section className="page-head">
        <div className="wrap wrap--narrow">
          <p className="eyebrow">{t.privacy.eyebrow}</p>
          <h1>{t.privacy.title}</h1>
          <p className="lead page-head__lead">{t.privacy.lead}</p>
        </div>
      </section>

      <section className="section--tight">
        <div className="wrap wrap--narrow legal">
          {t.privacy.sections.map((s, i) => (
            <article key={s.h}>
              <span className="legal__n">{String(i + 1).padStart(2, "0")}</span>
              <h2>{s.h}</h2>
              {s.p.map((p) => <p key={p.slice(0, 20)} className="lead">{p}</p>)}
            </article>
          ))}
          <p className="legal__updated muted">{t.privacy.updated}</p>
          <Link to="/contact" className="btn btn--ghost">{t.privacy.ask}</Link>
        </div>
      </section>
    </>
  );
}
