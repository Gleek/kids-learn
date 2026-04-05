/* ── Kids Learn — Shared Game Utilities ── */

window.KidsGame = (function () {
  // ── Audio ──
  let audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function playTone(success) {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.value = 0.15;
    if (success) {
      osc.frequency.value = 523; osc.type = "sine";
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start(); osc.stop(ctx.currentTime + 0.4);
    } else {
      osc.frequency.value = 200; osc.type = "square";
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(); osc.stop(ctx.currentTime + 0.3);
    }
  }

  function playChime(notes) {
    const ctx = getAudioCtx();
    const ns = notes || [523, 659, 784, 880, 1047];
    ns.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
      osc.start(t);
      osc.stop(t + 0.5);
    });
  }

  // ── Stars ──
  function renderStars(containerEl, earned, total) {
    containerEl.innerHTML = "";
    for (let i = 0; i < total; i++) {
      const span = document.createElement("span");
      span.className = "star" + (i < earned ? " earned" : "");
      span.textContent = i < earned ? "\u2B50" : "\u2606";
      span.style.color = i < earned ? "gold" : "#555";
      containerEl.appendChild(span);
    }
  }

  function renderFinalStars(containerEl, earned, total) {
    containerEl.textContent = "";
    for (let i = 0; i < total; i++) {
      containerEl.textContent += i < earned ? "\u2B50" : "\u2606";
    }
  }

  // ── Feedback ──
  function showFeedback(emoji, anchorEl, wrapperEl, duration) {
    const dur = duration || 900;
    const rect = anchorEl.getBoundingClientRect();
    const wrapRect = wrapperEl.getBoundingClientRect();
    const el = document.createElement("div");
    el.className = "feedback-float";
    el.textContent = emoji;
    el.style.left = (rect.left - wrapRect.left + rect.width / 2 - 20) + "px";
    el.style.top = (rect.top - wrapRect.top - 10) + "px";
    wrapperEl.appendChild(el);
    setTimeout(() => el.remove(), dur);
  }

  // ── End Game Messages ──
  function endGameMessage(earned, total) {
    if (earned === total) return { title: "Perfect!", message: "You got all the stars!" };
    if (earned >= Math.ceil(total * 0.6)) return { title: "Great Job!", message: "Keep it up!" };
    return { title: "Good Try!", message: "Play again to get more stars!" };
  }

  // ── Shuffle / Pick ──
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pickRandom(arr, count) {
    return shuffle(arr).slice(0, count);
  }

  // ── Confetti / Reward ──
  function spawnConfetti(overlayEl, opts) {
    const options = opts || {};
    const count = options.count || 60;
    const colors = options.colors || ["#e94560", "#ffd700", "#4caf50", "#4a90d9", "#a855f7", "#ff6b6b", "#22d3ee", "#f472b6"];
    const duration = options.duration || 4000;

    overlayEl.innerHTML = "";
    overlayEl.classList.add("active");

    for (let i = 0; i < count; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti";
      piece.style.left = Math.random() * 100 + "%";
      piece.style.top = "-10px";
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.width = (6 + Math.random() * 8) + "px";
      piece.style.height = (6 + Math.random() * 8) + "px";
      piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      piece.style.animationDuration = (1.5 + Math.random() * 2) + "s";
      piece.style.animationDelay = (Math.random() * 0.8) + "s";
      overlayEl.appendChild(piece);
    }

    setTimeout(() => {
      overlayEl.classList.remove("active");
      overlayEl.innerHTML = "";
    }, duration);
  }

  function showReward(rewardEl, overlayEl) {
    const emojis = ["\uD83C\uDFC6", "\uD83C\uDF89", "\uD83D\uDC51", "\uD83E\uDD84", "\uD83C\uDF08", "\uD83C\uDF8A"];
    rewardEl.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    rewardEl.classList.remove("active");
    void rewardEl.offsetWidth;
    rewardEl.classList.add("active");
    spawnConfetti(overlayEl);
    playChime();
  }

  // ── Wiring Helpers ──
  function wireStartRestart(startId, restartId, fn) {
    document.getElementById(startId).addEventListener("click", fn);
    document.getElementById(restartId).addEventListener("click", fn);
  }

  // ── TTS ──
  let ttsEnabled = localStorage.getItem("kidslearn-tts") !== "off";
  let preferredVoice = null;

  // Pick the best available English voice (prefer natural/premium ones)
  function pickVoice() {
    if (preferredVoice) return preferredVoice;
    const voices = speechSynthesis.getVoices();
    if (!voices.length) return null;

    // Preferred voice names ranked by quality (natural-sounding first)
    const preferred = [
      "Samantha", "Karen", "Daniel", "Moira", "Tessa",       // macOS/iOS premium
      "Google UK English Female", "Google UK English Male",    // Chrome
      "Google US English",                                     // Chrome
      "Microsoft Zira", "Microsoft David",                     // Windows
    ];

    // Try exact name matches first
    for (const name of preferred) {
      const v = voices.find(v => v.name.includes(name) && v.lang.startsWith("en"));
      if (v) { preferredVoice = v; return v; }
    }

    // Fallback: any English voice that isn't the default robotic one
    const english = voices.filter(v => v.lang.startsWith("en"));
    if (english.length > 1) {
      // Prefer non-default voices (they tend to be better quality)
      const nonDefault = english.find(v => !v.default);
      if (nonDefault) { preferredVoice = nonDefault; return nonDefault; }
    }
    if (english.length) { preferredVoice = english[0]; return english[0]; }
    return null;
  }

  // Voices load asynchronously in some browsers
  if (typeof speechSynthesis !== "undefined") {
    speechSynthesis.onvoiceschanged = pickVoice;
    pickVoice(); // try immediately in case already loaded
  }

  // iOS Safari requires speechSynthesis to be triggered from a user gesture.
  // Warm it up on the first tap so later async calls work.
  let ttsUnlocked = false;
  function unlockTTS() {
    if (ttsUnlocked) return;
    ttsUnlocked = true;
    const u = new SpeechSynthesisUtterance("");
    u.volume = 0;
    speechSynthesis.speak(u);
    document.removeEventListener("click", unlockTTS, true);
    document.removeEventListener("touchstart", unlockTTS, true);
  }
  document.addEventListener("click", unlockTTS, true);
  document.addEventListener("touchstart", unlockTTS, true);

  function isTTSEnabled() { return ttsEnabled; }

  function setTTSEnabled(on) {
    ttsEnabled = on;
    localStorage.setItem("kidslearn-tts", on ? "on" : "off");
  }

  function applyVoice(utterance) {
    const voice = pickVoice();
    if (voice) utterance.voice = voice;
  }

  function speak(text, options) {
    if (!ttsEnabled) return Promise.resolve();
    speechSynthesis.cancel();
    return new Promise(resolve => {
      // Short delay after cancel — Android Chrome silently drops
      // utterances if speak() is called immediately after cancel()
      setTimeout(() => {
        const u = new SpeechSynthesisUtterance(text);
        u.rate = (options && options.rate) || 0.85;
        u.pitch = (options && options.pitch) || 1.1;
        u.lang = "en-US";
        applyVoice(u);
        u.onend = function (e) {
          if (options && options.onend) options.onend(e);
          resolve();
        };
        u.onerror = resolve;
        speechSynthesis.speak(u);
      }, 50);
    });
  }

  function speakWord(word, callback) {
    speak(word, { rate: 0.8, onend: callback });
  }

  // Creates a mute toggle button and inserts into the HUD
  function createMuteToggle() {
    const btn = document.createElement("button");
    btn.id = "tts-toggle";
    btn.style.cssText = "background:none;border:none;font-size:22px;cursor:pointer;padding:4px;opacity:0.7;transition:opacity 0.2s;";
    btn.textContent = ttsEnabled ? "\uD83D\uDD0A" : "\uD83D\uDD07";
    btn.title = "Toggle voice";
    btn.addEventListener("click", () => {
      setTTSEnabled(!ttsEnabled);
      btn.textContent = ttsEnabled ? "\uD83D\uDD0A" : "\uD83D\uDD07";
    });
    const hud = document.getElementById("hud");
    if (hud) hud.appendChild(btn);
    return btn;
  }

  return {
    playTone,
    playChime,
    renderStars,
    renderFinalStars,
    showFeedback,
    endGameMessage,
    shuffle,
    pickRandom,
    spawnConfetti,
    showReward,
    wireStartRestart,
    getAudioCtx,
    speak,
    speakWord,
    isTTSEnabled,
    setTTSEnabled,
    createMuteToggle,
  };
})();
