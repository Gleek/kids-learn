/* ── Kids Learn — Arabic / Quranic Word Data ──
 *
 * Noorani Qaida progression: 6 levels.
 * Level 2 uses browser TTS (ar-SA). Levels 3-7 use Quran.com CDN audio.
 * Level 1 (individual letters) requires pre-recorded audio — TBD.
 */

window.ArabicData = (function () {

  const AUDIO_CDN = "https://audio.qurancdn.com/";

  // 28 Arabic letters for Level 2
  // `c` is the consonant sound used in transliteration (ba, bi, bu etc.)
  var LETTERS = [
    { letter: "ب", c: "b" },
    { letter: "ت", c: "t" },
    { letter: "ث", c: "th" },
    { letter: "ج", c: "j" },
    { letter: "ح", c: "ḥ" },
    { letter: "خ", c: "kh" },
    { letter: "د", c: "d" },
    { letter: "ذ", c: "dh" },
    { letter: "ر", c: "r" },
    { letter: "ز", c: "z" },
    { letter: "س", c: "s" },
    { letter: "ش", c: "sh" },
    { letter: "ص", c: "ṣ" },
    { letter: "ض", c: "ḍ" },
    { letter: "ط", c: "ṭ" },
    { letter: "ظ", c: "ẓ" },
    { letter: "ع", c: "ʿ" },
    { letter: "غ", c: "gh" },
    { letter: "ف", c: "f" },
    { letter: "ق", c: "q" },
    { letter: "ك", c: "k" },
    { letter: "ل", c: "l" },
    { letter: "م", c: "m" },
    { letter: "ن", c: "n" },
    { letter: "ه", c: "h" },
    { letter: "و", c: "w" },
    { letter: "ي", c: "y" },
    { letter: "ا", c: "a" },
  ];

  // Build Level 2: each letter × 3 harakat (fathah, kasrah, dammah)
  var level2Words = [];
  var HARAKAT = [
    { mark: "\u064E", vowel: "a", label: "fathah" },   // فتحة
    { mark: "\u0650", vowel: "i", label: "kasrah" },    // كسرة
    { mark: "\u064F", vowel: "u", label: "dammah" },    // ضمة
  ];

  LETTERS.forEach(function (l) {
    HARAKAT.forEach(function (h) {
      level2Words.push({
        text: l.letter + h.mark,
        transliteration: l.c + h.vowel,
        tts: true,
      });
    });
  });

  const LEVELS = {

    /* ── Level 2: Letters + Harakat ──
     * Single letter with a short vowel. Uses browser TTS (ar-SA).
     */
    level2: {
      name: "Letters + Harakat",
      description: "Single letters with fathah, kasrah, and dammah",
      words: level2Words,
    },

    /* ── Level 3: Pure Harakat ──
     * Only fathah, kasrah, dammah — no sukoon, shadda, tanween, or madd.
     */
    level3: {
      name: "Pure Harakat",
      description: "Simple words with fathah, kasrah, and dammah only",
      words: [
        { text: "لَهُ", transliteration: "lahu", translation: "to Him", audio_url: "wbw/098_005_007.mp3", verse: "98:5" },
        { text: "هُوَ", transliteration: "huwa", translation: "He", audio_url: "wbw/112_001_002.mp3", verse: "112:1" },
        { text: "خَلَقَ", transliteration: "khalaqa", translation: "created", audio_url: "wbw/096_001_005.mp3", verse: "96:1" },
        { text: "أَمَرَ", transliteration: "amara", translation: "he enjoins", audio_url: "wbw/096_012_002.mp3", verse: "96:12" },
        { text: "فَعَلَ", transliteration: "faʿala", translation: "dealt/did", audio_url: "wbw/105_001_004.mp3", verse: "105:1" },
        { text: "جَمَعَ", transliteration: "jamaʿa", translation: "collects", audio_url: "wbw/104_002_002.mp3", verse: "104:2" },
        { text: "كَسَبَ", transliteration: "kasaba", translation: "he earned", audio_url: "wbw/111_002_006.mp3", verse: "111:2" },
        { text: "حَسَدَ", transliteration: "hasada", translation: "he envies", audio_url: "wbw/113_005_005.mp3", verse: "113:5" },
        { text: "وَقَبَ", transliteration: "waqaba", translation: "it spreads", audio_url: "wbw/113_003_005.mp3", verse: "113:3" },
        { text: "مِنَ", transliteration: "mina", translation: "from", audio_url: "wbw/114_006_001.mp3", verse: "114:6" },
        { text: "فِى", transliteration: "fi", translation: "in", audio_url: "wbw/097_001_003.mp3", verse: "97:1" },
        { text: "هِىَ", transliteration: "hiya", translation: "it (is)", audio_url: "wbw/097_005_002.mp3", verse: "97:5" },
        { text: "خَتَمَ", transliteration: "khatama", translation: "has set a seal", audio_url: "wbw/002_007_001.mp3", verse: "2:7" },
        { text: "مَعَ", transliteration: "maʿa", translation: "with", audio_url: "wbw/094_005_002.mp3", verse: "94:5" },
        { text: "لَكَ", transliteration: "laka", translation: "for you", audio_url: "wbw/094_001_003.mp3", verse: "94:1" },
        { text: "يَكُنِ", transliteration: "yakuni", translation: "were", audio_url: "wbw/098_001_002.mp3", verse: "98:1" },
        { text: "عَبَسَ", transliteration: "ʿabasa", translation: "He frowned", audio_url: "wbw/080_001_001.mp3", verse: "80:1" },
        { text: "بَخِلَ", transliteration: "bakhila", translation: "withholds", audio_url: "wbw/092_008_003.mp3", verse: "92:8" },
        { text: "خُلِقَ", transliteration: "khuliqa", translation: "he is created", audio_url: "wbw/086_005_004.mp3", verse: "86:5" },
        { text: "وَذَكَرَ", transliteration: "wadhakara", translation: "and remembers", audio_url: "wbw/087_015_001.mp3", verse: "87:15" },
        { text: "دِينُ", transliteration: "dinu", translation: "religion", audio_url: "wbw/098_005_016.mp3", verse: "98:5" },
      ]
    },

    /* ── Level 4: Sukoon ──
     * Words with sukoon (ْ) — a letter with no vowel.
     */
    level4: {
      name: "Sukoon",
      description: "Words with sukoon — letters at rest",
      words: [
        { text: "قُلْ", transliteration: "qul", translation: "Say", audio_url: "wbw/109_001_001.mp3", verse: "109:1" },
        { text: "مِنْ", transliteration: "min", translation: "from", audio_url: "wbw/096_002_003.mp3", verse: "96:2" },
        { text: "أَنْ", transliteration: "an", translation: "that", audio_url: "wbw/096_007_001.mp3", verse: "96:7" },
        { text: "إِنْ", transliteration: "in", translation: "if", audio_url: "wbw/096_011_002.mp3", verse: "96:11" },
        { text: "لَمْ", transliteration: "lam", translation: "not", audio_url: "wbw/096_005_004.mp3", verse: "96:5" },
        { text: "هُمْ", transliteration: "hum", translation: "they", audio_url: "wbw/002_004_011.mp3", verse: "2:4" },
        { text: "مَنْ", transliteration: "man", translation: "who", audio_url: "wbw/101_008_002.mp3", verse: "101:8" },
        { text: "عَنْ", transliteration: "ʿan", translation: "about/from", audio_url: "wbw/107_005_003.mp3", verse: "107:5" },
        { text: "أَوْ", transliteration: "aw", translation: "or", audio_url: "wbw/096_012_001.mp3", verse: "96:12" },
        { text: "لَوْ", transliteration: "law", translation: "if", audio_url: "wbw/102_005_002.mp3", verse: "102:5" },
        { text: "بِسْمِ", transliteration: "bismi", translation: "In the name", audio_url: "wbw/001_001_001.mp3", verse: "1:1" },
        { text: "يَوْمِ", transliteration: "yawmi", translation: "Day", audio_url: "wbw/001_004_002.mp3", verse: "1:4" },
        { text: "غَيْرِ", transliteration: "ghayri", translation: "not (of)", audio_url: "wbw/001_007_005.mp3", verse: "1:7" },
        { text: "عِلْمَ", transliteration: "ʿilma", translation: "knowledge", audio_url: "wbw/102_005_004.mp3", verse: "102:5" },
        { text: "نَصْرُ", transliteration: "nasru", translation: "Help", audio_url: "wbw/110_001_003.mp3", verse: "110:1" },
        { text: "أَلْفِ", transliteration: "alfi", translation: "a thousand", audio_url: "wbw/097_003_005.mp3", verse: "97:3" },
        { text: "لَكُمْ", transliteration: "lakum", translation: "for you", audio_url: "wbw/109_006_001.mp3", verse: "109:6" },
        { text: "أَلَمْ", transliteration: "alam", translation: "Did not", audio_url: "wbw/093_006_001.mp3", verse: "93:6" },
        { text: "لَقَدْ", transliteration: "laqad", translation: "Indeed", audio_url: "wbw/095_004_001.mp3", verse: "95:4" },
        { text: "إِلَيْكَ", transliteration: "ilayka", translation: "to you", audio_url: "wbw/002_004_005.mp3", verse: "2:4" },
      ]
    },

    /* ── Level 5: Shadda ──
     * Words with shadda (ّ) — doubled/geminated consonants.
     */
    level5: {
      name: "Shadda",
      description: "Words with shadda — doubled letters",
      words: [
        { text: "عَلَّمَ", transliteration: "ʿallama", translation: "taught", audio_url: "wbw/096_004_002.mp3", verse: "96:4" },
        { text: "كَذَّبَ", transliteration: "kadhdhaba", translation: "he denies", audio_url: "wbw/096_013_003.mp3", verse: "96:13" },
        { text: "رَبِّكَ", transliteration: "rabbika", translation: "your Lord", audio_url: "wbw/096_001_003.mp3", verse: "96:1" },
        { text: "رَبَّكَ", transliteration: "rabbaka", translation: "your Lord", audio_url: "wbw/099_005_002.mp3", verse: "99:5" },
        { text: "رَبُّكَ", transliteration: "rabbuka", translation: "your Lord", audio_url: "wbw/105_001_005.mp3", verse: "105:1" },
        { text: "فَصَلِّ", transliteration: "fasalli", translation: "So pray", audio_url: "wbw/108_002_001.mp3", verse: "108:2" },
        { text: "يَدُعُّ", transliteration: "yaduʿʿu", translation: "repulses", audio_url: "wbw/107_002_003.mp3", verse: "107:2" },
        { text: "يَحُضُّ", transliteration: "yaḥuḍḍu", translation: "feel the urge", audio_url: "wbw/107_003_002.mp3", verse: "107:3" },
        { text: "وَتَبَّ", transliteration: "watabba", translation: "and perish", audio_url: "wbw/111_001_005.mp3", verse: "111:1" },
        { text: "بِرَبِّ", transliteration: "birabbi", translation: "in the Lord", audio_url: "wbw/113_001_003.mp3", verse: "113:1" },
        { text: "لِلَّهِ", transliteration: "lillahi", translation: "to Allah", audio_url: "wbw/001_002_002.mp3", verse: "1:2" },
        { text: "إِنَّآ", transliteration: "inna", translation: "Indeed, We", audio_url: "wbw/108_001_001.mp3", verse: "108:1" },
        { text: "لِكُلِّ", transliteration: "likulli", translation: "to every", audio_url: "wbw/104_001_002.mp3", verse: "104:1" },
        { text: "لِحُبِّ", transliteration: "lihubbi", translation: "in the love", audio_url: "wbw/100_008_002.mp3", verse: "100:8" },
        { text: "رَبَّهُۥ", transliteration: "rabbahu", translation: "his Lord", audio_url: "wbw/098_008_023.mp3", verse: "98:8" },
        { text: "إِنَّهُۥ", transliteration: "innahu", translation: "Indeed, He", audio_url: "wbw/110_003_006.mp3", verse: "110:3" },
        { text: "بِأَنَّ", transliteration: "bi-anna", translation: "that", audio_url: "wbw/096_014_003.mp3", verse: "96:14" },
        { text: "وَدَّعَكَ", transliteration: "waddaʿaka", translation: "has forsaken you", audio_url: "wbw/093_003_002.mp3", verse: "93:3" },
        { text: "فَأَمَّا", transliteration: "fa-amma", translation: "So as for", audio_url: "wbw/093_009_001.mp3", verse: "93:9" },
        { text: "إِنَّ", transliteration: "inna", translation: "Indeed", audio_url: "wbw/002_006_001.mp3", verse: "2:6" },
        { text: "ٱللَّهُ", transliteration: "Allahu", translation: "Allah", audio_url: "wbw/002_007_002.mp3", verse: "2:7" },
        { text: "ٱلنَّاسِ", transliteration: "al-naasi", translation: "the people", audio_url: "wbw/002_008_002.mp3", verse: "2:8" },
      ]
    },

    /* ── Level 6: Tanween ──
     * Words with tanween (ً ٍ ٌ) — nunation markers.
     */
    level6: {
      name: "Tanween",
      description: "Words with tanween — nunation endings",
      words: [
        { text: "أَحَدٌ", transliteration: "ahadun", translation: "the One", audio_url: "wbw/112_001_004.mp3", verse: "112:1" },
        { text: "خَيْرٌ", transliteration: "khayrun", translation: "better", audio_url: "wbw/097_003_003.mp3", verse: "97:3" },
        { text: "نَارٌ", transliteration: "narun", translation: "a Fire", audio_url: "wbw/101_011_001.mp3", verse: "101:11" },
        { text: "وَيْلٌ", transliteration: "waylun", translation: "Woe", audio_url: "wbw/104_001_001.mp3", verse: "104:1" },
        { text: "حَبْلٌ", transliteration: "hablun", translation: "a rope", audio_url: "wbw/111_005_003.mp3", verse: "111:5" },
        { text: "خُسْرٍ", transliteration: "khusrin", translation: "loss", audio_url: "wbw/103_002_004.mp3", verse: "103:2" },
        { text: "عَلَقٍ", transliteration: "ʿalaqin", translation: "a clinging substance", audio_url: "wbw/096_002_004.mp3", verse: "96:2" },
        { text: "شَهْرٍ", transliteration: "shahrin", translation: "month(s)", audio_url: "wbw/097_003_006.mp3", verse: "97:3" },
        { text: "عَبْدًا", transliteration: "ʿabdan", translation: "a slave", audio_url: "wbw/096_010_001.mp3", verse: "96:10" },
        { text: "رَسُولٌ", transliteration: "rasulun", translation: "a Messenger", audio_url: "wbw/098_002_001.mp3", verse: "98:2" },
        { text: "كُتُبٌ", transliteration: "kutubun", translation: "writings", audio_url: "wbw/098_003_002.mp3", verse: "98:3" },
        { text: "سَلَـٰمٌ", transliteration: "salamun", translation: "Peace", audio_url: "wbw/097_005_001.mp3", verse: "97:5" },
        { text: "خَوْفٍ", transliteration: "khawfin", translation: "fear", audio_url: "wbw/106_004_007.mp3", verse: "106:4" },
        { text: "عَذَابٌ", transliteration: "ʿadhabun", translation: "a punishment", audio_url: "wbw/002_007_011.mp3", verse: "2:7" },
        { text: "أَلِيمٌ", transliteration: "alimun", translation: "painful", audio_url: "wbw/002_010_009.mp3", verse: "2:10" },
        { text: "عَظِيمٌ", transliteration: "ʿazimun", translation: "great", audio_url: "wbw/002_007_012.mp3", verse: "2:7" },
        { text: "صُحُفًا", transliteration: "suhufan", translation: "pages", audio_url: "wbw/098_002_005.mp3", verse: "98:2" },
        { text: "عَابِدٌ", transliteration: "ʿabidun", translation: "a worshipper", audio_url: "wbw/109_004_003.mp3", verse: "109:4" },
        { text: "نَعْبُدُ", transliteration: "naʿbudu", translation: "we worship", audio_url: "wbw/001_005_002.mp3", verse: "1:5" },
        { text: "أَعْبُدُ", transliteration: "aʿbudu", translation: "I worship", audio_url: "wbw/109_002_002.mp3", verse: "109:2" },
        { text: "قَبْلِكَ", transliteration: "qablika", translation: "before you", audio_url: "wbw/002_004_009.mp3", verse: "2:4" },
      ]
    },

    /* ── Level 7: Madd (Elongation) ──
     * Words with madd letters — alif, yaa, waw extending vowels.
     */
    level7: {
      name: "Madd (Elongation)",
      description: "Words with elongated vowels",
      words: [
        { text: "كَانَ", transliteration: "kana", translation: "he is/was", audio_url: "wbw/096_011_003.mp3", verse: "96:11" },
        { text: "إِذَا", transliteration: "idha", translation: "when", audio_url: "wbw/096_010_002.mp3", verse: "96:10" },
        { text: "مَـٰلِكِ", transliteration: "maliki", translation: "Master/Owner", audio_url: "wbw/001_004_001.mp3", verse: "1:4" },
        { text: "صِرَٰطَ", transliteration: "sirata", translation: "the path", audio_url: "wbw/001_007_001.mp3", verse: "1:7" },
        { text: "ذَٰلِكَ", transliteration: "dhalika", translation: "that", audio_url: "wbw/002_002_001.mp3", verse: "2:2" },
        { text: "نَارًا", transliteration: "naran", translation: "a Fire", audio_url: "wbw/111_003_002.mp3", verse: "111:3" },
        { text: "فِيهَا", transliteration: "fiha", translation: "therein", audio_url: "wbw/097_004_004.mp3", verse: "97:4" },
        { text: "عَلَىٰ", transliteration: "ʿala", translation: "upon", audio_url: "wbw/096_011_004.mp3", verse: "96:11" },
        { text: "إِلَىٰ", transliteration: "ila", translation: "to", audio_url: "wbw/096_008_002.mp3", verse: "96:8" },
        { text: "وَلَا", transliteration: "wala", translation: "and not", audio_url: "wbw/001_007_008.mp3", verse: "1:7" },
        { text: "مَا", transliteration: "ma", translation: "what", audio_url: "wbw/096_005_003.mp3", verse: "96:5" },
        { text: "وَمَا", transliteration: "wama", translation: "and not/what", audio_url: "wbw/098_004_001.mp3", verse: "98:4" },
        { text: "إِلَّا", transliteration: "illa", translation: "except", audio_url: "wbw/098_004_006.mp3", verse: "98:4" },
        { text: "كَلَّا", transliteration: "kalla", translation: "Nay!", audio_url: "wbw/096_015_001.mp3", verse: "96:15" },
        { text: "حَتَّىٰ", transliteration: "hatta", translation: "until", audio_url: "wbw/097_005_003.mp3", verse: "97:5" },
        { text: "إِنَّآ", transliteration: "inna", translation: "Indeed, We", audio_url: "wbw/097_001_001.mp3", verse: "97:1" },
        { text: "يَرَىٰ", transliteration: "yara", translation: "sees", audio_url: "wbw/096_014_005.mp3", verse: "96:14" },
        { text: "صَلَّىٰ", transliteration: "salla", translation: "he prays", audio_url: "wbw/096_010_003.mp3", verse: "96:10" },
        { text: "نَاصِيَةٍ", transliteration: "nasiyatin", translation: "a forelock", audio_url: "wbw/096_016_001.mp3", verse: "96:16" },
        { text: "كَـٰذِبَةٍ", transliteration: "kadhibatin", translation: "lying", audio_url: "wbw/096_016_002.mp3", verse: "96:16" },
        { text: "نَادِيَهُ", transliteration: "nadiyahu", translation: "his associates", audio_url: "wbw/096_017_002.mp3", verse: "96:17" },
        { text: "هَاوِيَةٌ", transliteration: "hawiyatun", translation: "the Pit", audio_url: "wbw/101_009_002.mp3", verse: "101:9" },
        { text: "حَامِيَةٌ", transliteration: "hamiyatun", translation: "intensely hot", audio_url: "wbw/101_011_002.mp3", verse: "101:11" },
        { text: "سَجَىٰ", transliteration: "saja", translation: "covers with darkness", audio_url: "wbw/093_002_003.mp3", verse: "93:2" },
        { text: "قَلَىٰ", transliteration: "qala", translation: "is displeased", audio_url: "wbw/093_003_005.mp3", verse: "93:3" },
        { text: "فَهَدَىٰ", transliteration: "fahada", translation: "so He guided", audio_url: "wbw/093_007_003.mp3", verse: "93:7" },
        { text: "فَلَا", transliteration: "fala", translation: "then do not", audio_url: "wbw/093_009_003.mp3", verse: "93:9" },
        { text: "فَإِذَا", transliteration: "fa-idha", translation: "So when", audio_url: "wbw/094_007_001.mp3", verse: "94:7" },
      ]
    },
  };

  function getAudioURL(word) {
    return AUDIO_CDN + word.audio_url;
  }

  return {
    LEVELS,
    AUDIO_CDN,
    getAudioURL,
  };
})();
