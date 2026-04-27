"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/content/Site";

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [inFooter, setInFooter] = useState(false);
  const pathname = usePathname();

  const waHref = useMemo(() => {
    const text = encodeURIComponent(
      "Olá! Gostava de marcar um atendimento. 😊\n\nServiço: \nData e horário preferidos: \nLocal: Salão ou Domicílio\n\nNome: "
    );
    return `https://wa.me/${site.whatsappRaw}?text=${text}`;
  }, []);

  const isGaleria = pathname.includes("galeria");
  const isServicos = pathname.includes("servicos");

  const ctaConfig = useMemo(() => {
    if (isGaleria) {
      return {
        label: "VER SERVIÇOS",
        href: "/#servicos",
      };
    }

    if (isServicos) {
      return {
        label: "VER GALERIA",
        href: "/galeria",
      };
    }

    return {
      label: "AGENDAR JÁ!",
      href: waHref,
      external: true,
    };
  }, [isGaleria, isServicos, waHref]);

useEffect(() => {
  const footer = document.querySelector("footer");
  if (!footer) return;

  let hideTimeout: NodeJS.Timeout | null = null;

  const observer = new IntersectionObserver(
    ([entry]) => {
      const scrolledEnough = window.scrollY > 140;

      if (entry.isIntersecting) {
        if (hideTimeout) clearTimeout(hideTimeout);

        hideTimeout = setTimeout(() => {
          setVisible(false);
        }, 150);

        return;
      }

      setVisible(scrolledEnough);
    },
    {
      root: null,
      threshold: 0.1,
    }
  );

  observer.observe(footer);

  return () => {
    observer.disconnect();
    if (hideTimeout) clearTimeout(hideTimeout);
  };
}, []);

  const shouldShow = visible || inFooter;

  return (
  <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:hidden">
    <div
      className={[
        "pointer-events-none mx-auto w-full max-w-md transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
      ].join(" ")}
    >
      <a
        href={ctaConfig.href}
        {...(ctaConfig.external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className={[
          "pointer-events-auto group relative flex items-center justify-center gap-2 overflow-hidden rounded-full text-[12px] font-semibold tracking-[0.18em] shadow-[0_14px_40px_rgba(47,45,45,0.18)] transition-all duration-500",
          
          inFooter
            ? "px-4 py-2 scale-95 backdrop-blur-md bg-[#5b5545]/70"
            : "px-6 py-3 scale-100 bg-[#5b5545]",

          "text-[#edeae2]"
        ].join(" ")}
      >

        <span className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_30%_30%,rgba(237,234,226,0.7),transparent_60%)]" />

        <span
          className={[
            "absolute -left-1/2 top-0 h-full w-1/2 -skew-x-12 bg-white/10 blur-[1px] transition-transform duration-700",
            !inFooter && "group-hover:translate-x-[220%]"
          ].join(" ")}
        />

        <span className="relative transition-all duration-300">
          {inFooter ? "AGENDAR JÁ!" : ctaConfig.label}
        </span>

        <span className="relative inline-block transition-transform duration-200 group-active:translate-x-0.5">
          →
        </span>
      </a>
    </div>
  </div>
);
}