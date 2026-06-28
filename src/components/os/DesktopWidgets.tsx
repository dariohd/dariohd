import { useEffect, useState } from 'react';
import { profile } from '../../data/profile';
import { projects } from '../../data/projects';
import { useAppStore } from '../../store/appStore';
import { useOsStore } from '../../store/osStore';

export function DesktopWidgets() {
  const discovered = useAppStore((s) => s.discovered);
  const openApp = useOsStore((s) => s.openApp);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const pct = Math.round((discovered.size / projects.length) * 100);

  return (
    <aside className="desktop-widgets" aria-label="Widgets bureau">
      <div className="desktop-widget desktop-widget--clock">
        <div className="desktop-widget__time">
          {now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="desktop-widget__date">
          {now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
        <div className="desktop-widget__host">{profile.alias}.local</div>
      </div>

      <div className="desktop-widget desktop-widget--progress">
        <div className="desktop-widget__title">Collection projets</div>
        <div className="desktop-widget__stat">
          <strong>{discovered.size}</strong>
          <span>/ {projects.length}</span>
        </div>
        <div className="desktop-widget__bar">
          <div className="desktop-widget__bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <button type="button" className="desktop-widget__link" onClick={() => openApp('projects')}>
          Ouvrir Projets →
        </button>
      </div>

      <div className="desktop-widget desktop-widget--quick">
        <div className="desktop-widget__title">Raccourcis</div>
        <div className="desktop-widget__actions">
          <button type="button" onClick={() => openApp('explorer')}>🗂️ Explorer</button>
          <button type="button" onClick={() => openApp('contact')}>✉️ Contact</button>
          <button type="button" onClick={() => openApp('settings')}>⚙️ Réglages</button>
        </div>
      </div>
    </aside>
  );
}
