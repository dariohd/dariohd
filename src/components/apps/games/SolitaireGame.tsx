import { useCallback, useRef, useState } from 'react';

const SUITS = ['♠', '♥', '♦', '♣'] as const;
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;

type Card = { id: number; suit: number; rank: number; faceUp: boolean };

function isRed(suit: number) {
  return suit === 1 || suit === 2;
}

function buildDeck(): Card[] {
  const deck: Card[] = [];
  let id = 0;
  for (let s = 0; s < 4; s++) {
    for (let r = 1; r <= 13; r++) {
      deck.push({ id: id++, suit: s, rank: r, faceUp: false });
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j]!, deck[i]!];
  }
  return deck;
}

function deal(deck: Card[]) {
  const tableau: Card[][] = Array.from({ length: 7 }, () => []);
  const d = [...deck];
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = d.pop()!;
      card.faceUp = row === col;
      tableau[col]!.push(card);
    }
  }
  return { tableau, stock: d };
}

function cardLabel(c: Card) {
  return `${RANKS[c.rank - 1]}${SUITS[c.suit]}`;
}

export function SolitaireGame() {
  const initial = useRef(deal(buildDeck())).current;
  const [tableau, setTableau] = useState<Card[][]>(initial.tableau);
  const [stock, setStock] = useState<Card[]>(initial.stock);
  const [waste, setWaste] = useState<Card[]>([]);
  const [foundations, setFoundations] = useState<(Card | null)[]>([null, null, null, null]);
  const [selected, setSelected] = useState<{ from: 'waste' | number; index: number } | null>(null);

  const won = foundations.every((f) => f?.rank === 13);

  const restart = useCallback(() => {
    const { tableau: t, stock: s } = deal(buildDeck());
    setTableau(t);
    setStock(s);
    setWaste([]);
    setFoundations([null, null, null, null]);
    setSelected(null);
  }, []);

  const drawStock = () => {
    if (stock.length === 0) {
      if (waste.length === 0) return;
      setStock([...waste].reverse().map((c) => ({ ...c, faceUp: false })));
      setWaste([]);
      return;
    }
    const card = stock[stock.length - 1]!;
    setStock(stock.slice(0, -1));
    setWaste([...waste, { ...card, faceUp: true }]);
  };

  const tryFoundation = (card: Card): boolean => {
    for (let i = 0; i < 4; i++) {
      const top = foundations[i];
      const ok = !top ? card.rank === 1 : top.suit === card.suit && card.rank === top.rank + 1;
      if (ok) {
        const next = [...foundations];
        next[i] = card;
        setFoundations(next);
        return true;
      }
    }
    return false;
  };

  const canStack = (card: Card, destTop: Card | null) => {
    if (!destTop) return card.rank === 13;
    if (isRed(card.suit) === isRed(destTop.suit)) return false;
    return card.rank === destTop.rank - 1;
  };

  const removeFromSource = (from: 'waste' | number, index: number): Card[] => {
    if (from === 'waste') {
      const moved = waste.slice(index);
      setWaste(waste.slice(0, index));
      return moved;
    }
    const col = [...tableau[from]!];
    const moved = col.slice(index);
    const rest = col.slice(0, index);
    if (rest.length > 0) {
      const last = rest[rest.length - 1]!;
      rest[rest.length - 1] = { ...last, faceUp: true };
    }
    const next = [...tableau];
    next[from] = rest;
    setTableau(next);
    return moved;
  };

  const placeOnColumn = (colIdx: number, cards: Card[]) => {
    const next = [...tableau];
    next[colIdx] = [...next[colIdx]!, ...cards];
    setTableau(next);
  };

  const onCardClick = (from: 'waste' | number, index: number, card: Card) => {
    if (!card.faceUp) return;

    if (!selected) {
      if (tryFoundation(card)) {
        removeFromSource(from, index);
        return;
      }
      setSelected({ from, index });
      return;
    }

    if (selected.from === from && selected.index === index) {
      setSelected(null);
      return;
    }

    const moving = removeFromSource(selected.from, selected.index);
    const head = moving[0]!;

    if (typeof from === 'number') {
      const destTop = tableau[from]![tableau[from]!.length - 1] ?? null;
      if (canStack(head, destTop)) {
        placeOnColumn(from, moving);
        setSelected(null);
        return;
      }
    }

    placeOnColumn(typeof selected.from === 'number' ? selected.from : 0, moving);
    setSelected(null);
  };

  const onFoundationClick = (slot: number) => {
    if (!selected) return;
    const moving = removeFromSource(selected.from, selected.index);
    const head = moving[0]!;
    const top = foundations[slot];
    const ok = !top ? head.rank === 1 : top.suit === head.suit && head.rank === top.rank + 1;
    if (moving.length === 1 && ok) {
      const next = [...foundations];
      next[slot] = head;
      setFoundations(next);
      setSelected(null);
      return;
    }
    placeOnColumn(typeof selected.from === 'number' ? selected.from : 0, moving);
    setSelected(null);
  };

  const onEmptyColumn = (colIdx: number) => {
    if (!selected) return;
    const moving = removeFromSource(selected.from, selected.index);
    if (moving[0]?.rank === 13) {
      placeOnColumn(colIdx, moving);
    } else {
      placeOnColumn(typeof selected.from === 'number' ? selected.from : 0, moving);
    }
    setSelected(null);
  };

  return (
    <div className="mini-game mini-game--solitaire">
      <header className="mini-game__header">
        <h2>Solitaire</h2>
        <p>Clic sur les cartes pour jouer</p>
        <button type="button" className="btn btn--ghost btn--sm" onClick={restart}>
          Nouvelle partie
        </button>
      </header>

      <div className="solitaire__top">
        <button type="button" className="solitaire__stock" onClick={drawStock} aria-label="Tirer">
          🂠 {stock.length}
        </button>
        <div className="solitaire__waste">
          {waste.length > 0 && (
            <button
              type="button"
              className={`solitaire__card${isRed(waste[waste.length - 1]!.suit) ? ' solitaire__card--red' : ''}${selected?.from === 'waste' ? ' solitaire__card--sel' : ''}`}
              onClick={() => onCardClick('waste', waste.length - 1, waste[waste.length - 1]!)}
            >
              {cardLabel(waste[waste.length - 1]!)}
            </button>
          )}
        </div>
        <div className="solitaire__foundations">
          {foundations.map((f, i) => (
            <button
              key={i}
              type="button"
              className="solitaire__foundation"
              onClick={() => onFoundationClick(i)}
            >
              {f ? (
                <span className={isRed(f.suit) ? 'solitaire__card--red' : ''}>{cardLabel(f)}</span>
              ) : (
                '·'
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="solitaire__tableau">
        {tableau.map((col, ci) => (
          <div key={ci} className="solitaire__column">
            {col.length === 0 ? (
              <button type="button" className="solitaire__slot" onClick={() => onEmptyColumn(ci)} aria-label="Colonne vide" />
            ) : (
              col.map((card, idx) => (
                <button
                  key={card.id}
                  type="button"
                  className={`solitaire__card solitaire__card--stacked${card.faceUp ? '' : ' solitaire__card--back'}${isRed(card.suit) ? ' solitaire__card--red' : ''}${selected?.from === ci && selected.index === idx ? ' solitaire__card--sel' : ''}`}
                  style={{ top: idx * 22 }}
                  onClick={() => card.faceUp && onCardClick(ci, idx, card)}
                >
                  {card.faceUp ? cardLabel(card) : '🂠'}
                </button>
              ))
            )}
          </div>
        ))}
      </div>

      {won && <p className="mini-game__win">🎉 Victoire !</p>}
    </div>
  );
}
