let isListening = false;
let audioContext, analyser, microphone, dataArray, animationId;
let canvas, ctx;

function startListening() {
  if (isListening) return;

  canvas = document.getElementById("waveform");
  if (!canvas) {
    console.error("Canvas element with id 'waveform' not found.");
    return;
  }

  ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = 150;

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);

      isListening = true;
      document.getElementById("status").textContent = "Listening...";

      function draw() {
        if (!isListening) return;

        animationId = requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);

        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#ff6f61";
        ctx.beginPath();

        const sliceWidth = canvas.width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = v * canvas.height / 2;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);

          x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();

        // Calculate average volume
        const avgVolume = dataArray.reduce((sum, val) => sum + Math.abs(val - 128), 0) / bufferLength;

        if (avgVolume > 10 && avgVolume < 45) {
          translateBark(avgVolume);
        }
      }

      draw();
    })
    .catch(err => {
      console.error("Microphone access denied or error:", err);
      document.getElementById("status").textContent = "Microphone access denied.";
    });
}

function stopListening() {
  if (!isListening) return;

  isListening = false;

  if (animationId) cancelAnimationFrame(animationId);
  if (microphone) microphone.disconnect();
  if (analyser) analyser.disconnect();

  if (audioContext) {
    audioContext.close().then(() => {
      document.getElementById("status").textContent = "Stopped listening.";
    });
  } else {
    document.getElementById("status").textContent = "Stopped listening.";
  }
}
