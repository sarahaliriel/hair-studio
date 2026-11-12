# Homepage scroll stability — Phase 1

Implemented 11 November 2026. Existing visual styling, section order, native
sticky scene structure, GSAP presets and animation dependencies are retained.

## Responsibilities and synchronization

- `ArcScroll.tsx` samples native scroll once per scheduled frame. The independent
  exponential settling clock is removed, so large jumps and reversals do not
  leave the background mask behind the sticky composition.
- Native CSS sticky still positions the outgoing compositions. Arc layout reads
  precede sticky custom-property writes. No clones, spacers or scroll interception
  were introduced.
- The surface uses the original arc geometry. Ordinary scenes keep their original
  progress interval. Content opens above 80%; on reversal it remains exposed until
  progress falls below 78%, when the surface starts uncovering. Visibility and
  inert change together. Focus moves to the containing section before hiding;
  any temporary section tabindex is restored on teardown.
- Arc cleanup owns visibility/inert and surface styles, not reveal opacity or
  transforms. A scene-update event coordinates reveals after the arc frame.
- Reveals inside a scene measure actual viewport bounds, not document-scroll
  thresholds that continue changing behind a stationary sticky ancestor. Reads
  are batched before animation writes. Pending entrance offsets are excluded
  from eligibility measurements. The configured 76%/88% threshold is respected.
- In-progress entrances pause while their arc is closed and resume rather than
  replay. Completed entrances remain completed. Their separate paused GSAP exit
  tween receives progress from actual element-bottom position across the original
  18% to -2% viewport band. Focused groups remain fully opaque. Scene exits have
  no independent scrub lag; non-scene reveals retain ScrollTrigger behavior.
- ScrollTrigger refresh completion invalidates arc geometry. Resource/font loads
  and main-size changes request a coalesced refresh. Mutation scanning does not
  itself request refresh: pin refreshes mutate the DOM and must not feed a loop.

## Contact navigation

Arc sections override the generic section scroll margin. Root scroll padding
remains the single existing desktop/mobile header offset. For the explicitly
hash-targeted arc, progress ends at this header-aligned landing point instead of
viewport top. This preserves the arc shape and exposure sequence even on short
screens. The fixed surface remains until the actual section top reaches viewport
top, avoiding an early handoff of the viewport background.

Hash changes are detected from the scroll sample as well as lifecycle events,
covering pushState-based links that do not emit hashchange. Pageshow, popstate,
page-visible, resize and layout-ready invalidate measurements. There are no
timeout-based navigation fixes and no additional native scroll listener.

## Validation

- `node --test scripts/check-scroll-stability.mjs`: seven passing logic/lifecycle
  tests. Uses the actual transpiled ArcScroll and Reveal modules with simulated
  DOM and animation services, plus the shared progress policy. It is not a browser
  renderer or an integration test of GSAP's rendering implementation.
- Targeted ESLint for changed TypeScript and regression script: passed.
- `tsc --noEmit --incremental false`: passed.
- `npm run build`: passed.
- `npm run lint`: blocked by existing explicit-any errors in the reviews API,
  ServicesPreview, global.d.ts and ScrollIndicator; also reports an unused mapsUrl
  warning in BookingLocationSection. Those unrelated files were not changed.

Browser execution was unavailable in this session. No FPS, paint, CLS, touch,
trackpad, screenshot or visual-smoothness claims are made.

## Manual acceptance before release

Test both arcs slowly forward/backward and with rapid wheel/trackpad input,
scrollbar dragging, Page Down and sudden reversal. Verify contact links from the
homepage and other routes, initial /#contato, refresh, back/forward restoration
and repeated route navigation. Test keyboard focus during exposure/reversal and
initial/live reduced motion. Include desktop, tablet, narrow mobile, short
landscape, resize/orientation and native mobile browser toolbar changes. Test
late reviews and image loads during both transitions. Capture intermediate
frames and performance traces, not only settled screenshots.

## Deferred

Hero entrance/page-overlay coordination, hero trail coordinates/preloading,
portfolio hover/reveal transform separation, expansion width/height rendering,
reviews space reservation, responsive preset rebuilding and broader paint/image
profiling remain outside this phase. No homepage redesign or dependency change
was made.
