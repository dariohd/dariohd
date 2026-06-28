import { useRef, useState, type ReactNode, type PointerEvent as ReactPointerEvent } from 'react';
import { motion } from 'framer-motion';
import type { OsWindow } from '../../store/osStore';
import { useOsStore } from '../../store/osStore';

import { playWindowClose as playWindowCloseRaw } from '../../game/audio';
import { useDesktopStore } from '../../store/desktopStore';

interface WindowProps {
  win: OsWindow;
  children: ReactNode;
}

export function Window({ win, children }: WindowProps) {
  const focusWindow = useOsStore((s) => s.focusWindow);
  const closeWindow = useOsStore((s) => s.closeWindow);
  const moveWindow = useOsStore((s) => s.moveWindow);
  const resizeWindow = useOsStore((s) => s.resizeWindow);
  const toggleMinimize = useOsStore((s) => s.toggleMinimize);
  const toggleMaximize = useOsStore((s) => s.toggleMaximize);

  const dragRef = useRef<{ x: number; y: number; wx: number; wy: number } | null>(null);
  const resizeRef = useRef<{ x: number; y: number; w: number; h: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const lastClickRef = useRef(0);

  if (win.minimized) return null;

  const onTitlePointerDown = (e: ReactPointerEvent) => {
    if (win.maximized) return;
    focusWindow(win.id);
    dragRef.current = { x: e.clientX, y: e.clientY, wx: win.x, wy: win.y };
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onTitlePointerMove = (e: ReactPointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    moveWindow(win.id, dragRef.current.wx + dx, dragRef.current.wy + dy);
  };

  const onTitlePointerUp = () => {
    dragRef.current = null;
    setIsDragging(false);
  };

  const onTitleDoubleClick = () => {
    toggleMaximize(win.id);
  };

  const onTitleClick = () => {
    const now = Date.now();
    if (now - lastClickRef.current < 320) {
      onTitleDoubleClick();
    }
    lastClickRef.current = now;
  };

  const onResizePointerDown = (e: ReactPointerEvent) => {
    if (win.maximized) return;
    e.stopPropagation();
    focusWindow(win.id);
    resizeRef.current = { x: e.clientX, y: e.clientY, w: win.width, h: win.height };
    setIsResizing(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onResizePointerMove = (e: ReactPointerEvent) => {
    if (!resizeRef.current) return;
    const dx = e.clientX - resizeRef.current.x;
    const dy = e.clientY - resizeRef.current.y;
    resizeWindow(win.id, resizeRef.current.w + dx, resizeRef.current.h + dy);
  };

  const onResizePointerUp = () => {
    resizeRef.current = null;
    setIsResizing(false);
  };

  const style = win.maximized
    ? { left: 0, top: 36, width: '100%', height: 'calc(100% - 36px - 48px)' }
    : { left: win.x, top: win.y, width: win.width, height: win.height };

  return (
    <motion.section
      className={`os-window${isDragging ? ' os-window--dragging' : ''}${isResizing ? ' os-window--resizing' : ''}${win.maximized ? ' os-window--maximized' : ''}`}
      style={{ ...style, zIndex: win.zIndex }}
      initial={{ opacity: 0, scale: 0.94, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      onPointerDown={() => focusWindow(win.id)}
      role="dialog"
      aria-label={win.title}
    >
      <header
        className="os-window__titlebar"
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={onTitlePointerUp}
        onPointerCancel={onTitlePointerUp}
        onClick={onTitleClick}
      >
        <div className="os-window__controls">
          <button
            type="button"
            className="os-window__ctrl os-window__ctrl--close"
            aria-label="Fermer"
            onClick={(e) => {
              e.stopPropagation();
              if (useDesktopStore.getState().osSounds) playWindowCloseRaw();
              closeWindow(win.id);
            }}
          />
          <button
            type="button"
            className="os-window__ctrl os-window__ctrl--min"
            aria-label="Réduire"
            onClick={(e) => { e.stopPropagation(); toggleMinimize(win.id); }}
          />
          <button
            type="button"
            className="os-window__ctrl os-window__ctrl--max"
            aria-label="Agrandir"
            onClick={(e) => { e.stopPropagation(); toggleMaximize(win.id); }}
          />
        </div>
        <span className="os-window__title">{win.title}</span>
      </header>
      <div className="os-window__content">{children}</div>
      {!win.maximized && (
        <div
          className="os-window__resize-handle"
          aria-hidden="true"
          onPointerDown={onResizePointerDown}
          onPointerMove={onResizePointerMove}
          onPointerUp={onResizePointerUp}
          onPointerCancel={onResizePointerUp}
        />
      )}
    </motion.section>
  );
}
