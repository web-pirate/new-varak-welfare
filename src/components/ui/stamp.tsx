import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

const stampShadow =
  "drop-shadow(0 1px 1px rgb(15 15 15 / 12%)) drop-shadow(0 12px 22px rgb(15 15 15 / 9%))";

const stampBackground =
  "linear-gradient(145deg, rgb(255 255 255 / 34%), transparent 42%), var(--stamp-paper)";

type StampRootStyle = CSSProperties &
  Partial<Record<"--stamp-ink" | "--stamp-padding" | "--stamp-paper", string>>;

export type StampProps = {
  children: ReactNode;
  "aria-hidden"?: boolean;
  "aria-label"?: string;
  className?: string;
  contentClassName?: string;
  horizontalPerforations?: number;
  ink?: string;
  padding?: number | string;
  paper?: string;
  perforationDepth?: number;
  stampClassName?: string;
  style?: CSSProperties;
  verticalPerforations?: number;
};

const toCssLength = (v: number | string) => (typeof v === "number" ? `${v}px` : v);
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

// Zig-zag polygon around the edge gives the perforated postage-stamp look
function createStampClipPath(depth: number, horizontalCount: number, verticalCount: number) {
  const d = clamp(depth, 0, 10);
  const h = clamp(Math.round(horizontalCount), 4, 32);
  const v = clamp(Math.round(verticalCount), 4, 40);
  const hs = 100 / h;
  const vs = 100 / v;
  const pts: Array<[number, number]> = [[0, 0]];

  for (let i = 0; i < h; i++) {
    const s = i * hs;
    pts.push([s + hs * 0.25, 0], [s + hs * 0.5, d], [s + hs * 0.75, 0], [s + hs, 0]);
  }
  for (let i = 0; i < v; i++) {
    const s = i * vs;
    pts.push([100, s + vs * 0.25], [100 - d, s + vs * 0.5], [100, s + vs * 0.75], [100, s + vs]);
  }
  for (let i = 0; i < h; i++) {
    const s = 100 - i * hs;
    pts.push([s - hs * 0.25, 100], [s - hs * 0.5, 100 - d], [s - hs * 0.75, 100], [s - hs, 100]);
  }
  for (let i = 0; i < v; i++) {
    const s = 100 - i * vs;
    pts.push([0, s - vs * 0.25], [d, s - vs * 0.5], [0, s - vs * 0.75], [0, s - vs]);
  }
  return `polygon(${pts.map(([x, y]) => `${x.toFixed(3)}% ${y.toFixed(3)}%`).join(", ")})`;
}

export function Stamp({
  "aria-hidden": ariaHidden,
  "aria-label": ariaLabel,
  children,
  className,
  contentClassName,
  horizontalPerforations = 12,
  ink = "#181713",
  padding = 13,
  paper = "#ffffff",
  perforationDepth = 2.4,
  stampClassName,
  style,
  verticalPerforations = 15,
}: StampProps) {
  const rootStyle: StampRootStyle = {
    "--stamp-ink": ink,
    "--stamp-padding": toCssLength(padding),
    "--stamp-paper": paper,
    filter: stampShadow,
    ...style,
  };

  return (
    <div className={cn("relative aspect-[4/5] w-[min(100%,14rem)]", className)} style={rootStyle}>
      <article
        aria-hidden={ariaHidden}
        aria-label={ariaHidden ? undefined : ariaLabel}
        className={cn("relative size-full overflow-hidden p-[var(--stamp-padding)] text-[var(--stamp-ink)]", stampClassName)}
        style={{ background: stampBackground, clipPath: createStampClipPath(perforationDepth, horizontalPerforations, verticalPerforations) }}
      >
        <div className={cn("relative size-full min-h-0 min-w-0 overflow-hidden", contentClassName)}>{children}</div>
      </article>
    </div>
  );
}
