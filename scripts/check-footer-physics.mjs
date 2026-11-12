/** Lifecycle regression: node scripts/check-footer-physics.mjs (no browser required). */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
import Matter from 'matter-js';

let nextFrame = 0;
let now = 0;
const frames = new Map();
const documentListeners = new Map();
const stageListeners = new Map();
let disconnected = false;
const globals = {
  document: { hidden: false, addEventListener: (name, fn) => documentListeners.set(name, fn), removeEventListener: (name) => documentListeners.delete(name) },
  performance: { now: () => now },
  ResizeObserver: class { observe() {} disconnect() { disconnected = true; } },
  requestAnimationFrame: (fn) => { frames.set(++nextFrame, fn); return nextFrame; },
  cancelAnimationFrame: (id) => frames.delete(id),
};
function load(relative) {
  const filename = path.resolve(relative);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020 } }).outputText;
  const compiled = { exports: {} };
  vm.runInNewContext(code, { module: compiled, exports: compiled.exports, require: createRequire(filename), ...globals }, { filename });
  return compiled.exports;
}
const { salonTools } = load('shared/ui/gravity-footer/assets.ts');
const { createPlayground } = load('shared/ui/gravity-footer/physics.ts');
const nodes = salonTools.map(() => ({ style: { removeProperty(name) { delete this[name]; } } }));
const stage = {
  clientWidth: 1100, clientHeight: 400, dataset: {},
  querySelectorAll: () => nodes,
  addEventListener: (name, fn) => stageListeners.set(name, fn),
  removeEventListener: (name) => stageListeners.delete(name),
  hasPointerCapture: () => false,
};
const originalCreate = Matter.Engine.create;
let engine;
Matter.Engine.create = (...args) => { engine = originalCreate(...args); return engine; };
try {
  const runtime = createPlayground(stage, salonTools);
  assert.equal(frames.size, 0, 'offscreen initialization schedules no frame');
  runtime.setVisible(true);
  assert.equal(frames.size, 1, 'one loop is scheduled');
  for (let step = 0; step < 3000 && frames.size; step++) {
    const callbacks = [...frames.values()]; frames.clear(); now += 1000 / 60;
    callbacks.forEach((fn) => fn(now));
    assert.ok(frames.size <= 1, 'never duplicate the loop');
  }
  assert.equal(stage.dataset.spawned, '7');
  assert.equal(stage.dataset.state, 'sleeping');
  assert.equal(frames.size, 0, 'all bodies settle and the loop stops');
  assert.equal(engine.world.bodies.length, 10, 'seven tools and three boundaries');
  runtime.setVisible(false);
  assert.equal(frames.size, 0, 'offscreen pause stays stopped');
  runtime.setVisible(true);
  assert.equal(frames.size, 1);
  runtime.destroy();
  assert.equal(frames.size, 0, 'destroy cancels pending RAF');
  assert.equal(stageListeners.size, 0, 'all pointer listeners removed');
  assert.equal(documentListeners.size, 0, 'visibility listener removed');
  assert.equal(engine.world.bodies.length, 0, 'world is cleared');
  assert.equal(engine.world.constraints.length, 0, 'constraints are cleared');
  assert.equal(disconnected, true, 'resize observer disconnected');
  assert.equal(stage.dataset.mode, undefined, 'static composition restored');
  console.log('PASS: staggered physics settles; one loop; pause; complete teardown of RAF, engine, listeners and observer.');
} finally {
  Matter.Engine.create = originalCreate;
}
