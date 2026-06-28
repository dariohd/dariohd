import { useOsStore } from '../../store/osStore';
import { useDesktopStore } from '../../store/desktopStore';
import type { DesktopAppId } from '../../data/profile';

interface DesktopContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}

export function DesktopContextMenu({ x, y, onClose }: DesktopContextMenuProps) {
  const openApp = useOsStore((s) => s.openApp);
  const minimizeAll = useOsStore((s) => s.minimizeAllWindows);
  const setWidgetsVisible = useDesktopStore((s) => s.setWidgetsVisible);
  const widgetsVisible = useDesktopStore((s) => s.widgetsVisible);

  const launch = (id: DesktopAppId) => {
    openApp(id);
    onClose();
  };

  return (
    <div
      className="desktop-context"
      style={{ left: x, top: y }}
      role="menu"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="desktop-context__group">
        <span className="desktop-context__label">Nouveau</span>
        <button type="button" role="menuitem" onClick={() => launch('notes')}>📝 Note</button>
        <button type="button" role="menuitem" onClick={() => launch('terminal')}>⌨️ Terminal</button>
        <button type="button" role="menuitem" onClick={() => launch('projects')}>📁 Fenêtre Projets</button>
      </div>
      <div className="desktop-context__divider" />
      <button type="button" role="menuitem" onClick={() => { minimizeAll(); onClose(); }}>
        Afficher le bureau
      </button>
      <button
        type="button"
        role="menuitem"
        onClick={() => { setWidgetsVisible(!widgetsVisible); onClose(); }}
      >
        {widgetsVisible ? 'Masquer' : 'Afficher'} les widgets
      </button>
      <button type="button" role="menuitem" onClick={() => launch('settings')}>
        ⚙️ Paramètres
      </button>
    </div>
  );
}
