export type PadDir = 'up' | 'down' | 'left' | 'right';

interface GamePadProps {
  onDir: (dir: PadDir) => void;
  children?: React.ReactNode;
}

export function GamePad({ onDir, children }: GamePadProps) {
  return (
    <div className="game-pad" role="group" aria-label="Contrôles directionnels">
      <div className="game-pad__row">
        <button type="button" className="game-pad__btn" onClick={() => onDir('up')} aria-label="Haut">
          ↑
        </button>
      </div>
      <div className="game-pad__row">
        <button type="button" className="game-pad__btn" onClick={() => onDir('left')} aria-label="Gauche">
          ←
        </button>
        <button type="button" className="game-pad__btn" onClick={() => onDir('down')} aria-label="Bas">
          ↓
        </button>
        <button type="button" className="game-pad__btn" onClick={() => onDir('right')} aria-label="Droite">
          →
        </button>
      </div>
      {children && <div className="game-pad__extra">{children}</div>}
    </div>
  );
}

interface GameActionBarProps {
  children: React.ReactNode;
}

export function GameActionBar({ children }: GameActionBarProps) {
  return <div className="game-pad__actions">{children}</div>;
}
