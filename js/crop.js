const cropcanvas = document.getElementById("cropcanvas");
const ctx = cropcanvas.getContext("2d");
const cropBtn = document.getElementById("cropBtn");
const cropQuit = document.getElementById("cropQuit");
const croppedCanvas = document.getElementById("croppedCanvas");
const croppedCtx = croppedCanvas.getContext("2d");
const aspectRatioSelect = document.getElementById("aspectRatioSelect");
const aspectRatioInputs = document.querySelectorAll('input[name="aspectRatio"]');

let cropImg = new Image();
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let position = { x: 0, y: 0 };
let offset = { x: 0, y: 0 };
let scale = 1;
let aspect_Ratio = 1;

const MIN_SCALE = 0.1;
const MAX_SCALE = 5;

cropImg.onload = () => {
  scale = 1;
  position = {
    x: (cropcanvas.width - cropImg.width) / 2,
    y: (cropcanvas.height - cropImg.height) / 2,
  };
  draw();
};

aspectRatioInputs.forEach((input) => {
  input.addEventListener("change", () => {
    if (input.checked) {
      aspect_Ratio = eval(input.value);
      draw();
    }
  });
});

cropcanvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  const rect = cropcanvas.getBoundingClientRect();
  const scaleX = cropcanvas.width / rect.width;
  const scaleY = cropcanvas.height / rect.height;
  const x = e.offsetX * scaleX;
  const y = e.offsetY * scaleY;
  // offset = { ...position };
  dragStart = { x, y };
});

cropcanvas.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const rect = cropcanvas.getBoundingClientRect();
  const scaleX = cropcanvas.width / rect.width;
  const scaleY = cropcanvas.height / rect.height;
  const dx = e.offsetX * scaleX;
  const dy = e.offsetY * scaleY;
  position.x += dx - dragStart.x;
  position.y += dy - dragStart.y;
  dragStart = { x: dx, y: dy };
  draw();
});

cropcanvas.addEventListener("mouseup", () => (isDragging = false));
cropcanvas.addEventListener("mouseleave", () => (isDragging = false));

cropcanvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  const zoomFactor = 0.1;
  const delta = Math.sign(e.deltaY);
  const newScale = scale * (1 - delta * zoomFactor);
  if (newScale < MIN_SCALE || newScale > MAX_SCALE) return;

  const rect = cropcanvas.getBoundingClientRect();
  const scaleX = cropcanvas.width / rect.width;
  const scaleY = cropcanvas.height / rect.height;

  const offsetX = e.offsetX * scaleX - position.x;
  const offsetY = e.offsetY * scaleY - position.y;

  const newOffsetX = offsetX * (newScale / scale);
  const newOffsetY = offsetY * (newScale / scale);

  position.x -= newOffsetX - offsetX;
  position.y -= newOffsetY - offsetY;
  scale = newScale;
  draw();
});

function getCropRect() {
  // Dynamisch berechnetes Zuschneidefeld mit gewähltem Seitenverhältnis
  const maxW = cropcanvas.width * 0.8;
  const maxH = cropcanvas.height * 0.8;

  let w = maxW;
  let h = w / aspect_Ratio;

  if (h > maxH) {
    h = maxH;
    w = h * aspect_Ratio;
  }

  const x = (cropcanvas.width - w) / 2;
  const y = (cropcanvas.height - h) / 2;

  return { x, y, w, h };
}

function draw() {
  ctx.clearRect(0, 0, cropcanvas.width, cropcanvas.height);

  ctx.drawImage(cropImg, position.x, position.y, cropImg.width * scale, cropImg.height * scale);

  const crop = getCropRect();
  // 3. Dunkle Maske über das Bild mit „Loch“ im Crop-Bereich
  drawMaskedCropOverlay(ctx, crop, cropcanvas.width, cropcanvas.height);

  // 4. Weißer, abgerundeter, gepunkteter Rahmen
  drawRoundedDottedCropRect(ctx, crop, 30);

  // 5. Dotted 3×3 Raster innerhalb des Crop-Bereichs
  drawCropGrid(ctx, crop);
}

cropBtn.addEventListener("click", () => {
  const crop = getCropRect();
  const sx = (crop.x - position.x) / scale;
  const sy = (crop.y - position.y) / scale;
  const sw = crop.w / scale;
  const sh = crop.h / scale;

  croppedCanvas.width = crop.w;
  croppedCanvas.height = crop.h;
  croppedCtx.clearRect(0, 0, crop.w, crop.h);
  croppedCtx.drawImage(cropImg, sx, sy, sw, sh, 0, 0, crop.w, crop.h);
  cropOrg.src = croppedCanvas.toDataURL("image/webp");
  document.getElementById("crop-container").classList.add("none");
});
cropQuit.addEventListener("click", () => {
  document.getElementById("crop-container").classList.add("none");
});

function drawCropGrid(ctx, crop) {
  const rows = 3;
  const cols = 3;
  const cellWidth = crop.w / cols;
  const cellHeight = crop.h / rows;

  ctx.save();
  ctx.beginPath();
  ctx.setLineDash([20, 20]);
  ctx.strokeStyle = "rgba(208, 208, 208, 0.7)";
  ctx.lineWidth = 2;

  // Vertikale Linien
  for (let i = 1; i < cols; i++) {
    const x = crop.x + i * cellWidth;
    ctx.moveTo(x, crop.y);
    ctx.lineTo(x, crop.y + crop.h);
  }

  // Horizontale Linien
  for (let j = 1; j < rows; j++) {
    const y = crop.y + j * cellHeight;
    ctx.moveTo(crop.x, y);
    ctx.lineTo(crop.x + crop.w, y);
  }

  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}
function drawRoundedDottedCropRect(ctx, crop, radius = 40) {
  ctx.save();
  ctx.beginPath();
  ctx.setLineDash([20, 20]);
  ctx.lineCap = "round";
  ctx.strokeStyle = "white";
  ctx.lineWidth = 8;

  drawRoundedRect(ctx, crop.x, crop.y, crop.w, crop.h, radius);
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.restore();
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  // ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
function drawMaskedCropOverlay(ctx, crop, canvasWidth, canvasHeight) {
  // Schritt 1: Überlagerung über das ganze Bild legen
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.beginPath();
  ctx.rect(0, 0, canvasWidth, canvasHeight);

  // Schritt 2: Crop-Bereich "freischneiden"
  // ctx.globalCompositeOperation = "destination-out";
  // ctx.beginPath();
  drawRoundedRect(ctx, crop.x, crop.y, crop.w, crop.h, 50); // abgerundeter Ausschnitt
  ctx.fill("evenodd");

  // Zurücksetzen
  // ctx.globalCompositeOperation = "source-over";
  ctx.restore();
}

function drawOverlayOutsideCrop(ctx, crop, canvasWidth, canvasHeight) {
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // halbtransparentes Schwarz

  // Schritt 1: Fläche komplett abdunkeln
  // ctx.beginPath();
  // ctx.rect(0, 0, canvasWidth, canvasHeight);
  // ctx.fill();
  ctx.beginPath();
  // Schritt 2: Crop-Bereich ausschneiden
  drawRoundedRect(ctx, crop.x, crop.y, crop.w, crop.h, 12); // derselbe wie beim Rahmen
  ctx.clip("evenodd"); // nur außerhalb sichtbar machen
  // ctx.globalCompositeOperation = "destination-out";

  ctx.fill(); // Überlagerung anwenden
  ctx.restore();
}
