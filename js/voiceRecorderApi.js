const MIC_SELECTOR = '.micButton';
let isRecording = false;
let hasRecording = false;
let recorder = null;
let audioStream = null;
let chunks = [];
let secondsElapsed = 0;
let timerInterval = null;
let recordedAudioURL = null;
let playbackInterval = null;
let audioContext, analyser, source, dataArray, animationId;

function initAudioEvents() {
  const micBtn = document.querySelector(MIC_SELECTOR);
  const recordedAudio = document.getElementById("recorded-audio");
  if (!micBtn || !recordedAudio) {
    console.error("Mic button or recorded audio element not found.");
    return;
  }
  // Click handler
  micBtn.addEventListener('click', async () => {
    if (hasRecording && !isRecording) {
      try {
        if (recordedAudio.paused) {
          await recordedAudio.play();
          setUIState("playing");
          updateMicButton("on");
          startAudioVisualizer();
          const timer = document.getElementById("recordingTimer");
          if (timer) {
            cancelAnimationFrame(playbackInterval);
            const updatePlaybackTimer = () => {
              const t = recordedAudio.currentTime;
              const min = Math.floor(t / 60);
              const sec = Math.floor(t % 60);
              timer.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
              playbackInterval = requestAnimationFrame(updatePlaybackTimer);
            };
            updatePlaybackTimer();
          }
        } else {
          recordedAudio.pause();
          setUIState("paused");
          updateMicButton("off");
          clearInterval(playbackInterval);
        }
      } catch (err) {
        console.error("Playback failed:", err);
      }
      return;
    }
    // Start or stop recording
    if (!isRecording) {
      updateMicButton("steady");
      setUIState("recording");
      const result = await startRecording();
    } else {
      stopRecording(micBtn);
      updateMicButton("off");
      setUIState("preview");
    }
  });
  // Audio ends
  recordedAudio.addEventListener("ended", () => {
    setUIState("preview");
    updateMicButton("off");
    const timer = document.getElementById("recordingTimer");
    if (timer) {
      timer.classList.remove("none");
      timer.textContent = "0:00";
    }
    cancelAnimationFrame(playbackInterval);
    cancelAnimationFrame(animationId);
  });
  // Record again reset
  document.querySelector(".record-again") ?.addEventListener("click", () => {
    recordedAudio.pause();
    recordedAudio.currentTime = 0;
    hasRecording = false;
    isRecording = false;
    recordedAudio.src = "";
    setUIState("initial");
    clearInterval(playbackInterval);
  });
}

async function startRecording() {
  try {
    audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });
    recorder = new MediaRecorder(audioStream);
    chunks = [];
    isRecording = true;
    recorder.ondataavailable = (e) => chunks.push(e.data);
    const timer = document.getElementById("recordingTimer");
    if (timer) {
      timer.classList.remove("none");
      timer.textContent = "0:00";
    }
    await new Promise(requestAnimationFrame);
    startTimer();
    recorder.start();
    startAudioVisualizer();
    recorder.onstop = () => {
      const blob = new Blob(chunks, {
        type: 'audio/webm'
      });
      if (blob.size === 0) {
        console.warn("Recording was empty.");
        return;
      }
      recordedAudioURL = URL.createObjectURL(blob);
      hasRecording = true;
      const recordedAudio = document.getElementById("recorded-audio");
      if (recordedAudio) {
        recordedAudio.src = recordedAudioURL;
        recordedAudio.load();
      }
      appendAudioToForm(blob);
      const previewBtn = document.querySelector(".record-again");
      if (previewBtn) previewBtn.classList.remove("none");
    };
  } catch (err) {
    console.error("Mic access denied:", err);
    alert("Mic access is required.");
  }
}


function stopRecording() {
  if (recorder && isRecording) {
    recorder.stop();
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      audioStream = null;
    }
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
    cancelAnimationFrame(animationId);
    animationId = null;
    isRecording = false;
    stopTimer();
  }
}

function updateMicButton(recording = "steady") {
  const voiceRecordWrapper = document.getElementById('voice-record-wrapper')
  const voiceMediaOff = document.getElementById('voice-media-off');
  const voiceMediaSteady = document.getElementById('voice-media-steady');
  const voiceMediaOn = document.getElementById('voice-media-on');
  [voiceMediaOff, voiceMediaSteady, voiceMediaOn].forEach(el => el.classList.add("none"));
  voiceRecordWrapper.classList.add("active")
  switch (recording) {
    case "off":
      voiceMediaOff.classList.remove("none");
      break;
    case "steady":
      voiceMediaSteady.classList.remove("none");
      break;
    case "on":
      voiceMediaOn.classList.remove("none");
      break;
  }
}

function updateTimerDisplay(timer) {
  const min = Math.floor(secondsElapsed / 60);
  const sec = secondsElapsed % 60;
  timer.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
}

function startTimer() {
  const timer = document.getElementById("recordingTimer");
  if (!timer) return;
  secondsElapsed = 0;
  const start = Date.now();

  function tick() {
    secondsElapsed = Math.floor((Date.now() - start) / 1000);
    const min = Math.floor(secondsElapsed / 60);
    const sec = secondsElapsed % 60;
    timer.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
    timerInterval = setTimeout(tick, 1000);
  }
  tick();
}

function stopTimer() {
  clearInterval(timerInterval);
  cancelAnimationFrame(animationId);
}

function appendAudioToForm(blob) {
  const form = document.getElementById("preview-audio");
  if (!form) return;
  const file = new File([blob], 'voice-recording.webm', {
    type: 'audio/webm'
  });
  const input = document.createElement('input');
  input.type = 'file';
  input.name = 'recordedAudio';
  input.style.display = 'none';
  const dt = new DataTransfer();
  dt.items.add(file);
  input.files = dt.files;
  form.appendChild(input);
}

function setUIState(state) {
  const label = document.querySelector("#recordingStatusText");
  const micWrapper = document.getElementById("voice-record-wrapper");
  const previewButton = document.querySelector(".record-again");
  if (!label || !micWrapper) return;
  micWrapper.classList.remove("recording", "preview", "playing");
  switch (state) {
    case "initial":
      label.textContent = "Start recording";
      previewButton ?.classList.add("none");
      break;
    case "recording":
      label.textContent = "Recording...";
      micWrapper.classList.add("recording");
      break;
    case "preview":
      label.textContent = "Preview";
      micWrapper.classList.add("preview");
      break;
    case "playing":
      label.textContent = "Playing...";
      micWrapper.classList.add("playing");
      break;
    case "paused":
      label.textContent = "Paused";
      break;
  }
}

async function startAudioVisualizer() {
const paths = document.querySelectorAll('#mic-visualizer path');
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  source = audioContext.createMediaStreamSource(stream);
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 64;

  source.connect(analyser);
  dataArray = new Uint8Array(analyser.frequencyBinCount);

  function animate() {
    analyser.getByteFrequencyData(dataArray);

    paths.forEach((path, i) => {
       const intensity = dataArray[i % dataArray.length] / 255;
    const scale = 0.5 + intensity * 5;
    path.setAttribute('transform', `scale(0.5, ${scale})`);
    });

    animationId = requestAnimationFrame(animate);
  }

  animate();
}
