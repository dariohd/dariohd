import { useCallback, useState } from 'react';

const SIZE = 9;
const MINES = 10;

type Cell = { mine: boolean; open: boolean; flag: boolean; n: number };

function build(): Cell[][] {
  const grid: Cell[][] = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => ({ mine: false, open: false, flag: false, n: 0 })),
  );
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * SIZE);
    const c = Math.floor(Math.random() * SIZE);
    if (!grid[r]![c]!.mine) {
      grid[r]![c]!.mine = true;
      placed++;
    }
  }
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r]![c]!.mine) continue;
      let n = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && grid[nr]![nc]!.mine) n++;
        }
      }
      grid[r]![c]!.n = n;
    }
  }
  return grid;
}

function reveal(grid: Cell[][], r: number, c: number): Cell[][] {
  const next = grid.map((row) => row.map((cell) => ({ ...cell })));
  const stack = [[r, c]];
  while (stack.length) {
    const [cr, cc] = stack.pop()!;
    const cell = next[cr]![cc]!;
    if (cell.open || cell.flag) continue;
    cell.open = true;
    if (cell.mine) continue;
    if (cell.n === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = cr + dr;
          const nc = cc + dc;
          if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) stack.push([nr, nc]);
        }
      }
    }
  }
  return next;
}

export function MinesweeperGame() {
  const [grid, setGrid] = useState(build);
  const [flagMode, setFlagMode] = useState(false);
  const [lost, setLost] = useState(false);
  const [won, setWon] = useState(false);

  const restart = () => {
    setGrid(build());
    setLost(false);
    setWon(false);
    setFlagMode(false);
  };

  const checkWin = useCallback((g: Cell[][]) => {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const cell = g[r]![c]!;
        if (!cell.mine && !cell.open) return false;
      }
    }
    return true;
  }, []);

  const onCell = (r: number, c: number) => {
    if (lost || won) return;
    setGrid((g) => {
      const cell = g[r]![c]!;
      if (flagMode) {
        if (cell.open) return g;
        const next = g.map((row) => row.map((x) => ({ ...x })));
        next[r]![c]!.flag = !next[r]![c]!.flag;
        return next;
      }
      if (cell.flag) return g;
      if (cell.mine) {
        setLost(true);
        const next = g.map((row) => row.map((x) => ({ ...x, open: x.mine ? true : x.open })));
        return next;
      }
      const next = reveal(g, r, c);
      if (checkWin(next)) setWon(true);
      return next;
    });
  };

  const flags = grid.flat().filter((c) => c.flag).length;

  return (
    <div className="mini-game">
      <header className="mini-game__header">
        <h2>Démineur</h2>
        <p>Clic pour révéler · mode drapeau pour marquer · {flags}/{MINES} 🚩</p>
        <div className="mini-game__toolbar">
          <button
            type="button"
            className={`btn btn--sm${flagMode ? ' btn--primary' : ' btn--ghost'}`}
            onClick={() => setFlagMode((v) => !v)}
          >
            {flagMode ? '🚩 Mode drapeau' : '👆 Mode révéler'}
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={restart}>
            Rejouer
          </button>
        </div>
      </header>
      <div className="minesweeper" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              type="button"
              className={`minesweeper__cell${cell.open ? ' minesweeper__cell--open' : ''}${cell.mine && lost ? ' minesweeper__cell--boom' : ''}`}
              onClick={() => onCell(r, c)}
              onContextMenu={(e) => {
                e.preventDefault();
                setFlagMode(true);
                onCell(r, c);
              }}
            >
              {cell.flag && !cell.open ? '🚩' : cell.open ? (cell.mine ? '💣' : cell.n || '') : ''}
            </button>
          )),
        )}
      </div>
      {won && <p className="mini-game__win">🎉 Gagné !</p>}
      {lost && <p className="mini-game__lose">💥 Perdu. Réessayez.</p>}
    </div>
  );
}
