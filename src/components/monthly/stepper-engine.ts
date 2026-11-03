/* eslint-disable */
// @ts-nocheck
// shortcut: ported imperative DOM/SVG code kept untyped, type it if this grows beyond the stepper.

const MIN = 100, STEP = 100, SHARE = 0.8;
const SUGGESTED = 300; // the intro walks the story up to this amount
const LAST_STAGE = 1000; // the bedside is complete here; the gift can keep going up
const STEPS = (LAST_STAGE - MIN) / STEP + 1;
const REST_TILT = -14; // degrees: her head rests back into the pillow, and straightens as she sits up

// What she is going through, and what the gift brings to her bedside
const STORY = [
  ["She has just been told she has cancer. Tonight, she lies awake, alone.", "Your gift gives her a clean, safe bed at the care centre."],
  ["The medicines she couldn't afford are by her bed.", "Essential medicines help manage her pain and the side effects of treatment."],
  ["Her treatment can finally begin.", "Drips, syringes and supplies are ready the moment her doctors need them."],
  ["For the first time in weeks, she eats a proper meal.", "Fresh fruit and nutritious food help her body cope with treatment."],
  ["Through the night, a monitor watches over her.", "Equipment helps nurses spot problems early and keep her safe."],
  ["A nurse checks on her, and stays to talk.", "Trained nurses care for her day and night."],
  ["Her daughter visits with flowers and a drawing.", "Help with travel and a family stay room keeps her loved ones close."],
  ["A physiotherapist helps her stretch, then stand.", "Physiotherapy rebuilds her strength between treatments, so she can walk again."],
  ["Tonight, for the first time, she sleeps through.", "Counselling and emotional support for her and her family, because healing isn't only physical."],
  ["She sits up, smiles, and feels less alone.", "A whole community stands with her, because people like you chose to give."],
];
const STORY_BEYOND = ["You're helping more patients like her.", "Every extra rupee goes further for people facing cancer."];

const NS = "http://www.w3.org/2000/svg";
const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 0 });
const grp = new Intl.NumberFormat("en-IN");
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const progressFor = (a) => Math.min(1, (a - MIN) / (LAST_STAGE - MIN));
const stageOf = (a) => Math.min(STEPS - 1, Math.round((a - MIN) / STEP));
const stageText = (a) => (a >= LAST_STAGE ? `all ${STEPS} stages reached` : `stage ${stageOf(a) + 1} of ${STEPS}`);
const S = (k) => k / (STEPS - 1);
const storyFor = (a) => (a > LAST_STAGE ? STORY_BEYOND : STORY[stageOf(a)]);

/* ---------- Colour: a cold night ward that warms into morning ---------- */
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => {
  const A = hex(a), B = hex(b);
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join("");
};
const PALETTE = {
  wall: ["#A9A8BA", "#F2E8DB"], wainscot: ["#9897AC", "#E5D7C4"], rail: ["#8B8AA0", "#D3C2AC"],
  floor: ["#7E7B8E", "#D9C9B1"], baseboard: ["#6F6C80", "#C7B49A"], blanket: ["#9FA4B3", "#E3A895"], winCity: ["#2A2F4D", "#B8CBDA"],
};
const LINES = ["#716E82", "#CDBCA2"];
const WIN = { top: ["#1D2546", "#9FD3EE"], bot: ["#3B3F66", "#E6F4FA"] };

