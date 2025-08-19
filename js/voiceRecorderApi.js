// ===== Constants =====
const MIC_SELECTOR = '.micButton';
const RECORDING_FILENAME = 'voice-recording.webm';
const voiceRecordWrapper = document.getElementById('voice-record-wrapper');

const UI_STATE = {
  INITIAL: "initial",
  RECORDING: "recording",
  PREVIEW: "preview",
  PLAYING: "playing",
  PAUSED: "paused"
};

const MIC_STATE = {
  OFF: "off",
  ON: "on",
  STEADY: "steady"
};

// ===== State Variables =====
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
let recordedAudioSource = null;

// ===== Init =====
function initAudioEvents() {
  const micBtn = document.querySelector(MIC_SELECTOR);
  const recordedAudio = getRecordedAudio();

  if (!micBtn || !recordedAudio) {
    console.error("Mic button or recorded audio element not found.");
    return;
  }

  micBtn.addEventListener('click', () => handleMicClick(micBtn, recordedAudio));
  recordedAudio.addEventListener("ended", handlePlaybackEnded);
  document.querySelector(".record-again") ?.addEventListener("click", handleRecordAgain);
}

// ===== Event Handlers =====
async function handleMicClick(micBtn, recordedAudio) {
  hideAttachmentArea();

  if (hasRecording && !isRecording) {
    await handlePlayback(recordedAudio);
    return;
  }

  if (!isRecording) {
    updateMicButton(MIC_STATE.STEADY);
    setUIState(UI_STATE.RECORDING);
    await startRecording();
  } else {
    stopRecording(micBtn);
    updateMicButton(MIC_STATE.OFF);
    setUIState(UI_STATE.PREVIEW);
    document.querySelector(".audiobackground_uploader") ?.classList.remove("none");
  }
}

async function handlePlayback(recordedAudio) {
  try {
    if (recordedAudio.paused) {
      await recordedAudio.play();
      setUIState(UI_STATE.PLAYING);
      updateMicButton(MIC_STATE.ON);

      const node = await getPlaybackSource();
      if (node) runVisualizer(node, true);

      startPlaybackTimer(recordedAudio);
    } else {
      recordedAudio.pause();
      setUIState(UI_STATE.PAUSED);
      updateMicButton(MIC_STATE.OFF);
      clearInterval(playbackInterval);
    }
  } catch (err) {
    console.error("Playback failed:", err);
  }
}

function handlePlaybackEnded() {
  setUIState(UI_STATE.PREVIEW);
  updateMicButton(MIC_STATE.OFF);
  resetRecordingTimer();
  cancelAnimationFrame(playbackInterval);
  cancelAnimationFrame(animationId);

}

