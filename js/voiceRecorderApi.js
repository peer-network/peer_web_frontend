const MIC_SELECTOR = '.micButton';
let isRecording = false;
let recorder = null;
let audioStream = null;
let chunks = [];
let secondsElapsed = 0;
let timerInterval = null;

function initAudioEvents() {
  const micBtn = document.querySelector(MIC_SELECTOR);
  if (!micBtn) {
    console.error("Mic button not found.");
    return;
  }

  micBtn.addEventListener('click', async () => {
    if (!isRecording) {
      await startRecording(micBtn);
    } else {
      stopRecording(micBtn);
    }
  });

  console.log("Mic toggle initialized");
}

async function startRecording(button) {
  try {
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder = new MediaRecorder(audioStream);
    chunks = [];
    isRecording = true;

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      renderAudioPreview(url);
      appendAudioToForm(blob);
    };

    recorder.start();
    updateMicButton(button, true);
    startTimer();

  } catch (err) {
    console.error("Recording failed:", err);
    alert("Mic access is required.");
  }
}

function stopRecording(button) {
  if (recorder && isRecording) {
    recorder.stop();
    audioStream.getTracks().forEach((track) => track.stop());
    isRecording = false;
    stopTimer();
    updateMicButton(button, false);
  }
}

function updateMicButton(button, recording) {
  if (recording) {
    button.classList.add("recording");
    button.innerHTML = '⏸'; // show pause icon
  } else {
    button.classList.remove("recording");
    button.innerHTML = '▶'; // show play icon
  }
}

function startTimer() {
  const timer = document.getElementById("recordingTimer");
  secondsElapsed = 0;
  if (!timer) return;

  timerInterval = setInterval(() => {
    secondsElapsed++;
    const min = Math.floor(secondsElapsed / 60);
    const sec = secondsElapsed % 60;
    timer.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function renderAudioPreview(preview, url) {
  preview.innerHTML = '';

  const box = document.createElement('div');
  box.className = 'audio-preview-box';

  box.innerHTML = `
    <div class="waveform-bar"></div>
    <div class="record-meta">
      <span class="record-time">0:00</span>
      <button class="play-pause-btn" aria-label="Play">
        <div class="pause-icon">❚❚</div>
      </button>
    </div>
    <audio src="${url}" hidden></audio>
  `;

  preview.appendChild(box);

  const audio = box.querySelector('audio');
  const timeEl = box.querySelector('.record-time');
  const btn = box.querySelector('.play-pause-btn');
  const icon = box.querySelector('.pause-icon');

  let updateInterval = null;

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      icon.textContent = '❚❚';

      updateInterval = setInterval(() => {
        const mins = Math.floor(audio.currentTime / 60);
        const secs = Math.floor(audio.currentTime % 60);
        timeEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
      }, 500);
    } else {
      audio.pause();
      icon.textContent = '▶';
      clearInterval(updateInterval);
    }
  });

  audio.addEventListener('ended', () => {
    icon.textContent = '▶';
    clearInterval(updateInterval);
    timeEl.textContent = '0:00';
  });
}

function appendAudioToForm(blob) {
  const form = document.getElementById("newAudioPost");
  const file = new File([blob], 'voice-recording.webm', { type: 'audio/webm' });
  const input = document.createElement('input');
  input.type = 'file';
  input.name = 'recordedAudio';
  input.style.display = 'none';

  const dt = new DataTransfer();
  dt.items.add(file);
  input.files = dt.files;

  form.appendChild(input);
}

// Call this after DOM loads
initAudioEvents();