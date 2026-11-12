"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type Brand = {
  name: string;
  logo: string;
};

const brands: Brand[] = [
  { name: "Salon Line", logo: "/images/brands/salonline.png" },
  { name: "Skala", logo: "/images/brands/skala.png" },
  { name: "Novex", logo: "/images/brands/novex.png" },
  { name: "Inoar", logo: "/images/brands/inoarlogo.png" },
  { name: "L'Oréal Professionnel", logo: "/images/brands/loreal.png" },
  { name: "Schwarzkopf", logo: "/images/brands/schwarzkopf.png" },
];

export function BrandsMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = sectionRef.current;
    const track = section?.querySelector<HTMLElement>(".marquee-track");
    if (!section || !track) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const update = () => {
      const running = String(visible && !document.hidden && !reduced.matches);
      if (track.dataset.running !== running) track.dataset.running = running;
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(section);
    document.addEventListener("visibilitychange", update);
    reduced.addEventListener("change", update);
    update();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      reduced.removeEventListener("change", update);
      delete track.dataset.running;
    };
  }, []);
  return (
    <section ref={sectionRef} className="py-6 overflow-hidden">
      <div className="border-y border-[#2f2d2d]/10 py-5">
        <div className="marquee-track flex w-max items-center">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex shrink-0 items-center gap-8 pr-8 sm:gap-12 sm:pr-12"
              aria-hidden={copy === 1 ? true : undefined}
            >
              {brands.map((brand) => (
                <div
                  key={brand.name}
                  className="relative flex h-12 w-28 shrink-0 items-center justify-center sm:h-14 sm:w-32"
                  title={brand.name}
                >
                  <Image
                    src={brand.logo}
                    alt={copy === 0 ? brand.name : ""}
                    fill
                    sizes="(max-width: 640px) 112px, 128px"
                    style={{ objectFit: "contain", padding: "6px" }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          animation: scroll 28s linear infinite;
          animation-play-state: paused;
        }

        .marquee-track[data-running="true"] {
          animation-play-state: running;
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }

        @media (max-width: 640px) {
          .marquee-track {
            animation-duration: 18s;
          }
        }
      `}</style>
    </section>
  );
}
