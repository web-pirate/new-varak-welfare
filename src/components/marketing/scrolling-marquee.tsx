import Image from "next/image";

/* Marquee images — happy families after cancer treatment */
const marqueeRow1 = [
  "/marquee/1.jpg",
  "/marquee/2.jpg",
  "/marquee/3.jpg",
  "/marquee/4.jpg",
  "/marquee/5.jpg",
];
const marqueeRow2 = [
  "/marquee/6.jpg",
  "/marquee/7.jpg",
  "/marquee/8.jpg",
  "/marquee/9.jpg",
  "/patients/lakshmi.jpg",
];

export function ScrollingMarquee() {
  const row1 = [...marqueeRow1, ...marqueeRow1];
  const row2 = [...marqueeRow2, ...marqueeRow2];

  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.12] lg:opacity-[0.3] z-[1] pointer-events-none">
      <div className="absolute inset-0 flex flex-col justify-center gap-5">
        {/* Row 1 — scrolls left */}
        <div
          className="flex gap-5 w-max animate-marquee-left"
        >
          {row1.map((src, i) => (
            <div
              key={`r1-${i}`}
              className="w-[480px] h-[320px] flex-shrink-0 rounded-xl overflow-hidden"
            >
              <Image
                src={src}
                alt=""
                width={480}
                height={320}
                className="w-full h-full object-cover grayscale"
              />
            </div>
          ))}
        </div>

        {/* Row 2 — scrolls right */}
        <div
          className="flex gap-5 w-max animate-marquee-right"
        >
          {row2.map((src, i) => (
            <div
              key={`r2-${i}`}
              className="w-[480px] h-[320px] flex-shrink-0 rounded-xl overflow-hidden"
            >
              <Image
                src={src}
                alt=""
                width={480}
                height={320}
                className="w-full h-full object-cover grayscale"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
