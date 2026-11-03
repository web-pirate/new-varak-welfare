import type { ReactNode } from "react";

// One simple organ illustration per cancer, each with a lump that grows, pulses and resets.
// shortcut: stylised diagrams, not anatomical art. Swap in commissioned illustrations if wanted.

const tint = (hex: string, pct: number) => `color-mix(in srgb, ${hex} ${pct}%, white)`;

const CSS = `
@keyframes co-grow { 0%, 8% { transform: scale(.12); opacity: .25 } 55%, 88% { transform: scale(1); opacity: 1 } 100% { transform: scale(.12); opacity: .25 } }
@keyframes co-ring { 0%, 8% { transform: scale(.6); opacity: 0 } 55% { transform: scale(1); opacity: .9 } 88%, 100% { transform: scale(1.35); opacity: 0 } }
.co-lump, .co-ring { animation: co-grow 5s ease-in-out infinite }
.co-ring { animation-name: co-ring }
@media (prefers-reduced-motion: reduce) { .co-lump, .co-ring { animation: none } }
`;

function Lump({ cx, cy, r = 11, color = "#6B3A5C" }: { cx: number; cy: number; r?: number; color?: string }) {
  const origin = { transformOrigin: `${cx}px ${cy}px` };
  return (
    <g>
      <circle className="co-ring" style={origin} cx={cx} cy={cy} r={r + 9} fill="none" stroke={color} strokeWidth="1.2" strokeDasharray="3 3" />
      <g className="co-lump" style={origin}>
        <circle cx={cx} cy={cy} r={r} fill={color} />
        <circle cx={cx - r * 0.3} cy={cy - r * 0.3} r={r * 0.32} fill="#fff" opacity=".28" />
      </g>
    </g>
  );
}

/* ---------- Organs. Each returns the drawing plus its lump, in a 260 x 200 frame ---------- */

const Lung = () => (
  <g transform="translate(-26 -8) scale(.78)">
    <rect x="194" y="28" width="12" height="62" rx="6" fill="#D9798F" opacity=".7" />
    <path d="M200 86 Q190 98 178 104 M200 86 Q210 98 222 104" fill="none" stroke="#D9798F" strokeOpacity=".7" strokeWidth="9" strokeLinecap="round" />
    <path d="M184 78 C160 68 122 88 112 136 C102 184 110 222 140 230 C165 236 182 222 186 202 L188 94 Z" fill="#F2A7B8" />
    <path d="M216 78 C240 68 278 88 288 136 C298 184 290 222 260 230 C235 236 218 222 214 202 L212 94 Z" fill="#F2A7B8" />
    <path d="M178 106 Q160 122 152 144 M164 128 Q144 134 132 152 M172 144 Q164 172 156 200 M160 170 Q144 180 136 200 M222 106 Q240 122 248 144 M236 128 Q256 134 268 152 M228 144 Q236 172 244 200 M240 170 Q256 180 264 200" fill="none" stroke="#D9798F" strokeWidth="2" strokeLinecap="round" />
    <Lump cx={264} cy={154} r={14} />
  </g>
);

const Breast = () => (
  <g>
    <rect x="26" y="34" width="26" height="132" rx="9" fill="#E9C9B5" stroke="#D9A98F" strokeWidth="2" />
    <path d="M52 54 C142 46 214 76 214 104 C214 132 142 158 52 152Z" fill="#F6D3C0" stroke="#D9967A" strokeWidth="2" />
    <rect x="210" y="97" width="13" height="14" rx="6" fill="#D98F76" />
    <g stroke="#E3A98F" strokeWidth="2.4" strokeLinecap="round" fill="none">
      <path d="M212 104 C150 92 100 72 62 66" />
      <path d="M212 104 C150 100 100 90 62 88" />
      <path d="M212 104 L62 106" />
      <path d="M212 104 C150 108 100 122 62 126" />
      <path d="M212 104 C150 116 100 140 62 144" />
    </g>
    {[66, 88, 106, 126, 144].map((y) => (
      <circle key={y} cx="62" cy={y} r="5" fill="#EBB8A0" stroke="#D9967A" />
    ))}
    <Lump cx={128} cy={88} r={12} />
  </g>
);

