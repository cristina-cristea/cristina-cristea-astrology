import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Dialog } from "radix-ui";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useI18n } from "../../i18n/I18nProvider";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();
  const { t } = useI18n();
  const { pathname } = useLocation();

  const nav = [
    { to: "/services", label: t.nav.services },
    { to: "/about", label: t.nav.about },
    { to: "/contact", label: t.nav.contact },
  ];

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`hdr${scrolled ? " hdr--solid" : ""}`}>
      <div className="hdr__inner wrap">
        <Link to="/" className="hdr__brand" aria-label={t.nav.home}>
          <span className="hdr__mark" aria-hidden="true">
            <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="20" cy="20" r="15" />
              <circle cx="20" cy="20" r="8.5" opacity="0.5" />
              <path d="M20 5 L22 18 L35 20 L22 22 L20 35 L18 22 L5 20 L18 18 Z" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span className="hdr__name">
            Cristina Cristea
            <em>Astrologer</em>
          </span>
        </Link>

        <nav className="hdr__nav" aria-label={t.nav.primary}>
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => `hdr__link${isActive ? " is-active" : ""}`}>
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="hdr__actions">
          <div className="hdr__lang"><LanguageSwitcher /></div>

          <Link to="/cart" className="hdr__cart" aria-label={`${t.nav.basket} (${count})`}>
            <ShoppingBag size={17} strokeWidth={1.2} />
            {count > 0 && <span className="hdr__count">{count}</span>}
          </Link>

          {/*
            Radix Dialog supplies the modal behaviour that was previously hand
            written: focus moves in on open, is trapped while open, and returns
            to the trigger on close; Escape dismisses; body scroll locks; and
            everything outside is marked aria-hidden. It also unmounts the
            drawer when closed, so the closed panel can no longer contribute to
            the document's scroll width.
          */}
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button className="hdr__burger" aria-label={t.nav.menuOpen}>
                <Menu size={20} strokeWidth={1.2} aria-hidden="true" />
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Content className="drawer" aria-describedby={undefined}>
                {/* Radix requires an accessible name; the visual design has none. */}
                <Dialog.Title className="sr-only">{t.nav.mobile}</Dialog.Title>

                {/*
                  The close control lives inside the dialog, not in the header.
                  Radix marks everything outside the content aria-hidden, so a
                  header-mounted close button would be invisible to a screen
                  reader. It is positioned to sit exactly over the trigger.
                */}
                <Dialog.Close asChild>
                  <button className="drawer__close" aria-label={t.nav.menuClose}>
                    <X size={20} strokeWidth={1.2} aria-hidden="true" />
                  </button>
                </Dialog.Close>

                <nav className="drawer__nav" aria-label={t.nav.mobile}>
                  {nav.map((n, i) => (
                    <NavLink key={n.to} to={n.to} style={{ animationDelay: `${60 + i * 45}ms` }}>
                      <span className="drawer__idx">0{i + 1}</span>
                      {n.label}
                    </NavLink>
                  ))}
                  <div className="drawer__lang"><LanguageSwitcher compact /></div>
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
