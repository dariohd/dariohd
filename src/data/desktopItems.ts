import type { DesktopAppId } from './profile';
import { desktopApps, miniGames } from './profile';

export interface DesktopFolder {
  id: string;
  label: string;
  icon: string;
  color: string;
  action: 'app' | 'url';
  appId?: DesktopAppId;
  url?: string;
}

export const desktopFolders: DesktopFolder[] = [
  {
    id: 'folder-projects',
    label: 'Mes Projets',
    icon: '📂',
    color: '#58a8f0',
    action: 'app',
    appId: 'projects',
  },
  {
    id: 'folder-explorer',
    label: 'Explorateur',
    icon: '🗂️',
    color: '#c8a070',
    action: 'app',
    appId: 'explorer',
  },
  {
    id: 'folder-github',
    label: 'GitHub',
    icon: '🐙',
    color: '#a868e8',
    action: 'url',
    url: 'https://github.com/dariohd',
  },
];

export const ICON_COL_W = 92;
export const ICON_ROW_H = 96;

const MARGIN_LEFT = 20;
const MARGIN_TOP = 52;
const WIDGET_RESERVE_W = 228;
const APPS_COLS = 2;
const GAMES_COLS = 3;
const BLOCK_GAP = 24;

export type IconZone = 'app' | 'game';

function appsStartX(surfaceWidth: number): number {
  if (surfaceWidth < 640) return MARGIN_LEFT;
  return MARGIN_LEFT + WIDGET_RESERVE_W;
}

/** Apps en colonnes à gauche (après les widgets), jeux à côté — style bureau classique. */
export function defaultIconPosition(
  zone: IconZone,
  indexInZone: number,
  surfaceWidth: number,
  _surfaceHeight: number,
): { x: number; y: number } {
  const appsStart = appsStartX(surfaceWidth);
  const appsBlockW = APPS_COLS * ICON_COL_W;
  const gamesStartX = appsStart + appsBlockW + BLOCK_GAP;

  if (zone === 'app') {
    const col = indexInZone % APPS_COLS;
    const row = Math.floor(indexInZone / APPS_COLS);
    return { x: appsStart + col * ICON_COL_W, y: MARGIN_TOP + row * ICON_ROW_H };
  }

  const col = indexInZone % GAMES_COLS;
  const row = Math.floor(indexInZone / GAMES_COLS);
  const x = gamesStartX + col * ICON_COL_W;

  if (surfaceWidth < 640) {
    const mobileCol = indexInZone % 3;
    const mobileRow = Math.floor(indexInZone / 3);
    const appsRows = Math.ceil(desktopApps.length / APPS_COLS);
    return {
      x: MARGIN_LEFT + mobileCol * ICON_COL_W,
      y: MARGIN_TOP + (appsRows + 1) * ICON_ROW_H + mobileRow * ICON_ROW_H,
    };
  }

  return { x, y: MARGIN_TOP + row * ICON_ROW_H };
}

export function defaultFolderPosition(index: number, _surfaceWidth: number, surfaceHeight: number): { x: number; y: number } {
  const folderW = 92;
  const gap = 16;
  return {
    x: MARGIN_LEFT + index * (folderW + gap),
    y: Math.max(16, surfaceHeight - 118),
  };
}

export { desktopApps, miniGames };
