window.PuzzleVisuals = (() => {
  const art = new Map([
    ["🐌", "snail"], ["🐝", "bee"], ["🐢", "turtle"], ["🦒", "giraffe"],
    ["🐘", "elephant"], ["🦓", "zebra"], ["🦜", "parrot"], ["🦉", "owl"],
    ["🐧", "penguin"], ["🐰", "rabbit"], ["🐇", "rabbit"], ["🐼", "panda"],
    ["🦊", "fox"], ["🐵", "monkey"], ["🦛", "hippo"], ["🐙", "octopus"], ["🐬", "dolphin"],
    ["🎸", "guitar"], ["🛴", "scooter"], ["🛞", "wheel"], ["🔦", "flashlight"],
    ["🔋", "battery"], ["📷", "camera"], ["🖼", "picture-frame"], ["☂", "umbrella"],
    ["🧦", "sock"], ["🥾", "boot"], ["🪥", "toothbrush"], ["🦷", "tooth"],
    ["📬", "mailbox"], ["✉", "letter"], ["🎨", "palette"], ["🖌", "paintbrush"],
    ["😄", "happy"], ["😊", "happy"], ["😢", "sad"], ["😲", "surprised"],
    ["😴", "sleepy"], ["😠", "angry"], ["🧑‍🍳", "baker"], ["🧑‍🚒", "firefighter"],
    ["🧑‍⚕", "doctor"], ["🧑‍🌾", "farmer"], ["🧑‍🔧", "mechanic"], ["🧑‍🏫", "teacher"],
    ["🧑‍🚀", "astronaut"], ["🎈", "balloon"], ["🪁", "kite"], ["🧣", "scarf"], ["🧸", "teddy-bear"],
    ["🦋", "butterfly"], ["🍓", "strawberry"], ["🐞", "ladybird"], ["🍁", "maple-leaf"],
    ["🐥", "chick"], ["🐤", "chick"], ["🦀", "crab"], ["🦩", "flamingo"], ["🐋", "whale"],
    ["🦆", "duck"], ["🐄", "cow"], ["🐑", "sheep"], ["🐶", "dog"],
    ["🍎", "apple"], ["🍌", "banana"], ["🍐", "pear"], ["🌻", "sunflower"],
  ]);

  function glyph(icon) {
    const mark = document.createElement("span");
    const imageName = typeof icon === "string" && art.get(icon.replaceAll("\uFE0F", ""));
    if (imageName) {
      const image = document.createElement("img");
      image.src = "images/puzzles/" + imageName + ".webp";
      image.className = "tile-illustration";
      image.alt = "";
      image.draggable = false;
      mark.append(image);
    } else {
      mark.textContent = icon;
    }
    return mark;
  }

  function tileElement(tile) {
    const el = document.createElement("span");
    el.className = "picture-tile";
    if (tile.style) el.classList.add(tile.style);
    if (tile.name) {
      el.setAttribute("role", "img");
      el.setAttribute("aria-label", tile.name);
    } else {
      el.setAttribute("aria-hidden", "true");
    }
    if (tile.scale) el.style.setProperty("--scale", tile.scale);

    if (tile.tiles) {
      el.classList.add("tile-group");
      el.append(...tile.tiles.map(tileElement));
    } else if (tile.form || tile.fruit) {
      const figure = document.createElement("span");
      figure.className = tile.form
        ? "puzzle-shape " + tile.color + " " + tile.form
        : "puzzle-fruit " + tile.fruit + (tile.cut ? " cut" : "");
      el.append(figure);
    } else if (tile.file) {
      el.classList.add(tile.slice == null ? "picture-photo" : "picture-strip");
      el.style.backgroundImage = 'url("images/sentence/' + tile.file + '.jpg")';
      if (tile.slice != null) el.style.backgroundPosition = "center " + tile.slice * 50 + "%";
    } else {
      el.append(glyph(tile.icon));
    }
    return el;
  }

  function trailElement(lanes) {
    const board = document.createElement("div");
    board.className = "trail-board";
    board.setAttribute("role", "img");
    const starts = ["on the left", "in the middle", "on the right"];
    const directions = lanes.slice(1).map((lane, i) =>
      lane === lanes[i] ? "straight down" : lane < lanes[i] ? "down to the left" : "down to the right");
    board.setAttribute("aria-label", "The dog starts " + starts[lanes[0]] + ". The trail goes " + directions.join(", then ") + ".");

    const dog = glyph("🐶");
    dog.className = "trail-dog";
    const x = lane => 100 + lane * 200;
    dog.style.left = x(lanes[0]) / 6 + "%";
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 310;
    canvas.setAttribute("aria-hidden", "true");
    board.append(canvas, dog);

    const ctx = canvas.getContext("2d");
    const points = lanes.map((lane, i) => [x(lane), 64 + i * 63]);
    const end = x(lanes.at(-1));
    points.push([end, 270]);
    ctx.fillStyle = "#20556a";
    const spacing = 30;
    let nextPrint = 16;
    let offset = 5;

    for (let i = 1; i < points.length; i++) {
      const [fromX, fromY] = points[i - 1];
      const [toX, toY] = points[i];
      const dx = toX - fromX;
      const dy = toY - fromY;
      const length = Math.hypot(dx, dy);
      const rotation = Math.atan2(dy, dx) + Math.PI / 2;

      // Carry the spacing across corners so prints stay evenly spaced.
      for (; nextPrint <= length; nextPrint += spacing) {
        const fraction = nextPrint / length;
        ctx.save();
        ctx.translate(fromX + fraction * dx, fromY + fraction * dy);
        ctx.rotate(rotation);
        ctx.translate(offset, 0);
        drawPaw(ctx);
        ctx.restore();
        offset = -offset;
      }
      nextPrint -= length;
    }
    ctx.beginPath();
    ctx.moveTo(end - 13, 286);
    ctx.lineTo(end + 13, 286);
    ctx.lineTo(end, 308);
    ctx.fill();
    return board;
  }

  function drawPaw(ctx) {
    ctx.beginPath();
    ctx.ellipse(0, 5, 8, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    for (const [x, y] of [[-9, -3], [-4, -9], [4, -9], [9, -3]]) {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function sceneElements(rows) {
    return rows.map(({ tiles, style }) => {
      const line = document.createElement("div");
      line.className = "scene-line";
      if (style) line.classList.add(style);
      line.append(...tiles.map(tileElement));
      return line;
    });
  }

  return { glyph, tileElement, sceneElements, trailElement };
})();
