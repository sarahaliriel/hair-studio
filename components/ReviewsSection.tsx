"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SectionTitle } from "@/components/SectionTitleMenu";

type ApiPayload = {
  ok: boolean;
  place?: {
    name: string;
    rating: number;
    userRatingCount: number;
    googleMapsUri: string;
  };
  reviews?: {
    rating: number;
    text: string;
    authorName: string;
    authorUrl?: string;
    relativeTime?: string;
  }[];
};

const fallback: NonNullable<ApiPayload["reviews"]> = [
  {
    text: "A melhor cabelereira de sempre! Faço meu cabelo com a Arlete desde 2022 e não me arrependo.",
    authorName: "Cliente",
    rating: 5,
  },
];

function Stars({ n }: { n: number }) {
  const v = Math.max(0, Math.min(5, Math.round(n)));

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-[14px] transition ${
            i < v ? "text-[#5b5545]" : "text-[#2f2d2d]/20"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-[28px] border border-[#2f2d2d]/10 bg-[#edeae2] p-5">
      <div className="h-3 w-20 bg-[#2f2d2d]/20 rounded mb-3" />
      <div className="h-3 w-full bg-[#2f2d2d]/20 rounded mb-2" />
      <div className="h-3 w-5/6 bg-[#2f2d2d]/20 rounded mb-2" />
      <div className="h-3 w-2/3 bg-[#2f2d2d]/20 rounded" />
    </div>
  );
}

export default function ReviewsSection() {
  const [data, setData] = useState<ApiPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;

    fetch("/api/google-reviews")
      .then((r) => r.json())
      .then((json: ApiPayload) => {
        if (!alive) return;
        setData(json && typeof json.ok === "boolean" ? json : { ok: false });
      })
      .catch(() => {
        if (!alive) return;
        setData({ ok: false });
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const list = useMemo(() => {
    if (data?.ok && Array.isArray(data.reviews) && data.reviews.length) return data.reviews;
    return fallback;
  }, [data]);

  const place = data?.place;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const children = Array.from(el.children) as HTMLElement[];

      const center = el.scrollLeft + el.offsetWidth / 2;

      let closest = 0;
      let minDist = Infinity;

      children.forEach((child, i) => {
        const childCenter = child.offsetLeft + child.offsetWidth / 2;
        const dist = Math.abs(center - childCenter);

        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });

      setActive(closest);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="px-4 py-14">
      <div className="mx-auto w-full max-w-5xl">
        <SectionTitle
          overline="Opiniões"
          title="Avaliações reais no Google"
          desc="Comentários verificados ajudam a decidir com confiança."
        />

        {place?.name && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#2f2d2d]/10 bg-white/50 backdrop-blur px-4 py-3 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-semibold tracking-[0.18em] text-[#2f2d2d]">
                {place.name}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-[#5b5545]">
                  {Number(place.rating || 0).toFixed(1)}
                </span>
                <Stars n={place.rating} />
                <span className="text-[12px] text-[#2f2d2d]/55">
                  ({place.userRatingCount})
                </span>
              </div>
            </div>

            {place.googleMapsUri && (
              <a
                href={place.googleMapsUri}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-semibold tracking-[0.18em] text-[#875f46]"
              >
                VER NO GOOGLE
              </a>
            )}
          </div>
        )}

        <div className="mt-8">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 sm:hidden"
          >
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="min-w-[85%]">
                    <SkeletonCard />
                  </div>
                ))
              : list.map((r, idx) => {
                  const isActive = idx === active;

                  return (
                    <div
                      key={`${r.authorName}-${idx}`}
                      className="min-w-[85%] snap-center"
                    >
                      <div
                        className={`
                          rounded-[28px] border border-[#2f2d2d]/10 bg-white/60 p-5
                          shadow-[0_14px_45px_rgba(47,45,45,0.08)] backdrop-blur
                          transition-all duration-300
                          ${isActive ? "scale-100" : "scale-[0.95] opacity-60"}
                        `}
                      >
                        <Stars n={Number(r.rating || 0)} />

                        <p className="mt-3 text-[14px] leading-relaxed text-[#2f2d2d]/85">
                          {r.text ? `“${r.text}”` : "“Experiência excelente.”"}
                        </p>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <p className="text-[13px] font-semibold text-[#2f2d2d]">
                            {r.authorName}
                          </p>

                          {r.relativeTime && (
                            <p className="text-[12px] text-[#2f2d2d]/55">
                              {r.relativeTime}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>

          <div className="hidden sm:block columns-1 sm:columns-2 lg:columns-3 gap-4">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
              : list.map((r, idx) => (
                  <div
                    key={`${r.authorName}-${idx}`}
                    className="group mb-4 break-inside-avoid rounded-[28px] border border-[#2f2d2d]/10 bg-white/60 p-5 shadow-[0_14px_45px_rgba(47,45,45,0.08)] backdrop-blur transition-all duration-300 hover:scale-[1.02]"
                  >
                    <Stars n={Number(r.rating || 0)} />

                    <p className="mt-3 text-[14px] leading-relaxed text-[#2f2d2d]/85 line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
                      {r.text ? `“${r.text}”` : "“Experiência excelente.”"}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-[13px] font-semibold text-[#2f2d2d]">
                        {r.authorName}
                      </p>

                      {r.relativeTime && (
                        <p className="text-[12px] text-[#2f2d2d]/55">
                          {r.relativeTime}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}