<div align="center">

# Shell Shockers — Valorant Kill Sounds

**A sound on each of your kills in [Shell Shockers](https://shellshock.io) that climbs with your streak, like the kill sounds in Valorant.**

<br>

[![Install Valorant Kill Sounds](https://img.shields.io/badge/Install_Valorant_Kill_Sounds-one_click-2ea44f?style=for-the-badge&logo=tampermonkey&logoColor=white)](https://raw.githubusercontent.com/Virojet/Shell-Shockers-Valorant-Kill-Sounds/main/Shell-Shockers-Valorant-Kill-Sounds.user.js)

[![Version](https://img.shields.io/badge/version-1.0.0-0E7697?style=flat-square)](./Shell-Shockers-Valorant-Kill-Sounds.user.js)
[![License: MIT](https://img.shields.io/badge/license-MIT-lightgrey?style=flat-square)](./LICENSE)

</div>

---

## Install

1. **Get Tampermonkey** for your browser: [Chrome](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) · [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd) · [Firefox](https://addons.mozilla.org/firefox/addon/tampermonkey/) · [Opera GX & others](https://www.tampermonkey.net/) (or use [Violentmonkey](https://violentmonkey.github.io/))
2. **[Click here to install Valorant Kill Sounds](https://raw.githubusercontent.com/Virojet/Shell-Shockers-Valorant-Kill-Sounds/main/Shell-Shockers-Valorant-Kill-Sounds.user.js)**, then press **Install** on the page that opens
3. **Reload [shellshock.io](https://shellshock.io)**

> [!TIP]
> **No sound on a kill?** Chrome, Edge, Brave and Opera need one extra switch: open your browser's **Extensions** page → **Tampermonkey** → **Details** → turn on **Allow User Scripts**. Then reload the game. [Step by step for each browser](https://github.com/Virojet/Shell-Shockers-Better-Hud-Mod#allow-user-scripts)

## What it does

Each time you crack someone, you hear a sound, and each kill in your streak plays a higher one: kill 1, 2, 3, 4, then 5 at the top. Kills after the 5th keep the 5th sound. When you die, your streak and the sounds start again from 1.

- **Five sound packs**, or [your own sounds](#your-own-sounds):

  | Pack | Sound |
  |---|---|
  | **Classic** | A sharp metal ping on a soft thump. The 5th adds a rising sweep and a sparkle. |
  | **Crystal** | Glass chimes, one for each kill in your streak. The 5th ends on a chord. |
  | **Synth** | A synthwave chord stab on a kick, with echoes. |
  | **Blade** | A sword swish into a ringing shing. The 4th kill cuts twice and the 5th three times. |
  | **Bubble** | A bloop that slides up into its note. The 5th is a quick run of them. |

- **Only your own kills.** Other players' kills, your hits and your deaths make no sound. It plays when the game shows you its own kill message, so it tells you nothing the game doesn't.
- **Every sound is equally loud**, whichever pack or kill it is, and sits just under a gunshot.
- **Two volumes:** its own slider, and the game's **Sound Effects** volume, which turns it up and down with everything else.
- **Works with [Better HUD](https://github.com/Virojet/Shell-Shockers-Better-Hud-Mod).**
- **Updates by itself** through Tampermonkey.
- Works on shellshock.io and its mirror domains.

## Settings

Open **Settings** ▸ the **speaker tab** ▸ **Kill Sounds**, next to Language:

- **The list:** a pack, **Your own sounds** or **Off**.
- **Test** plays kill 1, then 2, and so on up to 5, one per press.
- **The slider** is the kill sounds' own volume.

Like the game's settings around it, a change is kept when you press **Confirm**. **Cancel** or the **X** leaves things as they were.

## Your own sounds

1. Pick **Your own sounds** in the list. Your file picker opens. Later, use **Choose files** to change them.
2. Choose **1 to 5** sound files: MP3, OGG or WAV, up to 4 MB each.
3. Press **Test** to hear them, then **Confirm**.

In name order, the files play for kills 1 to 5, and the last one repeats after that, so name them `1.mp3`, `2.mp3` and so on. With a single file, it plays on every kill. Hover over the file count next to **Choose files** to see which file plays for which kill.

Your files stay in your browser and are never uploaded. Each one is set to the same loudness as the packs, silence at its start is cut so it plays the moment you get the kill, and up to 6 seconds of it plays.

## Turning it off

Pick **Off** under Kill Sounds and press **Confirm**, or switch it off in Tampermonkey and reload the game.

> [!NOTE]
> Valorant is a trademark of Riot Games. This script isn't made or endorsed by Riot Games and has no connection to them. It contains none of Valorant's audio: the five packs are original sounds that the script makes in your browser.

## License

[MIT](./LICENSE)
