import { useEffect, useState } from 'react';
import { desktopApps } from '../data/profile';
import { useOsStore } from '../store/osStore';
import { playWindowClose, playWindowOpen } from '../game/audio';
import { useDesktopStore } from '../store/desktopStore';

function osSoundsOn() {
  return useDesktopStore.getState().osSounds;
}

export function useDesktopShortcuts() {
  const openApp = useOsStore((s) => s.openApp);
  const windows = useOsStore((s) => s.windows);
  const closeWindow = useOsStore((s) => s.closeWindow);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        e.preventDefault();
        setShowHelp((v) => !v);
        return;
      }

      if (e.key === 'Escape') {
        const top = [...windows].sort((a, b) => b.zIndex - a.zIndex)[0];
        if (top) {
          if (osSoundsOn()) playWindowClose();
          closeWindow(top.id);
        } else {
          setShowHelp(false);
        }
        return;
      }

      if (showHelp && e.key === 'Escape') {
        setShowHelp(false);
        return;
      }

      if (e.altKey && e.key >= '1' && e.key <= '8') {
        const idx = Number(e.key) - 1;
        const app = desktopApps[idx];
        if (app) {
          if (osSoundsOn()) playWindowOpen();
          openApp(app.id);
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [windows, openApp, closeWindow, showHelp]);

  return { showHelp, setShowHelp };
}
