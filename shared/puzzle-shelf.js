(() => {
  const categories = new Map([
    ["All", "All games"], ["Reading", "Reading"], ["Create", "Create"], ["Logic", "Logic"], ["Maths", "Maths"],
    ["Spatial", "Shapes & Space"], ["Memory & Focus", "Memory"], ["Talk & Listen", "Listening"],
    ["Hindi", "Hindi"], ["Arabic", "Arabic"],
  ]);
  const all = [...GameCatalog.creative, ...PicturePuzzles, ...GameCatalog.legacy];
  const games = [...categories.keys()].flatMap(category => all.filter(game => game.category === category));
  const filters = document.getElementById("puzzle-filters");
  const shelf = document.getElementById("puzzle-shelf");
  const requested = new URLSearchParams(location.search).get("category");

  function card(game) {
    const link = document.createElement("a");
    link.className = "shelf-card";
    link.dataset.theme = game.theme || game.category;
    link.href = game.href || "puzzle-game.html?game=" + game.id;

    const art = document.createElement("span");
    art.className = "shelf-art";
    art.setAttribute("aria-hidden", "true");
    const round = game.rounds?.[0];
    if (round) {
      const [line] = round.study || (game.id === "peek" ? round.reveal : round.scene);
      const showChoices = (round.placement && game.id !== "sentence-builder") || ["listen", "sounds", "feelings", "descriptions", "trail", "slices", "last-sound", "picture-to-word"].includes(game.id);
      const preview = showChoices
        ? { tiles: round.choices.slice(0, 3), style: game.id === "strips" ? "strips" : "" }
        : { ...line, tiles: line.tiles.slice(0, 3) };
      art.append(...PuzzleVisuals.sceneElements([preview]));
    } else if (game.preview) {
      const tiles = game.preview.map(icon => ({ icon }));
      art.append(...PuzzleVisuals.sceneElements([{ tiles }]));
    } else {
      art.append(PuzzleVisuals.glyph(game.icon));
    }

    const name = document.createElement("span");
    name.className = "shelf-name";
    name.textContent = game.title;

    const caption = document.createElement("span");
    caption.className = "shelf-caption";
    caption.textContent = game.description;

    link.append(art, name, caption);
    return link;
  }

  function show(category) {
    for (const button of filters.children) {
      button.setAttribute("aria-pressed", String(button.dataset.category === category));
    }
    const visible = category === "All" ? games : games.filter(game => game.category === category);
    shelf.replaceChildren(...visible.map(card));
  }

  for (const [category, label] of categories) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "shelf-filter";
    button.textContent = label;
    button.dataset.category = category;
    button.addEventListener("click", () => show(category));
    filters.append(button);
  }

  show(categories.has(requested) ? requested : "All");
  document.getElementById("picture-puzzles").hidden = false;
})();
