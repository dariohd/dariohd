import { useEffect, useState } from 'react';
import {
  canEmbedPreview,
  getProjectById,
  getThumbnailUrl,
} from '../../data/projects';
import { useAppStore } from '../../store/appStore';
import { setWindowTitle } from '../../store/osStore';

interface ProjectDetailAppProps {
  projectId: string;
  windowId: string;
}

export function ProjectDetailApp({ projectId, windowId }: ProjectDetailAppProps) {
  const project = getProjectById(projectId);
  const markDiscovered = useAppStore((s) => s.markDiscovered);
  const [previewFailed, setPreviewFailed] = useState(false);

  useEffect(() => {
    if (project) {
      markDiscovered(project.id);
      setWindowTitle(windowId, project.name);
    }
  }, [project, markDiscovered, windowId]);

  if (!project) {
    return <p className="app-empty">Projet introuvable.</p>;
  }

  const showIframe = canEmbedPreview(project) && !previewFailed;

  return (
    <div className="app-project-detail">
      <header className="app-project-detail__header" style={{ borderColor: project.color }}>
        <span className="app-project-detail__icon">{project.icon}</span>
        <div>
          <h2>{project.name}</h2>
          <p>{project.tagline}</p>
        </div>
      </header>

      <p className="app-project-detail__desc">{project.description}</p>

      <div className="app-project-detail__tags">
        {project.tags.map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      <div className="app-project-detail__preview">
        {showIframe ? (
          <iframe
            src={project.url}
            title={`Aperçu ${project.name}`}
            className="app-project-detail__iframe"
            loading="lazy"
            onError={() => setPreviewFailed(true)}
          />
        ) : (
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="app-project-detail__thumb-link">
            <img
              src={getThumbnailUrl(project.url)}
              alt={`Capture ${project.name}`}
              className="app-project-detail__thumb"
            />
          </a>
        )}
      </div>

      <footer className="app-project-detail__footer">
        <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
          Ouvrir le site ↗
        </a>
      </footer>
    </div>
  );
}