const Leukemia = () => (
  <g>
    <rect x="22" y="66" width="216" height="68" rx="34" fill="#F8DADA" stroke="#E7A6A6" strokeWidth="2" />
    {[[56, 92], [92, 116], [58, 118], [196, 90], [214, 112], [176, 120]].map(([x, y]) => (
      <g key={`${x}${y}`}>
        <ellipse cx={x} cy={y} rx="12" ry="9" fill="#D9483B" />
        <ellipse cx={x} cy={y} rx="5" ry="3.5" fill="#B83226" opacity=".7" />
      </g>
    ))}
    <circle cx="128" cy="86" r="9" fill="#C9B6E4" stroke="#9B82C9" />
    <Lump cx={134} cy={110} r={15} />
  </g>
);

const Brain = () => (
  <g>
    <path d="M58 112 C46 72 84 40 120 48 C142 28 188 36 198 64 C228 68 238 102 216 122 C226 152 196 168 176 154 C160 174 124 172 112 154 C84 162 54 146 58 112Z" fill="#F2B8C0" stroke="#D98895" strokeWidth="2" />
    <path d="M96 70 C110 78 112 92 100 100 M140 56 C130 70 144 82 134 96 M170 70 C160 84 178 92 170 108 M90 124 C104 120 116 130 112 142 M150 124 C164 132 172 124 186 130" fill="none" stroke="#D98895" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M172 150 C186 174 188 184 176 188" fill="none" stroke="#E9A0AB" strokeWidth="9" strokeLinecap="round" />
    <Lump cx={146} cy={96} r={13} />
  </g>
);

function Female({ lump }: { lump: "cervix" | "uterus" | "ovary" }) {
  return (
    <g>
      <path d="M106 80 C86 66 62 72 52 92 M154 80 C174 66 198 72 208 92" fill="none" stroke="#E88A9B" strokeWidth="6" strokeLinecap="round" />
      <ellipse cx="50" cy="102" rx="15" ry="11" fill="#F6D28B" stroke="#D9A85C" />
      <ellipse cx="210" cy="102" rx="15" ry="11" fill="#F6D28B" stroke="#D9A85C" />
      <path d="M130 58 C108 58 96 80 100 104 C103 122 116 136 122 148 L138 148 C144 136 157 122 160 104 C164 80 152 58 130 58Z" fill="#F4A9B5" stroke="#E07F92" strokeWidth="2" />
      <path d="M122 100 C122 90 138 90 138 100 C138 112 122 112 122 100Z" fill="#F9D1D8" />
      <rect x="121" y="146" width="18" height="32" rx="8" fill="#E88A9B" stroke="#D2677C" />
      {lump === "cervix" && <Lump cx={130} cy={162} r={8} />}
      {lump === "uterus" && <Lump cx={130} cy={96} r={13} />}
      {lump === "ovary" && <Lump cx={210} cy={102} r={12} />}
    </g>
  );
}

const Oral = () => (
  <g>
    <ellipse cx="130" cy="104" rx="76" ry="46" fill="#D9606A" />
    <ellipse cx="130" cy="104" rx="60" ry="32" fill="#7A2230" />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={i} x={92 + i * 12.6} y="74" width="11" height="15" rx="3.5" fill="#fff" />
    ))}
    <ellipse cx="130" cy="120" rx="38" ry="17" fill="#E98A98" />
    <path d="M130 108 V126" stroke="#C9606E" strokeWidth="1.6" strokeLinecap="round" />
    <Lump cx={152} cy={118} r={8} />
  </g>
);