/* ---------- Artwork (simple vector shapes) ---------- */
let blinkSeed = 0;
function lipShapes(sm) {
  const cy = 0.515 - 0.025 * sm, ml = 0.525 + 0.03 * sm, c = 2 * ml - cy;
  return {
    upper: `M-.2 ${cy} Q-.1 .468 -.035 .488 Q0 .474 .035 .488 Q.1 .468 .2 ${cy} Q0 ${c} -.2 ${cy}Z`,
    lower: `M-.17 ${cy + 0.012} Q0 ${ml + 0.12} .17 ${cy + 0.012} Q0 ${c} -.17 ${cy + 0.012}Z`,
    line: `M-.2 ${cy} Q0 ${c} .2 ${cy}`,
  };
}
function face({ skin, hair, style, smile = 0.6, gaze = [0, 0] }) {
  const shade = mix(skin, "#000000", 0.2), light = mix(skin, "#ffffff", 0.22);
  const lip = mix(skin, "#B5524F", 0.5), brow = mix(hair, "#000000", 0.1);
  const delay = (-1.9 * ++blinkSeed).toFixed(1);
  const [gx, gy] = [gaze[0] * 0.05, gaze[1] * 0.03];
  const L = lipShapes(smile);
  let f = style === "bun" ? `<circle cx=".2" cy="-1.12" r=".5" fill="${hair}"/>` : "";
  f += `<path d="M-.72 -.12 C-.88 -.18 -.92 .12 -.8 .27 C-.74 .34 -.67 .3 -.66 .22Z M.72 -.12 C.88 -.18 .92 .12 .8 .27 C.74 .34 .67 .3 .66 .22Z" fill="${shade}"/>
    <path d="M-.74 -.2 C-.76 -.7 -.42 -1 0 -1 C.42 -1 .76 -.7 .74 -.2 C.73 .2 .62 .55 .42 .78 C.28 .93 .12 .99 0 .99 C-.12 .99 -.28 .93 -.42 .78 C-.62 .55 -.73 .2 -.74 -.2Z" fill="${skin}"/>
    <path d="M.74 -.2 C.73 .2 .62 .55 .42 .78 C.28 .93 .12 .99 0 .99 C.22 .88 .44 .66 .53 .4 C.61 .16 .62 -.12 .57 -.42 C.67 -.36 .75 -.3 .74 -.2Z" fill="${shade}" opacity=".45"/>
    <ellipse cx="-.34" cy=".2" rx=".18" ry=".1" fill="${light}" opacity=".45"/>
    <g fill="#E8919E" opacity=".3"><ellipse cx="-.42" cy=".27" rx=".14" ry=".08"/><ellipse cx=".42" cy=".27" rx=".14" ry=".08"/></g>
    <g fill="#FBF7F2"><path d="M-.45 .005 Q-.38 -.075 -.3 -.077 Q-.21 -.072 -.155 .005 Q-.23 .062 -.3 .062 Q-.38 .06 -.45 .005Z"/><path d="M.45 .005 Q.38 -.075 .3 -.077 Q.21 -.072 .155 .005 Q.23 .062 .3 .062 Q.38 .06 .45 .005Z"/></g>
    <g transform="translate(${gx} ${gy})"><circle cx="-.3" cy="0" r=".058" fill="#3A2416"/><circle cx=".3" cy="0" r=".058" fill="#3A2416"/>
      <circle cx="-.3" cy="0" r=".027" fill="#120A06"/><circle cx=".3" cy="0" r=".027" fill="#120A06"/>
      <circle cx="-.28" cy="-.02" r=".015" fill="#fff"/><circle cx=".32" cy="-.02" r=".015" fill="#fff"/></g>
    <path d="M-.46 .006 Q-.38 -.085 -.3 -.088 Q-.2 -.083 -.145 .002 M.46 .006 Q.38 -.085 .3 -.088 Q.2 -.083 .145 .002" fill="none" stroke="#1E120C" stroke-width=".03" stroke-linecap="round"/>
    <g fill="${skin}"><ellipse class="blink" style="animation-delay:${delay}s" cx="-.3" cy="-.012" rx=".18" ry=".088"/><ellipse class="blink" style="animation-delay:${delay}s" cx=".3" cy="-.012" rx=".18" ry=".088"/></g>
    <path d="M-.48 -.165 Q-.34 -.255 -.13 -.215 L-.13 -.185 Q-.33 -.215 -.48 -.155Z M.48 -.165 Q.34 -.255 .13 -.215 L.13 -.185 Q.33 -.215 .48 -.155Z" fill="${brow}"/>
    <path d="M-.02 -.05 Q-.01 .1 0 .22" fill="none" stroke="${light}" stroke-width=".025" opacity=".5"/>
    <path d="M.07 -.08 Q.12 .1 .12 .24" fill="none" stroke="${shade}" stroke-width=".022" opacity=".55"/>
    <path d="M-.1 .24 Q-.15 .29 -.1 .325 M.1 .24 Q.15 .29 .1 .325 M-.06 .33 Q0 .355 .06 .33" fill="none" stroke="${shade}" stroke-width=".02" stroke-linecap="round"/>
    <path d="${L.upper}" fill="${mix(lip, "#000000", 0.12)}"/><path d="${L.lower}" fill="${lip}"/>
    <path d="${L.line}" fill="none" stroke="${mix(lip, "#000000", 0.35)}" stroke-width=".02" stroke-linecap="round"/>`;
  if (style === "bun") f += `<path d="M-.8 -.05 C-.9 -.78 -.48 -1.12 0 -1.12 C.5 -1.12 .9 -.78 .8 -.05 C.74 -.34 .62 -.56 .4 -.64 Q.16 -.58 -.06 -.66 Q-.38 -.62 -.6 -.48 Q-.74 -.32 -.8 -.05Z" fill="${hair}"/>`;
  if (style === "braids") f += `<path d="M-.8 0 C-.9 -.78 -.48 -1.12 0 -1.12 C.48 -1.12 .9 -.78 .8 0 C.74 -.3 .6 -.56 .04 -.66 L0 -.6 L-.04 -.66 C-.6 -.56 -.74 -.3 -.8 0Z" fill="${hair}"/>`;
  return f;
}

// Adult, 7.5 heads tall: 100 units from the soles (y 0) to the crown (y -100)
function adult({ skin, hair, top, pants, gaze }) {
  const shade = mix(skin, "#000000", 0.22);
  return `<ellipse cx="0" cy="0" rx="13" ry="1.6" fill="#1d1a2a" opacity=".14"/>
    <path d="M-9.4 -52 L-8.6 -3.4 L-2.4 -3.4 L-.8 -45 L.8 -45 L2.4 -3.4 L8.6 -3.4 L9.4 -52Z" fill="${pants}"/>
    <ellipse cx="-5.4" cy="-1.6" rx="4.2" ry="1.8" fill="#2E2A33"/><ellipse cx="5.4" cy="-1.6" rx="4.2" ry="1.8" fill="#2E2A33"/>
    <path d="M-2.9 -88.5 L-3.1 -82 Q0 -80.6 3.1 -82 L2.9 -88.5Z" fill="${skin}"/>
    <path d="M-2.9 -87 Q0 -84.6 2.9 -87 L2.9 -85 Q0 -83.2 -2.9 -85Z" fill="${shade}" opacity=".55"/>
    <path d="M-11.8 -80.6 Q-12.6 -70 -10.6 -62 L-10.4 -49 L10.4 -49 L10.6 -62 Q12.6 -70 11.8 -80.6 Q6 -83.4 0 -82.8 Q-6 -83.4 -11.8 -80.6Z" fill="${top}"/>
    <path d="M-3.4 -82.7 L0 -76.4 L3.4 -82.7 Q0 -82.1 -3.4 -82.7Z" fill="${skin}"/>
    <path d="M-12.4 -80.8 Q-13.6 -70 -12.6 -42 L-12 -24 L-3.4 -24 L-3.8 -60 L-4.4 -79.4 Q-8.4 -82 -12.4 -80.8Z" fill="#F7F7F4"/>
    <path d="M12.4 -80.8 Q13.6 -70 12.6 -42 L12 -24 L3.4 -24 L3.8 -60 L4.4 -79.4 Q8.4 -82 12.4 -80.8Z" fill="#F7F7F4"/>
    <rect x="6.2" y="-72.5" width="3.4" height="4.6" rx=".5" fill="#fff" stroke="#DAB5AA" stroke-width=".35"/><rect x="6.6" y="-71.4" width="2.6" height=".8" fill="#C2553A"/>
    <path d="M-3.6 -82.2 Q-5.4 -73 -2.8 -67.6 M3.6 -82.2 Q5.4 -73 2.8 -67.6 M-2.8 -67.6 Q0 -65.6 2.8 -67.6" stroke="#3B4B55" stroke-width=".6" fill="none" stroke-linecap="round"/>
    <path d="M10.8 -80.4 Q14.8 -79.6 15.2 -72 L15.6 -50 L11.6 -49.4 L11.2 -70Z" fill="#F7F7F4"/>
    <path d="M11.8 -49.8 Q11.2 -45 12.6 -42 Q14.4 -41.2 15.4 -43.4 Q15.8 -47 15.4 -50Z" fill="${skin}"/>
    <path d="M-10.8 -80.4 Q-14.8 -79.6 -15.2 -72 L-15.2 -62.6 L-11.2 -60.6 L-11.2 -70Z" fill="#F7F7F4"/>
    <g transform="rotate(-10 -4 -68)"><rect x="-10" y="-78" width="10.5" height="13.5" rx=".7" fill="#C8B59A"/><rect x="-9" y="-76" width="8.5" height="10.6" fill="#fff"/><path d="M-8 -73.4 H-2 M-8 -71.4 H-3 M-8 -69.4 H-2.6" stroke="#DAB5AA" stroke-width=".4"/></g>
    <path d="M-15.2 -63 Q-13.8 -59 -10.8 -60.4 L-4 -64.2 L-5.4 -68.4Z" fill="#F7F7F4"/>
    <path d="M-5.8 -68.2 Q-2.6 -69.8 -1.8 -67.4 Q-1.6 -65 -4 -64.2Z" fill="${skin}"/>
    <g transform="translate(0 -93.4) scale(6.65)">${face({ skin, hair, style: "bun", smile: 0.7, gaze })}</g>`;
}

