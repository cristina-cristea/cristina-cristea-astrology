import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Trash } from "lucide-react";
import { lineKey, useCart } from "../context/CartContext";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { useI18n } from "../i18n/I18nProvider";

export default function Cart() {
  const { t, price } = useI18n();
  useDocumentTitle(t.cart.title);
  const { lines, subtotal, remove } = useCart();

  if (!lines.length) {
    return (
      <section className="section empty">
        <div className="wrap wrap--narrow center">
          <ShoppingBag size={30} strokeWidth={0.9} className="empty__icon" aria-hidden="true" />
          <h1>{t.cart.empty}</h1>
          <p className="lead">{t.cart.emptyLead}</p>
          <div className="empty__cta">
            <Link to="/services" className="btn">{t.cart.browse}</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section--tight">
      <div className="wrap">
        <div className="page-head page-head--flush">
          <p className="eyebrow">{t.cart.eyebrow}</p>
          <h1>{t.cart.title}</h1>
        </div>

        <div className="cart">
          <div className="cart__lines">
            {lines.map((l) => {
              const key = lineKey(l);
              return (
                <article key={key} className="cline">
                  <div className="cline__main">
                    <div>
                      <span className="cline__kind">{t.cart.reading}</span>
                      <h3><Link to={`/services/${l.slug}`}>{l.name}</Link></h3>
                      <dl className="cline__intake">
                        <div><dt>{t.cart.name}</dt><dd>{l.intake.fullName}</dd></div>
                        <div>
                          <dt>{t.cart.born}</dt>
                          <dd>
                            {l.intake.birthDate}
                            {l.intake.timeUnknown ? ` · ${t.cart.timeUnknown}` : ` · ${l.intake.birthTime}`}
                          </dd>
                        </div>
                        <div><dt>{t.cart.place}</dt><dd>{l.intake.birthPlace}</dd></div>
                        {l.intake.partner?.fullName && (
                          <div><dt>{t.cart.secondChart}</dt><dd>{l.intake.partner.fullName}</dd></div>
                        )}
                        {l.intake.targetYear && (
                          <div><dt>{t.cart.year}</dt><dd>{l.intake.targetYear}</dd></div>
                        )}
                      </dl>
                    </div>
                    <span className="cline__price">{price(l.price)}</span>
                  </div>

                  <div className="cline__foot">
                    <span className="muted cline__single">{t.cart.oneSession}</span>
                    <button className="cline__rm" onClick={() => remove(key)}>
                      <Trash size={13} strokeWidth={1.3} aria-hidden="true" /> {t.common.remove}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="cart__side">
            <div className="summary-card">
              <h2 className="eyebrow">{t.cart.summary}</h2>
              <dl className="summary-card__dl">
                <div><dt>{t.common.subtotal}</dt><dd>{price(subtotal)}</dd></div>
              </dl>
              <hr className="rule" />
              <div className="summary-card__total">
                <span>{t.common.total}</span>
                <strong>{price(subtotal)}</strong>
              </div>
              <Link to="/checkout" className="btn btn--full" style={{ marginTop: "1.5rem" }}>
                {t.cart.checkout} <ArrowRight size={15} strokeWidth={1.4} aria-hidden="true" />
              </Link>
              <Link to="/services" className="link-u cart__cont">{t.common.allReadings}</Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
