const cropcanvas = document.getElementById("cropcanvas");
const ctx = cropcanvas.getContext("2d");
const cropBtn = document.getElementById("cropBtn");
const cropQuit = document.getElementById("cropQuit");
const croppedCanvas = document.getElementById("croppedCanvas");
const croppedCtx = croppedCanvas.getContext("2d");
const aspectRatioSelect = document.getElementById("aspectRatioSelect");

let cropImg = new Image();
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let position = { x: 0, y: 0 };
let offset = { x: 0, y: 0 };
let scale = 1;
let aspectRatio = 1;

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

aspectRatioSelect.addEventListener("change", () => {
  aspectRatio = eval(aspectRatioSelect.value);
  draw();
});

cropcanvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  // const { x, y } = getMousePos(cropcanvas, e);
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
  let h = w / aspectRatio;

  if (h > maxH) {
    h = maxH;
    w = h * aspectRatio;
  }

  const x = (cropcanvas.width - w) / 2;
  const y = (cropcanvas.height - h) / 2;

  return { x, y, w, h };
}

function draw() {
  ctx.clearRect(0, 0, cropcanvas.width, cropcanvas.height);
  ctx.drawImage(cropImg, position.x, position.y, cropImg.width * scale, cropImg.height * scale);

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
  croppedCtx.drawImage(cropImg, sx, sy, sw, sh, 0, 0, crop.w, crop.h);
  cropOrg.src = croppedCanvas.toDataURL("image/webp");
  document.getElementById("crop-container").classList.add("none");
});
cropQuit.addEventListener("click", () => {
  document.getElementById("crop-container").classList.add("none");
});
function getMousePos(canvas, event) {
  const rect = cropcanvas.getBoundingClientRect();
  const scaleX = cropcanvas.width / rect.width;
  const scaleY = cropcanvas.height / rect.height;
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}
