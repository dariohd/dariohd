import type { DesktopAppId } from './profile';

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
    id: 'folder-brand',
    label: 'Bulle ton site',
    icon: '🌐',
    color: '#94c878',
    action: 'url',
    url: 'https://bulletonsite.com',
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

/** Positions par défaut — colonne droite du bureau */
export function defaultIconPosition(index: number, surfaceWidth: number): { x: number; y: number } {
  const colW = 92;
  const marginRight = 20;
  const marginTop = 16;
  const rowH = 96;
  return {
    x: Math.max(16, surfaceWidth - colW - marginRight),
    y: marginTop + index * rowH,
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
