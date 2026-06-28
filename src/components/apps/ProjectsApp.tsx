import { useState, type CSSProperties } from 'react';
import { getThumbnailUrl, projects, type Project } from '../../data/projects';
import { useAppStore } from '../../store/appStore';
import { useOsStore } from '../../store/osStore';

type Filter = 'all' | Project['category'];

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: 'client', label: 'Clients' },
  { id: 'product', label: 'Produits' },
  { id: 'game', label: 'Jeux' },
];

export function ProjectsApp() {
  const openApp = useOsStore((s) => s.openApp);
  const discovered = useAppStore((s) => s.discovered);
  const [filter, setFilter] = useState<Filter>('all');

  const visible = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  const openProject = (id: string) => {
    openApp('project-detail', { projectId: id });
  };

  return (
    <div className="app-projects">
      <header className="app-projects__header">
        <div>
          <h2>Projets</h2>
          <p>{projects.length} réalisations · {discovered.size} visitées</p>
        </div>
        <div className="app-projects__filters">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`filter-tab${filter === f.id ? ' filter-tab--active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <div className="app-projects__grid">
        {visible.map((project) => (
          <button
            key={project.id}
            type="button"
            className="project-card"
            style={{ '--accent': project.color } as CSSProperties}
            onClick={() => openProject(project.id)}
          >
            <div className="project-card__preview">
              <img src={getThumbnailUrl(project.url)} alt="" loading="lazy" />
              <span className="project-card__icon">{project.icon}</span>
              {discovered.has(project.id) && <span className="project-card__badge">✓</span>}
            </div>
            <div className="project-card__body">
              <h3 className="project-card__name">{project.name}</h3>
              <p className="project-card__tagline">{project.tagline}</p>
              <div className="project-card__tags">
                {project.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="project-card__tag">{tag}</span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