const Pancreas = () => (
  <g>
    <path d="M78 66 C38 82 38 138 82 154" fill="none" stroke="#E49A8A" strokeWidth="15" strokeLinecap="round" />
    <path d="M60 122 C68 98 104 92 142 98 C178 102 198 96 216 84 C226 98 212 120 184 126 C150 134 102 144 68 138 C56 136 54 128 60 122Z" fill="#F0C987" stroke="#D9A85C" strokeWidth="2" />
    <path d="M70 122 C110 116 160 118 204 98" fill="none" stroke="#D9A85C" strokeWidth="1.6" />
    <Lump cx={92} cy={118} r={11} />
  </g>
);

const Stomach = () => (
  <g>
    <path d="M92 20 C92 44 94 56 100 66" fill="none" stroke="#F2A9A0" strokeWidth="14" strokeLinecap="round" />
    <path d="M100 64 C68 72 60 122 84 150 C106 178 162 178 186 148 C200 128 190 98 162 92 C142 88 128 84 120 64Z" fill="#F4B6A6" stroke="#D98A78" strokeWidth="2" />
    <path d="M98 100 C112 110 120 124 118 140 M128 106 C140 114 150 128 150 142" fill="none" stroke="#E4A08E" strokeWidth="2" strokeLinecap="round" />
    <path d="M186 148 C204 150 220 160 230 176" fill="none" stroke="#E49A8A" strokeWidth="12" strokeLinecap="round" />
    <Lump cx={116} cy={138} r={12} />
  </g>
);

const Kidney = () => {
  const k = (
    <path d="M92 44 C62 42 46 80 52 116 C58 152 88 160 98 146 C90 136 88 120 94 108 C100 96 106 82 100 66 C98 56 96 48 92 44Z" fill="#C8624F" stroke="#9E4636" strokeWidth="2" />
  );
  return (
    <g>
      {k}
      <g transform="translate(260 0) scale(-1 1)">{k}</g>
      <path d="M98 108 C112 130 124 150 126 176 M162 108 C148 130 136 150 134 176" fill="none" stroke="#E0A07C" strokeWidth="5" strokeLinecap="round" />
      <Lump cx={68} cy={96} r={11} />
    </g>
  );
};

function LiverBase({ lump }: { lump: "liver" | "gall" }) {
  return (
    <g>
      <path d="M36 82 C66 48 140 42 194 58 C230 68 238 102 220 126 C202 152 150 158 116 150 C82 142 46 118 36 82Z" fill="#B5644F" stroke="#8F4A3A" strokeWidth="2" />
      <path d="M150 52 C146 86 138 118 122 148" fill="none" stroke="#8F4A3A" strokeWidth="1.6" opacity=".6" />
      <path d="M142 144 C128 160 134 186 154 184 C174 182 172 158 160 144Z" fill="#7DB26A" stroke="#5C9048" strokeWidth="2" />
      {lump === "liver" ? <Lump cx={92} cy={98} r={13} /> : <Lump cx={153} cy={166} r={8} />}
    </g>
  );
}

const Bone = () => (
  <g transform="rotate(-18 130 100)">
    <rect x="62" y="88" width="136" height="24" rx="10" fill="#F1E4CF" stroke="#D8C4A4" strokeWidth="2" />
    {[[52, 84], [52, 116], [208, 84], [208, 116]].map(([x, y]) => (
      <circle key={`${x}${y}`} cx={x} cy={y} r="17" fill="#F1E4CF" stroke="#D8C4A4" strokeWidth="2" />
    ))}
    <rect x="60" y="90" width="12" height="20" fill="#F1E4CF" />
    <rect x="188" y="90" width="12" height="20" fill="#F1E4CF" />
    <Lump cx={170} cy={100} r={13} />
  </g>
);

function Urinary({ lump }: { lump: "prostate" | "bladder" }) {
  return (
    <g>
      <circle cx="130" cy="66" r="40" fill="#F2B7A0" stroke="#D98A70" strokeWidth="2" />
      <path d="M96 40 C84 24 76 20 66 22 M164 40 C176 24 184 20 194 22" fill="none" stroke="#E0A07C" strokeWidth="5" strokeLinecap="round" />
      <rect x="124" y="104" width="12" height="74" rx="6" fill="#D68068" />
      <circle cx="130" cy="132" r="22" fill="#E89B5A" stroke="#C37A3C" strokeWidth="2" />
      {lump === "prostate" ? <Lump cx={138} cy={130} r={9} /> : <Lump cx={150} cy={58} r={11} />}
    </g>
  );
}

