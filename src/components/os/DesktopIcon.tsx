import { useState } from 'react';
import { playIconOpen as playIconOpenRaw } from '../../game/audio';
import { useDesktopStore } from '../../store/desktopStore';

interface DesktopIconProps {
  icon: string;
  label: string;
  color: string;
  shortcut?: string;
  selected?: boolean;
  passive?: boolean;
  onSelect?: () => void;
  onOpen?: () => void;
}

export function DesktopIcon({
  icon,
  label,
  color,
  shortcut,
  selected,
  passive,
  onSelect,
  onOpen,
}: DesktopIconProps) {
  const [pressed, setPressed] = useState(false);

  const handleOpen = () => {
    if (useDesktopStore.getState().osSounds) playIconOpenRaw();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(12);
    }
    onOpen?.();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.();
    handleOpen();
  };

  const onPointerDown = () => {
    if (passive) return;
    setPressed(true);
  };

  const onPointerUp = () => {
    if (passive) return;
    setPressed(false);
  };

  const Tag = passive ? 'div' : 'button';

  return (
    <Tag
      {...(!passive ? { type: 'button' as const } : {})}
      className={`desktop-icon${selected ? ' desktop-icon--selected' : ''}${pressed ? ' desktop-icon--pressed' : ''}${passive ? ' desktop-icon--passive' : ''}`}
      aria-label={passive ? undefined : `${label}${shortcut ? `, raccourci ${shortcut}` : ''}`}
      {...(!passive ? { onClick: handleClick } : { 'aria-hidden': true as const })}
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
    </Tag>
  );
}
