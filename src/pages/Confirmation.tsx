import { Link, Navigate, useLocation } from "react-router-dom";
import { CalendarCheck, Check, Mail } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { useDocumentTitle } from "../lib/useDocumentTitle";

/** Handed over by the booking page once Cal.com has created the booking. */
export interface ConfirmationState {
  reading: string;
  email: string;
  price: number;
  start: string; // ISO
}

export default function Confirmation() {
  const { t, price, dateTime } = useI18n();
  const { state } = useLocation() as { state: ConfirmationState | null };
  useDocumentTitle(t.confirmation.thanks);

  if (!state?.start) return <Navigate to="/" replace />;

  return (
    <section className="section confirm">
      <div className="wrap wrap--narrow center">
        <span className="confirm__tick" aria-hidden="true">
          <Check size={26} strokeWidth={1.2} />
        </span>
        <h1>{t.confirmation.thanks}</h1>
        <p className="lead">
          {t.confirmation.lead}{" "}
          <strong>{state.email}</strong>.
        </p>

        <div className="confirm__box">
          <ul className="summary-card__lines">
            <li>
              <span>
                {state.reading}
                <span className="muted confirm__slot">{dateTime(state.start)}</span>
              </span>
              <span>{price(state.price)}</span>
            </li>
          </ul>
        </div>

        <div className="confirm__next">
          <div>
            <CalendarCheck size={18} strokeWidth={1.1} aria-hidden="true" />
            <h3>{t.confirmation.chooseSlot}</h3>
            <p className="muted">{t.confirmation.chooseSlotBody}</p>
          </div>
          <div>
            <Mail size={18} strokeWidth={1.1} aria-hidden="true" />
            <h3>{t.confirmation.nothing}</h3>
            <p className="muted">
              {t.confirmation.nothingBody}{" "}
              <a href="mailto:cristina.cristea17@gmail.com" className="ftr-link">
                cristina.cristea17@gmail.com
              </a>
              .
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
