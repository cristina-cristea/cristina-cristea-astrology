import { Link, Navigate, useLocation } from "react-router-dom";
import { CalendarCheck, Check, Mail } from "lucide-react";
import type { CartLine } from "../types";
import { useI18n } from "../i18n/I18nProvider";
import { useDocumentTitle } from "../lib/useDocumentTitle";

interface State {
  reference: string;
  email: string;
  total: number;
  lines: CartLine[];
}

export default function Confirmation() {
  const { t, price } = useI18n();
  const { state } = useLocation() as { state: State | null };
  useDocumentTitle(t.confirmation.thanks);

  if (!state?.reference) return <Navigate to="/" replace />;


  return (
    <section className="section confirm">
      <div className="wrap wrap--narrow center">
        <span className="confirm__tick" aria-hidden="true">
          <Check size={26} strokeWidth={1.2} />
        </span>
        <p className="eyebrow eyebrow--center">{t.confirmation.order} {state.reference}</p>
        <h1>{t.confirmation.thanks}</h1>
        <p className="lead">
          {t.confirmation.lead}{" "}
          <strong>{state.email}</strong>.
        </p>

        <div className="confirm__box">
          <ul className="summary-card__lines">
            {state.lines.map((l, i) => (
              <li key={i}>
                <span>
                  {l.name}
                </span>
                <span>{price(l.price)}</span>
              </li>
            ))}
          </ul>
          <hr className="rule" />
          <div className="summary-card__total">
            <span>{t.confirmation.paid}</span>
            <strong>{price(state.total)}</strong>
          </div>
        </div>

        <div className="confirm__next">
                      <div>
              <CalendarCheck size={18} strokeWidth={1.1} />
              <h3>{t.confirmation.chooseSlot}</h3>
              <p className="muted">
                {t.confirmation.chooseSlotBody}
              </p>
            </div>
          <div>
            <Mail size={18} strokeWidth={1.1} />
            <h3>{t.confirmation.nothing}</h3>
            <p className="muted">
              {t.confirmation.nothingBody}{" "}
              <a href="mailto:hello@cristinacristea.com" className="ftr-link">
                hello@cristinacristea.com
              </a>{" "}
              quoting {state.reference}.
            </p>
          </div>
        </div>

        <div className="empty__cta">
          <Link to="/" className="btn">{t.confirmation.backHome}</Link>
        </div>
      </div>
    </section>
  );
}
