import { useState, type CSSProperties } from 'react';
import { canEmbedPreview, getThumbnailUrl, type Project } from '../../data/projects';

interface ProjectPreviewProps {
  project: Project;
  className?: string;
  /** Carte compacte : iframe live si le site le permet */
  embed?: boolean;
}

export function ProjectPreview({ project, className, embed = false }: ProjectPreviewProps) {
  const [failed, setFailed] = useState(false);
  const src = getThumbnailUrl(project);
  const useEmbed = embed && canEmbedPreview(project) && !failed;

  if (useEmbed) {
    return (
      <div
        className={`project-preview-embed${className ? ` ${className}` : ''}`}
        aria-hidden="true"
      >
        <iframe
          src={project.url}
          title=""
          loading="lazy"
          tabIndex={-1}
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  if (!src || failed) {
    return (
      <div
        className={`project-preview-fallback${className ? ` ${className}` : ''}`}
        style={{ '--accent': project.color } as CSSProperties}
        aria-hidden="true"
      >
        <span className="project-preview-fallback__icon">{project.icon}</span>
        <span className="project-preview-fallback__name">{project.name}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
