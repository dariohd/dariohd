import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { DesktopIcon } from './DesktopIcon';
import { useDesktopStore } from '../../store/desktopStore';
import { defaultIconPosition } from '../../data/desktopItems';

const DRAG_THRESHOLD = 8;

interface DraggableDesktopIconProps {
  id: string;
  icon: string;
  label: string;
  color: string;
  shortcut?: string;
  index: number;
  selected?: boolean;
  onSelect: () => void;
  onOpen: () => void;
}

export function DraggableDesktopIcon({
  id,
  icon,
  label,
  color,
  shortcut,
  index,
  selected,
  onSelect,
  onOpen,
}: DraggableDesktopIconProps) {
  const iconPositions = useDesktopStore((s) => s.iconPositions);
  const setIconPosition = useDesktopStore((s) => s.setIconPosition);
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number; moved: boolean } | null>(null);

  const getPos = useCallback(() => {
    if (iconPositions[id]) return iconPositions[id]!;
    const surface = document.querySelector('.desktop__surface');
    const w = surface?.clientWidth ?? 800;
    return defaultIconPosition(index, w);
  }, [iconPositions, id, index]);

  const pos = getPos();

  const onDragStart = (e: ReactPointerEvent) => {
    if (e.button !== 0) return;
    dragRef.current = { x: e.clientX, y: e.clientY, ox: pos.x, oy: pos.y, moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onDragMove = (e: ReactPointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    if (!dragRef.current.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    dragRef.current.moved = true;
    const nx = Math.max(8, dragRef.current.ox + dx);
    const ny = Math.max(8, dragRef.current.oy + dy);
    setIconPosition(id, nx, ny);
  };

  const onDragEnd = () => {
    dragRef.current = null;
  };

  useEffect(() => {
    const onResize = () => {
      if (!iconPositions[id]) return;
      const surface = document.querySelector('.desktop__surface');
      if (!surface) return;
      const maxX = surface.clientWidth - 96;
      const p = iconPositions[id]!;
      if (p.x > maxX) setIconPosition(id, maxX, p.y);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [iconPositions, id, setIconPosition]);

  return (
    <div
      className="desktop__icon-slot"
      style={{ left: pos.x, top: pos.y }}
      onPointerDown={onDragStart}
      onPointerMove={onDragMove}
      onPointerUp={onDragEnd}
      onPointerCancel={onDragEnd}
    >
      <DesktopIcon
        icon={icon}
        label={label}
        color={color}
        shortcut={shortcut}
        selected={selected}
        onSelect={onSelect}
        onOpen={onOpen}
      />
    </div>
  );
}
