"use client";

import { useEffect, useMemo, useState } from "react";
import { site } from "@/content/Site";

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  const waHref = useMemo(() => {
    const text = encodeURIComponent(
      "Olá! Gostava de marcar um atendimento. 😊\n\nServiço: \nData e horário preferidos: \nLocal: Salão ou Domicílio\n\nNome: "
    );
    return `https://wa.me/${site.whatsappRaw}?text=${text}`;
  }, []);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 140);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:hidden">
      <div
        className={[
          "pointer-events-none mx-auto w-full max-w-md transition-all duration-300",
          visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        ].join(" ")}
      >
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Agendar marcação no WhatsApp"
          className="pointer-events-auto group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[#5b5545] px-6 py-3 text-[12px] font-semibold tracking-[0.18em] text-[#edeae2] shadow-[0_14px_40px_rgba(47,45,45,0.18)] transition-transform duration-200 active:scale-[0.985]"
        >
          <span className="absolute inset-0 opacity-35 [background:radial-gradient(circle_at_30%_30%,rgba(237,234,226,0.75),transparent_55%)]" />
          <span className="absolute -left-1/2 top-0 h-full w-1/2 -skew-x-12 bg-white/10 blur-[1px] transition-transform duration-700 group-hover:translate-x-[220%]" />
          <span className="relative">AGENDAR JÁ!</span>
          <span className="relative inline-block transition-transform duration-200 group-active:translate-x-0.5">→</span>
        </a>
      </div>
    </div>
  );
}
