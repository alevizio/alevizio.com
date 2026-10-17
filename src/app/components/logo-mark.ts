/**
 * The AV mark as a real object: a square bar bent at right angles into a flat
 * staircase, up, across, up. The Figma sketch draws it in an isometric view
 * turned so its three axes fall at 60°, 300° and 0° (the Penrose triangle's
 * view), where the staircase reads "/\/". markFrame draws it at any turn about
 * the vertical axis, with exact hidden lines, as SVG path data: the bar is one
 * prism, 10 faces and 24 edges, so no WebGL is needed.
 */

type Vec3 = [number, number, number];

// Bar width 1, segment length between bends 5: each band is 16.5% of the
// mark's height, a little bolder than the sketch's 14%.
const L = 5;
const H = 0.5;

// The staircase outline in its own plane: a along the first axis (the legs),
// b along the second (the middle stroke).
const OUTLINE: [number, number][] = [
  [-H, -H], [-H, H], [L - H, H], [L - H, L + H],
  [2 * L + H, L + H], [2 * L + H, L - H], [L + H, L - H], [L + H, -H],
];
const N = OUTLINE.length;
const CENTER: Vec3 = [L, L / 2, 0];
const at = (a: number, b: number, c: number): Vec3 => [a - CENTER[0], b - CENTER[1], c - CENTER[2]];

// Vertices: 0..7 on the face you see at rest (c = -H), 8..15 behind it.
const VERTS: Vec3[] = [-H, H].flatMap((c) => OUTLINE.map(([a, b]) => at(a, b, c)));

// A cap is the outline, non-convex; for occlusion it is three overlapping
// rectangles, one per bar.
const cap = (c: number): Vec3[][] => [
  [at(-H, -H, c), at(-H, H, c), at(L + H, H, c), at(L + H, -H, c)],
  [at(L - H, -H, c), at(L - H, L + H, c), at(L + H, L + H, c), at(L + H, -H, c)],
  [at(L - H, L - H, c), at(L - H, L + H, c), at(2 * L + H, L + H, c), at(2 * L + H, L - H, c)],
];
const WINDING = Math.sign(
  OUTLINE.reduce((sum, [a0, b0], i) => {
    const [a1, b1] = OUTLINE[(i + 1) % N];
    return sum + a0 * b1 - a1 * b0;
  }, 0),
);

type Face = { normal: Vec3; pieces: Vec3[][] };
const FACES: Face[] = [
  { normal: [0, 0, -1], pieces: cap(-H) },
  { normal: [0, 0, 1], pieces: cap(H) },
  ...OUTLINE.map(([a0, b0], i): Face => {
    const j = (i + 1) % N;
    const [a1, b1] = OUTLINE[j];
    const len = Math.hypot(a1 - a0, b1 - b0);
    return {
      normal: [(WINDING * (b1 - b0)) / len, (-WINDING * (a1 - a0)) / len, 0],
      pieces: [[VERTS[i], VERTS[j], VERTS[j + N], VERTS[i + N]]],
    };
  }),
];

// Edges as [from, to, face, face]: face 0 and 1 are the caps, 2 + i the side
// along outline edge i.
const EDGES: [number, number, number, number][] = OUTLINE.flatMap((_, i) => {
  const j = (i + 1) % N;
  return [
    [i, j, 0, 2 + i],
    [i + N, j + N, 1, 2 + i],
    [i, i + N, 2 + ((i + N - 1) % N), 2 + i],
  ] as [number, number, number, number][];
});

// The rest pose: the first axis on screen at 60°, the second at 300°, both
// turned toward the viewer, the third (the bar's depth) their cross product.
const K = Math.sqrt(2 / 3);
const Y3 = Math.sqrt(3) / 2;
const Z3 = 1 / Math.sqrt(3);
const AX: Vec3 = [0.5 * K, Y3 * K, Z3];
const BX: Vec3 = [0.5 * K, -Y3 * K, Z3];
const CX: Vec3 = [AX[1] * BX[2] - AX[2] * BX[1], AX[2] * BX[0] - AX[0] * BX[2], AX[0] * BX[1] - AX[1] * BX[0]];

// World coordinates, y up, the camera on +z looking down -z; turned by theta
// about the vertical axis.
const place = (p: Vec3, cos: number, sin: number): Vec3 => {
  const x = p[0] * AX[0] + p[1] * BX[0] + p[2] * CX[0];
  const y = p[0] * AX[1] + p[1] * BX[1] + p[2] * CX[1];
  const z = p[0] * AX[2] + p[1] * BX[2] + p[2] * CX[2];
  return [cos * x + sin * z, y, -sin * x + cos * z];
};

const EPS = 1e-6;
const lerp = (p: Vec3, q: Vec3, t: number): Vec3 => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t];

