import * as THREE from 'three';
import { CUBE_CATEGORIES } from '../../store/useAppStore';

/**
 * Creates a high-DPI 512x512 canvas texture for a specific cube face
 */
export function createFaceCanvasTexture(index: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const category = CUBE_CATEGORIES[index];
  const accent = category ? category.accentColor : '#4fd8ff';

  // Base background: translucent deep void glass
  ctx.fillStyle = 'rgba(5, 6, 18, 0.72)';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle interior grid
  ctx.strokeStyle = 'rgba(79, 216, 255, 0.08)';
  ctx.lineWidth = 1;
  const step = 32;
  for (let x = step; x < 512; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = step; y < 512; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  // Corner Calipers (Cyberpunk brackets)
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4;
  const pad = 28;
  const bracketLen = 42;

  // Top-Left
  ctx.beginPath();
  ctx.moveTo(pad, pad + bracketLen);
  ctx.lineTo(pad, pad);
  ctx.lineTo(pad + bracketLen, pad);
  ctx.stroke();

  // Top-Right
  ctx.beginPath();
  ctx.moveTo(512 - pad - bracketLen, pad);
  ctx.lineTo(512 - pad, pad);
  ctx.lineTo(512 - pad, pad + bracketLen);
  ctx.stroke();

  // Bottom-Left
  ctx.beginPath();
  ctx.moveTo(pad, 512 - pad - bracketLen);
  ctx.lineTo(pad, 512 - pad);
  ctx.lineTo(pad + bracketLen, 512 - pad);
  ctx.stroke();

  // Bottom-Right
  ctx.beginPath();
  ctx.moveTo(512 - pad - bracketLen, 512 - pad);
  ctx.lineTo(512 - pad, 512 - pad);
  ctx.lineTo(512 - pad, 512 - pad - bracketLen);
  ctx.stroke();

  // Center Holographic Reticle
  ctx.save();
  ctx.strokeStyle = `${accent}60`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(256, 256, 90, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(256, 256, 105, 0, Math.PI * 2);
  ctx.setLineDash([8, 14]);
  ctx.stroke();
  ctx.restore();

  // Crosshairs
  ctx.strokeStyle = `${accent}80`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(256 - 30, 256);
  ctx.lineTo(256 + 30, 256);
  ctx.moveTo(256, 256 - 30);
  ctx.lineTo(256, 256 + 30);
  ctx.stroke();

  // Top Telemetry Header
  ctx.font = '700 16px ui-monospace, monospace';
  ctx.fillStyle = accent;
  ctx.textAlign = 'left';
  ctx.fillText(`SYS.NODE // 0${index + 1}`, pad + 8, pad + 24);

  ctx.font = '600 13px ui-monospace, monospace';
  ctx.fillStyle = '#8ba1c2';
  ctx.textAlign = 'right';
  ctx.fillText(`NK-DEV-HEX::${(index + 1) * 16}`, 512 - pad - 8, pad + 24);

  // Category Title
  ctx.font = '900 32px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.shadowColor = accent;
  ctx.shadowBlur = 12;
  const title = category ? category.name.toUpperCase() : `FACE 0${index + 1}`;
  ctx.fillText(title, 256, 220);
  ctx.shadowBlur = 0;

  // Tagline
  ctx.font = '500 15px sans-serif';
  ctx.fillStyle = '#b8cae4';
  ctx.textAlign = 'center';
  const tagline = category ? category.tagline : 'Nikneuron Cyber Core';
  ctx.fillText(tagline, 256, 252);

  // Status Badge / Action Pill
  ctx.fillStyle = `${accent}25`;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.5;
  const pillW = 200;
  const pillH = 34;
  const pillX = 256 - pillW / 2;
  const pillY = 320;
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, 8);
  ctx.fill();
  ctx.stroke();

  ctx.font = '700 13px ui-monospace, monospace';
  ctx.fillStyle = '#f1f7ff';
  ctx.textAlign = 'center';
  ctx.fillText('PRESS [1-6] OR TAP ↗', 256, pillY + 22);

  // Bottom telemetry footer
  ctx.font = '500 12px ui-monospace, monospace';
  ctx.fillStyle = '#8ba1c2';
  ctx.fillText('NIKNEURON SPACE ENERGY MATRIX // V1.0', 256, 512 - pad - 12);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

