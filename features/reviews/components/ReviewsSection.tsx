import { Button } from "@/components/ui/button";
import type { ReviewsPayload } from "../data/google-reviews";
import styles from "./ReviewsSection.module.css";

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
    <article className={`review-card ${styles.reviewCard}`} tabIndex={0}>
      {review.rating !== undefined && review.rating > 0 && (
        <span
          className={styles.reviewStars}
          aria-label={`${review.rating} de 5 estrelas`}
        >
          {"★".repeat(Math.min(5, Math.max(0, Math.round(review.rating))))}
        </span>
      )}
      <blockquote>“{review.review}”</blockquote>
      <p className={styles.reviewAuthor}>{review.name}</p>
      {review.source && <p className={styles.reviewSource}>{review.source}</p>}
    </article>
  );
}

function ReviewRow({
  reviews,
  reverse = false,
  animated,
}: {
  reviews: Testimonial[];
  reverse?: boolean;
  animated: boolean;
}) {
  if (!reviews.length) return null;
  const repeats = animated ? Math.ceil(6 / reviews.length) : 1;
  return (
    <div
      className={`${styles.reviewRow}${reverse ? ` ${styles.reviewRowReverse}` : ""}${animated ? ` ${styles.reviewRowAnimated}` : ""}`}
      tabIndex={0}
      aria-label={
        reverse ? "Avaliações, segunda fila" : "Avaliações, primeira fila"
      }
    >
      <div className={styles.reviewTrack}>
        {[0, ...(animated ? [1] : [])].map((group) => (
          <div
            className={styles.reviewGroup}
            key={group}
            aria-hidden={group === 1 ? true : undefined}
          >
            {Array.from({ length: repeats }, (_, repeat) =>
              reviews.map((review) => (
                <div
                  className={styles.reviewItem}
                  key={`${group}-${repeat}-${review.id}`}
                  aria-hidden={repeat > 0 ? true : undefined}
                >
                  <ReviewCard review={review} />
                </div>
              )),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Only Google Places reviews supplied by the server are published. */
export default function ReviewsSection({ data }: { data: ReviewsPayload }) {
  const reviews: Testimonial[] = data?.ok
    ? (data.reviews ?? [])
        .filter((review) => review.text.trim() && review.authorName.trim())
        .map((review, index) => ({
          id: `${index}-${review.authorName}-${review.text}`,
          name: review.authorName,
          review: review.text,
          rating: review.rating,
          source: "Google",
          sourceUrl: review.authorUrl,
        }))
    : [];
  if (!reviews.length) return null;

  const midpoint = Math.ceil(reviews.length / 2);
  const twoRows = reviews.length >= 4;
  const firstRow = twoRows ? reviews.slice(0, midpoint) : reviews;
  const secondRow = twoRows ? reviews.slice(midpoint) : [];
  const animated = reviews.length >= 2;

  return (
    <section
      className={styles.reviewSection}
      id="avaliacoes"
      aria-labelledby="reviews-title"
    >
      <div className={styles.reviewHeading}>
        <h2 id="reviews-title">
          A beleza está nos <em>detalhes.</em>
        </h2>
        <p>E nas histórias de quem passa por aqui.</p>
      </div>
      <div
        className={`${styles.reviewRows}${animated ? "" : ` ${styles.reviewRowsStatic}`}`}
      >
        <ReviewRow reviews={firstRow} animated={animated} />
        {twoRows && (
          <ReviewRow reviews={secondRow} reverse animated={animated} />
        )}
      </div>
      {data.place?.googleMapsUri && (
        <div className={styles.reviewCta}>
          <Button
            variant="inverse"
            render={
              <a
                href={data.place.googleMapsUri}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            Ver todas as avaliações
          </Button>
        </div>
      )}
    </section>
  );
}
