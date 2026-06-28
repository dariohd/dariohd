/**
 * Génère nb2-bedroom-collision.png (polygone sol + zones depuis collisionZones.json).
 */
import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { PNG } = require('pngjs');

const W = 329;
const H = 343;
const OUT = 'public/sprites/nb2-bedroom-collision.png';
const ZONES = JSON.parse(fs.readFileSync('src/game/collisionZones.json', 'utf8'));

const WALK = [0, 255, 0];
const BLOCK = [255, 0, 0];
const STAIRS = [0, 120, 255];
const PC = [255, 0, 255];

const WALK_POLY = [
  [54, 108],
  [218, 108],
  [236, 92],
  [268, 78],
  [308, 78],
  [314, 104],
  [268, 104],
  [270, 232],
  [284, 248],
  [268, 305],
  [106, 305],
  [106, 304],
  [56, 304],
  [56, 268],
  [54, 268],
];

function pointInPoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    const hit = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (hit) inside = !inside;
  }
  return inside;
}

const png = new PNG({ width: W, height: H });

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const walkable = pointInPoly(x + 0.5, y + 0.5, WALK_POLY);
    const rgb = walkable ? WALK : BLOCK;
    const i = (y * W + x) * 4;
    png.data[i] = rgb[0];
    png.data[i + 1] = rgb[1];
    png.data[i + 2] = rgb[2];
    png.data[i + 3] = 255;
  }
}

function rect(x0, y0, x1, y1, rgb) {
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (x < 0 || y < 0 || x >= W || y >= H) continue;
      const i = (y * W + x) * 4;
      png.data[i] = rgb[0];
      png.data[i + 1] = rgb[1];
      png.data[i + 2] = rgb[2];
      png.data[i + 3] = 255;
    }
  }
}

for (const z of ZONES.furniture) {
  rect(z.x0, z.y0, z.x1, z.y1, BLOCK);
}
rect(ZONES.stairs.x0, ZONES.stairs.y0, ZONES.stairs.x1, ZONES.stairs.y1, STAIRS);
rect(ZONES.pc.x0, ZONES.pc.y0, ZONES.pc.x1, ZONES.pc.y1, PC);

fs.mkdirSync('public/sprites', { recursive: true });
fs.writeFileSync(OUT, PNG.sync.write(png));

const spritesTs = fs.readFileSync('src/game/sprites.ts', 'utf8');
const nextVersion = Number(spritesTs.match(/COLLISION_MASK_VERSION = (\d+)/)?.[1] ?? 25) + 1;
fs.writeFileSync(
  'src/game/sprites.ts',
  spritesTs.replace(/COLLISION_MASK_VERSION = \d+/, `COLLISION_MASK_VERSION = ${nextVersion}`),
);

console.log(`Written ${OUT} — zones from collisionZones.json — mask v${nextVersion}`);
