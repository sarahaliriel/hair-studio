"use client";

import Image from "next/image";
import { useMemo } from "react";
import { motion } from "framer-motion";

type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  height: number;
};

const ITEMS: GalleryItem[] = [
  { id: "g1", src: "/images/galeria/001.png", alt: "Corte completo", height: 520 },
  { id: "g2", src: "/images/galeria/02.png", alt: "Penteado elegante", height: 640 },
  { id: "g3", src: "/images/galeria/003.png", alt: "Corte em camadas", height: 480 },
  { id: "g4", src: "/images/galeria/004.png", alt: "Penteado volumoso", height: 700 },
  { id: "g5", src: "/images/galeria/05.png", alt: "Penteado suave", height: 560 },
  { id: "g6", src: "/images/galeria/006.png", alt: "Coloração fantasia", height: 600 },
  { id: "g7", src: "/images/galeria/07.png", alt: "Ondas naturais", height: 520 },
  { id: "g8", src: "/images/galeria/08.png", alt: "Corte curto", height: 460 },
  { id: "g9", src: "/images/galeria/09.png", alt: "Coloração criativa", height: 680 },
  { id: "g10", src: "/images/galeria/10.png", alt: "Progressiva", height: 500 },
  { id: "g11", src: "/images/galeria/11.png", alt: "Tranças", height: 640 },
  { id: "g12", src: "/images/galeria/12.png", alt: "Trança evento", height: 580 }
];

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-8.6 15l-1.1 4.1 4.3-1.1A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.6.7.7-2.5-.2-.3A8 8 0 1 1 12 20zm4.2-5.8c-.2-.1-1.2-.6-1.4-.7-.2-.1-.4-.1-.6.1-.2.2-.7.7-.9.8-.2.1-.3.1-.6 0-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.6-1.5-1.9-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.8.8-.8 1.9 0 1.1.8 2.2.9 2.4.1.2 1.6 2.5 3.8 3.4 2.2.9 2.2.6 2.6.6.4 0 1.3-.5 1.5-1 .2-.5.2-.9.1-1z"
      />
    </svg>
  );
}

function waLink() {
  const text = encodeURIComponent("Olá! Gostava de marcar um atendimento 😊");
  return `https://wa.me/351000000000?text=${text}`;
}

export function GalleryGrid() {
  const items = useMemo(() => ITEMS, []);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-10 py-10">
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: index * 0.03 }}
            className="group relative w-full overflow-hidden rounded-[28px] break-inside-avoid bg-[#edeae2] shadow-[0_14px_45px_rgba(47,45,45,0.10)]"
          >
            <div className="relative w-full" style={{ height: item.height }}>
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>

            <div className="absolute inset-0 bg-linear-to-t from-[#2f2d2d]/40 via-transparent to-transparent opacity-70 group-hover:opacity-100 transition" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
