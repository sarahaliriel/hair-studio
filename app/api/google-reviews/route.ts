import { NextResponse } from "next/server";
import { getGoogleReviews } from "@/features/reviews/data/google-reviews";

export async function GET() {
  const { body, status } = await getGoogleReviews();
  return NextResponse.json(body, { status });
}
