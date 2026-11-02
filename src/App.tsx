import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Booking from "./pages/Booking";
import Confirmation from "./pages/Confirmation";
import Contact from "./pages/Contact";
import Shop from "./pages/Shop";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:slug" element={<ServiceDetail />} />
        <Route path="services/:slug/booking" element={<Booking />} />
        {/* Payment now happens inside the Cal.com calendar; old links land on the readings. */}
        <Route path="cart" element={<Navigate to="/services" replace />} />
        <Route path="checkout" element={<Navigate to="/services" replace />} />
        <Route path="shop" element={<Shop />} />
        <Route path="confirmation" element={<Confirmation />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
