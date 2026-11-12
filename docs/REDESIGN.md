# Arlete Space redesign

## Audit and plan
The existing application uses Next.js 16 App Router, React 19, TypeScript, Tailwind 4 and Framer Motion. Routes: home, /servicos, /galeria, /api/google-reviews. Existing feature folders separate services, gallery, location, reviews and home. Preserve service catalogue/prices, filtering, gallery viewing, Google review integration, telephone, email, Instagram, maps and WhatsApp.

Friction: three inconsistent brand names; hero links to a nonexistent #contacto while location uses #contato; low contrast overlays; excessive rounded containers; hidden scrollbars and custom cursor; unreliable floating CTA visibility; unverified review fallback; nested main landmarks; missing OG image. Gallery also includes crafts, so retain them in the full gallery without presenting them as hair results.

Information architecture: hero → philosophy → services → personal approach → selected hair work → live reviews (only when available) → booking/location → footer. Retain service and gallery routes. Booking remains a WhatsApp conversation, never a simulated reservation.

Art direction: warm ivory, nude, muted clay, wine and espresso; Cormorant Garamond/Inter; oversized editorial serif with italic emphasis; fine rules and rectangular photographic compositions. Hero reuses existing campaign photography; service and portfolio sections reuse actual work. No fabricated studio imagery, testimonials, credentials or treatments.

## Engineering decisions
Server-render content and use small interactive islands for navigation, progressive scroll reveals, live reviews and gallery. Use native CSS transitions and IntersectionObserver rather than add motion dependencies. All content remains visible without JavaScript. Respect reduced motion, keep native pointer and scrollbars, use semantic landmarks, visible focus and labelled controls. Next Image reserves image space and generates responsive variants. Mobile navigation uses native disclosure; booking remains in the header and mobile dock.

## Verification limits and release notes
Business details are inherited from the repository; Arlete Space is the requested public brand, while Ideias e Tranças remains the existing salon identity. Hours come from the existing footer. No new legal policies are invented. Existing prices remain unchanged and require business confirmation before launch. Confirm image rights, contact details and hours before a production release. Live site and Sofia Rossi reference were unavailable through the web reader. No production deployment is requested by the repository workflow.

## Completed verification
- `npx next build --webpack`: passed compilation, TypeScript and static generation for all existing routes.
- Production HTTP checks: `/`, `/servicos` and `/galeria` returned 200. Each has one main landmark and one H1; rendered images include alt attributes; WhatsApp URLs point to the inherited business number; homepage fragment targets resolve.
- `/api/google-reviews`: returned `ok: true` with four reviews in the local production environment. The UI renders only real API results with author attribution; failures omit the section.
- `git diff --check`: passed.
- Self-hosted Latin WOFF2 fonts total approximately 96 KB with bundled OFL licenses. No new application dependencies.
- Browser automation tooling was unavailable, so rendered desktop/tablet/mobile layouts, keyboard interactions and Core Web Vitals remain unverified. Responsive rules and reduced-motion behavior were reviewed in source; this is not a WCAG certification or measured performance claim.

The local Turbopack build stalled after compilation began; the production webpack build passed. Use `npx next build --webpack` for the verified build path in this environment.

## Arc scroll transitions
Services and booking now use a convex leading edge that flattens in response to viewport entry, in both scroll directions. Booking has a warm contrasting background so the reviews-to-location transition remains visible. One requestAnimationFrame controller updates only sections near the viewport; layout reads precede CSS writes. IntersectionObserver limits work and ResizeObserver accounts for asynchronously loaded reviews. Mobile arc depth scales down with viewport width. Reduced-motion and no-JavaScript paths show complete sections without clipping. No dependencies or scroll interception were added. Rendered visual verification remains pending because browser tooling is unavailable.
