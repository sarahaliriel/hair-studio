import Image from "next/image";
import Link from "next/link";
import { SectionTitle } from "@/components/SectionTitleMenu";

const services = [
  {
    title: "Tranças",
    desc: "Estilos protetores e personalizados, com acabamento premium.",
    tag: "Mais pedido",
    image: "/images/servicos/tranças.png",
  },
  {
    title: "Penteados",
    desc: "Estilos personalizados para eventos especiais e ocasiões únicas.",
    tag: "Eventos",
    image: "/images/servicos/penteado.png",
  },
  {
    title: "Corte",
    desc: "Mulheres, homens e crianças. O corte certo que faz toda a diferença.",
    tag: "Para todos",
    image: "/images/servicos/corte.png",
  },
  {
    title: "Coloração e mechas",
    desc: "Cor com técnica e cuidado, para um resultado luminoso e saudável.",
    tag: "Transformação",
    image: "/images/servicos/coloracao.jpg",
  },
];

export default function ServicesPreview() {
  return (
    <section className="px-4 py-12">
      <div className="mx-auto w-full max-w-5xl">
        <SectionTitle
          overline="Serviços"
          title="O melhor serviço para você"
          desc="Escolhe o teu objetivo. Para orçamento exato (comprimento/complexidade), fala por WhatsApp."
        />

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {services.map((s) => (
            <div
              key={s.title}
              className="overflow-hidden rounded-3xl border border-[#2f2d2d]/10 bg-white/40"
            >
              <div className="relative h-44 w-full sm:h-52">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#edeae2]/95 via-[#edeae2]/30 to-transparent" />
                <div className="absolute left-4 top-4 inline-flex items-center rounded-full border border-[#875f46]/25 bg-[#edeae2]/70 px-3 py-1 text-xs font-medium text-[#5b5545] backdrop-blur">
                  {s.tag}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-[#2f2d2d]">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#2f2d2d]/80">
                  {s.desc}
                </p>

                <div className="mt-4 h-px w-full bg-[#2f2d2d]/10" />

                <Link
                  href="/servicos"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#5b5545] transition active:scale-[0.99]"
                >
                  Ver detalhes
                  <span className="translate-y-px">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex">
          <Link
            href="/servicos"
            className="w-full rounded-2xl bg-[#2f2d2d] px-5 py-4 text-center text-sm font-semibold text-[#edeae2] transition active:scale-[0.99] sm:w-auto"
          >
            Ver todos os serviços
          </Link>
        </div>
      </div>
    </section>
  );
}
