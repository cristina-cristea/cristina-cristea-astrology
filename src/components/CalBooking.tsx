import { useEffect, useRef } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

/**
 * Cristina's Cal.com booking link. Availability (Tuesday–Friday, 10:00–18:00,
 * Europe/Bucharest), the 90-minute length, the 30-minute buffer after each
 * session, minimum notice and how far ahead clients can book are all set in
 * Cal.com, not here. Cal.com also prevents overlapping bookings.
 */
const NAMESPACE = "consultatie";

export interface BookedSlot {
  start: string; // ISO
  end: string;   // ISO
  uid?: string;
}

/** Reads a design token so the embed matches the site without hardcoding colours. */
const token = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export function CalBooking({
  name,
  email,
  notes,
  onBooked,
  calLink,
}: {
  name: string;
  email: string;
  notes: string;
  onBooked: (slot: BookedSlot) => void;
  /** Cal.com link for the visitor's currency (see lib/pricing). */
  calLink: string;
}) {
  // The Cal.com listener is registered once, so it calls through a ref to
  // always reach the latest handler.
  const onBookedRef = useRef(onBooked);
  useEffect(() => {
    onBookedRef.current = onBooked;
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cal = await getCalApi({ namespace: NAMESPACE });
      if (cancelled) return;
      const brand = token("--ink");
      cal("ui", {
        theme: "light",
        hideEventTypeDetails: false,
        layout: "month_view",
        ...(brand ? { cssVarsPerTheme: { light: { "cal-brand": brand }, dark: { "cal-brand": brand } } } : {}),
      });
      cal("on", {
        action: "bookingSuccessfulV2",
        callback: (e) => {
          const d = e.detail.data;
          if (d.startTime && d.endTime) onBookedRef.current({ start: d.startTime, end: d.endTime, uid: d.uid });
        },
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Cal
      namespace={NAMESPACE}
      calLink={calLink}
      className="cal-embed"
      config={{ layout: "month_view", theme: "light", name, email, notes }}
    />
  );
}
