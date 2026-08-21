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
// Realistic Photorealistic Cloud Turbulence Texture
// ==========================================
export function createRealisticAtmosphericClouds(width: number = 1024, height: number = 512): THREE.CanvasTexture {
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

      // Cloud swirl turbulence
      const cloudDensity = fbm(nx * 2.8, ny * 2.8 + simplex3(nx * 2, ny * 2, nz * 2) * 0.4, nz * 2.8, 5, 0.55, 2.1);
      const threshold = 0.52;

      let alpha = 0;
      if (cloudDensity > threshold) {
        alpha = Math.floor(Math.pow((cloudDensity - threshold) / (1.0 - threshold), 1.3) * 230);
      }

      const idx = (y * width + x) * 4;
      data[idx] = 255;
      data[idx + 1] = 255;
      data[idx + 2] = 255;
      data[idx + 3] = Math.min(255, alpha);
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}
