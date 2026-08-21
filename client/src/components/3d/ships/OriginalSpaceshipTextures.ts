import * as THREE from 'three';

export interface OriginalFleetTextureSet {
  hullMap: THREE.CanvasTexture;
  hullBumpMap: THREE.CanvasTexture;
  hullRoughnessMap: THREE.CanvasTexture;
  hullEmissiveMap: THREE.CanvasTexture;
  turbineMap: THREE.CanvasTexture;
  cockpitHudMap: THREE.CanvasTexture;
}

// 1. GENERATE 2D COCKPIT INTERIOR FAKE HUD & DASHBOARD TEXTURE
export function createCockpitInteriorTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Dark cockpit flight deck background
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, size, size);

  // Pilot Seat Silhouette
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(180, 260, 152, 220, 24);
  ctx.fill();
  // Seat Headrest
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.roundRect(206, 170, 100, 70, 16);
  ctx.fill();

  // Primary Flight Display (Artificial Horizon & Telemetry)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(40, 40, 180, 120);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, 180, 120);

  // Artificial Horizon Line
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(60, 100);
  ctx.lineTo(200, 100);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(130, 100, 24, 0, Math.PI * 2);
  ctx.stroke();

  // Holographic Radar Scope (Right Screen)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(size - 220, 40, 180, 120);
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 3;
  ctx.strokeRect(size - 220, 40, 180, 120);

  // Concentric Radar Rings
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 1.5;
  const rcx = size - 130;
  const rcy = 100;
  ctx.beginPath();
  ctx.arc(rcx, rcy, 18, 0, Math.PI * 2);
  ctx.arc(rcx, rcy, 36, 0, Math.PI * 2);
  ctx.arc(rcx, rcy, 52, 0, Math.PI * 2);
  ctx.stroke();

  // Flight Control Stick (Joystick)
  ctx.fillStyle = '#475569';
  ctx.fillRect(cx(size) - 8, 380, 16, 80);
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(cx(size), 370, 14, 0, Math.PI * 2);
  ctx.fill();

  function cx(s: number) { return s / 2; }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 2. GENERATE BRIGHTLY ILLUMINATED 24-BLADE TURBINE COMPRESSOR FAN TEXTURE