// Child of about seven, 6 heads tall, reaching out with her left hand
function child({ skin, hair, dress, leggings, reach = [-26, -81], gaze }) {
  const [hx, hy] = reach;
  const trim = mix(dress, "#ffffff", 0.45);
  return `<ellipse cx="0" cy="0" rx="10" ry="1.5" fill="#1d1a2a" opacity=".14"/>
    <path d="M-7.6 -96 Q-9.4 -84 -8.6 -73 Q-4 -71.4 0 -71.8 Q4 -71.4 8.6 -73 Q9.4 -84 7.6 -96Z" fill="${hair}"/>
    <path d="M-6.4 -36 L-5.8 -4 L-1.4 -4 L-.6 -34 L.6 -34 L1.4 -4 L5.8 -4 L6.4 -36Z" fill="${leggings}"/>
    <ellipse cx="-3.8" cy="-2" rx="3.2" ry="1.6" fill="#B04A6A"/><ellipse cx="3.8" cy="-2" rx="3.2" ry="1.6" fill="#B04A6A"/>
    <path d="M-2.2 -84.5 L-2.4 -78.5 Q0 -77.6 2.4 -78.5 L2.2 -84.5Z" fill="${skin}"/>
    <path d="M-9 -78.4 Q-10.2 -66 -9.4 -58 Q-11.4 -44 -12 -31 Q0 -28.6 12 -31 Q11.4 -44 9.4 -58 Q10.2 -66 9 -78.4 Q4.6 -80.2 0 -79.8 Q-4.6 -80.2 -9 -78.4Z" fill="${dress}"/>
    <path d="M-3 -79.6 Q0 -75.6 3 -79.6" fill="none" stroke="${trim}" stroke-width=".6"/>
    <path d="M-11.6 -34 Q0 -31.4 11.6 -34" stroke="${trim}" stroke-width="1.1" fill="none"/>
    <path d="M8.6 -78 Q11.8 -77 12 -71.6 L12.2 -68.4 L9 -68 L8.8 -72Z" fill="${dress}"/>
    <path d="M10.6 -68.4 L11 -52" stroke="${skin}" stroke-width="2.9" stroke-linecap="round"/>
    <path d="M8.6 -48 L13.6 -48 L15.8 -57 L10.6 -57.6Z" fill="#FFF5E6"/>
    <path d="M12 -56 L13.4 -63 M13 -56 L16.8 -61 M14 -56 L18.6 -57.6" stroke="#4E8A3E" stroke-width=".6"/>
    <circle cx="13.2" cy="-63.6" r="2" fill="#E78FB3"/><circle cx="17" cy="-61.4" r="1.8" fill="#F4CF4F"/><circle cx="18.8" cy="-57.6" r="1.7" fill="#B79BE0"/>
    <ellipse cx="11" cy="-50.4" rx="1.9" ry="2.3" fill="${skin}"/>
    <path d="M-8.6 -78 Q-11.8 -77 -12.4 -73 L-13.6 -70.4 L-10.4 -68.8 L-9.2 -72Z" fill="${dress}"/>
    <path d="M-12 -69.6 L-17.2 -66.4 L${hx + 1.2} ${hy + 1.8}" fill="none" stroke="${skin}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
    <ellipse cx="${hx}" cy="${hy}" rx="2.1" ry="2.5" fill="${skin}" transform="rotate(30 ${hx} ${hy})"/>
    <g transform="translate(0 -91.75) scale(8.25)">${face({ skin, hair, style: "braids", smile: 1, gaze })}</g>
    <path d="M-6.2 -88 Q-8.4 -80 -7.4 -72 M6.2 -88 Q8.4 -80 7.4 -72" fill="none" stroke="${hair}" stroke-width="2.6" stroke-linecap="round"/>
    <circle cx="-7.4" cy="-71" r="1.2" fill="#E78FB3"/><circle cx="7.4" cy="-71" r="1.2" fill="#E78FB3"/>`;
}

const chairArt = `<ellipse cx="0" cy="0" rx="18" ry="3" fill="#1d1a2a" opacity=".14"/>
  <circle cx="2" cy="-13" r="13" fill="none" stroke="#3E4A52" stroke-width="2.4"/>
  <path d="M2 -26 V0 M-11 -13 H15" stroke="#3E4A52" stroke-width=".8"/><circle cx="2" cy="-13" r="2.2" fill="#3E4A52"/><circle cx="-15" cy="-3" r="3" fill="#3E4A52"/>
  <path d="M-15 -3 L-14 -22 M-17 -24 L8 -24 L11 -44 L15 -44 M-21 -8 H-13" stroke="#3E4A52" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <rect x="-17" y="-28" width="25" height="5" rx="2" fill="#C2553A"/><path d="M7 -27 L10 -42" stroke="#C2553A" stroke-width="5" stroke-linecap="round"/>`;

