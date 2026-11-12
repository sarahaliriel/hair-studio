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
          scrub: true,
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
            <div className="space-expansion-bottom">
              <div className="space-expansion-copy">
                <h2 data-space-reveal>Cuidado pensado para ti.</h2>
                <p data-space-reveal>Cada atendimento é pessoal, calmo e feito com atenção ao teu estilo.</p>
              </div>
              <div className="space-expansion-thumbnails" aria-label="Explora os serviços">
                {[
                  { src: "/images/gallery/02.png", label: "Tranças", category: "penteados", position: "center 38%" },
                  { src: "/images/gallery/16.png", label: "Penteados", category: "penteados", position: "center 32%" },
                  { src: "/images/gallery/003.png", label: "Ondas", category: "cabelo", position: "center 42%" },
                ].map((item) => (
                  <a key={item.label} href={`/servicos?categoria=${item.category}#servicos-list`} className="space-expansion-thumbnail" data-space-reveal aria-label={`Ver serviços de ${item.label.toLowerCase()}`}>
                    <Image src={item.src} alt={item.label} fill sizes="(max-width: 700px) 28vw, 150px" style={{ objectPosition: item.position }} />
                    <span>{item.label}</span>
                    <span className="space-expansion-thumbnail-arrow" aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
              <div className="space-expansion-action" data-space-reveal>
                <Button variant="inverse" render={<a href="#contato" />}>Vamos conversar</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
