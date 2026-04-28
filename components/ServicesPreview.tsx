"use client";

import Image from "next/image";
import Link from "next/link";
import { SectionTitle } from "@/components/SectionTitleMenu";
import { motion } from "framer-motion";

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
    <section className="px-4 py-12 overflow-hidden">
      <div className="mx-auto w-full max-w-5xl">
        <SectionTitle
          overline="Serviços"
          title="O melhor serviço para você"
          desc="Escolhe o teu objetivo. Para orçamento exato fala por WhatsApp."
        />

        <div className="mt-8 flex gap-4 overflow-x-auto pb-2 sm:hidden snap-x snap-mandatory">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[80%] snap-center"
            >
              <Card service={s} />
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 hidden sm:grid grid-cols-2 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card service={s} />
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex">
          <Link
            href="/servicos"
            className="w-full sm:w-auto rounded-2xl bg-[#2f2d2d] px-6 py-4 text-sm font-semibold text-[#edeae2] transition active:scale-[0.97]"
          >
            Ver todos os serviços
          </Link>
        </div>
      </div>
    </section>
  );
}

function Card({ service }: any) {
  return (
    <div className="group relative overflow-hidden rounded-4xl border border-[#2f2d2d]/10 bg-white/40 backdrop-blur-xl">
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover transition duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-linear-to-t from-[#edeae2] via-[#edeae2]/40 to-transparent" />

        <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium border border-[#875f46]/30 bg-[#edeae2]/70 text-[#5b5545] backdrop-blur">
          {service.tag}
        </div>
      </div>

      <div className="p-5 relative">
        <h3 className="text-lg font-semibold text-[#2f2d2d]">
          {service.title}
        </h3>

        <p className="mt-2 text-sm text-[#2f2d2d]/80 transition-all duration-300 group-hover:text-[#2f2d2d]">
          {service.desc}
        </p>

        <div className="mt-4 h-px w-0 bg-[#875f46] transition-all duration-500 group-hover:w-full" />

        <Link
          href="/servicos"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#5b5545]"
        >
          Ver detalhes
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
        <div className="absolute inset-0 rounded-4xl shadow-[0_0_60px_rgba(135,95,70,0.15)]" />
      </div>
    </div>
  );
}