import { Link } from "react-router-dom";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { useI18n } from "../i18n/I18nProvider";

/**
 * Placeholder until the 2027 forecast videos and PDFs are ready. The products
 * will be sold through a separate checkout (not Cal.com); see CLAUDE.md.
 */
export default function Shop() {
  const { t } = useI18n();
  useDocumentTitle(t.nav.shop);

  return (
    <section className="section empty shop">
      <div className="wrap wrap--narrow center">
        <span className="shop__planet" aria-hidden="true">
          <svg viewBox="0 0 240 240" fill="none" stroke="currentColor" strokeWidth="1.2">
            <g transform="rotate(-16 120 120)">
              {/* back half of the ring, hidden behind the planet */}
              <path d="M24 120 A96 26 0 0 1 216 120" opacity="0.45" />
              <path d="M40 120 A80 19 0 0 1 200 120" opacity="0.3" />
              {/* the planet, with a few cloud bands */}
              <circle cx="120" cy="120" r="54" className="shop__body" />
              <path d="M70 100 Q120 108 170 100" opacity="0.35" />
              <path d="M66 118 Q120 128 174 118" opacity="0.5" />
              <path d="M70 138 Q120 146 170 138" opacity="0.35" />
              {/* front half of the ring, crossing in front */}
              <path d="M24 120 A96 26 0 0 0 216 120" />
              <path d="M40 120 A80 19 0 0 0 200 120" opacity="0.55" />
            </g>
            <g fill="currentColor" stroke="none">
              <circle cx="38" cy="52" r="1.6" />
              <circle cx="206" cy="40" r="1.2" />
              <circle cx="214" cy="190" r="1.6" />
              <circle cx="30" cy="196" r="1.1" />
              <path d="M188 70 L190 78 L198 80 L190 82 L188 90 L186 82 L178 80 L186 78 Z" />
            </g>
          </svg>
        </span>
        <p className="eyebrow eyebrow--center">{t.shop.eyebrow}</p>
        <h1>{t.shop.title}</h1>
        <p className="lead">{t.shop.lead}</p>
        <div className="empty__cta">
          <Link to="/services" className="btn btn--ghost">{t.common.allReadings}</Link>
        </div>
      </div>
    </section>
  );
}
