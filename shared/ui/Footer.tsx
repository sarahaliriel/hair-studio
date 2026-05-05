import { site } from "@/content/Site";

export function Footer() {
  const waText = encodeURIComponent(
    `Olá! Gostava de marcar um atendimento. 😊\n\nServiço: \nData e horário preferidos: \nLocal: Salão ou Domicílio\n\nNome: `
  );

  return (
    <footer className="mt-16 bg-[#edeae2] text-[#2f2d2d]">
      <div className="mx-auto max-w-6xl px-4">
        <div className="border-t border-black/10 py-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3 md:max-w-sm">
              <p className="text-[12px] tracking-[0.28em] text-[#2f2d2d]/60">{site.name}</p>
              <p className="text-[14px] leading-relaxed text-[#2f2d2d]/70">
                Cuidados e finalização com produtos de alta qualidade.
              </p>
              <p className="text-[12px] tracking-[0.18em] text-[#2f2d2d]/60">TERÇA a SEXTA • 09:00 às 18:00</p>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${site.whatsappRaw}?text=${waText}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.22em] text-[#5b5545] underline underline-offset-4 decoration-[#875f46]/60 hover:decoration-[#875f46]"
                >
                  MARCAR NO WHATSAPP →
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[12px] font-semibold tracking-[0.22em] text-[#2f2d2d]/60">CONTACTO</p>
              <div className="grid gap-2 text-[14px] text-[#2f2d2d]/75">
                <a
                  href={`tel:${site.phoneRaw}`}
                  className="w-fit underline-offset-4 hover:text-[#2f2d2d] hover:underline"
                >
                  {site.phoneDisplay}
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="w-fit underline-offset-4 hover:text-[#2f2d2d] hover:underline"
                >
                  {site.email}
                </a>
                <a
                  href="https://www.instagram.com/arlete.oliveira.79/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-fit underline-offset-4 hover:text-[#2f2d2d] hover:underline"
                >
                  Instagram
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[12px] font-semibold tracking-[0.22em] text-[#2f2d2d]/60">MORADA</p>
              <p className="text-[14px] leading-relaxed text-[#2f2d2d]/75">{site.addressLine}</p>
              <a
                href="https://www.google.com/maps/place/Ideias+e+Tran%C3%A7as/@38.718222,-9.162273,40m/data=!3m1!1e3!4m6!3m5!1s0xd19338c5f8000d9:0x17b913cbecd7eb1d!8m2!3d38.7182316!4d-9.1621693!16s%2Fg%2F11t7cr4syh?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDIwMS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 text-[12px] font-semibold tracking-[0.22em] text-[#5b5545] underline underline-offset-4 decoration-[#875f46]/60 hover:decoration-[#875f46]"
              >
                VER NO MAPA →
              </a>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12px] text-[#2f2d2d]/60">
              © {new Date().getFullYear()} {site.name}. Todos os direitos reservados.
            </p>
             <div className="flex items-center">
  <a
    href="https://sarahaliriel.tech"
    target="_blank"
    rel="noreferrer"
    aria-label="Portfólio"
    className="
      group inline-flex items-center gap-2
      px-2 py-1 rounded-md
      active:scale-95 transition-all duration-200
    "
  >
    <span className="font-mono text-sm tracking-[0.25em] opacity-70 transition-all duration-300 group-hover:opacity-100">
      &lt;/s/a&gt;
    </span>
  </a>
</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
