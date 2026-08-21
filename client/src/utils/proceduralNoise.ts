// Procedural 3D Simplex Noise, Fractal Brownian Motion (FBM), Domain Warping & Voronoi Cellular Noise

// Permutation table for Simplex Noise
const F3 = 1.0 / 3.0;
const G3 = 1.0 / 6.0;

const p = new Uint8Array(256);
for (let i = 0; i < 256; i++) p[i] = Math.floor(Math.random() * 256);

// Deterministic seedable perm table for reproducible planets
const PERM = new Uint8Array(512);
const PERM_MOD12 = new Uint8Array(512);

export function initNoiseSeed(seed: number = 42) {
  let s = seed;
  const nextRand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  const perm = new Uint8Array(256);
  for (let i = 0; i < 256; i++) perm[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(nextRand() * (i + 1));
    const tmp = perm[i];
    perm[i] = perm[j];
    perm[j] = tmp;
  }
  for (let i = 0; i < 512; i++) {
    PERM[i] = perm[i & 255];
    PERM_MOD12[i] = PERM[i] % 12;
  }
}
initNoiseSeed(12345);

const grad3 = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
];

// 3D Simplex Noise Function
export function simplex3(x: number, y: number, z: number): number {
  let n0 = 0, n1 = 0, n2 = 0, n3 = 0;
  const s = (x + y + z) * F3;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);
  const k = Math.floor(z + s);
  const t = (i + j + k) * G3;
  const X0 = i - t;
  const Y0 = j - t;
  const Z0 = k - t;
  const x0 = x - X0;
  const y0 = y - Y0;
  const z0 = z - Z0;

  let i1 = 0, j1 = 0, k1 = 0;
  let i2 = 0, j2 = 0, k2 = 0;
  if (x0 >= y0) {
    if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
    else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
  } else {
    if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
    else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
    else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
  }

  const x1 = x0 - i1 + G3;
  const y1 = y0 - j1 + G3;
  const z1 = z0 - k1 + G3;
  const x2 = x0 - i2 + 2.0 * G3;
  const y2 = y0 - j2 + 2.0 * G3;
  const z2 = z0 - k2 + 2.0 * G3;
  const x3 = x0 - 1.0 + 3.0 * G3;
  const y3 = y0 - 1.0 + 3.0 * G3;
  const z3 = z0 - 1.0 + 3.0 * G3;

  const ii = i & 255;
  const jj = j & 255;
  const kk = k & 255;

  let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
  if (t0 > 0) {
    const gi0 = PERM_MOD12[ii + PERM[jj + PERM[kk]]];
    t0 *= t0;
    n0 = t0 * t0 * (grad3[gi0][0] * x0 + grad3[gi0][1] * y0 + grad3[gi0][2] * z0);
  }

  let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
  if (t1 > 0) {
    const gi1 = PERM_MOD12[ii + i1 + PERM[jj + j1 + PERM[kk + k1]]];
    t1 *= t1;
    n1 = t1 * t1 * (grad3[gi1][0] * x1 + grad3[gi1][1] * y1 + grad3[gi1][2] * z1);
  }

  let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
  if (t2 > 0) {
    const gi2 = PERM_MOD12[ii + i2 + PERM[jj + j2 + PERM[kk + k2]]];
    t2 *= t2;
    n2 = t2 * t2 * (grad3[gi2][0] * x2 + grad3[gi2][1] * y2 + grad3[gi2][2] * z2);
  }

  let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
  if (t3 > 0) {
    const gi3 = PERM_MOD12[ii + 1 + PERM[jj + 1 + PERM[kk + 1]]];
    t3 *= t3;
    n3 = t3 * t3 * (grad3[gi3][0] * x3 + grad3[gi3][1] * y3 + grad3[gi3][2] * z3);
  }

  return 32.0 * (n0 + n1 + n2 + n3); // Range approx [-1, 1]
}

// Fractal Brownian Motion (FBM) with multiple octaves
export function fbm(x: number, y: number, z: number, octaves: number = 6, persistence: number = 0.5, lacunarity: number = 2.0): number {
  let total = 0;
  let frequency = 1.0;
  let amplitude = 1.0;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    total += simplex3(x * frequency, y * frequency, z * frequency) * amplitude;
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }

  return (total / maxValue + 1.0) * 0.5; // Normalized to [0, 1]
}

// Ridge Noise (Sharpened mountain ridges)
export function ridgeNoise(x: number, y: number, z: number, octaves: number = 4): number {
  let total = 0;
  let frequency = 1.0;
  let amplitude = 1.0;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    let n = Math.abs(simplex3(x * frequency, y * frequency, z * frequency));
    n = 1.0 - n; // Invert so peaks are sharp ridges
    n = n * n;
    total += n * amplitude;
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2.0;
  }

  return total / maxValue; // [0, 1]
}

// Domain Warping (Turbulence for Jovian Gas Swirls and Ocean Currents)
export function domainWarpFBM(x: number, y: number, z: number, warpIntensity: number = 2.5): number {
  const qx = fbm(x, y, z, 4);
  const qy = fbm(x + 5.2, y + 1.3, z + 2.8, 4);
  const qz = fbm(x + 1.8, y + 8.2, z + 4.1, 4);

  const rx = fbm(x + warpIntensity * qx + 1.7, y + warpIntensity * qy + 9.2, z + warpIntensity * qz + 0.5, 4);
  const ry = fbm(x + warpIntensity * qx + 8.3, y + warpIntensity * qy + 2.8, z + warpIntensity * qz + 6.1, 4);
  const rz = fbm(x + warpIntensity * qx + 3.4, y + warpIntensity * qy + 4.9, z + warpIntensity * qz + 7.3, 4);

  return fbm(x + warpIntensity * rx, y + warpIntensity * ry, z + warpIntensity * rz, 6);
}

// Voronoi / Worley Cellular Noise (Tectonic Plate Basalt Cracks and Glacial Ice Rifts)
export function voronoi3D(x: number, y: number, z: number): { f1: number; f2: number; crack: number } {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);

  let minDist1 = 999.0;
  let minDist2 = 999.0;

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dz = -1; dz <= 1; dz++) {
        const cx = xi + dx;
        const cy = yi + dy;
        const cz = zi + dz;

        // Pseudo-random feature point inside cell
        const px = cx + (PERM[(cx + PERM[(cy + PERM[cz & 255]) & 255]) & 255] / 255.0);
        const py = cy + (PERM[(cy + PERM[(cz + PERM[cx & 255]) & 255]) & 255] / 255.0);
        const pz = cz + (PERM[(cz + PERM[(cx + PERM[cy & 255]) & 255]) & 255] / 255.0);

        const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2 + (z - pz) ** 2);

        if (dist < minDist1) {
          minDist2 = minDist1;
          minDist1 = dist;
        } else if (dist < minDist2) {
          minDist2 = dist;
        }
      }
    }
  }

  // Crack value is sharp when close to edge between two Voronoi cells (f2 - f1 is small)
  const crack = Math.max(0, 1.0 - (minDist2 - minDist1) * 3.5);
  return { f1: minDist1, f2: minDist2, crack };
}
