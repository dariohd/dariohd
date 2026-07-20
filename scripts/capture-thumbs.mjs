/**
 * Vignettes projets pour le portfolio dariohd.
 * Usage : npx playwright install chromium && node scripts/capture-thumbs.mjs
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'projects');

const captures = [
  { file: 'maison-ela.jpg', url: 'https://www.lamaisondela.com/' },
  { file: 'quai-reves.jpg', url: 'https://quai-des-reves.vercel.app/' },
  { file: 'etcbc.jpg', url: 'https://www.etcbc-charpente.com/' },
  { file: 'domainederoche.jpg', url: 'https://domainederoche.vercel.app/' },
  { file: 'sqcdp.jpg', url: 'https://sqcdp.vercel.app/' },
  { file: 'bulle.jpg', url: 'https://bullechatbot.vercel.app/' },
  { file: 'bulletonsite.jpg', url: 'https://www.bulletonsite.com/' },
  { file: 'rlreplay.jpg', url: 'https://rl-replay.vercel.app/' },
  { file: 'hugodavion.jpg', url: 'https://hugodavion.vercel.app/', skipIntro: true, wait: 3500 },
  { file: 'pokearena.jpg', url: 'https://arena-poke.vercel.app/', wait: 4000 },
];

function svgThumb(title, subtitle, color) {
  const safe = title.replace(/[<>&]/g, '');
  const sub = subtitle.replace(/[<>&]/g, '');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800" viewBox="0 0 1280 800">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#dce8f8"/>
      <stop offset="100%" stop-color="#e8e0f8"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${color}"/>
      <stop offset="100%" stop-color="#7b9cff"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="800" fill="url(#bg)"/>
  <rect x="80" y="80" width="1120" height="640" rx="24" fill="rgba(255,255,255,0.72)" stroke="rgba(123,156,255,0.25)" stroke-width="2"/>
  <rect x="80" y="80" width="1120" height="48" rx="24" fill="url(#accent)"/>
  <text x="640" y="380" text-anchor="middle" font-family="Segoe UI,sans-serif" font-size="56" font-weight="800" fill="#3d4f7a">${safe}</text>
  <text x="640" y="450" text-anchor="middle" font-family="Consolas,monospace" font-size="22" fill="#7a8cb8">${sub}</text>
</svg>`;
}

await mkdir(outDir, { recursive: true });

await writeFile(
  path.join(outDir, 'dex-explorer.svg'),
  svgThumb('Dex Explorer', 'React 19 · PokéAPI', '#f0c060'),
);

let browser;
try {
  browser = await chromium.launch();
  for (const shot of captures) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    try {
      if (shot.skipIntro) {
        await page.addInitScript(() => {
          sessionStorage.setItem('hugodavion-intro-skip', '1');
        });
      }
      console.log(`Capture ${shot.url}`);
      await page.goto(shot.url, { waitUntil: 'networkidle', timeout: 90000 });
      await page.waitForTimeout(shot.wait ?? 2000);
      await page.screenshot({
        path: path.join(outDir, shot.file),
        type: 'jpeg',
        quality: 85,
      });
      console.log(`  → ${shot.file}`);
    } catch (err) {
      console.warn(`  Échec ${shot.file}:`, err.message);
    } finally {
      await page.close();
    }
  }
} catch (err) {
  console.warn('Playwright:', err.message);
} finally {
  await browser?.close();
}

console.log('Terminé.');
