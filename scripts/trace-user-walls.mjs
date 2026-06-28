/**
 * Diff chambre vs capture annotée → traits rouges utilisateur → masque collision.
 */
import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { PNG } = require('pngjs');

const W = 329;
const H = 343;
const BEDROOM = 'public/sprites/nb2-bedroom.png';
const USER_IMG =
  process.argv[2] ||
  'C:/Users/davio/.cursor/projects/c-Projets/assets/c__Users_davio_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-3fa5e6e8-6107-46c0-a83f-489da4ec0348.png';
const OUT = 'public/sprites/nb2-bedroom-collision.png';

const bedroom = PNG.sync.read(fs.readFileSync(BEDROOM));
const user = PNG.sync.read(fs.readFileSync(USER_IMG));

function sample(img, x, y) {
  const sx = Math.floor((x / W) * img.width);
  const sy = Math.floor((y / H) * img.height);
  const i = (sy * img.width + sx) * 4;
  return [img.data[i], img.data[i + 1], img.data[i + 2]];
}

const wall = new Uint8Array(W * H);

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const [br, bg, bb] = sample(bedroom, x, y);
    const [ur, ug, ub] = sample(user, x, y);
    const dR = ur - br;
    const dG = ug - bg;
    const dB = ub - bb;
    // Trait rouge ajouté : R monte fort, G/B stables ou baissent
    if (dR > 55 && dR > dG + 40 && dR > dB + 25 && ur > 150 && ug < 120) {
      wall[y * W + x] = 1;
    }
  }
}

function dilate(buf, passes = 2) {
  for (let p = 0; p < passes; p++) {
    const next = Uint8Array.from(buf);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (!buf[y * W + x]) continue;
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < W && ny < H) next[ny * W + nx] = 1;
          }
        }
      }
    }
    buf.set(next);
  }
}

console.log('raw strokes', wall.reduce((a, b) => a + b, 0));
dilate(wall, 3);
console.log('after dilate', wall.reduce((a, b) => a + b, 0));

// Intérieur = flood depuis le centre de la pièce (pas depuis les bords)
const inside = new Uint8Array(W * H);
const seeds = [
  [160, 190],
  [140, 220],
  [200, 200],
  [180, 160],
];
const queue = [...seeds];

while (queue.length) {
  const [x, y] = queue.pop();
  if (x < 0 || y < 0 || x >= W || y >= H) continue;
  const idx = y * W + x;
  if (inside[idx] || wall[idx]) continue;
  inside[idx] = 1;
  queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
}

const WALK = [0, 255, 0];
const BLOCK = [255, 0, 0];
const STAIRS = [0, 120, 255];
const PC = [255, 0, 255];
const png = new PNG({ width: W, height: H });

let walkN = 0;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = y * W + x;
    const walkable = inside[idx] && !wall[idx];
    const rgb = walkable ? WALK : BLOCK;
    const i = idx * 4;
    png.data[i] = rgb[0];
    png.data[i + 1] = rgb[1];
    png.data[i + 2] = rgb[2];
    png.data[i + 3] = 255;
    if (walkable) walkN++;
  }
}

function rect(x0, y0, x1, y1, rgb) {
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const i = (y * W + x) * 4;
      png.data[i] = rgb[0];
      png.data[i + 1] = rgb[1];
      png.data[i + 2] = rgb[2];
      png.data[i + 3] = 255;
    }
  }
}

rect(275, 45, 315, 115, STAIRS);
rect(22, 268, 48, 292, PC);

fs.mkdirSync('public/sprites', { recursive: true });
fs.writeFileSync(OUT, PNG.sync.write(png));
console.log(`Written ${OUT} · walk:${walkN} / ${W * H}`);
