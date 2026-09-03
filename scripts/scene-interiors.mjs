import {
  W, H, P, Defs, svg, light, litWindow, litArch, lanterns, hazeBand, finish, rng,
} from './art-lib.mjs';

/** Back wall, floor plane and ceiling shadow shared by every interior. */
function shell(d, { wallTop, wallBottom, floorNear, floorFar, floorY = 700 }) {
  const wall = d.vertical([['0%', wallTop, 1], ['100%', wallBottom, 1]]);
  const floor = d.vertical([['0%', floorFar, 1], ['100%', floorNear, 1]]);
  return (
    `<rect width="${W}" height="${H}" fill="url(#${wall})"/>` +
    `<path fill="url(#${floor})" d="M -40 ${floorY} L 1960 ${floorY} L 1960 1120 L -40 1120 Z"/>` +
    `<rect x="-40" y="${floorY - 6}" width="${W + 80}" height="12" fill="#000" opacity="0.35" filter="url(#blurSm)"/>` +
    `<rect x="-40" y="-40" width="${W + 80}" height="230" fill="#000" opacity="0.5" filter="url(#haze)"/>`
  );
}

/** Wooden floorboards receding toward the back wall. */
function boards(floorY, count = 16) {
  let s = '';
  for (let i = 0; i <= count; i += 1) {
    const t = i / count;
    const x = -240 + t * (W + 480);
    s += `<path d="M ${x} 1120 L ${960 + (x - 960) * 0.22} ${floorY}" stroke="#000" stroke-opacity="0.28" stroke-width="3" fill="none"/>`;
  }
  for (let i = 1; i < 7; i += 1) {
    const y = floorY + Math.pow(i / 7, 1.8) * (1080 - floorY);
    s += `<path d="M -40 ${y.toFixed(0)} L 1960 ${y.toFixed(0)}" stroke="#000" stroke-opacity="0.16" stroke-width="2" fill="none"/>`;
  }
  return s;
}

/** Simple dark column with a brass capital, for room edges. */
function column(x, top, bottom, w = 54) {
  return (
    `<g filter="url(#paintSoft)">` +
    `<rect x="${x}" y="${top}" width="${w}" height="${bottom - top}" fill="#1a1512"/>` +
    `<rect x="${x - 8}" y="${top}" width="${w + 16}" height="18" fill="#3a322a"/>` +
    `<rect x="${x - 8}" y="${bottom - 22}" width="${w + 16}" height="22" fill="#3a322a"/>` +
    `<rect x="${x + w * 0.62}" y="${top}" width="${w * 0.38}" height="${bottom - top}" fill="#000" opacity="0.35"/>` +
    `</g>`
  );
}

