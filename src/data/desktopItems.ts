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

const COL_W = 80;
const ROW_H = 80;
const MARGIN_TOP = 12;
const MARGIN_RIGHT = 16;
const GAME_COLS = 3;

export type IconZone = 'app' | 'game';

/** Positions par défaut : apps à droite, jeux en 3 colonnes à leur gauche */
export function defaultIconPosition(
  zone: IconZone,
  indexInZone: number,
  surfaceWidth: number,
): { x: number; y: number } {
  const appColX = Math.max(16, surfaceWidth - COL_W - MARGIN_RIGHT);

  if (zone === 'app') {
    return { x: appColX, y: MARGIN_TOP + indexInZone * ROW_H };
  }

  const col = indexInZone % GAME_COLS;
  const row = Math.floor(indexInZone / GAME_COLS);
  const x = appColX - (GAME_COLS - col) * COL_W;

  return {
    x: Math.max(16, x),
    y: MARGIN_TOP + row * ROW_H,
  };
}

export function defaultFolderPosition(index: number, surfaceWidth: number, surfaceHeight: number): { x: number; y: number } {
  const folderW = 92;
  const gap = 16;
  const totalW = desktopFolders.length * folderW + (desktopFolders.length - 1) * gap;
  const startX = Math.max(16, (surfaceWidth - totalW) / 2);
  return {
    x: startX + index * (folderW + gap),
    y: Math.max(16, surfaceHeight - 120),
  };
}

export { desktopApps, miniGames };