export function createTurbineIntakeTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const cx = size / 2;
  const cy = size / 2;
  const outerRadius = size / 2 - 12;

  // Background glowing chamber
  const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, outerRadius);
  bgGrad.addColorStop(0, '#0284c7');
  bgGrad.addColorStop(0.5, '#0f172a');
  bgGrad.addColorStop(1, '#38bdf8');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // Outer glowing LED ring
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(cx, cy, outerRadius - 6, 0, Math.PI * 2);
  ctx.stroke();

  // 24 Titanium Compressor Blades
  const bladeCount = 24;
  for (let i = 0; i < bladeCount; i++) {
    const angle = (i / bladeCount) * Math.PI * 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    // Blade body
    ctx.beginPath();
    ctx.moveTo(32, -6);
    ctx.lineTo(outerRadius - 8, -16);
    ctx.lineTo(outerRadius - 8, 16);
    ctx.lineTo(32, 6);
    ctx.closePath();
    ctx.fillStyle = '#334155';
    ctx.fill();

    // Polished white metallic leading edge
    ctx.beginPath();
    ctx.moveTo(32, -6);
    ctx.lineTo(outerRadius - 8, -16);
    ctx.lineTo(outerRadius - 8, -10);
    ctx.lineTo(32, -1);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Cyan edge outline
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  // Central Nose Cone Spinner
  const spinnerGrad = ctx.createRadialGradient(cx - 8, cy - 8, 4, cx, cy, 42);
  spinnerGrad.addColorStop(0, '#ffffff');
  spinnerGrad.addColorStop(0.35, '#cbd5e1');
  spinnerGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = spinnerGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 38, 0, Math.PI * 2);
  ctx.fill();

  // Spiral line on spinner
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  for (let a = 0; a < Math.PI * 4; a += 0.1) {
    const r = (a / (Math.PI * 4)) * 32;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (a === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  return new THREE.CanvasTexture(canvas);
}

// 3. GENERATE 2048x2048 HYPER-GREEBLE PBR TEXTURES
export function createOriginalHullTextures(): OriginalFleetTextureSet {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size; bumpCanvas.height = size;
  const bumpCtx = bumpCanvas.getContext('2d')!;

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size; roughCanvas.height = size;
  const roughCtx = roughCanvas.getContext('2d')!;

  const emCanvas = document.createElement('canvas');
  emCanvas.width = size; emCanvas.height = size;
  const emCtx = emCanvas.getContext('2d')!;

  // 1. Base Albedo: Clean White Composite Plating
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, size, size);

  bumpCtx.fillStyle = '#808080';
  bumpCtx.fillRect(0, 0, size, size);

  roughCtx.fillStyle = '#404040';
  roughCtx.fillRect(0, 0, size, size);

  emCtx.fillStyle = '#000000';
  emCtx.fillRect(0, 0, size, size);

  // Carbon Weave Underbelly
  const ws = 8;
  for (let py = size * 0.68; py < size; py += ws) {
    for (let px = 0; px < size; px += ws) {
      const isEven = (Math.floor(px / ws) + Math.floor(py / ws)) % 2 === 0;
      ctx.fillStyle = isEven ? '#1e293b' : '#0f172a';
      ctx.fillRect(px, py, ws, ws);
    }
  }

  // Safety Hazard & Accent Stripes
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(60, 100, size - 120, 36);
  ctx.fillRect(120, 220, 300, 28);
  ctx.fillRect(size - 420, 220, 300, 28);

  // Hard-Surface Armor Panels Grid & Rivets
  const cols = 8;
  const rows = 8;
  const cellW = size / cols;
  const cellH = size / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cellW + 6;
      const y = r * cellH + 6;
      const w = cellW - 12;
      const h = cellH - 12;

      // Deep groove in bump map
      bumpCtx.strokeStyle = '#000000';
      bumpCtx.lineWidth = 4;
      bumpCtx.strokeRect(x, y, w, h);

      // Subtle panel seam in diffuse
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, w, h);

      // 4 Rivets at corners
      [
        [x + 8, y + 8],
        [x + w - 8, y + 8],
        [x + 8, y + h - 8],
        [x + w - 8, y + h - 8],
      ].forEach(([rx, ry]) => {
        bumpCtx.fillStyle = '#000000';
        bumpCtx.beginPath();
        bumpCtx.arc(rx, ry, 4, 0, Math.PI * 2);
        bumpCtx.fill();

        bumpCtx.fillStyle = '#ffffff';
        bumpCtx.beginPath();
        bumpCtx.arc(rx, ry, 2.5, 0, Math.PI * 2);
        bumpCtx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(rx, ry, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  // Glowing Cyan & Amber Telemetry Conduits
  emCtx.strokeStyle = '#38bdf8';
  emCtx.lineWidth = 5;
  emCtx.beginPath();
  emCtx.moveTo(80, 360);
  emCtx.lineTo(420, 360);
  emCtx.lineTo(420, 480);
  emCtx.moveTo(size - 80, 360);
  emCtx.lineTo(size - 420, 360);
  emCtx.lineTo(size - 420, 480);
  emCtx.stroke();

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(80, 360);
  ctx.lineTo(420, 360);
  ctx.lineTo(420, 480);
  ctx.moveTo(size - 80, 360);
  ctx.lineTo(size - 420, 360);
  ctx.lineTo(size - 420, 480);
  ctx.stroke();

  // Technical Typography
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px monospace';
  ctx.fillText('NOVA AEROSPACE // QUANTUM EXPLORER', 100, 180);
  ctx.fillText('SCIENTIFIC SENSOR MATRIX ACTIVE', 100, 440);

  const hullMap = new THREE.CanvasTexture(canvas);
  const hullBumpMap = new THREE.CanvasTexture(bumpCanvas);
  const hullRoughnessMap = new THREE.CanvasTexture(roughCanvas);
  const hullEmissiveMap = new THREE.CanvasTexture(emCanvas);
  const turbineMap = createTurbineIntakeTexture();
  const cockpitHudMap = createCockpitInteriorTexture();

  return {
    hullMap,
    hullBumpMap,
    hullRoughnessMap,
    hullEmissiveMap,
    turbineMap,
    cockpitHudMap,
  };
}
