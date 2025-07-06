import { splitQRs } from 'bbqr';
import QRious from 'qrious';

// ===== Auto-play state =====
let qrCache = [];
let currentIndex = 0;
let autoTimer = null;

function cleanBase64(str) {
  return str.trim()
    .replace(/\s+/g, '')              // remove whitespace
    .replace(/-/g, '+')                // URL-safe -> standard
    .replace(/_/g, '/');
}

function isValidPSBT(base64) {
  try {
    const cleaned = cleanBase64(base64);
    const bytes = Uint8Array.from(atob(cleaned), c => c.charCodeAt(0));
    // Check magic bytes "psbt\xff" -> 0x70 0x73 0x62 0x74 0xff
    return bytes[0] === 0x70 && bytes[1] === 0x73 && bytes[2] === 0x62 && bytes[3] === 0x74 && bytes[4] === 0xff;
  } catch {
    return false;
  }
}

// Generate BBQr parts from base64 PSBT
function createBBQrParts(psbtBase64) {
  const cleaned = cleanBase64(psbtBase64);
  const bytes = Uint8Array.from(atob(cleaned), c => c.charCodeAt(0));
  const result = splitQRs(bytes, 'P', {
    maxSplit: 50,
    minSplit: 3,
    maxBytes: 1000
  });
  return result.parts || result;
}

function buildPlayerUI(partsLen) {
  const container = document.getElementById('qr-container');
  container.innerHTML = '';

  // counter
  const counter = document.createElement('div');
  counter.id = 'qr-counter';
  counter.className = 'qr-counter';
  counter.textContent = `Frame 1 / ${partsLen}`;
  container.appendChild(counter);

  // QR frame container
  const frame = document.createElement('div');
  frame.className = 'qr-frame';
  
  // main canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'qr-canvas';
  canvas.width = 250;
  canvas.height = 250;
  frame.appendChild(canvas);
  container.appendChild(frame);

  // back button
  const backBtn = document.createElement('button');
  backBtn.id = 'back-btn';
  backBtn.className = 'back-button';
  backBtn.textContent = '← Back';
  backBtn.addEventListener('click', goBack);
  container.appendChild(backBtn);
}

function showPart(idx) {
  currentIndex = idx;
  const canvas = document.getElementById('qr-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
  img.src = qrCache[idx];

  const counter = document.getElementById('qr-counter');
  if (counter) counter.textContent = `Frame ${idx + 1} / ${qrCache.length}`;
}

function startAutoPlay() {
  if (autoTimer) clearInterval(autoTimer);
  autoTimer = setInterval(() => {
    const next = (currentIndex + 1) % qrCache.length;
    showPart(next);
  }, 800); // 0.8s per frame
}

function goBack() {
  // Stop auto-play
  if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
  
  // Clear input and containers
  document.getElementById('psbt-input').value = '';
  document.getElementById('qr-container').innerHTML = '';
  document.getElementById('status').textContent = '';
  document.getElementById('status').className = 'status';
  
  // Show input section, hide QR section
  document.getElementById('input-section').classList.remove('hidden');
  
  // Reset state
  currentIndex = 0;
  qrCache = [];
}

function displayBBQr(parts) {
  // cache generation
  qrCache = parts.map(part => {
    const temp = document.createElement('canvas');
    new QRious({ element: temp, value: part, size: 250, level: 'M' });
    return temp.toDataURL();
  });

  // Hide input section
  document.getElementById('input-section').classList.add('hidden');
  
  buildPlayerUI(parts.length);
  showPart(0);
  if (parts.length > 1) startAutoPlay();
}

function init() {
  const input = document.getElementById('psbt-input');
  const btn = document.getElementById('generate-btn');
  const status = document.getElementById('status');

  btn.addEventListener('click', () => {
    const data = (input.value || '').trim();
    status.textContent = '';
    status.className = 'status';

    if (!data) {
      status.textContent = 'ERROR: NO PSBT DATA';
      status.className = 'status error';
      return;
    }

    if (!isValidPSBT(data)) {
      status.textContent = 'ERROR: INVALID PSBT FORMAT';
      status.className = 'status error';
      return;
    }

    const parts = createBBQrParts(data);
    if (!parts || !parts.length) {
      status.textContent = 'ERROR: BBQr GENERATION FAILED';
      status.className = 'status error';
      return;
    }

    status.textContent = `SUCCESS: ${parts.length} BBQr FRAMES READY`;
    status.className = 'status success';
    displayBBQr(parts);
  });
}

document.addEventListener('DOMContentLoaded', init); 