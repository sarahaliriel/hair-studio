/** Simulated lifecycle/resource checks; not browser rendering or FPS profiling. */
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { test } from "node:test";
import ts from "typescript";
import * as jsxRuntime from "react/jsx-runtime";

function load(file, globals, dependencies) {
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const compiled = { exports: {} };
  vm.runInNewContext(code, {
    module: compiled, exports: compiled.exports,
    require(name) { assert.ok(name in dependencies, name); return dependencies[name]; },
    ...globals,
  }, { filename: file });
  return compiled.exports;
}

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
  emit(name, fields = {}) { this.listeners.get(name)?.forEach((callback) => callback({ type: name, ...fields })); }
}

function mountTrail({ fine = true, reduced = false } = {}) {
  let cleanup, intersection, disconnected = false, sequence = 0, reads = 0;
  let now = 0;
  let bounds = { top: 100, left: 0, width: 800, height: 700 };
  const frames = new Map(), timelines = [], decodes = [];
  const document = Object.assign(new Events(), { hidden: false });
  const window = new Events();
  const finePointer = Object.assign(new Events(), { matches: fine });
  const reducedMotion = Object.assign(new Events(), { matches: reduced });
  const hero = Object.assign(new Events(), { getBoundingClientRect() { reads++; return bounds; } });
  const layer = {
    parentElement: hero, children: [],
    appendChild(photo) { this.children.push(photo); },
    replaceChildren() { this.children.length = 0; },
  };
  document.createElement = () => ({ style: {},
    remove() { const index = layer.children.indexOf(this); if (index !== -1) layer.children.splice(index, 1); },
  });
  class PreloadImage {
    decode() {
      let resolve, reject;
      const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
      decodes.push({ source: this.src, resolve, reject, promise });
      return promise;
    }
  }
  const gsap = {
    timeline(options) {
      const timeline = {
        options, killed: false, steps: [],
        fromTo(photo, from, to) { this.photo = photo; this.initial = from; this.steps.push(to); return this; },
        to(_, to) { this.steps.push(to); return this; },
        kill() { this.killed = true; },
      };
      timelines.push(timeline);
      return timeline;
    },
  };
  const { RotatingImageTrail } = load("shared/ui/RotatingImageTrail.tsx", {
    document, window, Image: PreloadImage, performance: { now: () => now },
    matchMedia: (query) => query.includes("reduce") ? reducedMotion : finePointer,
    requestAnimationFrame: (callback) => { frames.set(++sequence, callback); return sequence; },
    cancelAnimationFrame: (id) => frames.delete(id),
    IntersectionObserver: class { constructor(callback) { intersection = callback; } observe() {} disconnect() { disconnected = true; } },
  }, {
    react: { useRef: () => ({ current: layer }), useEffect: (callback) => { cleanup = callback(); } },
    "react/jsx-runtime": jsxRuntime,
    gsap: { gsap }, "next/image": { getImageProps: ({ src }) => ({ props: { src } }) },
    "./RotatingImageTrail.module.css": { default: { layer: "layer", photo: "photo" } },
  });
  const element = RotatingImageTrail({ images: [{ src: "a" }, { src: "b" }, { src: "c" }] });
  return {
    document, window, hero, finePointer, reducedMotion, frames, timelines, decodes, layer, element,
    get reads() { return reads; },
    advance(ms) { now += ms; },
    set bounds(value) { bounds = { ...bounds, ...value }; },
    visible(value) { intersection([{ isIntersecting: value }]); },
    move(x, y = 200, pointerType = "mouse") { hero.emit("pointermove", { clientX: x, clientY: y, pointerType }); },
    flush() { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach((callback) => callback()); },
    async decoded({ failFirst = false } = {}) {
      decodes.forEach((decode, index) => failFirst && index === 0 ? decode.reject(new Error("fixture decode failure")) : decode.resolve());
      await Promise.allSettled(decodes.map((decode) => decode.promise));
    },
    destroy() {
      cleanup();
      assert.ok(disconnected);
      assert.equal(frames.size, 0);
      assert.equal(layer.children.length, 0);
      assert.equal(hero.listeners.size, 0);
      assert.equal(window.listeners.size, 0);
      assert.equal(document.listeners.size, 0);
      assert.equal(finePointer.listeners.size, 0);
      assert.equal(reducedMotion.listeners.size, 0);
      assert.ok(timelines.every((timeline) => timeline.killed));
    },
  };
}

test("trail avoids decoding and layout reads on coarse/reduced-motion devices", () => {
  for (const config of [{ fine: false }, { reduced: true }]) {
    const page = mountTrail(config);
    page.visible(true);
    page.move(200);
    assert.equal(page.decodes.length, 0);
    assert.equal(page.reads, 0);
    assert.equal(page.frames.size, 0);
    page.destroy();
  }
});

test("trail deduplicates pending decodes and coalesces burst input into one frame", async () => {
  const page = mountTrail();
  page.visible(true);
  page.visible(true);
  assert.equal(page.decodes.length, 3);
  await page.decoded();
  for (let index = 0; index < 100; index++) page.move(100 + index * 3);
  assert.equal(page.frames.size, 1);
  assert.equal(page.timelines.length, 0);
  page.flush();
  assert.equal(page.reads, 1);
  assert.equal(page.timelines.length, 1);
  assert.deepEqual(page.timelines[0].steps.map((step) => step.duration), [0.4, 0.4, 0.4, 0.3, 0.3, 0.2, 0.5]);
  assert.equal(page.timelines[0].photo.style.opacity, "0");
  assert.equal(page.timelines[0].steps.at(-2).opacity, 1);
  assert.equal(page.timelines[0].steps.at(-1).opacity, 0);
  page.visible(false);
  page.visible(true);
  assert.equal(page.decodes.length, 3, "decoded sources are reused");
  page.destroy();
});

