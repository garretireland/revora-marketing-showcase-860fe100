// Planar perspective helpers for the screen takeover: map a source quad on
// an element onto a destination quad (CSS matrix3d via a homography).

export type Pt = [number, number];
export type Quad4 = [Pt, Pt, Pt, Pt]; // TL, TR, BR, BL

// Solve the 3x3 homography H (h33 = 1) taking src[i] -> dst[i].
function homography(src: Quad4, dst: Quad4): number[] {
  const A: number[][] = [];
  const b: number[] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i];
    const [u, v] = dst[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
  }
  // Gaussian elimination with partial pivoting
  for (let c = 0; c < 8; c++) {
    let p = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    [b[c], b[p]] = [b[p], b[c]];
    for (let r = c + 1; r < 8; r++) {
      const f = A[r][c] / A[c][c];
      for (let k = c; k < 8; k++) A[r][k] -= f * A[c][k];
      b[r] -= f * b[c];
    }
  }
  const h = new Array(8).fill(0);
  for (let r = 7; r >= 0; r--) {
    let s = b[r];
    for (let k = r + 1; k < 8; k++) s -= A[r][k] * h[k];
    h[r] = s / A[r][r];
  }
  return h;
}

// CSS matrix3d (use with transform-origin: 0 0) mapping src -> dst, in px.
export function quadMatrix3d(src: Quad4, dst: Quad4): string {
  const [a, b2, c, d, e, f, g, h] = homography(src, dst);
  return `matrix3d(${a},${d},0,${g},${b2},${e},0,${h},0,0,1,0,${c},${f},0,1)`;
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerpQuad = (a: Quad4, b: Quad4, t: number): Quad4 =>
  a.map((p, i) => [lerp(p[0], b[i][0], t), lerp(p[1], b[i][1], t)]) as Quad4;
export const FULL: Quad4 = [[0, 0], [1, 0], [1, 1], [0, 1]];
