(() => {
  const game = GameCatalog.creative.find(entry => entry.id === new URLSearchParams(location.search).get("game"))
    || GameCatalog.creative[0];
  const stage = document.getElementById("creative-stage");
  const tools = document.getElementById("game-tools");
  const board = document.getElementById("creative-board");
  const actions = document.getElementById("action-tools");
  const prompt = document.getElementById("creative-prompt");
  const status = document.getElementById("creative-status");
  const guidance = document.getElementById("creative-listen");
  guidance.hidden = !KidsGame.isTTSEnabled();
  guidance.addEventListener("click", () => KidsGame.speak(prompt.textContent));
  const storageKey = "kidslearn-create-" + game.id;
  const state = read();
  document.title = game.title + " · Kids Learn";
  document.getElementById("creative-title").textContent = game.title;
  stage.dataset.theme = game.theme;
  stage.dataset.game = game.id;

  function read() {
    try { return JSON.parse(localStorage.getItem(storageKey)) || {}; }
    catch { return {}; }
  }

  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); }
    catch { /* Play still works when local storage is unavailable. */ }
  }

  function image(name, alt = "") {
    const img = document.createElement("img");
    img.src = "images/puzzles/" + name + ".webp";
    img.alt = alt;
    img.draggable = false;
    return img;
  }

  function button(label, onClick, parent, className = "creative-button") {
    const el = document.createElement("button");
    el.type = "button";
    el.className = className;
    el.textContent = label;
    el.addEventListener("click", onClick);
    parent.append(el);
    return el;
  }

  function pickButtons(parent, choices, active, onPick, render) {
    const buttons = choices.map(([id, label]) => {
      const el = button(label, () => {
        for (const [key, choice] of buttons) choice.setAttribute("aria-pressed", String(id === key));
        onPick(id);
      }, parent);
      el.setAttribute("aria-label", label);
      el.setAttribute("aria-pressed", String(id === active));
      if (render) render(el, id);
      return [id, el];
    });
  }

  function editor(pages, draw) {
    const hasPage = id => pages.some(([name]) => name === id);
    let page = hasPage(state.page) ? state.page : pages[0][0];
    const edits = state.edits ||= {};
    const history = [];
    const menu = document.createElement("div");
    const options = document.createElement("div");
    menu.className = options.className = "tool-group";
    tools.append(menu);
    actions.append(options);
    const undo = button("Undo", () => {
      const { index, previous } = history.pop();
      set(index, previous);
    }, actions);
    let refresh;

    function set(index, value) {
      edits[page][index] = value;
      undo.disabled = history.length === 0;
      save();
      refresh(index);
    }

    function open() {
      history.length = 0;
      undo.disabled = true;
      board.replaceChildren();
      options.replaceChildren();
      edits[page] ||= {};
      refresh = draw(page, edits[page], options, (index, value) => {
        if ((edits[page][index] || null) === value) return;
        history.push({ index, previous: edits[page][index] || null });
        set(index, value);
      });
    }

    pickButtons(menu, pages, page, id => {
      if (id === page) return;
      state.page = page = id;
      save();
      open();
    });
    open();
  }

  const habitats = {
    garden: [["rabbit", "Rabbit"], ["bee", "Bee"], ["butterfly", "Butterfly"], ["sunflower", "Sunflower"], ["snail", "Snail"]],
    pond: [["duck", "Duck"], ["turtle", "Turtle"], ["flamingo", "Flamingo"], ["butterfly", "Butterfly"], ["sunflower", "Sunflower"]],
    snow: [["penguin", "Penguin"], ["owl", "Owl"], ["fox", "Fox"], ["rabbit", "Rabbit"], ["scarf", "Scarf"]],
  };

  function world() {
    prompt.textContent = "Pick a sticker, then tap a spot in your world.";
    editor([["garden", "Garden"], ["pond", "Pond"], ["snow", "Snow"]], (page, edits, options, place) => {
      const stickers = habitats[page];
      let selected = stickers[0][0];
      board.dataset.art = page;
      pickButtons(options, [...stickers, [null, "Erase"]], selected, id => { selected = id; }, (el, id) => {
        if (id) el.replaceChildren(image(id));
      });
      const cells = Array.from({ length: 8 }, (_, i) => button("", () => place(i, selected), board, "habitat-cell"));

      function refresh(i) {
        const id = edits[i];
        const name = stickers.find(([key]) => key === id)?.[1];
        cells[i].setAttribute("aria-label", name ? name + " at spot " + (i + 1) : "Empty spot " + (i + 1));
        if (name) cells[i].replaceChildren(image(id));
        else cells[i].textContent = "+";
        cells[i].classList.toggle("filled", Boolean(name));
      }

      cells.forEach((_, i) => refresh(i));
      return refresh;
    });
  }

  const colors = [
    ["#ff6d70", "Coral"], ["#ffc64e", "Gold"], ["#64c891", "Mint"],
    ["#55b4e7", "Sky blue"], ["#966be6", "Violet"], ["#f39ac2", "Pink"], ["#fffdf8", "Cream"],
  ];
  const drawings = {
    butterfly: ["Top left wing", "Top right wing", "Bottom left wing", "Bottom right wing", "Body"],
    rocket: ["Body", "Nose", "Left fin", "Right fin", "Window", "Flame"],
    garden: ["Left flower", "Right flower", "Flower center", "Leaf", "Flowerpot"],
  };

  function color() {
    prompt.textContent = "Pick a color, then tap a part of the picture.";
    editor([["butterfly", "Butterfly"], ["rocket", "Rocket"], ["garden", "Garden"]], (page, edits, options, paint) => {
      let selected = colors[0][0];
      board.dataset.art = page;
      pickButtons(options, colors, selected, id => { selected = id; }, (el, id) => {
        el.textContent = "";
        el.classList.add("paint-swatch");
        el.style.setProperty("--paint", id);
      });
      const pieces = drawings[page].map((label, i) => {
        const el = button("", () => paint(i, selected), board, "paint-piece");
        el.setAttribute("aria-label", label);
        return el;
      });

      function refresh(i) {
        const fill = colors.find(([id]) => id === edits[i]);
        pieces[i].style.setProperty("--fill", fill?.[0] || "var(--paper)");
        pieces[i].setAttribute("aria-label", drawings[page][i] + (fill ? ", " + fill[1] : ""));
      }

      pieces.forEach((_, i) => refresh(i));
      return refresh;
    });
  }

  function music() {
    const notes = [["Low C", 261.63], ["E", 329.63], ["G", 392], ["High C", 523.25]];
    const tunes = [[0, 2], [1, 0, 2], [2, 1, 3, 0], [0, 2, 3, 2, 0]];
    let copy = false;
    let demo = false;
    let round = 0;
    let step = 0;
    let playback = 0;
    const stars = document.createElement("div");
    stars.className = "music-stars";
    tools.after(stars);
    const replay = button("Listen again", listen, actions);
    replay.hidden = true;
    const pads = notes.map(([label], i) => button(label, () => hit(i), board, "music-pad"));
    prompt.textContent = "Tap the keys to make a tune.";

    pickButtons(tools, [["free", "Make a tune"], ["copy", "Copy a tune"]], "free", id => {
      const wantsCopy = id === "copy";
      if (wantsCopy === copy) return;
      playback++;
      copy = wantsCopy;
      round = 0;
      replay.hidden = !copy;
      stars.hidden = !copy;
      status.textContent = "";
      if (copy) {
        KidsGame.renderStars(stars, 0, tunes.length);
        listen();
      } else {
        setDemo(false);
        guidance.disabled = false;
        prompt.parentElement.hidden = false;
        prompt.textContent = "Tap the keys to make a tune.";
      }
    });
    stars.hidden = true;

    function setDemo(playing) {
      demo = playing;
      for (const pad of pads) pad.setAttribute("aria-disabled", String(playing));
    }

    function sound(i) {
      const ctx = KidsGame.getAudioCtx();
      if (ctx.state === "suspended") ctx.resume().catch(() => {});
      const osc = ctx.createOscillator();
      const volume = ctx.createGain();
      const now = ctx.currentTime;
      osc.type = "triangle";
      osc.frequency.value = notes[i][1];
      volume.gain.setValueAtTime(0.001, now);
      volume.gain.exponentialRampToValueAtTime(0.18, now + 0.025);
      volume.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc.connect(volume).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
      pads[i].animate([{ transform: "translateY(4px)", filter: "brightness(1.18)" }, {}], { duration: 300 });
    }

    function listen() {
      if (!copy) return;
      if (round === tunes.length) {
        round = 0;
        KidsGame.renderStars(stars, 0, tunes.length);
      }
      const tune = tunes[round];
      const token = ++playback;
      setDemo(true);
      guidance.disabled = true;
      step = 0;
      replay.textContent = "Listen again";
      prompt.parentElement.hidden = false;
      prompt.textContent = "Watch and listen to the tune.";
      status.textContent = "";
      tune.forEach((note, i) => {
        if (i === 0) sound(note);
        else setTimeout(() => { if (token === playback) sound(note); }, i * 470);
      });
      setTimeout(() => {
        if (token !== playback) return;
        setDemo(false);
        guidance.disabled = false;
        prompt.textContent = "Your turn. Tap the same keys in order.";
      }, tune.length * 470);
    }

    function hit(i) {
      if (demo || (copy && round === tunes.length)) return;
      sound(i);
      if (!copy) return;

      if (i !== tunes[round][step]) {
        step = 0;
        status.textContent = "Try from the first note again.";
      } else if (++step === tunes[round].length) {
        round++;
        KidsGame.renderStars(stars, round, tunes.length);
        status.textContent = round === tunes.length ? "You copied every tune!" : "You got it!";
        replay.textContent = round === tunes.length ? "Play again" : "Next tune";
        if (round === tunes.length) prompt.parentElement.hidden = true;
        setDemo(true);
      } else {
        status.textContent = step + " of " + tunes[round].length + " notes";
      }
    }
  }

  function pets() {
    const animals = [["dog", "Puppy"], ["rabbit", "Rabbit"], ["turtle", "Turtle"]];
    const needs = ["Food", "Fun", "Rest"];
    const petNames = new Map(animals);
    let selected = petNames.has(state.pet) ? state.pet : animals[0][0];
    const care = state.care ||= {};
    prompt.textContent = "Pick a pet. Feed them, play, or take a nap.";
    pickButtons(tools, animals, selected, pet => {
      selected = state.pet = pet;
      status.textContent = "";
      save();
      render();
    }, (el, id) => el.replaceChildren(image(id), document.createTextNode(petNames.get(id))));
    const portrait = image(selected, petNames.get(selected));
    portrait.className = "pet-portrait";
    const meters = document.createElement("div");
    meters.className = "pet-meters";
    board.append(portrait, meters);
    const values = needs.map(label => {
      const name = document.createElement("label");
      const value = document.createElement("meter");
      value.min = 0;
      value.max = 3;
      name.append(label, value);
      meters.append(name);
      return value;
    });
    ["Feed", "Play", "Nap"].forEach((label, action) => button(label, () => lookAfter(action), actions));

    function render() {
      const stats = care[selected] ||= [2, 1, 2];
      portrait.src = "images/puzzles/" + selected + ".webp";
      portrait.alt = petNames.get(selected);
      values.forEach((meter, i) => { meter.value = stats[i]; });
    }

    function lookAfter(action) {
      const stats = care[selected];
      if (action === 1 && !stats[2]) {
        status.textContent = "Your pet is sleepy. Try a nap.";
        return;
      }
      if (action === 0) stats[0] = 3;
      if (action === 1) {
        stats[1] = 3;
        stats[2]--;
        stats[0] = Math.max(0, stats[0] - 1);
      }
      if (action === 2) stats[2] = 3;
      save();
      render();
      status.textContent = ["Yum! A full tummy.", "That was fun!", "All rested!"][action];
      const move = [
        [{ scale: 1 }, { scale: 1.11, rotate: "3deg" }, { scale: 1 }],
        [{ translate: "0" }, { translate: "0 -18px", rotate: "-5deg" }, { translate: "0" }],
        [{ rotate: "0deg" }, { rotate: "-10deg", translate: "0 8px" }, { rotate: "0deg" }],
      ];
      portrait.animate(move[action], { duration: 550, easing: "ease-in-out" });
    }

    render();
  }

  ({ world, color, music, pets })[game.id]();
})();