test("trail requires 120px and 700ms together without banking cooldown movement", async () => {
  const page = mountTrail();
  page.visible(true);
  await page.decoded();
  page.move(100);
  page.move(219);
  page.flush();
  assert.equal(page.timelines.length, 0);
  page.move(220);
  page.flush();
  assert.equal(page.timelines.length, 1, "first image has no initial cooldown");

  for (let index = 0; index < 20; index++) {
    page.move(index % 2 ? 100 : 400);
    page.flush();
  }
  assert.equal(page.timelines.length, 1);
  assert.equal(page.frames.size, 0);
  page.advance(699);
  page.move(400);
  page.flush();
  assert.equal(page.timelines.length, 1);
  page.advance(1);
  page.flush();
  assert.equal(page.timelines.length, 1, "cooldown expiry does not create a queued image");
  page.move(450);
  page.flush();
  assert.equal(page.timelines.length, 1);
  page.move(520);
  page.flush();
  assert.equal(page.timelines.length, 2);
  page.destroy();
});

test("trail refreshes its coordinate frame after scrolling without another scroll listener", async () => {
  const page = mountTrail();
  page.visible(true);
  await page.decoded();
  page.move(100);
  page.move(250);
  page.flush();
  assert.equal(page.timelines[0].initial.y, 100);
  page.bounds = { top: -100 };
  page.document.emit("arlete:scene-update");
  page.advance(700);
  page.move(100);
  page.move(250);
  page.flush();
  assert.equal(page.timelines.at(-1).initial.y, 300);
  assert.equal(page.reads, 2);
  assert.equal(page.window.listeners.has("scroll"), false);
  page.destroy();
});

test("trail bounds concurrency, removes completed photos and stops inactive timelines", async () => {
  const page = mountTrail();
  page.visible(true);
  await page.decoded();
  page.move(100);
  for (let index = 0; index < 60; index++) {
    page.advance(700);
    page.move(index % 2 ? 100 : 400);
    page.flush();
    assert.ok(page.layer.children.length <= 3);
  }
  assert.equal(page.layer.children.length, 3);
  page.timelines[0].options.onComplete();
  assert.equal(page.layer.children.length, 2);
  page.visible(false);
  assert.equal(page.layer.children.length, 0);
  assert.ok(page.timelines.every((timeline) => timeline.killed));
  page.destroy();
});

test("trail responds to live capability/tab changes and late decode completion after teardown", async () => {
  const page = mountTrail({ fine: false });
  page.visible(true);
  page.finePointer.matches = true;
  page.finePointer.emit("change");
  assert.equal(page.decodes.length, 3);
  await page.decoded();
  page.move(100); page.move(400); page.flush();
  page.document.hidden = true;
  page.document.emit("visibilitychange");
  assert.equal(page.layer.children.length, 0);
  page.document.hidden = false;
  page.document.emit("visibilitychange");
  page.advance(700);
  page.move(100); page.move(400); page.flush();
  page.reducedMotion.matches = true;
  page.reducedMotion.emit("change");
  assert.equal(page.layer.children.length, 0);
  page.destroy();
  const pending = mountTrail();
  pending.visible(true);
  pending.destroy();
  await pending.decoded();
  assert.equal(pending.timelines.length, 0);
});

test("a failed trail image does not block decoded sources", async () => {
  const page = mountTrail();
  page.visible(true);
  await page.decoded({ failFirst: true });
  page.move(100); page.move(400); page.flush();
  assert.equal(page.layer.children[0].src, "b");
  page.destroy();
});

test("marquee only changes play eligibility and cleans up viewport/tab/preference observers", () => {
  const document = Object.assign(new Events(), { hidden: false });
  const reduced = Object.assign(new Events(), { matches: false });
  let cleanup, intersection, disconnected = false;
  const track = { dataset: {}, style: new Proxy({}, { set() { assert.fail("marquee JS must not reset the CSS animation"); } }) };
  const section = { querySelector: () => track };
  const { BrandsMarquee } = load("features/home/components/BrandsMarquee.tsx", {
    document, matchMedia: () => reduced,
    IntersectionObserver: class { constructor(callback) { intersection = callback; } observe() {} disconnect() { disconnected = true; } },
  }, {
    react: { useRef: () => ({ current: section }), useEffect: (callback) => { cleanup = callback(); } },
    "react/jsx-runtime": jsxRuntime, "next/image": { default: () => null },
  });
  BrandsMarquee();
  assert.equal(track.dataset.running, "false");
  intersection([{ isIntersecting: true }]);
  assert.equal(track.dataset.running, "true");
  intersection([{ isIntersecting: false }]);
  assert.equal(track.dataset.running, "false");
  intersection([{ isIntersecting: true }]);
  assert.equal(track.dataset.running, "true");
  document.hidden = true;
  document.emit("visibilitychange");
  assert.equal(track.dataset.running, "false");
  document.hidden = false;
  document.emit("visibilitychange");
  reduced.matches = true;
  reduced.emit("change");
  assert.equal(track.dataset.running, "false");
  reduced.matches = false;
  reduced.emit("change");
  assert.equal(track.dataset.running, "true");
  cleanup();
  assert.ok(disconnected);
  assert.equal(document.listeners.size, 0);
  assert.equal(reduced.listeners.size, 0);
});
