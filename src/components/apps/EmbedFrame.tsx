import { useEffect, useRef } from 'react';

const EMBED_PROBE_MS = 6000;

interface EmbedFrameProps {
  src: string;
  title: string;
  className?: string;
  onBlocked?: () => void;
}

/**
 * iframe avec détection heuristique d'un embed bloqué (CSP frame-ancestors).
 * onLoad ne se déclenche pas toujours quand le navigateur refuse l'iframe.
 */
export function EmbedFrame({ src, title, className, onBlocked }: EmbedFrameProps) {
  const loadedRef = useRef(false);

  useEffect(() => {
    loadedRef.current = false;
    const timer = window.setTimeout(() => {
      if (!loadedRef.current) onBlocked?.();
    }, EMBED_PROBE_MS);
    return () => window.clearTimeout(timer);
  }, [src, onBlocked]);

  return (
    <iframe
      src={src}
      title={title}
      className={className}
      loading="lazy"
      tabIndex={-1}
      onLoad={() => {
        loadedRef.current = true;
      }}
    />
  );
}
