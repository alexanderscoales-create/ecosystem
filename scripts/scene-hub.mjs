import {
  W, H, P, Defs, svg, light, litWindow, litArch, glowingArch, lanterns, runOfPoints,
  hazeBand, finish, rng,
} from './art-lib.mjs';

export function hub() {
  const d = new Defs();
  const rand = rng(90210);
  const out = [];

  // --- sky -----------------------------------------------------------------
  const sky = d.vertical([
    ['0%', P.night, 1],
    ['30%', '#0a171d', 1],
    ['58%', '#16333a', 1],
    ['74%', '#3a4a44', 1],
    ['86%', '#0a1216', 1],
    ['100%', P.night, 1],
  ]);
  out.push(`<rect width="${W}" height="${H}" fill="url(#${sky})"/>`);
  out.push(light(d, 960, 470, 1180, '#ffb861', 0.2, 340));
  out.push(light(d, 1580, 300, 620, '#2f6b6d', 0.18));

  // --- far ridges ----------------------------------------------------------
  const ridgeFar = d.vertical([['0%', '#122229', 1], ['100%', '#0b161b', 1]]);
  out.push(
    `<path filter="url(#paintSoft)" fill="url(#${ridgeFar})" d="M -40 470 L 120 392 L 300 430 L 470 356 L 640 424 L 830 372 L 1010 428 L 1210 366 L 1400 424 L 1600 380 L 1790 430 L 1960 398 L 1960 560 L -40 560 Z"/>`,
  );
  const ridgeNear = d.vertical([['0%', '#0c191e', 1], ['100%', '#070f13', 1]]);
  out.push(
    `<path filter="url(#paintSoft)" fill="url(#${ridgeNear})" d="M -40 520 L 200 468 L 430 512 L 700 462 L 980 516 L 1260 470 L 1520 514 L 1780 476 L 1960 512 L 1960 660 L -40 660 Z"/>`,
  );
  out.push(hazeBand(d, 400, 190, '#2f6b6d', 0.3));

  // --- ground --------------------------------------------------------------
  const ground = d.vertical([
    ['0%', '#111d20', 1],
    ['40%', '#0d181b', 1],
    ['100%', '#050a0c', 1],
  ]);
  out.push(
    `<path fill="url(#${ground})" d="M -40 520 C 300 496 620 548 960 536 C 1300 524 1620 560 1960 528 L 1960 1120 L -40 1120 Z"/>`,
  );

  // dark water pools between the structures
  const water = d.vertical([['0%', '#0e2a2e', 0.95], ['100%', '#050d10', 1]]);
  const pools = [
    [720, 906, 250, 54], [1090, 972, 300, 60], [1640, 884, 210, 44], [400, 830, 160, 32],
  ];
  out.push(
    pools
      .map(([cx, cy, rx, ry]) =>
        `<ellipse filter="url(#paintSoft)" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${water})"/>`)
      .join(''),
  );
  out.push(
    pools
      .map(([cx, cy, rx, ry]) =>
        `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#2f6b6d" stroke-opacity="0.14" stroke-width="3"/>` +
        `<ellipse cx="${cx}" cy="${cy - ry * 0.3}" rx="${rx * 0.55}" ry="${ry * 0.22}" fill="#ffdca6" opacity="0.07"/>`)
      .join(''),
  );

  // --- observation dome (research lab), 67-85% x, 27-47% y ------------------
  out.push(structureDome(d));

  // --- printing house (media bay), 11.5-29.5% x, 28.5-47% y -----------------
  out.push(structurePrintHouse(d));

  // --- central tower + penthouse (bridge) -----------------------------------
  out.push(structureTower(d));

  // --- half-buried hangar (content engine) ----------------------------------
  out.push(structureHangar(d));

  // --- vault in rock (treasury) --------------------------------------------
  out.push(structureVault(d));

  // --- fabrication hall at the tower base (commerce lab) --------------------
  out.push(structureFabHall(d));

  // --- spherical chamber (radar bay) ---------------------------------------
  out.push(structureSphere(d));

  // --- library (archives) ---------------------------------------------------
  out.push(structureLibrary(d));

  // --- footpaths, bridges, lanterns ----------------------------------------
  const pathInk = 'rgba(60,52,42,0.75)';
  out.push(
    `<g filter="url(#paintSoft)" stroke="${pathInk}" stroke-linecap="round" fill="none">` +
      `<path d="M 300 780 C 470 812 620 806 780 828" stroke-width="14"/>` +
      `<path d="M 470 700 C 560 726 640 742 760 762" stroke-width="11"/>` +
      `<path d="M 1130 812 C 1230 830 1290 826 1340 838" stroke-width="13"/>` +
      `<path d="M 1140 760 C 1300 712 1440 690 1620 700" stroke-width="11"/>` +
      `<path d="M 560 872 C 700 902 850 900 960 886" stroke-width="12"/>` +
      `<path d="M 1440 560 C 1420 620 1330 660 1200 706" stroke-width="9"/>` +
      `</g>`,
  );
  // narrow bridges over the water
  out.push(
    `<g stroke="#4b4136" fill="none" stroke-linecap="square">` +
      `<path d="M 628 886 L 880 870" stroke-width="9"/>` +
      `<path d="M 628 886 L 880 870" stroke-width="2" stroke="#8a7a62" opacity="0.45"/>` +
      `<path d="M 1196 938 L 1400 908" stroke-width="8"/>` +
      `<path d="M 1196 938 L 1400 908" stroke-width="2" stroke="#8a7a62" opacity="0.45"/>` +
      `</g>`,
  );
  out.push(
    lanterns(d, [
      ...runOfPoints(320, 774, 770, 818, 5),
      ...runOfPoints(1150, 802, 1345, 828, 3),
      ...runOfPoints(1180, 748, 1610, 696, 4),
      ...runOfPoints(620, 878, 890, 862, 4),
      ...runOfPoints(490, 692, 750, 750, 3),
    ], 3),
  );

  // scattered ember motes for depth
  let motes = '';
  for (let i = 0; i < 70; i += 1) {
    const x = Math.round(rand() * W);
    const y = Math.round(440 + rand() * 560);
    const r = (0.8 + rand() * 1.9).toFixed(2);
    motes += `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.lantern}" opacity="${(0.12 + rand() * 0.4).toFixed(2)}"/>`;
  }
  out.push(motes);

  out.push(hazeBand(d, 620, 260, '#1d454b', 0.2));
  out.push(hazeBand(d, 880, 300, '#0a1216', 0.5));
  out.push(finish(d));
  return svg(d, out.join(''));
}

