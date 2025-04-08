let audioplayer;
function initAudioplayer(canvasID, url) {
  const canvas = document.getElementById(canvasID);
  const canvasContext = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 100;
  if (audioplayer) {
    audioplayer.pause();
  }
  audioplayer = new Audio(url);
  const playPauseButton = document.getElementById("play-pause");

  let audioContext; // AudioContext für Chrome-Kompatibilität
  let waveformData = []; // Gespeicherte Wellenformdaten

  // Audiodatei laden und Wellenform erstellen
  async function loadAudio(fileUrl) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const headers = {};
    const response = await fetch(fileUrl, {
      // method: "GET", // Oder POST, falls benötigt
      headers: headers,
    });
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const rawData = audioBuffer.getChannelData(0);
    const sampleRate = Math.floor(rawData.length / canvas.width);

    // Wellenformdaten normalisieren
    waveformData = [];
    for (let i = 0; i < rawData.length; i += sampleRate) {
      const sample = rawData.slice(i, i + sampleRate);
      const max = Math.max(...sample);
      const min = Math.min(...sample);
      waveformData.push((max + Math.abs(min)) / 2);
    }

    drawWaveform(); // Zeichne die statische Wellenform
  }

  // Wellenform zeichnen
  function drawWaveform(progressPosition = null) {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    const middle = canvas.height / 2;
    const scale = middle;

    // Zeichne die statische Welle
    canvasContext.beginPath();
    waveformData.forEach((value, index) => {
      const x = index;
      const y = middle - value * scale;
      canvasContext.moveTo(x, y);
      canvasContext.lineTo(x, canvas.height - y);
    });
    // canvasContext.lineTo(canvas.width, middle);
    canvasContext.strokeStyle = "#007aff"; // Graue Welle für Vorschau
    canvasContext.lineWidth = 1;
    canvasContext.lineCap = "round";
    canvasContext.stroke();

    // Zeichne die Fortschrittslinie, wenn progressPosition vorhanden ist
    if (progressPosition !== null) {
      const progressX = Math.floor(progressPosition * canvas.width);
      canvasContext.beginPath();
      canvasContext.moveTo(progressX, 0);
      canvasContext.lineTo(progressX, canvas.height);
      canvasContext.strokeStyle = "#fff"; // Blau für die Fortschrittslinie
      canvasContext.lineWidth = 2;
      canvasContext.stroke();
    }
  }

  // Fortschritt aktualisieren
  function updateProgress() {
    if (audioplayer && !audioplayer.paused) {
      const progress = audioplayer.currentTime / audioplayer.duration; // Fortschritt berechnen
      drawWaveform(progress); // Fortschrittslinie zeichnen
      requestAnimationFrame(updateProgress); // Aktualisiere bei laufendem  audioplayer
      playPauseButton.classList.add("paused"); // Klasse hinzufügen
    } else {
      playPauseButton.classList.remove("paused"); // Klasse entfernen
    }
  }

  // Play/Pause-Toggle
  playPauseButton.addEventListener("click", async () => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioplayer.paused) {
      await audioContext.resume(); // Für Chrome: AudioContext aktivieren
      audioplayer.play();
      // playPauseButton.textContent = "Pause";
      // playPauseButton.classList.remove("paused"); // Klasse entfernen
      updateProgress(); // Fortschritt starten
    } else {
      audioplayer.pause();
      // playPauseButton.textContent = "Play";
      // playPauseButton.classList.add("paused"); // Klasse hinzufügen
    }
  });

  // Klick auf die Wellenform
  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect(); // Sichtbare Größe des Canvas
    const scaleX = canvas.width / rect.width; // Verhältnis interne Breite / sichtbare Breite
    const scaleY = canvas.height / rect.height; // Verhältnis interne Höhe / sichtbare Höhe

    const clickX = (event.clientX - rect.left) * scaleX; // Umrechnung auf interne Zeichenfläche
    const newProgress = clickX / canvas.width; // Fortschritt berechnen (0 bis 1)

    if (!isNaN(audioplayer.duration)) {
      const newTime = newProgress * audioplayer.duration; // Neue Zeit berechnen
      const wasPlaying = !audioplayer.paused; // Prüfen, ob das audioplayer gerade abgespielt wird
      audioplayer.pause(); // audioplayer anhalten
      audioplayer.currentTime = newTime; // Neue Abspielposition setzen
      if (wasPlaying) {
        audioplayer.play(); // Wiedergabe erneut starten, falls sie vorher lief
      }
      console.log(`Abspielposition geändert auf: ${newTime}s`);
    } else {
      console.warn("Audio duration not verfügbar.");
    }

    drawWaveform(newProgress); // Fortschrittslinie aktualisieren
  });
  async function drawWaveformFromBase64(base64Audio, canvas) {
    const canvasContext = canvas.getContext("2d");
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // 1. Base64-Dekodierung in ArrayBuffer
    const binaryString = atob(base64Audio.split(",")[1]); // Base64-Daten ohne Präfix
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const arrayBuffer = bytes.buffer;

    // 2. Audio-Dekodierung in AudioBuffer
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // 3. Extrahieren von Audiodaten
    const rawData = audioBuffer.getChannelData(0); // Nur der erste Kanal (Mono)
    const sampleRate = Math.floor(rawData.length / canvas.width); // Daten pro Pixel
    const waveformData = [];
    for (let i = 0; i < rawData.length; i += sampleRate) {
      const sample = rawData.slice(i, i + sampleRate);
      const max = Math.max(...sample);
      const min = Math.min(...sample);
      waveformData.push((max + Math.abs(min)) / 2); // Durchschnitt der Amplitude
    }

    // 4. Zeichnen der Waveform
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    const middle = canvas.height / 2;
    const scale = middle;

    canvasContext.beginPath();
    waveformData.forEach((value, index) => {
      const x = index;
      const y = middle - value * scale; // Normierte Amplitude
      if (index === 0) {
        canvasContext.moveTo(x, y);
      } else {
        canvasContext.lineTo(x, y);
      }
    });
    canvasContext.lineTo(canvas.width, middle);
    canvasContext.strokeStyle = "#007bff"; // Farbe der Welle
    canvasContext.lineWidth = 2;
    canvasContext.stroke();
  }
  // Audiodatei laden und Vorschau anzeigen

  loadAudio(url);
}
