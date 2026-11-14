import Matter from "matter-js";
import type { ToolAsset } from "./types";

const { Bodies, Body, Composite, Constraint, Engine, Query, Sleeping, Vector, Vertices } = Matter;
const STEP = 1000 / 60;

type Item = {
  body: Matter.Body;
  node: HTMLImageElement;
  asset: ToolAsset;
  width: number;
  height: number;
  offset: Matter.Vector;
};

/** One engine and one demand-driven frame loop; no Matter Runner or GSAP ticker. */
export function createPlayground(stage: HTMLElement, assets: readonly ToolAsset[]) {
  const engine = Engine.create({ enableSleeping: true, positionIterations: 8, velocityIterations: 8 });
  engine.gravity.y = 1.15;
  const nodes = Array.from(stage.querySelectorAll<HTMLImageElement>("[data-tool]"));
  const items: Item[] = [];
  let width = stage.clientWidth;
  let height = stage.clientHeight;
  let walls: Matter.Body[] = [];
  let visible = false;
  let disposed = false;
  let frame = 0;
  let previous = 0;
  let accumulator = 0;
  let elapsed = 0;
  let next = 0;
  let active: { id: number; body: Matter.Body; constraint: Matter.Constraint; touch: boolean; y: number } | null = null;
  let samples: { x: number; y: number; time: number }[] = [];

  const scale = () => Math.min(1, Math.max(0.5, width / 1100));
  const paint = () => {
    items.forEach(({ body, node, width: w, height: h, offset }) => {
      node.style.transform = `translate3d(${body.position.x}px,${body.position.y}px,0) rotate(${body.angle}rad) translate(${offset.x - w / 2}px,${offset.y - h / 2}px)`;
    });
  };
  const boundaries = () => {
    walls.forEach((wall) => Composite.remove(engine.world, wall));
    walls = [
      Bodies.rectangle(width / 2, height + 20, width + 200, 64, { isStatic: true, friction: 0.7 }),
      Bodies.rectangle(-40, height / 2 - 400, 80, height + 1600, { isStatic: true }),
      Bodies.rectangle(width + 40, height / 2 - 400, 80, height + 1600, { isStatic: true }),
    ];
    Composite.add(engine.world, walls);
  };
  boundaries();

  const spawn = (index: number) => {
    const asset = assets[index];
    const node = nodes[index];
    if (!node) return;
    const w = asset.width * scale();
    const h = w / asset.aspect;
    const parts = asset.parts.map((polygon) => {
      // Re-hull after decimal rounding so collinear alpha points cannot become concave.
      const vertices = Vertices.hull(polygon.map(({ x, y }) => ({ x: x * w, y: y * h })) as Matter.Vertex[]);
      const center = Vertices.centre(vertices);
      return Bodies.fromVertices(center.x, center.y, [vertices], { friction: 0.55 });
    });
    const body = Body.create({
      parts, label: asset.id, restitution: 0.23, friction: 0.55,
      frictionStatic: 0.8, frictionAir: 0.018, sleepThreshold: 65,
    });
    const offset = { x: w / 2 - body.position.x, y: h / 2 - body.position.y };
    const x = Math.max(w / 2 + 8, Math.min(width - w / 2 - 8, width * (asset.x + (Math.random() - 0.5) * 0.08)));
    Body.setPosition(body, { x, y: -h - 24 });
    Body.setAngle(body, asset.angle + (Math.random() - 0.5) * 0.6);
    Body.setVelocity(body, { x: (Math.random() - 0.5) * 3, y: 0.4 });
    Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.055);
    Composite.add(engine.world, body);
    node.style.width = `${w}px`;
    node.style.height = `${h}px`;
    node.style.opacity = "1";
    items.push({ body, node, asset, width: w, height: h, offset });
    stage.dataset.spawned = String(items.length);
  };

  const pause = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
    accumulator = 0;
    stage.dataset.state = "paused";
  };
  const tick = (now: number) => {
    frame = 0;
    if (!visible || document.hidden || disposed) return;
    accumulator += previous ? Math.min(now - previous, 50) : STEP;
    previous = now;
    while (accumulator >= STEP) {
      if (next < assets.length && elapsed >= next * 420) spawn(next++);
      Engine.update(engine, STEP);
      elapsed += STEP;
      accumulator -= STEP;
    }
    paint();
    if (next === assets.length && !active && items.every(({ body }) => body.isSleeping)) {
      previous = 0;
      stage.dataset.state = "sleeping";
      return;
    }
    frame = requestAnimationFrame(tick);
  };
  const wake = () => {
    if (!disposed && visible && !document.hidden && !frame) {
      stage.dataset.state = "running";
      previous = 0;
      frame = requestAnimationFrame(tick);
    }
  };
  const point = (event: PointerEvent) => {
    const rect = stage.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };
  const release = (throwObject: boolean) => {
    if (!active) return;
    const { body, constraint, id } = active;
    active = null;
    Composite.remove(engine.world, constraint);
    if (stage.hasPointerCapture(id)) stage.releasePointerCapture(id);
    if (throwObject && samples.length > 1) {
      const last = samples[samples.length - 1];
      const first = samples[0];
      // A held-still release should never reuse an old flick.
      const duration = Math.max(16, last.time - first.time);
      if (performance.now() - last.time < 90) {
        const velocity = Vector.mult(Vector.sub(last, first), STEP / duration);
        const speed = Vector.magnitude(velocity);
        Body.setVelocity(body, speed > 24 ? Vector.mult(velocity, 24 / speed) : velocity);
      }
    }
    Sleeping.set(body, false);
    samples = [];
    delete stage.dataset.dragging;
    wake();
  };
  const down = (event: PointerEvent) => {
    if (active || (event.pointerType === "mouse" && event.button !== 0) || !visible) return;
    const position = point(event);
    const body = Query.point(items.map((item) => item.body).reverse(), position)[0];
    if (!body) return;
    Sleeping.set(body, false);
    const constraint = Constraint.create({
      pointA: position, bodyB: body, pointB: Vector.sub(position, body.position),
      stiffness: 0.18, damping: 0.18, length: 0,
    });
    Composite.add(engine.world, constraint);
    active = { id: event.pointerId, body, constraint, touch: event.pointerType === "touch", y: position.y };
    samples = [{ ...position, time: performance.now() }];
    stage.setPointerCapture(event.pointerId);
    stage.dataset.dragging = "true";
    wake();
  };
  const move = (event: PointerEvent) => {
    if (!active || active.id !== event.pointerId) return;
    const position = point(event);
    if (active.touch) position.y = active.y;
    active.constraint.pointA = position;
    Sleeping.set(active.body, false);
    const now = performance.now();
    samples.push({ ...position, time: now });
    samples = samples.filter((sample) => now - sample.time <= 100);
    wake();
  };
  const up = (event: PointerEvent) => { if (active?.id === event.pointerId) release(true); };
  const cancel = (event: PointerEvent) => { if (active?.id === event.pointerId) release(false); };
  const visibility = () => { if (document.hidden) { release(false); pause(); } else wake(); };
  stage.addEventListener("pointerdown", down);
  stage.addEventListener("pointermove", move);
  stage.addEventListener("pointerup", up);
  stage.addEventListener("pointercancel", cancel);
  stage.addEventListener("lostpointercapture", cancel);
  document.addEventListener("visibilitychange", visibility);

  const observer = new ResizeObserver(() => {
    const nextWidth = stage.clientWidth;
    const nextHeight = stage.clientHeight;
    if (!nextWidth || !nextHeight || (nextWidth === width && nextHeight === height)) return;
    release(false);
    const oldWidth = width;
    const oldHeight = height;
    const oldScale = scale();
    width = nextWidth;
    height = nextHeight;
    const ratio = scale() / oldScale;
    boundaries();
    items.forEach((item) => {
      const { body, node } = item;
      Body.scale(body, ratio, ratio);
      item.width *= ratio;
      item.height *= ratio;
      item.offset = Vector.mult(item.offset, ratio);
      Body.setPosition(body, { x: body.position.x * width / oldWidth, y: height - (oldHeight - body.position.y) * ratio });
      const shiftX = Math.max(0, 4 - body.bounds.min.x) - Math.max(0, body.bounds.max.x - width + 4);
      const shiftY = -Math.max(0, body.bounds.max.y - height + 12);
      Body.translate(body, { x: shiftX, y: shiftY });
      Body.setVelocity(body, { x: 0, y: 0 });
      Sleeping.set(body, false);
      node.style.width = `${item.width}px`;
      node.style.height = `${item.height}px`;
    });
    paint();
    wake();
  });
  observer.observe(stage);
  stage.dataset.mode = "physics";
  stage.dataset.spawned = "0";
  nodes.forEach((node) => { node.style.opacity = "0"; });

  return {
    setVisible(value: boolean) {
      visible = value;
      if (value) wake();
      else { release(false); pause(); }
    },
    destroy() {
      disposed = true;
      release(false);
      pause();
      observer.disconnect();
      stage.removeEventListener("pointerdown", down);
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerup", up);
      stage.removeEventListener("pointercancel", cancel);
      stage.removeEventListener("lostpointercapture", cancel);
      document.removeEventListener("visibilitychange", visibility);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      nodes.forEach((node) => { node.style.removeProperty("transform"); node.style.removeProperty("width"); node.style.removeProperty("height"); node.style.removeProperty("opacity"); });
      delete stage.dataset.mode;
      delete stage.dataset.state;
      delete stage.dataset.spawned;
    },
  };
}
