/* ── Kids Learn — Shared Game Data ──
 *
 * Central place for all words, sentences, images, shapes, and scenes.
 * Add new entries here and they'll be available across all games.
 */

window.GameData = (function () {

  // ── CVC Words ──
  // Distractor emojis are picked at random from the pool at play time
  // (see KidsGame.pickDistractors), not stored per word.
  const CVC_WORDS = [
    { word: "CAT", emoji: "🐱" },
    { word: "DOG", emoji: "🐶" },
    { word: "BUS", emoji: "🚌" },
    { word: "SUN", emoji: "☀️" },
    { word: "HEN", emoji: "🐔" },
    { word: "PIG", emoji: "🐷" },
    { word: "CUP", emoji: "🥤" },
    { word: "HAT", emoji: "🎩" },
    { word: "BED", emoji: "🛏️" },
    { word: "FAN", emoji: "🌀" },
    { word: "MAP", emoji: "🗺️" },
    { word: "PEN", emoji: "🖊️" },
    { word: "VAN", emoji: "🚐" },
    { word: "JAM", emoji: "🍓" },
    { word: "BUG", emoji: "🐛" },
    { word: "BAT", emoji: "🦇" },
    { word: "COW", emoji: "🐮" },
    { word: "FOX", emoji: "🦊" },
    { word: "HOP", emoji: "🐰" },
    { word: "LOG", emoji: "🪵" },
    { word: "MOP", emoji: "🧹" },
    { word: "NET", emoji: "🥅" },
    { word: "POT", emoji: "🍲" },
    { word: "RUG", emoji: "🧶" },
    { word: "WEB", emoji: "🕸️" },
    { word: "ZIP", emoji: "🤐" },
    { word: "GEM", emoji: "💎" },
    { word: "JAR", emoji: "🫙" },
    { word: "KEY", emoji: "🔑" },
    { word: "NUT", emoji: "🥜" },
  ];

  // 4-letter words, same shape as CVC_WORDS, for games that read words aloud.
  const WORDS_4 = [
    { word: "FISH", emoji: "🐟" },
    { word: "DUCK", emoji: "🦆" },
    { word: "BIRD", emoji: "🐦" },
    { word: "FROG", emoji: "🐸" },
    { word: "MOON", emoji: "🌙" },
    { word: "STAR", emoji: "⭐" },
    { word: "TREE", emoji: "🌳" },
    { word: "CAKE", emoji: "🎂" },
    { word: "BALL", emoji: "⚽" },
    { word: "BOOK", emoji: "📖" },
    { word: "LION", emoji: "🦁" },
    { word: "BEAR", emoji: "🐻" },
    { word: "SHIP", emoji: "🚢" },
    { word: "KITE", emoji: "🪁" },
    { word: "RAIN", emoji: "🌧️" },
    { word: "SNOW", emoji: "❄️" },
    { word: "CORN", emoji: "🌽" },
    { word: "MILK", emoji: "🥛" },
    { word: "SOCK", emoji: "🧦" },
    { word: "RING", emoji: "💍" },
    { word: "CRAB", emoji: "🦀" },
    { word: "WOLF", emoji: "🐺" },
  ];

  // 5-letter words, same shape as CVC_WORDS, for games that read words aloud.
  const WORDS_5 = [
    { word: "HORSE", emoji: "🐴" },
    { word: "MOUSE", emoji: "🐭" },
    { word: "SNAKE", emoji: "🐍" },
    { word: "WHALE", emoji: "🐳" },
    { word: "SHEEP", emoji: "🐑" },
    { word: "TIGER", emoji: "🐯" },
    { word: "HOUSE", emoji: "🏠" },
    { word: "CLOCK", emoji: "🕐" },
    { word: "PLANT", emoji: "🌱" },
    { word: "CHAIR", emoji: "🪑" },
    { word: "APPLE", emoji: "🍎" },
    { word: "GRAPE", emoji: "🍇" },
    { word: "LEMON", emoji: "🍋" },
    { word: "ONION", emoji: "🧅" },
    { word: "BREAD", emoji: "🍞" },
    { word: "WATCH", emoji: "⌚" },
    { word: "TRUCK", emoji: "🚚" },
    { word: "PLANE", emoji: "✈️" },
    { word: "CANDY", emoji: "🍬" },
    { word: "CROWN", emoji: "👑" },
  ];

  const WORD_BUILD_WORDS = CVC_WORDS.concat(WORDS_4);

  // Returns the word list matching a reading word-length setting (3, 4, or 5).
  function getReadingWords(length) {
    if (length === 5) return WORDS_5;
    if (length === 4) return WORDS_4;
    return CVC_WORDS;
  }

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
    IMG + "bird-in-nest.jpg",
    IMG + "duck-in-lake.jpg",
    IMG + "cow-on-grass.jpg",
    IMG + "rat-on-hill.jpg",
    IMG + "bee-on-flower.jpg",
    IMG + "cat-in-box.jpg",
    IMG + "dog-with-bone.jpg",
    IMG + "owl-in-tree.jpg",
    IMG + "ant-on-cake.jpg",
    IMG + "boy-on-bike.jpg",
    IMG + "girl-in-pool.jpg",
    IMG + "crab-on-sand.jpg",
    IMG + "snail-on-leaf.jpg",
    IMG + "bear-in-cave.jpg",
    IMG + "lamb-on-farm.jpg",
    IMG + "mouse-in-cup.jpg",
    IMG + "frog-with-crown.jpg",
    IMG + "pig-in-mud.jpg",
    IMG + "cat-on-roof.jpg",
    IMG + "dog-in-bath.jpg",
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
    { sentence: "The bird is in the nest.",   correct: IMG + "bird-in-nest.jpg" },
    { sentence: "The duck is in the lake.",   correct: IMG + "duck-in-lake.jpg" },
    { sentence: "The cow is on the grass.",   correct: IMG + "cow-on-grass.jpg" },
    { sentence: "The rat ran up the hill.",   correct: IMG + "rat-on-hill.jpg" },
    { sentence: "The bee is on the flower.",  correct: IMG + "bee-on-flower.jpg" },
    { sentence: "The cat is in the box.",     correct: IMG + "cat-in-box.jpg" },
    { sentence: "The dog has a bone.",        correct: IMG + "dog-with-bone.jpg" },
    { sentence: "The owl is in the tree.",    correct: IMG + "owl-in-tree.jpg" },
    { sentence: "The ant is on the cake.",    correct: IMG + "ant-on-cake.jpg" },
    { sentence: "The boy is on the bike.",    correct: IMG + "boy-on-bike.jpg" },
    { sentence: "The girl is in the pool.",   correct: IMG + "girl-in-pool.jpg" },
    { sentence: "The crab is on the sand.",   correct: IMG + "crab-on-sand.jpg" },
    { sentence: "The snail is on the leaf.",  correct: IMG + "snail-on-leaf.jpg" },
    { sentence: "The bear is in the cave.",   correct: IMG + "bear-in-cave.jpg" },
    { sentence: "The lamb is on the farm.",   correct: IMG + "lamb-on-farm.jpg" },
    { sentence: "The mouse is in the cup.",   correct: IMG + "mouse-in-cup.jpg" },
    { sentence: "The frog has a crown.",      correct: IMG + "frog-with-crown.jpg" },
    { sentence: "The pig is in the mud.",     correct: IMG + "pig-in-mud.jpg" },
    { sentence: "The cat is on the roof.",    correct: IMG + "cat-on-roof.jpg" },
    { sentence: "The dog is in the bath.",    correct: IMG + "dog-in-bath.jpg" },
  ];

  // ── Shapes ──
  const SHAPES = [
    { name: "Square",        css: "square",        level: 1, group: "basic" },
    { name: "Triangle",      css: "triangle",      level: 1, group: "basic" },
    { name: "Circle",        css: "circle",        level: 1, group: "basic" },
    { name: "Rectangle",     css: "rectangle",     level: 1, group: "basic-plus" },
    { name: "Diamond",       css: "diamond",       level: 1, group: "basic-plus" },
    { name: "Oval",          css: "oval",          level: 1, group: "basic-plus" },
    { name: "Pentagon",      css: "pentagon",      level: 2, group: "polygons" },
    { name: "Hexagon",       css: "hexagon",       level: 2, group: "polygons" },
    { name: "Parallelogram", css: "parallelogram", level: 2, group: "quadrilaterals" },
    { name: "Trapezium",     css: "trapezium",     level: 2, group: "quadrilaterals" },
    { name: "Crescent",      css: "crescent",      level: 2, group: "curved" },
  ];

  // ── Passengers (Fill the Bus) ──
  const PASSENGERS = [
    "\uD83D\uDE0A", "\uD83D\uDE03", "\uD83E\uDD73", "\uD83D\uDE0E",
    "\uD83E\uDD29", "\uD83D\uDE01", "\uD83E\uDDD2", "\uD83D\uDC67", "\uD83D\uDC66",
  ];

  return {
    CVC_WORDS,
    WORDS_4,
    WORDS_5,
    WORD_BUILD_WORDS,
    getReadingWords,
    ALL_IMAGES,
    SENTENCES,
    SHAPES,
    PASSENGERS,
  };
})();
