import {Hero} from "@/features/home/components/Hero";
import {BrandsMarquee} from "@/features/home/components/BrandsMarquee";
import ServicesPreview from "@/features/services/components/ServicesPreview";
import ReviewsSection from "@/features/reviews/components/ReviewsSection";
import Differentials from "@/features/services/components/Differentials";
import { BookingLocationSection } from "@/features/location/components/BookingLocationSection";
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