function structureTower(d) {
  const body = d.vertical([['0%', '#3a322a', 1], ['55%', '#241f1b', 1], ['100%', '#120f0c', 1]]);
  const glassG = d.vertical([['0%', '#ffdca6', 0.95], ['55%', '#ffb861', 0.9], ['100%', '#3f8f83', 0.8]]);
  let s = '';
  // shaft
  s += `<g filter="url(#paint)">`;
  s += `<path fill="url(#${body})" d="M 906 262 L 1014 262 L 1046 690 L 874 690 Z"/>`;
  s += `<path fill="#0d0b09" opacity="0.55" d="M 986 262 L 1014 262 L 1046 690 L 998 690 Z"/>`;
  // stone banding
  for (let i = 0; i < 5; i += 1) {
    const y = 320 + i * 74;
    s += `<rect x="${884 + (690 - y) * 0.01}" y="${y}" width="${152 + i * 6}" height="7" fill="#4a4038" opacity="0.5"/>`;
  }
  s += `</g>`;
  // small lit slit windows up the shaft
  for (let i = 0; i < 4; i += 1) {
    s += litWindow(d, 946 + i * 2, 340 + i * 78, 14, 30, P.amber, 6);
  }
  // penthouse: glowing glass drum with a copper cap
  s += light(d, 960, 196, 430, P.amber, 0.42);
  s += `<g filter="url(#paintSoft)">`;
  s += `<path fill="url(#${glassG})" d="M 872 262 L 886 138 A 76 34 0 0 1 1034 138 L 1048 262 Z"/>`;
  s += `<path fill="#0f1a1c" opacity="0.35" d="M 900 258 L 908 152 L 926 152 L 918 258 Z M 954 258 L 956 146 L 972 146 L 970 258 Z M 1006 258 L 998 152 L 1014 152 L 1024 258 Z"/>`;
  s += `<path fill="#2f6b6d" d="M 878 140 A 82 40 0 0 1 1042 140 A 82 26 0 0 0 878 140 Z"/>`;
  s += `<path fill="#3f8f83" d="M 906 116 A 54 30 0 0 1 1014 116 A 54 20 0 0 0 906 116 Z"/>`;
  s += `<rect x="954" y="82" width="12" height="36" fill="#3f8f83"/>`;
  s += `</g>`;
  s += light(d, 960, 88, 74, P.lantern, 0.85);
  // balcony ring
  s += `<path fill="#3a322a" d="M 862 262 L 1058 262 L 1050 282 L 870 282 Z"/>`;
  return s;
}

