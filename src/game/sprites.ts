import { setMapDimensions } from './roomAssets';
import { buildCollisionFromMaskImage } from './roomCollision';

/** Incrémenter après `npm run generate-collision` pour forcer le rechargement navigateur. */
export const COLLISION_MASK_VERSION = 29;

let bedroomImage: HTMLImageElement | null = null;
let nateImage: HTMLImageElement | null = null;
let collisionImage: HTMLImageElement | null = null;
let loadPromise: Promise<void> | null = null;
let loadedMaskVersion = -1;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function collisionSrc(): string {
  const base = `./sprites/nb2-bedroom-collision.png?v=${COLLISION_MASK_VERSION}`;
  // En dev, évite le cache navigateur entre deux générations du masque.
  if (import.meta.env.DEV) return `${base}&t=${Date.now()}`;
  return base;
}

export function loadSprites(): Promise<void> {
  const cacheHit =
    loadPromise && loadedMaskVersion === COLLISION_MASK_VERSION && !import.meta.env.DEV;
  if (cacheHit) return loadPromise!;

  loadedMaskVersion = COLLISION_MASK_VERSION;
  loadPromise = Promise.all([
    loadImage('./sprites/nb2-bedroom.png').then((img) => {
      bedroomImage = img;
      setMapDimensions(img.naturalWidth, img.naturalHeight);
    }),
    loadImage('./sprites/nate.png').then((img) => {
      nateImage = img;
    }),
    loadImage(collisionSrc()).then((img) => {
      collisionImage = img;
      buildCollisionFromMaskImage(img);
    }),
  ]).then(() => undefined);

  return loadPromise;
}

/** Recharge le masque collision (dev / après generate-collision). */
export function reloadCollisionMask(): Promise<void> {
  return loadImage(collisionSrc()).then((img) => {
    collisionImage = img;
    buildCollisionFromMaskImage(img);
  });
}

export function getBedroomImage(): HTMLImageElement | null {
  return bedroomImage;
}

export function getNateImage(): HTMLImageElement | null {
  return nateImage;
}

export function getCollisionImage(): HTMLImageElement | null {
  return collisionImage;
}

export function getCollisionMaskVersion(): number {
  return COLLISION_MASK_VERSION;
}

export function spritesReady(): boolean {
  return Boolean(bedroomImage && nateImage && collisionImage);
}

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    loadPromise = null;
    loadedMaskVersion = -1;
    collisionImage = null;
  });
}
