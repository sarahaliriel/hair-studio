# Homepage animation behavior — Phase 2

Implemented 11 November 2026, against the current working tree. Phase 1's native
scroll progress, arc exposure hysteresis, focus transfer, sticky markup and
contact offset policy are retained. ArcScroll and its styles were not rewritten.
The existing hero had already gained page-visible gating and a revised entrance;
those working-tree changes were preserved.

## Eligibility and restoration

`shared/ui/reveal/eligibility.ts` supplies one default start expression and resolves
scene starts against actual viewport bounds. It supports the homepage's configured
clamped percentage starts plus vertical edge/offset and numeric expressions.
Clamping applies only when explicitly configured. Non-scene initialization uses
the actual ScrollTrigger start, including after refresh; the old fixed 88% bypass
is not restored. A trigger is retained until playback is genuinely eligible, then
killed so an overlay-blocked entrance cannot consume its trigger prematurely.

Already-departed groups finish immediately once page/arc exposure permits them.
Their exit remains reversible. Pending and active groups remain subject to the
Phase 1 arc gate. Pageshow/popstate request a coalesced geometry refresh rather
than resetting animation state or overriding native scroll restoration.

## Responsive lifecycle

Reveal's GSAP matchMedia context watches both motion preference and the existing
760px mobile breakpoint. A per-node WeakMap outside that context retains played,
completed and normalized timeline progress across rebuilds. Pending groups receive
new distances, durations, scales and stagger; active groups resume at their saved
progress; completed groups recreate only reversible exit behavior. Timings retain
the previous desktop/mobile values. On reduced-motion activation, existing groups
settle to static author styles and are not replayed on re-enabling motion.

All triggers, tweens, observers, event listeners and scheduled frames are cleaned
up before replacement. The state is scoped to the mounted route DOM, not a global
cross-page animation cache.

## Hero and page readiness

`page-transition/readiness.ts` reads the existing overlay state. Its disposable
one-shot subscription starts immediately when no overlay is active and otherwise
waits for the existing page-visible event. Hero retains its current animation
values, gains a per-mount replay guard, and settles rather than plays when already
above the viewport after restoration. Initial reduced motion leaves it static.

PageTransition re-aligns its explicit destination after visible assets/fonts are
ready, while still covered, then requests layout synchronization. It does not
introduce another transition state or change history restoration behavior.

## Layout and Reviews

Reveal remains the existing refresh owner. Font completion, relevant resource
loads, resize/orientation, route visibility and main/arc composition size changes
coalesce through its single pending refresh frame. Decorative aria-hidden image
loads do not force global refreshes. Pin-refresh DOM mutations only scan reveal
targets; they do not request another refresh and create a feedback loop.

The order is ScrollTrigger refresh (including pins), layout-ready, ArcScroll's
updated sticky measurements, then scene-update and scene reveal reconciliation.
Scene bounds are not sampled prematurely from the refresh-completion handler.

Reviews no longer insert a whole section after a client fetch. The homepage awaits
the real cached server result before returning its composition. ReviewsSection
renders that data synchronously with the existing markup. Empty/failing results
render no section and reserve no permanent blank space. The existing API and page
share a typed server-only provider loader and its original one-hour cache policy;
homepage revalidation is explicitly one hour. A five-second provider deadline
bounds cache-miss/failure latency. This is a server-fetch deadline, not animation
scheduling. No fixture reviews or visual placeholders are used in the app.

Tradeoff: a cache miss/prerender can wait for the provider, and an omitted failed
result can persist until the next page revalidation. No live Google data or network
performance was verified in this session.

## Executed validation

- `node --test scripts/check-scroll-stability.mjs`: 16 passed. Includes all Phase 1
  cases plus responsive rebuild/resume, completed-state preservation, configured
  starts/clamping, restoration, overlay eligibility, refresh coalescing, hero
  playback/cancellation/reduced motion, provider success/empty/error fixtures and
  server-rendered Reviews markup.
- Targeted ESLint over all changed source files and the regression script: passed.
- `tsc --noEmit --incremental false`: passed.
- `npm run build`: passed; homepage statically generated with one-hour revalidation.
- `npm run lint`: three existing explicit-any errors in ServicesPreview,
  global.d.ts and ScrollIndicator; one existing unused mapsUrl warning in
  BookingLocationSection. These files were not changed.

Animation tests execute actual transpiled components with simulated DOM/GSAP
services. Reviews markup is rendered with React's server renderer and provider
responses are fixtures. These checks do not establish browser rendering behavior,
physical input performance, or GSAP compositor behavior.

## Manual acceptance and Phase 3

Browser execution was unavailable. Before release, verify initial load and return
navigation, both arcs in both directions, rapid input/reversals, hashes and reload
at multiple positions, desktop/mobile breakpoint crossing during pending/active/
completed reveals, orientation and short landscape screens, slow fonts/images,
live reduced motion and repeated navigation. Inspect real ScrollTrigger counts,
intermediate rendered frames and keyboard focus, not only settled screenshots.

Phase 3 remains responsible for hero trail coordinates/preloading, portfolio
hover/reveal transform ownership, expansion dimension rendering, paint/layer/image
profiling and other performance tuning. No typography, imagery, section order,
spacing, animation libraries or native scrolling behavior were redesigned.
