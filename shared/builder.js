/* ── Kids Learn — Vehicle Builder Module ──
 *
 * Progressive build-and-celebrate system for educational games.
 * API: Builder.init(el), Builder.addPart(), Builder.celebrate(cb), Builder.reset()
 */

window.Builder = (function () {

  // ── State ──
  var container = null;
  var currentShape = null;
  var currentColors = null;
  var partsBuilt = 0;
  var cssInjected = false;
  var audioCtx = null;

  function getAudio() {
    if (!audioCtx) {
      audioCtx = (window.KidsGame && KidsGame.getAudioCtx)
        ? KidsGame.getAudioCtx()
        : new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  // ── Color palettes (shared across shapes) ──
  var COLOR_SETS = [
    { c1: "#ff6b8a", c2: "#e8527a", c3: "#b52e45" },
    { c1: "#4a90d9", c2: "#2e6bb5", c3: "#245a9e" },
    { c1: "#45c945", c2: "#2ea82e", c3: "#238f23" },
    { c1: "#f5a623", c2: "#d4891a", c3: "#b87315" },
    { c1: "#a855f7", c2: "#8b3fd9", c3: "#7630bc" },
    { c1: "#f472b6", c2: "#d94f9a", c3: "#c03d84" },
    { c1: "#facc15", c2: "#d4a90e", c3: "#b8920a" },
    { c1: "#22d3ee", c2: "#18a8be", c3: "#1290a3" },
  ];

  // ══════════════════════════════════════════
  //  SHAPES REGISTRY
  // ══════════════════════════════════════════

  var SHAPES = {};

  // ── Rocket ──
  SHAPES.rocket = {
    viewBox: "0 0 140 340",
    width: 140, height: 340,
    svg: function () {
      return '<g id="bp-flame" opacity="0">'
        + '<ellipse cx="70" cy="310" rx="18" ry="28" fill="#ff6600">'
        + '<animate attributeName="ry" values="28;32;26;30;28" dur="0.3s" repeatCount="indefinite"/>'
        + '</ellipse>'
        + '<ellipse cx="70" cy="305" rx="10" ry="18" fill="#ffcc00">'
        + '<animate attributeName="ry" values="18;22;16;20;18" dur="0.25s" repeatCount="indefinite"/>'
        + '</ellipse>'
        + '<ellipse cx="70" cy="302" rx="5" ry="10" fill="#fff">'
        + '<animate attributeName="ry" values="10;12;8;11;10" dur="0.2s" repeatCount="indefinite"/>'
        + '</ellipse>'
        + '</g>'
        + '<g class="builder-part" id="bp-0">'
        + '<rect x="42" y="250" width="56" height="30" rx="4" fill="#555"/>'
        + '<rect x="58" y="275" width="24" height="18" rx="6" fill="#333"/>'
        + '</g>'
        + '<g class="builder-part" id="bp-1">'
        + '<rect x="35" y="180" width="70" height="74" rx="4" fill="var(--bc1)"/>'
        + '<polygon points="35,254 15,254 35,214" fill="var(--bc3)"/>'
        + '<polygon points="105,254 125,254 105,214" fill="var(--bc3)"/>'
        + '</g>'
        + '<g class="builder-part" id="bp-2">'
        + '<rect x="35" y="108" width="70" height="76" rx="4" fill="var(--bc2)"/>'
        + '</g>'
        + '<g class="builder-part" id="bp-3">'
        + '<circle cx="70" cy="145" r="18" fill="#a8e6ff" stroke="#ddd" stroke-width="3"/>'
        + '<circle cx="64" cy="140" r="5" fill="rgba(255,255,255,0.5)"/>'
        + '</g>'
        + '<g class="builder-part" id="bp-4">'
        + '<polygon points="70,40 35,112 105,112" fill="var(--bc2)"/>'
        + '<polygon points="70,40 60,80 80,80" fill="var(--bc1)" opacity="0.5"/>'
        + '</g>';
    },
    hasFlame: true,
    partIds: ["bp-0", "bp-1", "bp-2", "bp-3", "bp-4"],
    celebrateClass: "builder-fly-up",
    celebrateMsg: "LIFTOFF!",
    boyPos: { x: 56, y: 132, size: 22 },
    particles: { color: "rgba(180,180,180,0.7)", origin: "bottom", dir: "down", count: 20 },
    sound: function (ctx) {
      var t = ctx.currentTime;
      var noise = ctx.createOscillator();
      var g = ctx.createGain();
      noise.type = "sawtooth"; noise.frequency.value = 80;
      noise.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.08, t);
      g.gain.linearRampToValueAtTime(0.15, t + 0.5);
      g.gain.exponentialRampToValueAtTime(0.01, t + 2.5);
      noise.start(t); noise.stop(t + 2.5);
      var osc = ctx.createOscillator();
      var g2 = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(200, t);
      osc.frequency.exponentialRampToValueAtTime(800, t + 2);
      osc.connect(g2); g2.connect(ctx.destination);
      g2.gain.setValueAtTime(0.08, t);
      g2.gain.exponentialRampToValueAtTime(0.01, t + 2.5);
      osc.start(t); osc.stop(t + 2.5);
    }
  };

  // ── Car ──
  SHAPES.car = {
    viewBox: "0 0 260 150",
    width: 260, height: 150,
    svg: function () {
      return '<g class="builder-part" id="bp-0">'
        + '<circle cx="70" cy="120" r="22" fill="#333"/><circle cx="70" cy="120" r="12" fill="#888"/>'
        + '<circle cx="190" cy="120" r="22" fill="#333"/><circle cx="190" cy="120" r="12" fill="#888"/>'
        + '</g>'
        + '<g class="builder-part" id="bp-1">'
        + '<rect x="30" y="72" width="200" height="48" rx="10" fill="var(--bc1)"/>'
        + '<rect x="20" y="90" width="220" height="30" rx="6" fill="var(--bc2)"/>'
        + '</g>'
        + '<g class="builder-part" id="bp-2">'
        + '<path d="M80,72 L100,30 L185,30 L210,72 Z" fill="var(--bc2)"/>'
        + '</g>'
        + '<g class="builder-part" id="bp-3">'
        + '<path d="M86,72 L103,36 L140,36 L140,72 Z" fill="#a8e6ff" opacity="0.85"/>'
        + '<path d="M145,72 L145,36 L182,36 L204,72 Z" fill="#a8e6ff" opacity="0.85"/>'
        + '</g>'
        + '<g class="builder-part" id="bp-4">'
        + '<circle cx="240" cy="85" r="8" fill="#ffcc00"/>'
        + '<circle cx="20" cy="85" r="7" fill="#ff3333"/>'
        + '<rect x="100" y="24" width="50" height="6" rx="3" fill="var(--bc3)"/>'
        + '</g>';
    },
    partIds: ["bp-0", "bp-1", "bp-2", "bp-3", "bp-4"],
    celebrateClass: "builder-drive-right",
    celebrateMsg: "VROOM!",
    boyPos: { x: 96, y: 38, size: 22 },
    particles: { color: "rgba(160,140,100,0.6)", origin: "bottom-left", dir: "left", count: 16 },
    sound: function (ctx) {
      var t = ctx.currentTime;
      var osc = ctx.createOscillator();
      var g = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(60, t);
      osc.frequency.exponentialRampToValueAtTime(200, t + 0.8);
      osc.frequency.setValueAtTime(200, t + 0.8);
      osc.frequency.exponentialRampToValueAtTime(350, t + 2.5);
      osc.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.06, t);
      g.gain.linearRampToValueAtTime(0.12, t + 0.5);
      g.gain.exponentialRampToValueAtTime(0.01, t + 2.5);
      osc.start(t); osc.stop(t + 2.5);
    }
  };

  // ── Boat ──
  SHAPES.boat = {
    viewBox: "0 0 260 195",
    width: 260, height: 195,
    hasWater: true,
    svg: function () {
      return '<g id="bp-water" opacity="0">'
        + '<path d="M0,170 Q30,162 65,170 T130,170 T195,170 T260,170 L260,195 L0,195 Z" fill="rgba(100,180,255,0.4)">'
        + '<animate attributeName="d" values="M0,170 Q30,162 65,170 T130,170 T195,170 T260,170 L260,195 L0,195 Z;M0,172 Q30,165 65,172 T130,168 T195,172 T260,168 L260,195 L0,195 Z;M0,170 Q30,162 65,170 T130,170 T195,170 T260,170 L260,195 L0,195 Z" dur="1.5s" repeatCount="indefinite"/>'
        + '</path>'
        + '<path d="M0,178 Q35,172 70,178 T140,178 T210,178 T260,178 L260,195 L0,195 Z" fill="rgba(70,150,230,0.3)">'
        + '<animate attributeName="d" values="M0,178 Q35,172 70,178 T140,178 T210,178 T260,178 L260,195 L0,195 Z;M0,176 Q35,182 70,176 T140,180 T210,176 T260,180 L260,195 L0,195 Z;M0,178 Q35,172 70,178 T140,178 T210,178 T260,178 L260,195 L0,195 Z" dur="2s" repeatCount="indefinite"/>'
        + '</path>'
        + '<circle cx="35" cy="160" r="4" fill="rgba(255,255,255,0.6)" opacity="0">'
        + '<animate attributeName="opacity" values="0;0.8;0" dur="0.8s" begin="0.2s" repeatCount="indefinite"/>'
        + '<animate attributeName="cy" values="165;155" dur="0.8s" begin="0.2s" repeatCount="indefinite"/>'
        + '</circle>'
        + '<circle cx="55" cy="158" r="3" fill="rgba(255,255,255,0.6)" opacity="0">'
        + '<animate attributeName="opacity" values="0;0.7;0" dur="0.7s" begin="0.5s" repeatCount="indefinite"/>'
        + '<animate attributeName="cy" values="163;152" dur="0.7s" begin="0.5s" repeatCount="indefinite"/>'
        + '</circle>'
        + '<circle cx="20" cy="160" r="3" fill="rgba(255,255,255,0.5)" opacity="0">'
        + '<animate attributeName="opacity" values="0;0.6;0" dur="0.9s" begin="0.8s" repeatCount="indefinite"/>'
        + '<animate attributeName="cy" values="164;154" dur="0.9s" begin="0.8s" repeatCount="indefinite"/>'
        + '</circle>'
        + '</g>'
        + '<g class="builder-part" id="bp-0">'
        + '<path d="M30,130 L50,165 L210,165 L230,130 Z" fill="var(--bc2)"/>'
        + '</g>'
        + '<g class="builder-part" id="bp-1">'
        + '<rect x="60" y="100" width="140" height="34" rx="4" fill="var(--bc1)"/>'
        + '</g>'
        + '<g class="builder-part" id="bp-2">'
        + '<rect x="90" y="65" width="80" height="38" rx="4" fill="var(--bc1)"/>'
        + '<rect x="90" y="58" width="80" height="10" rx="3" fill="var(--bc2)"/>'
        + '</g>'
        + '<g class="builder-part" id="bp-3">'
        + '<circle cx="120" cy="80" r="10" fill="#a8e6ff" stroke="#ddd" stroke-width="2"/>'
        + '<circle cx="150" cy="80" r="10" fill="#a8e6ff" stroke="#ddd" stroke-width="2"/>'
        + '</g>'
        + '<g class="builder-part" id="bp-4">'
        + '<rect x="128" y="15" width="4" height="50" fill="#8B6914"/>'
        + '<polygon points="132,15 132,45 175,30" fill="var(--bc3)"/>'
        + '</g>';
    },
    partIds: ["bp-0", "bp-1", "bp-2", "bp-3", "bp-4"],
    celebrateClass: "builder-sail-right",
    celebrateMsg: "BON VOYAGE!",
    boyPos: { x: 108, y: 68, size: 20 },
    particles: { color: "rgba(100,180,255,0.5)", origin: "bottom", dir: "side", count: 14 },
    sound: function (ctx) {
      var t = ctx.currentTime;
      var osc = ctx.createOscillator();
      var g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.linearRampToValueAtTime(220, t + 0.5);
      osc.frequency.linearRampToValueAtTime(160, t + 1);
      osc.frequency.linearRampToValueAtTime(200, t + 2.5);
      osc.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.06, t);
      g.gain.linearRampToValueAtTime(0.1, t + 0.3);
      g.gain.exponentialRampToValueAtTime(0.01, t + 2.5);
      osc.start(t); osc.stop(t + 2.5);
    }
  };

  // ── Airplane ──
  // Based on CodePen by jublaustein. Passenger jet, nose faces right, tilted up.
  SHAPES.airplane = {
    viewBox: "-40 -20 580 460",
    width: 270, height: 215,
    svg: function () {
      return '<g transform="rotate(-20, 260, 220)">'
        + '<g class="builder-part" id="bp-0">'
        // Tail fin
        + '<path d="M48,0 L48,108 C48,108 97,116 136,129 L87,12 Z" fill="var(--bc2)"/>'
        + '</g>'
        + '<g class="builder-part" id="bp-1">'
        // Fuselage body
        + '<path d="M0,99 C0,99 30,174 149,224 L205,242 L101,333 C101,333 139,351 160,343 C239,317 307,273 307,273 L429,311 C429,311 512,334 498,297 C477,242 402,213 402,213 C402,213 162,136 110,121 C60,107 0,99 0,99 Z" fill="var(--bc1)"/>'
        // Belly highlight
        + '<path d="M150,224 L205,242 L101,333 C101,333 139,351 160,343 C239,317 307,273 307,273 L429,311 C429,311 470,322 485,312 L402,213 C402,213 300,180 150,224 Z" fill="var(--bc2)" opacity="0.15"/>'
        + '</g>'
        + '<g id="bp-flame" opacity="0">'
        // Jet exhaust flame shooting left from tail
        + '<ellipse cx="-15" cy="112" rx="55" ry="16" fill="#ff6600">'
        + '<animate attributeName="rx" values="55;65;48;60;55" dur="0.3s" repeatCount="indefinite"/>'
        + '</ellipse>'
        + '<ellipse cx="0" cy="112" rx="35" ry="10" fill="#ffcc00">'
        + '<animate attributeName="rx" values="35;42;30;38;35" dur="0.25s" repeatCount="indefinite"/>'
        + '</ellipse>'
        + '<ellipse cx="12" cy="112" rx="18" ry="5" fill="#fff">'
        + '<animate attributeName="rx" values="18;22;14;20;18" dur="0.2s" repeatCount="indefinite"/>'
        + '</ellipse>'
        + '</g>'
        + '<g class="builder-part" id="bp-2">'
        // Wing (visible, top side)
        + '<path d="M211,48 L226,156 L311,183 C311,183 279,99 263,78 C248,56 211,48 211,48 Z" fill="var(--bc3)"/>'
        + '</g>'
        + '<g class="builder-part" id="bp-3">'
        // Windows row along fuselage (glass blue like other vehicles)
        + '<ellipse cx="198" cy="189" rx="12" ry="12" fill="#a8e6ff" stroke="#ddd" stroke-width="2"/>'
        + '<ellipse cx="245" cy="205" rx="12" ry="12" fill="#a8e6ff" stroke="#ddd" stroke-width="2"/>'
        + '<ellipse cx="293" cy="219" rx="12" ry="12" fill="#a8e6ff" stroke="#ddd" stroke-width="2"/>'
        + '<ellipse cx="340" cy="235" rx="12" ry="12" fill="#a8e6ff" stroke="#ddd" stroke-width="2"/>'
        // Window glare highlights
        + '<ellipse cx="194" cy="185" rx="4" ry="3" fill="rgba(255,255,255,0.5)"/>'
        + '<ellipse cx="241" cy="201" rx="4" ry="3" fill="rgba(255,255,255,0.5)"/>'
        + '<ellipse cx="289" cy="215" rx="4" ry="3" fill="rgba(255,255,255,0.5)"/>'
        + '<ellipse cx="336" cy="231" rx="4" ry="3" fill="rgba(255,255,255,0.5)"/>'
        // Windshield at nose (also glass)
        + '<path d="M458,273 L465,252 C481,265 492,284 492,284 Z" fill="#a8e6ff"/>'
        + '</g>'
        + '<g class="builder-part" id="bp-4">'
        // Wheel + strut
        + '<line x1="389" y1="290" x2="380" y2="310" stroke="#455A64" stroke-width="4" stroke-linecap="round"/>'
        + '<circle cx="380" cy="324" r="16" fill="#455A64"/>'
        + '<circle cx="380" cy="324" r="7" fill="#777"/>'
        + '<circle cx="380" cy="324" r="2.5" fill="#999"/>'
        + '</g>'
        + '</g>';
    },
    hasFlame: true,
    partIds: ["bp-0", "bp-1", "bp-2", "bp-3", "bp-4"],
    celebrateClass: "builder-fly-diagonal",
    celebrateMsg: "TAKEOFF!",
    // Boy appears in the first window
    boyPos: { x: 168, y: 152, size: 22 },
    particles: { color: "rgba(255,255,255,0.6)", origin: "left", dir: "left", count: 12 },
    sound: function (ctx) {
      var t = ctx.currentTime;
      var osc = ctx.createOscillator();
      var g = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(600, t + 2);
      osc.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.06, t);
      g.gain.linearRampToValueAtTime(0.12, t + 0.8);
      g.gain.exponentialRampToValueAtTime(0.01, t + 2.5);
      osc.start(t); osc.stop(t + 2.5);
    }
  };

  // ── Hot Air Balloon ──
  SHAPES.balloon = {
    viewBox: "0 0 160 310",
    width: 160, height: 310,
    hasFlame: true,
    svg: function () {
      // Balloon: cx=80, cy=105, ry=70 → bottom at y=175
      // Basket top at y=250. Flame between basket and balloon (~y=220 pointing up)
      // Ropes from basket corners to balloon bottom edges
      return '<g id="bp-flame" opacity="0">'
        + '<ellipse cx="80" cy="228" rx="7" ry="16" fill="#ff6600">'
        + '<animate attributeName="ry" values="16;19;13;17;16" dur="0.3s" repeatCount="indefinite"/>'
        + '</ellipse>'
        + '<ellipse cx="80" cy="224" rx="4" ry="10" fill="#ffcc00">'
        + '<animate attributeName="ry" values="10;13;8;11;10" dur="0.25s" repeatCount="indefinite"/>'
        + '</ellipse>'
        + '<ellipse cx="80" cy="221" rx="2.5" ry="6" fill="#fff">'
        + '<animate attributeName="ry" values="6;8;5;7;6" dur="0.2s" repeatCount="indefinite"/>'
        + '</ellipse>'
        + '</g>'
        + '<g class="builder-part" id="bp-0">'
        + '<rect x="58" y="250" width="44" height="34" rx="4" fill="#8B6914" stroke="#6B4F10" stroke-width="1.5"/>'
        + '<line x1="62" y1="258" x2="98" y2="258" stroke="#6B4F10" stroke-width="1"/>'
        + '<line x1="62" y1="265" x2="98" y2="265" stroke="#6B4F10" stroke-width="1"/>'
        + '<line x1="62" y1="272" x2="98" y2="272" stroke="#6B4F10" stroke-width="1"/>'
        + '</g>'
        + '<g class="builder-part" id="bp-1">'
        + '<line x1="60" y1="250" x2="38" y2="157" stroke="#765" stroke-width="2"/>'
        + '<line x1="100" y1="250" x2="122" y2="157" stroke="#765" stroke-width="2"/>'
        + '<line x1="70" y1="250" x2="52" y2="168" stroke="#765" stroke-width="1.5"/>'
        + '<line x1="90" y1="250" x2="108" y2="168" stroke="#765" stroke-width="1.5"/>'
        + '</g>'
        + '<g class="builder-part" id="bp-2">'
        + '<ellipse cx="80" cy="105" rx="62" ry="70" fill="var(--bc1)"/>'
        + '<ellipse cx="80" cy="178" rx="14" ry="5" fill="var(--bc2)"/>'
        + '</g>'
        + '<g class="builder-part" id="bp-3">'
        + '<path d="M22,90 C22,90 50,105 80,105 C110,105 138,90 138,90 C138,115 115,140 80,150 C45,140 22,115 22,90Z" fill="var(--bc2)" opacity="0.5"/>'
        + '<path d="M28,72 C28,72 52,85 80,85 C108,85 132,72 132,72 C132,90 110,105 80,112 C50,105 28,90 28,72Z" fill="var(--bc3)" opacity="0.35"/>'
        + '</g>'
        + '<g class="builder-part" id="bp-4">'
        + '<ellipse cx="80" cy="35" rx="16" ry="7" fill="var(--bc2)"/>'
        + '<rect x="76" y="28" width="8" height="10" rx="2" fill="var(--bc3)"/>'
        + '<polygon points="74,24 80,14 86,24" fill="var(--bc3)"/>'
        + '</g>';
    },
    partIds: ["bp-0", "bp-1", "bp-2", "bp-3", "bp-4"],
    celebrateClass: "builder-float-up",
    celebrateMsg: "UP, UP & AWAY!",
    boyPos: { x: 64, y: 252, size: 18 },
    particles: { color: "rgba(255,160,50,0.6)", origin: "center-bottom", dir: "up", count: 10 },
    sound: function (ctx) {
      var t = ctx.currentTime;
      var osc = ctx.createOscillator();
      var g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.linearRampToValueAtTime(500, t + 0.3);
      osc.frequency.linearRampToValueAtTime(350, t + 1);
      osc.frequency.linearRampToValueAtTime(600, t + 2.5);
      osc.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.04, t);
      g.gain.linearRampToValueAtTime(0.1, t + 0.3);
      g.gain.exponentialRampToValueAtTime(0.01, t + 2.5);
      osc.start(t); osc.stop(t + 2.5);
    }
  };

  // ══════════════════════════════════════════
  //  CSS INJECTION
  // ══════════════════════════════════════════

  function injectCSS() {
    if (cssInjected) return;
    cssInjected = true;
    var style = document.createElement("style");
    style.id = "builder-styles";
    style.textContent = [
      ".builder-wrap { position:relative; margin:0 auto; }",
      ".builder-wrap svg { display:block; width:100%; height:100%; }",

      ".builder-part { opacity:0; transition:opacity 0.4s; }",
      ".builder-part.built { opacity:1; animation:builder-pop 0.5s ease-out; }",

      "@keyframes builder-pop {",
      "  0%{opacity:0;transform:scale(0.3) rotate(-10deg)}",
      "  60%{opacity:1;transform:scale(1.1) rotate(3deg)}",
      "  100%{opacity:1;transform:scale(1) rotate(0)}",
      "}",

      ".builder-boy { position:absolute; font-size:18px; line-height:1; opacity:0; pointer-events:none; z-index:2; }",
      ".builder-boy.visible { opacity:1; animation:builder-boyIn 0.8s ease-out forwards, builder-wave 0.5s ease-in-out 0.8s 3; }",

      "@keyframes builder-boyIn {",
      "  0%{opacity:0;transform:scale(0.2)} 60%{opacity:1;transform:scale(1.3)} 100%{opacity:1;transform:scale(1)}",
      "}",
      "@keyframes builder-wave {",
      "  0%,100%{transform:rotate(0)} 50%{transform:rotate(12deg)}",
      "}",

      ".builder-msg { position:absolute; top:35%; left:50%; transform:translate(-50%,-50%); font-size:36px; font-weight:900; color:#ffd700; z-index:15; opacity:0; pointer-events:none; white-space:nowrap; text-shadow:0 2px 8px rgba(0,0,0,0.15); }",
      ".builder-msg.show { animation:builder-msgPop 2.5s forwards; }",

      "@keyframes builder-msgPop {",
      "  0%{opacity:0;transform:translate(-50%,-50%) scale(0.5)}",
      "  20%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}",
      "  80%{opacity:1;transform:translate(-50%,-50%) scale(1)}",
      "  100%{opacity:0;transform:translate(-50%,-80%) scale(1.3)}",
      "}",

      ".builder-particle { position:absolute; border-radius:50%; pointer-events:none; z-index:0; }",

      /* Celebration animations */
      ".builder-fly-up { animation:builder-anim-up 2.5s ease-in forwards; }",
      "@keyframes builder-anim-up {",
      "  0%{transform:translateY(0)} 10%{transform:translateY(5px)} 100%{transform:translateY(-800px)}",
      "}",

      ".builder-drive-right { animation:builder-anim-right 2.5s ease-in forwards; }",
      "@keyframes builder-anim-right {",
      "  0%{transform:translateX(0)} 10%{transform:translateX(-5px)} 100%{transform:translateX(800px)}",
      "}",

      ".builder-sail-right { animation:builder-anim-sail 3s ease-in forwards; }",
      "@keyframes builder-anim-sail {",
      "  0%{transform:translate(0,0)} 25%{transform:translate(30px,-3px)}",
      "  50%{transform:translate(120px,3px)} 100%{transform:translate(800px,-10px)}",
      "}",

      ".builder-fly-diagonal { animation:builder-anim-diag 2.5s ease-in forwards; }",
      "@keyframes builder-anim-diag {",
      "  0%{transform:translate(0,0)} 10%{transform:translate(-5px,3px)} 100%{transform:translate(800px,-400px)}",
      "}",

      ".builder-fly-diagonal-left { animation:builder-anim-diag-left 2.5s ease-in forwards; }",
      "@keyframes builder-anim-diag-left {",
      "  0%{transform:translate(0,0)} 10%{transform:translate(5px,3px)} 100%{transform:translate(-800px,-400px)}",
      "}",

      ".builder-float-up { animation:builder-anim-float 3s ease-in forwards; }",
      "@keyframes builder-anim-float {",
      "  0%{transform:translate(0,0)} 25%{transform:translate(8px,-60px)}",
      "  50%{transform:translate(-8px,-200px)} 100%{transform:translate(5px,-800px)}",
      "}",
    ].join("\n");
    document.head.appendChild(style);
  }

  // ══════════════════════════════════════════
  //  RENDERING
  // ══════════════════════════════════════════

  function render() {
    var shape = currentShape;
    var c = currentColors;

    container.innerHTML = "";
    container.className = "builder-wrap";
    container.style.width = shape.width + "px";
    container.style.height = shape.height + "px";
    container.style.setProperty("--bc1", c.c1);
    container.style.setProperty("--bc2", c.c2);
    container.style.setProperty("--bc3", c.c3);

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", shape.viewBox);
    svg.innerHTML = shape.svg();
    container.appendChild(svg);

    // Boy emoji
    var boy = document.createElement("div");
    boy.className = "builder-boy";
    boy.textContent = "\uD83D\uDC66"; // 👦
    boy.style.left = (shape.boyPos.x / parseInt(shape.viewBox.split(" ")[2]) * 100) + "%";
    boy.style.top = (shape.boyPos.y / parseInt(shape.viewBox.split(" ")[3]) * 100) + "%";
    boy.style.fontSize = shape.boyPos.size + "px";
    container.appendChild(boy);

    // Celebration message
    var msg = document.createElement("div");
    msg.className = "builder-msg";
    msg.textContent = shape.celebrateMsg;
    container.appendChild(msg);
  }

  // ══════════════════════════════════════════
  //  PARTICLES
  // ══════════════════════════════════════════

  function spawnParticles() {
    var shape = currentShape;
    var cfg = shape.particles;
    var parent = container.parentElement || container;
    var cRect = container.getBoundingClientRect();
    var pRect = parent.getBoundingClientRect();

    var baseX, baseY;
    if (cfg.origin === "bottom") {
      baseX = cRect.left - pRect.left + cRect.width / 2;
      baseY = cRect.top - pRect.top + cRect.height;
    } else if (cfg.origin === "bottom-left") {
      baseX = cRect.left - pRect.left + cRect.width * 0.15;
      baseY = cRect.top - pRect.top + cRect.height * 0.85;
    } else if (cfg.origin === "left") {
      baseX = cRect.left - pRect.left;
      baseY = cRect.top - pRect.top + cRect.height / 2;
    } else if (cfg.origin === "right") {
      baseX = cRect.left - pRect.left + cRect.width;
      baseY = cRect.top - pRect.top + cRect.height / 2;
    } else if (cfg.origin === "center-bottom") {
      baseX = cRect.left - pRect.left + cRect.width / 2;
      baseY = cRect.top - pRect.top + cRect.height * 0.7;
    } else {
      baseX = cRect.left - pRect.left + cRect.width / 2;
      baseY = cRect.top - pRect.top + cRect.height / 2;
    }

    var count = 0;
    var interval = setInterval(function () {
      if (count >= cfg.count) { clearInterval(interval); return; }

      var p = document.createElement("div");
      p.className = "builder-particle";
      var size = 10 + Math.random() * 25;
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.background = cfg.color;
      p.style.left = (baseX - size / 2 + (Math.random() - 0.5) * 40) + "px";
      p.style.top = (baseY - size / 2) + "px";
      p.style.transition = "all 1.5s ease-out";
      parent.appendChild(p);

      requestAnimationFrame(function () {
        var dx = (Math.random() - 0.5) * 120;
        var dy = 0;
        if (cfg.dir === "down") { dy = 40 + Math.random() * 60; dx = (Math.random() - 0.5) * 150; }
        else if (cfg.dir === "left") { dx = -(60 + Math.random() * 100); dy = (Math.random() - 0.5) * 40; }
        else if (cfg.dir === "right") { dx = 60 + Math.random() * 100; dy = (Math.random() - 0.5) * 40; }
        else if (cfg.dir === "up") { dy = -(40 + Math.random() * 60); }
        else if (cfg.dir === "side") { dx = (Math.random() - 0.5) * 150; dy = 20 + Math.random() * 40; }

        p.style.left = (parseFloat(p.style.left) + dx) + "px";
        p.style.top = (parseFloat(p.style.top) + dy) + "px";
        p.style.opacity = "0";
        p.style.transform = "scale(" + (1.5 + Math.random()) + ")";
      });

      setTimeout(function () { p.remove(); }, 1600);
      count++;
    }, 80);
  }

  // ══════════════════════════════════════════
  //  API
  // ══════════════════════════════════════════

  var shapeKeys = Object.keys(SHAPES);

  function init(el, shapeKey) {
    injectCSS();
    container = el;

    if (!shapeKey || shapeKey === "random") {
      shapeKey = shapeKeys[Math.floor(Math.random() * shapeKeys.length)];
    }

    currentShape = SHAPES[shapeKey];
    currentColors = COLOR_SETS[Math.floor(Math.random() * COLOR_SETS.length)];
    partsBuilt = 0;

    render();
    return window.Builder;
  }

  function addPart() {
    if (!currentShape || partsBuilt >= currentShape.partIds.length) return partsBuilt;
    var partEl = container.querySelector("#" + currentShape.partIds[partsBuilt]);
    if (partEl) {
      partEl.classList.add("built");
    }
    partsBuilt++;
    return partsBuilt;
  }

  function celebrate(callback) {
    if (!currentShape) { callback && callback(); return; }

    var shape = currentShape;
    var hasBoy = Math.random() < 0.5;
    var boyDelay = hasBoy ? 2500 : 0;

    // Boy surprise
    if (hasBoy) {
      var boy = container.querySelector(".builder-boy");
      if (boy) {
        boy.classList.remove("visible");
        void boy.offsetWidth;
        boy.classList.add("visible");
      }
      // Play chime for boy
      try {
        var ctx = getAudio();
        [523, 659, 784, 1047].forEach(function (freq, i) {
          var osc = ctx.createOscillator();
          var g = ctx.createGain();
          osc.connect(g); g.connect(ctx.destination);
          osc.type = "sine"; osc.frequency.value = freq;
          var t = ctx.currentTime + i * 0.15;
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(0.12, t + 0.05);
          g.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
          osc.start(t); osc.stop(t + 0.5);
        });
      } catch (e) {}
    }

    setTimeout(function () {
      // Ensure particles aren't clipped
      var gameArea = container.parentElement;
      if (gameArea) gameArea.style.overflow = "visible";

      // Activate flame for rocket/balloon
      if (shape.hasFlame) {
        var flameEl = container.querySelector("#bp-flame");
        if (flameEl) flameEl.setAttribute("opacity", "1");
      }

      // Activate water for boat
      if (shape.hasWater) {
        var waterEl = container.querySelector("#bp-water");
        if (waterEl) waterEl.setAttribute("opacity", "1");
      }

      // Spin propeller for airplane
      if (shape.hasPropeller) {
        var prop = container.querySelector("#bp-propeller");
        if (prop) {
          var anim = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
          anim.setAttribute("attributeName", "transform");
          anim.setAttribute("type", "rotate");
          anim.setAttribute("from", "0 507 280");
          anim.setAttribute("to", "360 507 280");
          anim.setAttribute("dur", "0.2s");
          anim.setAttribute("repeatCount", "indefinite");
          prop.appendChild(anim);
        }
      }

      // Particles
      spawnParticles();

      // Sound
      try { shape.sound(getAudio()); } catch (e) {}

      // Exit animation (after short particle lead-in)
      setTimeout(function () {
        container.classList.add(shape.celebrateClass);
        var msg = container.querySelector(".builder-msg");
        if (msg) { msg.classList.add("show"); }
      }, 500);

      // Callback after everything finishes
      setTimeout(function () {
        if (gameArea) gameArea.style.overflow = "";
        callback && callback();
      }, 3200);
    }, boyDelay);
  }

  function reset(shapeKey) {
    if (!container) return;

    if (shapeKey) {
      if (shapeKey === "random") {
        shapeKey = shapeKeys[Math.floor(Math.random() * shapeKeys.length)];
      }
      currentShape = SHAPES[shapeKey];
    }

    currentColors = COLOR_SETS[Math.floor(Math.random() * COLOR_SETS.length)];
    partsBuilt = 0;

    render();
    return window.Builder;
  }

  return {
    init: init,
    addPart: addPart,
    celebrate: celebrate,
    reset: reset,
    SHAPES: SHAPES,
  };
})();
