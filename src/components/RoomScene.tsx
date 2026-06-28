import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import {
  createPlayerStart,
  getCanvasDimensions,
  isNearInteract,
  isOnStairs,
  mapCoordsFromCanvas,
  renderRoom,
  shouldUseStairs,
  tryStairsClick,
  tryPcClick,
  updatePlayer,
  type Dir,
  type PlayerState,
} from '../game/roomEngine';
import { loadSprites, reloadCollisionMask } from '../game/sprites';
import { playInteract } from '../game/audio';

const DIR_KEYS: Record<Dir, string> = {
  up: 'arrowup',
  down: 'arrowdown',
  left: 'arrowleft',
  right: 'arrowright',
};

export function RoomScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const playerRef = useRef<PlayerState>(createPlayerStart());
  const pulseRef = useRef(0);
  const exitingRef = useRef(false);

  const setPhase = useAppStore((s) => s.setPhase);
  const hintDismissed = useAppStore((s) => s.hintDismissed);
  const dismissHint = useAppStore((s) => s.dismissHint);
  const bootSkipped = useAppStore((s) => s.bootSkipped);

  const [loaded, setLoaded] = useState(false);
  const [booting, setBooting] = useState(false);
  const [bootMsg, setBootMsg] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadSprites()
      .then(() => reloadCollisionMask())
      .then(() => {
        if (!cancelled) setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLoaded(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const exitViaStairs = useCallback(() => {
    if (exitingRef.current || !isOnStairs(playerRef.current)) return;
    playInteract();
    exitingRef.current = true;
    setExiting(true);
    setTimeout(() => setPhase('title'), 500);
  }, [setPhase]);

  const tryInteract = useCallback(() => {
    if (booting || exitingRef.current) return;

    if (isOnStairs(playerRef.current)) {
      exitViaStairs();
      return;
    }

    if (!isNearInteract(playerRef.current)) return;
    playInteract();
    setBooting(true);
    setBootMsg(0);
    const msgs = setInterval(() => setBootMsg((m) => (m + 1) % 3), 280);
    setTimeout(() => {
      clearInterval(msgs);
      setPhase(bootSkipped ? 'desktop' : 'boot');
    }, 1100);
  }, [bootSkipped, booting, setPhase, exitViaStairs]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());

      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }

      const key = e.key.toLowerCase();
      if (key === 'e' || e.key === 'Enter') {
        tryInteract();
        return;
      }

      if (
        (key === 'arrowdown' ||
          key === 's' ||
          key === 'arrowup' ||
          key === 'w' ||
          key === 'z') &&
        isOnStairs(playerRef.current)
      ) {
        exitViaStairs();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key.toLowerCase());
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [tryInteract, exitViaStairs]);

  useEffect(() => {
    if (!loaded) return;
    playerRef.current = createPlayerStart();
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    const fitCanvas = () => {
      const { w: canvasW, h: canvasH } = getCanvasDimensions();
      const scale = Math.min(stage.clientWidth / canvasW, stage.clientHeight / canvasH, 1);
      canvas.style.width = `${canvasW * scale}px`;
      canvas.style.height = `${canvasH * scale}px`;
    };

    fitCanvas();
    const ro = new ResizeObserver(fitCanvas);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { w: canvasW, h: canvasH } = getCanvasDimensions();
    canvas.width = canvasW;
    canvas.height = canvasH;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();
    let paused = document.hidden;

    const onVisibility = () => {
      paused = document.hidden;
      if (!paused) last = performance.now();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const tick = (now: number) => {
      if (paused) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      pulseRef.current = (pulseRef.current + dt * 1.8) % 1;

      if (!exitingRef.current) {
        updatePlayer(playerRef.current, keysRef.current, dt);
        if (shouldUseStairs(playerRef.current, keysRef.current)) {
          exitViaStairs();
        }
      }

      const nearPc = isNearInteract(playerRef.current);
      const onStairs = isOnStairs(playerRef.current);

      renderRoom(ctx, playerRef.current, pulseRef.current, nearPc, onStairs);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [loaded, exitViaStairs]);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas || booting || exitingRef.current) return;
      const { x, y } = mapCoordsFromCanvas(canvas, e.clientX, e.clientY);
      if (tryStairsClick(playerRef.current, x, y)) {
        exitViaStairs();
        return;
      }
      if (tryPcClick(playerRef.current, x, y)) tryInteract();
    },
    [booting, tryInteract, exitViaStairs],
  );

  const bindDir = (dir: Dir) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      keysRef.current.add(DIR_KEYS[dir]);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    onPointerUp: () => keysRef.current.delete(DIR_KEYS[dir]),
    onPointerLeave: () => keysRef.current.delete(DIR_KEYS[dir]),
    onPointerCancel: () => keysRef.current.delete(DIR_KEYS[dir]),
  });

  return (
    <div className={`room-scene${booting ? ' room-scene--booting' : ''}${exiting ? ' room-scene--exiting' : ''}`}>
      <header className="room-scene__header">
        <span className="room-scene__brand">Chambre · DHD OS</span>
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => setPhase('title')}>
          ← Menu
        </button>
      </header>

      <div className="room-scene__stage" ref={stageRef}>
        {!loaded ? (
          <div className="room-scene__loading">
            <div className="phase-loader__spinner" />
            <span>Chargement…</span>
          </div>
        ) : (
          <div className="room-scene__frame">
            <canvas
              ref={canvasRef}
              className="room-scene__canvas"
              aria-label="Chambre pixel"
              onClick={handleCanvasClick}
            />

            <AnimatePresence>
              {booting && (
                <motion.div
                  className="room-scene__crt room-scene__crt--poweron"
                  initial={{ opacity: 0, scaleY: 0.02 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  <div className="room-scene__crt-glow" aria-hidden="true" />
                  <div className="room-scene__crt-text">
                    {['Connexion PC…', 'Chargement DHD OS…', 'Ouverture session…'][bootMsg]}
                  </div>
                  <div className="room-scene__crt-bar" aria-hidden="true">
                    <motion.div
                      className="room-scene__crt-bar-fill"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.85, ease: 'easeInOut' }}
                    />
                  </div>
                </motion.div>
              )}
              {exiting && (
                <motion.div
                  className="room-scene__crt room-scene__crt--exit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="room-scene__crt-text">Descente…</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {loaded && !hintDismissed && (
          <div className="room-scene__help">
            <p>
              Escaliers (haut-droite) · <kbd>E</kbd> ou <kbd>↑</kbd>/<kbd>↓</kbd> · PC · <kbd>E</kbd> ou clic
            </p>
            <button type="button" className="btn btn--ghost btn--sm" onClick={dismissHint}>
              OK
            </button>
          </div>
        )}
      </div>

      {loaded && (
        <div className="room-scene__touch">
          <div className="touch-dpad">
            <button type="button" className="touch-btn touch-btn--up" aria-label="Haut" {...bindDir('up')}>▲</button>
            <button type="button" className="touch-btn touch-btn--left" aria-label="Gauche" {...bindDir('left')}>◀</button>
            <button type="button" className="touch-btn touch-btn--down" aria-label="Bas" {...bindDir('down')}>▼</button>
            <button type="button" className="touch-btn touch-btn--right" aria-label="Droite" {...bindDir('right')}>▶</button>
          </div>
          <button type="button" className="touch-action" aria-label="Interagir" onClick={tryInteract}>
            E
          </button>
        </div>
      )}
    </div>
  );
}
