<div align="center">

# Shell Shockers — Valorant Kill Sounds

**A sound and a kill banner on each of your kills in [Shell Shockers](https://shellshock.io), climbing with your streak like Valorant's.**

<br>

[![Install Valorant Kill Sounds](https://img.shields.io/badge/Install_Valorant_Kill_Sounds-one_click-2ea44f?style=for-the-badge&logo=tampermonkey&logoColor=white)](https://raw.githubusercontent.com/Virojet/Shell-Shockers-Valorant-Kill-Sounds/main/Shell-Shockers-Valorant-Kill-Sounds.user.js)

[![Version](https://img.shields.io/badge/version-1.2.1-0E7697?style=flat-square)](./Shell-Shockers-Valorant-Kill-Sounds.user.js)
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

Each time you crack someone, you hear a sound and a kill banner pops up, and each kill in your streak goes a step higher: kill 1, 2, 3, 4, then 5 at the top. Kills after the 5th keep the 5th. When you die, your streak starts again from 1.

- **Five sound packs** made by the script, **fifteen of Valorant's own**, or [your own sounds](#your-own-sounds):

  | Pack | Sound |
  |---|---|
  | **Classic** | A sharp metal ping on a soft thump. The 5th adds a rising sweep and a sparkle. |
  | **Crystal** | Glass chimes, one for each kill in your streak. The 5th ends on a chord. |
  | **Synth** | A synthwave chord stab on a kick, with echoes. |
  | **Blade** | A sword swish into a ringing shing. The 4th kill cuts twice and the 5th three times. |
  | **Bubble** | A bloop that slides up into its note. The 5th is a quick run of them. |
  | **Valorant** | **Default**, **Reaver**, **Prelude to Chaos**, **Primordium**, **Sovereign**, **Kuronami**, **Evori Dreamwings**, **Champions 2021**, **Gaia's Vengeance**, **Recon**, **Blackthorn**, **CYRAX**, **Singularity**, **Prime//2.0** and **Sentinels of Light**: Valorant's own kill sounds and kill banners for each kill in the streak, ace included. |

- **The kill banner** pops up with each kill's sound, below your crosshair and just above the game's own kill message, with a mark for each kill in your streak. It always goes with the sound: with Primordium, your 1st kill plays Primordium's 1st kill sound with Primordium's 1st kill banner, and so on up to the ace. With the other packs and your own sounds, you get **the Shell Shockers banner**: a cracked egg drawn in the style of Valorant's default banner.
- **Each banner moves with its sound.** It pops up the moment you hear the sound, then kicks and flares on each later hit in it, so a Valorant ace's banner beats with the ace. It glows in its pack's colour and stays up as long as its sound rings, up to 4.6 seconds for an ace.
- **A Valorant ace rings out** for up to 10 seconds, as in Valorant. If you get another kill before it's done, it fades out as the new kill's sound starts.
- **Only your own kills.** Other players' kills, your hits and your deaths do nothing. It plays when the game shows you its own kill message, so it tells you nothing the game doesn't.
- **Every pack is equally loud**, just under a gunshot. The Valorant packs keep Valorant's own mix: their kills 1 to 4 are as loud as the other packs' on average, and their ace is bigger, as in the game.
- **Two volumes:** its own slider, and the game's **Sound Effects** volume, which turns it up and down with everything else.
- **Works with [Better HUD](https://github.com/Virojet/Shell-Shockers-Better-Hud-Mod).**
- **Updates by itself** through Tampermonkey.
- Works on shellshock.io and its mirror domains.

> [!NOTE]
> The Valorant packs aren't in the script itself, so its updates stay small. The first time you pick one, it downloads its 5 sounds and 5 banners (about 1 MB) from this project's [valorant](./valorant) folder on GitHub and keeps them in your browser, so it doesn't download them again. If the download fails, that pack stays quiet until it works, and **Test** in Settings tells you.

## Settings

Open **Settings** ▸ the **speaker tab** ▸ **Kill Sounds**, next to Language:

- **The list:** a sound pack, a Valorant pack, **Your own sounds** or **Off**. It takes your theme's colours, and in Chrome and Edge it opens as a short list that scrolls.
- **Test** plays kill 1, then 2, and so on up to 5, one per press, each with its banner.
- **The slider** is the kill sounds' own volume.
- **Kill Banner** turns the banner on or off. It's on to start with.

Like the game's settings around it, a change is kept when you press **Confirm**. **Cancel** or the **X** leaves things as they were.

## Your own sounds

1. Pick **Your own sounds** in the list. Your file picker opens. Later, use **Choose files** to change them.
2. Choose **1 to 5** sound files: MP3, OGG or WAV, up to 4 MB each.
3. Press **Test** to hear them, then **Confirm**.

In name order, the files play for kills 1 to 5, and the last one repeats after that, so name them `1.mp3`, `2.mp3` and so on. With a single file, it plays on every kill. Hover over the file count next to **Choose files** to see which file plays for which kill.

Your files stay in your browser and are never uploaded. Each one is set to the same loudness as the packs, silence at its start is cut so it plays the moment you get the kill, and up to 6 seconds of it plays.

## Turning it off

Pick **Off** under Kill Sounds, untick **Kill Banner**, then press **Confirm**. Or switch the script off in Tampermonkey and reload the game.

> [!NOTE]
> Shell Shockers Valorant Kill Sounds was created under Riot Games' "Legal Jibber Jabber" policy using assets owned by Riot Games. Riot Games does not endorse or sponsor this project.
>
> Valorant and the names of its skins are trademarks of Riot Games. The sounds and banners in the [valorant](./valorant) folder belong to Riot Games and aren't covered by this project's MIT license. The five sound packs and the Shell Shockers banner are original: the script makes them in your browser.

## Changelog

#### v1.2.1 — current

- **Banners on the beat:** a kill banner now kicks and flares on each hit in its sound, so a Valorant ace's banner beats along with the ace. It used to kick only on the ace's loudest swells, which often fell between the hits. Kills 1 to 4 that hit more than once (Recon, Singularity, CYRAX and a few others) kick on those hits too.
- **In time with what you hear:** the banner pops up the moment you hear its sound. It used to show up a moment early, because your browser and speakers take a little time to play a sound (longer on Bluetooth).
- **Kill Sounds list:** it takes your theme's colours. With themes like Blossom, its group headings were white bars. In Chrome and Edge it opens as a short list that scrolls instead of filling the screen, with one lit row that follows the mouse and the arrow keys.

No Valorant files changed, so nothing downloads again.

<details>
<summary><b>v1.2.0 and older</b></summary>

#### v1.2.0

- **Eight more Valorant packs,** fifteen in all: Champions 2021, Gaia's Vengeance (blue), Recon, Blackthorn, CYRAX, Singularity, Prime//2.0 and Sentinels of Light, each with Valorant's own sound and kill banner for kills 1 to 5. Their banners glow in the colour of their kill marks.
- Your Valorant pack downloads once more (about 1 MB).

#### v1.1.0

- **Seven Valorant packs:** Default, Reaver, Prelude to Chaos, Primordium, Sovereign, Kuronami and Evori Dreamwings, each with Valorant's own sound and kill banner for kills 1 to 5. A pack downloads once (about 1 MB) the first time you pick it, then stays in your browser.
- **Kill banners:** every kill gets a banner that goes with its sound: the Valorant pack's own, or a cracked egg with the other packs and your own sounds. It glows in the pack's colour and stays up as long as its sound rings.
- **Kill Banner** in Settings turns the banners on or off.

#### v1.0.0

- A sound on each of your kills that climbs with your streak: five packs made in your browser (Classic, Crystal, Synth, Blade and Bubble) or your own sound files, picked in **Settings ▸ speaker tab ▸ Kill Sounds**.

</details>

## License

[MIT](./LICENSE), for the script. The [valorant](./valorant) folder is Riot Games' (see above).