function structureFabHall(d) {
  const stone = d.vertical([['0%', '#3a322a', 1], ['100%', '#161310', 1]]);
  let s = '';
  s += light(d, 960, 800, 480, P.ember, 0.3);
  s += `<g filter="url(#paint)">`;
  // plinth
  s += `<path fill="#1a1613" d="M 754 856 L 1166 856 L 1196 900 L 724 900 Z"/>`;
  // hall mass
  s += `<path fill="url(#${stone})" d="M 790 656 L 1130 656 L 1148 858 L 772 858 Z"/>`;
  // roof slab
  s += `<path fill="#4a4038" d="M 776 640 L 1144 640 L 1152 668 L 768 668 Z"/>`;
  s += `</g>`;
  // three open arches, light pouring out
  s += glowingArch(d, 806, 716, 84, 142, P.ember, 0.95);
  s += glowingArch(d, 918, 706, 92, 152, P.amber, 1);
  s += glowingArch(d, 1036, 716, 84, 142, P.ember, 0.95);
  // hanging work lights under the eaves
  s += lanterns(d, [[830, 690], [960, 682], [1092, 690]], 4);
  return s;
}

function structureHangar(d) {
  const mound = d.vertical([['0%', '#22282a', 1], ['100%', '#0a1013', 1]]);
  let s = '';
  s += `<g filter="url(#paint)">`;
  // buried mound
  s += `<path fill="url(#${mound})" d="M 70 782 C 96 616 200 528 292 528 C 392 528 486 618 500 782 Z"/>`;
  s += `<path fill="#0c1214" opacity="0.6" d="M 380 782 C 392 640 440 566 470 548 C 492 626 500 700 500 782 Z"/>`;
  // concrete lip around the mouth
  s += `<path fill="#3a3730" d="M 176 782 L 176 660 A 116 116 0 0 1 408 660 L 408 782 L 386 782 L 386 664 A 94 94 0 0 0 198 664 L 198 782 Z"/>`;
  s += `</g>`;
  // hangar mouth
  s += glowingArch(d, 200, 604, 184, 178, P.amber, 0.85);
  // gantry rails and a dark hull deep inside the mouth
  s += `<g stroke="#241d16" stroke-width="6" opacity="0.4" fill="none">` +
    `<path d="M 218 774 L 252 694 M 368 774 L 334 694"/></g>`;
  s += `<path fill="#160f0a" opacity="0.5" d="M 250 766 L 272 710 L 316 710 L 338 766 Z"/>`;
  // apron lights
  s += lanterns(d, [[168, 776], [420, 776], [246, 792], [352, 792]], 4);
  return s;
}

