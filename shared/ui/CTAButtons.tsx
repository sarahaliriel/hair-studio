"use client";
import { Button } from "@/components/ui/button";
import { site } from "@/config/Site";
import { bookingHref } from "./BookingLink";
export function CTAButtons() {
  function track(event: string, label: string) {
    window.gtag?.("event", event, {
      event_category: "engagement",
      event_label: label,
    });
  }
  return (
    <div className="contact-actions" data-reveal="cta">
      <Button render={<a
        href={bookingHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("cta_whatsapp_click", "whatsapp_booking")}
      />}>
        Marcar no WhatsApp
      </Button>
      <Button variant="secondary" render={<a
        href={`tel:${site.phoneRaw}`}
        onClick={() => track("cta_call_click", "phone_call")}
      />}>
        Ligar
      </Button>
      <Button variant="secondary" render={<a href={`mailto:${site.email}`} />}>
        Email
      </Button>
    </div>
  );
}
