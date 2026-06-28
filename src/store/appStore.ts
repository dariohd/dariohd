import { create } from 'zustand';
import { getProjectById, loadDiscovered, saveDiscovered } from '../data/projects';
import { playDiscover } from '../game/audio';

export type Phase = 'title' | 'room' | 'boot' | 'desktop';

interface ToastProject {
  id: string;
  name: string;
}

interface AppState {
  phase: Phase;
  discovered: Set<string>;
  toastProject: ToastProject | null;
  hintDismissed: boolean;
  bootSkipped: boolean;
  setPhase: (phase: Phase) => void;
  markDiscovered: (id: string) => void;
  clearToast: () => void;
  dismissHint: () => void;
  skipBoot: () => void;
  resetProgress: () => void;
}

const HINT_KEY = 'dhd-hint';
const BOOT_KEY = 'dhd-boot-seen';

export const useAppStore = create<AppState>((set, get) => ({
  phase: 'title',
  discovered: loadDiscovered(),
  toastProject: null,
  hintDismissed: localStorage.getItem(HINT_KEY) === '1',
  bootSkipped: localStorage.getItem(BOOT_KEY) === '1',

  setPhase: (phase) => set({ phase }),

  markDiscovered: (id) => {
    const wasNew = !get().discovered.has(id);
    const next = new Set(get().discovered);
    next.add(id);
    saveDiscovered(next);

    const project = getProjectById(id);
    if (wasNew) {
      playDiscover();
      set({
        discovered: next,
        toastProject: project ? { id, name: project.name } : null,
      });
    } else {
      set({ discovered: next });
    }
  },

  clearToast: () => set({ toastProject: null }),

  dismissHint: () => {
    localStorage.setItem(HINT_KEY, '1');
    set({ hintDismissed: true });
  },

  skipBoot: () => {
    localStorage.setItem(BOOT_KEY, '1');
    set({ bootSkipped: true });
  },

  resetProgress: () => {
    saveDiscovered(new Set());
    localStorage.removeItem(HINT_KEY);
    localStorage.removeItem(BOOT_KEY);
    set({
      discovered: new Set(),
      toastProject: null,
      hintDismissed: false,
      bootSkipped: false,
    });
  },
}));
