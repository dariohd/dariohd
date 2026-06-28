import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { playIconOpen } from '../../game/audio';
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
  zone: 'app' | 'game';
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
  zone,
  selected,
  onSelect,
  onOpen,
}: DraggableDesktopIconProps) {
  const iconPositions = useDesktopStore((s) => s.iconPositions);
  const setIconPosition = useDesktopStore((s) => s.setIconPosition);
  const slotRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
    ox: number;
    oy: number;
    moved: boolean;
  } | null>(null);

  const getPos = useCallback(() => {
    if (iconPositions[id]) return iconPositions[id]!;
    const surface = document.querySelector('.desktop__surface');
    const w = surface?.clientWidth ?? 800;
    return defaultIconPosition(zone, index, w);
  }, [iconPositions, id, index, zone]);

  const pos = getPos();

  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.button !== 0) return;
    dragRef.current = {
      pointerId: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      ox: pos.x,
      oy: pos.y,
      moved: false,
    };
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragRef.current || dragRef.current.pointerId !== e.pointerId) return;

    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;

    if (!dragRef.current.moved) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      dragRef.current.moved = true;
      slotRef.current?.setPointerCapture(e.pointerId);
    }

    const nx = Math.max(8, dragRef.current.ox + dx);
    const ny = Math.max(8, dragRef.current.oy + dy);
    setIconPosition(id, nx, ny);
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    if (!dragRef.current || dragRef.current.pointerId !== e.pointerId) return;

    const moved = dragRef.current.moved;
    dragRef.current = null;

    if (slotRef.current?.hasPointerCapture(e.pointerId)) {
      slotRef.current.releasePointerCapture(e.pointerId);
    }

    if (!moved) {
      if (useDesktopStore.getState().osSounds) playIconOpen();
      onSelect();
      onOpen();
    }
  };

  const onPointerCancel = (e: ReactPointerEvent) => {
    if (!dragRef.current || dragRef.current.pointerId !== e.pointerId) return;
    dragRef.current = null;
    if (slotRef.current?.hasPointerCapture(e.pointerId)) {
      slotRef.current.releasePointerCapture(e.pointerId);
    }
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
      ref={slotRef}
      className="desktop__icon-slot"
      style={{ left: pos.x, top: pos.y }}
      role="button"
      tabIndex={0}
      aria-label={shortcut ? `${label}, raccourci ${shortcut}` : label}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (useDesktopStore.getState().osSounds) playIconOpen();
          onSelect();
          onOpen();
        }
      }}
    >
      <DesktopIcon
        icon={icon}
        label={label}
        color={color}
        shortcut={shortcut}
        selected={selected}
        passive
      />
    </div>
  );
}
