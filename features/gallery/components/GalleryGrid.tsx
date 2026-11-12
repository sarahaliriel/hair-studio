"use client";
import { Button, ArrowCircle } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { galleryImages as ITEMS } from "@/features/gallery/data/images";

export function GalleryGrid() {
  const [active, setActive] = useState<number | null>(null);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const filmstrip = useRef<HTMLDivElement>(null);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);
  const isOpen = active !== null;
  useEffect(() => {
    const element = grid.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tiles = Array.from(element.querySelectorAll<HTMLElement>(".gallery-tile"));
    const animations = new Set<gsap.core.Tween>();
    const revealed = new Set<HTMLElement>();
    gsap.set(tiles, { autoAlpha: 0, y: 42, scale: 0.94 });

    const reveal = (entering: HTMLElement[]) => {
      entering.forEach((tile, order) => {
        revealed.add(tile);
        observer.unobserve(tile);
        const tween = gsap.to(tile, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          delay: Math.min(order, 5) * 0.11,
          ease: "power3.out",
          clearProps: "transform,visibility,opacity",
          onComplete: () => animations.delete(tween),
        });
        animations.add(tween);
      });
    };
    const transitionActive = () => document.querySelector('.page-transition[data-active="true"]') !== null;
    const observer = new IntersectionObserver((entries) => {
      if (transitionActive()) return;
      reveal(entries
        .filter((entry) => entry.isIntersecting && !revealed.has(entry.target as HTMLElement))
        .map((entry) => entry.target as HTMLElement)
        .sort((a, b) => tiles.indexOf(a) - tiles.indexOf(b)));
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    const onPageVisible = () => {
      const viewport = window.innerHeight;
      reveal(tiles.filter((tile) => {
        const rect = tile.getBoundingClientRect();
        return !revealed.has(tile) && rect.top < viewport * 0.92 && rect.bottom > 0;
      }));
    };

    tiles.forEach((tile) => observer.observe(tile));
    document.addEventListener("arlete:page-visible", onPageVisible);
    return () => {
      observer.disconnect();
      document.removeEventListener("arlete:page-visible", onPageVisible);
      animations.forEach((animation) => animation.kill());
      gsap.set(tiles, { clearProps: "transform,visibility,opacity" });
    };
  }, []);
  useEffect(() => {
    if (!isOpen) return;
    const element = dialog.current;
    if (!element) return;
    element.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      if (element.open) element.close();
      document.body.style.overflow = previous;
      opener.current?.focus({ preventScroll: true });
    };
  }, [isOpen]);
  useEffect(() => {
    if (active === null) return;
    const strip = filmstrip.current;
    const thumb = strip?.querySelector<HTMLElement>(`[data-gallery-index="${active}"]`);
    if (!strip || !thumb) return;
    strip.scrollTo({
      left: thumb.offsetLeft - (strip.clientWidth - thumb.clientWidth) / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }, [active]);
  useEffect(() => () => {
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
  }, []);
  const close = () => {
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    fadeTimer.current = null;
    setOutgoing(null);
    setActive(null);
  };
  const select = (index: number) => {
    if (index === active) return;
    const alreadyFading = fadeTimer.current !== null;
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    if (active !== null && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (!alreadyFading) setOutgoing(active);
      fadeTimer.current = setTimeout(() => {
        setOutgoing(null);
        fadeTimer.current = null;
      }, 320);
    } else setOutgoing(null);
    setActive(index);
  };
  const move = (direction: number) => {
    if (active !== null) select((active + direction + ITEMS.length) % ITEMS.length);
  };
  const current = active === null ? null : ITEMS[active];
  const number = (value: number) => String(value).padStart(2, "0");
  return (
    <>
      <div ref={grid} className="gallery-grid" data-reveal="none">
        {ITEMS.map((item, index) => (
          <Button
            key={item.id}
            className="gallery-tile"
            animated={false}
            variant="ghost"
            aria-label={`Ver: ${item.alt}`}
            onClick={(event) => { opener.current = event.currentTarget; select(index); }}
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
        onClose={close}
        onCancel={(event) => { event.preventDefault(); close(); }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
          if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
        }}
      >
        {current && (
          <>
            <header className="gallery-dialog-header">
              <div className="gallery-dialog-context">
                <span>GALERIA</span>
                {current.category && <><span className="gallery-dialog-divider" aria-hidden="true" /><span>{current.category}</span></>}
              </div>
              <Button className="gallery-close" size="icon" animated={false} aria-label="Fechar galeria" onClick={close}>
                <X aria-hidden="true" />
              </Button>
            </header>
            <div className="gallery-viewer">
              <Button className="gallery-prev" variant="arrow" direction="left" aria-label="Fotografia anterior" onClick={() => move(-1)} />
              <div
                className="gallery-photo"
                aria-live="polite"
                aria-atomic="true"
                onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }}
                onTouchEnd={(event) => {
                  if (touchStart.current === null) return;
                  const delta = event.changedTouches[0].clientX - touchStart.current;
                  if (Math.abs(delta) > 60) move(delta < 0 ? 1 : -1);
                  touchStart.current = null;
                }}
              >
                {outgoing !== null && (
                  <div className="gallery-photo-layer gallery-photo-outgoing" aria-hidden="true">
                    <Image src={ITEMS[outgoing].src} alt="" fill sizes="(max-width: 640px) 100vw, 80vw" />
                  </div>
                )}
                <div className="gallery-photo-layer gallery-photo-current" key={current.id}>
                  <Image src={current.src} alt={current.alt} fill sizes="(max-width: 640px) 100vw, 80vw" />
                </div>
              </div>
              <Button className="gallery-next" variant="arrow" direction="right" aria-label="Fotografia seguinte" onClick={() => move(1)} />
            </div>
            <div className="gallery-dialog-caption">
              <div>
                <p className="gallery-caption-title">{current.alt}</p>
                {current.category && <p className="gallery-caption-category">{current.category}</p>}
              </div>
              <p className="gallery-counter" aria-label={`Fotografia ${active! + 1} de ${ITEMS.length}`}>
                <span>{number(active! + 1)}</span><span aria-hidden="true"> / </span><span>{number(ITEMS.length)}</span>
              </p>
            </div>
            <div className="gallery-filmstrip" ref={filmstrip} aria-label="Escolher fotografia">
              {ITEMS.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className="gallery-thumbnail"
                  data-gallery-index={index}
                  aria-label={`Ver fotografia ${index + 1}: ${item.alt}`}
                  aria-current={index === active ? "true" : undefined}
                  onClick={() => select(index)}
                >
                  <Image src={item.src} alt="" fill sizes="72px" />
                </button>
              ))}
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
