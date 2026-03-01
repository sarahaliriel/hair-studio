import { SectionTitle } from "@/components/sectionTitle";
import { GalleryAbout } from "@/components/galleryAbout";
import { GalleryGrid } from "@/components/galleryGrid";
import { Certificates } from "@/components/certificates";
import { CTAButtons } from "@/components/CTAbuttons";

export default function GaleriaPage() {
  return (
    <main className="bg-[#edeae2] text-[#2f2d2d] overflow-x-hidden">
      <section className="px-4 pt-24 pb-10">
        <div className="mx-auto w-full max-w-5xl">
          <div className="glass soft-card overflow-hidden">
            <div className="p-6 sm:p-10">
              <SectionTitle
                overline="Galeria"
                title="Trabalhos reais, detalhes que se notam"
                desc="Aqui encontras alguns resultados de tranças, penteados, cor, corte e finalização. Se quiseres algo igual ou inspirado, diz-me no WhatsApp e eu guio-te."
              />
              <div className="mt-6">
                <GalleryAbout />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="galeria" className="px-4 pb-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="soft-card overflow-hidden border border-[#2f2d2d]/10 bg-white/25">
            <div className="px-6 pt-6 sm:px-10 sm:pt-10">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-wide text-[#2f2d2d]/70">Explorar</p>
                  <p className="mt-1 text-lg font-semibold text-[#2f2d2d] sm:text-xl">Resultados e inspirações</p>
                </div>
              </div>

              <div className="mt-6 h-px w-full bg-[linear-gradient(90deg,rgba(135,95,70,0),rgba(135,95,70,.55),rgba(91,85,69,.55),rgba(135,95,70,.55),rgba(135,95,70,0))]" />
            </div>

            <div className="p-6 sm:p-10">
              <GalleryGrid />
            </div>
          </div>
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