const Colon = () => (
  <g>
    <path d="M60 156 L60 60 Q60 42 78 42 L182 42 Q200 42 200 60 L200 150 C200 172 172 178 150 172" fill="none" stroke="#E8A07A" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M60 156 L60 60 Q60 42 78 42 L182 42 Q200 42 200 60 L200 150" fill="none" stroke="#F4C3A4" strokeWidth="4" strokeDasharray="1 11" strokeLinecap="round" />
    <path d="M96 78 C130 70 150 90 120 100 C92 110 112 126 144 120 C168 116 160 138 130 142" fill="none" stroke="#F4C9B0" strokeWidth="9" strokeLinecap="round" />
    <Lump cx={60} cy={100} r={11} />
  </g>
);

const Lymphoma = () => (
  <g>
    <path d="M60 70 L110 100 L160 80 L205 112 L150 142 L85 138 L110 100" fill="none" stroke="#7FB5C9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    {[[60, 70], [110, 100], [205, 112], [150, 142], [85, 138]].map(([x, y]) => (
      <ellipse key={`${x}${y}`} cx={x} cy={y} rx="14" ry="10" fill="#D6C7EC" stroke="#9B82C9" strokeWidth="2" />
    ))}
    <ellipse cx="160" cy="80" rx="14" ry="10" fill="#D6C7EC" stroke="#9B82C9" strokeWidth="2" />
    <Lump cx={160} cy={80} r={15} />
  </g>
);

const Thyroid = () => (
  <g>
    <rect x="120" y="22" width="20" height="158" rx="10" fill="#C9D7E3" stroke="#9BB0C4" strokeWidth="2" />
    {[44, 62, 80, 98, 116, 134, 152].map((y) => (
      <path key={y} d={`M120 ${y} H140`} stroke="#9BB0C4" strokeWidth="2" />
    ))}
    <ellipse cx="98" cy="104" rx="24" ry="38" transform="rotate(-10 98 104)" fill="#D88B9C" stroke="#B9647A" strokeWidth="2" />
    <ellipse cx="162" cy="104" rx="24" ry="38" transform="rotate(10 162 104)" fill="#D88B9C" stroke="#B9647A" strokeWidth="2" />
    <rect x="116" y="102" width="28" height="12" rx="4" fill="#D88B9C" />
    <Lump cx={170} cy={96} r={11} />
  </g>
);

const Skin = () => (
  <g>
    <rect x="24" y="102" width="212" height="14" fill="#F1C9A5" />
    <rect x="24" y="116" width="212" height="34" fill="#E8A98A" />
    <rect x="24" y="150" width="212" height="34" fill="#F6DFA8" />
    <path d="M60 116 V162 M200 116 V162" stroke="#C98B72" strokeWidth="5" strokeLinecap="round" />
    <path d="M60 102 L56 88 M60 102 L64 86 M200 102 L196 88 M200 102 L204 86" stroke="#6B4A3A" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M24 102 H236" stroke="#D9A57F" strokeWidth="2" />
    <Lump cx={130} cy={102} r={17} color="#5A3A2A" />
  </g>
);

const Myeloma = () => (
  <g>
    <rect x="40" y="56" width="180" height="88" rx="38" fill="#F1E4CF" stroke="#D8C4A4" strokeWidth="2" />
    <rect x="54" y="70" width="152" height="60" rx="28" fill="#E9A7A7" />
    {[[78, 92], [96, 112], [168, 92], [186, 108], [120, 80]].map(([x, y]) => (
      <circle key={`${x}${y}`} cx={x} cy={y} r="5.5" fill="#D9483B" />
    ))}
    {[[142, 112], [124, 100], [152, 90]].map(([x, y]) => (
      <circle key={`${x}${y}`} cx={x} cy={y} r="6" fill="#9B82C9" />
    ))}
    <Lump cx={136} cy={100} r={13} />
  </g>
);

