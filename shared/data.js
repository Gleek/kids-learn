/* ── Kids Learn — Shared Game Data ──
 *
 * Central place for all words, sentences, images, shapes, and scenes.
 * Add new entries here and they'll be available across all games.
 */

window.GameData = (function () {

  // ── CVC Words ──
  // Each word can optionally have distractors for games that need them.
  // Games that don't need distractors just use { word, emoji }.
  const CVC_WORDS = [
    { word: "CAT", emoji: "🐱", distractors: ["🐶", "🎩", "🚗"] },
    { word: "DOG", emoji: "🐶", distractors: ["🐱", "🐸", "🌟"] },
    { word: "BUS", emoji: "🚌", distractors: ["🚗", "🏠", "🌳"] },
    { word: "SUN", emoji: "☀️", distractors: ["🌙", "⭐", "🌧️"] },
    { word: "HEN", emoji: "🐔", distractors: ["🐷", "🐮", "🦆"] },
    { word: "PIG", emoji: "🐷", distractors: ["🐔", "🐶", "🐱"] },
    { word: "CUP", emoji: "🥤", distractors: ["🍎", "🎂", "🍕"] },
    { word: "HAT", emoji: "🎩", distractors: ["👟", "🧤", "🐱"] },
    { word: "BED", emoji: "🛏️", distractors: ["🪑", "🚪", "🏠"] },
    { word: "FAN", emoji: "🌀", distractors: ["💡", "🔔", "📦"] },
    { word: "MAP", emoji: "🗺️", distractors: ["📖", "✏️", "🎒"] },
    { word: "PEN", emoji: "🖊️", distractors: ["📖", "🗺️", "🎒"] },
    { word: "VAN", emoji: "🚐", distractors: ["🚌", "🚗", "✈️"] },
    { word: "JAM", emoji: "🍓", distractors: ["🍞", "🧈", "🥛"] },
    { word: "BUG", emoji: "🐛", distractors: ["🐝", "🦋", "🐞"] },
    { word: "BAT", emoji: "🦇", distractors: ["🐦", "🌙", "🏏"] },
    { word: "COW", emoji: "🐮", distractors: ["🐷", "🐔", "🐴"] },
    { word: "FOX", emoji: "🦊", distractors: ["🐶", "🐱", "🐺"] },
    { word: "HOP", emoji: "🐰", distractors: ["🐸", "🦘", "🐿️"] },
    { word: "LOG", emoji: "🪵", distractors: ["🌳", "🪨", "🍂"] },
    { word: "MOP", emoji: "🧹", distractors: ["🪣", "🧽", "🚿"] },
    { word: "NET", emoji: "🥅", distractors: ["⚽", "🏀", "🎾"] },
    { word: "POT", emoji: "🍲", distractors: ["🍳", "🥘", "🥄"] },
    { word: "RUG", emoji: "🧶", distractors: ["🛋️", "🪑", "🧣"] },
    { word: "WEB", emoji: "🕸️", distractors: ["🕷️", "🐛", "🦋"] },
    { word: "ZIP", emoji: "🤐", distractors: ["👄", "🗣️", "😮"] },
    { word: "GEM", emoji: "💎", distractors: ["💍", "👑", "🏆"] },
    { word: "JAR", emoji: "🫙", distractors: ["🥫", "🍯", "🧴"] },
    { word: "KEY", emoji: "🔑", distractors: ["🔒", "🚪", "🗝️"] },
    { word: "NUT", emoji: "🥜", distractors: ["🌰", "🥥", "🍎"] },
  ];

  // ── Sentence Scene Data ──
  const IMG = "images/sentence/";

  const ALL_IMAGES = [
    IMG + "cat-on-mat.jpg",
    IMG + "cat-in-tree.jpg",
    IMG + "dog-in-mud.jpg",
    IMG + "dog-on-bed.jpg",
    IMG + "fish-in-pond.jpg",
    IMG + "fish-in-sky.jpg",
    IMG + "hen-on-egg.jpg",
    IMG + "hen-on-log.jpg",
    IMG + "sun-in-sky.jpg",
    IMG + "moon-in-sky.jpg",
    IMG + "boy-red-hat.jpg",
    IMG + "girl-hat.jpg",
    IMG + "frog-on-log.jpg",
    IMG + "frog-in-tub.jpg",
    IMG + "pig-in-pen.jpg",
    IMG + "pig-in-car.jpg",
    IMG + "bug-on-rug.jpg",
    IMG + "bug-on-plate.jpg",
    IMG + "cup-on-bed.jpg",
    IMG + "cup-in-tree.jpg",
    IMG + "van-on-hill.jpg",
    IMG + "van-in-sea.jpg",
    IMG + "man-with-box.jpg",
    IMG + "man-with-balloon.jpg",
    IMG + "bat-in-cave.jpg",
    IMG + "bat-in-garden.jpg",
    IMG + "fox-in-den.jpg",
    IMG + "fox-in-house.jpg",
    IMG + "jam-in-jar.jpg",
    IMG + "jam-in-shoe.jpg",
    IMG + "man-with-ball.jpg",
    IMG + "bat-in-sun.jpg",
    IMG + "fox-in-hut.jpg",
  ];

  const SENTENCES = [
    { sentence: "The cat sat on the mat.",    correct: IMG + "cat-on-mat.jpg" },
    { sentence: "The dog ran in the mud.",     correct: IMG + "dog-in-mud.jpg" },
    { sentence: "The fish is in the pond.",    correct: IMG + "fish-in-pond.jpg" },
    { sentence: "The hen sat on the egg.",     correct: IMG + "hen-on-egg.jpg" },
    { sentence: "The sun is in the sky.",      correct: IMG + "sun-in-sky.jpg" },
    { sentence: "The boy has a red hat.",      correct: IMG + "boy-red-hat.jpg" },
    { sentence: "The frog is on a log.",       correct: IMG + "frog-on-log.jpg" },
    { sentence: "The pig is in the pen.",      correct: IMG + "pig-in-pen.jpg" },
    { sentence: "The bug is on the rug.",      correct: IMG + "bug-on-rug.jpg" },
    { sentence: "The cup is on the bed.",      correct: IMG + "cup-on-bed.jpg" },
    { sentence: "The van is on the hill.",     correct: IMG + "van-on-hill.jpg" },
    { sentence: "The man has a big box.",      correct: IMG + "man-with-box.jpg" },
    { sentence: "The bat is in the cave.",     correct: IMG + "bat-in-cave.jpg" },
    { sentence: "The fox hid in the den.",     correct: IMG + "fox-in-den.jpg" },
    { sentence: "The jam is in the jar.",      correct: IMG + "jam-in-jar.jpg" },
    { sentence: "The cat is in the tree.",     correct: IMG + "cat-in-tree.jpg" },
    { sentence: "The dog is on the bed.",      correct: IMG + "dog-on-bed.jpg" },
    { sentence: "The fish is in the sky.",     correct: IMG + "fish-in-sky.jpg" },
    { sentence: "The hen is on the log.",      correct: IMG + "hen-on-log.jpg" },
    { sentence: "The moon is in the sky.",     correct: IMG + "moon-in-sky.jpg" },
    { sentence: "The girl has a hat.",         correct: IMG + "girl-hat.jpg" },
    { sentence: "The frog is in the tub.",     correct: IMG + "frog-in-tub.jpg" },
    { sentence: "The pig is in the car.",      correct: IMG + "pig-in-car.jpg" },
    { sentence: "The bug is on the plate.",    correct: IMG + "bug-on-plate.jpg" },
    { sentence: "The cup is in the tree.",     correct: IMG + "cup-in-tree.jpg" },
    { sentence: "The van is in the sea.",      correct: IMG + "van-in-sea.jpg" },
    { sentence: "The man has a ball.",         correct: IMG + "man-with-ball.jpg" },
    { sentence: "The bat is in the sun.",      correct: IMG + "bat-in-sun.jpg" },
    { sentence: "The fox is in a hut.",        correct: IMG + "fox-in-hut.jpg" },
    { sentence: "The jam is in the shoe.",     correct: IMG + "jam-in-shoe.jpg" },
  ];

  // ── Shapes ──
  const SHAPES = [
    { name: "Square",    css: "square" },
    { name: "Triangle",  css: "triangle" },
    { name: "Circle",    css: "circle" },
    { name: "Rectangle", css: "rectangle" },
    { name: "Diamond",   css: "diamond" },
    { name: "Oval",      css: "oval" },
  ];

  // ── Passengers (Fill the Bus) ──
  const PASSENGERS = [
    "\uD83D\uDE0A", "\uD83D\uDE03", "\uD83E\uDD73", "\uD83D\uDE0E",
    "\uD83E\uDD29", "\uD83D\uDE01", "\uD83E\uDDD2", "\uD83D\uDC67", "\uD83D\uDC66",
  ];

  return {
    CVC_WORDS,
    ALL_IMAGES,
    SENTENCES,
    SHAPES,
    PASSENGERS,
  };
})();
