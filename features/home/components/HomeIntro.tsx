"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

const KEY = "arlete:home-intro:v1";
const photos = ["02", "003", "004", "007", "11"];
const rotations = [-5, 4, -3, 5, -7];

export function HomeIntro() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let seen = false;
    try { seen = sessionStorage.getItem(KEY) === "1"; } catch { seen = true; }
    if (seen || reduced.matches) {
      document.documentElement.classList.remove("intro-pending");
      return;
    }

    const cards = Array.from(overlay.querySelectorAll<HTMLElement>("[data-intro-card]"));
    const previousOverflow = document.body.style.overflow;
    // The intro lives inside main, so lock the other top-level controls separately.
    const controls = Array.from(document.querySelectorAll<HTMLElement>("main, .classic-header, .site-header, .floating-cta, footer, .skip-link"));
    const previousInert = controls.map((node) => [node, node.inert] as const);
    let finished = false;
    let started = false;
    const lifecycle: { timer?: ReturnType<typeof setTimeout>; timeline?: gsap.core.Timeline } = {};
    const finish = () => {
      if (finished) return;
      finished = true;
      if (lifecycle.timer) clearTimeout(lifecycle.timer);
      lifecycle.timeline?.kill();
      overlay.dataset.active = "false";
      overlay.style.removeProperty("clip-path");
      document.documentElement.classList.remove("intro-pending");
      document.body.style.overflow = previousOverflow;
      previousInert.forEach(([node, inert]) => { node.inert = inert; });
      document.dispatchEvent(new Event("arlete:page-visible"));
      document.dispatchEvent(new Event("arlete:layout-change"));
    };
    const interrupt = () => finish();
    const motionChange = () => { if (reduced.matches) finish(); };
    // React Strict Mode rehearses effects in development. Start on the next frame
    // so its first cleanup cannot mark the intro as seen before it appears.
    const startFrame = requestAnimationFrame(async () => {
    started = true;
    try { sessionStorage.setItem(KEY, "1"); } catch { /* Storage can be disabled. */ }
    overlay.dataset.active = "true";
    const images = Array.from(overlay.querySelectorAll<HTMLImageElement>("img[data-src]"));
    const decoded = images.map(async (image) => {
      image.src = image.dataset.src!;
      try { await image.decode(); return true; } catch { return false; }
    });
    document.body.style.overflow = "hidden";
    previousInert.forEach(([node]) => { node.inert = true; });
    lifecycle.timer = setTimeout(finish, 6500);
    window.addEventListener("pagehide", interrupt);
    window.addEventListener("popstate", interrupt);
    reduced.addEventListener("change", motionChange);
    const available = await Promise.all(decoded);
    if (finished) return;
    if (!available.some(Boolean)) { finish(); return; }

    // Reverse the page transition's curved entrance: keep the lower surface,
    // move its quadratic top edge downward to expose the page from the top.
    const wipe = { progress: 0 };
    const draw = () => {
      const p = wipe.progress;
      const width = innerWidth;
      const height = innerHeight;
      const edge = height * (-0.1 + 1.23 * p);
      const curve = height * 0.85 * Math.sin(Math.PI * p);
      overlay.style.clipPath = `path("M -10 ${edge} Q ${width / 2} ${edge - curve} ${width + 10} ${edge} L ${width + 10} ${height + 20} L -10 ${height + 20} Z")`;
    };
    gsap.set(cards, { y: 0, rotation: (index: number) => rotations[index], autoAlpha: 0 });
    const timeline = gsap.timeline({ onComplete: finish });
    lifecycle.timeline = timeline;
    cards.forEach((card, index) => {
      if (available[index]) timeline.set(card, { autoAlpha: 1 }, index * 0.24);
    });
    // The reference releases the stack by dropping each print below the frame.
    cards.slice().reverse().forEach((card, index) => {
      timeline.to(card, {
        y: () => innerHeight + card.offsetHeight, rotation: rotations[4 - index] + 5,
        duration: 0.6, ease: "power1.inOut",
      }, 1.78 + index * 0.10);
    });
    timeline.to(wipe, {
      progress: 1, duration: 1.05, ease: "power2.inOut",
      onStart: () => {
        document.documentElement.classList.remove("intro-pending");
        overlay.dataset.active = "revealing";
        document.dispatchEvent(new Event("arlete:page-visible"));
        draw();
      },
      onUpdate: draw,
    }, 2.34);
    timeline.play();
    });

    return () => {
      cancelAnimationFrame(startFrame);
      window.removeEventListener("pagehide", interrupt);
      window.removeEventListener("popstate", interrupt);
      reduced.removeEventListener("change", motionChange);
      overlay.querySelectorAll<HTMLImageElement>("img[data-src]").forEach((image) => { image.onerror = null; });
      if (started) finish();
    };
  }, { scope: overlayRef });

  return (
    <div ref={overlayRef} className="home-intro" data-home-intro data-active="false" aria-hidden="true">
      <div className="home-intro-composition">
        {photos.map((name, index) => (
          <div className={`home-intro-card home-intro-card-${index + 1}`} data-intro-card key={name}>
            {/* Dedicated small assets are requested only when the intro actually runs. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img data-src={`/images/intro/${name}.webp`} alt="" draggable={false} />
          </div>
        ))}
      </div>
    </div>
  );
}
