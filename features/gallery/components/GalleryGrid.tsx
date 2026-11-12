"use client";
import { Button, ArrowCircle } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { galleryImages as ITEMS } from "@/features/gallery/data/images";

export function GalleryGrid() {
  const [active, setActive] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const touchStart = useRef<number | null>(null);
  const isOpen = active !== null;
  useEffect(() => {
    if (!isOpen) return;
    const element = dialog.current;
    if (!element) return;
    element.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = previous;
    };
  }, [isOpen]);
  const move = (direction: number) =>
    setActive((value) =>
      value === null ? null : (value + direction + ITEMS.length) % ITEMS.length,
    );
  return (
    <>
      <div className="gallery-grid">
        {ITEMS.map((item, index) => (
          <Button
            key={item.id}
            className="gallery-tile"
            animated={false}
            variant="ghost"
            aria-label={`Ver: ${item.alt}`}
            onClick={() => setActive(index)}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1000px) 30vw, 23vw"
            />
            <ArrowCircle />
          </Button>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="gallery-dialog"
        aria-label="Visualização da galeria"
        onCancel={() => setActive(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setActive(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") move(1);
          if (e.key === "ArrowLeft") move(-1);
        }}
        onTouchStart={(e) => {
          touchStart.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStart.current === null) return;
          const delta = e.changedTouches[0].clientX - touchStart.current;
          if (Math.abs(delta) > 60) move(delta < 0 ? 1 : -1);
          touchStart.current = null;
        }}
      >
        {active !== null && (
          <>
            <Button
              className="gallery-close"
              size="icon"
              aria-label="Fechar galeria"
              onClick={() => setActive(null)}
            >
              ✕
            </Button>
            <Button
              className="gallery-prev"
              variant="arrow"
              direction="left"
              aria-label="Imagem anterior"
              onClick={() => move(-1)}
            >
            </Button>
            <div className="gallery-expanded">
              <Image
                src={ITEMS[active].src}
                alt={ITEMS[active].alt}
                width={900}
                height={1200}
                sizes="90vw"
              />
              <p>
                {ITEMS[active].alt} · {active + 1} / {ITEMS.length}
              </p>
            </div>
            <Button
              className="gallery-next"
              variant="arrow"
              direction="right"
              aria-label="Imagem seguinte"
              onClick={() => move(1)}
            >
            </Button>
          </>
        )}
      </dialog>
    </>
  );
}
