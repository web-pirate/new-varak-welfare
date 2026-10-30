# Design system reference

Derived from `src/app/globals.css`, `src/app/layout.tsx`, `components.json` and `src/components/marketing/hero.tsx`. Not an official design doc; re-check the source before relying on exact values.

## Theme: "Warm Terra"
- Brand colour: terracotta `#C2553A` (light `#D47A6A`, dark `#9A3F2E`, warm wash `#DAB5AA`).
- Backgrounds: cream and warm off-white (`#FDF8F3`, near-white oklch with a warm hue). No clinical white or blue.
- Accents: cancer-awareness ribbon colours: pink `#E8618C`, gold `#D4A843`, teal `#2E9E9E`, orange `#E87040`, plus terracotta. Used in `.ribbon-gradient`, `.ribbon-gradient-text`, `.ribbon-bar` and the hero ribbon SVG.
- `--primary` and buttons are near-black warm brown, not terracotta. Terracotta is for brand moments, text gradients and the selection highlight.
- A full dark theme exists (`.dark`), in warm dark browns.

## Design system
- shadcn/ui (`new-york` style, `stone` base colour, CSS variables) on Tailwind v4, Radix primitives, Lucide icons.
- Colours are defined in oklch.
- `--radius: 0px`: everything has sharp, square corners. This is deliberate; don't add rounded corners.
- Type: JetBrains Mono only, loaded as `--font-sans` (`--font-heading` aliases it). Headings use `letter-spacing: -0.02em`.

## Methodology and ideology
- Emotional, trust-first: warm palette, ribbon motif, tagline "Every Life Deserves a Fighting Chance". Marketing sections use impact counters, a live donation ticker, success stories and a funding calculator.
- Motion: framer-motion for animated counters and scroll parallax. CSS keyframes for float, shimmer, marquee, ticker and pulse-dot.
- Texture: grain overlay (`.grain-overlay`), blurred ambient orbs (`.ambient-orb`), gradient section dividers.
- Structure: `src/components/ui` holds shadcn primitives. Feature components live in `marketing/`, `campaigns/`, `dashboard/`, `forms/` and `layout/`. Routes are grouped as `(marketing)` and `dashboard/` (admin and fundraiser areas).

## Open questions
- Body copy in a monospace face may hurt long-form readability.
- Reduced-motion handling and contrast ratios of the animated gradients are unchecked.
- Campaign and dashboard UIs were not reviewed.
