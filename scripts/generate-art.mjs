// Generates every image the interface loads, into public/art.
// Paths here must match src/data/images.ts.
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { hub } from './scene-hub.mjs';
import * as interiors from './scene-interiors.mjs';

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'art');

const scenes = {
  'hub.svg': hub,
  'bridge.svg': interiors.bridge,
  'commerce-lab.svg': interiors.commerceLab,
  'content-engine.svg': interiors.contentEngine,
  'media-bay.svg': interiors.mediaBay,
  'research-lab.svg': interiors.researchLab,
  'treasury.svg': interiors.treasury,
  'radar-bay.svg': interiors.radarBay,
  'archives.svg': interiors.archives,
};

await mkdir(outDir, { recursive: true });
for (const [file, render] of Object.entries(scenes)) {
  const markup = render();
  await writeFile(join(outDir, file), markup, 'utf8');
  console.log(`${file}  ${(markup.length / 1024).toFixed(1)} kB`);
}
