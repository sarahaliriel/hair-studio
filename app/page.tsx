import { Button, ArrowCircle } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/features/home/components/Hero";
import { BrandsMarquee } from "@/features/home/components/BrandsMarquee";
import { ExpandingSpaceSection } from "@/features/home/components/ExpandingSpaceSection";
import { BookingLink } from "@/shared/ui/BookingLink";
import { ArcScrollScene } from "@/shared/ui/ArcScrollScene";
import { ArcScrollReveal } from "@/shared/ui/ArcScroll";
import { getGoogleReviews } from "@/features/reviews/data/google-reviews";
import ReviewsSection from "@/features/reviews/components/ReviewsSection";
import { site } from "@/config/Site";
export const revalidate = 3600;

const services = [
  {
    name: "Tranças & identidade",
    image: "/images/services/tranças.png",
    description:
      "Box braids com atenção ao acabamento e orientação para a manutenção.",
    number: "01",
  },
  {
    name: "Cor & luminosidade",
    image: "/images/services/coloracao.jpg",
    description: "Coloração, balayage e madeixas pensadas para o teu cabelo.",
    number: "02",
  },
  {
    name: "Corte & movimento",
    image: "/images/services/corte.png",
    description:
      "Cortes femininos, masculinos e infantis, adaptados a cada rosto e rotina.",
    number: "03",
  },
  {
    name: "Penteados & ocasiões",
    image: "/images/services/penteado.png",
    description:
      "Da tua inspiração ao penteado para um dia especial, incluindo noivas.",
    number: "04",
  },
];
export default async function HomePage() {
  // Resolve this optional section before committing any scroll-scene geometry.
  const { body: reviews } = await getGoogleReviews();
  return (
    <>
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
              <span className="eyebrow" data-reveal="fadeUp" data-reveal-start="clamp(top 76%)">05 / O TEU MOMENTO</span>
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
                  <span className="eyebrow" data-reveal="fadeUp" data-reveal-start="clamp(top 76%)">À TUA ESPERA EM LISBOA</span>
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
                    <p className="eyebrow">02 / SERVIÇOS</p>
                    <h2>
                      O teu próximo
                      <br />
                      <em>melhor look.</em>
                    </h2>
                  </div>
                  <div data-reveal="stagger" data-reveal-start="clamp(top 76%)">
                    <p>
                      Um novo tom. Um novo corte. Ou simplesmente
                      <br />o cuidado de que o teu cabelo precisa.
                    </p>
                    <Button variant="secondary" render={<Link href="/servicos" />}>
                      Todos os serviços e valores{" "}
                    </Button>
                  </div>
                </div>
                <div className="service-grid">
                  {services.map((s) => (
                    <Link
                      href="/servicos"
                      key={s.number}
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
                        <span className="service-number">{s.number}</span>
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
        <section className="care-section">
          <div className="care-inner">
            <div data-reveal="stagger" data-reveal-start="clamp(top 76%)">
              <p className="eyebrow">03 / A NOSSA FORMA DE CUIDAR</p>
              <h2>
                O detalhe faz
                <br />
                <em>a diferença.</em>
              </h2>
            </div>
            <div className="care-list">
              {[
                [
                  "01",
                  "Um cuidado individual",
                  "O teu rosto, o teu cabelo e a tua rotina orientam cada escolha.",
                ],
                [
                  "02",
                  "Da inspiração à finalização",
                  "Partilha uma referência e conversamos sobre o resultado que procuras.",
                ],
                [
                  "03",
                  "Perto de ti",
                  "No salão em Campo de Ourique ou ao domicílio em Lisboa, sob marcação.",
                ],
              ].map(([n, t, d]) => (
                <div key={n} data-reveal="fadeUp" data-reveal-start="clamp(top 76%)">
                  <span>{n}</span>
                  <div>
                    <h3>{t}</h3>
                    <p>{d}</p>
                  </div>
                  <ArrowCircle />
                </div>
              ))}
            </div>
          </div>
          <div className="care-art" data-reveal="imageReveal" data-reveal-start="clamp(top 76%)">
            <Image
              src="/images/services/penteado.png"
              alt="Detalhe de um penteado elaborado pela Arlete"
              fill
              sizes="(max-width: 760px) 100vw, 45vw"
            />
            <span>O TEU ESTILO, EM CADA DETALHE.</span>
          </div>
        </section>
        <section className="portfolio-section section-wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">04 / PELAS MÃOS DA ARLETE</p>
              <h2>
                Cabelos reais.
                <br />
                <em>Beleza singular.</em>
              </h2>
            </div>
            <div>
              <p>
                Uma seleção de trabalhos.
                <br />
                Cada pessoa, uma nova inspiração.
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
