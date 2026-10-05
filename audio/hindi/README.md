# Hindi letter recordings

Source: [Hindi Pronunciation, University of Texas at Austin](https://hindi.la.utexas.edu/resources/pronouncing-the-hindi-alphabet/), “Pronouncing the Hindi Alphabet” created by Mansi Bajaj.

Licensed under [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/), as stated on the source page. No endorsement is implied.

Changes: split the first, slower reading of each row into individual letter clips using FFmpeg silence detection (`noise=-30dB:d=0.6`); retain 120 ms before and 180 ms after detected speech; convert to mono MP3 at 96 kbps. Later fast repetitions are excluded. No speech is synthesized or time-stretched.

`clips.json` records each character, filename, original MP3 URL, and extraction times. Filenames use the character's Unicode code points. The files cover 13 vowel/sign characters and 33 consonants. The source has no audio for क्ष, त्र, or ज्ञ, so those conjuncts are not included in the driving game's choices.

Segmentation and decoding were checked programmatically. Pronunciation still needs listening review.
