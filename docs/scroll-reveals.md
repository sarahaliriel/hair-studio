# Scroll reveals

`Reveal` is mounted once in the root layout. It uses the existing GSAP installation,
`useGSAP`, and ScrollTrigger. No CSS hides server-rendered content.

## Coverage

- Home: hero typography/actions, introduction, service headings/cards, care content
  and photograph, portfolio, reviews, booking/location content.
- Services: title groups, dynamically mounted service rows, contact title/actions.
- Gallery: title groups, individual photographic tiles, contact title/actions.
- Shared footer: three content groups and the final row.

The curated selector list in `shared/ui/reveal/presets.ts` targets visual groups,
not every text node. A selected ancestor owns its descendants. The hero image
trail, navigation, floating CTA, page overlay and gallery dialog are excluded.

## Extending

Use `data-reveal="fadeUp"`, `fadeIn`, `maskedText`, `imageReveal`, `scaleReveal`,
`stagger`, or `cta`. `stagger` animates direct children in a single timeline.
Use `data-reveal="none"` to exclude a subtree. Optional overrides:

```tsx
<div data-reveal="stagger" data-reveal-duration="0.8"
     data-reveal-delay="0.05" data-reveal-start="clamp(top 88%)">
  <p>Eyebrow</p><h2>Heading</h2><p>Description</p>
</div>
```

Duration/delay overrides are seconds, bounded to 1.5 seconds. Keep image targets
inside an overflow-hidden frame; the system scales the nested photograph and
clips the wrapper. Original author styles are restored after completion so hover
styles remain effective. Nearby sibling entrances overlap with capped delays.

## Lifecycle and integration

Each route change reverts only this system's context and triggers. A child-list
observer handles new service rows or streamed content and removes detached rows.
Fonts, image loads and route visibility refresh measurements;
there are no per-frame layout reads in the reveal system.

The curved page overlay dispatches `arlete:page-visible` after release. Waiting
entrances start then, not behind the overlay. The arc exclusively owns its section,
fixed background surface and content container. Global GSAP presets animate only
meaningful descendants inside `[data-arc-content]`. A live
`data-arc-content-visible` signal gates these entrances until the arc exposes the
content; `arlete:arc-content-visible` releases eligible, already-triggered children.
Children further below still wait for their own viewport triggers. This signal
never clears or changes the arc geometry: the surface remains active until
progress 1, and reverses normally with scrolling. Completed child entrances never
restart when the arc is revisited; their exit fades reverse as content returns.

Reduced motion reverts active animations and removes reveal listeners/triggers.
Mobile uses shorter movement, smaller image scale and shorter stagger. Keyboard
focus completes its containing reveal immediately. Without JavaScript, content
keeps its normal visible server styles. Triggers use `clamp(top 88%)` so content
at the end of the document can still enter before the maximum scroll position.

## Verification

Production build and TypeScript passed. Chrome/Playwright checks at 1440 × 900
and 390 × 844 passed slow and fast homepage scrolling, arc content visibility,
footer completion, internal route navigation, dynamic service categories, gallery
completion, horizontal overflow and live reduced-motion switching, with no page
errors. Additional checks passed keyboard focus completion, back/forward history,
initial reduced motion and JavaScript-disabled rendering. The existing hero trail
still spawned visible images during pointer movement. Viewport screenshots were
reviewed at desktop and mobile sizes. Physical-device performance was not profiled.

Arc/content integration regression: on desktop and mobile, both arc headings
remain pending before content exposure, animate through intermediate opacity with
the shared GSAP preset after exposure, then stay revealed. The surface stays
active at 85–90%, completes at 100% and reactivates on reverse scroll without
restarting completed child entrances. Section/content-container transforms remain
untouched. Reduced motion, production build and TypeScript passed; no browser
runtime errors were reported.

## Scroll exits

After a group's entrance finishes, a separate tracked ScrollTrigger fades its
opacity from 1 to 0 as its bottom passes through the top 18% of the viewport,
finishing just beyond the viewport edge. The exit uses gentle scrub smoothing
and reverses when scrolling back. It never changes masks, scale or transforms,
so arc surfaces and image/card hover animations keep their existing ownership.
Entrances remain one-time triggered animations. Exits apply to the same curated
visual groups on all routes, including content inside arc sections.

`data-reveal-exit="none"` opts a group out. Focused groups stay fully visible;
reduced motion, unmounts and removed dynamic nodes revert their exit styles and
clean up their triggers. Navigation, floating CTAs and image trail remain excluded.

Exit verification passed on desktop and mobile: intermediate opacity near the
viewport edge, full fade outside it, restoration on reverse scroll, reduced-motion
reset, internal navigation cleanup and keyboard visibility. Both arc integrations
also passed again with exits enabled. Production build/TypeScript passed and the
browser checks reported no runtime errors.

Home section coverage is declared explicitly in `app/page.tsx` for services,
care, booking and location, with `clamp(top 76%)` starts so entrances remain
visible in the reading area. Service heading groups and the care eyebrow/title
use coordinated stagger; care rows and photograph keep separate triggers.
Booking text/actions, location text/actions and the map each have explicit
presets. A sequential-scroll browser check on desktop and mobile observed
intermediate opacity and completion for service heading/cards, care heading/rows/
photograph, booking heading and location heading/map. Reduced motion, TypeScript
and production build passed with no browser runtime errors.
