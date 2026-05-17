# Kids Learn Agent Notes

## Workflow Rules

- Do NOT commit or push changes unless the user explicitly asks for it.
- Treat this as a static HTML/CSS/JavaScript project. Prefer small, local edits over adding build tooling.
- The worktree may contain user or agent changes already. Do not revert unrelated edits.
- When touching shared behavior, check at least one representative game that uses it and run lightweight syntax checks when possible.

## Project Overview

Kids Learn is a collection of simple educational browser games for ages 3-5. Each game is a standalone HTML file that loads shared assets from `shared/`, `images/`, and `audio/`. There is no bundler or framework; pages should keep working when opened directly in a browser.

The app entry point is `index.html`, which lists the available games. `settings.html` contains user-facing settings, currently focused on selecting which vehicle builder shapes can appear in builder-based games.

## Directory Structure

- `index.html`: home page and game directory.
- `settings.html`: shared settings UI.
- `*-game.html`, `apple-tree.html`, `build-a-house.html`, etc.: standalone game pages with page-specific markup, CSS, and script.
- `shared/game.js`: common game utilities such as audio feedback, stars, feedback floats, randomization, end screens, rewards, level selectors, TTS, and word-audio helpers.
- `shared/builder.js`: vehicle builder module used by games that reveal a vehicle piece by piece and then celebrate.
- `shared/data.js`: English game data such as CVC words, sentence scenes, shapes, and passenger emoji.
- `shared/arabic-data.js`: Arabic level and audio metadata.
- `shared/styles.css`: common UI styling used by newer/shared-style games.
- `images/sentence/`: sentence-scene image assets.
- `audio/scenes/`: scene sound effects used by build-a-house scenes.

## Game Patterns

Most games follow this flow:

1. Show a start overlay.
2. Initialize round, score, lock/answered state, and session data.
3. Render a round prompt and choices.
4. On correct answer: play success tone, add a star, show feedback, optionally add a `Builder` part, then advance.
5. On wrong answer: play error tone, remove or keep star according to the game, disable/dim the wrong choice, and allow retry where appropriate.
6. At the end: render final stars and message via `KidsGame.showEndScreen()`, optionally after `Builder.celebrate()`.

Prefer using `KidsGame` helpers instead of reimplementing:

- `KidsGame.playTone()`, `playChime()`
- `KidsGame.renderStars()`, `renderFinalStars()`
- `KidsGame.showFeedback()`, `showCanvasFeedback()`
- `KidsGame.shuffle()`, `pickRandom()`, `pickDistractors()`
- `KidsGame.showEndScreen()`, `showReward()`
- `KidsGame.renderLevelSelector()`
- `KidsGame.speak()`, `speakWord()`, `speakLang()`, `createWordAudioPlayer()`

Use `Builder.init(vehicleArea, "random")`, `Builder.addPart()`, and `Builder.celebrate(callback)` for builder-based games. Random builder vehicles respect settings from `settings.html`.

Every game should use the shared vehicle builder celebration and shared random reward/present logic unless it does not make sense for that game or the user explicitly asks otherwise. Do not reimplement local boy-surprise or present-surprise timing when `Builder.celebrate()` and `KidsGame.showEndScreen()` can provide the shared behavior.

## Implementation Notes

- Keep game pages self-contained unless code is clearly common across games.
- Put reusable cross-game behavior in `shared/game.js`.
- Put only vehicle-building behavior and vehicle settings in `shared/builder.js`.
- Keep shared APIs backward-compatible when practical because many pages load the same files.
- Use existing CSS classes and visual patterns before inventing new ones.
- Avoid adding dependencies, package managers, or generated assets unless explicitly requested.

## Verification

Useful lightweight checks:

```sh
node --check shared/game.js
node --check shared/builder.js
node -e 'const fs=require("fs"),vm=require("vm"); for (const f of fs.readdirSync(".").filter(f=>f.endsWith(".html"))) { const html=fs.readFileSync(f,"utf8"); const re=/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi; let m,i=0; while ((m=re.exec(html))) { i++; new vm.Script(m[1], {filename:f+":"+i}); } }'
```

For UI changes, open the affected HTML page directly in a browser or serve the folder with a simple static server.
