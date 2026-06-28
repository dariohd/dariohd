import { useState, type PointerEvent as ReactPointerEvent } from 'react';
import { playIconOpen } from '../../game/audio';

interface DesktopIconProps {
  icon: string;
  label: string;
  color: string;
  shortcut?: string;
  selected?: boolean;
  onSelect: () => void;
  onOpen: () => void;
}

export function DesktopIcon({ icon, label, color, shortcut, selected, onSelect, onOpen }: DesktopIconProps) {
  const [pressed, setPressed] = useState(false);

  const handleOpen = () => {
    playIconOpen();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(12);
    }
    onOpen();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selected) {
      handleOpen();
      return;
    }
    onSelect();
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    setPressed(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerUp = () => setPressed(false);

  return (
    <button
      type="button"
      className={`desktop-icon${selected ? ' desktop-icon--selected' : ''}${pressed ? ' desktop-icon--pressed' : ''}`}
      aria-label={`${label}${shortcut ? `, raccourci ${shortcut}` : ''}`}
      onClick={handleClick}
      onDoubleClick={(e) => {
        e.stopPropagation();
        handleOpen();
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <span className="desktop-icon__badge" style={{ background: `${color}22`, borderColor: `${color}88` }}>
        <span className="desktop-icon__emoji" aria-hidden="true">{icon}</span>
        <span className="desktop-icon__shine" aria-hidden="true" />
      </span>
      <span className="desktop-icon__label">{label}</span>
      {shortcut && <span className="desktop-icon__shortcut">{shortcut}</span>}
    </button>
  );
}
