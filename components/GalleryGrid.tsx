"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  height: number;
};

const ITEMS: GalleryItem[] = [
  { id: "g1", src: "/images/galeria/001.png", alt: "Corte completo", height: 520 },
  { id: "g2", src: "/images/galeria/02.png", alt: "Penteado elegante", height: 640 },
  { id: "g3", src: "/images/galeria/002.png", alt: "Croche", height: 580 },
  { id: "g4", src: "/images/galeria/003.png", alt: "Corte em camadas", height: 480 },
  { id: "g5", src: "/images/galeria/004.png", alt: "Penteado volumoso", height: 700 },
  { id: "g6", src: "/images/galeria/05.png", alt: "Penteado suave", height: 560 },
  { id: "g7", src: "/images/galeria/06.png", alt: "Coloração fantasia", height: 600 },
  { id: "g8", src: "/images/galeria/6.png", alt: "Travesseiro para bebe", height: 580 },
  { id: "g9", src: "/images/galeria/07.png", alt: "Ondas naturais", height: 520 },
  { id: "g10", src: "/images/galeria/08.png", alt: "Corte curto", height: 460 },
  { id: "g11", src: "/images/galeria/008.png", alt: "Mosqueteiro para bebe", height: 580 },
  { id: "g12", src: "/images/galeria/09.png", alt: "Coloração criativa", height: 680 },
  { id: "g13", src: "/images/galeria/10.png", alt: "Progressiva", height: 500 },
  { id: "g14", src: "/images/galeria/11.png", alt: "Tranças", height: 640 },
  { id: "g15", src: "/images/galeria/12.png", alt: "Trança evento", height: 580 },
  { id: "g16", src: "/images/galeria/13.png", alt: "Arte Cachorro", height: 580 },
  { id: "g17", src: "/images/galeria/013.png", alt: "Croche de bolsas", height: 580 },
  { id: "g18", src: "/images/galeria/14.png", alt: "Corte feminino", height: 580 },
  { id: "g19", src: "/images/galeria/15.png", alt: "Trança elegante", height: 580 },
  { id: "g20", src: "/images/galeria/015.png", alt: "Croche de enfeite para vasos", height: 580 }
];

export function GalleryGrid() {
  const items = useMemo(() => ITEMS, []);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const next = () => {
    if (activeIndex === null) return;
    setActiveIndex((prev) => (prev! + 1) % items.length);
  };

  const prev = () => {
    if (activeIndex === null) return;
    setActiveIndex((prev) => (prev! - 1 + items.length) % items.length);
  };

  return (
    <>
      <section className="w-full px-4 sm:px-6 lg:px-10 py-10">
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              onClick={() => setActiveIndex(index)}
              className="group relative w-full overflow-hidden rounded-[28px] break-inside-avoid cursor-pointer bg-[#edeae2] shadow-[0_14px_45px_rgba(47,45,45,0.10)]"
              whileHover={{ scale: 0.98 }}
            >
              <div className="relative w-full">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={500}
                  height={700}
                  className="w-full h-auto object-cover"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            className="fixed inset-0 z-999 bg-[#2f2d2d]/95 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveIndex(null)}
          >
            <motion.div
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => {
                if (info.offset.x < -100) next();
                if (info.offset.x > 100) prev();
              }}
            >
              <Image
                src={items[activeIndex].src}
                alt={items[activeIndex].alt}
                width={900}
                height={1200}
                className="max-h-[90vh] w-auto object-contain rounded-2xl"
              />

              <button
                onClick={() => setActiveIndex(null)}
                className="absolute top-6 right-6 text-white text-2xl"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
