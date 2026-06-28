import { useDesktopStore, wallpapers } from '../../store/desktopStore';
import { useAppStore } from '../../store/appStore';
import { profile } from '../../data/profile';
import { projects } from '../../data/projects';

export function SettingsApp() {
  const wallpaper = useDesktopStore((s) => s.wallpaper);
  const widgetsVisible = useDesktopStore((s) => s.widgetsVisible);
  const osSounds = useDesktopStore((s) => s.osSounds);
  const setWallpaper = useDesktopStore((s) => s.setWallpaper);
  const setWidgetsVisible = useDesktopStore((s) => s.setWidgetsVisible);
  const setOsSounds = useDesktopStore((s) => s.setOsSounds);
  const resetProgress = useAppStore((s) => s.resetProgress);
  const discovered = useAppStore((s) => s.discovered);

  return (
    <div className="app-settings">
      <header className="app-settings__header">
        <h2>Paramètres système</h2>
        <p>DHD OS v2.0 · {profile.handle}@{profile.alias}</p>
      </header>

      <section className="app-settings__section">
        <h3>Apparence</h3>
        <p className="app-settings__desc">Fond d’écran du bureau</p>
        <div className="app-settings__wallpapers">
          {wallpapers.map((wp) => (
            <button
              key={wp.id}
              type="button"
              className={`wallpaper-swatch wallpaper-swatch--${wp.id}${wallpaper === wp.id ? ' wallpaper-swatch--active' : ''}`}
              onClick={() => setWallpaper(wp.id)}
              aria-pressed={wallpaper === wp.id}
            >
              <span>{wp.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="app-settings__section">
        <h3>Bureau</h3>
        <label className="app-settings__toggle">
          <input
            type="checkbox"
            checked={widgetsVisible}
            onChange={(e) => setWidgetsVisible(e.target.checked)}
          />
          <span>Afficher les widgets (horloge, progression)</span>
        </label>
      </section>

      <section className="app-settings__section">
        <h3>Son</h3>
        <label className="app-settings__toggle">
          <input
            type="checkbox"
            checked={osSounds}
            onChange={(e) => setOsSounds(e.target.checked)}
          />
          <span>Sons du système (fenêtres, icônes)</span>
        </label>
      </section>

      <section className="app-settings__section">
        <h3>Progression</h3>
        <p className="app-settings__desc">
          {discovered.size}/{projects.length} projets découverts dans la collection.
        </p>
        <button type="button" className="btn btn--ghost btn--sm" onClick={resetProgress}>
          Réinitialiser la collection
        </button>
      </section>

      <section className="app-settings__section app-settings__section--muted">
        <h3>À propos du système</h3>
        <ul>
          <li>Chambre Nate · style Pokémon NB2</li>
          <li>Bureau DHD OS · React + TypeScript</li>
          <li>{profile.brand} · {profile.location}</li>
        </ul>
      </section>
    </div>
  );
}