function structurePrintHouse(d) {
  const wall = d.vertical([['0%', '#4a3f33', 1], ['100%', '#221c16', 1]]);
  let s = '';
  s += light(d, 394, 420, 330, P.amber, 0.26);
  s += `<g filter="url(#paint)">`;
  // terrace the building sits on
  s += `<path fill="#191512" d="M 196 508 L 594 508 L 620 566 L 172 566 Z"/>`;
  // main mass
  s += `<path fill="url(#${wall})" d="M 232 336 L 556 336 L 570 510 L 220 510 Z"/>`;
  // pitched roof
  s += `<path fill="#2a3a38" d="M 214 340 L 394 268 L 578 340 Z"/>`;
  s += `<path fill="#3f8f83" opacity="0.45" d="M 394 268 L 578 340 L 560 340 L 394 282 Z"/>`;
  // chimney
  s += `<rect x="498" y="278" width="26" height="58" fill="#332a22"/>`;
  s += `</g>`;
  // tall arched windows
  for (let i = 0; i < 4; i += 1) {
    s += litArch(d, 258 + i * 76, 376, 40, 120, i === 2 ? P.lantern : P.amber);
  }
  s += light(d, 512, 268, 130, '#8aa39a', 0.2);
  return s;
}

function structureDome(d) {
  const glassG = d.vertical([['0%', '#8fe6d0', 0.7], ['48%', '#3f8f83', 0.85], ['100%', '#ffb861', 0.7]]);
  let s = '';
  s += light(d, 1460, 452, 360, '#3f8f83', 0.42);
  s += `<g filter="url(#paintSoft)">`;
  // stone drum
  s += `<path fill="#2b2620" d="M 1318 508 L 1602 508 L 1616 566 L 1304 566 Z"/>`;
  s += `<path fill="#3a332b" d="M 1330 462 L 1590 462 L 1596 512 L 1324 512 Z"/>`;
  // glass dome
  s += `<path fill="url(#${glassG})" d="M 1330 466 A 130 130 0 0 1 1590 466 Z"/>`;
  // glazing bars
  s += `<g stroke="#123033" stroke-width="4" fill="none" opacity="0.75">` +
    `<path d="M 1460 336 L 1460 466"/>` +
    `<path d="M 1370 372 L 1550 560" transform="translate(0,-94)"/>` +
    `<path d="M 1550 372 L 1370 560" transform="translate(0,-94)"/>` +
    `<path d="M 1348 424 A 118 118 0 0 1 1572 424"/>` +
    `</g>`;
  // finial
  s += `<circle cx="1460" cy="330" r="12" fill="#a97b34"/>`;
  s += `</g>`;
  // vines wrapping the drum and creeping up the glass
  s += `<g stroke="#1c3a2c" stroke-width="9" fill="none" stroke-linecap="round" opacity="0.9" filter="url(#paintSoft)">` +
    `<path d="M 1322 566 C 1350 512 1338 468 1372 424 C 1392 398 1388 372 1404 356"/>` +
    `<path d="M 1600 566 C 1576 516 1590 470 1556 430 C 1534 404 1540 382 1526 362"/>` +
    `<path d="M 1340 520 C 1400 500 1520 500 1584 520"/>` +
    `</g>`;
  s += `<g fill="#24503a" opacity="0.9">` +
    [[1358, 486], [1382, 440], [1404, 392], [1566, 452], [1548, 404], [1420, 508], [1520, 512]]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="13" ry="8" transform="rotate(-24 ${x} ${y})"/>`)
      .join('') +
    `</g>`;
  s += litWindow(d, 1440, 520, 40, 40, P.amber, 4);
  return s;
}

function structureVault(d) {
  const rock = d.vertical([['0%', '#2e2a24', 1], ['100%', '#0d0b09', 1]]);
  const gold = d.vertical([['0%', '#ffdca6', 1], ['45%', '#d9a75a', 1], ['100%', '#8a6524', 1]]);
  let s = '';
  s += `<g filter="url(#paint)">`;
  // rock face
  s += `<path fill="url(#${rock})" d="M 1512 800 C 1526 660 1580 548 1668 522 C 1782 490 1900 566 1930 700 L 1946 800 Z"/>`;
  s += `<path fill="#0b0a08" opacity="0.5" d="M 1836 800 C 1846 690 1876 604 1912 566 C 1936 640 1944 726 1946 800 Z"/>`;
  // cut portal surround
  s += `<path fill="#4a4038" d="M 1626 800 L 1626 646 A 84 84 0 0 1 1794 646 L 1794 800 L 1766 800 L 1766 650 A 56 56 0 0 0 1654 650 L 1654 800 Z"/>`;
  s += `</g>`;
  // gold door
  s += light(d, 1710, 706, 290, P.brassLight, 0.5);
  const r = 56;
  s += `<path fill="url(#${gold})" d="M 1654 800 L 1654 ${650} A ${r} ${r} 0 0 1 1766 650 L 1766 800 Z"/>`;
  s += `<g stroke="#7a5a1e" stroke-width="3" fill="none" opacity="0.8">` +
    `<circle cx="1710" cy="700" r="34"/><circle cx="1710" cy="700" r="17"/>` +
    `<path d="M 1710 666 L 1710 734 M 1676 700 L 1744 700"/>` +
    `</g>`;
  s += `<rect x="1650" y="796" width="120" height="12" fill="#3a332b"/>`;
  s += lanterns(d, [[1608, 762], [1812, 762]], 5);
  return s;
}

function structureSphere(d) {
  const shell = d.vertical([['0%', '#4d5a58', 1], ['42%', '#243437', 1], ['100%', '#0b1214', 1]]);
  let s = '';
  s += `<g filter="url(#paintSoft)">`;
  // stepped mound
  s += `<path fill="#171d1d" d="M 1176 950 L 1494 950 L 1462 906 L 1208 906 Z"/>`;
  s += `<path fill="#1e2626" d="M 1214 906 L 1458 906 L 1428 866 L 1244 866 Z"/>`;
  s += `<path fill="#252e2e" d="M 1250 866 L 1422 866 L 1398 830 L 1274 830 Z"/>`;
  s += `</g>`;
  // sphere
  s += light(d, 1336, 762, 260, '#3f8f83', 0.28);
  s += `<circle cx="1336" cy="762" r="96" fill="url(#${shell})"/>`;
  s += `<path fill="#6f8481" opacity="0.35" d="M 1336 666 A 96 96 0 0 1 1414 706 A 120 120 0 0 0 1290 686 Z"/>`;
  // seam bands
  s += `<g stroke="#0c1213" stroke-width="4" fill="none" opacity="0.7">` +
    `<path d="M 1240 762 A 96 34 0 0 0 1432 762"/>` +
    `<path d="M 1258 714 A 80 26 0 0 0 1414 714"/>` +
    `</g>`;
  // one lit aperture
  s += light(d, 1336, 806, 96, P.gaugeGreen, 0.55);
  s += `<ellipse cx="1336" cy="806" rx="26" ry="14" fill="${P.gaugeGreen}" opacity="0.85"/>`;
  s += lanterns(d, [[1252, 842], [1420, 842], [1204, 898], [1468, 898]], 4);
  return s;
}

function structureLibrary(d) {
  const wall = d.vertical([['0%', '#41352a', 1], ['100%', '#1b1611', 1]]);
  let s = '';
  s += light(d, 460, 900, 420, P.amber, 0.28);
  s += `<g filter="url(#paint)">`;
  s += `<path fill="url(#${wall})" d="M 268 842 L 654 830 L 672 972 L 254 972 Z"/>`;
  s += `<path fill="#2b3a36" d="M 250 846 L 460 796 L 672 834 L 654 846 L 460 812 L 266 858 Z"/>`;
  s += `<path fill="#2b3a36" d="M 250 846 L 460 796 L 672 834 L 672 848 L 460 810 L 250 860 Z"/>`;
  s += `</g>`;
  for (let i = 0; i < 7; i += 1) {
    s += litWindow(d, 292 + i * 52, 872 + i * 1.4, 30, 48, i === 3 ? P.lantern : P.amber, 4);
  }
  s += `<path fill="#4a3a26" d="M 434 900 L 492 898 L 494 972 L 432 972 Z"/>`;
  s += litArch(d, 442, 908, 42, 64, P.lantern);
  s += lanterns(d, [[264, 862], [660, 850]], 5);
  return s;
}
