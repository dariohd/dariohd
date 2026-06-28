import { useCallback, useEffect, useRef, useState } from 'react';

const W = 300;
const H = 440;
const GRAVITY = 0.42;
const FLAP_V = -7.2;
const PIPE_W = 56;
const GAP = 112;
const PIPE_GAP = 168;
const BIRD_R = 14;
const PIPE_SPEED = 3.2;

interface Pipe {
  x: number;
  gapY: number;
  scored: boolean;
}

function canvasCtx(canvas: HTMLCanvasElement) {
  return canvas.getContext('2d', { alpha: false, desynchronized: true });
}

export function FlappyGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreElRef = useRef<HTMLSpanElement>(null);
  const [over, setOver] = useState(false);
  const startedRef = useRef(false);
  const flapRef = useRef<() => void>(() => {});
  const stateRef = useRef({
    birdY: H / 2,
    birdVY: 0,
    pipes: [] as Pipe[],
    frame: 0,
    alive: true,
    score: 0,
  });

  const restart = useCallback(() => {
    stateRef.current = {
      birdY: H / 2,
      birdVY: 0,
      pipes: [{ x: W + 40, gapY: 120 + Math.random() * 160, scored: false }],
      frame: 0,
      alive: true,
      score: 0,
    };
    if (scoreElRef.current) scoreElRef.current.textContent = '0';
    setOver(false);
    startedRef.current = false;
  }, []);

  const flap = useCallback(() => {
    const st = stateRef.current;
    if (!st.alive) return;
    startedRef.current = true;
    st.birdVY = FLAP_V;
  }, []);

  flapRef.current = flap;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvasCtx(canvas);
    if (!ctx) return;

    canvas.width = W;
    canvas.height = H;

    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#1a2848');
    bgGrad.addColorStop(1, '#0a1020');

    stateRef.current = {
      birdY: H / 2,
      birdVY: 0,
      pipes: [{ x: W + 40, gapY: 120 + Math.random() * 160, scored: false }],
      frame: 0,
      alive: true,
      score: 0,
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        flapRef.current();
      }
    };

    const onPointer = () => flapRef.current();

    let raf = 0;
    let last = 0;

    const tick = (t: number) => {
      if (!last) last = t;
      const dt = Math.min((t - last) / 16.67, 2.5);
      last = t;

      const st = stateRef.current;
      st.frame++;

      if (st.alive && startedRef.current) {
        st.birdVY += GRAVITY * dt;
        st.birdY += st.birdVY * dt;

        for (const pipe of st.pipes) pipe.x -= PIPE_SPEED * dt;

        while (st.pipes.length > 0 && st.pipes[0]!.x < -PIPE_W) {
          st.pipes.shift();
        }
        const lastPipe = st.pipes[st.pipes.length - 1];
        if (!lastPipe || lastPipe.x < W - PIPE_GAP) {
          st.pipes.push({
            x: W + 20,
            gapY: 80 + Math.random() * (H - GAP - 160),
            scored: false,
          });
        }

        const bx = 72;
        const by = st.birdY;

        if (by - BIRD_R < 0 || by + BIRD_R > H) {
          st.alive = false;
          setOver(true);
        }

        for (const pipe of st.pipes) {
          const inX = bx + BIRD_R > pipe.x && bx - BIRD_R < pipe.x + PIPE_W;
          const inGap = by > pipe.gapY && by < pipe.gapY + GAP;
          if (inX && !inGap) {
            st.alive = false;
            setOver(true);
          }
          if (!pipe.scored && pipe.x + PIPE_W < bx) {
            pipe.scored = true;
            st.score += 1;
          }
        }
      }

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      const scroll = (st.frame * 0.8) % 40;
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      for (let i = -1; i < 12; i++) {
        ctx.fillRect(i * 40 - scroll, H - 48, 24, 48);
      }

      for (const pipe of st.pipes) {
        const topH = pipe.gapY;
        const botY = pipe.gapY + GAP;
        ctx.fillStyle = '#58a8f0';
        ctx.fillRect(pipe.x, 0, PIPE_W, topH);
        ctx.fillRect(pipe.x, botY, PIPE_W, H - botY);
        ctx.fillStyle = '#6898c8';
        ctx.fillRect(pipe.x - 4, topH - 20, PIPE_W + 8, 20);
        ctx.fillRect(pipe.x - 4, botY, PIPE_W + 8, 20);
      }

      const wing = Math.sin(st.frame * 0.3) * 4;
      ctx.save();
      ctx.translate(72, st.birdY);
      ctx.rotate(Math.min(Math.max(st.birdVY * 0.04, -0.5), 0.8));
      ctx.fillStyle = '#f0c060';
      ctx.beginPath();
      ctx.ellipse(0, 0, BIRD_R + 2, BIRD_R, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e87858';
      ctx.beginPath();
      ctx.moveTo(BIRD_R, 0);
      ctx.lineTo(BIRD_R + 10, 4);
      ctx.lineTo(BIRD_R, 8);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath();
      ctx.arc(6, -4, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1a1f2e';
      ctx.beginPath();
      ctx.arc(7, -4, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(240,192,96,0.7)';
      ctx.beginPath();
      ctx.ellipse(-6, wing, 8, 5, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = '#e8ecf4';
      ctx.font = 'bold 22px ui-monospace, monospace';
      ctx.fillText(`${st.score}`, W / 2 - 8, 36);
      if (scoreElRef.current) scoreElRef.current.textContent = String(st.score);

      if (!startedRef.current && st.alive) {
        ctx.fillStyle = 'rgba(232,236,244,0.85)';
        ctx.font = '13px system-ui, sans-serif';
        ctx.fillText('Clic ou espace pour voler', 58, H / 2 + 40);
      }

      raf = requestAnimationFrame(tick);
    };

    canvas.addEventListener('pointerdown', onPointer);
    window.addEventListener('keydown', onKey);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="mini-game">
      <header className="mini-game__header">
        <h2>Flappy</h2>
        <p>
          Clic sur le terrain · espace · ou bouton · Score : <span ref={scoreElRef}>0</span>
        </p>
      </header>
      <div className="mini-game__play mini-game__play--stacked">
        <div className="mini-game__stage">
          <canvas
            ref={canvasRef}
            className="mini-game__canvas mini-game__canvas--pointer"
            aria-label="Flappy"
          />
          {over && (
            <div className="mini-game__overlay">
              <p>Game Over — {stateRef.current.score} pts</p>
              <button type="button" className="btn btn--primary btn--sm" onClick={restart}>
                Rejouer
              </button>
            </div>
          )}
        </div>
        <button type="button" className="game-pad__btn game-pad__btn--wide game-pad__btn--flap" onClick={flap}>
          ↑ Voler
        </button>
      </div>
    </div>
  );
}
