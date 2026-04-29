"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type GalleryItem = {
  id: string;
  src: string;
  alt: string;
};

const ITEMS: GalleryItem[] = [
  { id: "g1", src: "/images/galeria/001.png", alt: "Corte completo" },
  { id: "g2", src: "/images/galeria/02.png", alt: "Penteado elegante" },
  { id: "g3", src: "/images/galeria/002.png", alt: "Croche" },
  { id: "g4", src: "/images/galeria/003.png", alt: "Corte em camadas" },
  { id: "g5", src: "/images/galeria/004.png", alt: "Penteado volumoso" },
  { id: "g6", src: "/images/galeria/05.png", alt: "Penteado suave" },
  { id: "g7", src: "/images/galeria/06.png", alt: "Coloração fantasia" },
  { id: "g8", src: "/images/galeria/6.png", alt: "Travesseiro para bebe" },
  { id: "g9", src: "/images/galeria/07.png", alt: "Ondas naturais" },
  { id: "g10", src: "/images/galeria/08.png", alt: "Corte curto" },
  { id: "g11", src: "/images/galeria/008.png", alt: "Mosqueteiro para bebe" },
  { id: "g12", src: "/images/galeria/09.png", alt: "Coloração criativa" },
  { id: "g13", src: "/images/galeria/10.png", alt: "Progressiva" },
  { id: "g14", src: "/images/galeria/11.png", alt: "Tranças" },
  { id: "g15", src: "/images/galeria/12.png", alt: "Trança evento" },
  { id: "g16", src: "/images/galeria/13.png", alt: "Arte Cachorro" },
  { id: "g17", src: "/images/galeria/013.png", alt: "Croche de bolsas" },
  { id: "g18", src: "/images/galeria/14.png", alt: "Corte feminino" },
  { id: "g19", src: "/images/galeria/15.png", alt: "Trança elegante" },
  { id: "g20", src: "/images/galeria/015.png", alt: "Croche vasos" }
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
      <section className="w-full px-2 sm:px-6 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              onClick={() => setActiveIndex(index)}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.03
              }}
              className="group relative w-full overflow-hidden rounded-[22px] cursor-pointer bg-[#edeae2] shadow-[0_10px_30px_rgba(47,45,45,0.10)]"
            >
              <div className="relative w-full aspect-4/5 sm:aspect-3/4">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
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
              className="relative w-full h-full flex items-center justify-center px-4"
              onClick={(e) => e.stopPropagation()}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => {
                if (info.offset.x < -80) next();
                if (info.offset.x > 80) prev();
              }}
            >
              <div className="relative">
                <Image
                  src={items[activeIndex].src}
                  alt={items[activeIndex].alt}
                  width={900}
                  height={1200}
                  className="max-h-[85vh] w-auto object-contain rounded-2xl"
                  onClick={() => setActiveIndex(null)}
                />

                <button
                  onClick={() => setActiveIndex(null)}
                  className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white w-9 h-9 rounded-full flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}