"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { BookingLink } from "./BookingLink";

export function FloatingCTA() {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const actions = document.querySelector<HTMLElement>(".gallery-hero-actions");
    if (!actions) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    let observer: IntersectionObserver | undefined;
    let observedHeight = -1;
    let actionsNearby = false;

    const updateVisibility = (show: boolean) => {
      if (!show && bar.contains(document.activeElement)) {
        const heroBooking = actions.querySelector<HTMLElement>("a");
        if (!heroBooking) return;
        const bookingRect = heroBooking.getBoundingClientRect();
        const navbarBottom = document.querySelector(".classic-navbar")?.getBoundingClientRect().bottom ?? 0;
        if (bookingRect.top < navbarBottom || bookingRect.bottom > window.innerHeight) return;
        heroBooking.focus({ preventScroll: true });
      }
      setVisible(show);
    };

    const observeActions = () => {
      const barHeight = Math.ceil(bar.getBoundingClientRect().height);
      if (barHeight === observedHeight && observer) return;
      observedHeight = barHeight;
      observer?.disconnect();
      // Include the space occupied by the bar, so it hides before a CTA reaches it.
      observer = new IntersectionObserver(
        ([entry]) => {
          actionsNearby = entry.isIntersecting;
          updateVisibility(!actionsNearby);
        },
        { rootMargin: `0px 0px ${barHeight}px 0px`, threshold: 0 },
      );
      observer.observe(actions);
    };

    const checkFocusedBar = () => {
      if (actionsNearby) updateVisibility(false);
    };

    observeActions();
    const resizeObserver = new ResizeObserver(observeActions);
    resizeObserver.observe(bar);
    window.addEventListener("scroll", checkFocusedBar, { passive: true });

    return () => {
      observer?.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", checkFocusedBar);
    };
  }, [pathname]);

  return (
    <div ref={barRef} className="mobile-booking" data-visible={visible} inert={!visible}>
      <BookingLink>Marcar pelo WhatsApp</BookingLink>
    </div>
  );
}
