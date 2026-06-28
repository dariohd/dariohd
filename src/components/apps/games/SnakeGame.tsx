import { useCallback, useEffect, useRef, useState } from 'react';
import { GamePad, type PadDir } from './GamePad';

const GRID = 16;
const CELL = 20;
const STEP_MS = 72;

type Point = { x: number; y: number };

function canvasCtx(canvas: HTMLCanvasElement) {
  return canvas.getContext('2d', { alpha: false, desynchronized: true });
}

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreElRef = useRef<HTMLSpanElement>(null);
  const [over, setOver] = useState(false);
  const stateRef = useRef({
    snake: [{ x: 8, y: 8 }] as Point[],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: 12, y: 8 } as Point,
    alive: true,
    score: 0,
  });

  const spawnFood = useCallback((snake: Point[]): Point => {
    let p: Point;
    do {
      p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    } while (snake.some((s) => s.x === p.x && s.y === p.y));
    return p;
  }, []);

  const setDirection = useCallback((dx: number, dy: number) => {
    const { dir } = stateRef.current;
    if (dir.x + dx === 0 && dir.y + dy === 0) return;
    stateRef.current.nextDir = { x: dx, y: dy };
  }, []);

  const onPad = useCallback(
    (d: PadDir) => {
      const map: Record<PadDir, Point> = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 },
      };
      const nd = map[d];
      setDirection(nd.x, nd.y);
    },
    [setDirection],
  );

  const restart = useCallback(() => {
    stateRef.current = {
      snake: [{ x: 8, y: 8 }],
      dir: { x: 1, y: 0 },
      nextDir: { x: 1, y: 0 },
      food: { x: 12, y: 8 },
      alive: true,
      score: 0,
    };
    if (scoreElRef.current) scoreElRef.current.textContent = '0';
    setOver(false);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvasCtx(canvas);
    if (!ctx) return;

    const W = GRID * CELL;
    const H = GRID * CELL;
    canvas.width = W;
    canvas.height = H;

    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Point> = {
        arrowup: { x: 0, y: -1 },
        arrowdown: { x: 0, y: 1 },
        arrowleft: { x: -1, y: 0 },
        arrowright: { x: 1, y: 0 },
        w: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        d: { x: 1, y: 0 },
      };
      const nd = map[e.key.toLowerCase()];
      if (!nd) return;
      e.preventDefault();
      setDirection(nd.x, nd.y);
    };

    const draw = () => {
      const st = stateRef.current;
      ctx.fillStyle = '#0a0c10';
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = '#94c878';
      ctx.fillRect(st.food.x * CELL + 1, st.food.y * CELL + 1, CELL - 2, CELL - 2);

      for (let i = 0; i < st.snake.length; i++) {
        const seg = st.snake[i]!;
        ctx.fillStyle = i === 0 ? '#58a8f0' : '#3a88c8';
        ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
      }
    };

    const step = () => {
      const st = stateRef.current;
      if (!st.alive) return;
      st.dir = st.nextDir;
      const head = st.snake[0]!;
      const nh = { x: head.x + st.dir.x, y: head.y + st.dir.y };
      if (nh.x < 0 || nh.x >= GRID || nh.y < 0 || nh.y >= GRID) {
        st.alive = false;
        setOver(true);
        return;
      }
      if (st.snake.some((s) => s.x === nh.x && s.y === nh.y)) {
        st.alive = false;
        setOver(true);
        return;
      }
      st.snake.unshift(nh);
      if (nh.x === st.food.x && nh.y === st.food.y) {
        st.food = spawnFood(st.snake);
        st.score += 1;
        if (scoreElRef.current) scoreElRef.current.textContent = String(st.score);
      } else {
        st.snake.pop();
      }
    };

    let raf = 0;
    let last = 0;
    let acc = 0;

    const loop = (t: number) => {
      if (!last) last = t;
      acc += t - last;
      last = t;

      while (acc >= STEP_MS) {
        step();
        acc -= STEP_MS;
      }
      draw();
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('keydown', onKey);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
    };
  }, [spawnFood, setDirection]);

  return (
    <div className="mini-game">
      <header className="mini-game__header">
        <h2>Snake</h2>
        <p>
          Boutons, flèches ou ZQSD · Score : <span ref={scoreElRef}>0</span>
        </p>
      </header>
      <div className="mini-game__play">
        <div className="mini-game__stage">
          <canvas ref={canvasRef} className="mini-game__canvas" aria-label="Snake" />
          {over && (
            <div className="mini-game__overlay">
              <p>Game Over · {stateRef.current.score} pts</p>
              <button type="button" className="btn btn--primary btn--sm" onClick={restart}>
                Rejouer
              </button>
            </div>
          )}
        </div>
        <GamePad onDir={onPad} />
      </div>
    </div>
  );
}
