import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import { getMerch, merch } from "../data/merch";
import { Glyph } from "../components/ui/Glyph";
import { useCart } from "../context/CartContext";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { useI18n } from "../i18n/I18nProvider";
import { Select } from "../components/ui/Select";
import NotFound from "./NotFound";

export default function MerchDetail() {
  const { slug } = useParams();
  const item = getMerch(slug);
  const { addMerch } = useCart();
  const { t, price } = useI18n();
  useDocumentTitle(item ? t.merchCopy[item.id].name : undefined);

  const copy = item ? t.merchCopy[item.id] : undefined;
  const [variant, setVariant] = useState<string | undefined>(copy?.variantOptions?.[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!item || !copy) return <NotFound />;

  const onAdd = () => {
    addMerch({ id: item.id, slug: item.slug, name: copy.name, price: item.price }, variant, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2400);
  };

  const others = merch.filter((m) => m.id !== item.id).slice(0, 3);

  return (
    <>
      <article className="pd">
        <div className="wrap">
          <Link to="/merch" className="pd__back">
            <ArrowLeft size={14} strokeWidth={1.4} aria-hidden="true" /> {t.common.allProducts}
          </Link>

          <div className="pd__grid">
            <div className="pd__art pd__art--product" aria-hidden="true"><Glyph name={item.glyph} /></div>

            <div className="pd__head">
              <p className="eyebrow">{t.merch.categories[item.categoryIndex]}</p>
              <h1>{copy.name}</h1>
              <p className="lead">{copy.summary}</p>

              <span className="pd__price pd__price--solo">{price(item.price)}</span>

              {copy.variantOptions && (
                <div className="field pd__variant">
                  <label htmlFor="variant">{copy.variantLabel}</label>
                  <Select
                    id="variant"
                    value={variant ?? copy.variantOptions[0]}
                    onChange={setVariant}
                    options={copy.variantOptions}
                  />
                </div>
              )}

              <div className="pd__addrow">
                <div className="qty" role="group" aria-label={t.common.quantity}>
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label={t.common.decrease}>
                    <Minus size={14} strokeWidth={1.4} aria-hidden="true" />
                  </button>
                  <span aria-live="polite">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label={t.common.increase}>
                    <Plus size={14} strokeWidth={1.4} aria-hidden="true" />
                  </button>
                </div>
                <button className="btn" onClick={onAdd}>
                  {added
                    ? <>{t.merch.added} <Check size={15} strokeWidth={1.6} aria-hidden="true" /></>
                    : <>{t.merch.addToBasket} <ShoppingBag size={15} strokeWidth={1.3} aria-hidden="true" /></>}
                </button>
              </div>

              {added && (
                <p className="pd__added" role="status">
                  {t.merch.inBasket} <Link to="/cart" className="link-u">{t.merch.viewBasket}</Link>
                </p>
              )}

              <p className="pd__note muted">
                <Truck size={13} strokeWidth={1.3} aria-hidden="true" /> {t.merch.postedNote}
              </p>

              {item.slug === "custom-natal-chart-print" && (
                <p className="pd__callout">{t.merch.chartPrintNote}</p>
              )}
            </div>
          </div>
        </div>
      </article>

      <section className="section section--sand">
        <div className="wrap pd__cols">
          <div className="pd__prose">
            <p className="eyebrow">{t.merch.details}</p>
            {copy.description.map((p) => <p key={p.slice(0, 24)} className="lead">{p}</p>)}
          </div>
          <aside className="pd__aside">
            <div className="pd__box">
              <h3>{t.merch.specification}</h3>
              <ul className="ticks ticks--dot">
                {copy.details.map((d) => <li key={d}>{d}</li>)}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">{t.merch.more}</p>
              <h2>{t.merch.fromShop}</h2>
            </div>
            <Link to="/merch" className="link-u">{t.common.allProducts}</Link>
          </div>
          <div className="merch-strip">
            {others.map((m) => (
              <Link key={m.id} to={`/merch/${m.slug}`} className="merch-card">
                <span className="merch-card__art" aria-hidden="true"><Glyph name={m.glyph} /></span>
                <span className="merch-card__cat">{t.merch.categories[m.categoryIndex]}</span>
                <h3>{t.merchCopy[m.id].name}</h3>
                <span className="merch-card__price">{price(m.price)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
