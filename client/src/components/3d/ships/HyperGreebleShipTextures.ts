import * as THREE from 'three';

export interface HyperGreebleTextureSet {
  hullMap: THREE.CanvasTexture;
  hullBumpMap: THREE.CanvasTexture;
  hullRoughnessMap: THREE.CanvasTexture;
  hullEmissiveMap: THREE.CanvasTexture;
  turbineMap: THREE.CanvasTexture;
}

// 1. GENERATE BRIGHTLY ILLUMINATED 24-BLADE TURBINE COMPRESSOR FAN TEXTURE
export function createTurbineIntakeTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const cx = size / 2;
  const cy = size / 2;
  const outerRadius = size / 2 - 12;

  // Background deep chamber with cyan illumination
  const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, outerRadius);
  bgGrad.addColorStop(0, '#0369a1'); // Glowing cyan center
  bgGrad.addColorStop(0.6, '#0f172a'); // Dark titanium mid
  bgGrad.addColorStop(1, '#0284c7'); // Bright glowing rim
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // Outer glowing ring
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(cx, cy, outerRadius - 6, 0, Math.PI * 2);
  ctx.stroke();

  // 24 Titanium Compressor Blades with High-Visibility Highlights
  const bladeCount = 24;
  for (let i = 0; i < bladeCount; i++) {
    const angle = (i / bladeCount) * Math.PI * 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    // Blade shadow/body
    ctx.beginPath();
    ctx.moveTo(35, -8);
    ctx.lineTo(outerRadius - 10, -18);
    ctx.lineTo(outerRadius - 10, 18);
    ctx.lineTo(35, 8);
    ctx.closePath();
    ctx.fillStyle = '#475569';
    ctx.fill();

    // Blade bright polished metallic leading edge (Siêu sáng)
    ctx.beginPath();
    ctx.moveTo(35, -8);
    ctx.lineTo(outerRadius - 10, -18);
    ctx.lineTo(outerRadius - 10, -12);
    ctx.lineTo(35, -2);
    ctx.closePath();
    ctx.fillStyle = '#f8fafc'; // Pure white metallic reflection
    ctx.fill();

    // Blade cyan energetic highlight
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  // Central Nose Cone Spinner (Nón Xoay Trung Tâm)
  const spinnerGrad = ctx.createRadialGradient(cx - 10, cy - 10, 5, cx, cy, 45);
  spinnerGrad.addColorStop(0, '#ffffff');
  spinnerGrad.addColorStop(0.4, '#cbd5e1');
  spinnerGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = spinnerGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 42, 0, Math.PI * 2);
  ctx.fill();

  // Spiral vortex curve on spinner
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (let a = 0; a < Math.PI * 4; a += 0.1) {
    const r = (a / (Math.PI * 4)) * 36;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (a === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 2. GENERATE 2048x2048 HYPER-GREEBLE HULL PBR TEXTURES (Rãnh giáp, Đinh tán, Vi mạch, Carbon)
export function createHyperGreebleHullTextures(): HyperGreebleTextureSet {
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

  // 1. Base Albedo: Clean White Composite Hull
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, size, size);

  bumpCtx.fillStyle = '#808080';
  bumpCtx.fillRect(0, 0, size, size);

  roughCtx.fillStyle = '#454545';
  roughCtx.fillRect(0, 0, size, size);

  emCtx.fillStyle = '#000000';
  emCtx.fillRect(0, 0, size, size);

  // Carbon Fiber Weave on lower section
  const weaveSize = 8;
  for (let py = size * 0.65; py < size; py += weaveSize) {
    for (let px = 0; px < size; px += weaveSize) {
      const isEven = (Math.floor(px / weaveSize) + Math.floor(py / weaveSize)) % 2 === 0;
      ctx.fillStyle = isEven ? '#1e293b' : '#0f172a';
      ctx.fillRect(px, py, weaveSize, weaveSize);
    }
  }

  // Red Rebel Alliance Chevron Wing Ident Stripes
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(80, 120, size - 160, 48);
  ctx.fillRect(140, 240, 260, 36);
  ctx.fillRect(size - 400, 240, 260, 36);

  // International Orange Safety Accent Stripes
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(80, 520, size - 160, 24);

  // Dense Hard-Surface Armor Plating Grid & Rivets
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

      // Subtle seam line in diffuse
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, w, h);

      // 4 Hex Rivets at 4 corners
      [
        [x + 10, y + 10],
        [x + w - 10, y + 10],
        [x + 10, y + h - 10],
        [x + w - 10, y + h - 10],
      ].forEach(([rx, ry]) => {
        // Bump rivet (White dot in dark hole)
        bumpCtx.fillStyle = '#000000';
        bumpCtx.beginPath();
        bumpCtx.arc(rx, ry, 5, 0, Math.PI * 2);
        bumpCtx.fill();

        bumpCtx.fillStyle = '#ffffff';
        bumpCtx.beginPath();
        bumpCtx.arc(rx, ry, 3, 0, Math.PI * 2);
        bumpCtx.fill();

        // Diffuse rivet
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(rx, ry, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(rx, ry, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  // Glowing Cyan LED Avionics Traces & Stencils
  emCtx.strokeStyle = '#38bdf8';
  emCtx.lineWidth = 5;
  emCtx.beginPath();
  emCtx.moveTo(100, 400);
  emCtx.lineTo(400, 400);
  emCtx.lineTo(400, 500);
  emCtx.moveTo(size - 100, 400);
  emCtx.lineTo(size - 400, 400);
  emCtx.lineTo(size - 400, 500);
  emCtx.stroke();

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(100, 400);
  ctx.lineTo(400, 400);
  ctx.lineTo(400, 500);
  ctx.moveTo(size - 100, 400);
  ctx.lineTo(size - 400, 400);
  ctx.lineTo(size - 400, 500);
  ctx.stroke();

  // Technical Typography Stencils
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px monospace';
  ctx.fillText('INCOM T-65B // HYPER-SURVEY CORP', 100, 200);
  ctx.fillText('RCS THRUSTER QUAD [DANGER HIGH TEMP]', 100, 480);
  ctx.fillText('S-FOIL HYDRAULIC ACTUATOR 04', 100, 600);

  const hullMap = new THREE.CanvasTexture(canvas);
  const hullBumpMap = new THREE.CanvasTexture(bumpCanvas);
  const hullRoughnessMap = new THREE.CanvasTexture(roughCanvas);
  const hullEmissiveMap = new THREE.CanvasTexture(emCanvas);
  const turbineMap = createTurbineIntakeTexture();

  return {
    hullMap,
    hullBumpMap,
    hullRoughnessMap,
    hullEmissiveMap,
    turbineMap,
  };
}
