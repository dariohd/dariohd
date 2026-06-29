import { create } from 'zustand';

export type WallpaperId = 'aurora' | 'midnight' | 'dordogne';

const WALLPAPER_KEY = 'dhd-wallpaper';
const WIDGETS_KEY = 'dhd-widgets';
const SOUNDS_KEY = 'dhd-os-sounds';
const NOTES_KEY = 'dhd-notes';
const ICON_POS_KEY = 'dhd-icon-positions-v4';

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

interface DesktopState {
  wallpaper: WallpaperId;
  widgetsVisible: boolean;
  osSounds: boolean;
  notes: string;
  iconPositions: Record<string, { x: number; y: number }>;
  contextMenu: { x: number; y: number } | null;
  setWallpaper: (id: WallpaperId) => void;
  setWidgetsVisible: (v: boolean) => void;
  setOsSounds: (v: boolean) => void;
  setNotes: (text: string) => void;
  setIconPosition: (id: string, x: number, y: number) => void;
  openContextMenu: (x: number, y: number) => void;
  closeContextMenu: () => void;
}

export const useDesktopStore = create<DesktopState>((set) => ({
  wallpaper: (localStorage.getItem(WALLPAPER_KEY) as WallpaperId) || 'aurora',
  widgetsVisible: localStorage.getItem(WIDGETS_KEY) !== '0',
  osSounds: localStorage.getItem(SOUNDS_KEY) !== '0',
  notes: localStorage.getItem(NOTES_KEY) || '',
  iconPositions: loadJson(ICON_POS_KEY, {}),
  contextMenu: null,

  setWallpaper: (id) => {
    localStorage.setItem(WALLPAPER_KEY, id);
    set({ wallpaper: id });
  },

  setWidgetsVisible: (v) => {
    localStorage.setItem(WIDGETS_KEY, v ? '1' : '0');
    set({ widgetsVisible: v });
  },

  setOsSounds: (v) => {
    localStorage.setItem(SOUNDS_KEY, v ? '1' : '0');
    set({ osSounds: v });
  },

  setNotes: (text) => {
    localStorage.setItem(NOTES_KEY, text);
    set({ notes: text });
  },

  setIconPosition: (id, x, y) => {
    set((state) => {
      const iconPositions = { ...state.iconPositions, [id]: { x, y } };
      localStorage.setItem(ICON_POS_KEY, JSON.stringify(iconPositions));
      return { iconPositions };
    });
  },

  openContextMenu: (x, y) => set({ contextMenu: { x, y } }),
  closeContextMenu: () => set({ contextMenu: null }),
}));

export const wallpapers: { id: WallpaperId; label: string }[] = [
  { id: 'aurora', label: 'Aurore DHD' },
  { id: 'midnight', label: 'Minuit' },
  { id: 'dordogne', label: 'Dordogne' },
];