export function bridge() {
  const d = new Defs();
  const out = [];
  out.push(shell(d, { wallTop: '#0a1418', wallBottom: '#101a1c', floorFar: '#1b2426', floorNear: '#080d0f', floorY: 686 }));
  // curved window band looking out over the habitat
  const glassG = d.vertical([['0%', '#12262b', 1], ['70%', '#2b4c4a', 1], ['100%', '#6d5a3a', 1]]);
  out.push(`<path fill="url(#${glassG})" filter="url(#paintSoft)" d="M 150 240 C 620 132 1300 132 1770 240 L 1770 604 C 1300 560 620 560 150 604 Z"/>`);
  // distant habitat lights through the glass
  const rand = rng(4242);
  let far = '';
  for (let i = 0; i < 90; i += 1) {
    const x = 190 + rand() * 1540;
    const y = 420 + rand() * 150;
    far += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(1 + rand() * 2.4).toFixed(1)}" fill="${P.lantern}" opacity="${(0.2 + rand() * 0.6).toFixed(2)}"/>`;
  }
  out.push(far);
  out.push(`<path fill="#0b1416" opacity="0.9" d="M 150 560 C 620 516 1300 516 1770 560 L 1770 640 C 1300 596 620 596 150 640 Z"/>`);
  // mullions
  out.push(
    `<g stroke="#0a1213" stroke-width="12" opacity="0.85" fill="none">` +
      [0, 1, 2, 3, 4, 5, 6, 7, 8]
        .map((i) => {
          const x = 190 + i * 195;
          const dy = Math.abs(x - 960) * 0.055;
          return `<path d="M ${x} ${168 + dy} L ${x} ${612 - dy * 0.4}"/>`;
        })
        .join('') +
      `</g>`,
  );
  // ring of consoles
  out.push(`<path fill="#1d1712" filter="url(#paint)" d="M 250 700 C 560 640 1360 640 1670 700 L 1700 760 C 1340 692 580 692 220 760 Z"/>`);
  // the map table
  out.push(light(d, 960, 800, 620, P.gaugeGreen, 0.4, 300));
  out.push(`<ellipse cx="960" cy="880" rx="430" ry="150" fill="#150f0a" filter="url(#paintSoft)"/>`);
  out.push(`<ellipse cx="960" cy="856" rx="410" ry="134" fill="#241a10"/>`);
  const tableG = d.glow('#7fe0c4', 0.85);
  out.push(`<ellipse cx="960" cy="852" rx="360" ry="112" fill="url(#${tableG})"/>`);
  // inlaid map: brass contours and lit nodes
  out.push(
    `<g stroke="${P.brassLight}" stroke-width="3" fill="none" opacity="0.75">` +
      `<ellipse cx="960" cy="852" rx="300" ry="92"/>` +
      `<ellipse cx="960" cy="852" rx="200" ry="60"/>` +
      `<ellipse cx="960" cy="852" rx="96" ry="28"/>` +
      `<path d="M 660 852 L 1260 852 M 960 760 L 960 944"/>` +
      `</g>`,
  );
  out.push(
    [[820, 826], [1080, 878], [960, 800], [1140, 830], [780, 892], [1010, 906]]
      .map(([x, y]) => light(d, x, y, 34, P.lantern, 0.9) + `<circle cx="${x}" cy="${y}" r="5" fill="#fff2d6"/>`)
      .join(''),
  );
  out.push(column(96, 150, 760) + column(1770, 150, 760));
  out.push(lanterns(d, [[300, 214], [1620, 214]], 6));
  out.push(hazeBand(d, 520, 260, '#2f6b6d', 0.16));
  out.push(finish(d));
  return svg(d, out.join(''));
}

export function commerceLab() {
  const d = new Defs();
  const out = [];
  out.push(shell(d, { wallTop: '#14100c', wallBottom: '#241a12', floorFar: '#2a2018', floorNear: '#0c0907', floorY: 660 }));
  out.push(boards(660));
  out.push(light(d, 960, 380, 900, P.ember, 0.22));
  // roof trusses
  out.push(
    `<g stroke="#241b13" stroke-width="14" fill="none" opacity="0.9">` +
      [0, 1, 2].map((i) => `<path d="M ${180 + i * 600} 60 L ${480 + i * 600} 210 L ${780 + i * 600} 60"/>`).join('') +
      `<path d="M -40 214 L 1960 214" stroke-width="18"/>` +
      `</g>`,
  );
  // three brass presses along the back
  const brassG = d.vertical([['0%', '#e8bd72', 1], ['40%', '#a97b34', 1], ['100%', '#4d3612', 1]]);
  for (let i = 0; i < 3; i += 1) {
    const x = 240 + i * 300;
    out.push(light(d, x + 90, 480, 260, P.amber, 0.3));
    out.push(
      `<g filter="url(#paintSoft)">` +
        `<rect x="${x}" y="300" width="180" height="360" rx="10" fill="url(#${brassG})"/>` +
        `<rect x="${x + 118}" y="300" width="62" height="360" fill="#000" opacity="0.32"/>` +
        `<rect x="${x - 16}" y="286" width="212" height="26" rx="8" fill="#c79a4c"/>` +
        `<rect x="${x + 30}" y="380" width="120" height="120" rx="6" fill="#160f08"/>` +
        `<circle cx="${x + 90}" cy="270" r="46" fill="none" stroke="#c79a4c" stroke-width="14"/>` +
        `<path d="M ${x + 90} 224 L ${x + 90} 316 M ${x + 44} 270 L ${x + 136} 270" stroke="#c79a4c" stroke-width="9"/>` +
        `</g>`,
    );
    out.push(litWindow(d, x + 44, 396, 92, 44, P.ember, 4));
  }
  // belt of printed panels sweeping to the front right
  out.push(
    `<g filter="url(#paintSoft)">` +
      `<path fill="#1a1410" d="M 300 700 L 1880 836 L 1880 934 L 300 780 Z"/>` +
      `<path fill="#2d2419" d="M 300 690 L 1880 826 L 1880 846 L 300 710 Z"/>` +
      `</g>`,
  );
  for (let i = 0; i < 9; i += 1) {
    const t = i / 8;
    const x = 340 + t * 1440;
    const y = 694 + t * 130;
    const s = 1 + t * 0.9;
    out.push(
      `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${s.toFixed(2)})">` +
        `<rect x="-46" y="-58" width="92" height="60" rx="4" fill="#e8d9b8" opacity="0.92"/>` +
        `<rect x="-46" y="-58" width="92" height="60" rx="4" fill="none" stroke="#8a6f45" stroke-width="2"/>` +
        `<rect x="-34" y="-46" width="46" height="8" fill="#a97b34" opacity="0.8"/>` +
        `<rect x="-34" y="-30" width="66" height="6" fill="#c1a679" opacity="0.7"/>` +
        `</g>`,
    );
  }
  out.push(light(d, 1500, 830, 420, P.amber, 0.3));
  out.push(lanterns(d, [[200, 250], [700, 250], [1220, 250], [1720, 250]], 6));
  out.push(hazeBand(d, 300, 300, '#ff8f45', 0.1));
  out.push(finish(d));
  return svg(d, out.join(''));
}

