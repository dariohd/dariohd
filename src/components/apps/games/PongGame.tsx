import { useEffect, useRef } from 'react';
import { GamePad } from './GamePad';

const W = 480;
const H = 300;

function canvasCtx(canvas: HTMLCanvasElement) {
  return canvas.getContext('2d', { alpha: false, desynchronized: true });
}

export function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseYRef = useRef<number | null>(null);
  const keysRef = useRef(new Set<string>());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvasCtx(canvas);
    if (!ctx) return;

    canvas.width = W;
    canvas.height = H;

    const paddleH = 56;
    const paddleW = 8;
    let playerY = H / 2 - paddleH / 2;
    let aiY = H / 2 - paddleH / 2;
    let ballX = W / 2;
    let ballY = H / 2;
    let ballVX = 4.8;
    let ballVY = 3.2;
    let scoreP = 0;
    let scoreA = 0;
    let raf = 0;
    let last = 0;

    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'w', 's'].includes(k)) {
        e.preventDefault();
        keysRef.current.add(k);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const y = ((e.clientY - rect.top) / rect.height) * H;
      mouseYRef.current = y - paddleH / 2;
    };
    const onLeave = () => {
      mouseYRef.current = null;
    };

    const resetBall = (towardPlayer: boolean) => {
      ballX = W / 2;
      ballY = H / 2;
      ballVX = (towardPlayer ? -1 : 1) * 4.8;
      ballVY = (Math.random() > 0.5 ? 1 : -1) * 3.2;
    };

    const tick = (t: number) => {
      if (!last) last = t;
      const dt = Math.min((t - last) / 16.67, 2.5);
      last = t;

      const keys = keysRef.current;
      if (keys.has('arrowup') || keys.has('w')) playerY -= 7 * dt;
      if (keys.has('arrowdown') || keys.has('s')) playerY += 7 * dt;
      if (mouseYRef.current !== null) {
        playerY += (mouseYRef.current - playerY) * 0.45;
      }
      playerY = Math.max(4, Math.min(H - paddleH - 4, playerY));

      const aiCenter = aiY + paddleH / 2;
      if (aiCenter < ballY - 8) aiY += 4.8 * dt;
      else if (aiCenter > ballY + 8) aiY -= 4.8 * dt;
      aiY = Math.max(4, Math.min(H - paddleH - 4, aiY));

      ballX += ballVX * dt;
      ballY += ballVY * dt;
      if (ballY <= 6 || ballY >= H - 6) ballVY *= -1;

      if (ballX <= 20 && ballY >= playerY && ballY <= playerY + paddleH) {
        ballX = 20;
        ballVX = Math.abs(ballVX) * 1.04;
        ballVY += (ballY - (playerY + paddleH / 2)) * 0.06;
      }
      if (ballX >= W - 28 && ballY >= aiY && ballY <= aiY + paddleH) {
        ballX = W - 28;
        ballVX = -Math.abs(ballVX) * 1.04;
        ballVY += (ballY - (aiY + paddleH / 2)) * 0.06;
      }

      if (ballX < 0) {
        scoreA += 1;
        resetBall(true);
      } else if (ballX > W) {
        scoreP += 1;
        resetBall(false);
      }

      ctx.fillStyle = '#0a0c10';
      ctx.fillRect(0, 0, W, H);

      ctx.setLineDash([6, 8]);
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.beginPath();
      ctx.moveTo(W / 2, 0);
      ctx.lineTo(W / 2, H);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#58a8f0';
      ctx.fillRect(12, playerY, paddleW, paddleH);
      ctx.fillStyle = '#a868e8';
      ctx.fillRect(W - 20, aiY, paddleW, paddleH);
      ctx.beginPath();
      ctx.arc(ballX, ballY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#e8ecf4';
      ctx.fill();

      ctx.fillStyle = '#8b95a8';
      ctx.font = '14px ui-monospace, monospace';
      ctx.fillText(`${scoreP}`, W / 2 - 36, 24);
      ctx.fillText(`${scoreA}`, W / 2 + 24, 24);

      raf = requestAnimationFrame(tick);
    };

    canvas.addEventListener('pointermove', onPointer);
    canvas.addEventListener('pointerleave', onLeave);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('pointermove', onPointer);
      canvas.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  const nudge = (dy: number) => {
    const paddleH = 56;
    const cur = mouseYRef.current ?? H / 2 - paddleH / 2;
    mouseYRef.current = Math.max(4, Math.min(H - paddleH - 4, cur + dy));
  };

  return (
    <div className="mini-game">
      <header className="mini-game__header">
        <h2>Pong</h2>
        <p>Souris sur le terrain · flèches · ou boutons</p>
      </header>
      <div className="mini-game__play">
        <canvas ref={canvasRef} className="mini-game__canvas mini-game__canvas--pointer" aria-label="Pong" />
        <GamePad
          onDir={(d) => {
            if (d === 'up') nudge(-28);
            if (d === 'down') nudge(28);
          }}
        />
      </div>
    </div>
  );
}
