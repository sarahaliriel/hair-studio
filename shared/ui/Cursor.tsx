"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  const [enabled, setEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isGallery, setIsGallery] = useState(false);

  const raf = useRef<number | null>(null);
  const x = useRef(0);
  const y = useRef(0);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      const shouldEnable = finePointer.matches && !reduced.matches;
      setEnabled(shouldEnable);

      document.documentElement.classList.toggle("cursor-hidden", shouldEnable);
      document.body.style.cursor = shouldEnable ? "none" : "auto";
    };

    update();

    finePointer.addEventListener("change", update);
    reduced.addEventListener("change", update);

    return () => {
      finePointer.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
      document.documentElement.classList.remove("cursor-hidden");
      document.body.style.cursor = "auto";
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      raf.current = null;
      const el = cursorRef.current;
      if (!el) return;

      el.style.transform =
        `translate3d(${x.current}px, ${y.current}px, 0) translate(-50%, -50%)`;
    };

    const move = (e: PointerEvent) => {
      x.current = e.clientX;
      y.current = e.clientY;
      if (raf.current == null) raf.current = requestAnimationFrame(tick);
    };

    const enter = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest("a, button, input, [role='button']")) {
        setIsHovering(true);
      }

      if (target.closest('[data-cursor="gallery"]')) {
        setIsGallery(true);
      }
    };

    const leave = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const related = e.relatedTarget as HTMLElement | null;

      if (!target) return;

      if (!related || !related.closest("a, button, input, [role='button']")) {
        setIsHovering(false);
      }

      if (!related || !related.closest('[data-cursor="gallery"]')) {
        setIsGallery(false);
      }
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", enter, true);
    document.addEventListener("pointerout", leave, true);

    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", enter, true);
      document.removeEventListener("pointerout", leave, true);

      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      className={`
        fixed top-0 left-0 z-9999 pointer-events-none
        flex items-center justify-center rounded-full
        transition-all duration-300 ease-out
        ${isGallery ? "w-10 h-10" : isHovering ? "w-7 h-7" : "w-3 h-3"}
        ${isGallery ? "bg-[#875f46]/30 backdrop-blur-sm" : "bg-[#5b5545]"}
      `}
    >
      <div
        className={`
          w-2 h-2 rounded-full bg-[#edeae2]
          transition-all duration-200
          ${isHovering || isGallery ? "scale-100 opacity-100" : "scale-0 opacity-0"}
        `}
      />
    </div>
  );
}