export function contentEngine() {
  const d = new Defs();
  const out = [];
  out.push(shell(d, { wallTop: '#080d10', wallBottom: '#111a1d', floorFar: '#1b2326', floorNear: '#070b0d', floorY: 640 }));
  // hangar ribs vanishing to the back
  for (let i = 0; i < 6; i += 1) {
    const t = i / 5;
    const w = 1720 - t * 1180;
    const top = 120 + t * 250;
    const x = 960 - w / 2;
    out.push(
      `<path fill="none" stroke="#1b2427" stroke-width="${(26 - t * 16).toFixed(0)}" d="M ${x} 700 L ${x} ${top + w * 0.16} A ${w / 2} ${w * 0.34} 0 0 1 ${x + w} ${top + w * 0.16} L ${x + w} 700"/>`,
    );
  }
  out.push(light(d, 960, 470, 520, '#2f6b6d', 0.22));
  // gantries: two receding rows of identical craft flanking a central aisle
  const craft = (x, y, k, lit) =>
    `<g transform="translate(${x} ${y}) scale(${k})" filter="url(#paintSoft)">` +
    `<path stroke="#1b2225" stroke-width="${(14 / k).toFixed(1)}" d="M -104 26 L -104 108 M 104 26 L 104 108"/>` +
    `<path fill="${lit ? '#5c4f3a' : '#222c2f'}" d="M -150 0 L -60 -54 L 60 -54 L 150 0 L 60 26 L -60 26 Z"/>` +
    `<path fill="${lit ? '#7d6a49' : '#2e3a3d'}" d="M -60 -54 L 60 -54 L 34 -84 L -34 -84 Z"/>` +
    (lit ? `<rect x="-16" y="-80" width="32" height="20" rx="5" fill="#ffdca6" opacity="0.95"/>` : '') +
    `<path fill="#0a0f11" opacity="0.55" d="M -150 0 L 150 0 L 60 26 L -60 26 Z"/>` +
    `<path fill="#ffdca6" opacity="${lit ? 0.3 : 0.12}" d="M -150 0 L -60 -54 L -46 -54 L -132 2 Z"/>` +
    `</g>`;

  // gantry frames behind each rank, then the craft themselves
  for (let i = 0; i < 4; i += 1) {
    const k = 0.42 + i * 0.2;
    const y = 500 + i * 118;
    const dx = 230 + i * 210;
    const railW = 170 * k;
    out.push(
      `<g stroke="${P.brass}" stroke-width="${(4 + i * 1.6).toFixed(1)}" fill="none" opacity="${(0.28 + i * 0.08).toFixed(2)}">` +
        `<path d="M ${960 - dx - railW} ${y - 110} L ${960 - dx + railW} ${y - 110}"/>` +
        `<path d="M ${960 + dx - railW} ${y - 110} L ${960 + dx + railW} ${y - 110}"/>` +
        `<path d="M ${960 - dx - railW} ${y - 110} L ${960 - dx - railW} ${y + 70}"/>` +
        `<path d="M ${960 + dx + railW} ${y - 110} L ${960 + dx + railW} ${y + 70}"/>` +
        `</g>`,
    );
    out.push(craft(960 - dx, y, k, false));
    out.push(craft(960 + dx, y, k, false));
    out.push(lanterns(d, [[960 - dx, y - 116], [960 + dx, y - 116]], 3 + i));
  }

  // the master unit, centred on the aisle and lit
  out.push(light(d, 960, 700, 620, P.amber, 0.5));
  out.push(craft(960, 726, 1.25, true));

  // floor markings
  out.push(
    `<g stroke="${P.brass}" stroke-width="5" opacity="0.3" fill="none">` +
      `<path d="M 560 1040 L 810 700 M 1360 1040 L 1110 700"/>` +
      `</g>`,
  );
  out.push(hazeBand(d, 560, 300, '#1d454b', 0.24));
  out.push(finish(d));
  return svg(d, out.join(''));
}

