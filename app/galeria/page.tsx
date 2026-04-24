import { SectionTitle } from "@/components/SectionTitleMenu";
import { GalleryGrid } from "@/components/GalleryGrid";
import { CTAButtons } from "@/components/CTAButtons";

export default function GaleriaPage() {
  return (
    <main className="bg-[#edeae2] text-[#2f2d2d] overflow-x-hidden">
      <section className="px-4 pt-24 pb-10">
      </section>

      <section id="galeria" className="px-4 pb-10">
            <div className="p-6 sm:p-10">
              <GalleryGrid />
            </div>
      </section>

      <section className="px-4 pb-16">
        <div className="mx-auto w-full max-w-5xl">
          <div className="soft-card overflow-hidden border border-[#2f2d2d]/10 bg-white/40">
            <div className="p-6 sm:p-10">
              <SectionTitle
                overline="Marcação"
                title="Gostou do que viu?"
                desc="Vamos marcar! Diz-me o serviço, o dia e se preferes salão ou domicílio. Eu respondo o mais rápido possível."
              />
              <div className="mt-6">
                <CTAButtons />
              </div>
            </div>
            <div className="h-0.5 w-full bg-[linear-gradient(90deg,rgba(135,95,70,0),rgba(135,95,70,.75),rgba(91,85,69,.75),rgba(135,95,70,.75),rgba(135,95,70,0))]" />
          </div>
        </div>
      </section>
    </main>
  );
}