import { test } from "node:test";
import assert from "node:assert/strict";
import { ASPECTS, clampOffset, outputSize, rotatedSize, scaleFor } from "./photo-frame.ts";

const base = { imgW: 4000, imgH: 3000, rotation: 0, zoom: 1, frameW: 400, frameH: 300 };

test("a photo with the frame's shape fits exactly and cannot be dragged", () => {
  assert.equal(scaleFor(base), 0.1);
  assert.deepEqual(clampOffset(base, 500, -500), { x: 0, y: 0 });
});

test("a wider photo can be dragged sideways only", () => {
  const f = { ...base, imgW: 6000, imgH: 3000 }; // 2:1 photo in a 4:3 frame
  const c = clampOffset(f, 9999, 9999);
  assert.ok(c.x > 0 && c.y === 0);
  assert.equal(c.x, (6000 * scaleFor(f) - 400) / 2);
});

test("zooming in allows more dragging and never leaves empty edges", () => {
  const f = { ...base, zoom: 2 };
  assert.equal(scaleFor(f), 0.2);
  assert.deepEqual(clampOffset(f, 9999, -9999), { x: 200, y: -150 });
  assert.deepEqual(clampOffset(f, 10, 10), { x: 10, y: 10 });
});

test("rotating a quarter turn swaps the photo's dimensions", () => {
  assert.deepEqual(rotatedSize({ ...base, rotation: 90 }), { w: 3000, h: 4000 });
  assert.deepEqual(rotatedSize({ ...base, rotation: 180 }), { w: 4000, h: 3000 });
  // a portrait photo in a landscape frame can be dragged up and down
  const c = clampOffset({ ...base, rotation: 90 }, 0, 9999);
  assert.ok(c.y > 0 && c.x === 0);
});

test("output is 1600px on the long side in the chosen shape", () => {
  assert.deepEqual(outputSize(ASPECTS["4:3"]), { w: 1600, h: 1200 });
  assert.deepEqual(outputSize(ASPECTS["16:9"]), { w: 1600, h: 900 });
  assert.deepEqual(outputSize(ASPECTS["1:1"]), { w: 1600, h: 1600 });
});
