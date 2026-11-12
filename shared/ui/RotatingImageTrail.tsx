"use client";

import { gsap } from "gsap";
import { getImageProps } from "next/image";
import { useEffect, useRef } from "react";
import styles from "./RotatingImageTrail.module.css";

type Props = { images: readonly { src: string }[] };

const COOLDOWN_MS = 700;
const MIN_DISTANCE_PX = 120;
const MAX_PHOTOS = 3;

/** Adapted from the supplied effect for the homepage hero. */
export function RotatingImageTrail({ images }: Props) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const hero = layer?.parentElement;
    if (!layer || !hero || images.length === 0) return;

    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
    const loadedSources = new Set<string>();
    const sources = images.map(({ src }) =>
      getImageProps({ src, alt: "", width: 512, height: 512, quality: 80 }).props.src,
    );
    const decoding = new Map<string, Promise<void>>();
    const active = new Map<HTMLImageElement, gsap.core.Timeline>();
    let disposed = false;
    let bounds: DOMRect | null = null;
    let boundsDirty = true;
    let frame = 0;
    let pending: { x: number; y: number; deltaX: number } | undefined;
    let previous: { x: number; y: number } | undefined;
    let accumulatedDistance = 0;
    let imageIndex = 0;
    let inViewport = false;
    let lastPhotoAt = -Infinity;

    const enabled = () =>
      inViewport && finePointer.matches && !reducedMotion.matches && !document.hidden;
    const preload = () => {
      if (!enabled() || disposed) return;
      new Set(sources).forEach((source) => {
        if (loadedSources.has(source) || decoding.has(source)) return;
        const image = new Image();
        image.src = source;
        const promise = image.decode()
          .then(() => { if (!disposed) loadedSources.add(source); })
          .catch(() => undefined)
          .finally(() => { decoding.delete(source); });
        decoding.set(source, promise);
      });
    };

    const createPhoto = (x: number, y: number, deltaX: number) => {
      if (!bounds || y > bounds.height - 160 || active.size >= MAX_PHOTOS) return false;
      // A failed source must not block the other decoded photographs.
      let checked = 0;
      while (checked < sources.length && !loadedSources.has(sources[imageIndex])) {
        imageIndex = (imageIndex + 1) % sources.length;
        checked++;
      }
      if (checked === sources.length) return false;
      const source = sources[imageIndex];
      imageIndex = (imageIndex + 1) % images.length;

      const photo = document.createElement("img");
      photo.className = styles.photo;
      photo.src = source;
      photo.alt = "";
      photo.draggable = false;
      photo.style.opacity = "0";
      layer.appendChild(photo);

      const initialRotation = (Math.random() - 0.5) * 20;
      const bounceRotation = (Math.random() - 0.5) * 40;
      const bottom = bounds.height - 2;
      const timeline = gsap.timeline({
        onComplete: () => {
          active.delete(photo);
          photo.remove();
          timeline.kill();
        },
      });

      active.set(photo, timeline);
      timeline
        .fromTo(photo, {
          x, y,
          xPercent: -50 + (Math.random() - 0.5) * 80,
          yPercent: -50 + (Math.random() - 0.5) * 10,
          scale: 1.3,
          rotation: initialRotation,
        }, {
          scale: 1,
          duration: 0.4,
          ease: "elastic.out(2, 0.6)",
        })
        .to(photo, {
          x: x + deltaX * 2,
          rotation: 0,
          duration: 0.4,
          ease: "power1.in",
        }, "<")
        .to(photo, {
          y: bottom,
          scale: 0.9,
          yPercent: -95,
          duration: 0.4,
          ease: "back.in(1.1)",
        }, "<")
        .to(photo, {
          x: `+=${deltaX * 1.6}`,
          rotation: bounceRotation,
          duration: 0.3,
          ease: "power1.in",
        })
        .to(photo, {
          yPercent: 150,
          duration: 0.3,
          ease: `back.in(${1.5 + (1 - y / bounds.height)})`,
        }, "<");
      timeline.to(photo, { opacity: 1, duration: 0.2, ease: "power1.out" }, 0);
      timeline.to(photo, { opacity: 0, duration: 0.5, ease: "power1.inOut" }, 0.4);
      return true;
    };

    const flush = () => {
      frame = 0;
      if (!enabled() || !pending) return;
      if (boundsDirty || !bounds) {
        bounds = hero.getBoundingClientRect();
        boundsDirty = false;
      }
      const point = pending;
      pending = undefined;
      if (accumulatedDistance >= MIN_DISTANCE_PX) {
        accumulatedDistance = 0;
        if (performance.now() - lastPhotoAt >= COOLDOWN_MS &&
          createPhoto(point.x - bounds.left, point.y - bounds.top, point.deltaX)) {
          lastPhotoAt = performance.now();
        }
      }
    };
    const move = (event: PointerEvent) => {
      if (!enabled() || event.pointerType === "touch") return;
      const x = event.clientX;
      const y = event.clientY;
      const deltaX = previous ? x - previous.x : 0;
      const coolingDown = performance.now() - lastPhotoAt < COOLDOWN_MS;
      if (coolingDown) accumulatedDistance = 0;
      else if (previous) accumulatedDistance += Math.abs(deltaX) + Math.abs(y - previous.y);
      previous = { x, y };
      pending = { x, y, deltaX };
      // Keep native event distance, but create at most one photograph per frame.
      if (!frame && !coolingDown && (boundsDirty || !bounds || accumulatedDistance >= MIN_DISTANCE_PX)) frame = requestAnimationFrame(flush);
    };
    const resetPointer = () => {
      previous = undefined;
      pending = undefined;
      accumulatedDistance = 0;
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const invalidateBounds = () => {
      boundsDirty = true;
      resetPointer();
    };
    const stop = () => {
      resetPointer();
      active.forEach((timeline, photo) => { timeline.kill(); photo.remove(); });
      active.clear();
    };
    const availability = () => {
      invalidateBounds();
      if (enabled()) preload();
      else stop();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      availability();
    });

    observer.observe(hero);
    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", resetPointer);
    window.addEventListener("resize", invalidateBounds, { passive: true });
    // Reuse the authoritative scroll frame instead of adding a scroll listener.
    document.addEventListener("arlete:scene-update", invalidateBounds);
    document.addEventListener("visibilitychange", availability);
    reducedMotion.addEventListener("change", availability);
    finePointer.addEventListener("change", availability);

    return () => {
      disposed = true;
      observer.disconnect();
      stop();
      decoding.clear();
      loadedSources.clear();
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", resetPointer);
      window.removeEventListener("resize", invalidateBounds);
      document.removeEventListener("arlete:scene-update", invalidateBounds);
      document.removeEventListener("visibilitychange", availability);
      reducedMotion.removeEventListener("change", availability);
      finePointer.removeEventListener("change", availability);
      layer.replaceChildren();
    };
  }, [images]);

  return <div ref={layerRef} className={styles.layer} data-image-trail aria-hidden="true" />;
}