export function mediaBay() {
  const d = new Defs();
  const out = [];
  out.push(shell(d, { wallTop: '#1a140e', wallBottom: '#2a2016', floorFar: '#2e2418', floorNear: '#0d0a07', floorY: 720 }));
  out.push(boards(720));
  // tall arched windows down the left, night outside
  for (let i = 0; i < 3; i += 1) {
    const x = 96 + i * 210;
    out.push(`<path fill="#0c181c" d="M ${x} 620 L ${x} 260 A 70 70 0 0 1 ${x + 140} 260 L ${x + 140} 620 Z"/>`);
    out.push(litArch(d, x + 12, 210, 116, 400, '#20404a'));
    out.push(
      `<g stroke="#120e0a" stroke-width="8" fill="none">` +
        `<path d="M ${x + 70} 200 L ${x + 70} 620 M ${x} 340 L ${x + 140} 340 M ${x} 460 L ${x + 140} 460"/>` +
        `</g>`,
    );
  }
  // wall of pinned proofs on the back-right
  out.push(light(d, 950, 400, 560, P.amber, 0.24));
  const rand = rng(777);
  for (let r = 0; r < 4; r += 1) {
    for (let c = 0; c < 5; c += 1) {
      const x = 604 + c * 124 + (rand() - 0.5) * 12;
      const y = 200 + r * 122 + (rand() - 0.5) * 12;
      const rot = ((rand() - 0.5) * 7).toFixed(1);
      out.push(
        `<g transform="rotate(${rot} ${x.toFixed(0)} ${y.toFixed(0)})">` +
          `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="102" height="92" fill="#e6d6b4" opacity="0.9"/>` +
          `<rect x="${(x + 10).toFixed(0)}" y="${(y + 12).toFixed(0)}" width="60" height="9" fill="#7a6440" opacity="0.7"/>` +
          `<rect x="${(x + 10).toFixed(0)}" y="${(y + 30).toFixed(0)}" width="80" height="6" fill="#9e8a63" opacity="0.6"/>` +
          `<rect x="${(x + 10).toFixed(0)}" y="${(y + 44).toFixed(0)}" width="72" height="6" fill="#9e8a63" opacity="0.5"/>` +
          `<rect x="${(x + 10).toFixed(0)}" y="${(y + 58).toFixed(0)}" width="46" height="22" fill="#a97b34" opacity="0.55"/>` +
          `<circle cx="${(x + 51).toFixed(0)}" cy="${(y + 5).toFixed(0)}" r="4" fill="${P.brassLight}"/>` +
          `</g>`,
      );
    }
  }
  // the great iron press, foreground right
  out.push(light(d, 1420, 780, 460, P.ember, 0.34));
  out.push(
    `<g filter="url(#paint)">` +
      `<rect x="1180" y="380" width="86" height="560" fill="#171310"/>` +
      `<rect x="1560" y="380" width="86" height="560" fill="#171310"/>` +
      `<rect x="1140" y="352" width="546" height="60" rx="8" fill="#231c16"/>` +
      `<rect x="1140" y="900" width="546" height="70" rx="8" fill="#231c16"/>` +
      `<rect x="1250" y="700" width="330" height="60" rx="6" fill="#3a2f22"/>` +
      `<rect x="1250" y="770" width="330" height="26" rx="4" fill="#0e0b09"/>` +
      `</g>`,
  );
  // the screw and its great wheel
  out.push(
    `<g stroke="#c79a4c" stroke-width="14" fill="none" opacity="0.9">` +
      `<path d="M 1413 412 L 1413 700"/>` +
      `<circle cx="1413" cy="470" r="120"/>` +
      `<path d="M 1293 470 L 1533 470 M 1413 350 L 1413 590 M 1328 385 L 1498 555 M 1498 385 L 1328 555"/>` +
      `</g>`,
  );
  out.push(`<rect x="1290" y="742" width="246" height="16" fill="#e6d6b4" opacity="0.9"/>`);
  out.push(lanterns(d, [[420, 190], [900, 160], [1413, 170]], 7));
  out.push(hazeBand(d, 300, 340, '#ffb861', 0.1));
  out.push(finish(d));
  return svg(d, out.join(''));
}

