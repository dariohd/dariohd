import { create } from 'zustand';
import type { DesktopAppId } from '../data/profile';
import { profile } from '../data/profile';
import { playWindowOpen } from '../game/audio';

export interface OsWindow {
  id: string;
  appId: DesktopAppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  payload?: { projectId?: string };
}

const DEFAULTS: Record<DesktopAppId, { title: string; width: number; height: number }> = {
  projects: { title: 'Projets', width: 720, height: 520 },
  about: { title: 'À propos', width: 520, height: 480 },
  stack: { title: 'Stack', width: 480, height: 520 },
  contact: { title: 'Contact', width: 420, height: 400 },
  terminal: { title: `Terminal — ${profile.handle}@${profile.alias}`, width: 640, height: 420 },
  'project-detail': { title: 'Projet', width: 680, height: 560 },
};

let windowCounter = 0;
let topZ = 10;

function nextId(): string {
  windowCounter += 1;
  return `win-${windowCounter}`;
}

interface OsState {
  windows: OsWindow[];
  openApp: (appId: DesktopAppId, payload?: OsWindow['payload']) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, width: number, height: number) => void;
  toggleMinimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  closeAllWindows: () => void;
}

function cascadeOffset(index: number): { x: number; y: number } {
  return { x: 80 + (index % 5) * 28, y: 48 + (index % 5) * 28 };
}

export const useOsStore = create<OsState>((set, get) => ({
  windows: [],

  openApp: (appId, payload) => {
    const existing = get().windows.find(
      (w) => w.appId === appId && !w.minimized && w.payload?.projectId === payload?.projectId,
    );
    if (existing) {
      get().focusWindow(existing.id);
      set({
        windows: get().windows.map((w) =>
          w.id === existing.id ? { ...w, minimized: false } : w,
        ),
      });
      return;
    }

    const def = DEFAULTS[appId];
    const title =
      appId === 'project-detail' && payload?.projectId
        ? def.title
        : def.title;
    topZ += 1;
    const offset = cascadeOffset(get().windows.length);
    const win: OsWindow = {
      id: nextId(),
      appId,
      title,
      x: offset.x,
      y: offset.y,
      width: def.width,
      height: def.height,
      minimized: false,
      maximized: false,
      zIndex: topZ,
      payload,
    };
    set({ windows: [...get().windows, win] });
    playWindowOpen();
  },

  closeWindow: (id) => set({ windows: get().windows.filter((w) => w.id !== id) }),

  focusWindow: (id) => {
    topZ += 1;
    set({
      windows: get().windows.map((w) =>
        w.id === id ? { ...w, zIndex: topZ, minimized: false } : w,
      ),
    });
  },

  moveWindow: (id, x, y) => {
    set({
      windows: get().windows.map((w) => (w.id === id ? { ...w, x, y, maximized: false } : w)),
    });
  },

  resizeWindow: (id, width, height) => {
    set({
      windows: get().windows.map((w) =>
        w.id === id ? { ...w, width: Math.max(320, width), height: Math.max(240, height) } : w,
      ),
    });
  },

  toggleMinimize: (id) => {
    set({
      windows: get().windows.map((w) =>
        w.id === id ? { ...w, minimized: !w.minimized } : w,
      ),
    });
  },

  toggleMaximize: (id) => {
    set({
      windows: get().windows.map((w) =>
        w.id === id ? { ...w, maximized: !w.maximized } : w,
      ),
    });
  },

  closeAllWindows: () => set({ windows: [] }),
}));

export function setWindowTitle(id: string, title: string): void {
  useOsStore.setState({
    windows: useOsStore.getState().windows.map((w) => (w.id === id ? { ...w, title } : w)),
  });
}
