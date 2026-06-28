import { useCallback, useEffect, useRef, useState } from 'react';
import { GamePad, type PadDir } from './GamePad';

const SIZE = 4;

type Grid = number[][];

function emptyGrid(): Grid {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function clone(g: Grid): Grid {
  return g.map((row) => [...row]);
}

function addTile(g: Grid): Grid {
  const empty: { r: number; c: number }[] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (g[r]![c] === 0) empty.push({ r, c });
    }
  }
  if (empty.length === 0) return g;
  const { r, c } = empty[Math.floor(Math.random() * empty.length)]!;
  const next = clone(g);
  next[r]![c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function slide(row: number[]): { row: number[]; gained: number } {
  const filtered = row.filter((n) => n > 0);
  const out: number[] = [];
  let gained = 0;
  for (let i = 0; i < filtered.length; i++) {
    if (filtered[i] === filtered[i + 1]) {
      const v = filtered[i]! * 2;
      out.push(v);
      gained += v;
      i++;
    } else {
      out.push(filtered[i]!);
    }
  }
  while (out.length < SIZE) out.push(0);
  return { row: out, gained };
}

function move(g: Grid, dir: 'left' | 'right' | 'up' | 'down'): { grid: Grid; moved: boolean; gained: number } {
  let gained = 0;
  const next = emptyGrid();
  let moved = false;

  if (dir === 'left' || dir === 'right') {
    for (let r = 0; r < SIZE; r++) {
      let row = g[r]!;
      if (dir === 'right') row = [...row].reverse();
      const { row: slid, gained: g2 } = slide(row);
      gained += g2;
      const out = dir === 'right' ? [...slid].reverse() : slid;
      if (out.some((v, i) => v !== g[r]![i])) moved = true;
      next[r] = out;
    }
  } else {
    for (let c = 0; c < SIZE; c++) {
      let col = [g[0]![c]!, g[1]![c]!, g[2]![c]!, g[3]![c]!];
      if (dir === 'down') col = [...col].reverse();
      const { row: slid, gained: g2 } = slide(col);
      gained += g2;
      const out = dir === 'down' ? [...slid].reverse() : slid;
      for (let r = 0; r < SIZE; r++) {
        if (g[r]![c] !== out[r]) moved = true;
        next[r]![c] = out[r]!;
      }
    }
  }

  return { grid: moved ? next : g, moved, gained };
}

function canMove(g: Grid): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (g[r]![c] === 0) return true;
      if (c < SIZE - 1 && g[r]![c] === g[r]![c + 1]) return true;
      if (r < SIZE - 1 && g[r]![c] === g[r + 1]![c]) return true;
    }
  }
  return false;
}

const TILE_COLORS: Record<number, string> = {
  2: '#3a4a5a',
  4: '#4a5a6a',
  8: '#58a8f0',
  16: '#6898c8',
  32: '#a868e8',
  64: '#c878e8',
  128: '#f0a8c8',
  256: '#f0c060',
  512: '#94c878',
  1024: '#e87858',
  2048: '#f0e060',
};

const PAD_MAP: Record<PadDir, 'left' | 'right' | 'up' | 'down'> = {
  left: 'left',
  right: 'right',
  up: 'up',
  down: 'down',
};

export function Game2048() {
  const [grid, setGrid] = useState<Grid>(() => addTile(addTile(emptyGrid())));
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const restart = useCallback(() => {
    setGrid(addTile(addTile(emptyGrid())));
    setScore(0);
    setOver(false);
  }, []);

  const apply = useCallback((dir: 'left' | 'right' | 'up' | 'down') => {
    setGrid((g) => {
      const { grid: moved, moved: did, gained } = move(g, dir);
      if (!did) return g;
      setScore((s) => s + gained);
      const withTile = addTile(moved);
      if (!canMove(withTile)) setOver(true);
      return withTile;
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, 'left' | 'right' | 'up' | 'down'> = {
        arrowleft: 'left',
        arrowright: 'right',
        arrowup: 'up',
        arrowdown: 'down',
        a: 'left',
        d: 'right',
        w: 'up',
        s: 'down',
      };
      const dir = map[e.key.toLowerCase()];
      if (!dir) return;
      e.preventDefault();
      apply(dir);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [apply]);

  const onPointerDown = (e: React.PointerEvent) => {
    touchRef.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!touchRef.current) return;
    const dx = e.clientX - touchRef.current.x;
    const dy = e.clientY - touchRef.current.y;
    touchRef.current = null;
    if (Math.hypot(dx, dy) < 24) return;
    if (Math.abs(dx) > Math.abs(dy)) apply(dx > 0 ? 'right' : 'left');
    else apply(dy > 0 ? 'down' : 'up');
  };

  return (
    <div className="mini-game">
      <header className="mini-game__header">
        <h2>2048</h2>
        <p>Boutons, glisser ou flèches · Score : {score}</p>
      </header>
      <div className="mini-game__play">
        <div
          className="mini-game__2048"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { touchRef.current = null; }}
        >
          {grid.map((row, r) =>
            row.map((val, c) => (
              <div
                key={`${r}-${c}`}
                className="mini-game__2048-cell"
                style={{
                  background: val ? (TILE_COLORS[val] ?? '#f0e060') : 'rgba(255,255,255,0.04)',
                  color: val > 4 ? '#fff' : 'var(--text-muted)',
                }}
              >
                {val || ''}
              </div>
            )),
          )}
        </div>
        <GamePad onDir={(d) => apply(PAD_MAP[d])} />
      </div>
      {over && (
        <div className="mini-game__overlay mini-game__overlay--inline">
          <p>Plus de coups possibles</p>
          <button type="button" className="btn btn--primary btn--sm" onClick={restart}>
            Rejouer
          </button>
        </div>
      )}
    </div>
  );
}
