import { useCallback, useEffect, useRef, useState } from 'react';
import { GameActionBar, GamePad, type PadDir } from './GamePad';

const COLS = 10;
const ROWS = 18;
const DROP_MS = 320;
const SHAPES = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[0, 1, 0], [1, 1, 1]],
  [[1, 0, 0], [1, 1, 1]],
  [[0, 0, 1], [1, 1, 1]],
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
];

type Piece = { shape: number[][]; x: number; y: number; color: string };

function rotate(shape: number[][]): number[][] {
  const rows = shape.length;
  const cols = shape[0]!.length;
  const out = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      out[c]![rows - 1 - r] = shape[r]![c];
    }
  }
  return out;
}

function newPiece(): Piece {
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]!;
  const hues = [200, 280, 160, 40, 320, 180, 60];
  return {
    shape,
    x: Math.floor((COLS - shape[0]!.length) / 2),
    y: 0,
    color: `hsl(${hues[Math.floor(Math.random() * hues.length)]}, 70%, 55%)`,
  };
}

function collide(grid: number[][], piece: Piece, ox = 0, oy = 0): boolean {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r]!.length; c++) {
      if (!piece.shape[r]![c]) continue;
      const nx = piece.x + c + ox;
      const ny = piece.y + r + oy;
      if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
      if (ny >= 0 && grid[ny]![nx]) return true;
    }
  }
  return false;
}

function merge(grid: number[][], piece: Piece, val: number): number[][] {
  const next = grid.map((row) => [...row]);
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r]!.length; c++) {
      if (!piece.shape[r]![c]) continue;
      const ny = piece.y + r;
      const nx = piece.x + c;
      if (ny >= 0) next[ny]![nx] = val;
    }
  }
  return next;
}

function clearLines(grid: number[][]): { grid: number[][]; lines: number } {
  const kept = grid.filter((row) => row.some((v) => v === 0));
  const lines = ROWS - kept.length;
  while (kept.length < ROWS) kept.unshift(Array(COLS).fill(0));
  return { grid: kept, lines };
}

function canvasCtx(canvas: HTMLCanvasElement) {
  return canvas.getContext('2d', { alpha: false, desynchronized: true });
}

export function TetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreElRef = useRef<HTMLSpanElement>(null);
  const [over, setOver] = useState(false);
  const flashRef = useRef(0);
  const stateRef = useRef({
    grid: Array.from({ length: ROWS }, () => Array(COLS).fill(0)) as number[][],
    piece: newPiece(),
    alive: true,
    score: 0,
  });

  const restart = useCallback(() => {
    stateRef.current = {
      grid: Array.from({ length: ROWS }, () => Array(COLS).fill(0)),
      piece: newPiece(),
      alive: true,
      score: 0,
    };
    flashRef.current = 0;
    if (scoreElRef.current) scoreElRef.current.textContent = '0';
    setOver(false);
  }, []);

  const move = useCallback((dx: number) => {
    const st = stateRef.current;
    if (!st.alive) return;
    const p = { ...st.piece, x: st.piece.x + dx };
    if (!collide(st.grid, p)) st.piece = p;
  }, []);

  const softDrop = useCallback(() => {
    const st = stateRef.current;
    if (!st.alive) return;
    const p = { ...st.piece, y: st.piece.y + 1 };
    if (!collide(st.grid, p)) {
      st.piece = p;
      return;
    }
    const locked = merge(st.grid, st.piece, 1);
    const { grid, lines } = clearLines(locked);
    st.grid = grid;
    if (lines) {
      flashRef.current = 6;
      st.score += lines * 100;
      if (scoreElRef.current) scoreElRef.current.textContent = String(st.score);
    }
    st.piece = newPiece();
    if (collide(st.grid, st.piece)) {
      st.alive = false;
      setOver(true);
    }
  }, []);

  const rotatePiece = useCallback(() => {
    const st = stateRef.current;
    if (!st.alive) return;
    const p = { ...st.piece, shape: rotate(st.piece.shape) };
    if (!collide(st.grid, p)) st.piece = p;
  }, []);

  const onPad = useCallback(
    (d: PadDir) => {
      if (d === 'left') move(-1);
      if (d === 'right') move(1);
      if (d === 'down') softDrop();
    },
    [move, softDrop],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvasCtx(canvas);
    if (!ctx) return;

    const CELL = 18;
    canvas.width = COLS * CELL;
    canvas.height = ROWS * CELL;

    let lastDrop = 0;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') move(-1);
      if (e.key === 'ArrowRight' || e.key === 'd') move(1);
      if (e.key === 'ArrowDown' || e.key === 's') softDrop();
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') {
        e.preventDefault();
        rotatePiece();
      }
    };

    const draw = () => {
      const st = stateRef.current;
      const flash = flashRef.current;
      ctx.fillStyle = flash > 0 ? 'rgba(88,168,240,0.18)' : '#0a0c10';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (flash > 0) flashRef.current--;

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (st.grid[r]![c]) {
            ctx.fillStyle = '#58a8f0';
            ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
          }
        }
      }

      ctx.fillStyle = st.piece.color;
      for (let r = 0; r < st.piece.shape.length; r++) {
        for (let c = 0; c < st.piece.shape[r]!.length; c++) {
          if (!st.piece.shape[r]![c]) continue;
          ctx.fillRect(
            (st.piece.x + c) * CELL + 1,
            (st.piece.y + r) * CELL + 1,
            CELL - 2,
            CELL - 2,
          );
        }
      }
    };

    let raf = 0;
    const loop = (t: number) => {
      if (stateRef.current.alive && t - lastDrop >= DROP_MS) {
        lastDrop = t;
        softDrop();
      }
      draw();
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('keydown', onKey);
    lastDrop = performance.now();
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
    };
  }, [move, softDrop, rotatePiece]);

  return (
    <div className="mini-game">
      <header className="mini-game__header">
        <h2>Tetris</h2>
        <p>
          Boutons ou flèches · ↑ pour tourner · Score : <span ref={scoreElRef}>0</span>
        </p>
      </header>
      <div className="mini-game__play">
        <canvas ref={canvasRef} className="mini-game__canvas" aria-label="Tetris" />
        <div className="mini-game__controls-col">
          <GamePad onDir={onPad} />
          <GameActionBar>
            <button type="button" className="game-pad__btn game-pad__btn--wide" onClick={rotatePiece}>
              ↻ Tourner
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={restart}>
              Rejouer
            </button>
          </GameActionBar>
        </div>
      </div>
      {over && <p className="mini-game__lose">Game Over</p>}
    </div>
  );
}
