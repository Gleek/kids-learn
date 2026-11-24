/* Original picture puzzles for the Kids Learn puzzle shelf. */
window.PicturePuzzles = (() => {
  const guess = (prompt, scene, choices, answer = 0, extra = {}) => ({
    prompt, scene, choices, answer, ...extra,
  });
  const items = (...tokens) => tokens.map(token => {
    const [icon, name] = token.split("|");
    return { icon, name: name || icon };
  });
  const blank = { icon: "?", name: "Empty space", style: "blank" };
  const number = value => ({ icon: value, name: String(value) });
  const word = name => ({ icon: name, name, style: "word" });
  const letter = char => ({
    icon: char,
    name: (char === char.toUpperCase() ? "Capital " : "Lowercase ") + char,
    style: "letter",
  });
  const shape = (color, form) => ({ color, form, name: color + " " + form });
  const photo = (file, name) => ({ file, name });
  const row = (tiles, style) => ({ tiles, style });
  const repeat = (count, tile) => Array(count).fill(tile);
  const stylize = (tile, style, name = tile.name) => ({ ...tile, style, name });
  const multi = (tiles, name) => ({ tiles, name });
  const fromSets = (sets, make) => sets.map(set => make(...set));
  const deck = [];

  function add(id, title, category, icon, description, rounds) {
    deck.push({ id, title, category, icon, description, rounds });
  }

  add("peek", "Peek-a-Picture", "Logic", "🐌", "Use the clues to find who’s hiding.",
    fromSets([
      ["🐌|snail", "🐝|bee", "🐢|turtle", "I have a shell and two feelers."],
      ["🦒|giraffe", "🐘|elephant", "🦓|zebra", "I have a very long neck and spots."],
      ["🦜|parrot", "🦉|owl", "🐧|penguin", "I have bright feathers and I can copy your voice."],
      ["🐰|rabbit", "🐼|panda", "🦊|fox", "I have long ears and I like to hop."],
      ["🐘|elephant", "🐵|monkey", "🦛|hippo", "I have a long trunk."],
    ], (a, b, c, clue) => {
      const choices = items(a, b, c);
      return guess(clue + " Who am I?", [row([stylize(choices[0], "peek", "Hidden animal")])], choices,
        0, { reveal: [row([choices[0]])] });
    }));

  add("missing", "Fix It!", "Logic", "🛴", "Choose the piece that makes something work.",
    fromSets([
      ["🎸|guitar", "🧵|strings", "🔑|key", "📎|paper clip", "What does a guitar need to make music?"],
      ["🛴|scooter", "🛞|wheel", "🧤|glove", "🥎|ball", "What helps the scooter roll?"],
      ["🔦|flashlight", "🔋|battery", "🖍️|crayon", "🧊|ice cube", "What powers the flashlight?"],
      ["🖼️|empty picture frame", "📷|camera", "🍎|apple", "🧼|soap", "What can you use to take a picture for this frame?"],
      ["🛏️|bed", "🛌|pillow and blanket", "🪴|plant", "🍽️|plate", "What makes a bed cozy?"],
    ], (object, a, b, c, prompt) => guess(prompt, [row([...items(object), blank])], items(a, b, c))));

  add("pairs", "Perfect Pairs", "Logic", "🧦", "Match things that belong together.",
    fromSets([
      ["🧦|sock", "🥾|boot", "🕶️|sunglasses", "🎩|hat"],
      ["🦷|tooth", "🪥|toothbrush", "🧽|sponge", "✂️|scissors"],
      ["📬|mailbox", "✉️|letter", "🍐|pear", "🖍️|crayon"],
      ["🌧️|rain", "☂️|umbrella", "🧣|scarf", "🏀|basketball"],
      ["🖌️|paintbrush", "🎨|paints", "🥁|drum", "🍪|cookie"],
    ], (object, ...choices) => guess("What goes with this?", [row(items(object))], items(...choices))));

  add("slices", "Snack Lab", "Logic", "🥝", "Match each food to what it looks like inside.",
    fromSets([
      ["kiwi", "orange", "watermelon"], ["watermelon", "lime", "kiwi"],
      ["orange", "kiwi", "lime"], ["lime", "orange", "watermelon"],
      ["lemon", "watermelon", "orange"],
    ], (food, b, c) => guess("What does the inside of this " + food + " look like?",
      [row([{ fruit: food, name: "Whole " + food }])],
      [food, b, c].map(fruit => ({ fruit, cut: true, name: "Slice of " + fruit })))));

  add("size", "Small to Tall", "Logic", "🐙", "Arrange matching pictures from smallest to biggest.",
    items("🐙|octopus", "🌵|cactus", "🐰|rabbit", "🦕|dinosaur", "🏠|house").map(tile =>
      guess("Tap from smallest to biggest.", [row(repeat(3, blank))],
        [0.45, 0.7, 1].map((scale, i) => ({ ...tile, scale, name: ["Small", "Medium", "Big"][i] })),
        [0, 1, 2], { placement: true })));

  add("strips", "Picture Strips", "Logic", "🖼️", "Put three strips in order to rebuild a scene.",
    fromSets([
      ["snail-on-leaf", "a snail on a leaf"],
      ["fox-in-hut", "a fox in a hut"],
      ["kite-in-sky", "a kite in the sky"],
      ["turtle-on-rock", "a turtle on a rock"],
      ["frog-in-tub", "a frog in a tub"],
    ], (file, name) => guess("Build the picture from top to bottom.",
      [row(repeat(3, blank), "strips")], ["Top", "Middle", "Bottom"].map((piece, i) => ({
        ...photo(file, piece + " strip of " + name), slice: i,
      })), [0, 1, 2], { placement: true })));

  add("locks", "Key Shapes", "Logic", "🔑", "Find a key that fits the shape on the lock.",
    fromSets([
      ["plum", "triangle"], ["coral", "circle"], ["ocean", "square"],
      ["leaf", "diamond"], ["gold", "star"],
    ], (color, form) => {
      const forms = ["triangle", "circle", "square", "diamond", "star"];
      const key = stylize(shape(color, form), "key", form + " key");
      const choices = [key, ...forms.filter(f => f !== form).slice(0, 2)
        .map(f => stylize(shape(color, f), "key", f + " key"))];
      return guess("Which key fits this lock?",
        [row([stylize(shape(color, form), "lock", form + " lock")])], choices);
    }));

  add("mirror", "Mirror Garden", "Spatial", "🦋", "Finish a symmetrical picture.",
    fromSets([
      ["🦋|butterfly", "🍁|leaf", "🌸|flower"],
      ["🍓|strawberry", "🍐|pear", "🍍|pineapple"],
      ["🐝|bee", "🐞|ladybird", "🦋|butterfly"],
      ["🎈|balloon", "⭐|star", "🍎|apple"],
      ["🐞|ladybird", "🐝|bee", "🍁|leaf"],
    ], (...tokens) => {
      const [a, b, c] = items(...tokens);
      const left = stylize(a, "half-left", "Left half of " + a.name);
      const right = tile => stylize(tile, "half-right", "Right half of " + tile.name);
      return guess("Which half completes the picture?", [row([left, blank], "mirror")],
        [right(a), right(b), right(c)], 0, { reveal: [row([left, right(a)], "mirror")] });
    }));

  add("blocks", "Block Workshop", "Spatial", "🧱", "Find the missing shape in a block build.",
    fromSets([
      ["coral", "triangle"], ["ocean", "circle"], ["gold", "square"],
      ["leaf", "diamond"], ["plum", "star"],
    ], (color, form) => {
      const answer = shape(color, form);
      const column = (top, lower) => multi([top, ...lower], [top, ...lower].map(t => t.name).join(", "));
      const foundation = [shape("ocean", "square"), shape("leaf", "square")];
      const choices = [answer, shape(color, form === "triangle" ? "circle" : "triangle"),
        shape(color === "plum" ? "gold" : "plum", form)];
      const scene = top => [row([column(answer, foundation), column(top, foundation)], "towers")];
      return guess("Make the right tower match the left tower.", scene(blank), choices, 0,
        { reveal: scene(answer) });
    }));

  add("place", "Where Does It Go?", "Spatial", "🪁", "Find the spot described in the clue.",
    fromSets([
      ["🪁|kite", "🌳|tree", "above", 1],
      ["🐠|fish", "🛶|canoe", "below", 3],
      ["🐌|snail", "🪴|plant", "to the left of", 0],
      ["🦔|hedgehog", "🍄|mushroom", "to the right of", 2],
      ["🐦|bird", "🏡|house", "above", 1],
    ], (object, center, direction, answer) => {
      const [tile, landmark] = items(object, center);
      const slots = ["Left", "Above", "Right", "Below"].map(name => stylize(blank, "blank", name));
      return guess("Put the " + tile.name + " " + direction + " the " + landmark.name + ".",
        [row([tile])], slots, answer, { layout: "compass", center: landmark, fill: tile });
    }));

  add("trail", "Follow the Trail", "Spatial", "🐶", "Follow the dog’s trail to see where it went.",
    [
      [0, 0, 1, 2], [1, 1, 0, 0], [2, 1, 1, 0], [0, 1, 2, 2], [1, 2, 2, 1],
    ].map(lanes => {
      const choices = items("🏕️|tent", "🏡|house", "🏰|castle");
      return guess("Where do the footprints lead?", [], choices, lanes.at(-1), { layout: "trail", lanes });
    }));

  add("count", "Little Lookout", "Maths", "🐝", "Count the things you can see.",
    fromSets([
      ["🐝|bee", "bees", 2], ["🐋|whale", "whales", 4], ["🐦|bird", "birds", 3],
      ["🐙|octopus", "octopuses", 5], ["🐞|ladybird", "ladybirds", 1],
    ], (tile, plural, count) => guess("How many " + plural + " can you see?",
      [row(repeat(count, items(tile)[0]))], [count, count + 1, count === 1 ? 3 : count - 1].map(number))));

  add("join", "How Many Now?", "Maths", "🐥", "See what happens when two groups join.",
    fromSets([
      ["🐥|chick", "chicks", 1, 2], ["🐇|rabbit", "rabbits", 2, 2],
      ["🐢|turtle", "turtles", 1, 1], ["🐧|penguin", "penguins", 3, 2],
      ["🦆|duck", "ducks", 2, 1],
    ], (token, plural, a, b) => {
      const tile = items(token)[0];
      return guess("How many " + plural + " are there altogether?",
        [row([multi(repeat(a, tile), a + " " + plural), word("+"), multi(repeat(b, tile), b + " " + plural)], "groups")],
        [a + b, a + b - 1, a + b + 1].map(number));
    }));

  add("shapes", "Shape Search", "Maths", "🔺", "Find the same shape in a different color.",
    fromSets([
      ["coral", "triangle"], ["ocean", "square"], ["gold", "circle"],
      ["leaf", "star"], ["plum", "diamond"],
    ], (color, form) => {
      const other = color === "plum" ? "leaf" : "plum";
      return guess("Which piece has the same shape?", [row([shape(color, form)])],
        [shape(other, form), shape(color, form === "circle" ? "square" : "circle"),
          shape(other, form === "star" ? "triangle" : "star")]);
    }));

  add("shadows", "Shadow Safari", "Memory & Focus", "🐘", "Match the outline to the animal that cast it.",
    fromSets([
      ["🐘|elephant", "🦓|zebra", "🦩|flamingo"],
      ["🦀|crab", "🐢|turtle", "🐙|octopus"],
      ["🦒|giraffe", "🦓|zebra", "🐘|elephant"],
      ["🦩|flamingo", "🦆|duck", "🦉|owl"],
      ["🐬|dolphin", "🐢|turtle", "🦀|crab"],
    ], (...tokens) => {
      const choices = items(...tokens);
      return guess("Who made this shadow?", [row([stylize(choices[0], "shadow", "Animal shadow")])], choices);
    }));

  add("peek-back", "Peek, Hide, Remember", "Memory & Focus", "🧸", "Remember which pictures were there.",
    fromSets([
      ["🍋|lemon", "🍒|cherries", "🍌|banana", "🥝|kiwi", "🍓|strawberry"],
      ["🚜|tractor", "🚕|taxi", "🚲|bicycle", "🚌|bus", "🚑|ambulance"],
      ["🪁|kite", "🧸|teddy bear", "🪀|yo-yo", "🎲|dice", "⚽|football"],
      ["🐢|turtle", "🦊|fox", "🐮|cow", "🦁|lion", "🐼|panda"],
      ["🥁|drum", "🎺|trumpet", "🪇|maracas", "🎻|violin", "🎸|guitar"],
    ], (...tokens) => {
      const [a, b, c, d, e] = items(...tokens);
      return guess("Which picture did you see?", [row(repeat(3, blank))], [b, d, e],
        0, { study: [row([a, b, c])] });
    }));

  add("layers", "Shape Tangle", "Memory & Focus", "🎨", "Look closely at a pile of overlapping shapes.",
    fromSets([
      ["circle", "star", "triangle", "diamond", "square"],
      ["triangle", "square", "circle", "star", "diamond"],
      ["square", "circle", "star", "triangle", "diamond"],
      ["diamond", "star", "square", "circle", "triangle"],
      ["star", "diamond", "triangle", "circle", "square"],
    ], (a, b, c, d, e) => guess("Which shape can you see in the pile?",
      [row([shape("plum", a), shape("ocean", b), shape("coral", c)], "tangle")],
      [a, d, e].map(form => shape("plum", form)))));

  add("different", "Spot the Switch", "Memory & Focus", "🍎", "Find the one picture that changed.",
    fromSets([
      ["🍎|apple", "🍌|banana", "🍐|pear", "🍓|strawberry", 1],
      ["🦄|unicorn", "🐴|horse", "🐮|cow", "🦓|zebra", 0],
      ["🌻|sunflower", "🌹|rose", "🌷|tulip", "🌵|cactus", 2],
      ["🚗|car", "🚕|taxi", "🚲|bicycle", "🛵|scooter", 1],
      ["🐤|chick", "🦉|owl", "🐧|penguin", "🦩|flamingo", 2],
    ], (a, b, c, swapped, answer) => {
      const reference = items(a, b, c);
      const choices = [...reference];
      choices[answer] = items(swapped)[0];
      return guess("Tap the picture that changed.", [row(reference, "comparison")],
        choices, answer, { layout: "comparison" });
    }));

  add("sequence", "First, Next, Last", "Memory & Focus", "🌻", "Put the steps of a little story in order.",
    fromSets([
      ["How does a plant grow?", "🫘|seed", "🌱|sprout", "🌻|flower"],
      ["How does a butterfly grow?", "🐛|caterpillar", "🟤|chrysalis", "🦋|butterfly"],
      ["What do you do to get a letter ready to mail?", "✍️|write a letter", "✉️|put it in an envelope", "📬|put it in the mailbox"],
      ["How do you get a loaf of bread?", "🌾|grow wheat", "🥣|mix the dough", "🍞|bake a loaf"],
      ["What happens on a rainy day?", "☁️|clouds come", "🌧️|rain falls", "🌈|a rainbow appears"],
    ], (prompt, ...tokens) => guess(prompt + " Tap first, next, then last.",
      [row(repeat(3, blank), "sequence")], items(...tokens), [0, 1, 2], { placement: true })));

  add("listen", "Word Hunt", "Talk & Listen", "🎈", "Listen to a word and find its picture.",
    fromSets([
      ["🪁|kite", "🎈|balloon", "🎸|guitar"],
      ["🧣|scarf", "🧢|cap", "🥾|boot"],
      ["🥾|boot", "🧦|sock", "🧣|scarf"],
      ["🍋|lemon", "🍐|pear", "🍊|orange"],
      ["🥁|drum", "🎸|guitar", "🎺|trumpet"],
    ], (...tokens) => {
      const choices = items(...tokens);
      const prompt = "Find the " + choices[0].name + ".";
      return guess(prompt, [row(items("👂|listening ear"))], choices);
    }));

  add("jobs", "Who Can Help?", "Talk & Listen", "🧑‍🍳", "Listen to a clue about someone’s job.",
    fromSets([
      ["Who bakes our bread?", "🧑‍🍳|baker", "🧑‍🌾|farmer", "🧑‍🚒|firefighter", "🍞|bread"],
      ["Who helps you when you’re sick?", "🧑‍⚕️|doctor", "🧑‍🍳|cook", "🧑‍🔧|mechanic", "🩺|stethoscope"],
      ["Who helps put out fires?", "🧑‍🚒|firefighter", "🧑‍🏫|teacher", "🧑‍🎨|artist", "🚒|fire truck"],
      ["Who grows food on a farm?", "🧑‍🌾|farmer", "🧑‍🚀|astronaut", "🧑‍🚒|firefighter", "🚜|tractor"],
      ["Who fixes a broken car?", "🧑‍🔧|mechanic", "🧑‍🍳|cook", "🧑‍🏫|teacher", "🔧|wrench"],
    ], (prompt, a, b, c, clue) => guess(prompt, [row(items(clue))], items(a, b, c))));

  add("sounds", "Animal Voices", "Talk & Listen", "🐄", "Listen to a sound and pick who makes it.",
    fromSets([
      ["Moo!", "🐄|cow", "🐶|dog", "🦆|duck"],
      ["Quack, quack!", "🦆|duck", "🐈|cat", "🐄|cow"],
      ["Meow!", "🐈|cat", "🐑|sheep", "🐔|hen"],
      ["Baa, baa!", "🐑|sheep", "🐈|cat", "🐶|dog"],
      ["Woof, woof!", "🐶|dog", "🐄|cow", "🦆|duck"],
    ], (sound, ...choices) => guess("Who says “" + sound + "”?", [row(items("🎙️|microphone"))], items(...choices))));

  add("feelings", "How Do I Feel?", "Talk & Listen", "😊", "Match a feeling to a face.",
    fromSets([
      ["happy", "😄|happy", "😢|sad", "😴|sleepy"],
      ["sad", "😢|sad", "😄|happy", "😠|angry"],
      ["surprised", "😲|surprised", "😴|sleepy", "😢|sad"],
      ["sleepy", "😴|sleepy", "😲|surprised", "😄|happy"],
      ["angry", "😠|angry", "😢|sad", "😄|happy"],
    ], (feeling, ...choices) => guess("Who looks " + feeling + "?", [row(items("💭|thought bubble"))], items(...choices))));

  add("descriptions", "Tell Me Which", "Talk & Listen", "🧸", "Listen for describing words and pick the picture.",
    fromSets([
      ["Find the cold thing.", "🧊|ice", "🫖|teapot", "🧦|sock"],
      ["Find something round.", "⚽|ball", "📘|book", "🪜|ladder"],
      ["Find something that floats in the air.", "🎈|balloon", "🥾|boot", "🪑|chair"],
      ["Find the thing with stripes.", "🦓|zebra", "🐘|elephant", "🦏|rhino"],
      ["Find something soft to hug.", "🧸|teddy bear", "🧱|brick", "🥄|spoon"],
    ], (prompt, ...choices) => guess(prompt, [row(items("💬|speech bubble"))], items(...choices))));

  add("letter-partners", "Letter Partners", "Reading", "🔤", "Match capital and lowercase letters.",
    fromSets([
      ["A", "a", "o", "e"],
      ["b", "B", "D", "P"],
      ["M", "m", "n", "w"],
      ["g", "G", "C", "Q"],
      ["R", "r", "n", "t"],
    ], (target, ...choices) => {
      const opposite = target === target.toUpperCase() ? "lowercase" : "capital";
      return guess("Find the " + opposite + " letter that matches.", [row([letter(target)])], choices.map(letter));
    }));

  add("sound-pairs", "Sound Pairs", "Reading", "🐝", "Find two pictures that start with the same sound.",
    fromSets([
      ["🐝|bee", "🎈|balloon", "🦆|duck", "🐢|turtle"],
      ["🐶|dog", "🦆|duck", "🦊|fox", "🐰|rabbit"],
      ["🦊|fox", "🐟|fish", "🐰|rabbit", "🦜|parrot"],
      ["🐢|turtle", "🦷|tooth", "🦉|owl", "🦓|zebra"],
      ["🦜|parrot", "🐼|panda", "🐝|bee", "🦒|giraffe"],
    ], (object, ...choices) => {
      const [target] = items(object);
      return guess("Which picture starts with the same sound as " + target.name + "?",
        [row([target])], items(...choices));
    }));

  add("rhyming-pictures", "Rhyming Pictures", "Reading", "🎩", "Listen for words that end the same way.",
    fromSets([
      ["🐈|cat", "🎩|hat", "🐶|dog", "🦊|fox"],
      ["🐔|hen", "🖊️|pen", "🐢|turtle", "🐝|bee"],
      ["🐝|bee", "🔑|key", "🐶|dog", "🐈|cat"],
      ["🐌|snail", "🐋|whale", "🐢|turtle", "🐸|frog"],
      ["🦊|fox", "📦|box", "🐰|rabbit", "🐻|bear"],
      ["🚤|boat", "🐐|goat", "🦆|duck", "🐻|bear"],
      ["🐭|mouse", "🏠|house", "🐈|cat", "🦊|fox"],
      ["🎂|cake", "🐍|snake", "🐶|dog", "🚗|car"],
    ], (object, ...choices) => {
      const [target] = items(object);
      return guess("Which picture rhymes with " + target.name + "?", [row([target])], items(...choices));
    }));

  const shortWords = [
    ["🐈|cat", "cap", "cot"],
    ["🐶|dog", "dig", "dot"],
    ["☀️|sun", "sit", "sum"],
    ["🐷|pig", "peg", "pin"],
    ["🐔|hen", "hem", "pen"],
    ["🚌|bus", "bug", "bun"],
    ["🧢|cap", "cat", "cup"],
    ["🦇|bat", "bet", "bag"],
  ];

  add("last-sound", "Last Sound", "Reading", "🐶", "Listen for the last sound and pick its letter.",
    shortWords.map(([object], i) => {
      const [target] = items(object);
      const end = target.name.at(-1);
      const distractors = ["n", "p", "g", "s", "t"].filter(char => char !== end);
      const offset = i % distractors.length;
      const choices = [end, distractors[offset], distractors[(offset + 1) % distractors.length]];
      return guess("Which letter makes the last sound in " + target.name + "?",
        [row([target])], choices.map(letter));
    }));

  add("missing-vowel", "Missing Vowel", "Reading", "🧢", "Fill the middle of a three-letter word.",
    shortWords.map(([object], i) => {
      const [target] = items(object);
      const [start, vowel, end] = target.name;
      const distractors = ["a", "e", "i", "o", "u"].filter(char => char !== vowel);
      const offset = i % distractors.length;
      const choices = [vowel, distractors[offset], distractors[(offset + 1) % distractors.length]];
      return guess("Which letter goes in the middle?",
        [row([target]), row([word(start + " _ " + end)], "reading-stem")],
        choices.map(letter), 0, { reveal: [row([target]), row([word(target.name)], "reading-stem")] });
    }));

  add("picture-to-word", "Picture to Word", "Reading", "🐷", "Read three short words and match one to a picture.",
    fromSets(shortWords, (object, ...choices) => {
      const [target] = items(object);
      return guess("Which one matches the picture?", [row([target])],
        [target.name, ...choices].map(word));
    }));

  add("word-hunt", "Sight Word Hunt", "Reading", "🔎", "Find a common word inside a sentence.",
    fromSets([
      ["I can see a cat.", "can"],
      ["The dog is in bed.", "is"],
      ["Can you see the sun?", "the"],
      ["I see a red bus.", "see"],
      ["Cats and dogs can nap.", "and"],
      ["The fox ran to me.", "to"],
      ["We go to the park.", "go"],
      ["I had a red hat.", "had"],
    ], (sentence, target) => {
      const choices = sentence.split(" ").map(word);
      return guess("Tap the word " + target + ".", [row([word(target)], "reading-stem")],
        choices, choices.findIndex(tile => tile.name === target), { layout: "word-hunt" });
    }));

  add("sentence-builder", "Sentence Builder", "Reading", "🖼️", "Tap words in order to make a short sentence.",
    fromSets([
      ["cat-in-tree", "The cat is up."],
      ["dog-in-bath", "The dog is wet."],
      ["fox-in-hut", "I see a fox."],
      ["sun-in-sky", "I see the sun."],
      ["hen-on-egg", "The hen can sit."],
    ], (file, sentence) => {
      const words = sentence.split(" ").map(word);
      return guess("Build the sentence. " + sentence,
        [row([photo(file, sentence)]), row(repeat(words.length, blank), "sentence-slots")],
        words, words.map((_, index) => index), { placement: true });
    }));

  add("finish-sentence", "Finish the Sentence", "Reading", "🖼️", "Read a short sentence and choose its missing word.",
    fromSets([
      ["cat-on-mat", "The cat is on", "mat", "bed", "rug"],
      ["dog-on-bed", "The dog is on", "bed", "mat", "log"],
      ["fox-in-den", "The fox is in", "den", "bed", "pen"],
      ["hen-on-log", "The hen is on", "log", "mat", "bed"],
      ["pig-in-pen", "The pig is in", "pen", "bed", "den"],
      ["bug-on-rug", "The bug is on", "rug", "log", "mat"],
      ["jam-in-jar", "The jam is in", "jar", "cup", "pot"],
      ["rat-on-hill", "The rat is on", "hill", "log", "mat"],
    ], (file, stem, answer, ...choices) => {
      const picture = row([photo(file, stem + " the " + answer + ".")]);
      const start = stem + " the";
      const line = row([word(start + " ___")], "reading-stem");
      return guess("Read the sentence. Which word is missing?", [picture, line],
        [answer, ...choices].map(word), 0, {
          reveal: [picture, row([word(start + " " + answer + ".")], "reading-stem")],
        });
    }));

  return deck;
})();
