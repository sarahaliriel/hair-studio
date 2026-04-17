"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type GalleryTag = "Penteados" | "Cor" | "Corte";
type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  tag: GalleryTag;
  note?: string;
};

const ITEMS: GalleryItem[] = [
  { id: "g1", src: "/images/galeria/001.png", alt: "Corte completo com acabamento polido e coloração", tag: "Corte", note: "Corte, coloração e hidratação" },
  { id: "g2", src: "/images/galeria/02.png", alt: "Penteado preso elegante", tag: "Penteados", note: "Evento" },
  { id: "g3", src: "/images/galeria/003.png", alt: "Corte em camadas e alisamento", tag: "Corte", note: "Luz e dimensão" },
  { id: "g4", src: "/images/galeria/004.png", alt: "Penteado com textura e volume", tag: "Penteados", note: "Leve e fácil de manter" },
  { id: "g5", src: "/images/galeria/05.png", alt: "Penteado com acabamento suave", tag: "Penteados", note: "Elegante e volumoso" },
  { id: "g6", src: "/images/galeria/006.png", alt: "Coloração tinta fantasia", tag: "Cor", note: "Coloração e alisamento" },
  { id: "g7", src: "/images/galeria/07.png", alt: "Penteado com ondas, volume e trança", tag: "Penteados", note: "Movimento natural" },
  { id: "g8", src: "/images/galeria/08.png", alt: "Corte curto e banho de brilho", tag: "Corte", note: "Corte curto channel" },
  { id: "g9", src: "/images/galeria/09.png", alt: "Coloração, hidratação e corte em camadas com volume", tag: "Cor", note: "Coloração tinta fantasia" },
  { id: "g10", src: "/images/galeria/10.png", alt: "Progressiva", tag: "Corte", note: "Corte com progressiva" },
  { id: "g11", src: "/images/galeria/11.png", alt: "Penteado com trança", tag: "Penteados", note: "Penteado com trança e hidratação" },
  { id: "g12", src: "/images/galeria/12.png", alt: "Penteado com trança", tag: "Penteados", note: "Penteado com trança para evento" },
];

const FILTERS: Array<{ key: "Tudo" | GalleryTag; label: string }> = [
  { key: "Tudo", label: "Tudo" },
  { key: "Penteados", label: "Penteados" },
  { key: "Cor", label: "Cor" },
  { key: "Corte", label: "Corte" },
];

function ZoomIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        fill="currentColor"
        d="M10 4a6 6 0 1 1 0 12a6 6 0 0 1 0-12Zm0 2a4 4 0 1 0 0 8a4 4 0 0 0 0-8Zm7.3 10.9l2.4 2.4a1 1 0 0 1-1.4 1.4l-2.4-2.4a8 8 0 1 1 1.4-1.4Z"
      />
    </svg>
  );
}

export function GalleryGrid() {
  const [active, setActive] = useState<(typeof FILTERS)[number]["key"]>("Tudo");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (active === "Tudo") return ITEMS;
    return ITEMS.filter((i) => i.tag === active);
  }, [active]);

  const openIndex = useMemo(() => {
    if (!openId) return -1;
    return filtered.findIndex((i) => i.id === openId);
  }, [filtered, openId]);

  const openItem = useMemo(() => {
    if (openIndex < 0) return null;
    return filtered[openIndex] ?? null;
  }, [filtered, openIndex]);

  const goPrev = () => {
    if (!filtered.length) return;
    if (openIndex <= 0) setOpenId(filtered[filtered.length - 1].id);
    else setOpenId(filtered[openIndex - 1].id);
  };

  const goNext = () => {
    if (!filtered.length) return;
    if (openIndex >= filtered.length - 1) setOpenId(filtered[0].id);
    else setOpenId(filtered[openIndex + 1].id);
  };

  useEffect(() => {
    if (!openId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openId, openIndex, filtered]);

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const isActive = f.key === active;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setActive(f.key)}
              className={[
                "rounded-full px-4 py-2 text-xs transition-all",
                "border",
                isActive
                  ? "border-[#5b5545]/40 bg-[#5b5545] text-[#edeae2]"
                  : "border-[#2f2d2d]/10 bg-white/35 text-[#2f2d2d]/85 hover:bg-white/55",
              ].join(" ")}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {filtered.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setOpenId(item.id)}
            className="group relative block w-full overflow-hidden rounded-[22px] border border-[#2f2d2d]/10 bg-white/20 text-left shadow-[0_12px_34px_rgba(47,45,45,0.08)] transition-all hover:-translate-y-0.5 hover:bg-white/30 hover:shadow-[0_18px_48px_rgba(47,45,45,0.12)]"
            aria-label={`Abrir imagem: ${item.alt}`}
          >
            <div className="relative aspect-4/5 w-full transform-gpu">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              />
            </div>

            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(47,45,45,.55),transparent_60%)] opacity-70 transition-opacity duration-300 group-hover:opacity-95" />

            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold text-[#edeae2]">
                <ZoomIcon />
                Ver
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-xs font-semibold text-[#edeae2]">{item.tag}</p>
              <p className="mt-0.5 text-[11px] text-[#edeae2]/85">{item.note ?? "Detalhe e finalização"}</p>
            </div>
          </button>
        ))}
      </div>

      {openItem ? (
        <div className="fixed inset-0 z-80">
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => setOpenId(null)}
            className="absolute inset-0 bg-[#2f2d2d]/60"
          />

          <div className="pointer-events-auto fixed left-1/2 top-1/2 w-[min(92vw,720px)] -translate-x-1/2 -translate-y-1/2 px-2">
            <div className="glass overflow-hidden rounded-[28px] border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
              <div className="flex items-start justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#2f2d2d]">{openItem.tag}</p>
                  <p className="mt-0.5 truncate text-xs text-[#2f2d2d]/70">{openItem.alt}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden rounded-full border border-[#2f2d2d]/10 bg-white/35 px-3 py-2 text-xs text-[#2f2d2d]/80 sm:inline">
                    {openIndex + 1}/{filtered.length}
                  </span>

                  <button
                    type="button"
                    onClick={goPrev}
                    className="rounded-full border border-[#2f2d2d]/10 bg-white/40 px-3 py-2 text-xs text-[#2f2d2d] hover:bg-white/65"
                    aria-label="Anterior"
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    onClick={goNext}
                    className="rounded-full border border-[#2f2d2d]/10 bg-white/40 px-3 py-2 text-xs text-[#2f2d2d] hover:bg-white/65"
                    aria-label="Seguinte"
                  >
                    ›
                  </button>

                  <button
                    type="button"
                    onClick={() => setOpenId(null)}
                    className="rounded-full border border-[#2f2d2d]/10 bg-white/40 px-3 py-2 text-xs text-[#2f2d2d] hover:bg-white/65"
                  >
                    Fechar
                  </button>
                </div>
              </div>

              <div className="w-full bg-white/20">
                <div className="relative h-[62vh] w-full transform-gpu">
                  <Image src={openItem.src} alt={openItem.alt} fill className="object-contain" sizes="92vw" />
                </div>
              </div>
            </div>

            <div className="mt-3 flex justify-center sm:hidden">
              <span className="rounded-full bg-white/30 px-3 py-1 text-[11px] text-[#edeae2]/90">
                {openIndex + 1}/{filtered.length}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}