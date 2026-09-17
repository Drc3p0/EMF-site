// EMF Explorer - Interactive frequency monitor
// Ported from the SporkLogic WordPress Custom HTML embed, restyled to run
// natively on emfexplorer.space. No audio is recorded or transmitted -
// analysis happens entirely in the browser via the Web Audio API.

(function () {
  const canvas = document.getElementById("freq-canvas");
  const peakOverlay = document.getElementById("freq-peak-overlay");
  const startBtn = document.getElementById("freq-start-btn");
  const statusEl = document.getElementById("freq-status");
  if (!canvas || !peakOverlay || !startBtn) return;

  const ctx = canvas.getContext("2d");
  let started = false;

  function hzLabel(f) {
    return f >= 1000
      ? (f / 1000).toFixed(f >= 10000 ? 0 : 1) + " kHz"
      : Math.round(f) + " Hz";
  }

  function pickPeaks(bins, nyquist, freqToX, canvasCssWidth, opts = {}) {
    const {
      maxPeaks = 3,
      relThreshold = 0.65,
      growSeparation = true,
      minPxLow = 44,
      minPxHigh = 96,
    } = opts;

    const N = bins.length;
    let maxVal = 1;
    for (let i = 0; i < N; i++) if (bins[i] > maxVal) maxVal = bins[i];
    const thresh = maxVal * relThreshold;

    const candidates = [];
    for (let i = 1; i < N - 1; i++) {
      const v = bins[i];
      if (v >= thresh && v > bins[i - 1] && v >= bins[i + 1]) candidates.push({ i, v });
    }
    if (!candidates.length) {
      let imax = 0;
      for (let i = 1; i < N; i++) if (bins[i] > bins[imax]) imax = i;
      candidates.push({ i: imax, v: bins[imax] });
    }

    candidates.sort((a, b) => b.v - a.v);
    const peaks = [];
    const binToHz = (i) => (i * nyquist) / N;

    for (const c of candidates) {
      const f = binToHz(c.i);
      const x = freqToX(f);
      const requiredPx = growSeparation
        ? minPxLow + (minPxHigh - minPxLow) * (x / Math.max(1, canvasCssWidth))
        : minPxLow;

      const farEnough = peaks.every(
        (p) => Math.abs(freqToX(binToHz(p.i)) - x) >= requiredPx
      );
      if (farEnough) {
        peaks.push(c);
        if (peaks.length >= maxPeaks) break;
      }
    }
    return peaks;
  }

  async function startExploring() {
    if (started) return;
    started = true;
    startBtn.disabled = true;
    startBtn.textContent = "Starting...";

    let audioCtx, stream;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") {
        try { await audioCtx.resume(); } catch (_) {}
      }
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
    } catch (err) {
      if (statusEl) statusEl.textContent = "Couldn't start microphone: " + (err && err.message ? err.message : err);
      startBtn.disabled = false;
      startBtn.textContent = "Start Exploring";
      started = false;
      return;
    }

    startBtn.style.display = "none";
    if (statusEl) statusEl.textContent = "Listening...";

    const src = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 8192;
    analyser.smoothingTimeConstant = 0.8;
    analyser.minDecibels = -100;
    analyser.maxDecibels = -20;
    src.connect(analyser);

    const bins = new Uint8Array(analyser.frequencyBinCount);

    function resizeCanvas() {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight || Math.round(cssW * (3 / 8));
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const nyquist = audioCtx.sampleRate / 2;
    const minHz = 20;
    const logMin = Math.log10(minHz);
    const logMax = Math.log10(nyquist);
    function freqToX(f) {
      const cssW = canvas.clientWidth;
      const norm = (Math.log10(f) - logMin) / (logMax - logMin);
      return norm * cssW;
    }

    function draw() {
      analyser.getByteFrequencyData(bins);
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

      const usableH = canvas.clientHeight - 30;
      const barW = 2;
      for (let i = 0; i < bins.length; i++) {
        const freq = (i * nyquist) / bins.length;
        if (freq < minHz) continue;
        const v = bins[i] / 255;
        const h = v * usableH;
        const x = freqToX(freq);
        ctx.fillStyle = `hsl(${200 - v * 200}, 80%, ${20 + v * 50}%)`;
        ctx.fillRect(x, canvas.clientHeight - h - 20, barW, h);
      }

      ctx.fillStyle = "#93b3a8";
      ctx.font = "12px 'Space Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      const scaleY = canvas.clientHeight - 18;
      [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000]
        .filter((f) => f <= nyquist)
        .forEach((f) => {
          const x = Math.round(freqToX(f)) + 0.5;
          ctx.fillRect(x, scaleY, 1, 5);
          ctx.fillText(f >= 1000 ? f / 1000 + "k" : f, x, scaleY + 6);
        });

      const peaks = pickPeaks(bins, nyquist, freqToX, canvas.clientWidth, {
        maxPeaks: 3,
        relThreshold: 0.65,
        growSeparation: true,
        minPxLow: 44,
        minPxHigh: 96,
      });

      peakOverlay.innerHTML = "";
      peaks.forEach((p) => {
        const f = (p.i * nyquist) / bins.length;
        if (f < minHz) return;
        const v = bins[p.i] / 255;
        const x = freqToX(f);

        const span = document.createElement("span");
        span.className = "peak-label";
        span.style.left = x + "px";
        span.style.color = `hsl(${200 - v * 200}, 80%, ${20 + v * 50}%)`;

        const baseSize = 12;
        const maxSize = 32;
        const scaled = v * v;
        span.style.fontSize = baseSize + scaled * (maxSize - baseSize) + "px";
        span.textContent = hzLabel(f);
        peakOverlay.appendChild(span);
      });

      requestAnimationFrame(draw);
    }
    draw();
  }

  startBtn.addEventListener("click", () => {
    startExploring().catch((err) => {
      if (statusEl) statusEl.textContent = "Couldn't start microphone: " + (err && err.message ? err.message : err);
      started = false;
      startBtn.disabled = false;
      startBtn.textContent = "Start Exploring";
    });
  });
})();
