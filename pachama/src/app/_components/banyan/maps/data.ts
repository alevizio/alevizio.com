/* What the map draws, all illustrative: a project boundary over Deimos
 * imagery of the Ucayali, burned and cleared pixels by year, and fire
 * alerts. Seeded, so it looks the same on every visit. */
type Pt = [number, number];
export type Year = 2022 | 2023 | 2024;
export const YEARS: Year[] = [2022, 2023, 2024];

// In the image's own 1000 × 500 space.
export const BOUNDARY: Pt[] = [
  [672, 262], [742, 236], [818, 248], [872, 286], [902, 344], [876, 398],
  [808, 424], [736, 414], [688, 376], [664, 318],
];

const rng = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

export type Pixel = { x: number; y: number; year: Year };

const cluster = (cx: number, cy: number, spread: number, count: number, seed: number): Pixel[] => {
  const r = rng(seed);
  return Array.from({ length: count }, () => ({
    x: Math.round(cx + (r() - 0.5) * spread * 2),
    y: Math.round(cy + (r() - 0.5) * spread),
    year: YEARS[Math.floor(r() * 3)],
  }));
};

export const BURNED: Pixel[] = [...cluster(250, 300, 110, 90, 3), ...cluster(880, 120, 80, 70, 5), ...cluster(760, 330, 40, 14, 9)];
export const CLEARED: Pixel[] = [...cluster(420, 180, 70, 60, 13), ...cluster(860, 400, 70, 50, 17)];

export type Alert = { id: string; x: number; y: number; year: Year; date: string; where: string };

export const ALERTS: Alert[] = [
  { id: "a1", x: 300, y: 270, year: 2022, date: "Fire detected 14 August 2022", where: "Lat 8.4128° S, long 74.6372° W" },
  { id: "a2", x: 770, y: 320, year: 2023, date: "Fire detected 1 January 2023", where: "Lat 8.3977° S, long 74.6365° W" },
  { id: "a3", x: 870, y: 110, year: 2024, date: "Fire detected 9 September 2024", where: "Lat 8.3801° S, long 74.6018° W" },
];

export const polygon = (pts: Pt[]) => pts.map(([x, y]) => `${x},${y}`).join(" ");