// Reseting the full state
function handleRecordAgain() {
  const oldAudio = getRecordedAudio();
  const previewBtn = document.querySelector(".record-again");
  const playButton = document.querySelector(".voice-play-button");

  // Stop and clean up audio element
  if (oldAudio) {
    oldAudio.pause();
    oldAudio.currentTime = 0;

    // Replace the <audio> element entirely
    const newAudio = oldAudio.cloneNode(true);
    newAudio.removeAttribute("src");
    newAudio.load(); // force reflow

    oldAudio.parentNode.replaceChild(newAudio, oldAudio);

    // Reattach event listeners
    newAudio.addEventListener("ended", handlePlaybackEnded);
  }

  // Disconnect and clear source node
  if (recordedAudioSource) {
    try {
      recordedAudioSource.disconnect();
    } catch (e) {
      console.warn("Couldn't disconnect audio node:", e);
    }
    recordedAudioSource = null;
  }

  // Close AudioContext
  if (audioContext && typeof audioContext.close === "function") {
    try {
      audioContext.close();
    } catch (e) {
      console.warn("Couldn't close audio context:", e);
    }
    audioContext = null;
  }

  // Reset all state
  hasRecording = false;
  isRecording = false;
  recorder = null;
  chunks = [];
  recordedAudioURL = null;

  // Reset UI
  setUIState(UI_STATE.INITIAL);
  updateMicButton(MIC_STATE.STEADY);
  resetRecordingTimer();
  showAttachmentArea();

  if (previewBtn) previewBtn.classList.add("none");
  if (playButton) playButton.classList.add("hidden");

  // Reset visualizer
  cancelAnimationFrame(animationId);
  const paths = document.querySelectorAll('#mic-visualizer path');
  paths.forEach((path) => {
    //path.setAttribute('transform', 'scale(0.5, 0.5)');
    path.removeAttribute('style');
  });

  if (voiceRecordWrapper) {
    voiceRecordWrapper.className = "voice-media";
  }

  // Rebind mic click with new recordedAudio element
  const micBtn = document.querySelector(MIC_SELECTOR);
  const newRecordedAudio = getRecordedAudio();

  if (micBtn && newRecordedAudio) {
    micBtn.replaceWith(micBtn.cloneNode(true)); // remove old listener
    const newMicBtn = document.querySelector(MIC_SELECTOR);
    newMicBtn.addEventListener("click", () => handleMicClick(newMicBtn, newRecordedAudio));
  }

  // Reattach audio ended event
  if (newRecordedAudio) {
    newRecordedAudio.addEventListener("ended", handlePlaybackEnded);
  }
}

// ===== Recording =====
// async function startRecording() {
//   try {
//     audioStream = await navigator.mediaDevices.getUserMedia({
//       audio: true
//     });
//     recorder = new MediaRecorder(audioStream);
//     chunks = [];
//     isRecording = true;

//     recorder.ondataavailable = (e) => chunks.push(e.data);
//     resetRecordingTimer();

//     if (timerInterval) {
//       clearTimeout(timerInterval);
//       timerInterval = null;
//     }

//     resetRecordingTimer();
//     await new Promise(requestAnimationFrame);
//     startTimer();
//     recorder.start();

//     const node = await getMicSource();
//     if (node) runVisualizer(node);

//     recorder.onstop = async () => {
//       // let blob = new Blob(chunks, { type: 'audio/webm' });
//       let blob = new Blob(chunks, {
//         type: recorder.mimeType
//       });

//       if (blob.size === 0) {
//         console.warn("Recording was empty.");
//         return;
//       }

//       const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
//       const needsWav = isChrome;
//       if (needsWav) {
//         try {
//           const arrayBuffer = await blob.arrayBuffer();
//           const audioCtx = new(window.AudioContext || window.webkitAudioContext)();
//           const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
//           // Convert audioBuffer to WAV Blob
//           blob = encodeWAV(audioBuffer);
//         } catch (err) {
//           console.error("Failed to process audio:", err);
//         }
//       }
//     };

//   } catch (err) {
//     console.error("Mic access denied:", err);
//     alert("Mic access is required.");
//   }

//   // For playback and preview
//   recordedAudioURL = URL.createObjectURL(wavBlob);
//   hasRecording = true;

//   const recordedAudio = getRecordedAudio();
//   if (recordedAudio) {
//     recordedAudio.src = recordedAudioURL;
//     recordedAudio.load();

//     if (!audioContext) {
//       audioContext = new(window.AudioContext || window.webkitAudioContext)();
//     }
//   }

//   appendAudioToForm(blob);
//   document.querySelector(".record-again") ?.classList.remove("none");
// }

