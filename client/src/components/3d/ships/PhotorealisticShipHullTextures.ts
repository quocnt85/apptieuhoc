import * as THREE from 'three';

export interface ShipPBRTextureSet {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  emissiveMap: THREE.CanvasTexture;
}

// Draw a carbon fiber weave pattern onto canvas context
function drawCarbonWeave(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, size: number = 8) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  for (let py = y; py < y + h; py += size) {
    for (let px = x; px < x + w; px += size) {
      const isEven = (Math.floor(px / size) + Math.floor(py / size)) % 2 === 0;
      ctx.fillStyle = isEven ? '#1e293b' : '#0f172a';
      ctx.fillRect(px, py, size, size);
      // Subtle gradient highlight inside weave
      ctx.fillStyle = isEven ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.15)';
      ctx.fillRect(px, py, size, size / 2);
    }
  }
  ctx.restore();
}

// Draw mechanical hex rivets along a line
function drawRivetsAlongLine(
  ctx: CanvasRenderingContext2D,
  bumpCtx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  spacing: number = 24
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const count = Math.floor(dist / spacing);

  for (let i = 0; i <= count; i++) {
    const t = count === 0 ? 0.5 : i / count;
    const px = x1 + dx * t;
    const py = y1 + dy * t;

    // Diffuse rivet (Dark ring + metallic center)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(px, py, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(px, py, 2, 0, Math.PI * 2);
    ctx.fill();

    // Bump rivet (High white dot in dark ring for 3D depth)
    bumpCtx.fillStyle = '#000000';
    bumpCtx.beginPath();
    bumpCtx.arc(px, py, 4, 0, Math.PI * 2);
    bumpCtx.fill();

    bumpCtx.fillStyle = '#ffffff';
    bumpCtx.beginPath();
    bumpCtx.arc(px, py, 2.5, 0, Math.PI * 2);
    bumpCtx.fill();
  }
}

// Draw hazard diagonal warning stripes
function drawHazardStripes(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  ctx.fillStyle = '#f59e0b'; // Hazard yellow
  ctx.fillRect(x, y, w, h);

  ctx.fillStyle = '#0f172a'; // Black stripe
  const stripeWidth = 16;
  for (let offset = -h; offset < w + h; offset += stripeWidth * 2) {
    ctx.beginPath();
    ctx.moveTo(x + offset, y);
    ctx.lineTo(x + offset + stripeWidth, y);
    ctx.lineTo(x + offset + stripeWidth - h, y + h);
    ctx.lineTo(x + offset - h, y + h);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

// =========================================================================
// 1. NASA / ARTEMIS SCI-FI EXPLORER PBR TEXTURES (Nova Falcon V1)
// =========================================================================
export function createNASAExplorerPBR(shipColor: string = '#ffffff'): ShipPBRTextureSet {
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

  // 1. Base Albedo: Clean White Composite Hull with Subtle Color Tint
  ctx.fillStyle = shipColor || '#f8fafc';
  ctx.fillRect(0, 0, size, size);

  bumpCtx.fillStyle = '#808080';
  bumpCtx.fillRect(0, 0, size, size);

  roughCtx.fillStyle = '#404040'; // Semi-gloss composite
  roughCtx.fillRect(0, 0, size, size);

  emCtx.fillStyle = '#000000';
  emCtx.fillRect(0, 0, size, size);

  // Carbon Fiber Control Panels on lower section
  drawCarbonWeave(ctx, 0, size * 0.7, size, size * 0.3, 10);
  roughCtx.fillStyle = '#909090'; // Matte carbon
  roughCtx.fillRect(0, size * 0.7, size, size * 0.3);

  // International Orange Safety Accent Belts
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(size * 0.1, size * 0.15, size * 0.8, 36);
  ctx.fillRect(size * 0.1, size * 0.55, size * 0.8, 24);

  // Thermal Ceramic Heat Tiles Grid on Upper Section
  const tileSize = 32;
  for (let ty = 0; ty < size * 0.5; ty += tileSize) {
    for (let tx = 0; tx < size; tx += tileSize) {
      // Tile Seams in Bump Map
      bumpCtx.strokeStyle = '#202020';
      bumpCtx.lineWidth = 1.5;
      bumpCtx.strokeRect(tx + 1, ty + 1, tileSize - 2, tileSize - 2);

      // Diffuse subtle tile border
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)';
      ctx.lineWidth = 1;
      ctx.strokeRect(tx + 1, ty + 1, tileSize - 2, tileSize - 2);
    }
  }

  // Major Armor Panel Seams & Rivets
  const panels = [
    { x1: 50, y1: 200, x2: 974, y2: 200 },
    { x1: 50, y1: 450, x2: 974, y2: 450 },
    { x1: 50, y1: 700, x2: 974, y2: 700 },
    { x1: 300, y1: 50, x2: 300, y2: 950 },
    { x1: 724, y1: 50, x2: 724, y2: 950 },
  ];

  panels.forEach((p) => {
    // Deep groove in bump map
    bumpCtx.strokeStyle = '#000000';
    bumpCtx.lineWidth = 4;
    bumpCtx.beginPath();
    bumpCtx.moveTo(p.x1, p.y1);
    bumpCtx.lineTo(p.x2, p.y2);
    bumpCtx.stroke();

    // Subtle dark seam in diffuse
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p.x1, p.y1);
    ctx.lineTo(p.x2, p.y2);
    ctx.stroke();

    // Fastener rivets
    drawRivetsAlongLine(ctx, bumpCtx, p.x1, p.y1, p.x2, p.y2, 28);
  });

  // Stencils & Technical Markings
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('NOVA SURVEY CORP • ARTEMIS V1', 80, 240);
  ctx.fillText('RCS THRUSTER VENT 01 [PASSENGER SAFE]', 80, 490);

  ctx.fillStyle = '#ea580c';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('▲ CAUTION: SCIENTIFIC RADAR ARRAY ▲', 520, 240);

  // Glowing Cyan Status LED inlays
  emCtx.fillStyle = '#38bdf8';
  emCtx.fillRect(100, 100, 180, 8);
  emCtx.fillRect(744, 100, 180, 8);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(100, 100, 180, 8);
  ctx.fillRect(744, 100, 180, 8);

  const map = new THREE.CanvasTexture(canvas);
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  const emissiveMap = new THREE.CanvasTexture(emCanvas);

  return { map, bumpMap, roughnessMap, emissiveMap };
}

