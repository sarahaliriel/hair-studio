"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ExpandingSpaceSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const section = sectionRef.current;
      if (!section) return;
      const frame = section.querySelector<HTMLElement>("[data-space-frame]");
      if (!frame) return;
      const shade = section.querySelector<HTMLElement>("[data-space-shade]");
      const content = section.querySelector<HTMLElement>("[data-space-content]");
      if (!shade || !content) return;
      const reveal = Array.from(content.querySelectorAll<HTMLElement>("[data-space-reveal]"))
        .filter((element) => getComputedStyle(element).display !== "none");
      gsap.set(shade, { opacity: 0 });
      gsap.set(reveal, { autoAlpha: 0, y: 36 });
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=360%",
          scrub: 0.35,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
      timeline
        .to(frame, { width: "100vw", height: "100svh", borderRadius: 0, duration: 1.2, ease: "none" })
        .to(shade, { opacity: 1, duration: 0.35, ease: "none" })
        .to(reveal, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.38, ease: "power2.out" })
        .to({}, { duration: 0.4 });
    });
    return () => media.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="sobre" className="space-expansion" data-reveal="none" aria-label="O espaço">
      <div className="space-expansion-stage">
        <div className="space-expansion-frame" data-space-frame>
          <Image src="/images/editorial/coloracao-liso.webp" alt="Modelo de costas com cabelo liso castanho iluminado" fill sizes="100vw" />
          <div className="space-expansion-shade" data-space-shade aria-hidden="true" />
          <div className="space-expansion-content" data-space-content>
            <div className="space-expansion-caption">
              <span className="eyebrow" data-space-reveal>01 / O ESPAÇO</span>
              <span className="space-expansion-star" data-space-reveal aria-hidden="true">✳</span>
              <p data-space-reveal>Mais do que um novo look.<br />Um momento só teu.</p>
            </div>
            <div className="space-expansion-copy">
              <h2 data-space-reveal>O cuidado começa<br />por <em>te ouvir.</em></h2>
              <div className="space-expansion-details">
                <p data-space-reveal>Cada cabelo tem a sua história. Aqui, o atendimento é individual e cada detalhe é pensado para respeitar o teu estilo — da primeira conversa à finalização.</p>
                <p data-space-reveal>Em Campo de Ourique, Lisboa, a Arlete recebe-te para um cuidado próximo e personalizado. Preferes ficar em casa? Há também atendimento ao domicílio, sob marcação.</p>
              </div>
              <div data-space-reveal>
                <Button variant="secondary" render={<a href="#contato" />}>Vamos conversar</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