const MEDS = [
  `<rect x="214" y="280" width="13" height="18" rx="2.5" fill="#E8913A"/><rect x="213" y="276" width="15" height="6" rx="1.5" fill="#fff"/><rect x="216" y="286" width="9" height="7" fill="#FFF4E2"/>`,
  `<rect x="231" y="283" width="11" height="15" rx="2.5" fill="#F4F6F8" stroke="#C9CFD6"/><rect x="232" y="279" width="9" height="5" rx="1.5" fill="#C2553A"/><rect x="233" y="288" width="7" height="5" fill="#DAB5AA"/>`,
  `<rect x="245" y="292" width="19" height="6" rx="1" fill="#D9DEE6" stroke="#AEB6C2" stroke-width=".8"/><g fill="#fff" stroke="#AEB6C2" stroke-width=".5"><circle cx="249" cy="295" r="1.4"/><circle cx="254.5" cy="295" r="1.4"/><circle cx="260" cy="295" r="1.4"/></g>`,
  `<path d="M266 280 L277 280 L275.5 298 L267.5 298Z" fill="#DDEFF8" stroke="#A9C4D6"/><path d="M267 287 L276 287 L275.5 297.5 L267.6 297.5Z" fill="#A9D3EC" opacity=".7"/>`,
];
const ivArt = `<path d="M276 424 H300 M288 424 V416" stroke="#8A93A0" stroke-width="3" stroke-linecap="round"/>
  <circle cx="277" cy="427" r="3.4" fill="#3B4250"/><circle cx="299" cy="427" r="3.4" fill="#3B4250"/>
  <rect x="286.5" y="96" width="3" height="322" fill="#AEB6C2"/><path d="M276 98 H300" stroke="#AEB6C2" stroke-width="3" stroke-linecap="round"/>
  <path d="M276 100 Q274 104 276 108 L276 148 Q276 154 282 154 L294 154 Q300 154 300 148 L300 108 Q302 104 300 100Z" fill="#E3F1F8" stroke="#A9BCCB" stroke-width="1.4"/>
  <rect x="278" y="120" width="20" height="32" rx="4" fill="#BFE0F0" opacity=".8"/><rect x="281" y="110" width="14" height="8" rx="1.5" fill="#fff" stroke="#DAB5AA"/>
  <rect x="285" y="156" width="6" height="14" rx="2" fill="#E3F1F8" stroke="#A9BCCB"/><circle class="drip" cx="288" cy="159" r="1.4" fill="#7FB5C9"/>
  <path id="ivTube" d="M288 170 C296 250 380 250 436 294" stroke="#CFE3EE" stroke-width="2.2" fill="none"/>`;
const monitorArt = `<rect x="354" y="54" width="24" height="8" rx="2" fill="#B9C0CA"/><rect x="362" y="60" width="8" height="24" fill="#9AA3B0"/>
  <rect x="318" y="82" width="96" height="62" rx="7" fill="#2B3340"/><rect x="324" y="88" width="84" height="44" rx="3" fill="#0F1A22"/>
  <path class="ecg" pathLength="100" d="M326 112 H338 L342 106 L346 112 H352 L355 96 L359 122 L363 112 H372 L376 106 L380 112 H386 L389 96 L393 122 L397 112 H406" fill="none" stroke="#62E3A8" stroke-width="1.8" stroke-linejoin="round"/>
  <text x="405" y="128" font-size="8" font-weight="600" fill="#62E3A8" text-anchor="end" font-family="monospace">♥ 72</text>
  <circle cx="328" cy="138" r="2" fill="#62E3A8"/><rect x="334" y="136.5" width="22" height="3" rx="1.5" fill="#4B5563"/>`;
const drawingArt = `<g transform="rotate(-4 467 74)"><rect x="440" y="52" width="56" height="44" fill="#FFFDF6" stroke="#E5DED0"/><rect x="461" y="48" width="14" height="7" fill="#F4E7B8" opacity=".9"/>
  <circle cx="486" cy="61" r="5" fill="#F4CF4F"/><path d="M447 89 V75 L457 67 L467 75 V89Z" fill="none" stroke="#E07A5F" stroke-width="1.6" stroke-linejoin="round"/>
  <g fill="none" stroke="#C2553A" stroke-width="1.4" stroke-linecap="round"><circle cx="476" cy="74" r="3"/><path d="M476 77 V85 M472 80 H480 M476 85 L473 90 M476 85 L479 90"/><circle cx="487" cy="79" r="2.2"/><path d="M487 81 V86 M484.5 83 H489.5 M487 86 L485 89 M487 86 L489 89"/></g>
  <path d="M452 61 c-2 -3 -6 -1 -4 2 l4 4 l4 -4 c2 -3 -2 -5 -4 -2z" fill="#E7739F"/></g>`;
const chartArt = `<g transform="rotate(3 552 77)"><rect x="524" y="54" width="56" height="46" fill="#FFFDF6" stroke="#E5DED0"/><rect x="545" y="50" width="14" height="7" fill="#F4E7B8" opacity=".9"/>
  <g fill="none" stroke="#C2553A" stroke-width="1.5" stroke-linecap="round"><circle cx="538" cy="68" r="3"/><path d="M538 71 V80 M538 74 L533 78 M538 74 L544 77 M538 80 L534 88 M538 80 L543 87"/></g>
  <g fill="none" stroke="#4E8A3E" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M553 64 l3 3 l6 -6"/><path d="M553 76 l3 3 l6 -6"/><path d="M553 88 l3 3 l6 -6"/></g></g>`;
const clockArt = `<circle cx="296" cy="64" r="16" fill="#FFFDF6" stroke="#B9C0CA" stroke-width="2.6"/>
  <path d="M296 51.5 V54 M296 76 V78.5 M283.5 64 H286 M306 64 H308.5" stroke="#6B6F78" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M296 64 V54" stroke="#3B4250" stroke-width="1.8" stroke-linecap="round"/><path d="M296 64 L290.5 68" stroke="#3B4250" stroke-width="2.2" stroke-linecap="round"/>`;
const vaseArt = `<path d="M106 236 L120 236 L122 222 Q113 215 104 222Z" fill="#7FB5C9"/><path d="M110 220 L106 202 M113 219 L114 198 M116 220 L122 204" stroke="#4E8A3E" stroke-width="1.4" fill="none"/>
  <circle cx="106" cy="201" r="4" fill="#E78FB3"/><circle cx="114" cy="196" r="4.4" fill="#F4CF4F"/><circle cx="122" cy="203" r="4" fill="#B79BE0"/>`;
const plantArt = `<path d="M24 440 L56 440 L60 412 L20 412Z" fill="#C77D52"/><rect x="18" y="408" width="44" height="6" rx="2" fill="#B56C44"/>
  <g fill="#5A9A5F"><ellipse cx="30" cy="390" rx="7" ry="18" transform="rotate(-20 30 390)"/><ellipse cx="50" cy="390" rx="7" ry="18" transform="rotate(20 50 390)"/></g>
  <g fill="#6BA653"><ellipse cx="40" cy="382" rx="7" ry="22"/><ellipse cx="22" cy="400" rx="5" ry="12" transform="rotate(-48 22 400)"/><ellipse cx="58" cy="400" rx="5" ry="12" transform="rotate(48 58 400)"/></g>`;
