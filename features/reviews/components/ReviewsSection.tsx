import { ArrowCircle } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import type { ReviewsPayload } from "../data/google-reviews";

/** Reviews are resolved before the homepage layout is committed. */
export default function ReviewsSection({ data }: { data: ReviewsPayload }) {
  const reviews = data?.ok ? data.reviews?.filter((r) => r.text) : [];
  if (!reviews?.length) return null;
  return (
    <section className="review-section section-wrap" id="avaliacoes">
      <div className="section-heading">
        <div>
          <p className="eyebrow">AS VOZES DE QUEM NOS VISITA</p>
          <h2>
            Palavras que
            <br />
            <em>ficam.</em>
          </h2>
        </div>
        {data?.place?.googleMapsUri && (
          <Button variant="secondary" render={<a
            href={data.place.googleMapsUri}
            target="_blank"
            rel="noreferrer"
           />}>
            Avaliações no Google
          </Button>
        )}
      </div>
      <div className="review-grid">
        {reviews.slice(0, 3).map((r, i) => (
          <article className="review-card" key={i}>
            <span
              className="review-stars"
              aria-label={`${r.rating} de 5 estrelas`}
            >
              {"★".repeat(Math.min(5, Math.max(0, Math.round(r.rating))))}
            </span>
            <blockquote>“{r.text}”</blockquote>
            <p>
              {r.authorUrl ? (
                <a href={r.authorUrl} target="_blank" rel="noreferrer">
                  {r.authorName} <ArrowCircle />
                </a>
              ) : (
                r.authorName
              )}
            </p>
            <p>Google</p>
          </article>
        ))}
      </div>
    </section>
  );
}