export function researchLab() {
  const d = new Defs();
  const out = [];
  out.push(shell(d, { wallTop: '#071014', wallBottom: '#0e1a1c', floorFar: '#1a2422', floorNear: '#070c0c', floorY: 720 }));
  // dome glazing overhead, night sky beyond
  out.push(`<path fill="#0a1a20" d="M 120 720 A 840 620 0 0 1 1800 720 Z"/>`);
  const rand = rng(1357);
  let stars = '';
  for (let i = 0; i < 120; i += 1) {
    const x = 160 + rand() * 1600;
    const y = 120 + rand() * 520;
    stars += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(0.7 + rand() * 1.6).toFixed(1)}" fill="#cfe9e0" opacity="${(0.15 + rand() * 0.6).toFixed(2)}"/>`;
  }
  out.push(stars);
  out.push(
    `<g stroke="#0d2226" stroke-width="12" fill="none" opacity="0.95">` +
      [0, 1, 2, 3, 4, 5, 6]
        .map((i) => {
          const a = (Math.PI * i) / 6;
          const x = 960 - Math.cos(a) * 840;
          return `<path d="M ${x.toFixed(0)} 720 A 840 620 0 0 1 ${(960 + Math.cos(a) * 840).toFixed(0)} 720" ` +
            `transform="rotate(0)"/>`;
        })
        .join('') +
      `<path d="M 320 470 A 660 380 0 0 0 1600 470" />` +
      `<path d="M 480 300 A 480 240 0 0 0 1440 300" />` +
      `</g>`,
  );
  // vines creeping over the inside of the glass
  out.push(
    `<g stroke="#1c3a2c" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.85">` +
      `<path d="M 140 720 C 210 560 260 470 400 360"/>` +
      `<path d="M 1790 720 C 1720 560 1670 470 1530 360"/>` +
      `<path d="M 300 600 C 420 560 520 520 610 430"/>` +
      `</g>`,
  );
  // brass telescope on its mount
  out.push(light(d, 730, 620, 420, P.amber, 0.26));
  out.push(
    `<g filter="url(#paintSoft)">` +
      `<path fill="#1c1712" d="M 660 1000 L 800 1000 L 776 760 L 684 760 Z"/>` +
      `<rect x="612" y="980" width="236" height="30" rx="8" fill="#2a231c"/>` +
      `<g transform="rotate(-34 730 720)">` +
      `<rect x="470" y="678" width="520" height="86" rx="42" fill="#a97b34"/>` +
      `<rect x="470" y="678" width="520" height="30" rx="15" fill="#e8bd72" opacity="0.75"/>` +
      `<rect x="946" y="666" width="72" height="110" rx="14" fill="#c79a4c"/>` +
      `<rect x="430" y="690" width="60" height="62" rx="12" fill="#7a5a1e"/>` +
      `</g>` +
      `<circle cx="730" cy="760" r="34" fill="#3a332b"/>` +
      `</g>`,
  );
  out.push(light(d, 986, 528, 150, P.lantern, 0.5));
  // bank of round green-lit gauges
  out.push(
    `<g filter="url(#paintSoft)">` +
      `<rect x="1210" y="600" width="560" height="330" rx="14" fill="#241d16"/>` +
      `<rect x="1210" y="600" width="560" height="26" rx="10" fill="#3a2f22"/>` +
      `<rect x="1180" y="920" width="620" height="34" rx="10" fill="#191410"/>` +
      `</g>`,
  );
  for (let r = 0; r < 2; r += 1) {
    for (let c = 0; c < 4; c += 1) {
      const cx = 1290 + c * 130;
      const cy = 690 + r * 150;
      out.push(light(d, cx, cy, 110, P.gaugeGreen, 0.42));
      out.push(
        `<circle cx="${cx}" cy="${cy}" r="52" fill="#0e1a14"/>` +
          `<circle cx="${cx}" cy="${cy}" r="46" fill="${P.gaugeGreen}" opacity="0.32"/>` +
          `<circle cx="${cx}" cy="${cy}" r="52" fill="none" stroke="${P.brassLight}" stroke-width="6"/>` +
          `<path d="M ${cx} ${cy} L ${cx + 30 * Math.cos((r + c) * 0.9 - 2.2)} ${cy + 30 * Math.sin((r + c) * 0.9 - 2.2)}" stroke="#eafff2" stroke-width="4"/>` +
          `<circle cx="${cx}" cy="${cy}" r="6" fill="${P.brassLight}"/>`,
      );
    }
  }
  out.push(lanterns(d, [[430, 380], [1500, 380]], 6));
  out.push(hazeBand(d, 560, 320, '#2f6b6d', 0.2));
  out.push(finish(d));
  return svg(d, out.join(''));
}

