import { site } from "@/content/Site";

export function CTAButtons() {
  const waText = encodeURIComponent(
    `Olá! Gostava de marcar um atendimento. 😊\n\nServiço: \nData/horário preferidos: \nLocal: Salão / Domicílio\n\nNome: `
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <a
        className="inline-flex items-center justify-center rounded-full bg-[#5b5545] px-6 py-3 text-[12px] font-medium tracking-[0.22em] text-[#edeae2] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
        href={`https://wa.me/${site.whatsappRaw}?text=${waText}`}
        target="_blank"
        rel="noreferrer"
      >
        MARCAR NO WHATSAPP
      </a>

      <a
        className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white/30 px-6 py-3 text-[12px] font-medium tracking-[0.22em] text-[#2f2d2d] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/45 active:translate-y-0"
        href={`tel:${site.phoneRaw}`}
      >
        LIGAR
      </a>

      <a
        className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white/30 px-6 py-3 text-[12px] font-medium tracking-[0.22em] text-[#2f2d2d] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/45 active:translate-y-0"
        href={`mailto:${site.email}`}
      >
        EMAIL
      </a>
    </div>
  );
}
