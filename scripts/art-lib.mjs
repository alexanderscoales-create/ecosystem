// Shared building blocks for the ARES habitat art. Every scene is a painterly
// 16:9 SVG assembled from soft layered shapes, warm lantern glows and haze.

export const W = 1920;
export const H = 1080;

export const P = {
  night: '#05080a',
  deep: '#0a1216',
  teal: '#13292f',
  tealMid: '#1d454b',
  tealLight: '#2f6b6d',
  verdigris: '#3f8f83',
  glass: '#5fb9a6',
  stone: '#241f1b',
  stoneMid: '#3a322a',
  stoneLight: '#584c40',
  wood: '#1d1309',
  woodMid: '#3a2413',
  brass: '#a97b34',
  brassLight: '#d9a75a',
  amber: '#ffb861',
  lantern: '#ffdca6',
  ember: '#ff8f45',
  gaugeGreen: '#8fe6b4',
};

let uid = 0;
export const nextId = (prefix) => `${prefix}${++uid}`;

/** Accumulates <defs> content as scenes ask for gradients and filters. */
export class Defs {
  constructor() {
    this.parts = [];
  }
  add(markup) {
    this.parts.push(markup);
  }
  /** Soft radial light source. Returns the gradient id. */
  glow(color, corePower = 0.95) {
    const id = nextId('g');
    this.add(
      `<radialGradient id="${id}">` +
        `<stop offset="0%" stop-color="${color}" stop-opacity="${corePower}"/>` +
        `<stop offset="38%" stop-color="${color}" stop-opacity="${(corePower * 0.42).toFixed(3)}"/>` +
        `<stop offset="100%" stop-color="${color}" stop-opacity="0"/>` +
        `</radialGradient>`,
    );
    return id;
  }
  /** Vertical two-or-three stop linear gradient. */
  vertical(stops) {
    const id = nextId('l');
    const body = stops
      .map(([offset, color, opacity = 1]) =>
        `<stop offset="${offset}" stop-color="${color}" stop-opacity="${opacity}"/>`)
      .join('');
    this.add(`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${body}</linearGradient>`);
    return id;
  }
  horizontal(stops) {
    const id = nextId('l');
    const body = stops
      .map(([offset, color, opacity = 1]) =>
        `<stop offset="${offset}" stop-color="${color}" stop-opacity="${opacity}"/>`)
      .join('');
    this.add(`<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0">${body}</linearGradient>`);
    return id;
  }
  render() {
    return `<defs>${BASE_FILTERS}${this.parts.join('')}</defs>`;
  }
}

const BASE_FILTERS = `
<filter id="paint" x="-12%" y="-12%" width="124%" height="124%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.011 0.019" numOctaves="3" seed="11" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="10" xChannelSelector="R" yChannelSelector="G"/>
</filter>
<filter id="paintSoft" x="-12%" y="-12%" width="124%" height="124%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.008 0.014" numOctaves="2" seed="4" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G"/>
</filter>
<filter id="haze" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
  <feGaussianBlur stdDeviation="34"/>
</filter>
<filter id="blurSm" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
  <feGaussianBlur stdDeviation="7"/>
</filter>
<filter id="grain" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="23"/>
  <feColorMatrix type="saturate" values="0"/>
</filter>
<filter id="canvasTex" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.03 0.06" numOctaves="4" seed="8"/>
  <feColorMatrix type="saturate" values="0"/>
</filter>`;

/** A pool of light on the ground or in the air. */
export function light(defs, cx, cy, r, color = P.lantern, power = 0.95, ry = null) {
  const id = defs.glow(color, power);
  return `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${ry ?? r}" fill="url(#${id})"/>`;
}

/** A lit rectangular window with its own spill. */
export function litWindow(defs, x, y, w, h, color = P.amber, rx = 2) {
  return (
    light(defs, x + w / 2, y + h / 2, Math.max(w, h) * 2.1, color, 0.5) +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${color}" opacity="0.86"/>`
  );
}

/** A lit arched window: rectangle capped with a half circle. */
export function litArch(defs, x, y, w, h, color = P.amber) {
  const r = w / 2;
  const d =
    `M ${x} ${y + h} L ${x} ${y + r} A ${r} ${r} 0 0 1 ${x + w} ${y + r} L ${x + w} ${y + h} Z`;
  return (
    light(defs, x + r, y + h * 0.55, Math.max(w, h) * 1.9, color, 0.5) +
    `<path d="${d}" fill="${color}" opacity="0.84"/>`
  );
}

/** Dark arched opening with warm light pouring out of it. */
export function glowingArch(defs, x, y, w, h, color = P.ember, power = 0.9) {
  const r = w / 2;
  const d =
    `M ${x} ${y + h} L ${x} ${y + r} A ${r} ${r} 0 0 1 ${x + w} ${y + r} L ${x + w} ${y + h} Z`;
  const id = defs.vertical([
    ['0%', color, power * 0.35],
    ['60%', color, power],
    ['100%', P.lantern, power],
  ]);
  return (
    light(defs, x + r, y + h * 0.8, w * 2.4, color, 0.45) +
    `<path d="${d}" fill="url(#${id})"/>`
  );
}

/** Row of hanging lanterns along a path. */
export function lanterns(defs, points, r = 5) {
  return points
    .map(([x, y]) => light(defs, x, y, r * 5, P.lantern, 0.42) +
      `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.lantern}" opacity="0.95"/>`)
    .join('');
}

/** Evenly spaced points along a straight run, for lantern paths. */
export function runOfPoints(x1, y1, x2, y2, count) {
  const out = [];
  for (let i = 0; i < count; i += 1) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    out.push([Math.round(x1 + (x2 - x1) * t), Math.round(y1 + (y2 - y1) * t)]);
  }
  return out;
}

/** Volumetric haze band. */
export function hazeBand(defs, y, height, color = P.tealMid, opacity = 0.28) {
  const id = defs.vertical([
    ['0%', color, 0],
    ['50%', color, opacity],
    ['100%', color, 0],
  ]);
  return `<rect x="-40" y="${y}" width="${W + 80}" height="${height}" fill="url(#${id})" filter="url(#haze)"/>`;
}

/** Corner-darkening plus paper grain, painted last in every scene. */
export function finish(defs) {
  const v = nextId('v');
  defs.add(
    `<radialGradient id="${v}" cx="50%" cy="48%" r="72%">` +
      `<stop offset="45%" stop-color="#000" stop-opacity="0"/>` +
      `<stop offset="100%" stop-color="#000" stop-opacity="0.72"/>` +
      `</radialGradient>`,
  );
  return (
    `<rect width="${W}" height="${H}" fill="url(#${v})"/>` +
    `<rect width="${W}" height="${H}" filter="url(#canvasTex)" opacity="0.05" style="mix-blend-mode:overlay"/>` +
    `<rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.08" style="mix-blend-mode:overlay"/>`
  );
}

export function svg(defs, body) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" ` +
    `preserveAspectRatio="xMidYMid slice" role="img">` +
    defs.render() +
    body +
    `</svg>\n`
  );
}

/** Deterministic pseudo-random, so regenerating the art never churns the diff. */
export function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