export function treasury() {
  const d = new Defs();
  const out = [];
  out.push(shell(d, { wallTop: '#0e0b08', wallBottom: '#1d1610', floorFar: '#2a2118', floorNear: '#0a0806', floorY: 700 }));
  // rough-hewn vault walls
  out.push(
    `<g filter="url(#paint)" fill="#191410">` +
      `<path d="M -40 700 L -40 -40 L 380 -40 L 300 260 L 360 700 Z"/>` +
      `<path d="M 1960 700 L 1960 -40 L 1540 -40 L 1620 260 L 1560 700 Z"/>` +
      `</g>`,
  );
  out.push(`<path fill="#120e0a" d="M 360 700 L 1560 700 L 1560 200 A 600 240 0 0 0 360 200 Z"/>`);
  // coin trays stacked along both sides
  const tray = (x, y, s) =>
    `<g transform="translate(${x} ${y}) scale(${s})">` +
    `<path fill="#2c2318" d="M -130 0 L 130 0 L 108 46 L -108 46 Z"/>` +
    `<path fill="#3d3122" d="M -130 0 L 130 0 L 116 -18 L -116 -18 Z"/>` +
    [0, 1, 2, 3, 4, 5]
      .map((i) => {
        const cx = -96 + i * 38;
        return `<ellipse cx="${cx}" cy="-6" rx="17" ry="7" fill="#d9a75a"/>` +
          `<ellipse cx="${cx}" cy="-13" rx="17" ry="7" fill="#e8bd72"/>` +
          `<ellipse cx="${cx}" cy="-20" rx="17" ry="7" fill="#ffdca6"/>`;
      })
      .join('') +
    `</g>`;
  out.push(light(d, 400, 800, 420, P.brassLight, 0.24));
  out.push(light(d, 1520, 800, 420, P.brassLight, 0.24));
  out.push(tray(400, 810, 1.15) + tray(400, 900, 1.3) + tray(392, 1000, 1.45));
  out.push(tray(1520, 810, 1.15) + tray(1520, 900, 1.3) + tray(1528, 1000, 1.45));
  out.push(tray(700, 726, 0.8) + tray(1220, 726, 0.8));
  // pedestal and the glowing scale
  out.push(light(d, 960, 660, 620, P.brassLight, 0.42));
  out.push(
    `<g filter="url(#paintSoft)">` +
      `<path fill="#241c14" d="M 856 1000 L 1064 1000 L 1024 700 L 896 700 Z"/>` +
      `<rect x="820" y="988" width="280" height="34" rx="10" fill="#332920"/>` +
      `<rect x="880" y="676" width="160" height="30" rx="8" fill="#3d3122"/>` +
      `</g>`,
  );
  out.push(
    `<g stroke="#e8bd72" stroke-width="11" fill="none" stroke-linecap="round">` +
      `<path d="M 960 676 L 960 470"/>` +
      `<path d="M 790 470 L 1130 470"/>` +
      `<path d="M 790 470 L 790 560 M 1130 470 L 1130 542"/>` +
      `</g>`,
  );
  out.push(
    `<path fill="#c79a4c" d="M 706 560 L 874 560 L 838 610 L 742 610 Z"/>` +
      `<path fill="#c79a4c" d="M 1046 542 L 1214 542 L 1178 592 L 1082 592 Z"/>`,
  );
  out.push(light(d, 790, 566, 190, P.lantern, 0.75));
  out.push(light(d, 1130, 548, 160, P.lantern, 0.6));
  out.push(`<circle cx="960" cy="470" r="15" fill="#ffdca6"/>`);
  out.push(lanterns(d, [[560, 300], [1360, 300], [960, 250]], 6));
  out.push(hazeBand(d, 420, 320, '#d9a75a', 0.1));
  out.push(finish(d));
  return svg(d, out.join(''));
}

