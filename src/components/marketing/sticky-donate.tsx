"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

// Mobile-only donate bar, shown once the hero has scrolled out of view.
export function StickyDonate() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting));
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  if (!show) return null;
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-white/95 backdrop-blur border-t border-foreground/10">
      <Link
        href="/campaigns"
        className="flex items-center justify-center gap-2 h-12 bg-varak-primary text-white font-semibold text-base"
      >
        <Heart className="h-4 w-4" /> Donate Now
      </Link>
    </div>
  );
}
