"use client";

import { useMemo, useState } from "react";
import { serviceCategories, servicesMenu, type ServiceCategoryKey } from "@/content/ServicesMenu";
import { site } from "@/content/Site";

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function waLink(serviceName: string) {
  const text = encodeURIComponent(
    `Olá! Gostava de marcar um atendimento! 😊\n\nServiço: ${serviceName}\nData/horário preferidos: \nLocal: Salão / Domicílio\n\nNome: `
  );
  return `https://wa.me/${site.whatsappRaw}?text=${text}`;
}

export function ServicesMenu() {
  const [active, setActive] = useState<ServiceCategoryKey>(serviceCategories[0]?.key ?? "trancas");
  const [q, setQ] = useState("");

  const visible = useMemo(() => {
    const byCategory = servicesMenu.filter((i) => i.category === active);
    const nq = normalize(q);
    if (!nq) return byCategory;
    return byCategory.filter((i) => normalize(i.name + " " + i.desc).includes(nq));
  }, [active, q]);

  return (
    <section className="mt-8">
      <div className="rounded-[28px] border border-black/10 bg-white/40 p-3 backdrop-blur">
        <div className="flex gap-2 overflow-x-auto px-1 py-1 [-webkit-overflow-scrolling:touch]">
          {serviceCategories.map((c) => {
            const on = c.key === active;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setActive(c.key)}
                className={[
                  "shrink-0 rounded-full px-4 py-2 text-[12px] tracking-[0.16em] transition",
                  on ? "bg-[#2f2d2d] text-[#edeae2]" : "bg-transparent text-black/70 hover:bg-black/5",
                ].join(" ")}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        <div className="mt-3 px-1">
          <div className="flex items-center gap-2 rounded-full border border-black/10 bg-[#edeae2]/60 px-4 py-3">
            <span className="text-black/45">⌕</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Procurar serviço..."
              className="w-full bg-transparent text-[14px] text-[#2f2d2d] placeholder:text-black/45 outline-none"
            />
            {q ? (
              <button
                type="button"
                onClick={() => setQ("")}
                className="rounded-full px-3 py-1 text-[12px] tracking-[0.18em] text-black/55 hover:bg-black/5"
              >
                LIMPAR
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-[28px] border border-black/10 bg-white/40">
        {visible.length ? (
          <ul className="divide-y divide-black/10">
            {visible.map((s) => (
              <li key={s.id} className="p-4 sm:p-5">
                <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif text-[18px] leading-tight text-[#2f2d2d]">{s.name}</h3>
                      {s.badge ? (
                        <span className="rounded-full border border-black/10 bg-[#edeae2] px-3 py-1 text-[10px] tracking-[0.18em] text-black/70">
                          {s.badge}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-[14px] leading-relaxed text-black/65">{s.desc}</p>
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <span className="shrink-0 rounded-full border border-black/10 bg-[#edeae2] px-4 py-2 text-[12px] font-medium tracking-[0.12em] text-[#2f2d2d]">
                      {s.priceFrom}
                    </span>

                    <a
                      href={waLink(s.name)}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex shrink-0 items-center justify-center rounded-full bg-[#5b5545] px-5 py-2.5 text-[12px] font-medium tracking-[0.18em] text-[#edeae2] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      MARCAR
                      <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                        →
                      </span>
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6">
            <p className="text-[14px] text-black/65">Sem resultados para “{q}”.</p>
          </div>
        )}

        <div className="border-t border-black/10 p-4 sm:p-5">
          <p className="text-[13px] leading-relaxed text-black/60">
            Valores “desde” variam conforme comprimento, volume e complexidade. Para orçamento exato, envia uma foto do teu
            cabelo e uma referência no WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
}
