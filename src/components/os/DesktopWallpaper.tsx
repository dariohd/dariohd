import { useEffect, useRef } from 'react';
import type { WallpaperId } from '../../store/desktopStore';

export function DesktopWallpaper({ wallpaper }: { wallpaper: WallpaperId }) {
  const glowRef = useRef<HTMLDivElement>(null);
  const orbsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const desktop = glowRef.current?.closest('.desktop');
    if (!desktop || !glowRef.current) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const glow = glowRef.current;
    const orbs = orbsRef.current;

    let bounds = { w: 1, h: 1 };
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let raf = 0;
    let running = false;

    const measure = () => {
      const rect = desktop.getBoundingClientRect();
      bounds = { w: Math.max(rect.width, 1), h: Math.max(rect.height, 1) };
    };

    const place = (x: number, y: number) => {
      glow.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      if (orbs) {
        const dx = (x / bounds.w - 0.5) * 40;
        const dy = (y / bounds.h - 0.5) * 28;
        orbs.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      }
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.25;
      currentY += (targetY - currentY) * 0.25;
      place(currentX, currentY);

      const done =
        Math.abs(targetX - currentX) < 0.5 &&
        Math.abs(targetY - currentY) < 0.5;

      if (!done) {
        raf = requestAnimationFrame(tick);
      } else {
        place(targetX, targetY);
        running = false;
      }
    };

    const schedule = () => {
      if (running || reducedMotion) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: Event) => {
      const ev = e as MouseEvent;
      const rect = desktop.getBoundingClientRect();
      targetX = ev.clientX - rect.left;
      targetY = ev.clientY - rect.top;

      if (reducedMotion) {
        place(targetX, targetY);
        return;
      }

      schedule();
    };

    const onLeave = () => {
      targetX = bounds.w * 0.5;
      targetY = bounds.h * 0.5;
      schedule();
    };

    measure();
    targetX = bounds.w * 0.5;
    targetY = bounds.h * 0.5;
    currentX = targetX;
    currentY = targetY;
    place(currentX, currentY);

    window.addEventListener('resize', measure, { passive: true });
    desktop.addEventListener('mousemove', onMove, { passive: true });
    desktop.addEventListener('mouseleave', onLeave, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
      desktop.removeEventListener('mousemove', onMove);
      desktop.removeEventListener('mouseleave', onLeave);
    };
  }, [wallpaper]);

  return (
    <div className="desktop__wallpaper" aria-hidden="true">
      <div className="desktop__aurora" />
      <div className="desktop__grid" />
      <div ref={orbsRef} className="desktop__orbs">
        <div className="desktop__orb desktop__orb--1" />
        <div className="desktop__orb desktop__orb--2" />
        <div className="desktop__orb desktop__orb--3" />
      </div>
      <div ref={glowRef} className="desktop__cursor-glow" />
      <div className="desktop__vignette" />
    </div>
  );
}