export function radarBay() {
  const d = new Defs();
  const out = [];
  out.push(`<rect width="${W}" height="${H}" fill="#04080a"/>`);
  // the curved inner shell
  const shellG = d.glow('#123038', 1);
  out.push(`<ellipse cx="960" cy="540" rx="1180" ry="820" fill="url(#${shellG})" opacity="0.55"/>`);
  out.push(
    `<g stroke="#0e2830" stroke-width="7" fill="none" opacity="0.9">` +
      [0.24, 0.42, 0.6, 0.78, 0.96]
        .map((k) => `<ellipse cx="960" cy="540" rx="${(1150 * k).toFixed(0)}" ry="${(800 * k).toFixed(0)}"/>`)
        .join('') +
      [0, 1, 2, 3, 4, 5, 6, 7]
        .map((i) => {
          const a = (Math.PI * i) / 8;
          return `<path d="M ${(960 - Math.cos(a) * 1150).toFixed(0)} ${(540 - Math.sin(a) * 800).toFixed(0)} ` +
            `L ${(960 + Math.cos(a) * 1150).toFixed(0)} ${(540 + Math.sin(a) * 800).toFixed(0)}"/>`;
        })
        .join('') +
      `</g>`,
  );
  // dense points of light across the curved wall
  const rand = rng(20250903);
  let pts = '';
  for (let i = 0; i < 900; i += 1) {
    const a = rand() * Math.PI * 2;
    const rr = Math.sqrt(rand());
    const x = 960 + Math.cos(a) * rr * 1140;
    const y = 540 + Math.sin(a) * rr * 790;
    const r = (0.7 + rand() * 2.3).toFixed(1);
    const warm = rand() > 0.72;
    pts += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r}" fill="${warm ? P.lantern : P.gaugeGreen}" opacity="${(0.18 + rand() * 0.7).toFixed(2)}"/>`;
  }
  out.push(pts);
  // a few brighter contacts with halos
  out.push(
    [[520, 330], [1420, 400], [1180, 760], [660, 720], [960, 250]]
      .map(([x, y]) => light(d, x, y, 90, P.ember, 0.55) + `<circle cx="${x}" cy="${y}" r="6" fill="#fff0d8"/>`)
      .join(''),
  );
  // the walkway and the single chair
  out.push(`<path fill="#0a1214" filter="url(#paintSoft)" d="M 700 1080 L 1220 1080 L 1060 706 L 860 706 Z"/>`);
  out.push(
    `<g stroke="#2b4a4e" stroke-width="7" fill="none" opacity="0.9">` +
      `<path d="M 760 1080 L 890 706 M 1160 1080 L 1030 706"/>` +
      `<path d="M 820 900 L 1100 900 M 800 980 L 1120 980"/>` +
      `</g>`,
  );
  out.push(light(d, 960, 700, 340, P.gaugeGreen, 0.3));
  out.push(
    `<g filter="url(#paintSoft)">` +
      `<path fill="#1a1512" d="M 892 862 L 1028 862 L 1042 700 L 878 700 Z"/>` +
      `<path fill="#241c16" d="M 878 706 L 1042 706 L 1028 640 L 892 640 Z"/>` +
      `<path fill="#0f0c0a" d="M 900 640 L 1020 640 L 1006 512 L 914 512 Z"/>` +
      `<rect x="906" y="856" width="108" height="20" rx="6" fill="#2b231c"/>` +
      `</g>`,
  );
  out.push(light(d, 960, 566, 150, P.gaugeGreen, 0.35));
  out.push(hazeBand(d, 460, 420, '#1d454b', 0.18));
  out.push(finish(d));
  return svg(d, out.join(''));
}

