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

  function pickDistractors(pool, correct, count, opts) {
    const options = opts || {};
    const getKey = options.getKey || (item => item);
    const correctKey = getKey(correct);
    const filtered = pool.filter(item => {
      if (getKey(item) === correctKey) return false;
      return !options.filter || options.filter(item, correct);
    });
    return shuffle(filtered).slice(0, count);
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
    const emojis = ["\uD83C\uDFC6", "\uD83C\uDF89", "\uD83D\uDC51", "\uD83E\uDD84", "\uD83C\uDF08", "\uD83C\uDF8A", "\uD83C\uDF81"];
    rewardEl.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    rewardEl.classList.remove("active");
    void rewardEl.offsetWidth;
    rewardEl.classList.add("active");
    spawnConfetti(overlayEl);
    playChime();
  }

  function showEndScreen(opts) {
    const options = opts || {};
    const earned = options.earned || 0;
    const total = options.total || 0;
    const messages = options.messages;
    const result = typeof messages === "function"
      ? messages(earned, total)
      : (messages && messages[earned === total ? "perfect" : earned >= Math.ceil(total * 0.6) ? "good" : "try"])
        || endGameMessage(earned, total);

    if (options.titleEl) options.titleEl.textContent = result.title || "";
    if (options.messageEl) options.messageEl.textContent = result.message || "";
    if (options.finalStarsEl) renderFinalStars(options.finalStarsEl, earned, total);

    const display = function () {
      if (options.screenEl) options.screenEl.style.display = options.display || "flex";
    };

    const reward = options.reward || {};
    const shouldReward = reward.enabled !== false
      && reward.rewardEl
      && reward.overlayEl
      && earned === total
      && Math.random() < (reward.chance == null ? 0.5 : reward.chance);

    if (shouldReward) {
      showReward(reward.rewardEl, reward.overlayEl);
      if (reward.delayScreen) setTimeout(display, reward.delayScreen);
      else display();
    } else {
      display();
    }

    return result;
  }

  function showCanvasFeedback(emoji, x, y, canvasEl, wrapperEl, opts) {
    const options = opts || {};
    const rect = canvasEl.getBoundingClientRect();
    const scaleX = rect.width / canvasEl.width;
    const scaleY = rect.height / canvasEl.height;
    const el = document.createElement("div");
    el.className = options.className || "feedback";
    el.textContent = emoji;
    el.style.left = (canvasEl.offsetLeft + x * scaleX + (options.offsetX || 0)) + "px";
    el.style.top = (canvasEl.offsetTop + y * scaleY + (options.offsetY || 0)) + "px";
    wrapperEl.appendChild(el);
    setTimeout(() => el.remove(), options.duration || 1000);
  }

  // ── Wiring Helpers ──
  function wireStartRestart(startId, restartId, fn) {
    document.getElementById(startId).addEventListener("click", fn);
    document.getElementById(restartId).addEventListener("click", fn);
  }

  function renderLevelSelector(containerEl, levels, onSelect, opts) {
    const options = opts || {};
    const keys = options.keys || Object.keys(levels);
    const startNumber = options.startNumber == null ? 1 : options.startNumber;
    containerEl.innerHTML = "";
    keys.forEach((key, index) => {
      const level = levels[key];
      const isLocked = !!level.locked;
      const btn = document.createElement("button");
      btn.className = (options.buttonClass || "level-btn") + (isLocked ? " locked" : "");
      btn.innerHTML =
        '<div class="level-num">Level ' + (index + startNumber) + '</div>' +
        '<div class="level-name">' + level.name + (isLocked ? ' \uD83D\uDD12' : '') + '</div>' +
        '<div class="level-desc">' + (isLocked ? level.lockedReason : level.description) + '</div>';
      if (!isLocked) {
        btn.addEventListener("click", () => onSelect(key, level));
      }
      containerEl.appendChild(btn);
    });
  }

  // ── TTS ──
  let ttsEnabled = localStorage.getItem("kidslearn-tts") !== "off";
  let preferredVoice = null;
  const voiceCache = {};

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

  // ── Reading word length (3, 4, or 5 letters) ──
  const WORD_LENGTH_KEY = "kidslearn-word-length";

  function getWordLength() {
    const value = Number(localStorage.getItem(WORD_LENGTH_KEY));
    return value === 4 || value === 5 ? value : 3;
  }

  function setWordLength(length) {
    localStorage.setItem(WORD_LENGTH_KEY, String(length));
  }

  // ── Drive vehicle (car or bike, used by Word Drive and Arabic Drive) ──
  const DRIVE_VEHICLE_KEY = "kidslearn-drive-vehicle";

  function getDriveVehicle() {
    const value = localStorage.getItem(DRIVE_VEHICLE_KEY);
    return value === "bike" ? "bike" : "car";
  }

  function setDriveVehicle(vehicle) {
    localStorage.setItem(DRIVE_VEHICLE_KEY, vehicle === "bike" ? "bike" : "car");
  }

  // Lazily loaded top-down bike-with-rider sprite
  let bikeImage = null;
  let bikeImageLoaded = false;
  let carImage = null;
  let carImageLoaded = false;

  function getBikeImage() {
    if (!bikeImage) {
      bikeImage = new Image();
      bikeImage.onload = function () { bikeImageLoaded = true; };
      bikeImage.src = "images/bike-top.png";
    }
    return bikeImage;
  }

  function getCarImage() {
    if (!carImage) {
      carImage = new Image();
      carImage.onload = function () { carImageLoaded = true; };
      carImage.src = "images/car-top.png";
    }
    return carImage;
  }

  // Draws a top-down car or bike centered at (x, y) for lane-driving games.
  function drawTopDownVehicle(ctx, x, y, w, h, vehicle) {
    if (vehicle === "bike") {
      const img = getBikeImage();
      if (bikeImageLoaded) {
        ctx.drawImage(img, x - w / 2, y - h / 2, w, h);
      }
      return;
    }

    const carSprite = getCarImage();
    if (carImageLoaded) {
      ctx.drawImage(carSprite, x - w / 2, y - h / 2, w, h);
      return;
    }

    // Car body
    ctx.fillStyle = "#ff6b8a";
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - h / 2, w, h, 10);
    ctx.fill();

    // Windshield
    ctx.fillStyle = "#7ec8e3";
    ctx.beginPath();
    ctx.roundRect(x - w / 2 + 8, y - h / 2 + 8, w - 16, 18, 5);
    ctx.fill();

    // Wheels
    ctx.fillStyle = "#222";
    ctx.fillRect(x - w / 2 - 5, y - h / 2 + 5, 8, 16);
    ctx.fillRect(x + w / 2 - 3, y - h / 2 + 5, 8, 16);
    ctx.fillRect(x - w / 2 - 5, y + h / 2 - 21, 8, 16);
    ctx.fillRect(x + w / 2 - 3, y + h / 2 - 21, 8, 16);

    // Headlights
    ctx.fillStyle = "#ffd700";
    ctx.beginPath();
    ctx.arc(x - w / 2 + 10, y - h / 2 + 2, 4, 0, Math.PI * 2);
    ctx.arc(x + w / 2 - 10, y - h / 2 + 2, 4, 0, Math.PI * 2);
    ctx.fill();
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

  function pickVoiceForLang(lang, preferredPatterns) {
    const voices = speechSynthesis.getVoices();
    if (!voices.length) return null;
    const cacheKey = lang + "|" + (preferredPatterns || []).join(",");
    if (voiceCache[cacheKey]) return voiceCache[cacheKey];

    const patterns = preferredPatterns || [];
    for (const pattern of patterns) {
      const voice = voices.find(v => pattern.test(v.lang) || pattern.test(v.name));
      if (voice) {
        voiceCache[cacheKey] = voice;
        return voice;
      }
    }

    const baseLang = lang.split("-")[0];
    const fallback = voices.find(v => v.lang === lang) || voices.find(v => v.lang && v.lang.split("-")[0] === baseLang);
    if (fallback) voiceCache[cacheKey] = fallback;
    return fallback || null;
  }

  function speakLang(text, options) {
    const opts = options || {};
    speechSynthesis.cancel();
    return new Promise(resolve => {
      setTimeout(() => {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = opts.lang || "en-US";
        u.rate = opts.rate || 0.85;
        u.pitch = opts.pitch || 1.1;
        const voice = pickVoiceForLang(u.lang, opts.preferredPatterns);
        if (voice) u.voice = voice;
        u.onend = resolve;
        u.onerror = resolve;
        speechSynthesis.speak(u);
      }, opts.delay == null ? 50 : opts.delay);
    });
  }

  function createWordAudioPlayer(opts) {
    const options = opts || {};
    let currentAudio = null;
    return function playWordAudio(word) {
      if (word && word.tts) {
        return speakLang(word.text, {
          lang: options.ttsLang || "ar-SA",
          rate: options.ttsRate || 0.7,
          pitch: options.ttsPitch || 1.1,
          preferredPatterns: options.preferredPatterns || [/ar[-_]SA/i, /^ar/i],
        });
      }
      return new Promise(resolve => {
        if (currentAudio) {
          currentAudio.pause();
          currentAudio = null;
        }
        const audio = new Audio(options.getAudioURL(word));
        currentAudio = audio;
        audio.onended = function () { currentAudio = null; resolve(); };
        audio.onerror = function () { currentAudio = null; resolve(); };
        audio.play().catch(function () { resolve(); });
      });
    };
  }

  // Creates a looping car-driving sound player. Plays from the start, then
  // once the clip ends, loops the tail segment (loopStart..end) continuously.
  function createDrivingSoundPlayer(opts) {
    const options = opts || {};
    const src = options.src || "audio/car-drive.mp3";
    const loopStart = options.loopStart != null ? options.loopStart : 18;
    const rate = options.rate || 1;
    const crossfadeSec = options.crossfadeSec != null ? options.crossfadeSec : 0.35;

    // Two copies of the clip so the tail of one can fade out while the
    // next loop (starting at loopStart) fades in, instead of a hard cut.
    const audioA = new Audio(src);
    const audioB = new Audio(src);
    audioA.playbackRate = rate;
    audioB.playbackRate = rate;

    let current = audioA;
    let next = audioB;
    let rafId = null;
    let crossfading = false;
    let volume = 1;

    function onTimeUpdate() {
      if (crossfading) return;
      const dur = current.duration || 0;
      if (dur && current.currentTime >= dur - crossfadeSec) {
        crossfadeToNext();
      }
    }

    function watch() {
      current.removeEventListener("timeupdate", onTimeUpdate);
      current.addEventListener("timeupdate", onTimeUpdate);
    }

    function crossfadeToNext() {
      crossfading = true;
      next.currentTime = loopStart;
      next.volume = 0;
      next.play().catch(function () {});
      const startTime = performance.now();
      (function tick() {
        const t = Math.min(1, (performance.now() - startTime) / 1000 / crossfadeSec);
        current.volume = (1 - t) * volume;
        next.volume = t * volume;
        if (t < 1) {
          rafId = requestAnimationFrame(tick);
          return;
        }
        current.pause();
        const finished = current;
        current = next;
        next = finished;
        crossfading = false;
        watch();
      })();
    }

    return {
      start: function () {
        this.stop();
        current = audioA;
        next = audioB;
        next.volume = 0;
        current.volume = volume;
        current.play().catch(function () {});
        watch();
      },
      stop: function () {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        crossfading = false;
        audioA.pause();
        audioB.pause();
        audioA.currentTime = 0;
        audioB.currentTime = 0;
        audioA.removeEventListener("timeupdate", onTimeUpdate);
        audioB.removeEventListener("timeupdate", onTimeUpdate);
      },
      setVolume: function (level) {
        const previous = volume;
        volume = Math.max(0, Math.min(1, level));
        if (previous) {
          audioA.volume = audioA.volume / previous * volume;
          audioB.volume = audioB.volume / previous * volume;
        } else {
          current.volume = volume;
        }
      },
    };
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
    pickDistractors,
    spawnConfetti,
    showReward,
    showEndScreen,
    showCanvasFeedback,
    wireStartRestart,
    renderLevelSelector,
    getAudioCtx,
    speak,
    speakWord,
    speakLang,
    createWordAudioPlayer,
    isTTSEnabled,
    setTTSEnabled,
    getWordLength,
    setWordLength,
    getDriveVehicle,
    setDriveVehicle,
    drawTopDownVehicle,
    createMuteToggle,
    createDrivingSoundPlayer,
  };
})();
