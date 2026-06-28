import { useEffect, useRef } from 'react';
import { desktopApps, profile } from '../../data/profile';
import type { DesktopAppId } from '../../data/profile';
import { useOsStore } from '../../store/osStore';

interface StartMenuProps {
  open: boolean;
  onClose: () => void;
  onStudio: () => void;
  onShutdown: () => void;
}

export function StartMenu({ open, onClose, onStudio, onShutdown }: StartMenuProps) {
  const openApp = useOsStore((s) => s.openApp);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('mousedown', onPointer);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onPointer);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const launch = (id: DesktopAppId) => {
    openApp(id);
    onClose();
  };

  return (
    <div className="start-menu" ref={menuRef} role="menu" aria-label="Menu Démarrer">
      <div className="start-menu__header">
        <span className="start-menu__avatar">{profile.alias[0]}</span>
        <div>
          <div className="start-menu__user">{profile.handle}</div>
          <div className="start-menu__host">{profile.alias}.local · Chambre Nate</div>
        </div>
      </div>

      <div className="start-menu__apps">
        {desktopApps.map((app, i) => (
          <button
            key={app.id}
            type="button"
            className="start-menu__item"
            role="menuitem"
            onClick={() => launch(app.id)}
          >
            <span className="start-menu__icon" style={{ background: `${app.color}33` }}>
              {app.icon}
            </span>
            <span>{app.label}</span>
            <kbd>Alt+{i + 1}</kbd>
          </button>
        ))}
      </div>

      <div className="start-menu__footer">
        <button type="button" className="start-menu__action" onClick={() => { onStudio(); onClose(); }}>
          🎮 Retour chambre
        </button>
        <button type="button" className="start-menu__action start-menu__action--danger" onClick={() => { onShutdown(); onClose(); }}>
          ⏻ Éteindre
        </button>
      </div>
    </div>
  );
}
