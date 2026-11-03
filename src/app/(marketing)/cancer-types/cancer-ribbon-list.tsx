"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { defaultSources, posters } from "./cancer-posters";
import { OrganHero } from "./cancer-organs";

type Item = { name: string; color: string; base: string };

const tint = (hex: string, pct: number) => `color-mix(in srgb, ${hex} ${pct}%, white)`;
const isLight = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.299 * r + 0.587 * g + 0.114 * b > 160;
};

export function CancerRibbonList({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<Item | null>(null);
  const poster = open ? posters[open.name] : undefined;

  return (
    <>
      <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-3 max-w-6xl mx-auto">
        {items.map((item) => (
          <li key={item.name}>
            <button
              type="button"
              onClick={() => setOpen(item)}
              className="flex items-center gap-3 text-sm text-left hover:text-varak-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-varak-primary cursor-pointer"
            >
              <span aria-hidden="true" className="h-2.5 w-2.5 flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="font-medium">{item.name}</span>
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[92vh] flex flex-col overflow-hidden rounded-none p-0 gap-0">
          {open && poster && (
            <>
              <div className="h-1.5 flex-shrink-0" style={{ backgroundColor: open.base }} />
              <div className="overflow-y-auto p-6 md:p-9">
                <DialogHeader className="text-left gap-0">
                  <p
                    className="inline-block self-start px-3.5 py-1 text-[13px] font-medium"
                    style={{ backgroundColor: tint(open.base, 20), color: "#2A1E3D" }}
                  >
                    {open.name} awareness
                  </p>
                  <DialogTitle className="mt-3.5 font-heading text-3xl md:text-4xl leading-[1.12] tracking-tight">
                    Know the signs of {open.name.toLowerCase()}
                  </DialogTitle>
                  <DialogDescription className="mt-1.5 text-base leading-relaxed">{poster.lede}</DialogDescription>
                </DialogHeader>

                <div className="my-5 text-foreground">
                  <OrganHero name={open.name} base={open.base} />
                  <p className="mt-2 text-center text-xs text-muted-foreground">Abnormal cells grow out of control</p>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {poster.facts.map(([title, text]) => (
                    <li
                      key={title}
                      className="relative py-4 pl-10 pr-4"
                      style={{ backgroundColor: tint(open.base, 8), border: `0.5px solid ${tint(open.base, 30)}` }}
                    >
                      <span aria-hidden="true" className="absolute left-[18px] top-[22px] h-2.5 w-2.5" style={{ backgroundColor: open.color }} />
                      <strong className="block text-[15px] font-semibold leading-snug">{title}</strong>
                      <span className="mt-1 block text-sm leading-snug text-muted-foreground">{text}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="mt-7 mb-2.5 text-base font-semibold">Warning signs</h3>
                <ul className="flex flex-wrap gap-2">
                  {poster.signs.map((sign) => (
                    <li key={sign} className="border border-border bg-white px-3.5 py-1.5 text-sm font-medium">
                      {sign}
                    </li>
                  ))}
                </ul>

                <div
                  className="mt-6 px-5 py-4 text-center"
                  style={{ backgroundColor: open.base, color: isLight(open.base) ? "#2A1E3D" : "#FFFFFF" }}
                >
                  <p className="text-lg font-semibold leading-snug">{poster.act[0]}</p>
                  <p className="mt-1.5 text-sm opacity-85">{poster.act[1]}</p>
                </div>

                <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
                  Sources:{" "}
                  {(poster.sources ?? defaultSources).map((s, i, a) => (
                    <span key={s.href}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className="underline">
                        {s.label}
                      </a>
                      {i < a.length - 1 ? "; " : ". "}
                    </span>
                  ))}
                  General information, not medical advice.
                </p>
              </div>

              <div className="flex flex-shrink-0 justify-center border-t border-border/50 bg-background px-6 py-4">
                <Button
                  asChild
                  className="w-full sm:w-auto bg-varak-primary hover:bg-varak-primary-dark text-white rounded-none px-10 h-12"
                >
                  <Link href={`/campaigns?cancerType=${slugify(open.name)}`}>
                    <Heart className="mr-2 h-4 w-4" />
                    Donate for {open.name}
                  </Link>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
