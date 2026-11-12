"use client";

import { useRef, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ToolAsset } from "./types";
import styles from "./GravityPlayground.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function GravityPlayground({ assets }: { assets: readonly ToolAsset[] }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const stage = root.current;
    if (!stage) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      let cancelled = false;
      let loading = false;
      let visible = false;
      let runtime: ReturnType<typeof import("./physics").createPlayground> | undefined;
      const load = async () => {
        if (runtime || loading || cancelled) return;
        loading = true;
        try {
          // Load code and images only at the playground boundary, never at page load.
          const [physics] = await Promise.all([
            import("./physics"),
            Promise.all(Array.from(stage.querySelectorAll("img")).map((image) => image.decode())),
          ]);
          if (cancelled) return;
          runtime = physics.createPlayground(stage, assets);
          runtime.setVisible(visible);
        } catch {
          // Keep the server-rendered composition if code or images fail to load.
          stage.dataset.state = "static";
        }
      };
      const footer = stage.closest("footer");
      if (footer) {
        gsap.from(footer.querySelectorAll("[data-footer-reveal]"), {
          y: 24, opacity: 0.35, duration: 0.85, stagger: 0.12, ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: footer, start: "top 92%", once: true },
        });
      }
      const trigger = ScrollTrigger.create({
        trigger: stage, start: "top bottom", end: "bottom top",
        onToggle(self) {
          visible = self.isActive;
          if (visible) void load();
          runtime?.setVisible(visible);
        },
      });
      // Covers restored scroll positions and an already visible footer on mount.
      visible = trigger.isActive;
      if (visible) void load();
      return () => {
        cancelled = true;
        trigger.kill();
        runtime?.destroy();
      };
    });
    return () => media.revert();
  }, { scope: root, dependencies: [assets] });

  return (
    <div className={styles.playgroundWrap}>
      <div ref={root} className={styles.stage} aria-hidden="true" data-gravity-playground>
        {assets.map((asset) => (
          // Native, local WebP sprites are transformed directly by the physics loop.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={asset.id}
            data-tool={asset.id}
            className={styles.tool}
            src={asset.src}
            width={Math.round(asset.width)}
            height={Math.round(asset.width / asset.aspect)}
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
            style={{
              "--tool-width": `${asset.width}px`, "--tool-x": `${asset.x * 100}%`,
              "--tool-angle": `${asset.angle}rad`,
            } as CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
