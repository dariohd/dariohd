import zones from './collisionZones.json';

export type ZoneRect = { x0: number; y0: number; x1: number; y1: number; id?: string };

export const FURNITURE_ZONES: ZoneRect[] = zones.furniture;
export const STAIRS_ZONE_RECT: ZoneRect = zones.stairs;
export const PC_ZONE_RECT: ZoneRect = zones.pc;

export const TV_ZONE = FURNITURE_ZONES.find((z) => z.id === 'tv')!;
export const BENCH_ZONE = FURNITURE_ZONES.find((z) => z.id === 'bench')!;
