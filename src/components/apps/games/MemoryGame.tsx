import { useCallback, useState } from 'react';

const EMOJIS = ['🌟', '🎸', '🚀', '🎨', '🔮', '🦋', '🎵', '🍀'];

type Card = { id: number; emoji: string; flipped: boolean; matched: boolean };

function buildDeck(): Card[] {
  const pairs = [...EMOJIS, ...EMOJIS];
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j]!, pairs[i]!];
  }
  return pairs.map((emoji, id) => ({ id, emoji, flipped: false, matched: false }));
}

export function MemoryGame() {
  const [cards, setCards] = useState(buildDeck);
  const [first, setFirst] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [lock, setLock] = useState(false);

  const restart = () => {
    setCards(buildDeck());
    setFirst(null);
    setMoves(0);
    setLock(false);
  };

  const won = cards.every((c) => c.matched);

  const flip = useCallback(
    (idx: number) => {
      if (lock || cards[idx]!.flipped || cards[idx]!.matched) return;

      const next = cards.map((c, i) => (i === idx ? { ...c, flipped: true } : c));
      setCards(next);

      if (first === null) {
        setFirst(idx);
        return;
      }

      setMoves((m) => m + 1);
      setLock(true);
      const a = next[first]!;
      const b = next[idx]!;

      if (a.emoji === b.emoji) {
        setCards(
          next.map((c, i) => (i === first || i === idx ? { ...c, matched: true } : c)),
        );
        setFirst(null);
        setLock(false);
      } else {
        setTimeout(() => {
          setCards((cur) =>
            cur.map((c, i) => (i === first || i === idx ? { ...c, flipped: false } : c)),
          );
          setFirst(null);
          setLock(false);
        }, 700);
      }
    },
    [cards, first, lock],
  );

  return (
    <div className="mini-game">
      <header className="mini-game__header">
        <h2>Memory</h2>
        <p>Cliquez sur les cartes · Coups : {moves}</p>
        <button type="button" className="btn btn--ghost btn--sm" onClick={restart}>
          Rejouer
        </button>
      </header>
      <div className="memory-grid">
        {cards.map((card, i) => (
          <button
            key={card.id}
            type="button"
            className={`memory-card${card.flipped || card.matched ? ' memory-card--flipped' : ''}${card.matched ? ' memory-card--matched' : ''}`}
            onClick={() => flip(i)}
            disabled={card.matched}
            aria-label={card.flipped || card.matched ? card.emoji : 'Carte cachée'}
          >
            {card.flipped || card.matched ? card.emoji : '?'}
          </button>
        ))}
      </div>
      {won && <p className="mini-game__win">🎉 Toutes les paires trouvées !</p>}
    </div>
  );
}