const balloonsArt = `<g class="bob"><path d="M668 218 Q664 240 657 262 M700 208 Q682 236 657 262 M686 241 Q672 252 657 262" stroke="#8D969B" stroke-width="1.2" fill="none"/>
  <ellipse cx="668" cy="196" rx="16" ry="20" fill="#B79BE0"/><path d="M665 216 h6 l-3 4z" fill="#B79BE0"/>
  <ellipse cx="700" cy="186" rx="16" ry="20" fill="#E78FB3"/><path d="M697 206 h6 l-3 4z" fill="#E78FB3"/>
  <ellipse cx="686" cy="222" rx="14" ry="17" fill="#F4CF4F"/><path d="M683 239 h6 l-3 4z" fill="#F4CF4F"/></g>`;
const overbedArt = `<rect x="606" y="262" width="8" height="158" fill="#9AA3B0"/><rect x="574" y="416" width="74" height="6" rx="3" fill="#8A93A0"/>
  <circle cx="580" cy="426" r="5" fill="#3B4250"/><circle cx="642" cy="426" r="5" fill="#3B4250"/>
  <rect x="466" y="254" width="156" height="9" rx="3" fill="#C8B59A"/><rect x="470" y="263" width="148" height="3" fill="#B49E80"/>
  <g class="fruit" style="--i:0"><g fill="#7A4FB5"><circle cx="472" cy="250" r="2.7"/><circle cx="477.5" cy="250" r="2.7"/><circle cx="483" cy="250" r="2.7"/><circle cx="474.8" cy="245.5" r="2.7"/><circle cx="480.3" cy="245.5" r="2.7"/><circle cx="477.5" cy="241" r="2.7"/></g></g>
  <g class="fruit" style="--i:1"><ellipse cx="508" cy="252" rx="22" ry="4.6" fill="#C7CDD3" stroke="#A3AAB2"/><ellipse cx="500" cy="249.5" rx="9.5" ry="3" fill="#E3B873"/><path d="M509 246.5 h14 q-1 6.5 -7 6.5 q-6 0 -7 -6.5z" fill="#B9C0C6"/><ellipse cx="516" cy="246.5" rx="7" ry="1.8" fill="#E8B53A"/></g>
  <g class="fruit" style="--i:2"><path d="M534 251 q11 7 24 -4 q-1 -1.5 -2 -1 q-10 6 -21 2z" fill="#F2CF4A" stroke="#C9A12E" stroke-width=".8"/></g>
  <g class="fruit" style="--i:3"><circle cx="566" cy="247" r="6.5" fill="#D9483B"/><path d="M566 241 q1 -3 3 -4" stroke="#6B4A2F" stroke-width="1.2" fill="none"/><path d="M567 240 q4 -3 6 0 q-3 2 -6 0z" fill="#5A9A5F"/></g>
  <g class="fruit" style="--i:4"><circle cx="580" cy="248" r="6" fill="#F39A2B"/><circle cx="590" cy="250" r="5" fill="#F7A93E"/></g>
  <g class="fruit" style="--i:5"><path d="M601 236 L612 236 L610.5 254 L602.5 254Z" fill="#fff" stroke="#C9CFD6"/><path d="M601.6 241 L611.4 241 L610.5 253.5 L602.5 253.5Z" fill="#F6F1E6"/></g>`;

// [layer id, x, y, scale, entrance, threshold, art or {kind opts}]
const ACTORS = [
  ...MEDS.map((m) => ["tableLayer", 0, 0, 1, "grow", S(1), m]),
  ["ivLayer", 0, 0, 1, "grow", S(2), ivArt],
  ["wallLayer", 0, 0, 1, "grow pop", S(4), monitorArt],
  ["wallLayer", 0, 0, 1, "grow pop", S(6), drawingArt],
  ["wallLayer", 0, 0, 1, "grow pop", S(7), chartArt],
  ["wallLayer", 0, 0, 1, "grow pop", S(8), clockArt],
  ["wallLayer", 0, 0, 1, "grow", S(9), vaseArt],
  ["behindLayer", 530, 414, 2.85, "walk", S(5), () => adult({ top: "#2E9E9E", pants: "#3D4F55", skin: "#8D5A3B", hair: "#1C1C1C", gaze: [-0.8, 0.5] }), "18px"],
  ["frontLayer", 0, 0, 1, "drive", S(3), overbedArt, "380px"],
  ["frontLayer", 730, 432, 3, "walk", S(5), chairArt, "60px"],
  ["frontLayer", 500, 458, 1.95, "walk", S(6), () => child({ skin: "#E3B48C", hair: "#2B1E16", dress: "#F2A65A", leggings: "#2E9E9E", gaze: [-0.9, -0.4] }), "-24px"],
  ["frontLayer", 0, 0, 1, "float", S(9), balloonsArt],
  ["frontLayer", 0, 0, 1, "grow", S(9), plantArt],
];

// Camera: one framing per stage as [centre x, centre y, width]. Close on her face, widening as help arrives.
const CAM = [[318, 284, 330], [322, 280, 390], [338, 270, 520], [392, 276, 600], [400, 258, 680], [410, 240, 760], [404, 232, 790], [403, 231, 794], [402, 230, 797], [400, 230, 800]];
// Where she looks at each stage
const GAZE = [[-1, 0.5], [-0.9, 0.1], [-0.6, -0.6], [0.9, 0.25], [-0.1, -0.8], [1, -0.35], [0.7, 0.8], [0.9, -0.2], [-0.3, -0.3], [0, 0.1]];
const keyframe = (list, p) => {
  const f = p * (list.length - 1);
  const i = Math.min(list.length - 2, Math.floor(f)), t = f - i;
  return list[i].map((v, j) => v + (list[i + 1][j] - v) * t);
};

/**
 * Mounts the stepper into an element that already contains STEPPER_HTML.
 * onDonate(amount) is called when the give button is pressed.
 */
