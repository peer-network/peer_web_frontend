const MIC_SELECTOR = '.micButton';
let isRecording = true;
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
    if (isRecording) await startRecording(micBtn);
    else stopRecording(micBtn);
  });
}

// async function startRecording(micBtn) {
//   try {
//     audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     recorder = new MediaRecorder(audioStream);
//     chunks = [];
//     isRecording = false;
//     recorder.ondataavailable = (e) => chunks.push(e.data);
//     recorder.onstop = () => {
//       const blob = new Blob(chunks, { type: 'audio/webm' });
//       const url = URL.createObjectURL(blob);
//       // const preview = document.getElementById('preview-audio');
//       // if (!voiceRecordWrapper) {
//       //   console.error("preview-audio element not found!");
//       //   return;
//       // }
//       // renderAudioPreview(voiceRecordWrapper, url);
//       appendAudioToForm(blob);
//     };
//      micBtn.src = "svg/record-on.svg";
//     recorder.start();
//     // updateMicButton(micBtn, true);
//     startTimer();
//   } catch (err) {
//     console.error("Recording failed:", err);
//     alert("Mic access is required.");
//   }
// }
async function startRecording(micBtn) {
  try {
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder = new MediaRecorder(audioStream);
    chunks = [];
    isRecording = false;

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      // renderAudioPreview(document.getElementById('preview-audio'), url);
      appendAudioToForm(blob);
    };

    // Swap mic icon to recording
    micBtn.src = "svg/record-on.svg";
    startTimer();
    recorder.start();
  } catch (err) {
    console.error("Recording failed:", err);
    alert("Mic access is required.");
  }
}
// function stopRecording(button) {
//   if (recorder && !isRecording) {
//     recorder.stop();
//     audioStream.getTracks().forEach((track) => track.stop());
//     isRecording = true;
//     stopTimer();
//     updateMicButton(button, false);
//   }
// }
function stopRecording(micBtn) {
  if (recorder && !isRecording) {
    recorder.stop();
    audioStream.getTracks().forEach((track) => track.stop());
    isRecording = true;
    stopTimer();

    // Update button to idle
    // micBtn.src = "img/voice-icon.png";

    // Show preview icon (inside preview-audio container)
    const previewSpan = document.querySelector('#preview-audio .record-again');
    if (previewSpan) {
      previewSpan.classList.remove("none");
    }
  }
}


function updateMicButton(button, recording) {
  // if (recording) {
  //   button.classList.add("recording");
  //   button.innerHTML = '⏸';
  // } else {
  //   button.classList.remove("recording");
  //   button.innerHTML = '▶';
  // }

  button.src = "svg/record-stop.svg"
  const preview = document.getElementById('preview-audio');
  const img = preview.querySelector("img");
  img.classList.remove("none");
}

function startTimer() {
  const timer = document.getElementById("recordingTimer");
  timer.classList.remove("none");
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
  console.log("clearing interval")
  clearInterval(timerInterval);
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

function renderAudioPreview(preview, url) {
  preview.innerHTML = '';
  const box = document.createElement('div');
  box.className = 'audio-preview-box';
  box.innerHTML = `
    <div class="waveform-bar"></div>
    <div class="record-meta">
      <span class="record-time">0:00</span>
      <span class="play-pause-btn" aria-label="Play">
        <div class="pause-icon">▶</div>
      </span>
    </div>
    <audio src="${url}"></audio>
  `;
  preview.appendChild(box);
  const audio = box.querySelector('audio');
  const timeEl = box.querySelector('.record-time');
  const btn = box.querySelector('.play-pause-btn');
  const icon = box.querySelector('.pause-icon');
  icon.innerHTML = `<img src="svg/music-playing.svg" alt="Play">`;
  let updateInterval = null;

  // to ensure audio can play first
  audio.addEventListener('canplaythrough', () => {
    console.log(" Audio ready to play");
    btn.disabled = false;
  });

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      icon.innerHTML = `<img src="svg/music.svg" alt="Pause">`;

      updateInterval = setInterval(() => {
        const mins = Math.floor(audio.currentTime / 60);
        const secs = Math.floor(audio.currentTime % 60);
        timeEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
      }, 300);
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
