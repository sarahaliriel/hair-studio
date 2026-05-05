"use client";

import Image from "next/image";

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
  const loop = [...brands, ...brands];

  return (
    <section className="py-6 overflow-hidden">
      <div className="relative border-y border-[#2f2d2d]/10 py-6">

        {/* fade lateral premium */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-linear-to-r from-[#edeae2] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-linear-to-l from-[#edeae2] to-transparent z-10" />

        <div className="marquee-track flex w-max items-center gap-12 px-4">
          {loop.map((b, idx) => (
            <div
              key={`${b.name}-${idx}`}
              className="group relative h-10 w-36 sm:h-12 sm:w-40 shrink-0 flex items-center justify-center opacity-80 transition-opacity duration-300 hover:opacity-100"
              title={b.name}
            >
              <Image
                src={b.logo}
                alt={b.name}
                fill
                className="object-contain scale-90 transition-transform duration-300 group-hover:scale-100"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          animation: scroll 28s linear infinite;
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

        @media (max-width: 640px) {
          .marquee-track {
            animation: scroll 18s linear infinite;
          }
        }
      `}</style>
    </section>
  );
}