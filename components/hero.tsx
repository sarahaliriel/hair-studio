import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-32 sm:pt-36 lg:pt-40">
      <div className="absolute inset-0">
        <Image
        src="/images/heroopage.png"
        alt="Ideias e Tranças"
        fill
        priority
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px"
        className="object-cover"
      />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_35%,rgba(237,234,226,0.10),rgba(237,234,226,0.62),rgba(237,234,226,0.92))]" />
        <div className="absolute inset-0 bg-linear-to-b from-[#edeae2]/0 via-[#edeae2]/10 to-[#edeae2]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="grid items-end gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="pb-10 lg:pb-16">
            <p className="text-[11px] tracking-[0.28em] text-[#2f2d2d]/70">
              TRANÇAS • PENTEADOS • MAQUILHAGEM • CORTE
            </p>

            <h1 className="font-serif mt-6 text-[52px] leading-[0.95] tracking-[-0.02em] text-[#2f2d2d] sm:text-[60px]">
              O teu cabelo
              <span className="relative mt-2 block w-fit font-serif italic font-normal text-[#2f2d2d]">
                no seu melhor.
                <span className="absolute -bottom-2 left-0 h-2.5 w-full rounded-full bg-[#875f46]/25" />
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[#2f2d2d]/75 sm:text-[16px]">
              Atendimento individual, com atenção ao detalhe.
              Da cor ao corte, das tranças à finalização, o objetivo é o resultado
              certo para o teu rosto e para o teu dia a dia.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#contacto"
                className="group inline-flex items-center justify-center rounded-full bg-[#2f2d2d] px-6 py-3 text-[12px] font-semibold tracking-[0.22em] text-[#edeae2] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                CONTACTO
                <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </a>

              <Link
                href="/servicos"
                className="group inline-flex items-center justify-center rounded-full border border-black/15 bg-white/35 px-6 py-3 text-[12px] font-semibold tracking-[0.22em] text-[#2f2d2d] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/55 active:translate-y-0"
              >
                VER SERVIÇOS
                <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </div>

            <div id="contacto" className="mt-10 pb-10">
              <div className="grid gap-3 rounded-[28px] border border-black/10 bg-white/45 p-5 backdrop-blur sm:grid-cols-3 sm:gap-4 sm:p-6">
                <a
                  className="rounded-2xl bg-[#5b5545] px-5 py-4 text-center text-[11px] font-semibold tracking-[0.22em] text-[#edeae2] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
                  href="https://wa.me/351918251771"
                  target="_blank"
                  rel="noreferrer"
                >
                  WHATSAPP
                </a>
                <a
                  className="rounded-2xl border border-black/10 bg-[#edeae2]/70 px-5 py-4 text-center text-[11px] font-semibold tracking-[0.22em] text-[#2f2d2d] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#edeae2]/90 active:translate-y-0"
                  href="https://www.instagram.com/arlete.oliveira.79/"
                  target="_blank"
                  rel="noreferrer"
                >
                  INSTAGRAM
                </a>
                <a
                  className="rounded-2xl border border-black/10 bg-[#edeae2]/70 px-5 py-4 text-center text-[11px] font-semibold tracking-[0.22em] text-[#2f2d2d] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#edeae2]/90 active:translate-y-0"
                  href="tel:+351918251771"
                >
                  LIGAR
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}