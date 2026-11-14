import type gsap from "gsap";

export const revealPresets = {
  fadeUp: { from: { opacity: 0, y: 32 }, duration: 0.8 },
  fadeIn: { from: { opacity: 0 }, duration: 0.75 },
  maskedText: { from: { opacity: 0, y: 28, clipPath: "inset(100% 0% 0% 0%)" }, duration: 0.9 },
  imageReveal: { from: { opacity: 0, scale: 1.06, clipPath: "inset(8% 0% 0% 0%)" }, duration: 1.05 },
  scaleReveal: { from: { opacity: 0, scale: 0.97 }, duration: 0.85 },
  stagger: { from: { opacity: 0, y: 36 }, duration: 0.8 },
  cta: { from: { opacity: 0, y: 15 }, duration: 0.55 },
} satisfies Record<string, { from: gsap.TweenVars; duration: number }>;
export type RevealVariant = keyof typeof revealPresets;

/** Deliberately curated visual groups. Navigation, overlays and hero trail are excluded. */
export const revealTargets = [
  "[data-reveal]", ".gallery-hero-content > *", "[data-arc-content] > .eyebrow", ".intro-caption", ".intro h2", ".intro-details", ".intro .text-link",
  ".section-heading > div > *", ".section-heading > a", ".editorial-service",
  ".care-inner > .eyebrow", ".care-inner > h2", ".care-list > div", ".care-art",
  ".portfolio-piece", ".review-card", ".booking-layout > div:first-child > *",
  ".location-card > *", ".footer-top > *", ".footer-bottom", ".gallery-tile",
].join(", ");

/** A short viewport-edge fade; reverse scrolling restores content automatically. */
export const revealExit = {
  start: "bottom top+=18%",
  end: "bottom top-=2%",
  scrub: 0.25,
} as const;
