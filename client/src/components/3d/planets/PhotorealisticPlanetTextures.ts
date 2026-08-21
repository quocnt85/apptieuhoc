import * as THREE from 'three';
import { fbm, ridgeNoise, domainWarpFBM, voronoi3D, simplex3 } from '../../../utils/proceduralNoise';
import { PlanetData } from '../../../types';

// Converts texture (u, v) in [0, 1] to 3D spherical coordinates (x, y, z) on unit sphere
function uvTo3D(u: number, v: number): [number, number, number] {
  const theta = (u - 0.5) * 2.0 * Math.PI; // Longitude [-PI, PI]
  const phi = (v - 0.5) * Math.PI;          // Latitude [-PI/2, PI/2]
  const cosPhi = Math.cos(phi);
  return [
    cosPhi * Math.sin(theta),
    Math.sin(phi),
    cosPhi * Math.cos(theta),
  ];
}

// Color lerp helper
function lerpColor(c1: [number, number, number], c2: [number, number, number], t: number): [number, number, number] {
  const clampedT = Math.max(0, Math.min(1, t));
  return [
    c1[0] + (c2[0] - c1[0]) * clampedT,
    c1[1] + (c2[1] - c1[1]) * clampedT,
    c1[2] + (c2[2] - c1[2]) * clampedT,
  ];
}

