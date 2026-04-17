import { SectionTitle } from "@/components/SectionTitleMenu";

const items = [
  {
    title: "Atendimento personalizado",
    desc: "Cada detalhe é pensado para ti, sem pressa e com atenção real.",
  },
  {
    title: "Técnicas seguras e duráveis",
    desc: "Conforto, durabilidade e acabamento limpo.",
  },
  {
    title: "Produtos premium",
    desc: "Trabalho com marcas reconhecidas pela qualidade.",
  },
  {
    title: "Ambiente acolhedor",
    desc: "Um espaço leve, com energia boa e cuidado genuíno.",
  },
];

export default function Differentials() {
  return (
    <section className="px-4 py-12">
      <div className="mx-auto w-full max-w-5xl">
        <SectionTitle
          overline="Diferenciais"
          title="Porque escolher meus serviços?"
          desc="Mais do que seu cabelo ou visual: é experiência, técnica e cuidado."
        />

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((it) => (
            <div
              key={it.title}
              className="rounded-2xl border border-[#2f2d2d]/10 bg-[#edeae2] p-5"
            >
              <div className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#875f46]/15 text-[#5b5545]">
                  ✦
                </span>
                <div>
                  <h3 className="text-base font-semibold text-[#2f2d2d]">
                    {it.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#2f2d2d]/80">
                    {it.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}