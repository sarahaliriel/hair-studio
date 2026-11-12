"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useRef, type ReactNode } from "react";
import { destinationTitle, routeKey } from "./page-transition/routes";
import { TransitionOverlay, hiddenPath } from "./page-transition/TransitionOverlay";

gsap.registerPlugin(useGSAP);

type TransitionAPI = {
  navigate: (href: string) => void;
  ready: (pathname: string) => void;
};
const TransitionContext = createContext<TransitionAPI | null>(null);

export function usePageTransition() {
  const value = useContext(TransitionContext);
  if (!value) throw new Error("usePageTransition requires PageTransitionProvider");
  return value;
}

/** Wait only for images visible in the first viewport, never the lazy gallery below it. */
async function prepareDestination(signal: AbortSignal) {
  await document.fonts.ready;
  if (signal.aborted) return;
  const images = Array.from(document.querySelectorAll<HTMLImageElement>("main img"))
    .filter((image) => {
      const rect = image.getBoundingClientRect();
      return rect.width > 0 && rect.top < window.innerHeight && rect.bottom > 0;
    });
  await Promise.allSettled(images.map((image) => image.decode()));
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const overlay = useRef<HTMLDivElement>(null);
  const commands = useRef<TransitionAPI>({ navigate: () => {}, ready: () => {} });
  const navigate = useCallback((href: string) => commands.current.navigate(href), []);
  const ready = useCallback((pathname: string) => commands.current.ready(pathname), []);

  useGSAP((_, contextSafe) => {
    const safe = contextSafe!;
    const layer = overlay.current!;
    const surface = layer.querySelector<SVGPathElement>("[data-transition-surface]")!;
    const title = layer.querySelector<HTMLElement>("[data-transition-title]")!;
    const main = document.querySelector<HTMLElement>("main")!;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let active: {
      url: URL;
      controller: AbortController;
      timeline: gsap.core.Timeline;
      watchdog: ReturnType<typeof setTimeout>;
      committed: boolean;
      preparing: boolean;
      previousOverflow: string;
      previousInert: boolean;
      previousBusy: string | null;
    } | null = null;

    function release(focus = false) {
      if (!active) return;
      const current = active;
      active = null;
      clearTimeout(current.watchdog);
      current.controller.abort();
      current.timeline.kill();
      document.body.style.overflow = current.previousOverflow;
      main.inert = current.previousInert;
      if (current.previousBusy === null) main.removeAttribute("aria-busy");
      else main.setAttribute("aria-busy", current.previousBusy);
      gsap.set(main, { clearProps: "opacity" });
      gsap.set(surface, { attr: { d: hiddenPath } });
      layer.dataset.active = "false";
      document.dispatchEvent(new Event("arlete:page-visible"));
      if (focus) {
        const target = main.querySelector<HTMLElement>("h1") ?? main;
        // Keep a programmatic focus target; removing tabindex immediately blurs in Chrome.
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    }

    const resumeWhenReady = safe(async () => {
      const current = active;
      if (!current || current.preparing || !current.committed) return;
      current.preparing = true;
      const alignDestination = () => {
        const target = current.url.hash && document.getElementById(decodeURIComponent(current.url.hash.slice(1)));
        if (target) target.scrollIntoView({ behavior: "instant", block: "start" });
        else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      };
      alignDestination();
      await prepareDestination(current.controller.signal);
      if (active !== current || current.controller.signal.aborted) return;
      // Fonts or decoded assets may have moved a hash target while covered.
      alignDestination();
      document.dispatchEvent(new Event("arlete:layout-change"));
      // A committed template plus decoded visible assets is the readiness signal.
      current.timeline.resume();
    });

    const start = safe((href: string) => {
      const url = new URL(href, window.location.href);
      if (active) return;
      if (url.origin !== location.origin || !["http:", "https:"].includes(url.protocol)) {
        window.location.assign(url.href);
        return;
      }
      if (routeKey(url.pathname) === routeKey(location.pathname) || media.matches) {
        router.push(`${url.pathname}${url.search}${url.hash}`);
        return;
      }
      router.prefetch(url.pathname);
      title.replaceChildren(...destinationTitle(url).split(" ").map((word) => {
        const mask = document.createElement("span");
        mask.className = "page-transition-word-mask";
        const text = document.createElement("span");
        text.className = "page-transition-word";
        text.textContent = word;
        mask.append(text);
        return mask;
      }));
      const words = title.querySelectorAll(".page-transition-word");
      const entranceGeometry = { progress: 0 };
      const exitGeometry = { progress: 0 };
      // A single evolving quadratic surface: no morph plugin and no flat midpoint stop.
      const entrance = () => {
        const p = entranceGeometry.progress;
        const edge = 105 - 116 * p;
        const curve = 90 * Math.sin(Math.PI * p);
        surface.setAttribute("d", `M -10 ${edge} Q 50 ${edge - curve} 110 ${edge} L 110 220 L -10 220 Z`);
      };
      const exit = () => {
        const p = exitGeometry.progress;
        const edge = 110 - 123 * p;
        const curve = 85 * Math.sin(Math.PI * p);
        surface.setAttribute("d", `M -10 -120 L 110 -120 L 110 ${edge} Q 50 ${edge + curve} -10 ${edge} Z`);
      };
      const timeline = gsap.timeline({ paused: true, onComplete: () => release(true) });
      active = {
        url, timeline, controller: new AbortController(), committed: false, preparing: false,
        previousOverflow: document.body.style.overflow,
        previousInert: main.inert, previousBusy: main.getAttribute("aria-busy"),
        // Failure recovery only; never used to schedule a successful route reveal.
        watchdog: setTimeout(() => {
          const fallback = active?.url.href;
          release();
          if (fallback) window.location.assign(fallback);
        }, 15000),
      };
      document.body.style.overflow = "hidden";
      main.inert = true;
      main.setAttribute("aria-busy", "true");
      layer.dataset.active = "true";
      gsap.set(words, { yPercent: 115, opacity: 0 });
      entrance();
      timeline
        .to(entranceGeometry, { progress: 1, duration: 0.9, ease: "power3.inOut", onUpdate: entrance }, 0)
        .to(words, { yPercent: 0, opacity: 1, duration: 0.4, stagger: 0.055, ease: "power3.out" }, 0.64)
        .addPause("route-ready", () => {
          router.push(`${url.pathname}${url.search}${url.hash}`, { scroll: false });
        })
        .to({}, { duration: 0.25 })
        .to(words, { yPercent: -110, opacity: 0, duration: 0.3, stagger: 0.035, ease: "power3.in" })
        // Independent progress prevents GSAP caching the entrance's completed value
        // as the exit's start value when the title and wipe overlap.
        .to(exitGeometry, { progress: 1, duration: 1.05, ease: "power2.inOut", onStart: exit, onUpdate: exit }, ">-=0.06")
        .fromTo(main, { opacity: 0.9 }, { opacity: 1, duration: 0.6, ease: "power2.out", immediateRender: false }, "<+=0.2");
      timeline.play();
    });

    commands.current = {
      navigate: start,
      ready: (pathname) => {
        if (active && routeKey(pathname) === routeKey(active.url.pathname)) {
          active.committed = true;
          void resumeWhenReady();
        }
      },
    };

    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || anchor.hasAttribute("download") || anchor.rel.includes("external") || (anchor.target && anchor.target !== "_self")) return;
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin || !["http:", "https:"].includes(url.protocol)) return;
      if (active) { event.preventDefault(); return; }
      if (routeKey(url.pathname) === routeKey(location.pathname) || media.matches) return;
      event.preventDefault();
      start(url.href);
    };
    const cancel = () => release();
    const motionChange = () => {
      if (!media.matches || !active) return;
      const url = active.url;
      release();
      router.push(`${url.pathname}${url.search}${url.hash}`);
    };
    document.addEventListener("click", click, true);
    window.addEventListener("popstate", cancel);
    window.addEventListener("pagehide", cancel);
    media.addEventListener("change", motionChange);
    return () => {
      document.removeEventListener("click", click, true);
      window.removeEventListener("popstate", cancel);
      window.removeEventListener("pagehide", cancel);
      media.removeEventListener("change", motionChange);
      release();
      commands.current = { navigate: () => {}, ready: () => {} };
    };
  }, { scope: overlay, dependencies: [router] });

  return (
    <TransitionContext.Provider value={{ navigate, ready }}>
      {children}
      <TransitionOverlay ref={overlay} />
    </TransitionContext.Provider>
  );
}
