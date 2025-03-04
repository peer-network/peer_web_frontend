const container = document.getElementById("draggable-resizable-container");
const header = document.getElementById("header");
const toggleBtn = document.getElementById("toggle-btn");
const content = document.getElementById("content");

// Initialzustand
let isOpen = true;

// Dragging
let isDragging = false;
let offsetX, offsetY;

// Resizing
let isResizing = false;
let startX, startY, startWidth, startHeight;

// Toggle-Funktion (Ein-/Ausklappen)
function toggleDropdown() {
  if (isOpen) {
    content.classList.add("hidden"); // Inhalt ausblenden
    toggleBtn.textContent = "▲"; // Pfeil nach oben
  } else {
    content.classList.remove("hidden"); // Inhalt einblenden
    toggleBtn.textContent = "▼"; // Pfeil nach unten
  }
  isOpen = !isOpen;
}

// Dragging-Logik (nur für die Titelleiste)
function startDrag(e) {
  e = e.touches ? e.touches[0] : e; // Touch-Unterstützung
  isDragging = true;
  offsetX = e.clientX - container.offsetLeft;
  offsetY = e.clientY - container.offsetTop;
}

function onDrag(e) {
  if (!isDragging) return;
  e = e.touches ? e.touches[0] : e;
  container.style.left = `${e.clientX - offsetX}px`;
  container.style.top = `${e.clientY - offsetY}px`;
}

function stopDrag() {
  isDragging = false;
}

// Resizing-Logik
const resizeHandle = document.createElement("div");
resizeHandle.classList.add("resize-handle");
content.appendChild(resizeHandle);

function startResize(e) {
  e = e.touches ? e.touches[0] : e;
  isResizing = true;
  startX = e.clientX;
  startY = e.clientY;
  startWidth = content.offsetWidth;
  startHeight = content.offsetHeight;
}

function onResize(e) {
  if (!isResizing) return;
  e = e.touches ? e.touches[0] : e;

  // Neue Breite und Höhe berechnen
  const newWidth = Math.max(30 * 8, startWidth + (e.clientX - startX)); // Mindestbreite: 10 Zeichen
  const newHeight = startHeight + (e.clientY - startY);

  content.style.width = `${newWidth}px`;
  content.style.height = `${newHeight}px`;
}

function stopResize() {
  isResizing = false;
}

// Event Listeners
// Toggle-Button
toggleBtn.addEventListener("click", toggleDropdown);

// Dragging (nur Titelleiste)
header.addEventListener("mousedown", startDrag);
header.addEventListener("touchstart", startDrag);

document.addEventListener("mousemove", onDrag);
document.addEventListener("touchmove", onDrag);

document.addEventListener("mouseup", stopDrag);
document.addEventListener("touchend", stopDrag);

// Resizing
resizeHandle.addEventListener("mousedown", startResize);
resizeHandle.addEventListener("touchstart", startResize);

document.addEventListener("mousemove", onResize);
document.addEventListener("touchmove", onResize);

document.addEventListener("mouseup", stopResize);
document.addEventListener("touchend", stopResize);
