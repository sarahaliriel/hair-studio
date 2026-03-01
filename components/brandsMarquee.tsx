import Image from "next/image";

type Brand = {
  name: string;
  logo: string;
};

const brands: Brand[] = [
  { name: "Salon Line", logo: "/images/brands/salon-line.png" },
  { name: "Skala", logo: "/images/brands/skala.png" },
  { name: "Novex", logo: "/images/brands/novex.png" },
  { name: "Inoar", logo: "/images/brands/inoar.png" },
  { name: "Truss", logo: "/images/brands/truss.png" },
  { name: "L'Oréal Professionnel", logo: "/images/brands/loreal.png" },
  { name: "Kérastase", logo: "/images/brands/kerastase.png" },
  { name: "Schwarzkopf", logo: "/images/brands/schwarzkopf.png" },
];

export function BrandsMarquee() {
  const loop = [...brands, ...brands];

  return (
    <section className="py-6">
      <div className="marquee border-y border-[#2f2d2d]/10 py-5">
        <div className="marquee-track items-center gap-10 px-2 sm:gap-14">
          {loop.map((b, idx) => (
            <div
              key={`${b.name}-${idx}`}
              className="group relative h-8 w-28 shrink-0 opacity-80 transition-opacity duration-200 hover:opacity-100 sm:h-10 sm:w-36"
              title={b.name}
            >
              <Image
                src={b.logo}
                alt={b.name}
                fill
                className="object-contain transition-transform duration-200 group-hover:scale-[1.08]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}