export function archives() {
  const d = new Defs();
  const out = [];
  out.push(shell(d, { wallTop: '#100c08', wallBottom: '#241a11', floorFar: '#2c2117', floorNear: '#0b0806', floorY: 740 }));
  out.push(boards(740));
  // shelving down both walls
  const shelf = (x, flip) =>
    `<g transform="translate(${x} 0) scale(${flip ? -1 : 1} 1)" filter="url(#paintSoft)">` +
    `<path fill="#1a1209" d="M 0 140 L 300 250 L 300 900 L 0 940 Z"/>` +
    [0, 1, 2, 3]
      .map((r) => {
        const y = 300 + r * 150;
        let books = `<path fill="#2b1e12" d="M 20 ${y} L 290 ${y + 60} L 290 ${y + 78} L 20 ${y + 22} Z"/>`;
        for (let i = 0; i < 12; i += 1) {
          const t = i / 12;
          const bx = 30 + t * 244;
          const by = y - 60 + t * 54;
          const hgt = 56 + (i % 3) * 10;
          const col = ['#5a2f22', '#3f4a2c', '#4a3a1f', '#2f3a44'][i % 4];
          books += `<rect x="${bx.toFixed(0)}" y="${by.toFixed(0)}" width="15" height="${hgt}" fill="${col}"/>`;
        }
        return books;
      })
      .join('') +
    `</g>`;
  out.push(shelf(-30, false));
  out.push(shelf(1950, true));
  // sloped reading desks with chained books
  const desk = (x, y, s) =>
    `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#paintSoft)">` +
    `<path fill="#2e2114" d="M -210 0 L 210 0 L 190 -120 L -190 -120 Z"/>` +
    `<path fill="#3d2c1a" d="M -196 -118 L 196 -118 L 176 -196 L -176 -196 Z"/>` +
    `<path fill="#e3d3ae" opacity="0.92" d="M -120 -130 L 40 -130 L 26 -196 L -104 -196 Z"/>` +
    `<path fill="#cdb98f" opacity="0.9" d="M -120 -130 L 40 -130 L 44 -122 L -116 -122 Z"/>` +
    `<path stroke="#6b6152" stroke-width="4" fill="none" d="M 120 -120 C 128 -70 96 -40 60 -30"/>` +
    `<path fill="#1d1409" d="M -230 0 L -196 0 L -186 150 L -222 150 Z M 196 0 L 230 0 L 222 150 L 186 150 Z"/>` +
    `</g>`;
  out.push(light(d, 620, 700, 480, P.amber, 0.3));
  out.push(light(d, 1300, 700, 480, P.amber, 0.26));
  out.push(desk(620, 900, 1.05));
  out.push(desk(1300, 900, 1.05));
  out.push(desk(960, 780, 0.72));
  // hanging lanterns on long chains
  [[620, 300], [1300, 300], [960, 240]].forEach(([x, y]) => {
    out.push(`<path d="M ${x} 0 L ${x} ${y}" stroke="#3a2f22" stroke-width="4" fill="none"/>`);
    out.push(light(d, x, y + 46, 260, P.lantern, 0.55));
    out.push(
      `<path fill="#4a3a1f" d="M ${x - 30} ${y + 20} L ${x + 30} ${y + 20} L ${x + 22} ${y + 84} L ${x - 22} ${y + 84} Z"/>` +
        `<rect x="${x - 22}" y="${y + 28}" width="44" height="48" fill="${P.lantern}" opacity="0.9"/>` +
        `<path fill="#4a3a1f" d="M ${x - 34} ${y + 84} L ${x + 34} ${y + 84} L ${x + 26} ${y + 96} L ${x - 26} ${y + 96} Z"/>`,
    );
  });
  out.push(hazeBand(d, 420, 340, '#ffb861', 0.09));
  out.push(finish(d));
  return svg(d, out.join(''));
}
