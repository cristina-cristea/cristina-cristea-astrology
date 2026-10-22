import { Link } from "react-router-dom";
import { AtSign, Mail, Moon } from "lucide-react";
import { services } from "../../data/services";
import { useI18n } from "../../i18n/I18nProvider";
import { BRAND } from "../../lib/brand";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr__top">
          <div className="ftr__brand">
            <Moon size={20} strokeWidth={1} />
            <h3>{BRAND}</h3>
            <p className="ftr__owner">Cristina Cristea</p>
            <p className="muted">{t.footer.tagline}</p>
            <div className="ftr__social">
              <a href="https://instagram.com" aria-label={t.footer.instagram} target="_blank" rel="noreferrer noopener">
                <AtSign size={16} strokeWidth={1.2} />
              </a>
              <a href="mailto:hello@cristinacristea.com" aria-label={t.common.email}>
                <Mail size={16} strokeWidth={1.2} />
              </a>
            </div>
          </div>

          <div className="ftr__col">
            <h4>{t.footer.readings}</h4>
            {services.map((s) => (
              <Link key={s.id} to={`/services/${s.slug}`}>
                {t.serviceCopy[s.id].name}
              </Link>
            ))}
          </div>

          <div className="ftr__col">
            <h4>{t.footer.studio}</h4>
            <Link to="/about">{t.nav.about}</Link>
            <Link to="/contact">{t.nav.contact}</Link>
            <Link to="/privacy">{t.footer.privacy}</Link>
          </div>
        </div>

        <div className="ftr__bottom">
          <span>© {new Date().getFullYear()} {BRAND} · Cristina Cristea</span>
          <span className="ftr__disclaimer">{t.footer.disclaimer}</span>
        </div>
      </div>
    </footer>
  );
}
