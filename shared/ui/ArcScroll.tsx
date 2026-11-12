"use client";

import { useLayoutEffect } from "react";
import { ARC_COVERED, contentExposed, sceneProgress } from "./scroll-scene";

/** Reveal the real incoming surfaces, with no clones, spacers or scroll interception. */
export function ArcScrollReveal() {
  useLayoutEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-arc-scroll]"),
    );
    sections.forEach((section) => {
      section.style.setProperty(
        "--arc-background",
        getComputedStyle(section).backgroundColor,
      );
    });
    const outgoing = Array.from(
      document.querySelectorAll<HTMLElement>("[data-arc-outgoing]"),
    );
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let dirty = true;
    let height = window.innerHeight;
    let width = document.documentElement.clientWidth;
    let destination: HTMLElement | null = null;
    let destinationOffset = 0;
    let previousHash: string | undefined;
    // Stable references survive geometry invalidation. No descendant queries in
    // scroll frames, visibility changes, or completed-scene cleanup.
    const geometry = sections.map((section) => ({
      section, top: 0,
      surface: section.querySelector<HTMLElement>("[data-arc-surface]")!,
      content: section.querySelector<HTMLElement>("[data-arc-content]"),
      cleared: false, active: false, q: -1, display: "", path: "",
    }));
    type Scene = (typeof geometry)[number];
    const stickySizes = outgoing.map(() => ({ height: -1, viewport: -1 }));
    const previousTabIndex = new Map<HTMLElement, string | null>();

    // This signal gates child entrances only; it never changes the arc's geometry.
    const setContentVisible = ({ section, content }: Scene, visible: boolean) => {
      const value = String(visible);
      if (section.dataset.arcContentVisible === value) return;
      if (!visible && content?.contains(document.activeElement)) {
        // Move focus before applying inert. The section itself is outside the
        // hidden content and remains a stable, programmatically focused anchor.
        if (!previousTabIndex.has(section)) previousTabIndex.set(section, section.getAttribute("tabindex"));
        section.tabIndex = -1;
        section.focus({ preventScroll: true });
      }
      if (content) {
        content.style.visibility = visible ? "visible" : "hidden";
        content.inert = !visible;
      }
      section.dataset.arcContentVisible = value;
      section.dispatchEvent(new Event("arlete:arc-content-visible", { bubbles: true }));
    };

    const clear = (item: Scene, notify = true) => {
      if (item.cleared && notify) return;
      const { section, content, surface } = item;
      section.removeAttribute("data-arc-active");
      content?.style.removeProperty("visibility");
      if (content) content.inert = false;
      surface.removeAttribute("style");
      item.cleared = true;
      item.active = false;
      item.q = -1;
      item.display = item.path = "";
      if (notify) setContentVisible(item, true);
    };

    const tick = () => {
      frame = 0;
      if (document.hidden) return;
      if (media.matches) {
        geometry.forEach((item) => clear(item));
        dirty = true;
        return;
      }
      if (dirty) {
        // offsetTop is unaffected by the animated transform. Read only on resize/layout changes.
        const nextHeight = window.innerHeight;
        const nextWidth = document.documentElement.clientWidth;
        if (height !== nextHeight || width !== nextWidth) geometry.forEach((item) => { item.q = -1; });
        height = nextHeight;
        width = nextWidth;
        destinationOffset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
        // Native sticky owns the outgoing frame. JavaScript only measures its
        // height; it never compensates scroll by moving individual sections.
        const heights = outgoing.map((element) => element.offsetHeight);
        geometry.forEach((item) => {
          let top = 0;
          let parent: HTMLElement | null = item.section;
          while (parent) {
            // Each outgoing wrapper is the first flow child of its scene.
            // Its sticky offset is visual only, never part of the trigger position.
            if (!parent.hasAttribute("data-arc-outgoing"))
              top += parent.offsetTop;
            parent = parent.offsetParent as HTMLElement | null;
          }
          item.top = top;
        });
        // Finish layout reads before updating sticky offsets.
        outgoing.forEach((element, index) => {
          const previous = stickySizes[index];
          if (previous.height !== heights[index]) {
            element.style.setProperty("--arc-outgoing-height", `${heights[index]}px`);
            previous.height = heights[index];
          }
          if (previous.viewport !== height) {
            element.style.setProperty("--arc-viewport-height", `${height}px`);
            previous.viewport = height;
          }
        });
        dirty = false;
      }
      // Next's same-route links can use pushState without a hashchange event.
      if (previousHash !== location.hash) {
        previousHash = location.hash;
        try {
          destination = document.getElementById(decodeURIComponent(previousHash.slice(1)))?.closest<HTMLElement>("[data-arc-scroll]") ?? null;
        } catch {
          destination = null;
        }
      }
      const scroll = window.scrollY;
      geometry.forEach((item) => {
        const p = sceneProgress(item.top, scroll, height, item.section === destination ? destinationOffset : 0);
        // Native sticky and the mask use the same instantaneous scroll sample.
        // No independent settling clock: jumps and reversals settle in this frame.
        // Keep the viewport surface until the section reaches its final position.
        // Content becoming visible must never end the arc early.
        if (item.top <= scroll) {
          clear(item);
          return;
        }
        // First the background alone takes over the viewport. Content is never
        // clipped: it enters only after the arc has covered all four corners.
        const q = Math.min(1, p / ARC_COVERED);
        item.cleared = false;
        if (!item.active) {
          item.section.setAttribute("data-arc-active", "");
          item.active = true;
        }
        const display = p > 0 ? "block" : "none";
        if (item.display !== display) {
          item.surface.style.display = display;
          item.display = display;
        }
        if (item.q !== q) {
          // Covered/pending scenes need neither ellipse math nor a promoted mask.
          let path = "none";
          if (q > 0 && q < 1) {
            const rx = width * ((width < 760 ? 0.62 : 0.58) + 0.3 * q);
            const ry = height * 0.78 * (1 - 0.35 * q);
            const sag = ry * (1 - Math.sqrt(1 - (width / (2 * rx)) ** 2));
            const edge = height * (1 - q) - sag * q + sag;
            path = `path("M 0 ${edge} A ${rx} ${ry} 0 0 1 ${width} ${edge} L ${width} ${height} L 0 ${height} Z")`;
          }
          if (item.path !== path) {
            item.surface.style.clipPath = path;
            item.path = path;
          }
          const hint = q > 0 && q < 1 ? "clip-path" : "auto";
          if (item.surface.style.willChange !== hint) item.surface.style.willChange = hint;
          item.q = q;
        }
        if (item.content) {
          const entering = contentExposed(p, item.section.dataset.arcContentVisible === "true");
          setContentVisible(item, entering);
        }
      });
      document.dispatchEvent(new Event("arlete:scene-update"));
    };
    const schedule = () => {
      if (!document.hidden && !frame) frame = requestAnimationFrame(tick);
    };
    const measure = () => {
      dirty = true;
      schedule();
    };
    const observer = new ResizeObserver(measure);
    const visibility = () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else measure();
    };
    const main = document.querySelector("main");
    if (main) observer.observe(main);
    sections.forEach((section) => observer.observe(section));
    outgoing.forEach((element) => observer.observe(element));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("hashchange", measure);
    window.addEventListener("pageshow", measure);
    window.addEventListener("popstate", measure);
    document.addEventListener("arlete:page-visible", measure);
    document.addEventListener("arlete:layout-ready", measure);
    document.addEventListener("visibilitychange", visibility);
    media.addEventListener("change", measure);
    tick();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      window.removeEventListener("hashchange", measure);
      window.removeEventListener("pageshow", measure);
      window.removeEventListener("popstate", measure);
      document.removeEventListener("arlete:page-visible", measure);
      document.removeEventListener("arlete:layout-ready", measure);
      document.removeEventListener("visibilitychange", visibility);
      media.removeEventListener("change", measure);
      outgoing.forEach((element) => {
        element.style.removeProperty("--arc-outgoing-height");
        element.style.removeProperty("--arc-viewport-height");
      });
      geometry.forEach((item) => {
        const { section } = item;
        clear(item, false);
        delete section.dataset.arcContentVisible;
        section.style.removeProperty("--arc-background");
        if (previousTabIndex.has(section)) {
          const value = previousTabIndex.get(section);
          if (value === null) section.removeAttribute("tabindex");
          else if (value !== undefined) section.setAttribute("tabindex", value);
        }
      });
    };
  }, []);

  return null;
}
