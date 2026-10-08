import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { I18nProvider } from "./i18n/I18nProvider";
import App from "./App";
import "./index.css";
import "./styles/components.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* BASE_URL mirrors Vite's `base`, so routes work at / locally and at
        /<repo>/ on GitHub Pages without touching any <Link>. */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <I18nProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>
);
