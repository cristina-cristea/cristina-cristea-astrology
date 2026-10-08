import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { merch } from "../data/merch";
import { Glyph } from "../components/ui/Glyph";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { useI18n } from "../i18n/I18nProvider";

export default function Merch() {
  const { t, price } = useI18n();
  useDocumentTitle(t.merch.title);
  const [cat, setCat] = useState(0); // 0 = all

  const items = useMemo(
    () => (cat === 0 ? merch : merch.filter((m) => m.categoryIndex === cat)),
    [cat]
  );

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="eyebrow">{t.merch.eyebrow}</p>
          <h1>{t.merch.title}</h1>
          <p className="lead page-head__lead">{t.merch.lead}</p>
        </div>
      </section>

      <div className="wrap">
        <div className="filters" role="group" aria-label={t.merch.categories[0]}>
          {t.merch.categories.map((c, i) => (
            <button
              key={c}
              type="button"
              aria-pressed={cat === i}
              className={`filters__btn${cat === i ? " is-on" : ""}`}
              onClick={() => setCat(i)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <section className="section--tight">
        <div className="wrap">
          <p className="sr-only" role="status">
            {items.length} {t.merch.productCount}
          </p>
          <div className="shop-grid">
            {items.map((m) => {
              const c = t.merchCopy[m.id];
              return (
                <Link key={m.id} to={`/merch/${m.slug}`} className="shop-card">
                  <span className="shop-card__art" aria-hidden="true"><Glyph name={m.glyph} /></span>
                  <div className="shop-card__body">
                    <span className="shop-card__cat">{t.merch.categories[m.categoryIndex]}</span>
                    <h3>{c.name}</h3>
                    <p className="muted">{c.summary}</p>
                    <span className="shop-card__price">{price(m.price)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--sand">
        <div className="wrap wrap--narrow center">
          <p className="eyebrow eyebrow--center">{t.merch.shippingEyebrow}</p>
          <h2>{t.merch.shippingTitle}</h2>
          <p className="lead" style={{ marginTop: "1.25rem" }}>{t.merch.shippingBody}</p>
        </div>
      </section>
    </>
  );
}
