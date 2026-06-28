import { useEffect, useRef, useState } from 'react';
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
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) {
      setQuery('');
      return;
    }
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

  const filtered = desktopApps.filter((app) =>
    app.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="start-menu" ref={menuRef} role="menu" aria-label="Menu Démarrer">
      <div className="start-menu__header">
        <span className="start-menu__avatar">{profile.alias[0]}</span>
        <div>
          <div className="start-menu__user">{profile.handle}</div>
          <div className="start-menu__host">{profile.alias}.local · Chambre Nate</div>
        </div>
      </div>

      <div className="start-menu__search">
        <input
          type="search"
          placeholder="Rechercher une application…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Rechercher"
          autoFocus
        />
      </div>

      <div className="start-menu__apps">
        {filtered.length === 0 ? (
          <p className="start-menu__empty">Aucune application trouvée.</p>
        ) : (
          filtered.map((app) => {
            const idx = desktopApps.findIndex((a) => a.id === app.id);
            return (
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
                {idx >= 0 && idx < 8 && <kbd>Alt+{idx + 1}</kbd>}
              </button>
            );
          })
        )}
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
