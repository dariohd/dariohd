import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { desktopApps } from '../../data/profile';
import { desktopFolders } from '../../data/desktopItems';
import { projects } from '../../data/projects';
import { useAppStore } from '../../store/appStore';
import { useDesktopStore } from '../../store/desktopStore';
import { useOsStore } from '../../store/osStore';
import { useDesktopShortcuts } from '../../hooks/useDesktopShortcuts';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { playIconOpen, playShutdown } from '../../game/audio';
import { DiscoveryToast } from '../DiscoveryToast';
import { DesktopContextMenu } from './DesktopContextMenu';
import { DesktopFolder } from './DesktopFolder';
import { DesktopWidgets } from './DesktopWidgets';
import { DraggableDesktopIcon } from './DraggableDesktopIcon';
import { Taskbar } from './Taskbar';
import { Window } from './Window';
import { AppContent } from '../apps/AppContent';

export function Desktop() {
  const openApp = useOsStore((s) => s.openApp);
  const windows = useOsStore((s) => s.windows);
  const closeAllWindows = useOsStore((s) => s.closeAllWindows);
  const discovered = useAppStore((s) => s.discovered);
  const resetProgress = useAppStore((s) => s.resetProgress);
  const setPhase = useAppStore((s) => s.setPhase);
  const wallpaper = useDesktopStore((s) => s.wallpaper);
  const widgetsVisible = useDesktopStore((s) => s.widgetsVisible);
  const contextMenu = useDesktopStore((s) => s.contextMenu);
  const openContextMenu = useDesktopStore((s) => s.openContextMenu);
  const closeContextMenu = useDesktopStore((s) => s.closeContextMenu);
  const { showHelp, setShowHelp } = useDesktopShortcuts();
  const [clock, setClock] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [shuttingDown, setShuttingDown] = useState(false);
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);
  const initialProjectsOpened = useRef(false);
  const helpPanelRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLElement>(null);

  useFocusTrap(helpPanelRef, showHelp, () => setShowHelp(false));

  useEffect(() => {
    const tick = () => {
      setClock(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (initialProjectsOpened.current || windows.length > 0) return;
    initialProjectsOpened.current = true;
    const t = setTimeout(() => openApp('projects'), 500);
    return () => clearTimeout(t);
  }, [openApp, windows.length]);

  useEffect(() => {
    if (!contextMenu) return;
    const close = (e: Event) => {
      if ((e.target as HTMLElement).closest('.desktop-context')) return;
      closeContextMenu();
    };
    window.addEventListener('mousedown', close);
    window.addEventListener('scroll', close, true);
    return () => {
      window.removeEventListener('mousedown', close);
      window.removeEventListener('scroll', close, true);
    };
  }, [contextMenu, closeContextMenu]);

  const goToRoom = useCallback(() => {
    closeAllWindows();
    setPhase('room');
  }, [closeAllWindows, setPhase]);

  const shutdown = useCallback(() => {
    if (shuttingDown) return;
    playShutdown();
    setShuttingDown(true);
    setTimeout(() => {
      closeAllWindows();
      setPhase('room');
    }, 900);
  }, [closeAllWindows, setPhase, shuttingDown]);

  const onSurfaceContextMenu = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.os-window, .desktop__icon-slot, .desktop-folder, .desktop-widgets')) {
      return;
    }
    e.preventDefault();
    const rect = surfaceRef.current?.getBoundingClientRect();
    if (!rect) return;
    openContextMenu(e.clientX - rect.left, e.clientY - rect.top);
  };

  const openFolder = (folder: (typeof desktopFolders)[number]) => {
    playIconOpen();
    if (folder.action === 'app' && folder.appId) openApp(folder.appId);
    else if (folder.url) window.open(folder.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`desktop desktop--wallpaper-${wallpaper}`}>
      <div className="desktop__wallpaper" aria-hidden="true">
        <div className="desktop__grid" />
        <div className="desktop__orb desktop__orb--1" />
        <div className="desktop__orb desktop__orb--2" />
        <div className="desktop__orb desktop__orb--3" />
      </div>

      <header className="desktop__menubar">
        <span className="desktop__menubar-brand">
          <span className="desktop__menubar-dot" /> DHD OS
        </span>
        <nav className="desktop__menubar-nav" aria-label="Menu principal">
          <button type="button" onClick={() => openApp('projects')}>Projets</button>
          <button type="button" onClick={() => openApp('explorer')}>Explorateur</button>
          <button type="button" onClick={() => openApp('about')}>À propos</button>
          <button type="button" onClick={() => openApp('terminal')}>Terminal</button>
          <button type="button" onClick={goToRoom}>Chambre</button>
          <button type="button" onClick={() => setShowHelp(true)} title="Raccourcis">?</button>
        </nav>
        <div className="desktop__menubar-right">
          <span className="desktop__progress" title="Projets découverts">
            ★ {discovered.size}/{projects.length}
          </span>
          <span className="desktop__clock">{clock}</span>
        </div>
      </header>

      <main
        ref={surfaceRef}
        className="desktop__surface"
        onClick={() => { setSelectedIcon(null); closeContextMenu(); }}
        onContextMenu={onSurfaceContextMenu}
      >
        {widgetsVisible && <DesktopWidgets />}

        {desktopApps.map((app, i) => (
          <DraggableDesktopIcon
            key={app.id}
            id={app.id}
            icon={app.icon}
            label={app.label}
            color={app.color}
            shortcut={i < 8 ? `Alt+${i + 1}` : undefined}
            index={i}
            selected={selectedIcon === app.id}
            onSelect={() => setSelectedIcon(app.id)}
            onOpen={() => openApp(app.id)}
          />
        ))}

        <div className="desktop__folders" aria-label="Dossiers bureau">
          {desktopFolders.map((folder) => (
            <DesktopFolder
              key={folder.id}
              icon={folder.icon}
              label={folder.label}
              color={folder.color}
              onOpen={() => openFolder(folder)}
            />
          ))}
        </div>

        {windows.map((win) => (
          <Window key={win.id} win={win}>
            <AppContent win={win} />
          </Window>
        ))}

        {contextMenu && (
          <DesktopContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={closeContextMenu}
          />
        )}
      </main>

      <AnimatePresence>
        {!welcomeDismissed && discovered.size === 0 && (
          <motion.div
            className="desktop__welcome-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Bienvenue"
          >
            <motion.div
              className="desktop__welcome"
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <p>
                <strong>Bienvenue sur DHD OS.</strong> Icônes à droite, dossiers en bas.
                Clic droit sur le bureau pour plus d’options — explore les projets !
              </p>
              <button type="button" className="btn btn--primary btn--sm" onClick={() => setWelcomeDismissed(true)}>
                Compris
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Taskbar onStudio={goToRoom} onShutdown={shutdown} />
      <DiscoveryToast />

      {discovered.size === projects.length && (
        <div className="desktop__achievement" role="status">
          ★ Collection complète — {projects.length}/{projects.length} projets
        </div>
      )}

      <button type="button" className="desktop__reset" title="Réinitialiser la progression" onClick={resetProgress}>
        ↺
      </button>

      {showHelp && (
        <div
          className="shortcuts-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Raccourcis clavier"
          onClick={() => setShowHelp(false)}
        >
          <div
            ref={helpPanelRef}
            className="shortcuts-overlay__panel"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Raccourcis DHD OS</h3>
            <ul>
              <li><kbd>Alt</kbd> + <kbd>1–8</kbd> Ouvrir une app</li>
              <li><kbd>Échap</kbd> Fermer la fenêtre active</li>
              <li><kbd>?</kbd> Afficher cette aide</li>
              <li>Double-clic icône Ouvrir · Glisser pour déplacer</li>
              <li>Clic droit bureau Menu contextuel</li>
              <li>Terminal <code>studio</code> Retour chambre</li>
            </ul>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setShowHelp(false)}>
              Fermer
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {shuttingDown && (
          <motion.div
            className="desktop__shutdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="desktop__shutdown-text">Arrêt en cours…</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
