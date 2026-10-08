import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useI18n } from "../../i18n/I18nProvider";

export function Layout() {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });

    // Moving focus to the new view on navigation — without it a keyboard or
    // screen-reader user stays parked on the link they just activated and has
    // to tab back through the header on every route change (WCAG 2.4.3).
    // Skipped on first paint so a fresh page load starts at the top as usual.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main">
        {t.nav.skip}
      </a>
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
