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
let dragStart = {
  x: 0,
  y: 0
};
let position = {
  x: 0,
  y: 0
};
let offset = {
  x: 0,
  y: 0
};

let scale = 1;
let aspect_Ratio = 1;

const MIN_SCALE = 0.3;
const MAX_SCALE = 8;
let cropping = false;

cropImg.onload = () => {
  if (cropping) {
    // Bild- und Canvas-Abmessungen
    const imgW = cropImg.clientWidth || cropImg.width;
    const imgH = cropImg.clientHeight || cropImg.height;
    cropcanvas.width = imgW;
    cropcanvas.height = imgH;
    const canvasW = cropcanvas.width;
    const canvasH = cropcanvas.height;

    // Errechne den maximalen Scale, sodass das Bild reinpasst (cover = false, contain = true)
    scale = Math.min(canvasW / imgW, canvasH / imgH);

    // Neue Bildabmessungen nach Skalierung
    const displayW = imgW * scale;
    const displayH = imgH * scale;

    // Zentrieren
    position = {
      x: (canvasW - displayW) / 2,
      y: (canvasH - displayH) / 2,
    };
  } else {
    scale = 1;
    cropcanvas.width = 1500;
    cropcanvas.height = 1500;
    croppedCanvas.width = 500;
    croppedCanvas.height = 500;
    if (cropImg.width < cropcanvas.width && cropImg.height < cropcanvas.height) {
      const scaleX = cropcanvas.width / cropImg.width;
      const scaleY = cropcanvas.height / cropImg.height;
      scale = Math.min(scaleX, scaleY);

      // Center position after scaling
      position = {
        x: (cropcanvas.width - cropImg.width * scale) / 2,
        y: (cropcanvas.height - cropImg.height * scale) / 2,
      };
    } else {
      position = {
        x: (cropcanvas.width - cropImg.width) / 2,
        y: (cropcanvas.height - cropImg.height) / 2,
      };

    }
  }

  // Zeichne das Bild skaliert und zentriert
  draw();
  if (cropping) {
    cropIt();
  }
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
  dragStart = {
    x,
    y
  };
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
  dragStart = {
    x: dx,
    y: dy
  };
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
  const maxW = cropcanvas.width * (cropping ? 1 : 0.8);
  const maxH = cropcanvas.height * (cropping ? 1 : 0.8);

  let w = maxW;
  let h = w / aspect_Ratio;

  if (h > maxH) {
    h = maxH;
    w = h * aspect_Ratio;
  }

  const x = (cropcanvas.width - w) / 2;
  const y = (cropcanvas.height - h) / 2;

  return {
    x,
    y,
    w,
    h
  };
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
  cropIt();
  document.getElementById("crop-container").classList.add("none");
});

function cropIt() {
  const crop = getCropRect();
  const sx = (crop.x - position.x) / scale;
  const sy = (crop.y - position.y) / scale;
  const sw = crop.w / scale;
  const sh = crop.h / scale;
  const previewItem = cropOrg.closest('.preview-item');
  
  croppedCanvas.width = crop.w;
  croppedCanvas.height = crop.h;
  croppedCtx.clearRect(0, 0, crop.w, crop.h);
  croppedCtx.drawImage(cropImg, sx, sy, sw, sh, 0, 0, crop.w, crop.h);
  // cropOrg.src = croppedCanvas.toDataURL("image/png");
  croppedCanvas.toBlob((blob) => { previewItem.querySelector("img.create-img").src = URL.createObjectURL(blob)});
  if (aspect_Ratio == 1) {
    previewItem.classList.remove('vertical');
  } else {
    previewItem.classList.add('vertical');
  }
  previewItem.setAttribute("data-aspectratio", aspect_Ratio);
  cropping = false;
}

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

// drag and drop part
const containerList = document.querySelector("#preview-image .preview-track");
let draggedEl = null;
let placeholder = null;

containerList.addEventListener("dragstart", (e) => {
  const dragDiv = e.target.parentNode;
  if (dragDiv.classList.contains("dragable")) {
    draggedEl = dragDiv;
    dragDiv.classList.add("dragging");
    // Create a placeholder
    placeholder = document.createElement("div");
    placeholder.className = "placeholder";
    // required for firefox
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "");
  }
});

containerList.addEventListener("dragend", (e) => {
  if (draggedEl) {
    draggedEl.classList.remove("dragging");
    placeholder ?.remove();
    draggedEl = null;
    placeholder = null;
  }
});

containerList.addEventListener("dragover", (e) => {
  e.preventDefault();
  if (!draggedEl) return;

  // Find the closest sibling to insert before
  const siblings = [...containerList.querySelectorAll(".dragable:not(.dragging)")];
  let insertBefore = null;

  for (const sibling of siblings) {
    const rect = sibling.getBoundingClientRect();
    if (e.clientX < rect.left + rect.width / 2) {
      insertBefore = sibling;
      break;
    }
  }

  // Insert placeholder in right place
  if (insertBefore) {
    if (containerList.children[Array.prototype.indexOf.call(containerList.children, insertBefore) - 1] !== placeholder) {
      containerList.insertBefore(placeholder, insertBefore);
    }
  } else {
    if (containerList.lastChild !== placeholder) {
      containerList.appendChild(placeholder);
    }
  }
});

containerList.addEventListener("drop", (e) => {
  e.preventDefault();
  if (draggedEl && placeholder) {
    containerList.insertBefore(draggedEl, placeholder);
  }
});

[...containerList.children].forEach((div) => {
  div.setAttribute("dragable", "true");
});

function cropImage(imgContainer) {
  cropOrg = imgContainer.querySelector("img");
  if (!cropOrg) return;
  // cropcanvas.width = cropOrg.clientWidth;
  // cropcanvas.height = cropOrg.clientHeight;
  const p_element = cropOrg.parentElement.querySelector("p");
  const imageDatasrc = window.uploadedFilesMap.get(p_element.innerText);
  if (imageDatasrc) {
    cropImg.src = URL.createObjectURL(imageDatasrc);
  } else {
    cropImg.src = cropOrg.src; // Das Bild aus dem Element holen
  }
  // document.getElementById("crop-container").classList.remove("none");
  // draw();
}

async function cropAllImages() {
  const imagesCon = document.getElementById("preview-image");
  const images = imagesCon.querySelectorAll(".preview-track .dragable");
  for (const imgContainer of images) {
    cropping = true;

    if (aspect_Ratio == 1) {
      imgContainer.classList.remove('vertical');
    } else {
      imgContainer.classList.add('vertical');
    }
    imgContainer.setAttribute("data-aspectratio", aspect_Ratio);
    cropImage(imgContainer);
    while (cropping) {
      await sleep(10);
    }
  }
  // All images done cropping
  imagesCon.classList.remove('cropping');
  document.getElementById("crop-container").classList.add("none");
}

document.querySelectorAll('input[name="aspectRatioMul"]').forEach(function (radio) {
  radio.addEventListener('change', function (event) {
    if (event.target.checked) {
      const imagesCon = document.getElementById("preview-image");
      imagesCon.classList.add('cropping');
      aspect_Ratio = eval(event.target.value);
      cropAllImages();
    }
    if (aspect_Ratio == 1) {
      document.getElementById("preview-image").classList.remove('vertical');
    } else {
      document.getElementById("preview-image").classList.add('vertical');
    }
  });
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitAndDo() {
  await sleep(111);
}