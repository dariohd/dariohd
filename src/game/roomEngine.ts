import {
  DISPLAY_SCALE,
  getCanvasSize,
  getMapDimensions,
  getPlayerStart,
} from './roomAssets';
import {
  PC_CENTER,
  STAIRS_CENTER,
  canInteractWithPc,
  drawCollisionDebug,
  isInPcZone,
  isNearStairs,
  isWalkable,
} from './roomCollision';
import { getBedroomImage, getCollisionMaskVersion, getNateImage } from './sprites';
import { playMoveBeep } from './audio';

export type Dir = 'up' | 'down' | 'left' | 'right';

export interface PlayerState {
  x: number;
  y: number;
  dir: Dir;
  frame: number;
  moving: boolean;
}

export function getCanvasDimensions() {
  return getCanvasSize();
}

export function createPlayerStart(): PlayerState {
  const s = getPlayerStart();
  return { x: s.x, y: s.y, dir: 'down', frame: 0, moving: false };
}

export const PLAYER_START_STATE: PlayerState = createPlayerStart();

const NATE_ROW: Record<Dir, number> = {
  down: 0,
  left: 1,
  right: 2,
  up: 3,
};

const NATE_SIZE = 52;
const FOOT_W = 4;
const MOVE_SPEED = 88;
let lastStepBeep = 0;
const STEP_BEEP_INTERVAL = 0.22;

export function resetStepBeep(): void {
  lastStepBeep = 0;
}

const SHOW_COLLISION_DEBUG =
  import.meta.env.DEV &&
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('collision') === '1';

function canMoveTo(x: number, y: number): boolean {
  return (
    isWalkable(x, y) &&
    isWalkable(x - FOOT_W, y) &&
    isWalkable(x + FOOT_W, y)
  );
}

export function isNearInteract(player: PlayerState): boolean {
  return canInteractWithPc(player.x, player.y);
}

export function isOnStairs(player: PlayerState): boolean {
  return isNearStairs(player.x, player.y);
}

/** Touche directionnelle ou E pendant qu’on est près des escaliers. */
export function shouldUseStairs(player: PlayerState, keys: Set<string>): boolean {
  if (!isOnStairs(player)) return false;
  return (
    keys.has('arrowdown') ||
    keys.has('s') ||
    keys.has('arrowup') ||
    keys.has('w') ||
    keys.has('z')
  );
}

export function tryStairsClick(player: PlayerState, mapX: number, mapY: number): boolean {
  return isNearStairs(mapX, mapY) && isNearStairs(player.x, player.y);
}

export function mapCoordsFromCanvas(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number,
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: ((clientX - rect.left) * scaleX) / DISPLAY_SCALE,
    y: ((clientY - rect.top) * scaleY) / DISPLAY_SCALE,
  };
}

export function tryPcClick(player: PlayerState, mapX: number, mapY: number): boolean {
  return isInPcZone(mapX, mapY) && canInteractWithPc(player.x, player.y);
}

export function updatePlayer(player: PlayerState, keys: Set<string>, dt: number): void {
  let dx = 0;
  let dy = 0;

  if (keys.has('arrowup') || keys.has('w') || keys.has('z')) {
    dy = -1;
    player.dir = 'up';
  } else if (keys.has('arrowdown') || keys.has('s')) {
    dy = 1;
    player.dir = 'down';
  } else if (keys.has('arrowleft') || keys.has('a') || keys.has('q')) {
    dx = -1;
    player.dir = 'left';
  } else if (keys.has('arrowright') || keys.has('d')) {
    dx = 1;
    player.dir = 'right';
  }

  player.moving = dx !== 0 || dy !== 0;
  if (!player.moving) {
    player.frame = 0;
    return;
  }

  const now = performance.now() / 1000;
  if (now - lastStepBeep >= STEP_BEEP_INTERVAL) {
    playMoveBeep();
    lastStepBeep = now;
  }

  player.frame += dt * 8;
  const len = Math.hypot(dx, dy) || 1;
  const nx = player.x + (dx / len) * MOVE_SPEED * dt;
  const ny = player.y + (dy / len) * MOVE_SPEED * dt;

  if (canMoveTo(nx, player.y)) player.x = nx;
  if (canMoveTo(player.x, ny)) player.y = ny;
}

function drawNate(ctx: CanvasRenderingContext2D, player: PlayerState) {
  const nate = getNateImage();
  if (!nate) return;

  const row = NATE_ROW[player.dir];
  const animFrame = player.moving ? Math.floor(player.frame) % 4 : 0;
  const sx = animFrame * 64;
  const sy = row * 64;
  const dx = player.x - NATE_SIZE / 2;
  const dy = player.y - NATE_SIZE + 2;

  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.beginPath();
  ctx.ellipse(player.x, player.y + 1, 17, 5.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.drawImage(nate, sx, sy, 64, 64, dx, dy, NATE_SIZE, NATE_SIZE);
}

function drawHint(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  color: string,
) {
  ctx.font = 'bold 10px Outfit, sans-serif';
  ctx.textAlign = 'center';
  const tw = ctx.measureText(text).width + 14;
  ctx.fillStyle = 'rgba(15, 18, 25, 0.88)';
  ctx.fillRect(x - tw / 2, y - 20, tw, 18);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y - 7);
}

export function renderRoom(
  ctx: CanvasRenderingContext2D,
  player: PlayerState,
  pulse: number,
  nearPc: boolean,
  onStairs: boolean,
): void {
  const { w: mapW, h: mapH } = getMapDimensions();
  const { w: canvasW, h: canvasH } = getCanvasSize();

  ctx.imageSmoothingEnabled = false;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.setTransform(DISPLAY_SCALE, 0, 0, DISPLAY_SCALE, 0, 0);

  const bedroom = getBedroomImage();
  if (bedroom) {
    ctx.drawImage(bedroom, 0, 0, mapW, mapH);
  } else {
    ctx.fillStyle = '#c8a878';
    ctx.fillRect(0, 0, mapW, mapH);
  }

  if (SHOW_COLLISION_DEBUG) {
    drawCollisionDebug(ctx);
    ctx.setTransform(DISPLAY_SCALE, 0, 0, DISPLAY_SCALE, 0, 0);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(4, 4, 118, 18);
    ctx.fillStyle = '#8fd48f';
    ctx.font = '10px monospace';
    ctx.fillText(`collision v${getCollisionMaskVersion()}`, 8, 16);
  }

  drawNate(ctx, player);

  if (onStairs) {
    ctx.fillStyle = `rgba(60, 160, 255, ${0.25 + pulse * 0.15})`;
    ctx.beginPath();
    ctx.arc(STAIRS_CENTER.x, STAIRS_CENTER.y, 14 + pulse * 3, 0, Math.PI * 2);
    ctx.fill();
    drawHint(ctx, STAIRS_CENTER.x, STAIRS_CENTER.y - 28, 'E · Sortir', '#60a0f0');
  }

  if (nearPc) {
    ctx.fillStyle = `rgba(88, 168, 240, ${0.35 + pulse * 0.2})`;
    ctx.beginPath();
    ctx.arc(PC_CENTER.x, PC_CENTER.y, 12 + pulse * 3, 0, Math.PI * 2);
    ctx.fill();
    drawHint(ctx, PC_CENTER.x, PC_CENTER.y - 28, 'Accédez au PC · E', '#58a8f0');
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
}
