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

export default function ServicosPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-14">
      <SectionTitle
        as="h1"
        overline="Serviços"
        title="Encontra o teu cuidado"
        desc="Seleciona a categoria, vê os detalhes e clica em “Marcar”. Para orçamento exato, chama no WhatsApp."
      />

      <ServicesMenu />

      <div className="mt-10 rounded-[28px] border border-black/10 bg-white/40 p-6">
        <SectionTitle
          overline="Contacto"
          title="Preferes explicar primeiro?"
          desc="Envia mensagem no WhatsApp, é o mais rápido!"
        />

        <CTAButtons />
      </div>
    </div>
  );
}
