window.GameCatalog = (() => {
  const legacy = [
    ["car-cvc-game.html", "Word Drive", "Reading", "🚗", "Drive your car into the emoji that matches the CVC word!"],
    ["build-a-rocket-game.html", "Build a Rocket", "Reading", "🚀", "Match words to emojis and build a rocket piece by piece!"],
    ["build-a-word-game.html", "Build a Word", "Reading", "🔤", "Look at the emoji and tap each letter in order to make the word."],
    ["letter-blast-game.html", "Letter Blast", "Reading", "🧱", "Spell the picture to blast through letter walls."],
    ["sentence-scene-game.html", "Pick the Picture", "Reading", "🖼️", "Read a sentence and pick the picture that matches it."],
    ["fill-the-bus.html", "Fill the Bus", "Maths", "🚌", "Put the right number of passengers on the bus!"],
    ["apple-tree.html", "Apple Tree", "Maths", "🍎", "Count the apples in two groups and add them up!"],
    ["dice-roll.html", "Dice Roll", "Maths", "🎲", "Roll two dice, count the dots, and pick the total!"],
    ["pattern-game.html", "Pattern Match", "Maths", "🔄", "Spot the pattern and guess what comes next!"],
    ["odd-one-out-game.html", "Odd One Out", "Logic", "🧩", "Find the picture that does not belong and build a surprise vehicle!"],
    ["picture-patch-game.html", "Picture Patch", "Memory & Focus", "🔍", "Find the missing square that completes the picture."],
    ["compare-game.html", "Which Is More?", "Maths", "⚖️", "Compare two groups and tap the one that is greater or fewer!"],
    ["build-a-house.html", "Build with Shapes", "Spatial", "🔷", "Fill in the dotted frames to build a house, train, robot, and more!"],
    ["cake-bake-game.html", "Cake Bakery", "Maths", "🎂", "Follow the recipe, count out each ingredient, then bake the cake!"],
    ["hindi-car-game.html", "Hindi Drive", "Hindi", "🚗", "Listen to Hindi letters and drive into the matching one!"],
    ["hindi-varnmala-game.html", "Varnmala Match", "Hindi", "🥭", "Look at the Hindi letter and choose the matching word."],
    ["arabic-rocket-game.html", "Arabic Rocket", "Arabic", "🚀", "Read Quranic words and pick the correct sound to build a rocket!"],
    ["arabic-car-game.html", "Arabic Drive", "Arabic", "🚗", "Listen to Arabic words and drive into the correct one!"],
  ].map(([href, title, category, icon, description]) => ({ href, title, category, icon, description }));

  const creative = [
    ["world", "World Creator", "Spatial", "Make a garden, pond, or snowy world.", ["🦋", "🐢", "🌻"]],
    ["music", "Music Room", "Talk & Listen", "Play your own tune or listen and copy a short melody.", ["♪", "🎸", "♫"]],
    ["color", "Coloring Studio", "Create", "Pick a color and paint a butterfly, rocket, or garden.", ["🎨", "🖌️"]],
    ["pets", "My Pets", "Create", "Choose a pet and feed, play with, or tuck them in.", ["🐰", "🐶", "🐢"]],
  ].map(([id, title, theme, description, preview]) => ({
    id, title, category: "Create", theme, description, preview,
    href: "creative-game.html?game=" + id,
  }));

  return { legacy, creative };
})();
