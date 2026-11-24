(() => {
  const get = id => document.getElementById(id);
  const puzzle = PicturePuzzles.find(game => game.id === new URLSearchParams(location.search).get("game"))
    || PicturePuzzles[0];
  const total = Math.min(puzzle.rounds.length, 5);
  const stage = get("puzzle-stage");
  const scene = get("scene");
  const choices = get("choices");
  const question = get("puzzle-question");
  const feedback = get("puzzle-feedback");
  const ready = get("ready-btn");
  let rounds, turn, stars, mistakes, placed, studying, locked;

  function renderScene(rows) {
    scene.replaceChildren(...PuzzleVisuals.sceneElements(rows));
  }

  function setPrompt(text) {
    question.textContent = text;
    question.focus();
    KidsGame.speak(text);
  }

  function drawChoices(round, order) {
    choices.replaceChildren();
    choices.dataset.layout = round.layout || "";
    order.forEach(index => {
      const tile = round.choices[index];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "puzzle-choice";
      button.setAttribute("aria-label", tile.name);
      button.append(PuzzleVisuals.tileElement(tile));
      button.addEventListener("click", () => pick(round, button, index));
      choices.append(button);
    });
    if (round.center) choices.append(PuzzleVisuals.tileElement(round.center));
  }

  function renderRound() {
    const round = rounds[turn];
    mistakes = false;
    placed = [];
    studying = Boolean(round.study);
    locked = false;
    const indices = round.choices.map((_, index) => index);
    const order = round.layout ? indices : KidsGame.shuffle(indices);
    stage.dataset.layout = round.layout || "";
    stage.dataset.game = puzzle.id;
    get("round-label").textContent = "Round " + (turn + 1) + " of " + total;
    feedback.textContent = "";
    choices.hidden = studying;
    ready.hidden = !studying;
    if (round.lanes) scene.replaceChildren(PuzzleVisuals.trailElement(round.lanes));
    else renderScene(round.study || round.scene);
    drawChoices(round, order);
    setPrompt(studying ? "Look at the pictures. Tap when you’re ready." : round.prompt);
  }

  function pick(round, button, index) {
    if (locked || studying) return;
    const expected = round.placement ? round.answer[placed.length] : round.answer;
    const correct = expected === index;
    const keyboardFocus = button.matches(":focus-visible");
    button.disabled = true;
    KidsGame.playTone(correct);

    if (!correct) {
      mistakes = true;
      button.classList.add("missed");
      feedback.textContent = "Try again";
      if (keyboardFocus) focusNext();
      return;
    }

    button.classList.add("matched");
    if (round.fill) button.replaceChildren(PuzzleVisuals.tileElement(round.fill));
    if (round.placement) {
      placed.push(round.choices[index]);
      const line = round.scene.at(-1);
      renderScene([...round.scene.slice(0, -1), {
        ...line, tiles: line.tiles.map((tile, i) => placed[i] || tile),
      }]);
      if (placed.length < round.answer.length) {
        feedback.textContent = "What comes next?";
        choices.querySelectorAll(".missed").forEach(el => {
          el.disabled = false;
          el.classList.remove("missed");
        });
        if (keyboardFocus) focusNext();
        return;
      }
    }

    locked = true;
    feedback.textContent = "You got it!";
    choices.querySelectorAll("button").forEach(el => { el.disabled = true; });
    if (round.reveal) renderScene(round.reveal);
    if (!mistakes) stars++;
    KidsGame.renderStars(get("stars"), stars, total);
    Builder.addPart();
    setTimeout(() => {
      turn++;
      if (turn < total) renderRound();
      else finish();
    }, 800);
  }

  function focusNext() {
    choices.querySelector("button:enabled")?.focus();
  }

  function finish() {
    get("puzzle-round").hidden = true;
    stage.classList.add("celebrating");
    get("round-label").textContent = "Look what you built!";
    Builder.celebrate(() => {
      get("puzzle-progress").hidden = true;
      stage.classList.remove("celebrating");
      KidsGame.showEndScreen({
        screenEl: get("end-screen"),
        titleEl: get("end-title"),
        messageEl: get("end-message"),
        finalStarsEl: get("final-stars"),
        earned: stars,
        total,
        reward: { rewardEl: get("reward-emoji"), overlayEl: get("reward-overlay") },
      });
      get("end-title").focus();
    });
  }

  function start() {
    turn = 0;
    stars = 0;
    rounds = KidsGame.shuffle(puzzle.rounds).slice(0, total);
    get("start-screen").hidden = true;
    get("end-screen").style.display = "none";
    get("puzzle-round").hidden = false;
    get("puzzle-progress").hidden = false;
    KidsGame.renderStars(get("stars"), stars, total);
    Builder.init(get("vehicle-area"), "random");
    renderRound();
  }

  ready.addEventListener("click", () => {
    const round = rounds[turn];
    studying = false;
    ready.hidden = true;
    choices.hidden = false;
    renderScene(round.scene);
    setPrompt(round.prompt);
  });
  const listen = get("listen-btn");
  listen.hidden = !KidsGame.isTTSEnabled();
  listen.addEventListener("click", () => KidsGame.speak(question.textContent));
  const shelf = "index.html?category=" + encodeURIComponent(puzzle.category) + "#picture-puzzles";
  document.querySelectorAll(".game-back, #end-screen a").forEach(link => { link.href = shelf; });
  KidsGame.wireStartRestart("start-btn", "restart-btn", start);
  document.title = puzzle.title + " · Kids Learn";
  get("puzzle-title").textContent = puzzle.title;
  get("puzzle-description").textContent = puzzle.description;
  get("start-mark").append(PuzzleVisuals.glyph(puzzle.icon));
  stage.dataset.theme = puzzle.category;
  KidsGame.renderStars(get("stars"), 0, total);
})();
