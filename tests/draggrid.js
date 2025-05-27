const draggable = document.getElementById("draggable");
const gridContainer = document.getElementById("gridContainer");
const resizable = document.getElementById("resizable");
let offsetX, offsetY;

// Event-Listener für Maus- und Touch-Events
draggable.addEventListener("mousedown", startDrag);
draggable.addEventListener("touchstart", startDrag, { passive: false });

function startDrag(e) {
  let clientX, clientY;

  if (e.type === "touchstart") {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
    document.addEventListener("touchmove", drag, { passive: false });
    document.addEventListener("touchend", stopDrag);
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
  }

  // Berechne den Offset innerhalb des Elements
  offsetX = clientX - draggable.getBoundingClientRect().left;
  offsetY = clientY - draggable.getBoundingClientRect().top;
  e.preventDefault();
}

function drag(e) {
  let clientX, clientY;

  if (e.type === "touchmove") {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  const containerRect = gridContainer.getBoundingClientRect();
  let newLeft = clientX - containerRect.left - offsetX;
  let newTop = clientY - containerRect.top - offsetY;

  // Begrenzung, damit das Element im Container bleibt
  newLeft = Math.max(0, Math.min(newLeft, containerRect.width - draggable.offsetWidth));
  newTop = Math.max(0, Math.min(newTop, containerRect.height - draggable.offsetHeight));

  draggable.style.left = newLeft + "px";
  draggable.style.top = newTop + "px";

  // Bestimme die aktuelle Grid-Zelle anhand der Position
  const cellWidth = containerRect.width / 4; // 4 Spalten
  const cellHeight = containerRect.height / 4; // 4 Zeilen
  const col = Math.floor(newLeft / cellWidth);
  const row = Math.floor(newTop / cellHeight);

  // Simuliere eine Änderung des Grid-Layouts: Erhöhe die Zeilenhöhe und Spaltenbreite der aktiven Zelle
  const rows = Array(4).fill("100px");
  const cols = Array(4).fill("1fr");
  rows[row] = "150px";
  cols[col] = "2fr";

  gridContainer.style.gridTemplateRows = rows.join(" ");
  gridContainer.style.gridTemplateColumns = cols.join(" ");

  console.log("Aktuelle Position:", { row, col, x: newLeft, y: newTop });

  // Ändere die Größe des zweiten Containers basierend auf der Position des verschiebbaren Elements.
  // Beispiel: Breite nimmt proportional zum horizontalen Versatz zu, Höhe proportional zum vertikalen Versatz.
  const baseWidth = 100; // Basisbreite in px
  const baseHeight = 100; // Basishöhe in px
  const newWidth = baseWidth + newLeft; // oder jede andere Formel
  const newHeight = baseHeight + newTop;

  resizable.style.width = newWidth + "px";
  resizable.style.height = newHeight + "px";

  if (e.type === "touchmove") {
    e.preventDefault();
  }
}

function stopDrag(e) {
  if (e.type === "touchend") {
    document.removeEventListener("touchmove", drag);
    document.removeEventListener("touchend", stopDrag);
  } else {
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", stopDrag);
  }
}
