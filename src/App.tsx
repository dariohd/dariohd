import { Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from './store/appStore';
import { TitleScreen } from './components/TitleScreen';
import { RoomScene } from './components/RoomScene';
import { CollisionEditor } from './components/CollisionEditor';

const isCollisionEdit =
  import.meta.env.DEV &&
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('collision') === 'edit';

const BootScreen = lazy(() =>
  import('./components/os/BootScreen').then((m) => ({ default: m.BootScreen })),
);
const Desktop = lazy(() =>
  import('./components/os/Desktop').then((m) => ({ default: m.Desktop })),
);

function PhaseLoader() {
  return (
    <div className="phase-loader">
      <div className="phase-loader__spinner" />
      <span>Chargement…</span>
    </div>
  );
}

export default function App() {
  const phase = useAppStore((s) => s.phase);

  if (isCollisionEdit) {
    return (
      <div className="app-shell">
        <CollisionEditor />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <AnimatePresence mode="wait">
        {phase === 'title' && (
          <motion.div key="title" className="phase" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <TitleScreen />
          </motion.div>
        )}
        {phase === 'room' && (
          <motion.div key="room" className="phase" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <RoomScene />
          </motion.div>
        )}
        {(phase === 'boot' || phase === 'desktop') && (
          <motion.div key="os" className="phase" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Suspense fallback={<PhaseLoader />}>
              {phase === 'boot' && <BootScreen />}
              {phase === 'desktop' && <Desktop />}
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
