import {Hero} from "@/components/Hero";
import {BrandsMarquee} from "@/components/BrandsMarquee";
import ServicesPreview from "@/components/ServicesPreview";
import ReviewsSection from "@/components/ReviewsSection";
import Differentials from "@/components/Differentials";
import { BookingLocationSection } from "@/components/BookingLocationSection";

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