# Homepage performance and motion refinement — Phase 3

Implemented 12 November 2026. Current Phase 1/2 source and pre-existing working-tree
changes were reviewed before editing. No dependencies were installed. Native
scrolling, scene nesting, arc shape, exposure hysteresis, anchor normalization,
responsive reveal state, route readiness and server-resolved Reviews are retained.

## Changes and rationale

### ArcScroll

The frame loop was already demand-driven; no permanent loop needed removing.
Section/content/surface references are now captured once, rather than queried
again on measurement, exposure and cleanup. Completed scenes are cleared once.
Sticky size properties only change when their measured values change. Existing
layout reads still precede sticky writes.

Ellipse/path calculations are skipped when mask progress and viewport dimensions
are unchanged. Pending and fully covered masks do not calculate an ellipse.
Display, path, active-state and promotion hints are written only when necessary.
The global permanent clip-path will-change was removed; the hint is requested
only while the curved surface is visible. This allows the browser to release the
hint outside that interval; actual layer allocation was not measured.

Hidden tabs cancel pending arc frames, and visibility restoration invalidates
measurements before resuming. The authoritative scroll sample and scene-update
handoff are unchanged. No progress rounding or smoothing was introduced.

### Expanding image: evaluated and retained

The existing width/height/radius interpolation intentionally changes the image's
object-fit crop while growing its frame. Transforming a fixed frame could change
that crop, text proportions or corners. No browser profile demonstrated a benefit
large enough to justify that visual risk. Its component, responsive dimensions,
pin, scrub, overlay, spacing and reduced-motion fallback were left unchanged.
This is not a claim that its rendering cost has been proven acceptable.

### Reveal

Scene arc references and start expressions are cached. Closed arc groups and
already-playing entrances no longer read bounds or resolve start expressions on
every scene update: they only reconcile their pause/eligibility state. Completed
groups with no exit need no scene work. Reversible exits still measure actual
viewport bounds on scroll, but only write GSAP progress when it changes.

Measurements remain batched before scene writes. An entrance completed during
reconciliation does not subsequently apply an exit value from its stale entrance
bounds. Phase 2's coalesced refresh scheduler, pin-to-arc handoff, resource filters,
breakpoint state and lifecycle cleanup are preserved rather than duplicated.

### Hero image trail

- Resolve optimized source URLs once and deduplicate both pending and completed
  decodes. Coarse-pointer/reduced-motion visitors do not preload or measure the
  disabled effect. Failed sources do not block other decoded images.
- Accumulate distance from native pointer events, then append at most one photo
  per animation frame using the latest pointer position. No idle RAF loop.
- Invalidate viewport coordinates through the existing scene-update signal and
  resize events. Read new bounds on demand before the next eligible pointer frame;
  no extra scroll listener was added.
- Track and kill entire timelines, not just their currently targeted tweens.
  Completion removes its photo and releases its slot. Offscreen, hidden-tab,
  capability and reduced-motion transitions cancel pending work and active photos.
  Teardown ignores late decode results and removes all listeners/observers.
- Bound concurrency at 16 photos. This limits burst accumulation while retaining
  the original sources, dimensions, rotations, trajectories, durations and easing.
  No element pool was introduced without evidence that reuse is needed.

The limit/coalescing can reduce photo density under extreme input bursts; visual
acceptance of that case is still required. These checks do not measure browser
image-cache memory or internal decoding work.

### Marquee and motion handoff

The marquee remains a CSS animation with its original 28s/18s speeds and hover
pause. IntersectionObserver, tab visibility and reduced motion toggle only its
play-state eligibility. Pausing does not reset its animation name or playhead.
Mobile CSS changes duration without resetting play-state through an animation
shorthand. No JavaScript animation loop was introduced.

