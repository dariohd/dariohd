import { useState } from 'react';
import { useOsStore } from '../../store/osStore';
import { StartMenu } from './StartMenu';

interface TaskbarProps {
  onStudio: () => void;
  onShutdown: () => void;
}

export function Taskbar({ onStudio, onShutdown }: TaskbarProps) {
  const windows = useOsStore((s) => s.windows);
  const focusWindow = useOsStore((s) => s.focusWindow);
  const toggleMinimize = useOsStore((s) => s.toggleMinimize);
  const [startOpen, setStartOpen] = useState(false);

  const topZ = Math.max(0, ...windows.map((w) => w.zIndex));

  return (
    <footer className="taskbar">
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

      <div className="taskbar__apps">
        {windows.map((win) => {
          const active = !win.minimized && win.zIndex === topZ;
          return (
            <button
              key={win.id}
              type="button"
              className={`taskbar__app${active ? ' taskbar__app--active' : ''}${win.minimized ? ' taskbar__app--minimized' : ''}`}
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
        <span className="taskbar__tray-dot" title="En ligne" />
        Wi-Fi
      </div>
    </footer>
  );
}
