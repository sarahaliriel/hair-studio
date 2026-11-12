"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { heroTrailImages } from "@/features/gallery/data/images";
import { BookingLink } from "@/shared/ui/BookingLink";
import { RotatingImageTrail } from "@/shared/ui/RotatingImageTrail";
import { whenPageVisible } from "@/shared/ui/page-transition/readiness";

gsap.registerPlugin(useGSAP);

export function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const entered = useRef(false);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) entered.current = true;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const stage = stageRef.current;
      if (!stage || entered.current) return;
      const lines = stage.querySelectorAll("[data-hero-line]");
      const supporting = stage.querySelectorAll("[data-hero-support]");
      const timeline = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      timeline
        .set(lines, { y: 24, yPercent: 0, opacity: 0 })
        .set("[data-hero-capsule]", { scale: 0.84, opacity: 0 })
        .set(supporting, { y: 16, opacity: 0 })
        .to(lines, { y: 0, yPercent: 0, opacity: 1, duration: 1.05, stagger: 0.12, clearProps: "transform,opacity" })
        .to("[data-hero-capsule]", { scale: 1, opacity: 1, duration: 0.8, ease: "expo.out" }, "<0.28")
        .to(supporting, { y: 0, opacity: 1, duration: 0.65, stagger: 0.09 }, "<0.3");
      // Route transitions reveal the destination only after its assets are ready.
      // Start the hero then, so its entrance is not consumed behind the wipe.
      const cancelReady = whenPageVisible(() => {
        entered.current = true;
        stage.dataset.heroEntranceStarted = "true";
        // A restored page below the hero should not consume an entrance offscreen.
        if (stage.getBoundingClientRect().bottom <= 0) timeline.progress(1);
        else timeline.play();
      });
      return () => {
        cancelReady();
        timeline.kill();
      };
    });
    return () => media.revert();
  }, { scope: stageRef });

  return (
    <section className="gallery-hero" aria-labelledby="hero-title">
      <div ref={stageRef} className="gallery-hero-stage" data-reveal="none">
        <RotatingImageTrail images={heroTrailImages} />
        <div className="gallery-hero-content">
          <p className="gallery-hero-description hero-description-corner" data-hero-support>Mais do que um novo look, um momento só teu. Tranças, cortes, coloração e penteados feitos com cuidado, criatividade e atenção a cada detalhe.</p>
          <h1 id="hero-title" className="editorial-hero-title" aria-label="Tranças, cortes e cor a sua maneira.">
            <span className="hero-line-mask hero-line-mask-first" aria-hidden="true"><span className="hero-line hero-line-one" data-hero-line>Tranças,</span></span>
            <span className="hero-line-mask" aria-hidden="true"><span className="hero-line hero-line-two" data-hero-line><span className="hero-capsule" data-hero-capsule><Image src="/images/editorial/trancas-delicadas.webp" alt="Penteado semi-preso com tranças delicadas e ondas longas" fill sizes="(max-width: 700px) 20vw, 220px" priority /></span>cortes e cor</span></span>
            <span className="hero-line-mask" aria-hidden="true"><span className="hero-line hero-line-three" data-hero-line><em>a sua maneira.</em></span></span>
          </h1>
          <div className="hero-copy" data-hero-support>
            <div className="gallery-hero-actions">
              <BookingLink>Marcar horário</BookingLink>
              <Button variant="secondary" render={<Link href="/servicos" />}>Ver serviços</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