// ==========================================
// 1. BRAVERY PRIME (Photorealistic Terrestrial Planet)
// ==========================================
export function createBraveryPrimeTexture(width: number = 1024, height: number = 512): {
  map: THREE.CanvasTexture;
  bump: THREE.CanvasTexture;
  specular: THREE.CanvasTexture;
} {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = width / 2;
  bumpCanvas.height = height / 2;
  const bumpCtx = bumpCanvas.getContext('2d')!;
  const bumpImg = bumpCtx.createImageData(width / 2, height / 2);
  const bumpData = bumpImg.data;

  const specCanvas = document.createElement('canvas');
  specCanvas.width = width / 2;
  specCanvas.height = height / 2;
  const specCtx = specCanvas.getContext('2d')!;
  const specImg = specCtx.createImageData(width / 2, height / 2);
  const specData = specImg.data;

  for (let y = 0; y < height; y++) {
    const v = y / (height - 1);
    const latFactor = Math.abs(v - 0.5) * 2.0; // 0 at equator, 1 at poles

    for (let x = 0; x < width; x++) {
      const u = x / (width - 1);
      const [nx, ny, nz] = uvTo3D(u, v);

      // Multi-scale 3D Fractal Noise on spherical coordinates
      const continentElevation = fbm(nx * 1.8, ny * 1.8, nz * 1.8, 6, 0.5, 2.1);
      const mountainNoise = ridgeNoise(nx * 3.5, ny * 3.5, nz * 3.5, 4);
      const detailNoise = simplex3(nx * 12.0, ny * 12.0, nz * 12.0) * 0.05;

      const elevation = continentElevation + detailNoise;
      const seaLevel = 0.48;

      let r = 0, g = 0, b = 0;
      let bumpVal = 0;
      let specVal = 0;

      // Polar Ice Caps calculation
      const polarThreshold = 0.82;
      const isPolar = latFactor > polarThreshold + (fbm(nx * 4, ny * 4, nz * 4, 3) - 0.5) * 0.12;

      if (isPolar) {
        // Glacier Ice Cap
        r = 240 + Math.floor(detailNoise * 150);
        g = 248 + Math.floor(detailNoise * 100);
        b = 255;
        bumpVal = 180;
        specVal = 200;
      } else if (elevation < seaLevel) {
        // Ocean Depths
        const oceanDepth = elevation / seaLevel; // 0 (deep) to 1 (shallow coast)
        const deepColor: [number, number, number] = [12, 54, 94];     // #0c365e
        const shallowColor: [number, number, number] = [45, 172, 224]; // #2dace0
        const coastalColor: [number, number, number] = [56, 189, 248]; // #38bdf8

        let col: [number, number, number];
        if (oceanDepth < 0.7) {
          col = lerpColor(deepColor, shallowColor, oceanDepth / 0.7);
        } else {
          col = lerpColor(shallowColor, coastalColor, (oceanDepth - 0.7) / 0.3);
        }

        r = col[0];
        g = col[1];
        b = col[2];
        bumpVal = 30;
        specVal = 255; // High specular reflection on water
      } else {
        // Land / Continental Terrain
        const landHeight = (elevation - seaLevel) / (1.0 - seaLevel); // 0 to 1
        specVal = 15; // Low specular on dry land

        const sandColor: [number, number, number] = [224, 168, 88];    // Beach sand #e0a858
        const redEarthColor: [number, number, number] = [217, 90, 48];  // Red Basalt #d95a30
        const plateauColor: [number, number, number] = [180, 60, 30];   // Canyon Plateau
        const mountainRock: [number, number, number] = [90, 70, 65];    // Dark rock
        const snowPeak: [number, number, number] = [255, 255, 255];     // Snow peak

        let col: [number, number, number];
        if (landHeight < 0.08) {
          col = lerpColor(sandColor, redEarthColor, landHeight / 0.08);
          bumpVal = 60 + Math.floor(landHeight * 100);
        } else if (landHeight < 0.45) {
          col = lerpColor(redEarthColor, plateauColor, (landHeight - 0.08) / 0.37);
          bumpVal = 80 + Math.floor(landHeight * 200);
        } else if (landHeight < 0.75) {
          const mountainFactor = (landHeight - 0.45) / 0.3 + mountainNoise * 0.4;
          col = lerpColor(plateauColor, mountainRock, mountainFactor);
          bumpVal = 140 + Math.floor(mountainNoise * 90);
        } else {
          // Alpine Snow Peaks
          const snowFactor = (landHeight - 0.75) / 0.25;
          col = lerpColor(mountainRock, snowPeak, snowFactor);
          bumpVal = 220 + Math.floor(mountainNoise * 35);
          specVal = 140; // Ice reflection
        }

        r = col[0];
        g = col[1];
        b = col[2];
      }

      const idx = (y * width + x) * 4;
      data[idx] = Math.max(0, Math.min(255, r));
      data[idx + 1] = Math.max(0, Math.min(255, g));
      data[idx + 2] = Math.max(0, Math.min(255, b));
      data[idx + 3] = 255;
    }
  }

  // Generate Bump & Specular maps downscaled
  for (let by = 0; by < height / 2; by++) {
    for (let bx = 0; bx < width / 2; bx++) {
      const srcIdx = (by * 2 * width + bx * 2) * 4;
      const destIdx = (by * (width / 2) + bx) * 4;
      const bR = data[srcIdx];
      const bG = data[srcIdx + 1];
      const bB = data[srcIdx + 2];
      const isWater = bB > bR + 40;

      const bVal = isWater ? 20 : Math.min(255, Math.floor((bR + bG + bB) / 3));
      bumpData[destIdx] = bVal;
      bumpData[destIdx + 1] = bVal;
      bumpData[destIdx + 2] = bVal;
      bumpData[destIdx + 3] = 255;

      const sVal = isWater ? 255 : 20;
      specData[destIdx] = sVal;
      specData[destIdx + 1] = sVal;
      specData[destIdx + 2] = sVal;
      specData[destIdx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  bumpCtx.putImageData(bumpImg, 0, 0);
  specCtx.putImageData(specImg, 0, 0);

  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.ClampToEdgeWrapping;

  const bump = new THREE.CanvasTexture(bumpCanvas);
  bump.wrapS = THREE.RepeatWrapping;

  const specular = new THREE.CanvasTexture(specCanvas);
  specular.wrapS = THREE.RepeatWrapping;

  return { map, bump, specular };
}

// ==========================================
// 2. AQUA NOVA (Photorealistic Ocean & Bioluminescent Coral Planet)
// ==========================================
export function createAquaNovaTexture(width: number = 1024, height: number = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    const v = y / (height - 1);
    for (let x = 0; x < width; x++) {
      const u = x / (width - 1);
      const [nx, ny, nz] = uvTo3D(u, v);

      const oceanFBM = fbm(nx * 2.2, ny * 2.2, nz * 2.2, 5, 0.5, 2.0);
      const trenchNoise = voronoi3D(nx * 3.0, ny * 3.0, nz * 3.0).crack;
      const coralNoise = fbm(nx * 8.0, ny * 8.0, nz * 8.0, 4);

      // Palette: Abyssal Trench -> Deep Azure -> Turquoise Lagoon -> Bioluminescent Cyan Coral -> Sand Atolls
      const abyssal: [number, number, number] = [4, 18, 48];       // #041230
      const deepOcean: [number, number, number] = [10, 65, 128];   // #0a4180
      const turquoise: [number, number, number] = [20, 160, 200];  // #14a0c8
      const brightCyan: [number, number, number] = [64, 224, 208]; // Bioluminescent #40e0d0
      const whiteSand: [number, number, number] = [240, 250, 220]; // Coral sand

      let col: [number, number, number];

      if (trenchNoise > 0.75) {
        // Deep Mariana Trenches
        col = lerpColor(abyssal, [2, 6, 20], (trenchNoise - 0.75) / 0.25);
      } else if (oceanFBM < 0.6) {
        // Deep open ocean
        col = lerpColor(abyssal, deepOcean, oceanFBM / 0.6);
      } else if (oceanFBM < 0.85) {
        // Turquoise reef waters
        col = lerpColor(deepOcean, turquoise, (oceanFBM - 0.6) / 0.25);
      } else {
        // Coral Atolls & Shallows
        const coralFactor = (oceanFBM - 0.85) / 0.15;
        if (coralNoise > 0.65) {
          col = lerpColor(brightCyan, whiteSand, (coralNoise - 0.65) / 0.35);
        } else {
          col = lerpColor(turquoise, brightCyan, coralFactor);
        }
      }

      const idx = (y * width + x) * 4;
      data[idx] = col[0];
      data[idx + 1] = col[1];
      data[idx + 2] = col[2];
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// ==========================================
// 3. STORM GIANT (Photorealistic Domain-Warped Jovian Gas Giant)
// ==========================================
export function createStormGiantTexture(width: number = 1024, height: number = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    const v = y / (height - 1);
    for (let x = 0; x < width; x++) {
      const u = x / (width - 1);
      const [nx, ny, nz] = uvTo3D(u, v);

      // Strong horizontal banding perturbation + Domain Warping
      const bandCoordY = ny * 7.5;
      const bandWave = Math.sin(bandCoordY + simplex3(nx * 3.0, ny * 3.0, nz * 3.0) * 1.8);
      const warp = domainWarpFBM(nx * 2.0, (ny + bandWave * 0.15) * 2.5, nz * 2.0, 3.2);

      // Great Storm Eye (Cyclonic Vortex at South latitude)
      const stormCenterY = -0.32;
      const stormCenterX = 0.5;
      const distToStorm = Math.sqrt((nx - stormCenterX) ** 2 + ((ny - stormCenterY) * 2.2) ** 2 + nz ** 2);
      const isGreatStorm = distToStorm < 0.35;

      // Jovian Atmospheric Color Palette (Deep Purple, Violet, Magenta, Orange Amber, Pastel Blue)
      const deepPurple: [number, number, number] = [45, 12, 80];    // #2d0c50
      const royalViolet: [number, number, number] = [98, 30, 160];  // #621ea0
      const crimsonOrange: [number, number, number] = [225, 80, 50];// #e15032
      const peachAmber: [number, number, number] = [245, 165, 110]; // #f5a56e
      const pastelBlue: [number, number, number] = [140, 175, 230]; // #8cafe6

      let col: [number, number, number];

      if (isGreatStorm) {
        // Red/Crimson Great Storm Eye with spiral gradient
        const stormIntensity = 1.0 - (distToStorm / 0.35);
        const spiralAngle = Math.atan2(ny - stormCenterY, nx - stormCenterX);
        const spiral = Math.sin(spiralAngle * 4.0 + distToStorm * 15.0) * 0.2;
        col = lerpColor(crimsonOrange, [255, 220, 150], stormIntensity + spiral);
      } else {
        if (warp < 0.25) {
          col = lerpColor(deepPurple, royalViolet, warp / 0.25);
        } else if (warp < 0.5) {
          col = lerpColor(royalViolet, crimsonOrange, (warp - 0.25) / 0.25);
        } else if (warp < 0.75) {
          col = lerpColor(crimsonOrange, peachAmber, (warp - 0.5) / 0.25);
        } else {
          col = lerpColor(peachAmber, pastelBlue, (warp - 0.75) / 0.25);
        }
      }

      const idx = (y * width + x) * 4;
      data[idx] = Math.max(0, Math.min(255, col[0]));
      data[idx + 1] = Math.max(0, Math.min(255, col[1]));
      data[idx + 2] = Math.max(0, Math.min(255, col[2]));
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// ==========================================
// 4. FROST AEGIS (Photorealistic Glacial Ice & Polar Aurora Planet)
// ==========================================
export function createFrostAegisTexture(width: number = 1024, height: number = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    const v = y / (height - 1);
    const lat = Math.abs(v - 0.5) * 2.0;

    for (let x = 0; x < width; x++) {
      const u = x / (width - 1);
      const [nx, ny, nz] = uvTo3D(u, v);

      const iceFBM = fbm(nx * 3.0, ny * 3.0, nz * 3.0, 5, 0.5, 2.2);
      const voronoi = voronoi3D(nx * 4.5, ny * 4.5, nz * 4.5);
      const crackIntensity = voronoi.crack; // Sharp rift edges

      // Aurora waves near polar regions
      const auroraWave = lat > 0.6 ? Math.sin(nx * 8.0 + ny * 5.0 + fbm(nx * 4, ny * 4, nz * 4, 3) * 6.0) : 0;
      const isAurora = lat > 0.65 && auroraWave > 0.3;

      // Palette: Pure Snow White -> Powder Cyan -> Deep Glacier Blue -> Neon Cyan Crevasses
      const pureSnow: [number, number, number] = [250, 253, 255];
      const glacierPowder: [number, number, number] = [210, 240, 252];
      const deepIceBlue: [number, number, number] = [100, 195, 240];
      const neonRiftCyan: [number, number, number] = [30, 220, 255];
      const auroraGreen: [number, number, number] = [52, 211, 153];
      const auroraPurple: [number, number, number] = [192, 132, 252];

      let col: [number, number, number];

      if (crackIntensity > 0.6) {
        // Glowing Neon Crevasse
        col = lerpColor(deepIceBlue, neonRiftCyan, (crackIntensity - 0.6) / 0.4);
      } else if (isAurora) {
        // Shimmering Aurora Borealis Reflection
        col = lerpColor(auroraGreen, auroraPurple, (auroraWave - 0.3) / 0.7);
      } else {
        // Glacial Snow Plains
        col = lerpColor(pureSnow, glacierPowder, iceFBM);
      }

      const idx = (y * width + x) * 4;
      data[idx] = col[0];
      data[idx + 1] = col[1];
      data[idx + 2] = col[2];
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// ==========================================
// 5. MAGMA IGNIS (Photorealistic Volcanic Basalt & Molten Lava Planet)
// ==========================================
export function createMagmaIgnisTexture(width: number = 1024, height: number = 512): {
  map: THREE.CanvasTexture;
  emissiveMap: THREE.CanvasTexture;
} {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  const emissiveCanvas = document.createElement('canvas');
  emissiveCanvas.width = width;
  emissiveCanvas.height = height;
  const emissiveCtx = emissiveCanvas.getContext('2d')!;
  const emissiveImg = emissiveCtx.createImageData(width, height);
  const emissiveData = emissiveImg.data;

  for (let y = 0; y < height; y++) {
    const v = y / (height - 1);
    for (let x = 0; x < width; x++) {
      const u = x / (width - 1);
      const [nx, ny, nz] = uvTo3D(u, v);

      const voronoi = voronoi3D(nx * 4.0, ny * 4.0, nz * 4.0);
      const lavaCrack = voronoi.crack; // 0 (plate center) to 1 (active crack)
      const plateTexture = fbm(nx * 8.0, ny * 8.0, nz * 8.0, 4);

      // Caldera Volcano Hotspots
      const calderaNoise = fbm(nx * 2.5, ny * 2.5, nz * 2.5, 3);
      const isCaldera = calderaNoise > 0.72;

      // Palette: Obsidian Black Basalt -> Charcoal Crust -> Molten Orange Red -> Solar Yellow Core
      const blackBasalt: [number, number, number] = [15, 18, 24];     // #0f1218
      const charcoal: [number, number, number] = [35, 40, 50];        // #232832
      const darkMoltenRed: [number, number, number] = [200, 30, 10];  // #c81e0a
      const radiantOrange: [number, number, number] = [255, 120, 20]; // #ff7814
      const solarLavaYellow: [number, number, number] = [255, 235, 100]; // #ffeb64

      let col: [number, number, number];
      let emCol: [number, number, number] = [0, 0, 0];

      if (isCaldera) {
        // Erupting Caldera Super-Hotspot
        const calderaIntensity = (calderaNoise - 0.72) / 0.28;
        col = lerpColor(radiantOrange, solarLavaYellow, calderaIntensity);
        emCol = col;
      } else if (lavaCrack > 0.35) {
        // Active Glowing Lava Vein
        const crackHeat = (lavaCrack - 0.35) / 0.65;
        if (crackHeat < 0.6) {
          col = lerpColor(darkMoltenRed, radiantOrange, crackHeat / 0.6);
        } else {
          col = lerpColor(radiantOrange, solarLavaYellow, (crackHeat - 0.6) / 0.4);
        }
        emCol = [Math.floor(col[0] * crackHeat), Math.floor(col[1] * crackHeat), Math.floor(col[2] * crackHeat)];
      } else {
        // Solid Basalt Tectonic Crust
        col = lerpColor(blackBasalt, charcoal, plateTexture);
        emCol = [0, 0, 0];
      }

      const idx = (y * width + x) * 4;
      data[idx] = col[0];
      data[idx + 1] = col[1];
      data[idx + 2] = col[2];
      data[idx + 3] = 255;

      emissiveData[idx] = emCol[0];
      emissiveData[idx + 1] = emCol[1];
      emissiveData[idx + 2] = emCol[2];
      emissiveData[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  emissiveCtx.putImageData(emissiveImg, 0, 0);

  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.ClampToEdgeWrapping;

  const emissiveMap = new THREE.CanvasTexture(emissiveCanvas);
  emissiveMap.wrapS = THREE.RepeatWrapping;
  emissiveMap.wrapT = THREE.ClampToEdgeWrapping;

  return { map, emissiveMap };
}

// ==========================================
// Diverse Atmospheric Cloud Texture Generator (Đa Dạng Độ Dày, Mây Đen/Trắng/Băng)
// ==========================================
export function createDiverseAtmosphericClouds(
  width: number = 1024,
  height: number = 512,
  cloudType: 'terrestrial_cumulus' | 'tropical_cyclones' | 'aurora_mist' | 'volcanic_ash_smoke' | 'none' = 'terrestrial_cumulus',
  cloudColorHex: string = '#ffffff'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  if (cloudType === 'none') {
    ctx.putImageData(imgData, 0, 0);
    const emptyTex = new THREE.CanvasTexture(canvas);
    return emptyTex;
  }

  const baseCol = new THREE.Color(cloudColorHex);
  const cr = Math.floor(baseCol.r * 255);
  const cg = Math.floor(baseCol.g * 255);
  const cb = Math.floor(baseCol.b * 255);

  for (let y = 0; y < height; y++) {
    const v = y / (height - 1);
    const latFactor = Math.abs(v - 0.5) * 2.0;

    for (let x = 0; x < width; x++) {
      const u = x / (width - 1);
      const [nx, ny, nz] = uvTo3D(u, v);

      let alpha = 0;
      let r = cr;
      let g = cg;
      let b = cb;

      if (cloudType === 'tropical_cyclones') {
        // Ocean Super-Cyclone Swirls
        const swirlAngle = Math.atan2(ny, nx) + Math.sin(latFactor * 4) * 0.8;
        const dist = Math.sqrt(nx * nx + ny * ny);
        const spiral = Math.sin(swirlAngle * 3.0 - dist * 8.0) * 0.3;
        const density = fbm(nx * 3.5 + spiral, ny * 3.5, nz * 3.5, 5, 0.55, 2.2);
        
        if (density > 0.45) {
          const t = (density - 0.45) / 0.55;
          alpha = Math.floor(Math.pow(t, 1.2) * 245);
          // Highlight bright cyclone eye edges
          if (t > 0.6) {
            r = Math.min(255, cr + 20);
            g = Math.min(255, cg + 20);
            b = Math.min(255, cb + 20);
          }
        }
      } else if (cloudType === 'volcanic_ash_smoke') {
        // Heavy Dark Ash & Fiery Smoke Plumes (Chỗ mờ chỗ cuộn xám đen)
        const ashDensity = fbm(nx * 4.0, ny * 4.0, nz * 4.0, 5, 0.6, 2.3);
        const smokeHotspot = voronoi3D(nx * 5.0, ny * 5.0, nz * 5.0).crack;
        
        if (ashDensity > 0.42) {
          const t = (ashDensity - 0.42) / 0.58;
          alpha = Math.floor(Math.pow(t, 1.1) * 230);
          
          if (smokeHotspot > 0.75) {
            // Emissive fiery glow in ash cracks
            r = 255;
            g = 100 + Math.floor(t * 80);
            b = 30;
          } else {
            // Dark obsidian ash plume
            const shade = 0.6 + t * 0.4;
            r = Math.floor(cr * shade);
            g = Math.floor(cg * shade);
            b = Math.floor(cb * shade);
          }
        }
      } else if (cloudType === 'aurora_mist') {
        // Soft Glacial Aurora Mist (Sương tuyết cực quang bồng bềnh)
        const wave = Math.sin(nx * 6.0 + ny * 3.0 + fbm(nx * 3, ny * 3, nz * 3, 3) * 4.0);
        const mistDensity = fbm(nx * 2.5, ny * 2.5, nz * 2.5, 4, 0.5, 2.0);
        
        if (mistDensity > 0.48) {
          const t = (mistDensity - 0.48) / 0.52;
          alpha = Math.floor(Math.pow(t, 1.4) * 190);
          // Aurora hue shift
          r = Math.floor(cr * 0.8 + (Math.sin(wave) * 0.5 + 0.5) * 40);
          g = Math.floor(cg * 0.9 + 25);
          b = Math.min(255, cb + 30);
        }
      } else {
        // Terrestrial Cumulus & Stratus (Mây tích trắng: chỗ dày cộm, chỗ tơ mỏng, chỗ quang đãng)
        const density = fbm(nx * 3.2, ny * 3.2 + simplex3(nx * 2, ny * 2, nz * 2) * 0.35, nz * 3.2, 5, 0.55, 2.1);
        const wispyDetail = simplex3(nx * 12, ny * 12, nz * 12) * 0.08;
        const total = density + wispyDetail;

        if (total > 0.46) {
          const t = (total - 0.46) / 0.54;
          // Non-linear power curve creates varied thick cores vs delicate feathered edges
          alpha = Math.floor(Math.pow(t, 1.3) * 235);
        }
      }

      const idx = (y * width + x) * 4;
      data[idx] = Math.max(0, Math.min(255, r));
      data[idx + 1] = Math.max(0, Math.min(255, g));
      data[idx + 2] = Math.max(0, Math.min(255, b));
      data[idx + 3] = Math.max(0, Math.min(255, alpha));
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function createRealisticAtmosphericClouds(width: number = 1024, height: number = 512): THREE.CanvasTexture {
  return createDiverseAtmosphericClouds(width, height, 'terrestrial_cumulus', '#ffffff');
}

// ==========================================
// Procedural Multi-Material Moon Texture Generator
// ==========================================
export function createProceduralMoonTexture(
  baseColor: string = '#cbd5e1',
  textureType: 'crater' | 'ice_cracked' | 'lava_rock' | 'crystal' | 'metallic' = 'crater'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(256, 128);
  const data = imgData.data;

  const tempColor = new THREE.Color(baseColor);
  const br = Math.floor(tempColor.r * 255);
  const bg = Math.floor(tempColor.g * 255);
  const bb = Math.floor(tempColor.b * 255);

  for (let y = 0; y < 128; y++) {
    const v = y / 127;
    for (let x = 0; x < 256; x++) {
      const u = x / 255;
      const [nx, ny, nz] = uvTo3D(u, v);

      let r = br;
      let g = bg;
      let b = bb;

      if (textureType === 'ice_cracked') {
        // Glacial Ice Crust with Glowing Cyan Rifts
        const iceNoise = fbm(nx * 4, ny * 4, nz * 4, 4);
        const rifts = voronoi3D(nx * 6, ny * 6, nz * 6).crack;
        if (rifts > 0.65) {
          const riftHeat = (rifts - 0.65) / 0.35;
          r = Math.floor(br * (1 - riftHeat) + 120 * riftHeat);
          g = Math.floor(bg * (1 - riftHeat) + 240 * riftHeat);
          b = 255;
        } else {
          const shade = 0.75 + iceNoise * 0.25;
          r = Math.floor(br * shade);
          g = Math.floor(bg * shade);
          b = Math.floor(bb * shade);
        }
      } else if (textureType === 'lava_rock') {
        // Dark Basalt Crust with Glowing Red/Orange Magma Cracks
        const plate = fbm(nx * 5, ny * 5, nz * 5, 4);
        const cracks = voronoi3D(nx * 5, ny * 5, nz * 5).crack;
        if (cracks > 0.6) {
          const heat = (cracks - 0.6) / 0.4;
          r = 255;
          g = Math.floor(100 * heat);
          b = 20;
        } else {
          const shade = 0.4 + plate * 0.5;
          r = Math.floor(br * shade);
          g = Math.floor(bg * shade);
          b = Math.floor(bb * shade);
        }
      } else if (textureType === 'crystal') {
        // Faceted Shimmering Crystal / Gemstone Shading
        const voronoi = voronoi3D(nx * 7, ny * 7, nz * 7);
        const facet = voronoi.crack;
        const shimmer = fbm(nx * 10, ny * 10, nz * 10, 3) * 0.3;
        const shade = Math.min(1.2, 0.6 + facet * 0.4 + shimmer);
        r = Math.min(255, Math.floor(br * shade + 30));
        g = Math.min(255, Math.floor(bg * shade + 30));
        b = Math.min(255, Math.floor(bb * shade + 30));
      } else if (textureType === 'metallic') {
        // Polished Metallic Specular Striations
        const striation = Math.sin(ny * 20 + fbm(nx * 4, ny * 4, nz * 4, 3) * 5) * 0.25 + 0.75;
        r = Math.min(255, Math.floor(br * striation + 40));
        g = Math.min(255, Math.floor(bg * striation + 30));
        b = Math.min(255, Math.floor(bb * striation + 20));
      } else {
        // Classic High-Detail Crater Moon (Luna style)
        const noise = fbm(nx * 4, ny * 4, nz * 4, 4);
        const crater = voronoi3D(nx * 6, ny * 6, nz * 6).crack;
        const shade = Math.min(1.0, Math.max(0.2, (noise * 0.7 + (1.0 - crater) * 0.3)));
        r = Math.floor(br * shade);
        g = Math.floor(bg * shade);
        b = Math.floor(bb * shade);
      }

      const idx = (y * 256 + x) * 4;
      data[idx] = Math.max(0, Math.min(255, r));
      data[idx + 1] = Math.max(0, Math.min(255, g));
      data[idx + 2] = Math.max(0, Math.min(255, b));
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// ==========================================
// Realistic Astronomically-Accurate Planetary Ring Generator
// ==========================================
export function createRealisticPlanetaryRingTexture(
  primaryColorHex: string = '#fbbf24',
  secondaryColorHex: string = '#fef08a'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(canvas.width, canvas.height);
  const data = imgData.data;

  const col1 = new THREE.Color(primaryColorHex);
  const col2 = new THREE.Color(secondaryColorHex);

  // u runs from 0 (inner ring edge) to 1 (outer ring edge)
  for (let x = 0; x < canvas.width; x++) {
    const u = x / (canvas.width - 1);
    
    // Multi-frequency Ringlet Micro-Banding (Hàng ngàn rãnh nhỏ li ti)
    const micro1 = Math.sin(u * 120.0) * 0.15 + 0.85;
    const micro2 = Math.sin(u * 380.0) * 0.1 + 0.9;
    const fineBanding = micro1 * micro2;

    let baseAlpha = 0;
    let colorMix = 0.5;

    if (u < 0.05) {
      // Inner Feathered Edge (Mép trong cùng mỏng dần về 0)
      baseAlpha = (u / 0.05) * 0.25;
      colorMix = 0.2;
    } else if (u < 0.25) {
      // C Ring (Dải C: Bụi mỏng, bán trong suốt)
      const t = (u - 0.05) / 0.2;
      baseAlpha = 0.25 + t * 0.35;
      colorMix = t * 0.4;
    } else if (u < 0.58) {
      // B Ring (Dải B: Vành đai chính dày đặc, sáng rực rỡ nhất)
      const t = (u - 0.25) / 0.33;
      baseAlpha = 0.82 + Math.sin(t * Math.PI) * 0.16;
      colorMix = 0.4 + t * 0.5;
    } else if (u < 0.68) {
      // Cassini Division (Khoảng trống Cassini hẹp, trong suốt tinh tế, KHÔNG đen bệt)
      const distFromCenter = Math.abs(u - 0.63) / 0.05; // 0 at gap center, 1 at edge
      baseAlpha = 0.04 + distFromCenter * 0.2; // Rất trong suốt (alpha ~ 0.04)
      colorMix = 0.3;
    } else if (u < 0.92) {
      // A Ring (Dải A: Sáng vừa, có khe hẹp Encke gap)
      const isEncke = u > 0.82 && u < 0.85;
      if (isEncke) {
        baseAlpha = 0.15;
      } else {
        const t = (u - 0.68) / 0.24;
        baseAlpha = 0.72 - t * 0.25;
      }
      colorMix = 0.6;
    } else {
      // F Ring & Outer Edge (Mép ngoài cùng mờ dần về trong suốt)
      const t = (u - 0.92) / 0.08;
      baseAlpha = Math.max(0, (1.0 - t) * 0.45);
      colorMix = 0.8;
    }

    const finalAlpha = Math.min(255, Math.max(0, Math.floor(baseAlpha * fineBanding * 255)));

    // Interpolate Color
    const r = Math.floor((col1.r * (1 - colorMix) + col2.r * colorMix) * 255);
    const g = Math.floor((col1.g * (1 - colorMix) + col2.g * colorMix) * 255);
    const b = Math.floor((col1.b * (1 - colorMix) + col2.b * colorMix) * 255);

    // Fill all height rows
    for (let y = 0; y < canvas.height; y++) {
      const idx = (y * canvas.width + x) * 4;
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = finalAlpha;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const ringTexture = new THREE.CanvasTexture(canvas);
  ringTexture.wrapS = THREE.ClampToEdgeWrapping;
  ringTexture.wrapT = THREE.RepeatWrapping;
  return ringTexture;
}
