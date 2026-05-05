import {Hero} from "@/features/home/components/Hero";
import {BrandsMarquee} from "@/features/home/components/BrandsMarquee";
import ServicesPreview from "@/features/services/ServicesPreview";
import ReviewsSection from "@/features/reviews/ReviewsSection";
import Differentials from "@/features/services/Differentials";
import { BookingLocationSection } from "@/features/location/BookingLocationSection";
import ScrollIndicator from "@/shared/ui/ScrollIndicator";

export default function HomePage() {
  return (
    <main className="bg-[#edeae2] text-[#2f2d2d]">
      <Hero />

      <section className="px-4 pb-10 pt-2">
        <div className="mx-auto w-full max-w-5xl">
          <BrandsMarquee />
        </div>
      </section>

      <ServicesPreview />

      <ReviewsSection />

      <Differentials />

      <BookingLocationSection />

      <ScrollIndicator />

    </main>
  );
}