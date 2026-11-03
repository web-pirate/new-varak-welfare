export const STEPPER_HTML = /* html */ `
<div class="ribbon-bar" aria-hidden="true"></div>
<div class="top" style="margin-top:20px">
  <header class="intro">
    <p class="eyebrow">Monthly Giving</p>
    <h1>No one should face cancer alone</h1>
    <p>Choose a monthly gift and see what it brings to her bedside.</p>
  </header>

  <div class="stepper">
    <p class="stepper-label" id="amtLabel">Your monthly gift</p>
    <div class="stepper-row">
      <button class="step-btn minus" id="minus" type="button" aria-label="Decrease by ₹100" aria-controls="amount"><span class="icon"></span></button>
      <div class="amount-wrap">
        <div class="amount" id="amount" role="spinbutton" tabindex="0" aria-labelledby="amtLabel" aria-valuemin="100" aria-valuenow="100" aria-valuetext="₹100 a month">
          <span class="cur" aria-hidden="true">₹</span><span class="digits" id="digits" aria-hidden="true"></span>
        </div>
        <span class="per" aria-hidden="true">/month</span>
        <div class="pips" id="pips" aria-hidden="true"></div>
        <div class="float-layer" id="floats" aria-hidden="true"></div>
      </div>
      <button class="step-btn plus" id="plus" type="button" aria-label="Increase by ₹100" aria-controls="amount"><span class="icon"></span></button>
    </div>
    <p class="hint" id="hint">₹100 per step</p>
<div class="give">
  <button class="cta" id="cta" type="button">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5 C5 15.6 2.5 12.4 2.5 8.9 C2.5 6.1 4.6 4 7.3 4 C9.1 4 10.9 5 12 6.6 C13.1 5 14.9 4 16.7 4 C19.4 4 21.5 6.1 21.5 8.9 C21.5 12.4 19 15.6 12 20.5Z" fill="currentColor"/></svg>
    <span>Give <span id="ctaAmt">₹100</span> every month</span>
  </button>
  <p class="give-note">Cancel anytime · 80G tax benefit · Secure payment by Razorpay</p>
  <p class="give-status" id="giveStatus" role="status"></p>
</div>
  </div>
</div>

<section class="split" aria-label="Where your money goes">
  <div class="scene-wrap">
    <figure class="scene">
      <svg id="scene" viewBox="0 0 800 460" preserveAspectRatio="xMidYMid slice" role="img" aria-labelledby="sceneTitle">
        <title id="sceneTitle">A woman with cancer lies alone in a hospital bed at night</title>
        <defs>
          <linearGradient id="winSky" x1="0" y1="0" x2="0" y2="1"><stop id="winTop" offset="0" stop-color="#1D2546"/><stop id="winBot" offset="1" stop-color="#3B3F66"/></linearGradient>
          <radialGradient id="lampGlowGrad"><stop offset="0" stop-color="#FFD98A" stop-opacity=".6"/><stop offset="1" stop-color="#FFD98A" stop-opacity="0"/></radialGradient>
          <linearGradient id="beamGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF3C8" stop-opacity=".95"/><stop offset="1" stop-color="#FFF3C8" stop-opacity="0"/></linearGradient>
          <clipPath id="glassClip"><rect x="92" y="62" width="156" height="166"/></clipPath>
          <linearGradient id="scarfGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F0A3C3"/><stop offset="1" stop-color="#D46F9A"/></linearGradient>
          <radialGradient id="pillowGrad" cx="50%" cy="35%" r="70%"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E4E6EE"/></radialGradient>
          <linearGradient id="blanketShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#1B1030" stop-opacity=".16"/></linearGradient>
          <pattern id="gown" width="4.5" height="4.5" patternUnits="userSpaceOnUse"><rect width="4.5" height="4.5" fill="#A9C7E3"/><path d="M2.25 .9 L3.6 2.25 L2.25 3.6 L.9 2.25Z" fill="#BED4EA"/></pattern>
          <radialGradient id="skinFace" gradientUnits="userSpaceOnUse" cx="-.15" cy="-.2" r="1.25"><stop offset="0" stop-color="#F0C8A2"/><stop offset=".55" stop-color="#E3B48C"/><stop offset="1" stop-color="#C99470"/></radialGradient>
          <clipPath id="eyeClip">
            <path d="M-.45 .005 Q-.38 -.075 -.3 -.077 Q-.21 -.072 -.155 .005 Q-.23 .062 -.3 .062 Q-.38 .06 -.45 .005Z"/>
            <path d="M.45 .005 Q.38 -.075 .3 -.077 Q.21 -.072 .155 .005 Q.23 .062 .3 .062 Q.38 .06 .45 .005Z"/>
          </clipPath>
        </defs>

        <rect id="wall" width="800" height="340"/>
        <rect id="wainscot" y="252" width="800" height="82"/>
        <rect id="rail" y="248" width="800" height="6"/>
        <rect id="floor" y="340" width="800" height="120"/>
        <path id="floorLines" d="M0 372 H800 M0 404 H800 M0 442 H800" stroke-width="2"/>
        <rect id="baseboard" y="334" width="800" height="8"/>

        <rect x="80" y="50" width="180" height="190" fill="#E9E4DC"/>
        <g clip-path="url(#glassClip)">
          <rect x="92" y="62" width="156" height="166" fill="url(#winSky)"/>
          <g id="winStars" fill="#fff"><circle cx="110" cy="80" r="1.3"/><circle cx="132" cy="112" r="1"/><circle cx="206" cy="78" r="1.2"/><circle cx="230" cy="122" r="1"/><circle cx="118" cy="142" r="1.1"/><circle cx="238" cy="88" r="1.3"/></g>
          <g id="moon"><circle cx="170" cy="98" r="11" fill="#F4F1DE"/><circle cx="166" cy="95" r="2.4" fill="#E3DFC6"/><circle cx="174" cy="102" r="1.8" fill="#E3DFC6"/></g>
          <g id="winSun"><circle r="28" fill="#FFE7A0" opacity=".45"/><circle r="15" fill="#F6CF62"/></g>
          <g id="winCity"><rect x="92" y="190" width="20" height="40"/><rect x="114" y="178" width="16" height="52"/><rect x="132" y="196" width="22" height="34"/><rect x="156" y="184" width="18" height="46"/><rect x="176" y="200" width="20" height="30"/><rect x="198" y="176" width="18" height="54"/><rect x="218" y="192" width="30" height="38"/></g>
        </g>
        <path d="M170 62 V228 M92 145 H248" stroke="#E9E4DC" stroke-width="5"/>
        <rect x="72" y="236" width="196" height="10" fill="#DDD5C9"/>
        <path d="M58 44 H282" stroke="#8A6A5C" stroke-width="4" stroke-linecap="round"/>
        <g id="curtainL"><path d="M70 46 H150 V246 Q130 252 110 246 Q90 252 70 246Z" fill="#D9A394"/><path d="M90 50 V244 M110 50 V246 M130 50 V244" stroke="#C98A7A" stroke-width="3"/></g>
        <g id="curtainR"><path d="M190 46 H270 V246 Q250 252 230 246 Q210 252 190 246Z" fill="#D9A394"/><path d="M210 50 V244 M230 50 V246 M250 50 V244" stroke="#C98A7A" stroke-width="3"/></g>

        <rect x="300" y="196" width="120" height="22" fill="#D9DEE6"/>
        <circle cx="322" cy="207" r="4" fill="#AEB6C2"/><circle cx="342" cy="207" r="4" fill="#7FB5C9"/><circle cx="362" cy="207" r="4" fill="#AEB6C2"/>
        <g id="wallLayer"></g>

        <rect x="180" y="298" width="100" height="8" fill="#C8B59A"/>
        <rect x="186" y="306" width="88" height="100" fill="#D9C8AE"/>
        <rect x="186" y="336" width="88" height="3" fill="#C2AE90"/>
        <rect x="222" y="318" width="16" height="4" fill="#9C8668"/>
        <rect x="190" y="406" width="8" height="14" fill="#B49E80"/><rect x="262" y="406" width="8" height="14" fill="#B49E80"/>
        <rect x="193" y="292" width="14" height="6" fill="#8A6A5C"/>
        <rect x="198.5" y="270" width="3" height="22" fill="#8A6A5C"/>
        <path d="M184 252 L216 252 L222 272 L178 272Z" fill="#F3D9A0"/>
        <g id="tableLayer"></g>
        <g id="ivLayer"></g>
        <g id="behindLayer"></g>

        <ellipse cx="482" cy="428" rx="196" ry="10" fill="#000" opacity=".12"/>
        <rect x="298" y="226" width="16" height="196" fill="#C3CAD6"/>
        <rect x="300" y="232" width="12" height="60" fill="#D5DBE5"/>
        <rect x="326" y="326" width="8" height="92" fill="#9AA3B0"/><rect x="630" y="326" width="8" height="92" fill="#9AA3B0"/>
        <circle cx="330" cy="421" r="7" fill="#3B4250"/><circle cx="634" cy="421" r="7" fill="#3B4250"/>
        <rect x="304" y="314" width="356" height="12" fill="#AEB6C2"/>
        <rect x="428" y="296" width="224" height="20" fill="#F2F3F6"/>
        <g id="headSection">
          <rect x="312" y="296" width="120" height="20" fill="#F2F3F6"/>
          <ellipse cx="350" cy="291" rx="38" ry="12" fill="url(#pillowGrad)" stroke="#E1E3EA" stroke-width="1.2"/>
          <ellipse cx="352" cy="293" rx="24" ry="5.5" fill="#C9CCD8" opacity=".45"/>
          <g class="breathe">
            <path d="M355 283 Q360 292 370 293 L384 286 Q373 283 366 275Z" fill="#D9A87F"/>
            <path d="M364 287 Q368 276 384 275 Q402 274 420 279 L444 282 L444 303 L368 303 Q360 298 364 287Z" fill="url(#gown)"/>
            <path d="M366 297 Q402 301 444 298 L444 303 L368 303Z" fill="#000" opacity=".08"/>
            <path d="M368 278 Q373 287 381 276.5 Q374 277.5 368 278Z" fill="#E3B48C"/>
            <path d="M368 278 Q373 287 381 276.5" fill="none" stroke="#8FB0CF" stroke-width="1"/>
            <path d="M372.5 280.4 Q376 279.6 379.4 278.4" fill="none" stroke="#C99470" stroke-width=".6"/>
          </g>
          <g id="heroHead">
            <g transform="translate(352 270) scale(17)">
              <path d="M-.84 .38 C-1 -.4 -.64 -1.16 0 -1.16 C.64 -1.16 1 -.4 .84 .38 C.78 .46 .7 .44 .68 .36 L-.68 .36 C-.7 .44 -.78 .46 -.84 .38Z" fill="url(#scarfGrad)"/>
              <path d="M.2 .8 Q.28 .98 .5 1.02 L.56 .74Z" fill="#C99470" opacity=".6"/>
              <path d="M-.74 -.2 C-.76 -.7 -.42 -1 0 -1 C.42 -1 .76 -.7 .74 -.2 C.73 .2 .62 .55 .42 .78 C.28 .93 .12 .99 0 .99 C-.12 .99 -.28 .93 -.42 .78 C-.62 .55 -.73 .2 -.74 -.2Z" fill="url(#skinFace)"/>
              <path d="M.74 -.2 C.73 .2 .62 .55 .42 .78 C.28 .93 .12 .99 0 .99 C.22 .88 .44 .66 .53 .4 C.61 .16 .62 -.12 .57 -.42 C.67 -.36 .75 -.3 .74 -.2Z" fill="#B98563" opacity=".35"/>
              <ellipse cx="0" cy=".84" rx=".15" ry=".055" fill="#B98563" opacity=".3"/>
              <g id="heroBags" fill="#B98563"><ellipse cx="-.3" cy=".1" rx=".13" ry=".03"/><ellipse cx=".3" cy=".1" rx=".13" ry=".03"/></g>
              <g id="heroBlush" fill="#E8919E"><ellipse cx="-.42" cy=".27" rx=".15" ry=".085"/><ellipse cx=".42" cy=".27" rx=".15" ry=".085"/></g>
              <g fill="#FBF7F2">
                <path d="M-.45 .005 Q-.38 -.075 -.3 -.077 Q-.21 -.072 -.155 .005 Q-.23 .062 -.3 .062 Q-.38 .06 -.45 .005Z"/>
                <path d="M.45 .005 Q.38 -.075 .3 -.077 Q.21 -.072 .155 .005 Q.23 .062 .3 .062 Q.38 .06 .45 .005Z"/>
              </g>
              <g clip-path="url(#eyeClip)"><g id="heroIris">
                <circle cx="-.3" cy="0" r=".062" fill="#4A2E1C"/><circle cx=".3" cy="0" r=".062" fill="#4A2E1C"/>
                <circle cx="-.3" cy="0" r=".029" fill="#140C08"/><circle cx=".3" cy="0" r=".029" fill="#140C08"/>
                <circle cx="-.278" cy="-.022" r=".016" fill="#fff"/><circle cx=".322" cy="-.022" r=".016" fill="#fff"/>
              </g></g>
              <path d="M-.43 .03 Q-.3 .088 -.17 .03 M.43 .03 Q.3 .088 .17 .03" fill="none" stroke="#B98563" stroke-width=".014" opacity=".7"/>
              <path id="heroLids" fill="url(#skinFace)"/>
              <path id="heroLash" fill="none" stroke="#1E120C" stroke-width=".032" stroke-linecap="round"/>
              <path id="heroCrease" fill="none" stroke="#B98563" stroke-width=".016" opacity=".8"/>
              <g fill="url(#skinFace)"><ellipse class="blink" cx="-.3" cy="-.012" rx=".18" ry=".085"/><ellipse class="blink" cx=".3" cy="-.012" rx=".18" ry=".085"/></g>
              <path id="heroBrows" fill="none" stroke="#3E2618" stroke-width=".05" stroke-linecap="round"/>
              <path d="M-.02 -.05 Q-.01 .1 0 .22" fill="none" stroke="#F3D2B2" stroke-width=".025" opacity=".5"/>
              <path d="M.07 -.08 Q.12 .1 .12 .24" fill="none" stroke="#B98563" stroke-width=".022" opacity=".55"/>
              <path d="M-.1 .24 Q-.15 .29 -.1 .325 M.1 .24 Q.15 .29 .1 .325 M-.06 .33 Q0 .355 .06 .33" fill="none" stroke="#B98563" stroke-width=".02" stroke-linecap="round"/>
              <g fill="#8A5A40" opacity=".7"><ellipse cx="-.06" cy=".322" rx=".024" ry=".011"/><ellipse cx=".06" cy=".322" rx=".024" ry=".011"/></g>
              <path id="heroLipU" fill="#B86A62"/><path id="heroLipL" fill="#C98079"/>
              <path id="heroMouth" fill="none" stroke="#7E3E38" stroke-width=".02" stroke-linecap="round"/>
              <path id="heroTear" d="M-.36 .11 q-.055 .085 0 .125 q.055 -.04 0 -.125z" fill="#A9DAF5"/>
              <path d="M-.76 -.08 C-.8 -.7 -.44 -1.06 0 -1.06 C.44 -1.06 .8 -.7 .76 -.08 C.66 -.36 .4 -.52 0 -.53 C-.4 -.52 -.66 -.36 -.76 -.08Z" fill="url(#scarfGrad)"/>
              <path d="M-.48 -.86 Q0 -1.02 .48 -.86 M-.74 -.2 Q-.78 -.56 -.56 -.8 M.74 -.2 Q.78 -.56 .56 -.8" fill="none" stroke="#B9577F" stroke-width=".035" opacity=".5"/>
              <g fill="#F6C1D6" opacity=".7"><circle cx="-.3" cy="-.82" r=".035"/><circle cx=".05" cy="-.9" r=".035"/><circle cx=".38" cy="-.8" r=".035"/><circle cx="-.62" cy="-.42" r=".035"/><circle cx=".62" cy="-.42" r=".035"/><circle cx="-.78" cy=".1" r=".035"/><circle cx=".8" cy=".1" r=".035"/></g>
              <path d="M.78 .2 Q1.1 .1 1.12 .36 Q1.02 .56 .8 .5Z" fill="#D46F9A"/>
              <path d="M1.02 .48 Q1.18 .82 1 1.1 Q.86 .92 .9 .56Z" fill="#C9668F"/>
            </g>
          </g>
          <ellipse cx="343" cy="293.5" rx="22" ry="5.5" fill="url(#pillowGrad)" stroke="#E1E3EA" stroke-width="1.2"/>
        </g>
        <path id="blanket" d="M404 290 Q418 279 445 280 Q480 282 520 281 Q560 279 590 273 Q606 269 620 275 Q638 281 646 276 Q652 270 656 284 L658 346 Q530 354 404 346Z"/>
        <path d="M404 290 Q418 279 445 280 Q480 282 520 281 Q560 279 590 273 Q606 269 620 275 Q638 281 646 276 Q652 270 656 284 L658 346 Q530 354 404 346Z" fill="url(#blanketShade)"/>
        <path d="M452 300 Q470 322 462 346 M522 298 Q542 324 534 350 M598 290 Q612 318 606 348 M560 280 Q588 288 618 279 M632 282 Q644 300 640 344" fill="none" stroke="#2A1A45" stroke-width="1.4" opacity=".12"/>
        <path d="M404 290 Q409 318 404 346 L420 346 Q425 318 420 288Z" fill="#F2F3F6"/>
        <g id="armSection"><g class="breathe">
          <path d="M400 285 Q409 287 417 290 L417 296.4 Q409 295 401 293Z" fill="#DDAA80"/>
          <path d="M416 290 Q428 288.6 440 288 L440.6 294 Q428 294.6 416.6 296.4Z" fill="#E0AE84"/>
          <path d="M439 287.6 Q446 285.6 452.4 287.4 Q456.4 288.6 455.8 290.6 Q451.4 292.4 447.4 292.4 Q444.2 294.2 440.4 294.2Z" fill="#E3B48C"/>
          <path d="M441.4 288 Q444.4 285.6 448 286.4" fill="none" stroke="#C48B63" stroke-width=".5"/>
          <path d="M447 288.6 L454.4 289.2 M447 290.3 L454 290.8" stroke="#C48B63" stroke-width=".45" stroke-linecap="round"/>
          <path d="M417 296 Q411 295 404 293.4" fill="none" stroke="#B98563" stroke-width=".6" opacity=".6"/>
          <path d="M379 280 Q391 279 401 284 L403 293 Q393 295 386 292 Q379 288 379 280Z" fill="url(#gown)"/>
          <rect id="ivTape" x="434.4" y="287.4" width="5.6" height="7" rx="1" fill="#fff" opacity="0" transform="rotate(-4 437 291)"/>
        </g></g>
        <rect x="648" y="260" width="16" height="162" fill="#C3CAD6"/>
        <rect x="650" y="266" width="12" height="40" fill="#D5DBE5"/>

        <g id="frontLayer"></g>
        <path id="beam" d="M150 62 L248 62 L610 340 L390 340Z" fill="url(#beamGrad)"/>
        <rect id="dark" width="800" height="460" fill="#141127"/>
        <circle id="lampGlow" cx="200" cy="270" r="150" fill="url(#lampGlowGrad)"/>
        <g id="hearts"></g>
      </svg>
    </figure>

    <div class="scene-label">
      <p class="big"><span class="pct">80%</span><span>cancer care</span></p>
      <p class="chip"><span id="careAmt">₹80</span> a month</p>
    </div>
  </div>

  <aside class="costs">
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="33" r="29" fill="#fff" opacity=".6"/>
      <rect x="19" y="16" width="26" height="34" fill="#fff" stroke="#9A3F2E" stroke-width="2"/>
      <rect x="25" y="12" width="14" height="8" fill="#DAB5AA" stroke="#9A3F2E" stroke-width="2"/>
      <path d="M24 29 l3 3 l5 -6 M35 30 h6 M24 40 l3 3 l5 -6 M35 41 h6" stroke="#9A3F2E" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <div class="text"><div class="pct">20%</div><div class="what">running costs</div></div>
    <p class="chip"><span id="costsAmt">₹20</span> a month</p>
  </aside>
</section>

<div class="story" id="story" aria-hidden="true"></div>

<p class="sr-only" aria-live="polite" id="live"></p>
`;
