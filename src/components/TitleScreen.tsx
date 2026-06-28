import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { profile } from '../data/profile';
import { projects } from '../data/projects';

export function TitleScreen() {
  const setPhase = useAppStore((s) => s.setPhase);
  const discovered = useAppStore((s) => s.discovered);

  return (
    <div className="title-screen">
      <div className="title-screen__grid" aria-hidden="true" />
      <div className="title-screen__glow" aria-hidden="true" />

      <motion.div
        className="title-screen__content"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="title-screen__logo-mark">{profile.alias}</div>
        <p className="title-screen__eyebrow">Portfolio interactif · {profile.handle}</p>
        <h1 className="title-screen__title">{profile.name}</h1>
        <p className="title-screen__subtitle">
          Entrez dans la chambre, allumez le PC et explorez mes projets web.
        </p>

        <div className="title-screen__actions">
          <button type="button" className="btn btn--primary" onClick={() => setPhase('room')}>
            ▶ Entrer dans la chambre
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              useAppStore.getState().skipBoot();
              setPhase('desktop');
            }}
          >
            Accès direct au bureau
          </button>
        </div>

        <div className="title-screen__meta">
          <span>{discovered.size}/{projects.length} projets découverts</span>
          <span>Alt+1–8 raccourcis OS</span>
        </div>
      </motion.div>
    </div>
  );
}
