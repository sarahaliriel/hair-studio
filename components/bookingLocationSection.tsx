import Link from "next/link";
import { SectionTitle } from "@/components/sectionTitle";
import { site } from "@/content/site";

function waLink() {
  const text = encodeURIComponent(
    `Olá! Gostava de marcar um atendimento. 😊\n\nServiço: \nData/horário preferidos: \nLocal: Salão / Domicílio\n\nNome: `
  );
  return `https://wa.me/${site.whatsappRaw}?text=${text}`;
}

const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=R.%20Silva%20Carvalho%2054B%2C%201250-255%20Lisboa";

export function BookingLocationSection() {
  return (
    <section id="contato" className="px-4 py-12 pb-16">
      <div className="mx-auto w-full max-w-5xl">
        <SectionTitle
          overline="Contacto"
          title="Marca e vem ter comigo!"
          desc="WhatsApp para marcações e dúvidas. Se precisares, abre a rota e chega sem stress."
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="glass soft-card p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-[#875f46]">
              Marcação
            </p>

            <h3 className="mt-3 font-serif text-2xl leading-tight text-[#2f2d2d]">
              Marca pelo WhatsApp em poucos segundos
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-[#2f2d2d]/75">
              Diz-me o serviço, a data e se preferes salão ou domicílio. Se tiveres uma referência, envia também.
            </p>

            <div className="mt-6">
              <Link
                href={waLink()}
                target="_blank"
                className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#5b5545] px-7 py-4 text-[12px] font-semibold tracking-[0.22em] text-[#edeae2] shadow-lg transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#2f2d2d] active:translate-y-0"
              >
                MARCAR NO WHATSAPP
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            <div className="mt-7 flex items-center justify-between gap-3">
              <a
                href={`tel:${site.phoneRaw}`}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-black/15 bg-white/30 px-5 py-3 text-[12px] font-medium tracking-[0.18em] text-[#2f2d2d] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/45 active:translate-y-0"
              >
                LIGAR
              </a>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center rounded-full border border-[#875f46]/30 bg-[#875f46]/10 px-5 py-3 text-[12px] font-semibold tracking-[0.18em] text-[#5b5545] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                ABRIR ROTA
              </a>
            </div>
          </div>

          <div className="glass soft-card overflow-hidden">
            <div className="p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.24em] text-[#875f46]">
                Localização
              </p>

              <h3 className="mt-3 font-serif text-2xl leading-tight text-[#2f2d2d]">
                Lisboa, fácil de encontrar
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-[#2f2d2d]/75">
                {site.addressLine}
              </p>

              <div className="mt-6">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full border border-black/15 bg-[#edeae2]/70 px-6 py-3 text-[12px] font-medium tracking-[0.22em] text-[#2f2d2d] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#edeae2] active:translate-y-0"
                >
                  VER NO MAPA
                </a>
              </div>
            </div>

            <div className="h-52 w-full border-t border-black/10 bg-[#edeae2] md:h-60">
              <iframe
                title="Mapa"
                src={site.googleMapsEmbedSrc}
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}