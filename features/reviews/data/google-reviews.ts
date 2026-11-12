import "server-only";

export type ReviewsPayload = {
  ok: boolean;
  place?: { name: string; rating: number; userRatingCount: number; googleMapsUri: string };
  reviews?: {
    text: string; originalText: string; authorName: string; authorUrl?: string;
    rating: number; relativeTime?: string;
  }[];
  attribution?: string;
  error?: string;
  details?: unknown;
};

type GooglePlace = {
  displayName?: { text?: string }; rating?: number; userRatingCount?: number; googleMapsUri?: string;
  reviews?: {
    rating?: number; text?: { text?: string }; originalText?: { text?: string };
    authorAttribution?: { displayName?: string; uri?: string }; relativePublishTimeDescription?: string;
  }[];
};

/** One cached server source for the homepage and the existing public API. */
export async function getGoogleReviews(): Promise<{ body: ReviewsPayload; status: number }> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return {
    body: { ok: false, error: "Missing GOOGLE_MAPS_API_KEY or GOOGLE_PLACE_ID" }, status: 500,
  };
  try {
    const params = new URLSearchParams({ languageCode: "pt-PT", regionCode: "PT" });
    const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}?${params}`, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,googleMapsUri,reviews",
      },
      next: { revalidate: 3600 },
      // Bound an unavailable provider's effect on initial server rendering.
      signal: AbortSignal.timeout(5000),
    });
    const data: GooglePlace = await response.json();
    if (!response.ok) return {
      body: { ok: false, error: "Google Places request failed", details: data }, status: 502,
    };
    const reviews = Array.isArray(data.reviews) ? data.reviews.slice(0, 6).map((review) => ({
      rating: Number(review.rating ?? 0), text: String(review.text?.text ?? ""),
      originalText: String(review.originalText?.text ?? ""),
      authorName: String(review.authorAttribution?.displayName ?? "Cliente"),
      authorUrl: review.authorAttribution?.uri ? String(review.authorAttribution.uri) : undefined,
      relativeTime: review.relativePublishTimeDescription ? String(review.relativePublishTimeDescription) : undefined,
    })) : [];
    return {
      status: 200,
      body: {
        ok: true, reviews, attribution: "Powered by Google",
        place: {
          name: data.displayName?.text ?? "", rating: Number(data.rating ?? 0),
          userRatingCount: Number(data.userRatingCount ?? 0), googleMapsUri: String(data.googleMapsUri ?? ""),
        },
      },
    };
  } catch {
    return { body: { ok: false, error: "Google Places request failed" }, status: 502 };
  }
}
