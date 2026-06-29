import { useState, type CSSProperties } from 'react';
import { canEmbedPreview, getThumbnailUrl, type Project } from '../../data/projects';
import { EmbedFrame } from './EmbedFrame';

interface ProjectPreviewProps {
  project: Project;
  className?: string;
  /** Aperçu live iframe (détail projet uniquement) */
  embed?: boolean;
}

export function ProjectPreview({ project, className, embed = false }: ProjectPreviewProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const [embedFailed, setEmbedFailed] = useState(false);
  const thumb = getThumbnailUrl(project);
  const useEmbed = embed && canEmbedPreview(project) && !embedFailed && imgFailed;

  if (useEmbed) {
    return (
      <div
        className={`project-preview-embed${className ? ` ${className}` : ''}`}
        aria-hidden="true"
      >
        <EmbedFrame
          src={project.url}
          title=""
          onBlocked={() => setEmbedFailed(true)}
        />
      </div>
    );
  }

  if (!imgFailed) {
    return (
      <img
        src={thumb}
        alt=""
        loading="lazy"
        className={className}
        onError={() => setImgFailed(true)}
      />
    );
  }

  if (embed && canEmbedPreview(project) && !embedFailed) {
    return (
      <div
        className={`project-preview-embed${className ? ` ${className}` : ''}`}
        aria-hidden="true"
      >
        <EmbedFrame
          src={project.url}
          title=""
          onBlocked={() => setEmbedFailed(true)}
        />
      </div>
    );
  }

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
