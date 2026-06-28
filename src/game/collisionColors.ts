/** Couleurs exactes du masque nb2-bedroom-collision.png (ne pas modifier). */

export type CollisionTool = 'walk' | 'block' | 'stairs' | 'pc';

export const COLLISION_RGB: Record<CollisionTool, [number, number, number]> = {
  walk: [0, 255, 0],
  block: [255, 0, 0],
  stairs: [0, 120, 255],
  pc: [255, 0, 255],
};

export const COLLISION_LABELS: Record<CollisionTool, string> = {
  walk: 'Sol (praticable)',
  block: 'Mur / meuble (bloqué)',
  stairs: 'Escaliers',
  pc: 'Zone PC',
};

export function rgbToTool(r: number, g: number, b: number): CollisionTool {
  if (r > 200 && b > 200) return 'pc';
  if (b > 150 && r < 100 && g < 160) return 'stairs';
  if (r > 200 && g < 80 && b < 80) return 'block';
  return 'walk';
}

export function toolToCss(tool: CollisionTool): string {
  const [r, g, b] = COLLISION_RGB[tool];
  return `rgb(${r},${g},${b})`;
}
