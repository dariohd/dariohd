import { useEffect, useRef, useState } from 'react';
import { GamePad } from './GamePad';

const W = 400;
const H = 320;

function canvasCtx(canvas: HTMLCanvasElement) {
  return canvas.getContext('2d', { alpha: false, desynchronized: true });
}

export function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreElRef = useRef<HTMLSpanElement>(null);
  const mouseXRef = useRef<number | null>(null);
  const [won, setWon] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvasCtx(canvas);
    if (!ctx) return;

    canvas.width = W;
    canvas.height = H;

    const paddleW = 72;
    const paddleH = 10;
    let paddleX = W / 2 - paddleW / 2;
    let ballX = W / 2;
    let ballY = H - 40;
    let ballVX = 3.6;
    let ballVY = -4.2;
    let launched = false;
    let score = 0;
    let last = 0;

    const cols = 8;
    const rows = 4;
    const brickW = (W - 20) / cols - 4;
    const bricks: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(true));

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseXRef.current = ((e.clientX - rect.left) / rect.width) * W;
    };

    const launch = () => {
      if (!launched) launched = true;
    };

    const onClick = () => launch();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ') launch();
    };

    let raf = 0;
    const tick = (t: number) => {
      if (!last) last = t;
      const dt = Math.min((t - last) / 16.67, 2.5);
      last = t;

      if (mouseXRef.current !== null) {
        const target = Math.max(8, Math.min(W - paddleW - 8, mouseXRef.current - paddleW / 2));
        paddleX += (target - paddleX) * 0.5;
      }

      if (!launched) {
        ballX = paddleX + paddleW / 2;
        ballY = H - 36;
      } else {
        ballX += ballVX * dt;
        ballY += ballVY * dt;
        if (ballX <= 6 || ballX >= W - 6) ballVX *= -1;
        if (ballY <= 6) ballVY = Math.abs(ballVY);

        if (ballY >= H - 28 && ballX >= paddleX && ballX <= paddleX + paddleW) {
          ballY = H - 28;
          ballVY = -Math.abs(ballVY);
          ballVX += (ballX - (paddleX + paddleW / 2)) * 0.08;
        }

        if (ballY > H) {
          launched = false;
          ballVY = -4.2;
          ballVX = 3.6;
        }

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (!bricks[r]![c]) continue;
            const bx = 10 + c * (brickW + 4);
            const by = 24 + r * 18;
            if (ballX >= bx && ballX <= bx + brickW && ballY >= by && ballY <= by + 14) {
              bricks[r]![c] = false;
              ballVY *= -1;
              score += 10;
            }
          }
        }

        if (bricks.every((row) => row.every((b) => !b))) setWon(true);
      }

      ctx.fillStyle = '#0a0c10';
      ctx.fillRect(0, 0, W, H);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (!bricks[r]![c]) continue;
          ctx.fillStyle = `hsl(${200 + r * 18 + c * 8}, 70%, 55%)`;
          ctx.fillRect(10 + c * (brickW + 4), 24 + r * 18, brickW, 14);
        }
      }

      ctx.fillStyle = '#58a8f0';
      ctx.fillRect(paddleX, H - 20, paddleW, paddleH);
      ctx.beginPath();
      ctx.arc(ballX, ballY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#e8ecf4';
      ctx.fill();

      ctx.fillStyle = '#8b95a8';
      ctx.font = '12px system-ui';
      ctx.fillText(String(score), W - 28, 18);

      if (!launched) {
        ctx.fillText('Clic ou espace pour lancer', 110, H / 2);
      }

      if (scoreElRef.current) scoreElRef.current.textContent = String(score);

      raf = requestAnimationFrame(tick);
    };

    canvas.addEventListener('pointermove', onPointer);
    canvas.addEventListener('click', onClick);
    window.addEventListener('keydown', onKey);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('pointermove', onPointer);
      canvas.removeEventListener('click', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const nudgePaddle = (dx: number) => {
    const paddleW = 72;
    const cur = mouseXRef.current ?? W / 2;
    mouseXRef.current = Math.max(paddleW / 2, Math.min(W - paddleW / 2, cur + dx));
  };

  return (
    <div className="mini-game">
      <header className="mini-game__header">
        <h2>Breakout</h2>
        <p>
          Souris sur le terrain · score : <span ref={scoreElRef}>0</span>
        </p>
      </header>
      <div className="mini-game__play">
        <canvas ref={canvasRef} className="mini-game__canvas mini-game__canvas--pointer" aria-label="Breakout" />
        <GamePad
          onDir={(d) => {
            if (d === 'left') nudgePaddle(-24);
            if (d === 'right') nudgePaddle(24);
          }}
        />
      </div>
      {won && <p className="mini-game__win">🎉 Tous les blocs détruits !</p>}
    </div>
  );
}