export function mountStepper(root, onDonate) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const START = reduce ? SUGGESTED : MIN;
  const $ = (s) => root.querySelector(s);
  const el = (id) => root.querySelector("#" + id);
  let amount = START;
  let dead = false;
  const timers = new Set();
  const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); return t; };

  /* ---------- Actors ---------- */
  const actors = ACTORS.map(([layer, x, y, s, cls, t, art, dx]) => {
    const outer = document.createElementNS(NS, "g");
    const g = document.createElementNS(NS, "g");
    const inner = typeof art === "function" ? art() : art;
    if (typeof art === "function" || cls === "walk") outer.setAttribute("transform", `translate(${x} ${y}) scale(${s})`);
    g.setAttribute("class", "act " + cls);
    if (dx) g.style.setProperty("--dx", dx);
    g.innerHTML = inner;
    outer.appendChild(g);
    el(layer).appendChild(outer);
    return { g, t };
  });
  function applyActors(p, dir) {
    const changed = actors.filter((a) => (p >= a.t - 1e-9) !== a.g.classList.contains("on"));
    changed.sort((a, b) => (dir >= 0 ? a.t - b.t : b.t - a.t));
    const gap = changed.length ? Math.min(110, 1200 / changed.length) : 0;
    actors.forEach((a) => {
      const on = p >= a.t - 1e-9, i = changed.indexOf(a);
      a.g.style.setProperty("--d", i >= 0 ? `${Math.round(i * gap)}ms` : "0ms");
      a.g.style.setProperty("--s", on ? 1 : 0);
      a.g.classList.toggle("on", on);
    });
  }

  /* ---------- Scene paint ---------- */
  const svg = $("#scene"), sceneFig = $(".scene");
  const E = {};
  ["wall", "wainscot", "rail", "floor", "baseboard", "blanket", "winCity", "floorLines", "winTop", "winBot", "moon", "winStars", "winSun",
   "curtainL", "curtainR", "beam", "dark", "lampGlow", "headSection", "armSection", "heroHead", "heroBrows", "heroMouth", "heroTear",
   "heroBlush", "heroIris", "heroLids", "heroLash", "heroBags", "heroCrease", "heroLipU", "heroLipL", "ivTape", "hearts"].forEach((id) => (E[id] = el(id)));
  let theta = 0;
  function paint(p) {
    const [cx, cy, w] = keyframe(CAM, p), h = (w * 460) / 800;
    svg.setAttribute("viewBox", `${clamp(cx - w / 2, 0, 800 - w).toFixed(2)} ${clamp(cy - h / 2, 0, 460 - h).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}`);
    sceneFig.style.setProperty("--vig", (1 - smooth(0, 0.45, p)).toFixed(3));

    const k = smooth(0, 0.6, p);
    Object.keys(PALETTE).forEach((id) => E[id].setAttribute("fill", mix(...PALETTE[id], k)));
    E.floorLines.setAttribute("stroke", mix(...LINES, k));
    E.winTop.setAttribute("stop-color", mix(...WIN.top, k));
    E.winBot.setAttribute("stop-color", mix(...WIN.bot, k));
    E.moon.setAttribute("opacity", (1 - k).toFixed(3));
    E.winStars.setAttribute("opacity", (1 - smooth(0, 0.3, p)).toFixed(3));
    const sun = 1 - Math.pow(1 - clamp(p / 0.5, 0, 1), 2.2);
    E.winSun.setAttribute("transform", `translate(170 ${(250 - 150 * sun).toFixed(1)})`);
    const c = 1 - 0.68 * smooth(0, 0.85, p); // curtains draw open
    E.curtainL.setAttribute("transform", `translate(70 0) scale(${c.toFixed(3)} 1) translate(-70 0)`);
    E.curtainR.setAttribute("transform", `translate(270 0) scale(${c.toFixed(3)} 1) translate(-270 0)`);
    E.beam.setAttribute("opacity", (0.34 * smooth(0.2, 0.9, p)).toFixed(3));
    E.dark.setAttribute("opacity", (0.45 * (1 - k)).toFixed(3));
    E.lampGlow.setAttribute("opacity", (1 - smooth(0, 0.55, p)).toFixed(3));
    svg.style.filter = `saturate(${(0.55 + 0.45 * k).toFixed(3)})`;

    // She sits up as she gets stronger; her face softens into a smile
    theta = 28 * smooth(S(2), S(9), p);
    const rot = `rotate(${theta.toFixed(2)} 430 300)`;
    E.headSection.setAttribute("transform", rot);
    E.armSection.setAttribute("transform", rot);
    const [gx, gy] = keyframe(GAZE, p);
    E.heroHead.setAttribute("transform", `rotate(${(-0.55 * theta + gx * 5 + REST_TILT * (1 - theta / 28)).toFixed(2)} 366 280)`);
    E.heroIris.setAttribute("transform", `translate(${(gx * 0.1).toFixed(3)} ${(gy * 0.05).toFixed(3)})`);
    const hp = smooth(0, 0.5, p);
    const bi = -0.27 + 0.065 * hp, bo = -0.165 - 0.015 * hp; // worried brows relax
    E.heroBrows.setAttribute("d", `M-.47 ${bo.toFixed(3)} Q-.32 ${(bo - 0.075).toFixed(3)} -.14 ${bi.toFixed(3)} M.14 ${bi.toFixed(3)} Q.32 ${(bo - 0.075).toFixed(3)} .47 ${bo.toFixed(3)}`);
    const lc = -0.165 + 0.075 * (1 - hp); // heavy lids lift
    const lid = (ex) => `M${ex - 0.175} .006 Q${ex} ${lc.toFixed(3)} ${ex + 0.175} .006 L${ex + 0.175} -.14 L${ex - 0.175} -.14Z`;
    E.heroLids.setAttribute("d", lid(-0.3) + lid(0.3));
    E.heroLash.setAttribute("d", [-0.3, 0.3].map((ex) => `M${ex - 0.16} .006 Q${ex} ${lc.toFixed(3)} ${ex + 0.16} .006`).join(" "));
    E.heroCrease.setAttribute("d", [-0.3, 0.3].map((ex) => `M${ex - 0.15} -.05 Q${ex} ${(lc - 0.09).toFixed(3)} ${ex + 0.15} -.06`).join(" "));
    const L = lipShapes(-1 + 2 * smooth(0, 0.9, p)); // frown to smile
    E.heroLipU.setAttribute("d", L.upper);
    E.heroLipL.setAttribute("d", L.lower);
    E.heroMouth.setAttribute("d", L.line);
    E.heroTear.setAttribute("opacity", (1 - smooth(0, S(1) * 0.9, p)).toFixed(3));
    E.heroBags.setAttribute("opacity", (0.5 * (1 - hp)).toFixed(3));
    E.heroBlush.setAttribute("opacity", (0.55 * smooth(0.4, 1, p)).toFixed(3));
    // The drip line follows her wrist as she sits up
    const r = (theta * Math.PI) / 180, wx = 8, wy = -9;
    const tx = 430 + wx * Math.cos(r) - wy * Math.sin(r), ty = 300 + wx * Math.sin(r) + wy * Math.cos(r);
    const tube = el("ivTube");
    if (tube) tube.setAttribute("d", `M288 170 C296 250 ${(tx - 56).toFixed(1)} ${(ty - 44).toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)}`);
    E.ivTape.setAttribute("opacity", smooth(S(1) + 0.04, S(2), p).toFixed(3));
  }
  let shownP = progressFor(START), targetP = shownP, raf = 0;
  function tick() {
    const d = targetP - shownP;
    if (dead || Math.abs(d) < 0.0006) { shownP = targetP; if (!dead) paint(shownP); raf = 0; return; }
    shownP += d * 0.06;
    paint(shownP);
    raf = requestAnimationFrame(tick);
  }
  function kick() {
    if (reduce) { shownP = targetP; paint(shownP); return; }
    if (!raf) raf = requestAnimationFrame(tick);
  }

  // Small hearts rise from her each time the gift goes up
  function hearts() {
    if (reduce) return;
    const r = (theta * Math.PI) / 180, dx = -78, dy = -28;
    const hx = 430 + dx * Math.cos(r) - dy * Math.sin(r), hy = 300 + dx * Math.sin(r) + dy * Math.cos(r);
    for (let i = 0; i < 3; i++) {
      const g = document.createElementNS(NS, "g");
      g.setAttribute("transform", `translate(${(hx + (Math.random() - 0.5) * 34).toFixed(1)} ${(hy - 24 - Math.random() * 8).toFixed(1)}) scale(1.4)`);
      g.innerHTML = `<path class="heart" style="animation-delay:${i * 140}ms" d="M0 3.5 C-6.5 -1.5 -4.5 -7.5 0 -4 C4.5 -7.5 6.5 -1.5 0 3.5Z" fill="#E7739F"/>`;
      E.hearts.appendChild(g);
      g.firstChild.addEventListener("animationend", () => g.remove());
    }
  }

  /* ---------- Story ---------- */
  const storyBox = $("#story");
  let storyKey = -1;
  function setStory(dir) {
    const key = amount > LAST_STAGE ? STEPS : stageOf(amount);
    if (key === storyKey) return;
    storyKey = key;
    const [lead, gift] = storyFor(amount);
    const old = storyBox.querySelector(".story-item:not(.out)");
    const nw = document.createElement("div");
    nw.className = "story-item";
    nw.innerHTML = `<p class="story-lead"></p><p class="story-gift"></p>`;
    nw.children[0].textContent = lead;
    nw.children[1].textContent = gift;
    storyBox.appendChild(nw);
    $("#sceneTitle").textContent = lead;
    if (!old) return;
    const off = dir >= 0 ? 18 : -18;
    nw.style.transform = `translateY(${off}px)`;
    nw.style.opacity = "0";
    old.classList.add("out");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      nw.style.transform = "translateY(0)";
      nw.style.opacity = "1";
      old.style.transform = `translateY(${-off}px)`;
      old.style.opacity = "0";
    }));
    later(() => old.remove(), 600);
  }

  /* ---------- Rolling digits ---------- */
  const digitsEl = $("#digits");
  const slots = [];
  const slotW = (ch) => (ch === " " ? "0" : ch === "," ? ".3em" : "1ch");
  function makeSlot(ch) {
    const s = document.createElement("span");
    s.className = "slot";
    s.dataset.ch = ch;
    s.style.width = slotW(ch);
    s.innerHTML = `<span class="glyph"></span>`;
    s.firstChild.textContent = ch.trim();
    return s;
  }
  function rollSlot(slot, ch, dir, delay) {
    slot.dataset.ch = ch;
    slot.style.width = slotW(ch);
    slot.querySelectorAll(".glyph.out").forEach((n) => n.remove());
    const old = slot.querySelector(".glyph");
    const nw = document.createElement("span");
    nw.className = "glyph";
    nw.textContent = ch.trim();
    const off = dir > 0 ? 70 : -70;
    nw.style.transform = `translateY(${off}%)`;
    nw.style.opacity = "0";
    nw.style.transitionDelay = old.style.transitionDelay = `${delay}ms`;
    slot.appendChild(nw);
    old.classList.add("out");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      nw.style.transform = "translateY(0)";
      nw.style.opacity = "1";
      old.style.transform = `translateY(${-off}%)`;
      old.style.opacity = "0";
    }));
    later(() => old.remove(), 520 + delay);
  }
  let trimTimer = 0;
  function renderDigits(val, dir) {
    const str = grp.format(val);
    $("#amount").style.setProperty("--fit", Math.min(1, 6 / (str.length + 1.5)).toFixed(3)); // monospace is wider, shrink earlier
    while (slots.length < str.length) { const s = makeSlot(" "); digitsEl.prepend(s); slots.unshift(s); }
    const padded = str.padStart(slots.length, " ");
    slots.forEach((s, i) => { if (s.dataset.ch !== padded[i]) rollSlot(s, padded[i], dir, (slots.length - 1 - i) * 35); });
    clearTimeout(trimTimer);
    trimTimer = later(() => { while (slots.length > grp.format(amount).length && slots[0].dataset.ch === " ") slots.shift().remove(); }, 600);
  }
  grp.format(START).split("").forEach((ch) => { const s = makeSlot(ch); digitsEl.appendChild(s); slots.push(s); });

  /* ---------- Feedback ---------- */
  const floats = $("#floats"), hint = $("#hint"), live = $("#live"), cta = $("#cta"), amountEl = $("#amount");
  const plusBtn = $("#plus"), minusBtn = $("#minus");
  const bump = (n) => { n.classList.remove("bump"); void n.offsetWidth; n.classList.add("bump"); };
  function floatDelta(delta) {
    if (reduce) return;
    const n = document.createElement("span");
    n.className = "delta " + (delta > 0 ? "up" : "down");
    n.textContent = (delta > 0 ? "+" : "−") + inr.format(Math.abs(delta));
    floats.appendChild(n);
    n.addEventListener("animationend", () => n.remove());
    while (floats.children.length > 5) floats.firstChild.remove();
  }
  let plusTurn = 0;
  function iconMotion(dir) {
    if (dir > 0) { plusTurn += 90; $("#plus .icon").style.transform = `rotate(${plusTurn}deg)`; }
    else { const ic = $("#minus .icon"); ic.classList.remove("squash"); void ic.offsetWidth; ic.classList.add("squash"); }
  }
  const hintText = () => (amount >= LAST_STAGE ? `All ${STEPS} stages reached. You can keep going.` : "₹100 per step");
  let hintTimer = 0;
  function limitFeedback() {
    amountEl.classList.remove("shake"); void amountEl.offsetWidth; amountEl.classList.add("shake");
    hint.textContent = `The minimum is ₹${MIN} a month`;
    hint.classList.add("warn");
    clearTimeout(hintTimer);
    hintTimer = later(() => { hint.textContent = hintText(); hint.classList.remove("warn"); }, 2200);
  }
  let liveTimer = 0;
  function announce() {
    clearTimeout(liveTimer);
    liveTimer = later(() => { const [lead, gift] = storyFor(amount); live.textContent = `${inr.format(amount)} a month, ${stageText(amount)}. ${lead} ${gift}`; }, 450);
  }

  /* ---------- Step pips ---------- */
  const pips = Array.from({ length: STEPS }, (_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "pip";
    b.tabIndex = -1; // keyboard users step with the arrow keys on the amount
    b.addEventListener("click", () => { stopIntro(); setAmount(MIN + i * STEP); });
    $("#pips").appendChild(b);
    return b;
  });
  let pipStep = stageOf(START);
  function syncPips(dir = 1) {
    const now = stageOf(amount);
    pips.forEach((b, i) => {
      const dist = dir >= 0 ? i - pipStep : pipStep - i;
      b.style.setProperty("--d", `${Math.max(0, dist) * 45}ms`);
      b.classList.toggle("on", i <= now);
      b.classList.toggle("current", i === now);
    });
    pipStep = now;
  }

  /* ---------- Numbers ---------- */
  function syncNumbers() {
    const care = amount * SHARE;
    $("#careAmt").textContent = inr.format(care);
    $("#costsAmt").textContent = inr.format(amount - care);
    $("#ctaAmt").textContent = inr.format(amount);
    amountEl.setAttribute("aria-valuenow", amount);
    amountEl.setAttribute("aria-valuetext", `${inr.format(amount)} a month, ${stageText(amount)}`);
    minusBtn.setAttribute("aria-disabled", amount <= MIN);
  }

  function setAmount(next) {
    const target = Math.max(MIN, next);
    const delta = target - amount;
    if (!delta) { if (next < amount) limitFeedback(); return false; }
    amount = target;
    renderDigits(amount, delta);
    floatDelta(delta);
    iconMotion(delta);
    if (delta > 0) hearts();
    syncNumbers();
    root.querySelectorAll(".chip").forEach(bump);
    bump(cta);
    cta.classList.add("nudge"); // invite the click once they have chosen an amount
    targetP = progressFor(amount);
    applyActors(targetP, delta);
    kick();
    setStory(delta);
    if (!hint.classList.contains("warn")) hint.textContent = hintText();
    syncPips(delta);
    announce();
    return true;
  }

  /* ---------- Press and hold ---------- */
  let holdTimer = 0;
  const stopHold = (btn) => { clearTimeout(holdTimer); holdTimer = 0; btn && btn.classList.remove("pressing"); };
  const press = (dir) => setAmount(amount + dir * STEP);
  [[plusBtn, 1], [minusBtn, -1]].forEach(([btn, dir]) => {
    btn.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      stopIntro();
      btn.setPointerCapture?.(e.pointerId);
      btn.classList.add("pressing");
      if (!press(dir)) return;
      let wait = 520;
      const repeat = () => {
        if (!press(dir)) return stopHold(btn);
        wait = Math.max(amount >= LAST_STAGE ? 90 : 280, wait * 0.85); // slow while the story unfolds
        holdTimer = setTimeout(repeat, wait);
      };
      holdTimer = setTimeout(repeat, wait);
    });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach((ev) => btn.addEventListener(ev, () => stopHold(btn)));
    btn.addEventListener("contextmenu", (e) => e.preventDefault());
    btn.addEventListener("click", (e) => { if (e.detail === 0) { stopIntro(); press(dir); } });
  });
  amountEl.addEventListener("keydown", (e) => {
    const map = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 2, PageDown: -2 };
    if (e.key in map) { e.preventDefault(); stopIntro(); setAmount(amount + map[e.key] * STEP); }
    else if (e.key === "Home") { e.preventDefault(); stopIntro(); setAmount(MIN); }
    else if (e.key === "End") { e.preventDefault(); stopIntro(); setAmount(Math.max(amount, LAST_STAGE)); }
  });
  cta.addEventListener("click", () => { if (cta.getAttribute("aria-disabled") !== "true") onDonate(amount); });

  /* ---------- Intro: she starts alone, then help arrives up to the suggested gift ---------- */
  let introTimer = 0, introDone = reduce, io;
  function stopIntro() { introDone = true; clearTimeout(introTimer); io?.disconnect(); }
  if (!introDone) {
    io = new IntersectionObserver((entries) => {
      if (!entries.some((en) => en.isIntersecting)) return;
      io.disconnect();
      introTimer = later(function next() {
        if (introDone || amount >= SUGGESTED) { introDone = true; return; }
        setAmount(amount + STEP);
        introTimer = later(next, 1600);
      }, 2400);
    }, { threshold: 0.5 });
    io.observe(sceneFig);
  }

  /* ---------- Initial state ---------- */
  paint(shownP);
  applyActors(targetP, 1);
  setStory(1);
  syncPips();
  syncNumbers();
  renderDigits(START, 1);

  const status = $("#giveStatus");
  return {
    destroy() {
      dead = true;
      stopIntro();
      stopHold();
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    },
    setBusy(busy) { cta.setAttribute("aria-disabled", busy ? "true" : "false"); },
    setStatus(msg, kind = "") { status.textContent = msg; status.className = "give-status " + kind; },
  };
}