// The stretch [t0, t1] of segment p→q that convex planar polygon `poly`
// covers and stands in front of, or null.
function hiddenBy(p: Vec3, q: Vec3, poly: Vec3[]): [number, number] | null {
  let area = 0;
  for (let i = 0; i < poly.length; i++) {
    const u = poly[i];
    const v = poly[(i + 1) % poly.length];
    area += u[0] * v[1] - v[0] * u[1];
  }
  if (Math.abs(area) < 1e-12) return null; // edge-on
  const s = Math.sign(area);
  const dx = q[0] - p[0];
  const dy = q[1] - p[1];
  let t0 = 0;
  let t1 = 1;
  for (let i = 0; i < poly.length; i++) {
    const u = poly[i];
    const v = poly[(i + 1) % poly.length];
    const nx = s * (v[1] - u[1]);
    const ny = -s * (v[0] - u[0]);
    const num = nx * (p[0] - u[0]) + ny * (p[1] - u[1]);
    const den = nx * dx + ny * dy;
    if (Math.abs(den) < 1e-12) {
      if (num > -1e-9) return null; // parallel, outside or on the rim
      continue;
    }
    const t = -num / den;
    if (den < 0) t0 = Math.max(t0, t);
    else t1 = Math.min(t1, t);
    if (t0 >= t1) return null;
  }
  const [a, b, c] = poly;
  const u: Vec3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const v: Vec3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const n: Vec3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  if (Math.abs(n[2]) < 1e-12) return null;
  const gap = (t: number) => {
    const r = lerp(p, q, t);
    return a[2] - (n[0] * (r[0] - a[0]) + n[1] * (r[1] - a[1])) / n[2] - r[2];
  };
  const g0 = gap(t0);
  const g1 = gap(t1);
  if (g0 <= EPS && g1 <= EPS) return null;
  if (g0 > EPS && g1 > EPS) return [t0, t1];
  const tc = t0 + ((t1 - t0) * (EPS - g0)) / (g1 - g0);
  return g0 > EPS ? [t0, tc] : [tc, t1];
}

function subtract(spans: [number, number][], [h0, h1]: [number, number]) {
  return spans.flatMap(([a, b]): [number, number][] => {
    if (h1 <= a || h0 >= b) return [[a, b]];
    const out: [number, number][] = [];
    if (h0 > a) out.push([a, h0]);
    if (h1 < b) out.push([h1, b]);
    return out;
  });
}

type Frame = { fill: string; lines: string };
type Projected = { segments: [Vec3, Vec3][]; fills: Vec3[][] };

function project(theta: number): Projected {
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  const verts = VERTS.map((p) => place(p, cos, sin));
  const faces = FACES.map((f) => ({
    front: place(f.normal, cos, sin)[2] > 1e-9,
    pieces: f.pieces.map((pc) => pc.map((p) => place(p, cos, sin))),
  }));
  const segments: [Vec3, Vec3][] = [];
  for (const [i, j, fa, fb] of EDGES) {
    if (!faces[fa].front && !faces[fb].front) continue;
    const p = verts[i];
    const q = verts[j];
    let spans: [number, number][] = [[0, 1]];
    faces.forEach((f, fi) => {
      if (!f.front || fi === fa || fi === fb) return;
      for (const pc of f.pieces) {
        const hid = hiddenBy(p, q, pc);
        if (hid) spans = subtract(spans, hid);
      }
    });
    for (const [t0, t1] of spans) if (t1 - t0 > 1e-6) segments.push([lerp(p, q, t0), lerp(p, q, t1)]);
  }
  return { segments, fills: faces.filter((f) => f.front).flatMap((f) => f.pieces) };
}

// The viewBox is the rest pose's outline, scaled to the logo's 53px height.
const REST = project(0);
const xs = REST.segments.flat().map((p) => p[0]);
const ys = REST.segments.flat().map((p) => p[1]);
const MIN_X = Math.min(...xs);
const MAX_Y = Math.max(...ys);
export const MARK_HEIGHT = 53;
const SCALE = MARK_HEIGHT / (MAX_Y - Math.min(...ys));
export const MARK_WIDTH = Math.round((Math.max(...xs) - MIN_X) * SCALE * 10) / 10;
// 4.5% of the height, the sketch's line weight.
export const MARK_STROKE = Math.round(0.045 * MARK_HEIGHT * 10) / 10;

const pt = (p: Vec3) => `${((p[0] - MIN_X) * SCALE).toFixed(1)} ${((MAX_Y - p[1]) * SCALE).toFixed(1)}`;

/** The mark turned by theta (radians) about the vertical axis; 0 is the AV. */
export function markFrame(theta: number): Frame {
  const { segments, fills } = theta === 0 ? REST : project(theta);
  return {
    fill: fills.map((pc) => `M${pc.map(pt).join("L")}Z`).join(""),
    lines: segments.map(([p, q]) => `M${pt(p)}L${pt(q)}`).join(""),
  };
}
