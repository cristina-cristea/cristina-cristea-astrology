import { Link } from "react-router-dom";
import { Glyph } from "../components/ui/Glyph";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { useI18n } from "../i18n/I18nProvider";

export default function NotFound() {
  const { t } = useI18n();
  useDocumentTitle(t.notFound.title);

  return (
    <section className="section empty">
      <div className="wrap wrap--narrow center">
        <span className="empty__glyph" aria-hidden="true"><Glyph name="comet" /></span>
        <p className="eyebrow eyebrow--center">{t.notFound.eyebrow}</p>
        <h1>{t.notFound.title}</h1>
        <p className="lead">{t.notFound.lead}</p>
        <div className="empty__cta">
          <Link to="/" className="btn">{t.notFound.home}</Link>
          <Link to="/services" className="btn btn--ghost">{t.notFound.browse}</Link>
        </div>
      </div>
    </section>
  );
}