Portfolio image reveal scale now targets an absolutely positioned local span;
CSS hover continues to own the nested photograph's transform. This removes the
inline-transform/CSS-transition handoff on the same element. Original image sizes,
crop frame, caption, hover scale and reveal timings are preserved. No transforms
were added to sticky/fixed structural ancestors.

No blanket filter, containment, content-visibility or layer-promotion rules were
applied. Existing containment on trail/physics stages and footer sleep/paused
promotion policy were already purposeful and retained. Global timing/easing was
not changed without a reproduced issue.

## Before/after operation checks

Baseline source copies were captured before editing under
`/tmp/hair-studio-phase3-baseline`. Actual transpiled ArcScroll/Reveal modules were
run against the same instrumented, simulated DOM/GSAP fixtures.

| Fixture | Before | After |
| --- | ---: | ---: |
| One completed arc, 120 scroll updates: descendant queries | 240 | 0 |
| Same fixture: style write/removal attempts | 240 | 0 |
| Same fixture: attribute write/removal attempts | 120 | 0 |
| One closed reveal, 20 updates: bounds reads | 20 | 0 |
| One active entrance, 20 updates: bounds reads | 20 | 0 |
| One completed stationary exit, 20 updates: ancestor queries | 20 | 0 |
| Same exit fixture: GSAP progress writes | 20 | 0 |

Completed exits still performed 20 bounds reads in that fixture, deliberately:
document scroll alone cannot describe a sticky descendant's visual movement.
These figures count JavaScript operations, not elapsed rendering time. They are
not FPS, paint, layout-duration, memory or compositor measurements.

The regression script accepts optional `HAIR_STUDIO_ARC_BASELINE` and
`HAIR_STUDIO_REVEAL_BASELINE` source paths to repeat the comparison. Normal tests
do not depend on temporary baseline files.

## Executed validation

- `node --test scripts/check-scroll-stability.mjs scripts/check-decorative-motion.mjs`:
  27 passed, including Phase 1/2 regressions, operation counts, mask-hint lifecycle,
  hidden-tab suspension, image ownership, decode deduplication, pointer coalescing,
  fresh coordinates, bounded concurrency, failed-image fallback, offscreen cleanup,
  late decode completion and marquee eligibility.
- Targeted ESLint on all changed TSX and test files: passed.
- `tsc --noEmit --incremental false`: passed.
- `npm run build`: passed; homepage remains static with one-hour revalidation.
- Generated production HTML structure: two scenes, two outgoing wrappers, two arc
  surfaces, three local portfolio reveal layers and contact anchor present.
- `git diff --check`: passed.
- `npm run lint`: three pre-existing explicit-any errors in ServicesPreview,
  global.d.ts and ScrollIndicator; one unused mapsUrl warning in
  BookingLocationSection. These unrelated files were not modified.

Browser execution/profiling was unavailable, and Playwright/Puppeteer were not
installed. No dependencies were installed to work around this. Simulated tests
do not verify actual GSAP/browser rendering, CSS hover behavior, seamless marquee
phase, viewport compositing or physical pointer/touch input.

## Release assessment and remaining validation

The implementation builds and its automated logic checks pass. Production sign-off
remains pending real-browser/device regression testing; the existing full-lint
failures also remain unresolved under this task's unrelated-change boundary.

Use a production build in desktop Chrome/Safari, mobile Safari and Android Chrome.
Record both arcs in both directions with slow/rapid input, sudden reversal,
scrollbar dragging, hashes, restored positions and repeated routes. Verify keyboard
focus and initial/live reduced motion. Test breakpoint crossings and short
landscape/orientation changes. Inspect portfolio hover during entrance, marquee
pause/resume/hover, and fast trail bursts while scrolling or leaving the hero.

Profile the retained expanding frame and full-viewport clip-path before proposing
another rendering technique. Capture scripting/layout/paint traces, frame pacing,
long tasks, layer allocation and memory during repeated navigation. No claim of
60/120Hz suitability or device-specific performance improvement is made here.
