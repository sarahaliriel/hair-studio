import type { Metadata } from "next";
import { SectionTitle } from "@/shared/ui/SectionTitleMenu";
import { ServicesMenu } from "@/features/services/components/ServicesMenu";
import { CTAButtons } from "@/shared/ui/CTAButtons";

export const metadata: Metadata = {
  title: "Serviços | Arlete Space",
  description:
    "Explora os serviços de cabelo, preços e atendimento ao domicílio da Arlete em Lisboa.",
  alternates: { canonical: "/servicos" },
};

export default async function ServicosPage({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const { categoria } = await searchParams;
  return (
    <div className="bg-[var(--color-surface-alt)]">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-32 sm:pt-36">
      <SectionTitle
        as="h1"
        title="Encontra o teu cuidado"
        desc="Seleciona a categoria, vê os detalhes e clica em “Marcar”. Para orçamento exato, chama no WhatsApp."
      />

      <ServicesMenu key={categoria ?? "all"} initialCategory={categoria} />

      <div className="mx-auto mt-14 w-full max-w-5xl">
        <div className="soft-card overflow-hidden border border-[#2f2d2d]/10 bg-white/40" data-reveal="fadeUp" data-reveal-exit="none">
          <div className="p-7 sm:p-10">
            <SectionTitle
              title="Preferes explicar primeiro?"
              desc="Envia mensagem no WhatsApp, é o mais rápido!"
            />
            <div className="mt-4">
              <CTAButtons />
            </div>
          </div>
          <div className="h-0.5 w-full bg-[linear-gradient(90deg,rgba(135,95,70,0),rgba(135,95,70,.75),rgba(91,85,69,.75),rgba(135,95,70,.75),rgba(135,95,70,0))]" />
        </div>
      </div>
      </div>
    </div>
  );
}
