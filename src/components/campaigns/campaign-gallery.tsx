"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

// Main photo plus thumbnails when a campaign has more than one.
export function CampaignGallery({ images, alt }: { images: string[]; alt: string }) {
  const [current, setCurrent] = useState(0);
  const shown = images[Math.min(current, images.length - 1)];
  return (
    <div>
      <div className="aspect-video overflow-hidden border border-border/50 bg-white">
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={shown} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-varak-primary/10 to-varak-gold/10">
            <Heart className="h-16 w-16 text-varak-primary/30" />
          </div>
        )}
      </div>
      {images.length > 1 && (
        <ul className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {images.map((url, i) => (
            <li key={`${url}-${i}`}>
              <button
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Show photo ${i + 1} of ${images.length}`}
                aria-current={i === current}
                className={`block w-full border-2 ${i === current ? "border-varak-primary" : "border-transparent"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="aspect-[4/3] w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
