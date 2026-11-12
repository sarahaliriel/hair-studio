"use client";

import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { visualExitProgress } from "./scroll-scene";
import { DEFAULT_REVEAL_START, sceneRevealEligible } from "./reveal/eligibility";
import { pageTransitionActive } from "./page-transition/readiness";
import { revealPresets, revealTargets, revealExit, type RevealVariant } from "./reveal/presets";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Progressive enhancement: server HTML is visible until a scoped animation exists. */
export function Reveal() {
  const pathname = usePathname();
  useGSAP(() => {
    // Per-DOM-node state survives matchMedia rebuilds, but not route unmounts.
    const snapshots = new WeakMap<HTMLElement, { played: boolean; completed: boolean; progress: number }>();
    const media = gsap.matchMedia();
    media.add({
      motion: "(prefers-reduced-motion: no-preference)",
      mobile: "(max-width: 760px)",
    }, (context) => {
      if (!context.conditions?.motion) return;
      const mobile = !!context.conditions.mobile;
      const records = new Map<HTMLElement, {
        timeline: gsap.core.Timeline;
        trigger?: ScrollTrigger;
        exit?: gsap.core.Tween;
        focusHeld?: boolean;
        entered: boolean;
        played: boolean;
        completed: boolean;
        scene: boolean;
        initialY: number;
        finish: () => void;
        arc: HTMLElement | null;
        start: string;
        exitProgress?: number;
      }>();
      let frame = 0;
      let disposed = false;
      let refreshFrame = 0;
      const transitionActive = pageTransitionActive;
      const sequences = new WeakMap<Element, { time: number; count: number }>();
      const play = (element: HTMLElement, measuredBottom?: number) => {
        const record = records.get(element);
        if (!record || record.played || !record.entered || transitionActive()) return;
        const arc = record.arc;
        if (arc && arc.dataset.arcContentVisible !== "true") return;
        record.played = true;
        snapshots.set(element, { played: true, completed: false, progress: 0 });
        record.trigger?.kill();
        // Restored, already-departed content settles immediately. Its exit
        // still reverses on return; an invisible offscreen entrance needn't run.
        if ((measuredBottom ?? element.getBoundingClientRect().bottom) - record.initialY <= 0) {
          record.finish();
          return;
        }
        const parent = element.parentElement;
        if (parent) {
          const now = performance.now();
          const previous = sequences.get(parent);
          const count = previous && now - previous.time < 80 ? previous.count + 1 : 0;
          sequences.set(parent, { time: now, count });
          record.timeline.delay(record.timeline.delay() + Math.min(0.24, count * (mobile ? 0.07 : 0.12)));
        }
        record.timeline.play();
      };
      // Read actual viewport bounds: sticky ancestors can stop moving while
      // document scroll continues. Batch reads before playing/writing any tween.
      const syncScenes = () => {
        const height = window.innerHeight;
        const scroll = window.scrollY;
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - height);
        const covered = transitionActive();
        const samples: {
          element: HTMLElement; record: (typeof records extends Map<HTMLElement, infer R> ? R : never);
          exposed: boolean; rect: DOMRect | null; eligible: boolean;
        }[] = [];
        records.forEach((record, element) => {
          if (!record.scene || (record.completed && !record.exit)) return;
          const arc = record.arc;
          const exposed = !arc || arc.dataset.arcContentVisible === "true";
          if (!exposed || (record.played && !record.completed)) {
            // Hidden groups and active entrances only need their pause state,
            // not another layout read or start-expression calculation.
            samples.push({ element, record, exposed, rect: null, eligible: false });
            return;
          }
          const rect = element.getBoundingClientRect();
          const eligible = !record.played && sceneRevealEligible(
            rect.top - (record.played ? 0 : record.initialY), rect.height,
            record.start, height, scroll, maxScroll,
          );
          samples.push({ element, record, exposed, rect, eligible });
        });
        samples.forEach(({ element, record, exposed, rect, eligible }) => {
          const completedAtRead = record.completed;
          if (!record.completed && record.played) {
            record.timeline.paused(!exposed || covered);
          } else if (!record.played) {
            record.entered = exposed && eligible;
            play(element, rect?.bottom);
          }
          if (completedAtRead && record.exit && exposed && rect) {
            const progress = element.contains(document.activeElement) ? 0 : visualExitProgress(rect.bottom, height);
            if (record.exitProgress !== progress) {
              record.exit.progress(progress);
              record.exitProgress = progress;
            }
          }
        });
      };
      const scan = () => {
        frame = 0;
        // Remove detached dynamic cards immediately instead of retaining their triggers.
        records.forEach((record, element) => {
          if (!element.isConnected) {
            record.trigger?.kill();
            record.exit?.scrollTrigger?.kill();
            record.exit?.revert();
            record.timeline.revert();
            records.delete(element);
          }
        });
        document.querySelectorAll<HTMLElement>(revealTargets).forEach((element) => {
          if (records.has(element) || element.closest('[data-reveal="none"], dialog, [data-image-trail]')) return;
          // Only children enter: the arc's section, surface and content container
          // retain exclusive ownership of the section transition.
          const arc = element.closest<HTMLElement>("[data-arc-scroll]");
          if (arc && (!element.closest("[data-arc-content]") || element.matches("[data-arc-content]"))) return;
          // A card or explicit group owns its descendants; never animate both.
          if (element.parentElement?.closest(revealTargets)) return;
          const rect = element.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          const variant = (element.dataset.reveal || (
            element.matches(".care-art, .gallery-tile, .portfolio-piece") ? "imageReveal" :
            element.matches("h1, h2") ? "maskedText" :
            element.matches("a, .cta-buttons") ? "cta" : "fadeUp"
          )) as RevealVariant;
          const preset: { from: gsap.TweenVars; duration: number } = revealPresets[variant] ?? revealPresets.fadeUp;
          const targets = variant === "stagger" ? Array.from(element.children) : [element];
          const number = (value: string | undefined, fallback: number) => {
            const parsed = Number(value);
            return value && Number.isFinite(parsed) ? Math.max(0, Math.min(parsed, 1.5)) : fallback;
          };
          const timeline = gsap.timeline({ paused: true });
          const saved = snapshots.get(element);
          const record = {
            timeline, entered: false, played: false, completed: false,
            scene: !!element.closest("[data-arc-scene]"),
            initialY: variant === "stagger" ? 0 : Number(preset.from.y || 0) * (mobile ? 0.6 : 1),
            finish: () => {},
            arc, start: element.dataset.revealStart || DEFAULT_REVEAL_START,
          } as {
            timeline: gsap.core.Timeline; trigger?: ScrollTrigger; exit?: gsap.core.Tween; focusHeld?: boolean; entered: boolean; played: boolean;
            completed: boolean; scene: boolean; initialY: number; finish: () => void;
            arc: HTMLElement | null; start: string; exitProgress?: number;
          };
          records.set(element, record);
          try {
            timeline.eventCallback("onUpdate", () => {
              if (!disposed && !record.completed) snapshots.set(element, {
                played: record.played, completed: false, progress: timeline.progress(),
              });
            });
            record.finish = () => {
                if (record.completed) return;
                record.completed = true;
                snapshots.set(element, { played: true, completed: true, progress: 1 });
                record.trigger?.kill();
                timeline.revert();
                if (disposed || !element.isConnected || record.exit || element.dataset.revealExit === "none") return;
                record.exit = gsap.fromTo(element, { opacity: 1 }, {
                  opacity: 0, ease: "none", immediateRender: false,
                  paused: record.scene,
                  scrollTrigger: record.scene ? undefined : {
                    trigger: element,
                    ...revealExit,
                    scrub: mobile ? 0.2 : revealExit.scrub,
                  },
                });
                if (record.scene) syncScenes();
                if (element.contains(document.activeElement)) {
                  record.exit.scrollTrigger?.disable(true);
                  record.exit.progress(0);
                  record.exitProgress = 0;
                  record.focusHeld = true;
                }
            };
            const image = variant === "imageReveal" ? element.querySelector("img") : null;
            // A dedicated layer lets CSS hover own the photograph's transform.
            const imageLayer = image ? element.querySelector("[data-reveal-image]") ?? image : null;
            if (imageLayer) timeline.fromTo(imageLayer, { scale: mobile ? 1.03 : 1.06 }, {
              scale: 1, duration: preset.duration, ease: "power3.out",
            }, 0);
            timeline.fromTo(targets, {
              ...preset.from,
              ...(image ? { scale: 1 } : {}),
              ...(preset.from.y ? { y: Number(preset.from.y) * (mobile ? 0.6 : 1) } : {}),
            }, {
              opacity: 1, y: 0, scale: 1,
              ...(preset.from.clipPath ? { clipPath: "inset(0% 0% 0% 0%)" } : {}),
              duration: number(element.dataset.revealDuration, preset.duration * (mobile ? 0.85 : 1)),
              delay: number(element.dataset.revealDelay, 0),
              stagger: variant === "stagger" ? { each: mobile ? 0.07 : 0.12, amount: Math.min(0.3, targets.length * (mobile ? 0.07 : 0.12)) } : 0,
              ease: "power3.out",
              onComplete: record.finish,
            }, 0);
            if (saved?.completed) {
              record.played = true;
              record.finish();
              return;
            }
            if (saved?.played) {
              record.played = true;
              record.entered = true;
              timeline.progress(saved.progress, true);
              snapshots.set(element, saved);
              timeline.paused(transitionActive() || (!!arc && arc.dataset.arcContentVisible !== "true"));
              return;
            }
            if (!record.scene) record.trigger = ScrollTrigger.create({
              trigger: element,
              start: record.start,
              onEnter: () => { record.entered = true; play(element); },
            });
            if (record.played) record.trigger?.kill();
            if (record.trigger && window.scrollY >= record.trigger.start) {
              record.entered = true;
              play(element);
            }
          } catch {
            timeline.revert();
            record.trigger?.kill();
            records.delete(element);
          }
        });
        syncScenes();
      };
      const refresh = () => {
        if (disposed || refreshFrame) return;
        refreshFrame = requestAnimationFrame(() => {
          refreshFrame = 0;
          if (disposed) return;
          ScrollTrigger.refresh();
        });
      };
      const resume = () => {
        refresh();
      };
      const layoutReady = () => {
        document.dispatchEvent(new Event("arlete:layout-ready"));
        records.forEach((record, element) => {
          if (record.scene || record.completed) return;
          if (record.played) record.timeline.paused(transitionActive());
          else {
            record.entered = !!record.trigger && window.scrollY >= record.trigger.start;
            play(element);
          }
        });
        // ArcScroll responds to layout-ready, then publishes scene-update with
        // its final sticky offsets. Do not sample scenes before that handoff.
      };
      const focus = (event: FocusEvent) => {
        if (!(event.target instanceof Element)) return;
        records.forEach((record, element) => {
          if (element.contains(event.target as Node)) {
            record.played = true;
            if (!record.completed) record.timeline.progress(1, false);
            record.exit?.scrollTrigger?.disable(true);
            record.exit?.progress(0);
            record.exitProgress = 0;
            record.focusHeld = true;
          } else if (record.exit?.scrollTrigger && record.focusHeld) {
            record.exit.scrollTrigger.enable(false, false);
            record.exit.scrollTrigger.update();
            record.focusHeld = false;
          }
        });
        syncScenes();
      };
      const observer = new MutationObserver((mutations) => {
        if (!mutations.some((mutation) =>
          (mutation.addedNodes.length || mutation.removedNodes.length) &&
          !(mutation.target instanceof Element && mutation.target.closest('[data-reveal="none"]')),
        )) return;
        // Pin refreshes also mutate child lists. Do not refresh in response to
        // those mutations: actual size changes are handled by ResizeObserver.
        if (!frame) frame = requestAnimationFrame(scan);
      });
      scan();
      const main = document.querySelector("main");
      if (main) observer.observe(main, { childList: true, subtree: true });
      document.addEventListener("arlete:page-visible", resume);
      window.addEventListener("pageshow", refresh);
      window.addEventListener("popstate", refresh);
      ScrollTrigger.addEventListener("refresh", layoutReady);
      document.addEventListener("focusin", focus);
      const resizeObserver = new ResizeObserver(refresh);
      if (main) resizeObserver.observe(main);
      document.querySelectorAll("[data-arc-outgoing], [data-arc-scroll]").forEach((node) => resizeObserver.observe(node));
      const resourceLoaded = (event: Event) => {
        if (event.target instanceof Element && main?.contains(event.target) && !event.target.closest('[aria-hidden="true"]')) refresh();
      };
      document.addEventListener("arlete:layout-change", refresh);
      window.addEventListener("resize", refresh);
      window.addEventListener("orientationchange", refresh);
      document.addEventListener("arlete:scene-update", syncScenes);
      void document.fonts.ready.then(refresh);
      document.fonts.addEventListener("loadingdone", refresh);
      document.addEventListener("load", resourceLoaded, true);
      return () => {
        disposed = true;
        cancelAnimationFrame(frame);
        cancelAnimationFrame(refreshFrame);
        resizeObserver.disconnect();
        document.removeEventListener("arlete:layout-change", refresh);
        window.removeEventListener("resize", refresh);
        window.removeEventListener("orientationchange", refresh);
        document.removeEventListener("arlete:scene-update", syncScenes);
        observer.disconnect();
        document.removeEventListener("arlete:page-visible", resume);
        window.removeEventListener("pageshow", refresh);
        window.removeEventListener("popstate", refresh);
        ScrollTrigger.removeEventListener("refresh", layoutReady);
        document.removeEventListener("focusin", focus);
        document.fonts.removeEventListener("loadingdone", refresh);
        document.removeEventListener("load", resourceLoaded, true);
        records.forEach(({ trigger, timeline, exit }, element) => {
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            snapshots.set(element, { played: true, completed: true, progress: 1 });
          }
          trigger?.kill();
          exit?.scrollTrigger?.kill();
          exit?.revert();
          timeline.revert();
        });
      };
    });
    return () => media.revert();
  }, { dependencies: [pathname], revertOnUpdate: true });
  return null;
}
