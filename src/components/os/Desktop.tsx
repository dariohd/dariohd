import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { desktopApps } from '../../data/profile';
import { projects } from '../../data/projects';
import { useAppStore } from '../../store/appStore';
import { useOsStore } from '../../store/osStore';
import { useDesktopShortcuts } from '../../hooks/useDesktopShortcuts';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { playShutdown } from '../../game/audio';
import { DiscoveryToast } from '../DiscoveryToast';
import { DesktopIcon } from './DesktopIcon';
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
  const { showHelp, setShowHelp } = useDesktopShortcuts();
  const [clock, setClock] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [shuttingDown, setShuttingDown] = useState(false);
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);
  const initialProjectsOpened = useRef(false);
  const helpPanelRef = useRef<HTMLDivElement>(null);

  useFocusTrap(helpPanelRef, showHelp, () => setShowHelp(false));

  useEffect(() => {
    const tick = () => {
      setClock(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  // Ouvre Projets une seule fois à l'arrivée sur le bureau (pas à chaque fermeture)
  useEffect(() => {
    if (initialProjectsOpened.current || windows.length > 0) return;
    initialProjectsOpened.current = true;
    const t = setTimeout(() => openApp('projects'), 400);
    return () => clearTimeout(t);
  }, [openApp, windows.length]);

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

  return (
    <div className="desktop">
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
        <nav className="desktop__menubar-nav">
          <button type="button" onClick={() => openApp('projects')}>Projets</button>
          <button type="button" onClick={() => openApp('about')}>À propos</button>
          <button type="button" onClick={() => openApp('terminal')}>Terminal</button>
          <button type="button" onClick={goToRoom}>Chambre</button>
          <button type="button" onClick={() => setShowHelp(true)} title="Raccourcis">?</button>
        </nav>
        <div className="desktop__menubar-right">
          <span className="desktop__progress">
            {discovered.size}/{projects.length}
          </span>
          <span className="desktop__clock">{clock}</span>
        </div>
      </header>

      <main className="desktop__surface" onClick={() => setSelectedIcon(null)}>
        <div className="desktop__icons">
          {desktopApps.map((app, i) => (
            <DesktopIcon
              key={app.id}
              icon={app.icon}
              label={app.label}
              color={app.color}
              shortcut={`Alt+${i + 1}`}
              selected={selectedIcon === app.id}
              onSelect={() => setSelectedIcon(app.id)}
              onOpen={() => openApp(app.id)}
            />
          ))}
        </div>

        {windows.map((win) => (
          <Window key={win.id} win={win}>
            <AppContent win={win} />
          </Window>
        ))}

        <AnimatePresence>
          {!welcomeDismissed && discovered.size === 0 && (
            <motion.div
              className="desktop__welcome"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              role="status"
            >
              <p>
                <strong>Bienvenue sur DHD OS.</strong> Explore les projets dans la fenêtre
                ouverte — chaque fiche visitée est ajoutée à ta collection.
              </p>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setWelcomeDismissed(true)}>
                Compris
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Taskbar onStudio={goToRoom} onShutdown={shutdown} />
      <DiscoveryToast />

      {discovered.size === projects.length && (
        <div className="desktop__achievement" role="status">
          ★ Collection complète — 6/6 projets
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
              <li><kbd>Alt</kbd> + <kbd>1–5</kbd> Ouvrir une app</li>
              <li><kbd>Échap</kbd> Fermer la fenêtre active</li>
              <li><kbd>?</kbd> Afficher cette aide</li>
              <li>Double-clic icône bureau Ouvrir app</li>
              <li>Glisser coin bas-droit Redimensionner fenêtre</li>
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
