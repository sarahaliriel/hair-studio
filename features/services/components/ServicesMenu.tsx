"use client";
import { Button } from "@/components/ui/button";

import { useMemo, useState } from "react";
import {
  serviceCategories,
  servicesMenu,
  type ServiceCategoryKey,
} from "@/features/services/data/ServicesMenu";
import { site } from "@/config/Site";

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function waLink(serviceName: string) {
  const text = encodeURIComponent(
    `Olá! Gostava de marcar um atendimento! 😊\n\nServiço: ${serviceName}\nData/horário preferidos: \nLocal: Salão / Domicílio\n\nNome: `,
  );
  return `https://wa.me/${site.whatsappRaw}?text=${text}`;
}

export function ServicesMenu({ initialCategory }: { initialCategory?: string }) {
  const [active, setActive] = useState<ServiceCategoryKey>(
    serviceCategories.find((item) => item.key === initialCategory)?.key ?? serviceCategories[0]?.key ?? "coloracao",
  );
  const [q, setQ] = useState("");

  const visible = useMemo(() => {
    const byCategory = servicesMenu.filter((i) => i.category === active);
    const nq = normalize(q);
    if (!nq) return byCategory;
    return byCategory.filter((i) =>
      normalize(i.name + " " + i.desc).includes(nq),
    );
  }, [active, q]);

  return (
    <section id="servicos-list" className="mt-8 scroll-mt-28">
      <div className="rounded-[28px] border border-black/10 bg-white/40 p-3 backdrop-blur" data-reveal="fadeUp" data-reveal-exit="none">
        <div className="flex flex-wrap gap-2 px-1 py-1">
          {serviceCategories.map((c) => {
            const on = c.key === active;
            return (
              <Button
                key={c.key}
                type="button"
                aria-pressed={on}
                onClick={() => setActive(c.key)}
                variant={on ? "default" : "secondary"}
              >
                {c.label}
              </Button>
            );
          })}
        </div>

        <div className="mt-3 px-1">
          <div className="service-search flex items-center gap-2 rounded-full border border-black/10 bg-[#edeae2]/60 px-4 py-3">
            <span className="text-black/45">⌕</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Procurar serviço na categoria selecionada"
              placeholder="Procurar serviço..."
              className="w-full bg-transparent text-[16px] text-[#2f2d2d] placeholder:text-black/45 outline-none"
            />
            {q ? (
              <Button
                type="button"
                onClick={() => setQ("")}
                size="sm"
                variant="secondary"
              >
                LIMPAR
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-[28px] border border-black/10 bg-white/40">
        {visible.length ? (
          <ul className="divide-y divide-black/10">
            {visible.map((s) => (
              <li data-reveal="fadeUp" data-reveal-start="top 88%" data-reveal-exit="none" key={s.id} className="p-6 sm:px-8 sm:py-7">
                <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif text-[18px] leading-tight text-[#2f2d2d]">
                        {s.name}
                      </h3>
                      {s.badge ? (
                        <span className="rounded-full border border-black/10 bg-[#edeae2] px-3 py-1 text-[12px] tracking-[0.18em] text-black/70">
                          {s.badge}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-[16px] leading-relaxed text-black/65">
                      {s.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <span className="shrink-0 rounded-full border border-black/10 bg-[#edeae2] px-4 py-2 text-[14px] font-medium tracking-[0.12em] text-[#2f2d2d]">
                      {s.priceFrom}
                    </span>

                    <Button render={<a
                      href={waLink(s.name)}
                      target="_blank"
                      rel="noreferrer"
                     />}>
                      Marcar
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6">
            <p className="text-[16px] text-black/65">
              Sem resultados para “{q}”.
            </p>
          </div>
        )}

        <div className="border-t border-black/10 p-4 sm:p-5">
          <p className="text-[15px] leading-relaxed text-black/60">
            Valores “desde” variam conforme comprimento, volume e complexidade.
            Para orçamento exato, envia uma foto do teu cabelo e uma referência
            no WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
}
