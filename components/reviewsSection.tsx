"use client";

import { useEffect, useMemo, useState } from "react";
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
  attribution?: string;
};

const fallback: NonNullable<ApiPayload["reviews"]> = [
  {
    text: "A melhor cabelereira de sempre! Faço meu cabelo com a Arlete desde 2022 e não me arrependo. Já fiz mechas, pintei o cabelo todo de azul (que inclusive já marquei pra fazer de novo), já hidratei, cortei... tudo sempre lá. Mulher incrível, simpática e grande profissional. Beijos Arlete 💙",
    authorName: "ali !!",
    rating: 5,
    relativeTime: "",
    authorUrl: "",
  },
  {
    text: "Pintei o meu cabelo de vermelho e faço hidratação. Gostei imenso do resultado. Cabeleireira muito simpática!",
    authorName: "Pedro Pereira",
    rating: 5,
    relativeTime: "",
    authorUrl: "",
  },
  {
    text: "Updos",
    authorName: "Gabriel Silva",
    rating: 5,
    relativeTime: "",
    authorUrl: "",
  },
];

function Stars({ n }: { n: number }) {
  const v = Math.max(0, Math.min(5, Math.round(n)));
  return (
    <div className="flex gap-1" aria-label={`${v} estrelas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < v ? "text-[#5b5545]" : "text-[#2f2d2d]/20"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const [data, setData] = useState<ApiPayload | null>(null);

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
      });

    return () => {
      alive = false;
    };
  }, []);

  const list = useMemo(() => {
    if (data?.ok && Array.isArray(data.reviews) && data.reviews.length) return data.reviews;
    return fallback;
  }, [data]);

  const placeName = data?.ok ? data.place?.name : "";
  const placeRating = data?.ok ? data.place?.rating : 0;
  const placeCount = data?.ok ? data.place?.userRatingCount : 0;
  const placeLink = data?.ok ? data.place?.googleMapsUri : "";

  return (
    <section className="px-4 py-12">
      <div className="mx-auto w-full max-w-5xl">
        <SectionTitle
          overline="Opiniões"
          title="Avaliações reais no Google"
          desc="Comentários verificados ajudam a decidir com confiança."
        />

        {data?.ok && placeName ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white/40 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-semibold tracking-[0.18em] text-[#2f2d2d]">{placeName}</span>
              <span className="text-[12px] text-[#2f2d2d]/70">{Number(placeRating || 0).toFixed(1)} ★</span>
              <span className="text-[12px] text-[#2f2d2d]/55">({placeCount})</span>
            </div>

            {placeLink ? (
              <a
                href={placeLink}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-semibold tracking-[0.18em] text-[#875f46]"
              >
                VER NO GOOGLE
              </a>
            ) : null}
          </div>
        ) : null}

        <div className="mt-8">
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:block sm:overflow-visible sm:px-0">
            <div className="sm:columns-3 sm:gap-6">
              {list.map((r, idx) => (
                <div
                  key={`${r.authorName}-${idx}`}
                  className="soft-card mb-6 break-inside-avoid rounded-[28px] border border-[#2f2d2d]/10 bg-white/60 p-5 shadow-[0_14px_45px_rgba(47,45,45,0.08)]"
                >
                  <Stars n={Number(r.rating || 0)} />

                  <p className="mt-3 text-[14px] leading-relaxed text-[#2f2d2d]/85">
                    {r.text ? `“${r.text}”` : "“Experiência excelente.”"}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    {r.authorUrl ? (
                      <a
                        href={r.authorUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[13px] font-semibold tracking-[0.06em] text-[#2f2d2d]"
                      >
                        {r.authorName}
                      </a>
                    ) : (
                      <p className="text-[13px] font-semibold tracking-[0.06em] text-[#2f2d2d]">{r.authorName}</p>
                    )}

                    {r.relativeTime ? (
                      <p className="text-[12px] tracking-[0.06em] text-[#2f2d2d]/55">{r.relativeTime}</p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}