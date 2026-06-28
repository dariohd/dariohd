import { create } from 'zustand';
import type { DesktopAppId } from '../data/profile';
import { profile } from '../data/profile';
import { playWindowOpen } from '../game/audio';
import { useDesktopStore } from './desktopStore';

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
  projects: { title: 'Projets', width: 760, height: 540 },
  explorer: { title: 'Explorateur', width: 720, height: 500 },
  about: { title: 'À propos', width: 520, height: 480 },
  stack: { title: 'Stack', width: 480, height: 520 },
  contact: { title: 'Contact', width: 440, height: 420 },
  notes: { title: 'Notes DHD', width: 480, height: 400 },
  terminal: { title: `Terminal — ${profile.handle}@${profile.alias}`, width: 640, height: 420 },
  settings: { title: 'Paramètres', width: 480, height: 520 },
  'project-detail': { title: 'Projet', width: 700, height: 560 },
};

let windowCounter = 0;
let topZ = 10;

function nextId(): string {
  windowCounter += 1;
  return `win-${windowCounter}`;
}

function viewportWidth(): number {
  return typeof window !== 'undefined' ? window.innerWidth : 1200;
}

function cascadeOffset(index: number, winWidth: number): { x: number; y: number } {
  const vw = viewportWidth();
  const baseX = Math.max(24, (vw - winWidth) / 2);
  const baseY = 52;
  const step = index % 6;
  return { x: baseX + step * 22, y: baseY + step * 22 };
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
  minimizeAllWindows: () => void;
  closeAllWindows: () => void;
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
    topZ += 1;
    const offset = cascadeOffset(get().windows.length, def.width);
    const win: OsWindow = {
      id: nextId(),
      appId,
      title: def.title,
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
    if (useDesktopStore.getState().osSounds) playWindowOpen();
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

  minimizeAllWindows: () => {
    set({
      windows: get().windows.map((w) => ({ ...w, minimized: true })),
    });
  },

  closeAllWindows: () => set({ windows: [] }),
}));

export function setWindowTitle(id: string, title: string): void {
  useOsStore.setState({
    windows: useOsStore.getState().windows.map((w) => (w.id === id ? { ...w, title } : w)),
  });
}
