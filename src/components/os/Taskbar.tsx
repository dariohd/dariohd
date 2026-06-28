import { useState } from 'react';
import { desktopApps } from '../../data/profile';
import { projects } from '../../data/projects';
import { useAppStore } from '../../store/appStore';
import { useOsStore } from '../../store/osStore';
import { StartMenu } from './StartMenu';

interface TaskbarProps {
  onStudio: () => void;
  onShutdown: () => void;
}

const QUICK_LAUNCH = ['projects', 'explorer', 'terminal', 'settings'] as const;

export function Taskbar({ onStudio, onShutdown }: TaskbarProps) {
  const windows = useOsStore((s) => s.windows);
  const openApp = useOsStore((s) => s.openApp);
  const focusWindow = useOsStore((s) => s.focusWindow);
  const toggleMinimize = useOsStore((s) => s.toggleMinimize);
  const discovered = useAppStore((s) => s.discovered);
  const [startOpen, setStartOpen] = useState(false);

  const topZ = Math.max(0, ...windows.map((w) => w.zIndex));
  const visibleWindows = windows.filter((w) => !w.minimized);

  return (
    <footer className="taskbar">
      <div className="taskbar__left">
        <div className="taskbar__start-wrap">
          <button
            type="button"
            className={`taskbar__start${startOpen ? ' taskbar__start--active' : ''}`}
            onClick={() => setStartOpen((v) => !v)}
            aria-expanded={startOpen}
            aria-haspopup="menu"
          >
            <span className="taskbar__start-icon">◆</span>
            Démarrer
          </button>
          <StartMenu
            open={startOpen}
            onClose={() => setStartOpen(false)}
            onStudio={onStudio}
            onShutdown={onShutdown}
          />
        </div>

        <div className="taskbar__quick" aria-label="Lancement rapide">
          {QUICK_LAUNCH.map((id) => {
            const app = desktopApps.find((a) => a.id === id);
            if (!app) return null;
            return (
              <button
                key={id}
                type="button"
                className="taskbar__quick-btn"
                title={app.label}
                onClick={() => openApp(id)}
              >
                {app.icon}
              </button>
            );
          })}
        </div>
      </div>

      <div className="taskbar__apps" role="tablist" aria-label="Fenêtres ouvertes">
        {visibleWindows.map((win) => {
          const active = win.zIndex === topZ;
          return (
            <button
              key={win.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={`taskbar__app${active ? ' taskbar__app--active' : ''}`}
              onClick={() => {
                if (active) toggleMinimize(win.id);
                else focusWindow(win.id);
              }}
            >
              <span className="taskbar__app-label">{win.title}</span>
            </button>
          );
        })}
      </div>

      <div className="taskbar__tray">
        <button
          type="button"
          className="taskbar__tray-btn"
          title="Collection projets"
          onClick={() => openApp('projects')}
        >
          ★ {discovered.size}/{projects.length}
        </button>
        <span className="taskbar__tray-dot" title="En ligne" />
        <span className="taskbar__tray-label">Wi-Fi</span>
      </div>
    </footer>
  );
}
