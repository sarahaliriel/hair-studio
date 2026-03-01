import Image from "next/image";

type Cert = {
  id: string;
  title: string;
  org: string;
  year: string;
  src: string;
};

const CERTS: Cert[] = [
  { id: "c1", title: "Especialização em Tranças", org: "Academia", year: "2024", src: "/images/certificados/01.jpg" },
  { id: "c2", title: "Coloração e Diagnóstico", org: "Formação", year: "2023", src: "/images/certificados/02.jpg" },
  { id: "c3", title: "Penteados para Eventos", org: "Workshop", year: "2024", src: "/images/certificados/03.jpg" },
  { id: "c4", title: "Tratamentos e Recuperação", org: "Curso", year: "2022", src: "/images/certificados/04.jpg" },
];

export function Certificates() {
  return (
    <div className="relative">
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] sm:gap-4">
        {CERTS.map((c) => (
          <div
            key={c.id}
            className="glass snap-start shrink-0 rounded-[26px] border border-[#2f2d2d]/10 p-3 shadow-[0_14px_45px_rgba(47,45,45,0.08)]"
            style={{ width: "min(78vw, 340px)" }}
          >
            <div className="relative overflow-hidden rounded-[20px] border border-[#2f2d2d]/10 bg-white/25">
              <div className="relative aspect-4/3 w-full">
                <Image src={c.src} alt={c.title} fill className="object-cover" />
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(47,45,45,.35),transparent_60%)]" />
            </div>

            <div className="mt-3">
              <p className="text-sm font-semibold text-[#2f2d2d]">{c.title}</p>
              <p className="mt-0.5 text-xs text-[#2f2d2d]/70">
                {c.org} · {c.year}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-[#2f2d2d]/70">
          Dica: no telemóvel, desliza para ver mais certificados.
        </p>
      </div>
    </div>
  );
}