import { Button, ArrowCircle } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/features/home/components/Hero";
import { HomeIntro } from "@/features/home/components/HomeIntro";
import { BrandsMarquee } from "@/features/home/components/BrandsMarquee";
import { ExpandingSpaceSection } from "@/features/home/components/ExpandingSpaceSection";
import { BookingLink } from "@/shared/ui/BookingLink";
import { ArcScrollScene } from "@/shared/ui/ArcScrollScene";
import { ArcScrollReveal } from "@/shared/ui/ArcScroll";
import { getGoogleReviews } from "@/features/reviews/data/google-reviews";
import ReviewsSection from "@/features/reviews/components/ReviewsSection";
import { site } from "@/config/Site";
const experienceWhatsAppHref = `https://wa.me/${site.whatsappRaw}?text=${encodeURIComponent("Olá, Arlete! Gostaria de saber mais sobre os serviços e combinar um atendimento.")}`;
export const revalidate = 3600;

const services = [
  {
    name: "Tranças & identidade",
    category: "penteados",
    image: "/images/services/tranças.png",
    description:
      "Box braids com atenção ao acabamento e orientação para a manutenção.",
  },
  {
    name: "Cor & luminosidade",
    category: "coloracao",
    image: "/images/services/coloracao.jpg",
    description: "Coloração, balayage e madeixas pensadas para o teu cabelo.",
  },
  {
    name: "Corte & movimento",
    category: "cabelo",
    image: "/images/services/corte.png",
    description:
      "Cortes femininos, masculinos e infantis, adaptados a cada rosto e rotina.",
  },
  {
    name: "Penteados & ocasiões",
    category: "penteados",
    image: "/images/services/penteado.png",
    description:
      "Da tua inspiração ao penteado para um dia especial, incluindo noivas.",
  },
];
export default async function HomePage() {
  // Resolve this optional section before committing any scroll-scene geometry.
  const { body: reviews } = await getGoogleReviews();
  return (
    <>
      <HomeIntro />
      <ArcScrollScene
        incoming={
          <section
            className="booking-section section-wrap arc-scroll-section"
            data-arc-scroll
            id="contato"
          >
            <span data-arc-surface aria-hidden="true" />
            <div data-arc-content>
              <span id="contacto" />
              <div className="booking-layout">
                <div>
                  <h2 data-reveal="maskedText" data-reveal-start="clamp(top 76%)">
                    Vamos cuidar
                    <br />
                    <em>de ti?</em>
                  </h2>
                  <p data-reveal="fadeUp" data-reveal-start="clamp(top 76%)">
                    Conta-me o que tens em mente. Envia o serviço,
                    <br />o dia que preferes e se desejas salão ou domicílio.
                    <br />
                    Confirmamos os detalhes pelo WhatsApp.
                  </p>
                  <div data-reveal="cta" data-reveal-start="clamp(top 76%)">
                    <BookingLink>Conversar e marcar</BookingLink>
                  </div>
                  <a data-reveal="cta" data-reveal-start="clamp(top 76%)" className="booking-phone" href={`tel:${site.phoneRaw}`}>
                    Ou liga: {site.phoneDisplay}
                  </a>
                </div>
                <div className="location-card">
                  <span className="location-divider" data-reveal="fadeUp" aria-hidden="true" />
                  <h3 data-reveal="maskedText" data-reveal-start="clamp(top 76%)">Campo de Ourique</h3>
                  <p data-reveal="fadeUp" data-reveal-start="clamp(top 76%)">{site.addressLine}</p>
                  <p data-reveal="fadeUp" data-reveal-start="clamp(top 76%)">
                    Terça a sexta · 09:00–18:00
                    <br />
                    Atendimento sob marcação
                  </p>
                  <div data-reveal="cta" data-reveal-start="clamp(top 76%)">
                    <Button
                      variant="secondary"
                      render={<a
                        href="https://www.google.com/maps/search/?api=1&query=R.%20Silva%20Carvalho%2054B%20Lisboa"
                        target="_blank"
                        rel="noreferrer"
                      />}
                    >
                      Como chegar
                    </Button>
                  </div>
                  <iframe data-reveal="fadeIn" data-reveal-start="clamp(top 76%)"
                    title="Localização do salão Ideias e Tranças"
                    src={site.googleMapsEmbedSrc}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </section>
        }
      >
        <ArcScrollScene
          incoming={
            <section
              className="services-section section-wrap arc-scroll-section"
              data-arc-scroll
              id="servicos"
            >
              <span data-arc-surface aria-hidden="true" />
              <div data-arc-content>
                <div className="section-heading">
                  <div data-reveal="stagger" data-reveal-start="clamp(top 76%)">
                    <h2>
                      O teu próximo
                      <br />
                      <em>melhor look.</em>
                    </h2>
                  </div>
                  <div data-reveal="stagger" data-reveal-start="clamp(top 76%)">
                    <p>
                      Descobre os serviços pensados para cuidar de ti, respeitar o teu estilo e valorizar a tua beleza.
                    </p>
                    <Button variant="secondary" render={<Link href="/servicos#servicos-list" />}>
                      Todos os serviços e valores{" "}
                    </Button>
                  </div>
                </div>
                <div className="service-grid">
                  {services.map((s) => (
                    <Link
                      href={`/servicos?categoria=${s.category}#servicos-list`}
                      key={s.name}
                      className="editorial-service"
                      data-reveal="fadeUp" data-reveal-start="clamp(top 76%)"
                    >
                      <div className="service-photo">
                        <Image
                          src={s.image}
                          alt={s.name}
                          fill
                          sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 23vw"
                        />
                        <ArrowCircle className="service-arrow" />
                      </div>
                      <h3>{s.name}</h3>
                      <p>{s.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          }
        >
          <Hero />
          <div className="px-4 pb-10 pt-2">
            <div className="mx-auto w-full max-w-5xl">
              <BrandsMarquee />
            </div>
          </div>
          <ExpandingSpaceSection />
        </ArcScrollScene>
        <section className="care-section" aria-labelledby="care-title">
          <div className="care-shell">
            <header className="care-intro">
              <div className="care-heading">
                <h2 id="care-title" data-reveal="fadeUp" data-reveal-start="clamp(top 76%)">
                  Da tua ideia ao <em>resultado.</em>
                </h2>
                <p>Três passos simples para encontrares o cuidado certo para ti.</p>
              </div>
            </header>
            <ol className="care-steps">
              {[
                ["Conta-nos o que procuras", "Partilha a tua ideia ou uma fotografia de inspiração."],
                ["Escolhemos juntas", "Conversamos sobre o teu cabelo e as opções mais adequadas."],
                ["Combinamos o teu atendimento", "Definimos o serviço, a disponibilidade e o local."],
              ].map(([title, description], index) => (
                <li key={title}>
                  <span className="care-step-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="care-footer">
              <Button variant="inverse" className="care-cta" render={<a href={experienceWhatsAppHref} target="_blank" rel="noopener noreferrer" aria-label="Falar com a Arlete no WhatsApp (abre numa nova janela)" />}>
                Falar com a Arlete
              </Button>
            </div>
          </div>
        </section>
        <section className="portfolio-section section-wrap">
          <div className="section-heading">
            <div>
              <h2>
                Cabelos reais.
                <br />
                <em>Beleza singular.</em>
              </h2>
            </div>
            <div>
              <p>
                Uma seleção de trabalhos. Cada pessoa, uma nova inspiração.
              </p>
              <Button variant="secondary" render={<Link href="/galeria" />}>
                Explorar a galeria
              </Button>
            </div>
          </div>
          <div className="portfolio-grid">
            {[
              { src: "001.png", label: "Corte & forma" },
              { src: "11.png", label: "Tranças & detalhe" },
              { src: "16.png", label: "Penteados & expressão" },
            ].map((p, i) => (
              <Link
                href="/galeria"
                key={p.src}
                className={`portfolio-piece piece-${i}`}

              >
                <div>
                  <span data-reveal-image>
                    <Image
                      src={`/images/gallery/${p.src}`}
                      alt={p.label + " — trabalho da Arlete"}
                      fill
                      sizes="(max-width: 600px) 90vw, 32vw"
                    />
                  </span>
                </div>
                <span>
                  {p.label}
                  <ArrowCircle />
                </span>
              </Link>
            ))}
          </div>
        </section>
        <ReviewsSection data={reviews} />
      </ArcScrollScene>
      <ArcScrollReveal />
    </>
  );
}