async function startRecording() {
  try {
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder = new MediaRecorder(audioStream);
    chunks = [];
    isRecording = true;

    recorder.ondataavailable = (e) => chunks.push(e.data);
    resetRecordingTimer();

    if (timerInterval) {
      clearTimeout(timerInterval);
      timerInterval = null;
    }

    resetRecordingTimer();
    await new Promise(requestAnimationFrame);
    startTimer();
    recorder.start();

    const node = await getMicSource();
    if (node) runVisualizer(node);

    recorder.onstop = async () => {
      let blob = new Blob(chunks, { type: 'audio/wav' });

      if (blob.size === 0) {
        console.warn("Recording was empty.");
        return;
      }

      const needsWav = getBrowser();
      if (needsWav == "Chrome" || needsWav == "Safari" || needsWav == "Edge") {
        try {
          const arrayBuffer = await blob.arrayBuffer();
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

          // Convert to WAV
          blob = encodeWAV(audioBuffer);
        } catch (err) {
          console.error("Failed to process audio:", err);
          alert("Audio processing failed.");
          return;
        }
      }

      // Playback and preview
      recordedAudioURL = URL.createObjectURL(blob);
      hasRecording = true;

      const recordedAudio = getRecordedAudio();
      if (recordedAudio) {
        recordedAudio.src = recordedAudioURL;
        recordedAudio.load();

        if (!audioContext) {
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
      }

      // Upload or attach
      appendAudioToForm(blob);
      document.querySelector(".record-again")?.classList.remove("none");
    };

  } catch (err) {
    console.error("Mic access denied:", err);
    alert("Mic access is required.");
  }
}

function getBrowser() {
  const ua = navigator.userAgent;

  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("OPR") || ua.includes("Opera")) return "Opera";
  if (ua.includes("Brave")) return "Brave";
  if (/^((?!chrome|android).)*safari/i.test(ua)) return "Safari";
  if (window.chrome !== undefined) return "Chrome";

  return "Unknown";
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
      recordedAudioSource = null;
    }
    cancelAnimationFrame(animationId);
    animationId = null;
    isRecording = false;
    stopTimer();
  }
}

// ===== UI & State =====
function setUIState(state) {
  const label = document.querySelector("#recordingStatusText");
  const micWrapper = document.getElementById("voice-record-wrapper");
  const previewButton = document.querySelector(".record-again");

  if (!label || !micWrapper) return;

  micWrapper.classList.remove("recording", "preview", "playing");

  switch (state) {
    case UI_STATE.INITIAL:
      label.textContent = "Start recording";
      previewButton ?.classList.add("none");
      break;
    case UI_STATE.RECORDING:
      label.textContent = "Recording...";
      micWrapper.classList.add("recording");
      break;
    case UI_STATE.PREVIEW:
      label.textContent = "Preview";
      micWrapper.classList.add("preview");
      break;
    case UI_STATE.PLAYING:
      label.textContent = "Playing...";
      micWrapper.classList.add("playing");
      break;
    case UI_STATE.PAUSED:
      label.textContent = "Paused";
      break;
  }
}

function updateMicButton(state = MIC_STATE.STEADY) {
  const voiceMediaOff = document.getElementById('voice-media-off');
  const voiceMediaSteady = document.getElementById('voice-media-steady');
  const voiceMediaOn = document.getElementById('voice-media-on');

  [voiceMediaOff, voiceMediaSteady, voiceMediaOn].forEach(el => el.classList.add("none"));
  voiceRecordWrapper.classList.add("active");

  switch (state) {
    case MIC_STATE.OFF:
      voiceMediaOff.classList.remove("none");
      break;
    case MIC_STATE.STEADY:
      voiceMediaSteady.classList.remove("none");
      break;
    case MIC_STATE.ON:
      voiceMediaOn.classList.remove("none");
      break;
  }
}

