/** Logic/lifecycle regressions, not browser or visual verification.
 * Run: node --test scripts/check-scroll-stability.mjs
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { test } from "node:test";
import ts from "typescript";
import * as jsxRuntime from "react/jsx-runtime";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

function load(file, globals = {}, dependencies = {}) {
  const filename = path.resolve(file);
  const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const compiled = { exports: {} };
  vm.runInNewContext(code, {
    module: compiled, exports: compiled.exports,
    require: (name) => {
      assert.ok(name in dependencies, `unexpected dependency: ${name}`);
      return dependencies[name];
    }, ...globals,
  }, { filename });
  return compiled.exports;
}
const policy = load("shared/ui/scroll-scene.ts");

class Events {
  listeners = new Map();
  addEventListener(name, callback) {
    if (!this.listeners.has(name)) this.listeners.set(name, new Set());
    this.listeners.get(name).add(callback);
  }
  removeEventListener(name, callback) {
    this.listeners.get(name)?.delete(callback);
    if (!this.listeners.get(name)?.size) this.listeners.delete(name);
  }
  dispatchEvent(event) {
    this.listeners.get(event.type)?.forEach((callback) => callback(event));
  }
}
const style = (metrics) => new Proxy({
  setProperty(name, value) { this[name] = value; },
  removeProperty(name) { delete this[name]; },
}, {
  set(target, key, value) {
    if (metrics) metrics.styleWrites++;
    target[key] = value;
    return true;
  },
  deleteProperty(target, key) {
    if (metrics) metrics.styleWrites++;
    delete target[key];
    return true;
  },
});

function mount({ height = 900, width = 1440, offset = 110, hash = "", reduced = false, implementation = "shared/ui/ArcScroll.tsx", arcTargets = [] } = {}) {
  const metrics = { queries: 0, styleWrites: 0, attributeWrites: 0 };
  const frames = new Map();
  let sequence = 0;
  let cleanup;
  let disconnected = false;
  const window = Object.assign(new Events(), { innerHeight: height, scrollY: 0 });
  const media = Object.assign(new Events(), { matches: reduced });
  window.matchMedia = () => media;
  const location = { hash };
  const content = { style: style(metrics), inert: false, contains: (node) => node === focusedChild, querySelectorAll: () => arcTargets };
  const focusedChild = {};
  const surface = { style: style(metrics), removeAttribute() { metrics.styleWrites++; this.style = style(metrics); } };
  const outgoing = { offsetHeight: 2000, offsetTop: 999, style: style(metrics), hasAttribute: () => true, offsetParent: null };
  const section = Object.assign(new Events(), {
    dataset: {}, style: style(metrics), offsetTop: 2000, offsetParent: outgoing,
    attributes: new Map(),
    hasAttribute: () => false,
    closest: () => section,
    querySelector: (selector) => { metrics.queries++; return selector === "[data-arc-content]" ? content : surface; },
    getAttribute(name) { return this.attributes.get(name) ?? null; },
    setAttribute(name, value) { metrics.attributeWrites++; this.attributes.set(name, value); },
    removeAttribute(name) { metrics.attributeWrites++; this.attributes.delete(name); },
    focus() { document.activeElement = section; },
  });
  const document = Object.assign(new Events(), {
    activeElement: null,
    documentElement: { clientWidth: width },
    querySelectorAll: (selector) => selector === "[data-arc-scroll]" ? [section] : [outgoing],
    querySelector: () => ({}),
    getElementById: (id) => id === "contato" ? section : null,
  });
  const { ArcScrollReveal } = load(implementation, {
    document, window, location, Event,
    getComputedStyle: () => ({ backgroundColor: "rgb(236, 228, 219)", scrollPaddingTop: `${offset}px` }),
    requestAnimationFrame: (callback) => { frames.set(++sequence, callback); return sequence; },
    cancelAnimationFrame: (id) => frames.delete(id),
    ResizeObserver: class { observe() {} disconnect() { disconnected = true; } },
  }, { react: { useLayoutEffect: (callback) => { cleanup = callback(); } }, "./scroll-scene": policy });
  ArcScrollReveal();
  const flush = () => {
    const callbacks = [...frames.values()];
    frames.clear();
    callbacks.forEach((callback) => callback());
    assert.equal(frames.size, 0, "no independent settling loop");
  };
  const scroll = (value) => {
    window.scrollY = value;
    window.dispatchEvent(new Event("scroll"));
    window.dispatchEvent(new Event("scroll"));
    assert.equal(frames.size, 1, "scroll events coalesce into one frame");
    flush();
  };
  return { window, media, document, location, content, focusedChild, surface, section, outgoing, frames, metrics, flush, scroll,
    destroy() {
      cleanup();
      assert.ok(disconnected);
      assert.equal(frames.size, 0);
      assert.equal(window.listeners.size, 0);
      assert.equal(document.listeners.size, 0);
      assert.equal(media.listeners.size, 0);
      assert.equal(content.inert, false);
      assert.equal(section.dataset.arcContentVisible, undefined);
    },
  };
}

test("settled arcs perform no repeated descendant queries or style/attribute writes", (context) => {
  function sample(implementation) {
    const page = mount({ implementation });
    page.scroll(2500);
    const before = { ...page.metrics };
    for (let index = 0; index < 120; index++) page.scroll(2600 + index);
    const delta = Object.fromEntries(Object.entries(page.metrics).map(([key, value]) => [key, value - before[key]]));
    page.destroy();
    return delta;
  }
  const current = sample("shared/ui/ArcScroll.tsx");
  assert.deepEqual(current, { queries: 0, styleWrites: 0, attributeWrites: 0 });
  if (process.env.HAIR_STUDIO_ARC_BASELINE) {
    const baseline = sample(process.env.HAIR_STUDIO_ARC_BASELINE);
    context.diagnostic(`120 simulated settled scroll frames: before=${JSON.stringify(baseline)}; after=${JSON.stringify(current)}. These are operation counts, not browser frame timings.`);
  }
});

test("arc mask promotion is temporary and hidden tabs schedule no scroll work", () => {
  const page = mount();
  page.scroll(1550);
  assert.equal(page.surface.style.willChange, "clip-path");
  page.scroll(1900);
  assert.equal(page.surface.style.willChange, "auto");
  page.document.hidden = true;
  page.document.dispatchEvent(new Event("visibilitychange"));
  page.window.dispatchEvent(new Event("scroll"));
  assert.equal(page.frames.size, 0);
  page.window.scrollY = 0;
  page.document.hidden = false;
  page.document.dispatchEvent(new Event("visibilitychange"));
  page.flush();
  assert.equal(page.content.inert, true);
  page.destroy();
});

test("native progress settles immediately across large jumps and reversals", () => {
  const page = mount();
  for (const scroll of [0, 1300, 1950, 5000, 1700, 0, 2000]) {
    page.scroll(scroll);
    assert.equal(page.content.inert, policy.sceneProgress(2000, scroll, 900) < 0.78);
  }
  page.destroy();
});

test("content exposure follows the covered arc and reverses with scroll", () => {
  const page = mount();
  const move = (progress) => page.scroll(2000 - 900 * (1 - progress));
  move(0.79);
  assert.equal(page.content.inert, false);
  move(0.81);
  for (const progress of [0.799, 0.785, 0.805, 0.79]) {
    move(progress);
    assert.equal(page.content.inert, false);
  }
  page.document.activeElement = page.focusedChild;
  move(0.77);
  assert.equal(page.document.activeElement, page.section);
  assert.equal(page.content.inert, true);
  page.destroy();
});

test("arc content opacity and position reverse from the same scroll progress", () => {
  const target = { dataset: { reveal: "fadeUp" }, style: style(), parentElement: null };
  const page = mount({ arcTargets: [target] });
  const move = (progress) => page.scroll(2000 - 900 * (1 - progress));
  move(0.78);
  assert.equal(target.style.opacity, "0");
  move(0.89);
  const midpoint = [target.style.opacity, target.style.transform];
  assert.ok(Number(midpoint[0]) > 0 && Number(midpoint[0]) < 1);
  move(1);
  assert.equal(target.style.opacity, "1");
  move(0.89);
  assert.deepEqual([target.style.opacity, target.style.transform], midpoint);
  move(0.78);
  assert.equal(target.style.opacity, "0");
  page.destroy();
});

test("contact landing exposes content at the header offset on short and tall screens", () => {
  for (const [width, offset] of [[1440, 110], [390, 90]]) {
    for (const height of [320, 390, 600, 844, 900, 1200]) {
      const page = mount({ height, width, offset, hash: "#contato" });
      page.scroll(2000 - offset);
      assert.equal(page.content.inert, false, `${width} × ${height}`);
      assert.equal(page.surface.style.clipPath, "none");
      page.scroll(0);
      assert.equal(page.content.inert, true);
      page.destroy();
    }
  }
});

test("pushState-style hash changes and restored positions need no timeout", () => {
  const page = mount({ height: 390 });
  page.location.hash = "#contato"; // deliberately no hashchange event
  page.scroll(1890);
  assert.equal(page.content.inert, false);
  page.window.scrollY = 0;
  page.window.dispatchEvent(new Event("pageshow"));
  page.flush();
  assert.equal(page.content.inert, true);
  page.destroy();
});

test("reduced motion and teardown release interaction without clearing reveal properties", () => {
  const initial = mount({ reduced: true, hash: "#contato" });
  assert.equal(initial.content.inert, false);
  initial.destroy();
  const page = mount();
  page.content.style.transform = "translateY(12px)";
  page.content.style.opacity = "0.5";
  page.media.matches = true;
  page.media.dispatchEvent(new Event("change"));
  page.flush();
  assert.equal(page.content.inert, false);
  assert.equal(page.content.style.transform, "translateY(12px)");
  assert.equal(page.content.style.opacity, "0.5");
  page.media.matches = false;
  page.media.dispatchEvent(new Event("change"));
  page.flush();
  assert.equal(page.content.inert, true);
  page.window.dispatchEvent(new Event("scroll"));
  page.destroy();
});

test("exit opacity follows visual departure, including stationary sticky content", () => {
  assert.equal(policy.visualExitProgress(500, 900), 0);
  assert.equal(policy.visualExitProgress(72, 900), 0.5);
  assert.equal(policy.visualExitProgress(-18, 900), 1);
});

function mountReveal({ scene = true, overlay = false, top = 730, bottom = 830, imageReveal = false, implementation = "shared/ui/Reveal.tsx" } = {}) {
  const metrics = { layoutReads: 0, closestQueries: 0, exitWrites: 0 };
  const image = {}, imageLayer = {};
  const timelines = [], exits = [], triggers = [], frames = new Map();
  const mode = { motion: true, mobile: false };
  let cleanup, mediaCleanup, mediaCallback, sequence = 0, refreshes = 0;
  let bounds = { top, bottom, width: 300, height: 100 };
  let covered = overlay;
  const arc = { dataset: { arcContentVisible: "false" } };
  const main = { contains: () => true };
  const element = {
    dataset: { reveal: imageReveal ? "imageReveal" : "fadeUp", revealStart: "clamp(top 76%)" },
    parentElement: { closest: () => null }, isConnected: true,
    closest(selector) {
      metrics.closestQueries++;
      if (selector === "[data-arc-scroll]") return scene ? arc : null;
      if (selector === "[data-arc-content]" || selector === "[data-arc-scene]") return scene ? main : null;
      return null;
    },
    matches: () => false, contains: () => false,
    getBoundingClientRect: () => { metrics.layoutReads++; return bounds; },
    querySelector: (selector) => !imageReveal ? null : selector === "img" ? image : imageLayer,
  };
  const fonts = Object.assign(new Events(), { ready: Promise.resolve() });
  const document = Object.assign(new Events(), {
    activeElement: null, documentElement: { scrollHeight: 6000 }, fonts,
    querySelector: (selector) => selector === "main" ? main : covered ? {} : null,
    querySelectorAll: (selector) => selector.includes("data-arc-outgoing") ? [] : [element],
  });
  const window = Object.assign(new Events(), {
    innerHeight: 900, scrollY: 0,
    matchMedia: (query) => ({ matches: query.includes("reduce)") ? !mode.motion : mode.mobile }),
  });
  const triggerEvents = new Events();
  const ScrollTrigger = {
    create(options) {
      assert.equal(scene, false, "sticky reveals must not create document-position triggers");
      const trigger = { start: 700, options, killed: false, kill() { this.killed = true; } };
      triggers.push(trigger);
      return trigger;
    },
    refresh() { refreshes++; triggerEvents.dispatchEvent(new Event("refresh")); },
    addEventListener: (...args) => triggerEvents.addEventListener(...args),
    removeEventListener: (...args) => triggerEvents.removeEventListener(...args),
  };
  const gsap = {
    registerPlugin() {},
    matchMedia: () => ({
      add: (_, callback) => { mediaCallback = callback; mediaCleanup = callback({ conditions: mode }); },
      revert: () => mediaCleanup?.(),
    }),
    timeline() {
      const timeline = {
        plays: 0, pausedValue: true, delayValue: 0, reverted: false, value: 0, callbacks: {}, targets: [],
        fromTo(target, from, options) { this.targets.push(target); this.from = from; this.complete = options.onComplete; return this; },
        eventCallback(name, callback) { this.callbacks[name] = callback; return this; },
        progress(value, suppress = false) {
          if (value === undefined) return this.value;
          this.value = value;
          if (!suppress) this.callbacks.onUpdate?.();
          if (value === 1 && !suppress) this.complete();
          return this;
        },
        play() { this.plays++; this.pausedValue = false; },
        paused(value) { this.pausedValue = value; },
        delay(value) { if (value === undefined) return this.delayValue; this.delayValue = value; return this; },
        revert() { this.reverted = true; },
      };
      timelines.push(timeline);
      return timeline;
    },
    fromTo(_, __, options) {
      assert.equal(options.paused, scene);
      const exit = { value: 0, progress(value) { metrics.exitWrites++; this.value = value; }, revert() {} };
      exits.push(exit);
      return exit;
    },
  };
  const { Reveal } = load(implementation, {
    document, window, Event, Element: class {}, performance: { now: () => 0 },
    requestAnimationFrame: (callback) => { frames.set(++sequence, callback); return sequence; },
    cancelAnimationFrame: (id) => frames.delete(id),
    MutationObserver: class { observe() {} disconnect() {} },
    ResizeObserver: class { observe() {} disconnect() {} },
  }, {
    "next/navigation": { usePathname: () => "/" },
    "@gsap/react": { useGSAP: (callback) => { cleanup = callback(); } },
    gsap: { default: gsap }, "gsap/ScrollTrigger": { ScrollTrigger },
    "./scroll-scene": policy,
    "./reveal/presets": load("shared/ui/reveal/presets.ts"),
    "./reveal/eligibility": load("shared/ui/reveal/eligibility.ts"),
    "./page-transition/readiness": load("shared/ui/page-transition/readiness.ts", { document }),
  });
  Reveal();
  return {
    document, window, arc, timelines, exits, triggers, frames, mode, metrics, image, imageLayer,
    get refreshes() { return refreshes; },
    set bounds(value) { bounds = { ...bounds, ...value }; },
    set overlay(value) { covered = value; },
    update() { document.dispatchEvent(new Event("arlete:scene-update")); },
    rebuild(changes) { Object.assign(mode, changes); mediaCleanup?.(); mediaCleanup = mediaCallback({ conditions: mode }); },
    flush() { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach((callback) => callback()); },
    destroy() {
      cleanup();
      assert.equal(document.listeners.size, 0);
      assert.equal(window.listeners.size, 0);
      assert.equal(fonts.listeners.size, 0);
      assert.equal(triggerEvents.listeners.size, 0);
      assert.equal(frames.size, 0);
      assert.ok(triggers.every((trigger) => trigger.killed));
    },
  };
}

test("scene reveals avoid hidden/active entrance measurements and unchanged exit writes", (context) => {
  function sample(implementation) {
    const page = mountReveal({ implementation });
    const delta = (action) => {
      const before = { ...page.metrics };
      action();
      return Object.fromEntries(Object.entries(page.metrics).map(([key, value]) => [key, value - before[key]]));
    };
    const update = () => { for (let index = 0; index < 20; index++) page.update(); };
    const hidden = delta(update);
    page.arc.dataset.arcContentVisible = "true";
    page.bounds = { top: 650 };
    page.update();
    const active = delta(update);
    page.timelines[0].complete();
    const completed = delta(update);
    page.destroy();
    return { hidden, active, completed };
  }
  const current = sample("shared/ui/Reveal.tsx");
  assert.equal(current.hidden.layoutReads, 0);
  assert.equal(current.active.layoutReads, 0);
  assert.equal(current.completed.exitWrites, 0);
  assert.equal(current.completed.closestQueries, 0);
  if (process.env.HAIR_STUDIO_REVEAL_BASELINE) {
    const baseline = sample(process.env.HAIR_STUDIO_REVEAL_BASELINE);
    context.diagnostic(`20 simulated updates per state: before=${JSON.stringify(baseline)}; after=${JSON.stringify(current)}. Operation counts only, not browser profiling.`);
  }
});

test("portfolio reveal scale uses its own layer, preserving CSS hover ownership", () => {
  const page = mountReveal({ imageReveal: true });
  assert.equal(page.timelines[0].targets[0], page.imageLayer);
  assert.ok(!page.timelines[0].targets.includes(page.image));
  page.destroy();
});

test("sticky reveals respect exposure, pause without replay, and exit by visual bounds", () => {
  const page = mountReveal();
  const timeline = page.timelines[0];
  assert.equal(timeline.plays, 0);
  page.arc.dataset.arcContentVisible = "true";
  page.update();
  assert.equal(timeline.plays, 0, "76% is not bypassed by the old 88% fallback");
  page.bounds = { top: 710 };
  page.update();
  assert.equal(timeline.plays, 1);
  page.arc.dataset.arcContentVisible = "false";
  page.update();
  assert.equal(timeline.pausedValue, true);
  page.arc.dataset.arcContentVisible = "true";
  page.update();
  assert.equal(timeline.pausedValue, false);
  assert.equal(timeline.plays, 1);
  page.bounds = { top: 400, bottom: 500 };
  timeline.complete();
  page.window.scrollY = 4000;
  page.update();
  assert.equal(page.exits[0].value, 0, "document movement cannot fade stationary sticky content");
  page.bounds = { bottom: 72 };
  page.update();
  assert.equal(page.exits[0].value, 0.5);
  page.bounds = { bottom: 500 };
  page.update();
  assert.equal(page.exits[0].value, 0);
  assert.equal(timeline.plays, 1);
  page.destroy();
});

test("responsive rebuilds preserve in-progress and completed entrances", () => {
  const page = mountReveal({ top: 600 });
  page.arc.dataset.arcContentVisible = "true";
  page.update();
  page.timelines[0].progress(0.4);
  page.rebuild({ mobile: true });
  const mobile = page.timelines.at(-1);
  assert.equal(mobile.from.y, 19.2);
  assert.equal(mobile.progress(), 0.4);
  assert.equal(mobile.plays, 0, "in-progress entrance is resumed rather than replayed");
  mobile.complete();
  page.rebuild({ mobile: false });
  assert.equal(page.timelines.at(-1).reverted, true);
  assert.equal(page.timelines.at(-1).plays, 0);
  page.rebuild({ motion: false });
  page.rebuild({ motion: true });
  assert.equal(page.timelines.at(-1).plays, 0);
  page.destroy();
});

test("pending entrances use new breakpoint movement without inheriting completion", () => {
  const page = mountReveal();
  page.rebuild({ mobile: true });
  const timeline = page.timelines.at(-1);
  assert.equal(timeline.from.y, 19.2);
  assert.equal(timeline.plays, 0);
  page.arc.dataset.arcContentVisible = "true";
  page.bounds = { top: 650 };
  page.update();
  assert.equal(timeline.plays, 1);
  page.destroy();
});

test("restored offscreen content settles without an entrance replay", () => {
  const page = mountReveal({ top: -300, bottom: -200 });
  page.arc.dataset.arcContentVisible = "true";
  page.update();
  assert.equal(page.timelines[0].plays, 0);
  assert.equal(page.timelines[0].reverted, true);
  assert.equal(page.exits[0].value, 1);
  page.bounds = { top: 300, bottom: 400 };
  page.update();
  assert.equal(page.exits[0].value, 0);
  page.destroy();
});

test("overlay release rechecks configured document triggers and batches refreshes", () => {
  const page = mountReveal({ scene: false, overlay: true, top: 500 });
  const trigger = page.triggers[0];
  trigger.options.onEnter();
  assert.equal(page.timelines[0].plays, 0);
  page.overlay = false;
  page.document.dispatchEvent(new Event("arlete:page-visible"));
  page.window.dispatchEvent(new Event("resize"));
  page.window.dispatchEvent(new Event("pageshow"));
  assert.equal(page.frames.size, 1);
  page.flush();
  assert.equal(page.refreshes, 1);
  assert.equal(page.timelines[0].plays, 0, "a stale onEnter cannot bypass the refreshed start");
  page.window.scrollY = 800;
  page.window.dispatchEvent(new Event("popstate"));
  page.flush();
  assert.equal(page.timelines[0].plays, 1);
  assert.equal(trigger.killed, true);
  page.destroy();
});

test("scene eligibility respects clamp, configured edges and short viewports", () => {
  const { sceneRevealEligible: eligible } = load("shared/ui/reveal/eligibility.ts");
  assert.equal(eligible(700, 100, "clamp(top 76%)", 900, 0, 5000), false);
  assert.equal(eligible(680, 100, "clamp(top 76%)", 900, 0, 5000), true);
  assert.equal(eligible(200, 100, "bottom center", 400, 0, 1000), false);
  assert.equal(eligible(50, 100, "bottom center", 400, 0, 1000), true);
  assert.equal(eligible(350, 100, "clamp(top 76%)", 390, 1000, 1000), true);
  assert.equal(eligible(350, 100, "top 76%", 390, 1000, 1000), false);
});

test("page visibility starts once, immediately on direct loads and after overlay release", () => {
  const document = new Events();
  let covered = true, starts = 0;
  document.querySelector = () => covered ? {} : null;
  const { whenPageVisible } = load("shared/ui/page-transition/readiness.ts", { document });
  const cancel = whenPageVisible(() => starts++);
  assert.equal(starts, 0);
  document.dispatchEvent(new Event("arlete:page-visible"));
  assert.equal(starts, 0);
  covered = false;
  document.dispatchEvent(new Event("arlete:page-visible"));
  document.dispatchEvent(new Event("arlete:page-visible"));
  assert.equal(starts, 1);
  cancel();
  assert.equal(document.listeners.size, 0);
  whenPageVisible(() => starts++);
  assert.equal(starts, 2, "direct load has no artificial wait");
  covered = true;
  const unmount = whenPageVisible(() => starts++);
  unmount();
  covered = false;
  document.dispatchEvent(new Event("arlete:page-visible"));
  assert.equal(starts, 2, "unmounted destination cannot start");
});

test("reviews server source handles success, empty, missing configuration and failures", async () => {
  const fetches = [];
  const fixture = { reviews: [{ rating: 5, text: { text: "Test review fixture" }, authorAttribution: { displayName: "Test author" } }] };
  function source({ env = { GOOGLE_MAPS_API_KEY: "test-key", GOOGLE_PLACE_ID: "test-place" }, response = fixture, ok = true, failure = false } = {}) {
    return load("features/reviews/data/google-reviews.ts", {
      process: { env }, URLSearchParams,
      AbortSignal: { timeout: () => ({ deadline: true }) },
      fetch: async (url, options) => {
        fetches.push({ url, options });
        if (failure) throw new Error("fixture network failure");
        return { ok, json: async () => response };
      },
    }, { "server-only": {} }).getGoogleReviews;
  }
  const success = await source()();
  assert.equal(success.status, 200);
  assert.equal(success.body.reviews[0].authorName, "Test author");
  assert.equal(fetches[0].options.next.revalidate, 3600);
  assert.equal(fetches[0].options.signal.deadline, true);
  const empty = await source({ response: {} })();
  assert.equal(empty.body.reviews.length, 0);
  const count = fetches.length;
  assert.equal((await source({ env: {} })()).status, 500);
  assert.equal(fetches.length, count, "missing configuration makes no provider request");
  for (const config of [{ ok: false }, { failure: true }, { response: null }]) {
    const failed = await source(config)();
    assert.equal(failed.status, 502);
    assert.equal(failed.body.ok, false);
  }
});

test("reviews render real data without duplicate accessibility content or empty sections", () => {
  const { default: ReviewsSection } = load("features/reviews/components/ReviewsSection.tsx", {}, {
    "react/jsx-runtime": jsxRuntime,
    "@/components/ui/button": { Button: ({ children, render }) => createElement("a", { href: render.props.href }, children) },
  });
  for (const data of [{ ok: false }, { ok: true, reviews: [] }]) {
    assert.equal(renderToStaticMarkup(ReviewsSection({ data })), "");
  }
  for (const count of [1, 2, 3, 4, 5, 6]) {
    const reviews = Array.from({ length: count }, (_, index) => ({
      text: `Test review ${index}`, authorName: `Author ${index}`, rating: 5,
    }));
    const html = renderToStaticMarkup(ReviewsSection({ data: {
      ok: true, reviews, place: { googleMapsUri: "https://maps.google.com/example" },
    } }));
    assert.ok(html.includes('id="avaliacoes"'));
    assert.ok(html.includes("A beleza está nos"));
    assert.equal(html.includes("review-row-animated"), count >= 2);
    assert.equal((html.match(/class="review-row(?: review-row-reverse)?(?: review-row-animated)?"/g) ?? []).length, count >= 4 ? 2 : 1);
    assert.ok(html.includes("https://maps.google.com/example"));
    for (const review of reviews) assert.ok(html.includes(review.text));
    if (count >= 2) assert.ok(html.includes('aria-hidden="true"'));
  }
});

test("hero waits for visibility, settles restoration and never duplicates its entrance", () => {
  function mountHero({ covered = false, bottom = 800, motion = true } = {}) {
    const document = new Events();
    const state = { covered, motion };
    document.querySelector = (selector) => selector === '.page-transition[data-active="true"]' && state.covered ? {} : null;
    const stage = { dataset: {}, querySelectorAll: () => [], getBoundingClientRect: () => ({ bottom }) };
    const entered = { current: false };
    const timelines = [];
    let cleanup, mediaCleanup, mediaCallback;
    const gsap = {
      registerPlugin() {},
      matchMedia: () => ({
        add: (_, callback) => { mediaCallback = callback; if (state.motion) mediaCleanup = callback(); },
        revert: () => mediaCleanup?.(),
      }),
      timeline() {
        const timeline = {
          plays: 0, value: 0, killed: false,
          set() { return this; }, to() { return this; },
          play() { this.plays++; }, progress(value) { this.value = value; },
          kill() { this.killed = true; },
        };
        timelines.push(timeline);
        return timeline;
      },
    };
    const stub = () => null;
    const { Hero } = load("features/home/components/Hero.tsx", {
      document,
      window: { matchMedia: () => ({ matches: !state.motion }) },
    }, {
      "react/jsx-runtime": jsxRuntime,
      react: { useRef: (value) => value === null ? { current: stage } : entered },
      "next/image": { default: stub }, "next/link": { default: stub },
      "@gsap/react": { useGSAP: (callback) => { cleanup = callback(); } }, gsap: { default: gsap },
      "@/components/ui/button": { Button: stub },
      "@/features/gallery/data/images": { heroTrailImages: [] },
      "@/shared/ui/BookingLink": { BookingLink: stub },
      "@/shared/ui/RotatingImageTrail": { RotatingImageTrail: stub },
      "@/shared/ui/page-transition/readiness": load("shared/ui/page-transition/readiness.ts", { document }),
    });
    Hero();
    return {
      timelines,
      release() { state.covered = false; document.dispatchEvent(new Event("arlete:page-visible")); },
      motion(value) { state.motion = value; mediaCleanup?.(); mediaCleanup = value ? mediaCallback() : undefined; },
      destroy() { cleanup(); assert.equal(document.listeners.size, 0); },
    };
  }
  const direct = mountHero();
  assert.equal(direct.timelines[0].plays, 1);
  direct.release();
  assert.equal(direct.timelines[0].plays, 1);
  direct.destroy();
  const returning = mountHero({ covered: true });
  assert.equal(returning.timelines[0].plays, 0);
  returning.release();
  assert.equal(returning.timelines[0].plays, 1);
  returning.motion(false);
  returning.motion(true);
  assert.equal(returning.timelines.length, 1);
  returning.destroy();
  const restored = mountHero({ bottom: -10 });
  assert.equal(restored.timelines[0].plays, 0);
  assert.equal(restored.timelines[0].value, 1);
  restored.destroy();
  const reduced = mountHero({ motion: false });
  reduced.motion(true);
  assert.equal(reduced.timelines.length, 0);
  reduced.destroy();
  const cancelled = mountHero({ covered: true });
  cancelled.destroy();
  cancelled.release();
  assert.equal(cancelled.timelines[0].plays, 0);
});