const Esophagus = () => (
  <g>
    <rect x="108" y="16" width="44" height="168" rx="20" fill="#F2B5A8" stroke="#D98A78" strokeWidth="2" />
    <rect x="118" y="16" width="24" height="168" rx="10" fill="#7A2230" opacity=".35" />
    <circle cx="130" cy="62" r="9" fill="#E7A23A" />
    <Lump cx={140} cy={112} r={12} />
  </g>
);

const HeadNeck = () => (
  <g>
    <path d="M96 36 C124 22 168 34 176 66 C178 76 178 82 184 92 L172 96 C176 102 174 108 168 110 C170 118 162 124 152 124 L152 150 C152 160 160 168 176 174 L196 182 L70 182 L96 172 C108 166 112 160 112 150 L112 116 C84 96 78 56 96 36Z" fill="#F3CDB1" stroke="#D9A57F" strokeWidth="2" />
    <rect x="124" y="124" width="16" height="50" rx="8" fill="#C9D7E3" stroke="#9BB0C4" />
    <ellipse cx="136" cy="132" rx="10" ry="9" fill="#E7B4A3" stroke="#C98B72" />
    <Lump cx={160} cy={142} r={10} />
  </g>
);

const Testis = () => (
  <g>
    <path d="M118 18 C116 50 100 64 100 78 M142 18 C144 50 160 64 160 78" fill="none" stroke="#E0A07C" strokeWidth="5" strokeLinecap="round" />
    <ellipse cx="100" cy="124" rx="32" ry="42" fill="#E8B7A0" stroke="#C98B72" strokeWidth="2" />
    <ellipse cx="162" cy="126" rx="32" ry="42" fill="#E8B7A0" stroke="#C98B72" strokeWidth="2" />
    <path d="M122 100 C132 120 132 140 122 158 M184 98 C196 118 196 142 184 160" fill="none" stroke="#C98B72" strokeWidth="2.4" strokeLinecap="round" />
    <Lump cx={174} cy={116} r={10} />
  </g>
);

const organs: Record<string, ReactNode> = {
  "Lung Cancer": <Lung />,
  "Breast Cancer": <Breast />,
  "Blood Cancer (Leukemia)": <Leukemia />,
  "Brain Cancer": <Brain />,
  "Cervical Cancer": <Female lump="cervix" />,
  "Oral Cancer": <Oral />,
  "Ovarian Cancer": <Female lump="ovary" />,
  "Pancreatic Cancer": <Pancreas />,
  "Stomach Cancer": <Stomach />,
  "Kidney Cancer": <Kidney />,
  "Liver Cancer": <LiverBase lump="liver" />,
  "Bone Cancer": <Bone />,
  "Prostate Cancer": <Urinary lump="prostate" />,
  "Colorectal Cancer": <Colon />,
  Lymphoma: <Lymphoma />,
  "Thyroid Cancer": <Thyroid />,
  "Skin Cancer": <Skin />,
  "Multiple Myeloma": <Myeloma />,
  "Gallbladder Cancer": <LiverBase lump="gall" />,
  "Uterine Cancer": <Female lump="uterus" />,
  "Esophageal Cancer": <Esophagus />,
  "Bladder Cancer": <Urinary lump="bladder" />,
  "Head & Neck Cancer": <HeadNeck />,
  "Testicular Cancer": <Testis />,
};

export function OrganHero({ name, base }: { name: string; base: string }) {
  return (
    <svg viewBox="0 0 260 200" role="img" aria-label={`Illustration: a lump of abnormal cells growing in the ${name.toLowerCase()} area`} className="block w-full h-auto max-w-[360px] mx-auto">
      <style>{CSS}</style>
      <circle cx="130" cy="100" r="94" style={{ fill: tint(base, 14) }} />
      {organs[name]}
    </svg>
  );
}