// =========================================================================
// 2. CYBERPUNK / SYNTHWAVE NEON PBR TEXTURES (Apex Phantom X)
// =========================================================================
export function createCyberpunkPBR(shipColor: string = '#090d16'): ShipPBRTextureSet {
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

  // 1. Dark Obsidian / Carbon Base
  ctx.fillStyle = shipColor || '#090d16';
  ctx.fillRect(0, 0, size, size);

  bumpCtx.fillStyle = '#808080';
  bumpCtx.fillRect(0, 0, size, size);

  roughCtx.fillStyle = '#202020'; // Glossy stealth finish
  roughCtx.fillRect(0, 0, size, size);

  emCtx.fillStyle = '#000000';
  emCtx.fillRect(0, 0, size, size);

  // Carbon weave texture
  drawCarbonWeave(ctx, 0, 0, size, size, 12);

  // Hexagonal Digital Matrix Grid
  const hexRadius = 24;
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
  ctx.lineWidth = 1.5;
  for (let hy = 50; hy < size - 50; hy += hexRadius * 1.7) {
    for (let hx = 50; hx < size - 50; hx += hexRadius * 3) {
      ctx.beginPath();
      for (let a = 0; a < 6; a++) {
        const angle = (a * Math.PI) / 3;
        const x = hx + hexRadius * Math.cos(angle);
        const y = hy + hexRadius * Math.sin(angle);
        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }

  // Glowing Cyan & Magenta Circuit Conduits
  const circuits = [
    { x1: 80, y1: 180, x2: 450, y2: 180, x3: 450, y3: 420, color: '#06b6d4' },
    { x1: 944, y1: 180, x2: 574, y2: 180, x3: 574, y3: 420, color: '#06b6d4' },
    { x1: 120, y1: 650, x2: 500, y2: 650, x3: 500, y3: 880, color: '#ec4899' },
    { x1: 904, y1: 650, x2: 524, y2: 650, x3: 524, y3: 880, color: '#ec4899' },
  ];

  circuits.forEach((c) => {
    // Emissive Glow Line
    emCtx.strokeStyle = c.color;
    emCtx.lineWidth = 6;
    emCtx.beginPath();
    emCtx.moveTo(c.x1, c.y1);
    emCtx.lineTo(c.x2, c.y2);
    emCtx.lineTo(c.x3, c.y3);
    emCtx.stroke();

    // White Core
    emCtx.strokeStyle = '#ffffff';
    emCtx.lineWidth = 2;
    emCtx.stroke();

    // Diffuse Line
    ctx.strokeStyle = c.color;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(c.x1, c.y1);
    ctx.lineTo(c.x2, c.y2);
    ctx.lineTo(c.x3, c.y3);
    ctx.stroke();

    // Bump Trench
    bumpCtx.strokeStyle = '#101010';
    bumpCtx.lineWidth = 8;
    bumpCtx.beginPath();
    bumpCtx.moveTo(c.x1, c.y1);
    bumpCtx.lineTo(c.x2, c.y2);
    bumpCtx.lineTo(c.x3, c.y3);
    bumpCtx.stroke();
  });

  // Stencils & Cyber Typography
  ctx.fillStyle = '#06b6d4';
  ctx.font = 'bold 20px monospace';
  ctx.fillText('⚡ QUANTUM LIDAR MATRIX • ACTIVE', 100, 240);
  ctx.fillText('NOVA PHANTOM-X // CYBERNETICS', 100, 720);

  const map = new THREE.CanvasTexture(canvas);
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  const emissiveMap = new THREE.CanvasTexture(emCanvas);

  return { map, bumpMap, roughnessMap, emissiveMap };
}

// =========================================================================
// 3. SOLARPUNK / BIO-ORGANIC CRYSTAL PBR TEXTURES (Solar Phoenix S)
// =========================================================================
export function createSolarpunkPBR(shipColor: string = '#ffffff'): ShipPBRTextureSet {
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

  // 1. Pearl White & Gold Filigree Base
  ctx.fillStyle = shipColor || '#ffffff';
  ctx.fillRect(0, 0, size, size);

  bumpCtx.fillStyle = '#808080';
  bumpCtx.fillRect(0, 0, size, size);

  roughCtx.fillStyle = '#151515'; // Ultra smooth pearl
  roughCtx.fillRect(0, 0, size, size);

  emCtx.fillStyle = '#000000';
  emCtx.fillRect(0, 0, size, size);

  // Gold Organic Wave Filigree
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 4;
  for (let y = 100; y < size; y += 180) {
    ctx.beginPath();
    ctx.moveTo(50, y);
    ctx.bezierCurveTo(300, y - 80, 700, y + 80, 974, y);
    ctx.stroke();

    bumpCtx.strokeStyle = '#ffffff';
    bumpCtx.lineWidth = 4;
    bumpCtx.beginPath();
    bumpCtx.moveTo(50, y);
    bumpCtx.bezierCurveTo(300, y - 80, 700, y + 80, 974, y);
    bumpCtx.stroke();
  }

  // Emerald Solar Cells Grid
  const cellW = 40, cellH = 30;
  for (let cy = 300; cy < 700; cy += cellH + 6) {
    for (let cx = 80; cx < size - 80; cx += cellW + 6) {
      ctx.fillStyle = '#10b981';
      ctx.fillRect(cx, cy, cellW, cellH);

      // Gold grid border
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cx, cy, cellW, cellH);

      // Glowing solar absorption in emissive
      emCtx.fillStyle = 'rgba(16, 185, 129, 0.6)';
      emCtx.fillRect(cx + 2, cy + 2, cellW - 4, cellH - 4);
    }
  }

  const map = new THREE.CanvasTexture(canvas);
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  const emissiveMap = new THREE.CanvasTexture(emCanvas);

  return { map, bumpMap, roughnessMap, emissiveMap };
}

// =========================================================================
// 4. HEAVY INDUSTRIAL SURVEY PBR TEXTURES (Hyperion D-5)
// =========================================================================
export function createIndustrialPBR(shipColor: string = '#334155'): ShipPBRTextureSet {
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

  // 1. Weathered Gunmetal Steel Base
  ctx.fillStyle = shipColor || '#334155';
  ctx.fillRect(0, 0, size, size);

  bumpCtx.fillStyle = '#808080';
  bumpCtx.fillRect(0, 0, size, size);

  roughCtx.fillStyle = '#555555'; // Rough industrial steel
  roughCtx.fillRect(0, 0, size, size);

  emCtx.fillStyle = '#000000';
  emCtx.fillRect(0, 0, size, size);

  // Heavy Duty Hazard Stripes on Top & Bottom Belts
  drawHazardStripes(ctx, 40, 80, size - 80, 48);
  drawHazardStripes(ctx, 40, size - 140, size - 80, 48);

  // Heavy Armor Plates Grid & Massive Hex Bolts
  for (let py = 180; py < size - 180; py += 160) {
    for (let px = 80; px < size - 80; px += 280) {
      // Plate Border in Bump & Diffuse
      bumpCtx.strokeStyle = '#000000';
      bumpCtx.lineWidth = 5;
      bumpCtx.strokeRect(px, py, 260, 140);

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 3;
      ctx.strokeRect(px, py, 260, 140);

      // Heavy bolts at 4 corners
      [
        [px + 12, py + 12],
        [px + 248, py + 12],
        [px + 12, py + 128],
        [px + 248, py + 128],
      ].forEach(([bx, by]) => {
        drawRivetsAlongLine(ctx, bumpCtx, bx, by, bx, by, 10);
      });
    }
  }

  // Industrial Stencils
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 24px monospace';
  ctx.fillText('HEAVY SURVEY D-5 // GEOLOGY DEPT', 100, 260);
  ctx.fillText('MINERAL CORE SAMPLER BAY', 100, 580);

  const map = new THREE.CanvasTexture(canvas);
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  const emissiveMap = new THREE.CanvasTexture(emCanvas);

  return { map, bumpMap, roughnessMap, emissiveMap };
}

// =========================================================================
// 5. CLEAN ANIME MECHA / GUNDAM PBR TEXTURES (Astral Shuttle Orbiter)
// =========================================================================
export function createGundamMechaPBR(shipColor: string = '#ffffff'): ShipPBRTextureSet {
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

  // 1. Pure Mecha White Base
  ctx.fillStyle = shipColor || '#ffffff';
  ctx.fillRect(0, 0, size, size);

  bumpCtx.fillStyle = '#808080';
  bumpCtx.fillRect(0, 0, size, size);

  roughCtx.fillStyle = '#303030'; // Satin mecha plastic/metal
  roughCtx.fillRect(0, 0, size, size);

  emCtx.fillStyle = '#000000';
  emCtx.fillRect(0, 0, size, size);

  // Cobalt Blue & Crimson Red Block Panels
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(80, 100, size - 160, 120);

  ctx.fillStyle = '#dc2626';
  ctx.fillRect(120, 240, 180, 40);
  ctx.fillRect(724, 240, 180, 40);

  // Crisp Anime Panel Lines (0.5px sharp black lines)
  const mechaLines = [
    { x1: 80, y1: 340, x2: 944, y2: 340 },
    { x1: 80, y1: 580, x2: 944, y2: 580 },
    { x1: 80, y1: 760, x2: 944, y2: 760 },
    { x1: 340, y1: 100, x2: 340, y2: 920 },
    { x1: 684, y1: 100, x2: 684, y2: 920 },
  ];

  mechaLines.forEach((l) => {
    bumpCtx.strokeStyle = '#000000';
    bumpCtx.lineWidth = 3;
    bumpCtx.beginPath();
    bumpCtx.moveTo(l.x1, l.y1);
    bumpCtx.lineTo(l.x2, l.y2);
    bumpCtx.stroke();

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(l.x1, l.y1);
    ctx.lineTo(l.x2, l.y2);
    ctx.stroke();
  });

  // Mecha Warning Red Triangles & Stencils
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('▲ CAUTION: THRUSTER NACELLES', 100, 390);
  ctx.fillText('NOVA-01 MECHA SURVEY CORPS', 100, 630);

  // Glowing Intake Fan Ring Indicator in Emissive
  emCtx.fillStyle = '#38bdf8';
  emCtx.fillRect(100, 800, 200, 12);
  emCtx.fillRect(724, 800, 200, 12);

  const map = new THREE.CanvasTexture(canvas);
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  const emissiveMap = new THREE.CanvasTexture(emCanvas);

  return { map, bumpMap, roughnessMap, emissiveMap };
}
