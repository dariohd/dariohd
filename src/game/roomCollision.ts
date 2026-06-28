/**
 * Collisions pixel-perfect via nb2-bedroom-collision.png
 * (éditeur : ?collision=edit — ou scripts/generate-collision.mjs en secours)
 *
 * Vert = praticable | Rouge = bloqué | Bleu = escaliers | Magenta = zone PC
 */

import { rgbToTool } from './collisionColors';
import {
  FURNITURE_ZONES,
  PC_ZONE_RECT,
  STAIRS_ZONE_RECT,
  TV_ZONE,
  BENCH_ZONE,
} from './collisionZones';

export const PC_CENTER = { x: 38, y: 284 };
export const PC_INTERACT_RADIUS = 42;
export const PLAYER_START = { x: 158, y: 198 };

/** Zone escaliers — centre + rayon (comme le PC). */
export const STAIRS_CENTER = { x: 296, y: 95 };
export const STAIRS_INTERACT_RADIUS = 75;

/** @deprecated rectangulaire — préférer isNearStairs */
export const STAIRS_ZONE = { x0: 275, y0: 45, x1: 318, y1: 155 };

let maskData: Uint8ClampedArray | null = null;
let maskW = 0;
let maskH = 0;

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function sample(px: number, py: number): 'walk' | 'block' | 'stairs' | 'pc' {
  if (!maskData) return 'block';
  const x = clamp(Math.floor(px), 0, maskW - 1);
  const y = clamp(Math.floor(py), 0, maskH - 1);
  const i = (y * maskW + x) * 4;
  const r = maskData[i]!;
  const g = maskData[i + 1]!;
  const b = maskData[i + 2]!;
  return rgbToTool(r, g, b);
}

function stampRect(x0: number, y0: number, x1: number, y1: number, rgb: [number, number, number]) {
  if (!maskData) return;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (x < 0 || y < 0 || x >= maskW || y >= maskH) continue;
      const i = (y * maskW + x) * 4;
      maskData[i] = rgb[0];
      maskData[i + 1] = rgb[1];
      maskData[i + 2] = rgb[2];
      maskData[i + 3] = 255;
    }
  }
}

function applyCollisionZones(): void {
  for (const z of FURNITURE_ZONES) {
    stampRect(z.x0, z.y0, z.x1, z.y1, [255, 0, 0]);
  }
  stampRect(STAIRS_ZONE_RECT.x0, STAIRS_ZONE_RECT.y0, STAIRS_ZONE_RECT.x1, STAIRS_ZONE_RECT.y1, [
    0, 120, 255,
  ]);
  stampRect(PC_ZONE_RECT.x0, PC_ZONE_RECT.y0, PC_ZONE_RECT.x1, PC_ZONE_RECT.y1, [255, 0, 255]);
}

export function buildCollisionFromMaskImage(img: HTMLImageElement): void {
  maskW = img.naturalWidth;
  maskH = img.naturalHeight;

  const canvas = document.createElement('canvas');
  canvas.width = maskW;
  canvas.height = maskH;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  ctx.drawImage(img, 0, 0);
  maskData = ctx.getImageData(0, 0, maskW, maskH).data;
  applyCollisionZones();
}

export function collisionReady(): boolean {
  return maskData !== null;
}

export function isWalkable(px: number, py: number): boolean {
  const t = sample(px, py);
  return t === 'walk' || t === 'stairs' || t === 'pc';
}

export function isOnStairs(px: number, py: number): boolean {
  return sample(px, py) === 'stairs';
}

/** Au moins un point sous les pieds du joueur est sur les escaliers. */
export function feetOnStairs(px: number, py: number, footW = 4): boolean {
  return (
    isOnStairs(px, py) ||
    isOnStairs(px - footW, py) ||
    isOnStairs(px + footW, py)
  );
}

export function isInStairsZone(px: number, py: number): boolean {
  return (
    px >= STAIRS_ZONE.x0 &&
    px <= STAIRS_ZONE.x1 &&
    py >= STAIRS_ZONE.y0 &&
    py <= STAIRS_ZONE.y1
  );
}

/** Assez proche des escaliers pour interagir (pieds du joueur). */
export function isNearStairs(px: number, py: number): boolean {
  const dx = px - STAIRS_CENTER.x;
  const dy = py - STAIRS_CENTER.y;
  return Math.hypot(dx, dy) <= STAIRS_INTERACT_RADIUS;
}

/** Sur les marches ou dans la zone d’approche. */
export function isPlayerAtStairs(px: number, py: number, footW = 4): boolean {
  return (
    isNearStairs(px, py) ||
    feetOnStairs(px, py, footW) ||
    isInStairsZone(px, py)
  );
}

export function isInPcZone(px: number, py: number): boolean {
  return sample(px, py) === 'pc';
}

export function isNearPc(playerX: number, playerY: number): boolean {
  const dx = playerX - PC_CENTER.x;
  const dy = playerY - PC_CENTER.y;
  return Math.hypot(dx, dy) <= PC_INTERACT_RADIUS;
}

/** Joueur assez proche du PC pour interagir (E ou clic). */
export function canInteractWithPc(playerX: number, playerY: number): boolean {
  return isNearPc(playerX, playerY);
}

export function drawCollisionDebug(ctx: CanvasRenderingContext2D): void {
  if (!maskData) return;

  ctx.save();
  // Télé — overlay opaque pour que le cadre beige ne fasse plus « trou »
  ctx.fillStyle = 'rgba(255, 40, 40, 0.72)';
  ctx.fillRect(TV_ZONE.x0, TV_ZONE.y0, TV_ZONE.x1 - TV_ZONE.x0 + 1, TV_ZONE.y1 - TV_ZONE.y0 + 1);
  ctx.fillStyle = 'rgba(255, 120, 40, 0.72)';
  ctx.fillRect(
    BENCH_ZONE.x0,
    BENCH_ZONE.y0,
    BENCH_ZONE.x1 - BENCH_ZONE.x0 + 1,
    BENCH_ZONE.y1 - BENCH_ZONE.y0 + 1,
  );

  for (let y = 0; y < maskH; y++) {
    for (let x = 0; x < maskW; x++) {
      const t = sample(x, y);
      if (t === 'block') {
        const onTv =
          x >= TV_ZONE.x0 && x <= TV_ZONE.x1 && y >= TV_ZONE.y0 && y <= TV_ZONE.y1;
        const onBench =
          x >= BENCH_ZONE.x0 && x <= BENCH_ZONE.x1 && y >= BENCH_ZONE.y0 && y <= BENCH_ZONE.y1;
        if (onTv || onBench) continue;
        ctx.fillStyle = 'rgba(255, 60, 60, 0.4)';
      } else if (t === 'stairs') ctx.fillStyle = 'rgba(60, 160, 255, 0.5)';
      else if (t === 'pc') ctx.fillStyle = 'rgba(255, 60, 255, 0.5)';
      else continue;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  ctx.strokeStyle = 'rgba(255, 200, 60, 0.8)';
  ctx.beginPath();
  ctx.arc(PC_CENTER.x, PC_CENTER.y, PC_INTERACT_RADIUS, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(60, 160, 255, 0.85)';
  ctx.beginPath();
  ctx.arc(STAIRS_CENTER.x, STAIRS_CENTER.y, STAIRS_INTERACT_RADIUS, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}
