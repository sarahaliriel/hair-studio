import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json(
      { ok: false, error: "Missing GOOGLE_MAPS_API_KEY or GOOGLE_PLACE_ID" },
      { status: 500 }
    );
  }

  const params = new URLSearchParams({
    languageCode: "pt-PT",
    regionCode: "PT",
  });

  const url = `https://places.googleapis.com/v1/places/${placeId}?${params.toString()}`;
  const fieldMask = [
    "id",
    "displayName",
    "rating",
    "userRatingCount",
    "googleMapsUri",
    "reviews",
  ].join(",");

  const res = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": fieldMask,
    },
    next: { revalidate: 3600 },
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { ok: false, error: "Google Places request failed", details: data },
      { status: 502 }
    );
  }

  const reviews = Array.isArray(data.reviews)
    ? data.reviews.slice(0, 6).map((r: any) => ({
        rating: Number(r.rating ?? 0),
        text: String(r.text?.text ?? ""),
        originalText: String(r.originalText?.text ?? ""),
        authorName: String(r.authorAttribution?.displayName ?? "Cliente"),
        authorUrl: r.authorAttribution?.uri ? String(r.authorAttribution.uri) : undefined,
        relativeTime: r.relativePublishTimeDescription
          ? String(r.relativePublishTimeDescription)
          : undefined,
      }))
    : [];

  return NextResponse.json({
    ok: true,
    place: {
      name: data.displayName?.text ?? "",
      rating: Number(data.rating ?? 0),
      userRatingCount: Number(data.userRatingCount ?? 0),
      googleMapsUri: String(data.googleMapsUri ?? ""),
    },
    reviews,
    attribution: "Powered by Google",
  });
}