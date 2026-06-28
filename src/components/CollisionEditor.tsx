import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import {
  COLLISION_LABELS,
  COLLISION_RGB,
  rgbToTool,
  toolToCss,
  type CollisionTool,
} from '../game/collisionColors';
import { DISPLAY_SCALE } from '../game/roomAssets';
import { loadSprites, spritesReady, getBedroomImage, getCollisionImage } from '../game/sprites';

const BRUSH_SIZES = [1, 3, 6, 12] as const;
const STORAGE_KEY = 'dhd-collision-draft';

function paintDisk(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  cx: number,
  cy: number,
  radius: number,
  rgb: [number, number, number],
) {
  const r2 = radius * radius;
  for (let y = cy - radius; y <= cy + radius; y++) {
    for (let x = cx - radius; x <= cx + radius; x++) {
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy > r2) continue;
      const i = (y * w + x) * 4;
      data[i] = rgb[0];
      data[i + 1] = rgb[1];
      data[i + 2] = rgb[2];
      data[i + 3] = 255;
    }
  }
}

export function CollisionEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskRef = useRef<ImageData | null>(null);
  const undoRef = useRef<ImageData[]>([]);
  const paintingRef = useRef(false);
  const lastPtRef = useRef<{ x: number; y: number } | null>(null);

  const [loaded, setLoaded] = useState(spritesReady());
  const [tool, setTool] = useState<CollisionTool>('block');
  const [brush, setBrush] = useState<number>(3);
  const [showRoom, setShowRoom] = useState(true);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [status, setStatus] = useState('');

  const mapW = maskRef.current?.width ?? 329;
  const mapH = maskRef.current?.height ?? 343;

  const pushUndo = useCallback(() => {
    if (!maskRef.current) return;
    undoRef.current.push(new ImageData(new Uint8ClampedArray(maskRef.current.data), maskRef.current.width, maskRef.current.height));
    if (undoRef.current.length > 30) undoRef.current.shift();
  }, []);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const mask = maskRef.current;
    if (!canvas || !mask) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (showRoom) {
      const bedroom = getBedroomImage();
      if (bedroom) ctx.drawImage(bedroom, 0, 0, mask.width, mask.height);
    } else {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, mask.width, mask.height);
    }

    const overlay = ctx.createImageData(mask.width, mask.height);
    for (let i = 0; i < mask.data.length; i += 4) {
      const t = rgbToTool(mask.data[i]!, mask.data[i + 1]!, mask.data[i + 2]!);
      if (t === 'walk') continue;
      const [r, g, b] = COLLISION_RGB[t];
      overlay.data[i] = r;
      overlay.data[i + 1] = g;
      overlay.data[i + 2] = b;
      overlay.data[i + 3] = showRoom ? 160 : 255;
    }
    ctx.putImageData(overlay, 0, 0);
  }, [showRoom]);

  const initMaskFromImage = useCallback(
    (img: HTMLImageElement) => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      maskRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const view = canvasRef.current;
      if (view) {
        view.width = canvas.width * DISPLAY_SCALE;
        view.height = canvas.height * DISPLAY_SCALE;
      }
      redraw();
    },
    [redraw],
  );

  useEffect(() => {
    if (loaded) return;
    loadSprites()
      .then(() => setLoaded(true))
      .catch(() => setLoaded(false));
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;
    const draft = localStorage.getItem(STORAGE_KEY);
    if (draft) {
      const img = new Image();
      img.onload = () => initMaskFromImage(img);
      img.src = draft;
      setStatus('Brouillon local restauré.');
      return;
    }
    const collision = getCollisionImage();
    if (collision) {
      initMaskFromImage(collision);
      return;
    }
    const fallback = new Image();
    fallback.onload = () => initMaskFromImage(fallback);
    fallback.src = './sprites/nb2-bedroom-collision.png';
  }, [loaded, initMaskFromImage]);

  useEffect(() => {
    redraw();
  }, [redraw, showRoom]);

  const mapFromEvent = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width / DISPLAY_SCALE);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height / DISPLAY_SCALE);
    return { x, y };
  };

  const paintAt = (x: number, y: number) => {
    const mask = maskRef.current;
    if (!mask) return;
    paintDisk(mask.data, mask.width, mask.height, x, y, brush, COLLISION_RGB[tool]);
    if (lastPtRef.current) {
      const { x: x0, y: y0 } = lastPtRef.current;
      const steps = Math.max(Math.abs(x - x0), Math.abs(y - y0));
      for (let s = 0; s <= steps; s++) {
        const px = Math.round(x0 + ((x - x0) * s) / steps);
        const py = Math.round(y0 + ((y - y0) * s) / steps);
        paintDisk(mask.data, mask.width, mask.height, px, py, brush, COLLISION_RGB[tool]);
      }
    }
    lastPtRef.current = { x, y };
    redraw();
  };

  const onPointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    paintingRef.current = true;
    lastPtRef.current = null;
    pushUndo();
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    const { x, y } = mapFromEvent(e);
    paintAt(x, y);
  };

  const onPointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = mapFromEvent(e);
    setCursor({ x, y });
    if (!paintingRef.current) return;
    paintAt(x, y);
  };

  const onPointerUp = () => {
    paintingRef.current = false;
    lastPtRef.current = null;
    saveDraft();
  };

  const saveDraft = () => {
    const mask = maskRef.current;
    if (!mask) return;
    const c = document.createElement('canvas');
    c.width = mask.width;
    c.height = mask.height;
    c.getContext('2d')!.putImageData(mask, 0, 0);
    localStorage.setItem(STORAGE_KEY, c.toDataURL('image/png'));
  };

  const undo = () => {
    const prev = undoRef.current.pop();
    if (!prev || !maskRef.current) return;
    maskRef.current = new ImageData(new Uint8ClampedArray(prev.data), prev.width, prev.height);
    redraw();
    saveDraft();
  };

  const fillAll = (t: CollisionTool) => {
    pushUndo();
    const mask = maskRef.current;
    if (!mask) return;
    const rgb = COLLISION_RGB[t];
    for (let i = 0; i < mask.data.length; i += 4) {
      mask.data[i] = rgb[0];
      mask.data[i + 1] = rgb[1];
      mask.data[i + 2] = rgb[2];
      mask.data[i + 3] = 255;
    }
    redraw();
    saveDraft();
  };

  const exportPng = () => {
    const mask = maskRef.current;
    if (!mask) return;
    const c = document.createElement('canvas');
    c.width = mask.width;
    c.height = mask.height;
    c.getContext('2d')!.putImageData(mask, 0, 0);
    c.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'nb2-bedroom-collision.png';
      a.click();
      URL.revokeObjectURL(a.href);
      setStatus('PNG téléchargé → remplace public/sprites/nb2-bedroom-collision.png puis incrémente COLLISION_MASK_VERSION.');
    });
  };

  const importPng = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        pushUndo();
        initMaskFromImage(img);
        saveDraft();
        setStatus(`Importé ${img.naturalWidth}×${img.naturalHeight}.`);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  if (!loaded) {
    return (
      <div className="collision-editor collision-editor--loading">
        <div className="phase-loader__spinner" />
        <span>Chargement des sprites…</span>
      </div>
    );
  }

  return (
    <div className="collision-editor">
      <header className="collision-editor__bar">
        <h1>Éditeur de collisions</h1>
        <p className="collision-editor__hint">
          Dessine directement sur la chambre. Les couleurs du PNG = la vérité en jeu.
        </p>
      </header>

      <div className="collision-editor__tools">
        {(['walk', 'block', 'stairs', 'pc'] as CollisionTool[]).map((t) => (
          <button
            key={t}
            type="button"
            className={`collision-editor__tool${tool === t ? ' collision-editor__tool--active' : ''}`}
            style={{ '--swatch': toolToCss(t) } as CSSProperties}
            onClick={() => setTool(t)}
            title={COLLISION_LABELS[t]}
          >
            {COLLISION_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="collision-editor__tools">
        <span className="collision-editor__label">Pinceau</span>
        {BRUSH_SIZES.map((s) => (
          <button
            key={s}
            type="button"
            className={`btn btn--ghost btn--sm${brush === s ? ' collision-editor__brush--active' : ''}`}
            onClick={() => setBrush(s)}
          >
            {s}px
          </button>
        ))}
        <button type="button" className="btn btn--ghost btn--sm" onClick={undo}>
          Annuler
        </button>
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => setShowRoom((v) => !v)}>
          {showRoom ? 'Masque seul' : 'Chambre + masque'}
        </button>
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => fillAll('walk')}>
          Tout vert
        </button>
      </div>

      <div className="collision-editor__stage">
        <canvas
          ref={canvasRef}
          className="collision-editor__canvas"
          style={{ width: mapW * DISPLAY_SCALE, height: mapH * DISPLAY_SCALE }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        />
        {cursor && (
          <div className="collision-editor__coords">
            {cursor.x}, {cursor.y}
            {' · '}
            {COLLISION_LABELS[rgbToTool(
              maskRef.current?.data[(cursor.y * (maskRef.current?.width ?? 1) + cursor.x) * 4] ?? 0,
              maskRef.current?.data[(cursor.y * (maskRef.current?.width ?? 1) + cursor.x) * 4 + 1] ?? 255,
              maskRef.current?.data[(cursor.y * (maskRef.current?.width ?? 1) + cursor.x) * 4 + 2] ?? 0,
            )]}
          </div>
        )}
      </div>

      <footer className="collision-editor__footer">
        <button type="button" className="btn btn--primary" onClick={exportPng}>
          Télécharger le masque PNG
        </button>
        <label className="btn btn--ghost">
          Importer PNG
          <input
            type="file"
            accept="image/png"
            hidden
            onChange={(e) => e.target.files?.[0] && importPng(e.target.files[0])}
          />
        </label>
        <a className="btn btn--ghost" href="/?collision=1">
          Tester en jeu
        </a>
        {status && <span className="collision-editor__status">{status}</span>}
      </footer>

      <ol className="collision-editor__steps">
        <li>Dessine rouge (bloqué), bleu (escaliers), magenta (PC), vert (sol).</li>
        <li>Télécharge le PNG et remplace <code>public/sprites/nb2-bedroom-collision.png</code>.</li>
        <li>Incrémente <code>COLLISION_MASK_VERSION</code> dans <code>src/game/sprites.ts</code>.</li>
        <li>Recharge avec <code>?collision=1</code> pour vérifier en jeu.</li>
      </ol>
    </div>
  );
}
