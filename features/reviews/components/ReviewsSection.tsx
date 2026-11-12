import { Button } from "@/components/ui/button";
import type { ReviewsPayload } from "../data/google-reviews";

type Testimonial = {
  id: string;
  name: string;
  review: string;
  rating?: number;
  source?: string;
  sourceUrl?: string;
};

function ReviewCard({ review }: { review: Testimonial }) {
  return (
    <article className="review-card" tabIndex={0}>
      {review.rating !== undefined && review.rating > 0 && (
        <span className="review-stars" aria-label={`${review.rating} de 5 estrelas`}>
          {"★".repeat(Math.min(5, Math.max(0, Math.round(review.rating))))}
        </span>
      )}
      <blockquote>“{review.review}”</blockquote>
      <p className="review-author">{review.name}</p>
      {review.source && <p className="review-source">{review.source}</p>}
    </article>
  );
}

function ReviewRow({ reviews, reverse = false, animated }: { reviews: Testimonial[]; reverse?: boolean; animated: boolean }) {
  if (!reviews.length) return null;
  const repeats = animated ? Math.ceil(6 / reviews.length) : 1;
  return (
    <div className={`review-row${reverse ? " review-row-reverse" : ""}${animated ? " review-row-animated" : ""}`} tabIndex={0} aria-label={reverse ? "Avaliações, segunda fila" : "Avaliações, primeira fila"}>
      <div className="review-track">
        {[0, ...(animated ? [1] : [])].map((group) => (
          <div className="review-group" key={group} aria-hidden={group === 1 ? true : undefined}>
            {Array.from({ length: repeats }, (_, repeat) => reviews.map((review) => (
              <div className="review-item" key={`${group}-${repeat}-${review.id}`} aria-hidden={repeat > 0 ? true : undefined}>
                <ReviewCard review={review} />
              </div>
            )))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Only Google Places reviews supplied by the server are published. */
export default function ReviewsSection({ data }: { data: ReviewsPayload }) {
  const reviews: Testimonial[] = data?.ok ? (data.reviews ?? [])
    .filter((review) => review.text.trim() && review.authorName.trim())
    .map((review, index) => ({
      id: `${index}-${review.authorName}-${review.text}`,
      name: review.authorName,
      review: review.text,
      rating: review.rating,
      source: "Google",
      sourceUrl: review.authorUrl,
    })) : [];
  if (!reviews.length) return null;

  const midpoint = Math.ceil(reviews.length / 2);
  const twoRows = reviews.length >= 4;
  const firstRow = twoRows ? reviews.slice(0, midpoint) : reviews;
  const secondRow = twoRows ? reviews.slice(midpoint) : [];
  const animated = reviews.length >= 2;

  return (
    <section className="review-section" id="avaliacoes" aria-labelledby="reviews-title">
      <div className="review-heading">
        <h2 id="reviews-title">A beleza está nos <em>detalhes.</em></h2>
        <p>E nas histórias de quem passa por aqui.</p>
      </div>
      <div className={`review-rows${animated ? "" : " review-rows-static"}`}>
        <ReviewRow reviews={firstRow} animated={animated} />
        {twoRows && <ReviewRow reviews={secondRow} reverse animated={animated} />}
      </div>
      {data.place?.googleMapsUri && (
        <div className="review-cta">
          <Button variant="inverse" render={<a href={data.place.googleMapsUri} target="_blank" rel="noopener noreferrer" />}>
            Ver todas as avaliações
          </Button>
        </div>
      )}
    </section>
  );
}
