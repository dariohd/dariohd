import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/appStore';
import { profile } from '../../data/profile';
import { projects } from '../../data/projects';
import { playBootComplete, playBootTick } from '../../game/audio';

const BOOT_LINES = [
  'Connexion depuis Chambre Nate… OK',
  `Session locale ${profile.handle}@${profile.alias}… OK`,
  `${profile.alias} OS v2.0 — noyau stable`,
  'Gestionnaire de fenêtres… OK',
  `Indexation portfolio (${projects.length} projets)… OK`,
  'Réseau Vercel… OK',
  `Bureau prêt — bienvenue ${profile.handle}.`,
];

export function BootScreen() {
  const setPhase = useAppStore((s) => s.setPhase);
  const skipBoot = useAppStore((s) => s.skipBoot);
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        playBootTick();
        setLines((prev) => [...prev, BOOT_LINES[i]!]);
        setProgress(Math.round(((i + 1) / BOOT_LINES.length) * 100));
        i += 1;
      } else {
        clearInterval(interval);
        setProgress(100);
        setDone(true);
        playBootComplete();
        setTimeout(() => {
          skipBoot();
          setPhase('desktop');
        }, 600);
      }
    }, 340);
    return () => clearInterval(interval);
  }, [setPhase, skipBoot]);

  const skip = () => {
    skipBoot();
    setPhase('desktop');
  };

  return (
    <div className="boot-screen">
      <div className="boot-screen__crt" aria-hidden="true" />
      <motion.div
        className="boot-screen__panel"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="boot-screen__header">
          <div className="boot-screen__logo">{profile.alias} OS</div>
          <span className="boot-screen__version">build 2.0 · chambre</span>
        </div>

        <div className="boot-screen__progress">
          <div className="boot-screen__progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="boot-screen__progress-label">{progress}%</div>

        <div className="boot-screen__log" role="log" aria-live="polite">
          {lines.map((line, idx) => (
            <div key={`${idx}-${line}`} className="boot-screen__line">
              <span className="boot-screen__caret">&gt;</span> {line}
            </div>
          ))}
          {!done && <div className="boot-screen__line boot-screen__line--blink">_</div>}
        </div>

        <button type="button" className="boot-screen__skip" onClick={skip}>
          Passer →
        </button>
      </motion.div>
    </div>
  );
}
