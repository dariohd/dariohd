import { PLAYER_START } from './roomCollision';

export const DISPLAY_SCALE = 2;

let mapW = 329;
let mapH = 343;

export function setMapDimensions(w: number, h: number): void {
  mapW = w;
  mapH = h;
}

export function getMapDimensions(): { w: number; h: number } {
  return { w: mapW, h: mapH };
}

export function getCanvasSize(): { w: number; h: number } {
  return { w: mapW * DISPLAY_SCALE, h: mapH * DISPLAY_SCALE };
}

export function getPlayerStart(): { x: number; y: number } {
  return { x: PLAYER_START.x, y: PLAYER_START.y };
}
