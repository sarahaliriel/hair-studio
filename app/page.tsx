import {Hero} from "@/components/hero";
import {BrandsMarquee} from "@/components/brandsMarquee";
import ServicesPreview from "@/components/servicesPreview";
import ReviewsSection from "@/components/reviewsSection";
import Differentials from "@/components/differentials";
import { BookingLocationSection } from "@/components/bookingLocationSection";

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

    </main>
  );
}