// ===== Timer =====
function startPlaybackTimer(recordedAudio) {
  const timer = getTimerElement();
  if (!timer) return;

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

function startTimer() {
  const timer = getTimerElement();
  if (!timer) return;

  secondsElapsed = 0;
  const start = Date.now();

  function tick() {
    secondsElapsed = Math.floor((Date.now() - start) / 1000);
    updateTimerDisplay(timer);
    timerInterval = setTimeout(tick, 1000);
  }

  tick();
}

function stopTimer() {
  clearInterval(timerInterval);
  cancelAnimationFrame(animationId);
}

function updateTimerDisplay(timer) {
  const min = Math.floor(secondsElapsed / 60);
  const sec = secondsElapsed % 60;
  timer.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
}

function resetRecordingTimer() {
  const timer = getTimerElement();
  if (timer) {
    timer.classList.remove("none");
    timer.textContent = "0:00";
  }
}

// ===== Visualizer =====
function runVisualizer(sourceNode, connectToOutput = false) {
  const paths = document.querySelectorAll('#mic-visualizer path');

  if (!audioContext) {
    audioContext = new(window.AudioContext || window.webkitAudioContext)();
  }

  analyser = audioContext.createAnalyser();
  analyser.fftSize = 64;
  sourceNode.connect(analyser);

  if (connectToOutput) {
    analyser.connect(audioContext.destination);
  }

  dataArray = new Uint8Array(analyser.frequencyBinCount);
  cancelAnimationFrame(animationId);

  function animate() {
    analyser.getByteFrequencyData(dataArray);
    paths.forEach((path, i) => {
      const intensity = dataArray[i % dataArray.length] / 255;
      const scale = 1 + intensity * 10;
      path.setAttribute('style', `transform:scale(1, -${scale})`);
    });
    animationId = requestAnimationFrame(animate);
  }

  animate();

  const resetBars = () => {
    cancelAnimationFrame(animationId);
    paths.forEach((path) => {
      //path.setAttribute('transform', 'scale(0.5, 0.5)');
      path.removeAttribute('style');


    });
    //console.log('ddd');
  };

  const recordedAudio = getRecordedAudio();
  if (recordedAudio) {
    recordedAudio.addEventListener('pause', resetBars, {
      once: true
    });
    recordedAudio.addEventListener('ended', resetBars, {
      once: true
    });
  }
}

// ===== Helpers =====
function getRecordedAudio() {
  return document.getElementById("recorded-audio");
}

function getTimerElement() {
  return document.getElementById("recordingTimer");
}

function hideAttachmentArea() {
  const attachment = document.getElementById("drop-area-audio");
  if (attachment) attachment.classList.add("none");
}

function showAttachmentArea() {
  const attachment = document.getElementById("drop-area-audio");
  if (attachment) attachment.classList.remove("none");
}

async function getMicSource() {
  if (!audioStream || !(audioStream instanceof MediaStream)) {
    console.error("Visualizer error: audioStream is invalid", audioStream);
    return null;
  }

  if (!audioContext) {
    audioContext = new(window.AudioContext || window.webkitAudioContext)();
  }

  return audioContext.createMediaStreamSource(audioStream);
}

async function getPlaybackSource() {
  const recordedAudio = getRecordedAudio();
  if (!recordedAudio) return null;

  // Close previous context if it was reset by "Record Again"
  if (!audioContext || audioContext.state === 'closed') {
    audioContext = new(window.AudioContext || window.webkitAudioContext)();
    recordedAudioSource = null;
  }

  // Create new MediaElementSource only once
  if (!recordedAudioSource) {
    recordedAudioSource = audioContext.createMediaElementSource(recordedAudio);
    recordedAudioSource.connect(audioContext.destination);
  }

  return recordedAudioSource;
}

function appendAudioToForm(blob) {
  const form = document.getElementById("preview-audio");
  if (!form) return;

  const file = new File([blob], RECORDING_FILENAME, {
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

function encodeWAV(audioBuffer) {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const samples = audioBuffer.getChannelData(0);
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  function floatTo16BitPCM(view, offset, input) {
    for (let i = 0; i < input.length; i++) {
      let s = Math.max(-1, Math.min(1, input[i]));
      s = s < 0 ? s * 0x8000 : s * 0x7FFF;
      view.setInt16(offset + i * 2, s, true);
    }
  }

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // subchunk1Size
  view.setUint16(20, 1, true); // audioFormat = PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true); // bitsPerSample
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);

  floatTo16BitPCM(view, 44, samples);

  return new Blob([view], {
    type: 'audio/wav'
  });
}