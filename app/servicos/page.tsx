import { SectionTitle } from "@/components/sectionTitle";
import { ServicesMenu } from "@/components/servicesMenu";
import { CTAButtons } from "@/components/CTAbuttons";

export default function ServicosPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-24">
      <SectionTitle
        overline="Serviços"
        title="Escolhe e marca em 1 minuto"
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