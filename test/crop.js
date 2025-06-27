const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const fileInput = document.getElementById("fileInput");
const cropBtn = document.getElementById("cropBtn");
const croppedCanvas = document.getElementById("croppedCanvas");
const croppedCtx = croppedCanvas.getContext("2d");
const aspectRatioSelect = document.getElementById("aspectRatioSelect");

let img = new Image();
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let position = { x: 0, y: 0 };
let offset = { x: 0, y: 0 };
let scale = 1;
let aspectRatio = 1;

const MIN_SCALE = 0.1;
const MAX_SCALE = 5;

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

img.onload = () => {
  scale = 1;
  position = {
    x: (canvas.width - img.width) / 2,
    y: (canvas.height - img.height) / 2
  };
  draw();
};

aspectRatioSelect.addEventListener("change", () => {
  aspectRatio = eval(aspectRatioSelect.value);
  draw();
});

canvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  dragStart = { x: e.offsetX, y: e.offsetY };
  offset = { ...position };
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const dx = e.offsetX - dragStart.x;
  const dy = e.offsetY - dragStart.y;
  position.x = offset.x + dx;
  position.y = offset.y + dy;
  draw();
});

canvas.addEventListener("mouseup", () => isDragging = false);
canvas.addEventListener("mouseleave", () => isDragging = false);

canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  const zoomFactor = 0.1;
  const delta = Math.sign(e.deltaY);
  const newScale = scale * (1 - delta * zoomFactor);
  if (newScale < MIN_SCALE || newScale > MAX_SCALE) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  const dx = (mouseX - position.x) / scale;
  const dy = (mouseY - position.y) / scale;

  scale = newScale;
  position.x = mouseX - dx * scale;
  position.y = mouseY - dy * scale;
  draw();
});

function getCropRect() {
  // Dynamisch berechnetes Zuschneidefeld mit gewähltem Seitenverhältnis
  const maxW = canvas.width * 0.8;
  const maxH = canvas.height * 0.8;

  let w = maxW;
  let h = w / aspectRatio;

  if (h > maxH) {
    h = maxH;
    w = h * aspectRatio;
  }

  const x = (canvas.width - w) / 2;
  const y = (canvas.height - h) / 2;

  return { x, y, w, h };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, position.x, position.y, img.width * scale, img.height * scale);

  const crop = getCropRect();
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.strokeRect(crop.x, crop.y, crop.w, crop.h);
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
  croppedCtx.drawImage(img, sx, sy, sw, sh, 0, 0, crop.w, crop.h);
});
