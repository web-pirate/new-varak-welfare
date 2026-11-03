// Geometry for the photo adjust tool (zoom, drag, rotate). Pure maths, so it is shared by the editor and `node --test`.

export const ASPECTS = { "4:3": 4 / 3, "16:9": 16 / 9, "1:1": 1 } as const;
export type AspectKey = keyof typeof ASPECTS;

export type Frame = {
  imgW: number;
  imgH: number;
  rotation: 0 | 90 | 180 | 270;
  zoom: number; // 1 = the photo just covers the frame
  frameW: number;
  frameH: number;
};

/** The photo's size once rotated. */
export const rotatedSize = (f: Pick<Frame, "imgW" | "imgH" | "rotation">) =>
  f.rotation % 180 === 0 ? { w: f.imgW, h: f.imgH } : { w: f.imgH, h: f.imgW };

/** Scale at which the rotated photo exactly covers the frame, times the zoom. */
export function scaleFor(f: Frame): number {
  const { w, h } = rotatedSize(f);
  return Math.max(f.frameW / w, f.frameH / h) * f.zoom;
}

/** Keeps the frame fully covered by the photo: no empty bars at the edges. */
export function clampOffset(f: Frame, offX: number, offY: number) {
  const { w, h } = rotatedSize(f);
  const s = scaleFor(f);
  const maxX = Math.max(0, (w * s - f.frameW) / 2);
  const maxY = Math.max(0, (h * s - f.frameH) / 2);
  // `+ 0` turns a negative zero into 0
  return { x: Math.min(maxX, Math.max(-maxX, offX)) + 0, y: Math.min(maxY, Math.max(-maxY, offY)) + 0 };
}

/** Output size: the long side is 1600px, in the chosen shape. */
export function outputSize(aspect: number, longSide = 1600) {
  return aspect >= 1 ? { w: longSide, h: Math.round(longSide / aspect) } : { w: Math.round(longSide * aspect), h: longSide };
}
