// ==UserScript==
// @name         Shell Shockers Valorant Kill Sounds
// @version      1.2.0
// @description  Valorant-style kill sounds and kill banners: a sound and a banner on each of your kills, a step higher for each kill in your streak up to the 5th. Five sound packs, fifteen of Valorant's own, or your own files.
// @namespace    https://github.com/Virojet
// @author       Virojet
// @license      MIT
// @homepageURL  https://github.com/Virojet/Shell-Shockers-Valorant-Kill-Sounds
// @supportURL   https://github.com/Virojet/Shell-Shockers-Valorant-Kill-Sounds/issues
// @downloadURL  https://raw.githubusercontent.com/Virojet/Shell-Shockers-Valorant-Kill-Sounds/main/Shell-Shockers-Valorant-Kill-Sounds.user.js
// @updateURL    https://raw.githubusercontent.com/Virojet/Shell-Shockers-Valorant-Kill-Sounds/main/Shell-Shockers-Valorant-Kill-Sounds.user.js
// @match        *://*.shellshock.io/*
// @match        *://*.algebra.best/*
// @match        *://*.algebra.vip/*
// @match        *://*.biologyclass.club/*
// @match        *://*.deadlyegg.com/*
// @match        *://*.deathegg.world/*
// @match        *://*.eggboy.club/*
// @match        *://*.eggboy.xyz/*
// @match        *://*.eggcombat.com/*
// @match        *://*.egg.dance/*
// @match        *://*.eggfacts.fun/*
// @match        *://*.egghead.institute/*
// @match        *://*.eggisthenewblack.com/*
// @match        *://*.eggsarecool.com/*
// @match        *://*.geometry.best/*
// @match        *://*.geometry.monster/*
// @match        *://*.geometry.pw/*
// @match        *://*.geometry.report/*
// @match        *://*.hardboiled.life/*
// @match        *://*.hardshell.life/*
// @match        *://*.humanorganising.org/*
// @match        *://*.mathactivity.xyz/*
// @match        *://*.mathactivity.club/*
// @match        *://*.mathdrills.info/*
// @match        *://*.mathdrills.life/*
// @match        *://*.mathfun.rocks/*
// @match        *://*.mathgames.world/*
// @match        *://*.math.international/*
// @match        *://*.mathlete.fun/*
// @match        *://*.mathlete.pro/*
// @match        *://*.overeasy.club/*
// @match        *://*.risenegg.com/*
// @match        *://*.scrambled.tech/*
// @match        *://*.scrambled.today/*
// @match        *://*.scrambled.us/*
// @match        *://*.scrambled.world/*
// @match        *://*.shellshockers.club/*
// @match        *://*.shellshockers.life/*
// @match        *://*.shellshockers.site/*
// @match        *://*.shellshockers.us/*
// @match        *://*.shellshockers.world/*
// @match        *://*.shellshockers.xyz/*
// @match        *://*.shellsocks.com/*
// @match        *://*.softboiled.club/*
// @match        *://*.urbanegger.com/*
// @match        *://*.violentegg.club/*
// @match        *://*.violentegg.fun/*
// @match        *://*.yolk.best/*
// @match        *://*.yolk.life/*
// @match        *://*.yolk.rocks/*
// @match        *://*.yolk.tech/*
// @match        *://*.yolk.quest/*
// @match        *://*.yolk.today/*
// @match        *://*.zygote.cafe/*
// @match        *://*.shellshockers.best/*
// @match        *://*.eggboy.me/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

/* Valorant Kill Sounds: a sound on each of your kills that climbs with your streak, like Valorant's kill banner.
   Kill 1 to kill 5 each get their own sound, and kills after the 5th keep the 5th. Dying, a new round or a team
   switch starts again at 1, because that's when the game resets your streak.

   How it knows: when you crack someone, the game shows its message by calling
   vueApp.shellIngameNotification({ type: 0, streak }), with your streak once it's 2 or more. The script wraps that
   call: it starts the sound and the banner, then lets the game show its message as usual. Only your own kills make
   that call with type 0, so other players' kills, hits and your deaths do nothing. The game's code isn't changed.

   The sounds: five packs made in your browser when the game loads, fifteen of Valorant's own kill sounds, downloaded
   from this project on GitHub the first time you pick one and kept in this site's storage, or your own files, kept
   there too. They play through the game's sound output, so its Sound Effects volume turns them up and down with
   everything else.

   The banner: the banner for that kill pops up with its sound, below the crosshair and just above the game's own
   kill message. It always goes with the sound: a Valorant pack's own banner for that kill, or with the other packs, a
   cracked egg drawn in the style of Valorant's default one. It glows in its pack's colour, stays as long as its
   sound rings, and flares again on each swell of a Valorant ace.

   Settings ▸ the speaker tab ▸ Kill Sounds has the pack, a Test button (kill 1, 2 … 5, one per press), a volume
   and the banner's on/off. As with the game's settings around it, a change is kept when you press Confirm.

   window.ssKillSounds: version, settings(), set({ pack, volume, banner }) (banner: true or false), play(kill), and
   render(pack, kill), which returns the AudioBuffer for checking a sound. */
(() => {
  "use strict";
  if (window.ssKillSounds) return;   // already running: Tampermonkey and the Mod Menu both started it

  const VERSION = "1.2.0";
  const STORE = "ssKillSounds";
  const MAX_KILL = 5;
  const PACKS = [
    { id: "classic", name: "Classic" },
    { id: "crystal", name: "Crystal" },
    { id: "synth", name: "Synth" },
    { id: "blade", name: "Blade" },
    { id: "bubble", name: "Bubble" },
    // Valorant's own kill sounds and banners, downloaded when picked (see FILES). `glow` is the colour of the pack's
    // banner, which it glows in.
    { id: "default", name: "Valorant Default", valorant: true, glow: "#47ffbd" },
    { id: "reaver", name: "Reaver", valorant: true, glow: "#b856f5" },
    { id: "prelude", name: "Prelude to Chaos", valorant: true, glow: "#c42bc0" },
    { id: "primordium", name: "Primordium", valorant: true, glow: "#f78e74" },
    { id: "sovereign", name: "Sovereign", valorant: true, glow: "#86f7ff" },
    { id: "kuronami", name: "Kuronami", valorant: true, glow: "#61abd5" },
    { id: "evori", name: "Evori Dreamwings", valorant: true, glow: "#9b7cff" },
    { id: "champions2021", name: "Champions 2021", valorant: true, glow: "#c4b071" },
    { id: "gaia", name: "Gaia's Vengeance", valorant: true, glow: "#49c8f4" },
    { id: "recon", name: "Recon", valorant: true, glow: "#00fbc8" },
    { id: "blackthorn", name: "Blackthorn", valorant: true, glow: "#e7031c" },
    { id: "cyrax", name: "CYRAX", valorant: true, glow: "#f4f7fb" },
    { id: "singularity", name: "Singularity", valorant: true, glow: "#f1b18c" },
    { id: "prime2", name: "Prime//2.0", valorant: true, glow: "#9098f1" },
    { id: "sentinels", name: "Sentinels of Light", valorant: true, glow: "#e6e1a5" },
  ];
  const VALORANT = new Set(PACKS.filter(p => p.valorant).map(p => p.id));
  const CUSTOM = "custom", OFF = "off";
  const EGG = "egg", EGG_GLOW = "#47f5b4";   // the cracked egg banner, for the other packs and your own sounds
  const DEFAULTS = Object.freeze({ pack: "classic", volume: 0.8, banner: true });
  const warn = (...a) => console.warn("[Kill Sounds]", ...a);

  /* ---- Saved settings ---- */
  const isPack = p => p === CUSTOM || p === OFF || PACKS.some(x => x.id === p);
  function clean(s) {
    const ok = !!s && typeof s === "object";
    return {
      pack: ok && isPack(s.pack) ? s.pack : DEFAULTS.pack,
      volume: ok && Number.isFinite(s.volume) ? Math.min(1, Math.max(0, s.volume)) : DEFAULTS.volume,
      banner: !(ok && (s.banner === false || s.banner === OFF)),   // "off": how the first 1.1.0 test saved it
    };
  }
  let saved;
  try { saved = clean(JSON.parse(localStorage.getItem(STORE))); } catch { saved = clean(null); }
  function save(s) {
    saved = clean(s);
    try { localStorage.setItem(STORE, JSON.stringify(saved)); } catch { /* storage blocked: kept for this visit */ }
    if (running) getReady();
  }

  /* ---- The packs, made with the Web Audio API ----
     Each kill is rendered once, offline, into a short stereo clip, so a kill only has to start a clip. Every clip
     has its own fixed noise seed, so a pack sounds the same every time. */
  const SR = 48000;
  const semi = n => Math.pow(2, n / 12);
  const STEPS = [0, 2, 4, 7, 12];   // do re mi so do: each kill a step higher, the 5th an octave up

  function seeded(seed) {   // mulberry32
    let a = seed | 0;
    return () => {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  class Studio {
    constructor(seconds, seed) {
      const c = this.c = new OfflineAudioContext(2, Math.ceil(seconds * SR), SR);
      this.rand = seeded(seed);
      // Everything ends in a high-pass at 30 Hz, which takes out rumble and any offset a fast kick leaves.
      this.end = c.createBiquadFilter();
      this.end.type = "highpass";
      this.end.frequency.value = 30;
      this.end.connect(c.destination);
      this.bus = c.createGain();   // what the room and the echoes hear
      this.bus.connect(this.end);
    }
    // A room: noise that dies away to -60 dB over `seconds` and gets darker as it goes.
    reverb(seconds, wet, damp = 0.8) {
      const c = this.c, n = Math.ceil(seconds * SR), pre = Math.round(0.012 * SR), ir = c.createBuffer(2, n + pre, SR);
      for (let ch = 0; ch < 2; ch++) {
        const d = ir.getChannelData(ch);
        let y = 0;
        for (let i = 0; i < n; i++) {
          const t = i / n;
          y += (1 - damp * t) * (this.rand() * 2 - 1 - y);
          d[pre + i] = y * Math.exp(-6.9 * t);
        }
      }
      const conv = c.createConvolver(), g = c.createGain();
      conv.buffer = ir;
      g.gain.value = wet;
      this.bus.connect(conv); conv.connect(g); g.connect(this.end);
    }
    // Echoes that bounce between left and right.
    echo(time, feedback, wet, tone = 2600) {
      const c = this.c;
      const [l, r] = [-0.7, 0.7].map(pan => {
        const d = c.createDelay(1), f = c.createBiquadFilter(), fb = c.createGain(), g = c.createGain(), p = c.createStereoPanner();
        d.delayTime.value = time;
        f.type = "lowpass"; f.frequency.value = tone;
        fb.gain.value = feedback; g.gain.value = wet; p.pan.value = pan;
        d.connect(f); f.connect(fb); f.connect(g); g.connect(p); p.connect(this.end);
        return { d, fb };
      });
      this.bus.connect(l.d);
      l.fb.connect(r.d);
      r.fb.connect(l.d);
    }
    env(param, t, peak, attack, decay) {
      param.setValueAtTime(0, t);
      param.linearRampToValueAtTime(peak, t + attack);
      param.setTargetAtTime(0, t + attack, decay / 6.9);   // -60 dB after `decay` seconds
    }
    out(node, pan) {
      if (!pan) return node.connect(this.bus);
      const p = this.c.createStereoPanner();
      p.pan.value = pan;
      node.connect(p); p.connect(this.bus);
    }
    // One ringing partial. With `from`, it starts at freq × from and slides up into freq (a bloop).
    tone(t, freq, { amp = 0.2, attack = 0.002, decay = 0.5, type = "sine", detune = 0, pan = 0, from = 0, slide = 0.06 } = {}) {
      const c = this.c, o = c.createOscillator(), g = c.createGain();
      o.type = type;
      o.detune.value = detune;
      if (from) {
        o.frequency.setValueAtTime(freq * from, t);
        o.frequency.exponentialRampToValueAtTime(freq, t + slide);
      } else o.frequency.value = freq;
      this.env(g.gain, t, amp, attack, decay);
      o.connect(g); this.out(g, pan);
      o.start(t); o.stop(t + attack + decay + 0.05);
    }
    // Something struck: partials as [ratio, level, share of the decay]. With `shimmer`, each partial is played
    // twice, a few cents apart, one on each side. The overtones start up to a cycle late, so their first peaks
    // don't all land together.
    strike(t, freq, partials, { amp = 0.2, decay = 0.8, pan = 0, shimmer = 0 } = {}) {
      for (const [r, a, d] of partials) {
        const at = r === 1 ? t : t + this.rand() / (freq * r);
        if (!shimmer) { this.tone(at, freq * r, { amp: amp * a, decay: decay * d, pan }); continue; }
        this.tone(at, freq * r, { amp: amp * a / 2, decay: decay * d, detune: -shimmer, pan: pan - 0.25 });
        this.tone(at, freq * r, { amp: amp * a / 2, decay: decay * d, detune: shimmer, pan: pan + 0.25 });
      }
    }
    // Filtered noise: a click, a hiss or (with `to`) a sweep.
    noise(t, decay, { amp = 0.2, attack = 0.001, type = "bandpass", freq = 4000, to = 0, q = 0.8, pan = 0 } = {}) {
      const c = this.c, len = attack + decay + 0.05, n = Math.ceil(len * SR), b = c.createBuffer(1, n, SR), d = b.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = this.rand() * 2 - 1;
      const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
      s.buffer = b;
      f.type = type; f.Q.value = q;
      f.frequency.setValueAtTime(freq, t);
      if (to) f.frequency.exponentialRampToValueAtTime(to, t + attack + decay * 0.5);
      this.env(g.gain, t, amp, attack, decay);
      s.connect(f); f.connect(g); this.out(g, pan);
      s.start(t); s.stop(t + len);
    }
    // A kick: a low sine that drops in pitch. It stays out of the room, which would only blur it into a rumble.
    thump(t, { from = 150, to = 48, sweep = 0.07, amp = 0.5, decay = 0.2 } = {}) {
      const c = this.c, o = c.createOscillator(), g = c.createGain();
      o.frequency.setValueAtTime(from, t);
      o.frequency.exponentialRampToValueAtTime(to, t + sweep);
      this.env(g.gain, t, amp, 0.002, decay);
      o.connect(g); g.connect(this.end);
      o.start(t); o.stop(t + decay + 0.05);
    }
    // A glassy FM bell: bright when struck, mellowing into a pure tone.
    fm(t, freq, { ratio = 3.5, index = 1, mellow = 0.3, amp = 0.2, decay = 1, pan = 0 } = {}) {
      const c = this.c, car = c.createOscillator(), mod = c.createOscillator(), depth = c.createGain(), g = c.createGain();
      car.frequency.value = freq;
      mod.frequency.value = freq * ratio;
      depth.gain.setValueAtTime(index * freq * ratio, t);
      depth.gain.setTargetAtTime(0, t, mellow / 3);
      mod.connect(depth); depth.connect(car.frequency);
      this.env(g.gain, t, amp, 0.002, decay);
      car.connect(g); this.out(g, pan);
      const end = t + decay + 0.06;
      car.start(t); mod.start(t); car.stop(end); mod.stop(end);
    }
    // A chord of detuned saws through a closing low-pass filter. Each saw starts at its own point in its cycle, as
    // a synth's free-running oscillators would, rather than all of them jumping together on the first sample.
    stab(t, freqs, { amp = 0.06, voices = 3, cents = 14, cutoff = 6000, to = 700, sweep = 0.3, q = 4, decay = 0.45 } = {}) {
      const c = this.c, f = c.createBiquadFilter(), g = c.createGain();
      f.type = "lowpass"; f.Q.value = q;
      f.frequency.setValueAtTime(cutoff, t);
      f.frequency.exponentialRampToValueAtTime(to, t + sweep);
      this.env(g.gain, t, amp, 0.008, decay);   // a little softer than the click and the kick under it
      f.connect(g); g.connect(this.bus);
      for (const fr of freqs) for (let v = 0; v < voices; v++) {
        const o = c.createOscillator(), p = c.createStereoPanner(), x = voices > 1 ? v / (voices - 1) - 0.5 : 0;
        o.type = "sawtooth";
        o.frequency.value = fr;
        o.detune.value = x * 2 * cents;
        p.pan.value = x * 1.2;
        o.connect(p); p.connect(f);
        o.start(t + this.rand() / fr); o.stop(t + decay + 0.06);
      }
    }
  }

  const BAR = [[1, 1, 1], [2, 0.3, 0.55], [2.76, 0.42, 0.4], [4.07, 0.2, 0.28], [5.4, 0.12, 0.2]];   // a struck metal bar
  const SWORD = [[1, 1, 1], [1.47, 0.7, 0.8], [2.09, 0.55, 0.6], [2.56, 0.4, 0.5], [3.39, 0.3, 0.35], [4.22, 0.2, 0.25]];

  const BUILD = {
    // A sharp metal ping on a soft thump; the 5th adds a rising sweep and a sparkle on top.
    classic(kill) {
      const ace = kill === 5, f = 784 * semi(STEPS[kill - 1]);   // G5 A5 B5 D6 G6
      const s = new Studio(ace ? 2.6 : 2.0, 100 + kill);
      s.reverb(ace ? 1.6 : 1.2, ace ? 0.26 : 0.2);
      s.noise(0, 0.03, { amp: 0.22, type: "highpass", freq: 3500 });
      s.thump(0.004, { amp: 0.2, decay: 0.18 });   // just after the click, so their peaks don't stack
      s.strike(0, f, BAR, { amp: 0.3, decay: 0.8, shimmer: 2.5 });
      s.tone(0, f / 2, { amp: 0.1, type: "triangle", decay: 0.2 });
      if (ace) {
        s.noise(0, 0.25, { amp: 0.07, attack: 0.22, freq: 900, to: 7000, q: 1.2 });
        [16, 19, 24].forEach((n, i) => s.tone(0.08 + i * 0.07, 784 * semi(n), { amp: 0.07, decay: 0.5, pan: [-0.4, 0.4, 0][i] }));
      }
      return s;
    },
    // Glass chimes, one for each kill in the streak, climbing; the last one rings on. The 5th ends on a chord.
    crystal(kill) {
      const ace = kill === 5, s = new Studio(ace ? 3.0 : 2.4, 200 + kill);
      s.reverb(1.8, 0.3);
      s.noise(0, 0.02, { amp: 0.1, type: "highpass", freq: 6000 });
      const scale = [0, 2, 4, 7, 9];   // C6 D6 E6 G6 A6
      for (let i = 0; i < kill; i++) {
        const last = i === kill - 1, t = i * 0.055, f = 1047 * semi(scale[i]), pan = kill > 1 ? (i / (kill - 1) - 0.5) * 0.6 : 0;
        s.fm(t, f, { index: last ? 1.1 : 0.7, amp: last ? 0.22 : 0.12, decay: last ? 1.4 : 0.5, pan });
        s.tone(t, f * 2, { amp: last ? 0.05 : 0.025, decay: last ? 0.7 : 0.25, pan: -pan });
      }
      if (ace) [0, 4, 7, 12].forEach(n => s.fm(0.29, 1047 * semi(n), { index: 0.5, amp: 0.07, decay: 1.6 }));
      return s;
    },
    // A synthwave chord stab on a kick, with echoes; the 5th opens up with a higher voice.
    synth(kill) {
      const ace = kill === 5, root = 220 * semi([0, 3, 5, 7, 12][kill - 1]);   // A3 C4 D4 E4 A4
      const s = new Studio(ace ? 2.6 : 2.0, 300 + kill);
      s.reverb(1.2, 0.12);
      s.echo(0.17, 0.3, 0.22);
      s.thump(0, { from: 170, to: 45, sweep: 0.06, amp: 0.1, decay: 0.22 });
      s.noise(0, 0.05, { amp: 0.1, type: "highpass", freq: 7000 });
      s.stab(0, ace ? [root, root * 1.5, root * 2, root * 3] : [root, root * 1.5, root * 2], { amp: ace ? 0.05 : 0.06, sweep: 0.6, decay: 0.6 });
      s.tone(0, root * 4, { amp: 0.07, type: "triangle", decay: ace ? 0.9 : 0.5 });
      if (ace) s.tone(0.12, root * 6, { amp: 0.04, type: "triangle", decay: 0.7, pan: 0.3 });
      return s;
    },
    // A sword swish into a ringing shing. The 4th kill cuts twice and the 5th three times, climbing.
    blade(kill) {
      const cuts = kill === 5 ? 3 : kill === 4 ? 2 : 1, s = new Studio(kill === 5 ? 2.4 : 1.9, 400 + kill);
      s.reverb(1.1, 0.2);
      for (let i = 0; i < cuts; i++) {
        const t = i * 0.12, hit = t + 0.045, last = i === cuts - 1;
        const f = 1175 * semi(STEPS[kill - cuts + i]);   // D6 E6 F#6 A6 D7
        const pan = cuts > 1 ? (i % 2 ? 0.3 : -0.3) : 0;
        s.noise(t, 0.08, { amp: 0.2, attack: 0.045, freq: 700, to: 7500, q: 1.4, pan: -pan });
        s.noise(hit, 0.015, { amp: 0.18, type: "highpass", freq: 5000, pan });
        s.strike(hit, f, SWORD, { amp: last ? 0.16 : 0.12, decay: 0.9, pan });
      }
      return s;
    },
    // A bubbly bloop that slides up into its note; the 5th is a quick run of them.
    bubble(kill) {
      const ace = kill === 5, s = new Studio(ace ? 1.6 : 1.2, 500 + kill), n = ace ? 4 : 1;
      s.reverb(0.6, 0.12);
      for (let i = 0; i < n; i++) {
        const t = i * 0.065, f = 523 * semi(ace ? [0, 4, 7, 12][i] : STEPS[kill - 1]);   // C5 D5 E5 G5, then C5 E5 G5 C6
        s.tone(t, f, { amp: 0.3, decay: ace && i < n - 1 ? 0.1 : 0.18, from: 0.55 });
        s.tone(t, f * 2, { amp: 0.05, decay: 0.08, from: 0.55 });
        s.noise(t, 0.01, { amp: 0.08, freq: 2500, q: 2 });
      }
      return s;
    },
  };

  /* ---- Levels ----
     Every clip, yours included, is matched to the same loudness, so no pack or kill is louder than another (a
     Valorant pack keeps Valorant's own balance between its kills: see loadValorant). Its peaks are held to 12 dB
     over that: a peak that stands out further is turned down for a moment, rather than the whole clip. That takes a
     few dB at most off the click or strike a sound starts with. Silence before your own sound starts is cut, so it
     plays the moment you get the kill. */
  const TARGET = 0.237;   // the loudness (see rms): -12.5 dBFS
  const CREST = 3.98;     // peaks stay under 12 dB over that, -0.5 dBFS

  // Loudness: the RMS of the loudest 0.1 s (about what the ear adds up for a short sound), weighted as loudness
  // meters weight it (ITU-R BS.1770: the highs count a little more), but with the low cut at 150 Hz, as deep bass
  // carries little on the headsets and laptop speakers most people play on.
  function weighting(sr) {   // [b0, b1, b2, a1, a2] for each filter
    const K = Math.tan(Math.PI * 1681.97 / sr), Q = 0.7072, Vh = Math.pow(10, 4 / 20), Vb = Math.pow(Vh, 0.4997), a0 = 1 + K / Q + K * K;
    const w = 2 * Math.PI * 150 / sr, al = Math.sin(w) / Math.SQRT2, cw = Math.cos(w), h0 = 1 + al;
    return [
      [(Vh + Vb * K / Q + K * K) / a0, 2 * (K * K - Vh) / a0, (Vh - Vb * K / Q + K * K) / a0, 2 * (K * K - 1) / a0, (1 - K / Q + K * K) / a0],
      [(1 + cw) / 2 / h0, -(1 + cw) / h0, (1 + cw) / 2 / h0, -2 * cw / h0, (1 - al) / h0],
    ];
  }
  function rms(chans, from, to, sr) {
    const len = to - from, e = new Float64Array(len + 1), filters = weighting(sr);
    for (const x of chans) {
      let y = x.subarray(from, to);
      for (const [b0, b1, b2, a1, a2] of filters) {
        const z = new Float64Array(len);
        let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
        for (let i = 0; i < len; i++) {
          const v = b0 * y[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
          x2 = x1; x1 = y[i]; y2 = y1; y1 = v;
          z[i] = v;
        }
        y = z;
      }
      for (let i = 0; i < len; i++) e[i + 1] += y[i] * y[i] / chans.length;
    }
    for (let i = 1; i <= len; i++) e[i] += e[i - 1];
    const win = Math.max(1, Math.min(len, Math.round(0.1 * sr))), hop = Math.max(1, Math.round(0.005 * sr));
    let best = 0;
    for (let i = 0; i + win <= len; i += hop) best = Math.max(best, e[i + win] - e[i]);
    return Math.max(Math.sqrt(best / win), 1e-6);
  }

  // A look-ahead limiter: for each sample, the gain (≤ 1) that keeps it under `ceiling` once `gain` is applied. The
  // gain comes down over the 2 ms before a peak and goes back up over about 80 ms after it.
  function limiter(chans, from, len, gain, ceiling, sr) {
    const L = Math.max(1, Math.round(0.002 * sr)), r = new Float32Array(len + 2 * L).fill(1);
    for (let i = 0; i < len; i++) {
      let a = 0;
      for (const x of chans) { const v = Math.abs(x[from + i]); if (v > a) a = v; }
      if (a * gain > ceiling) r[L + i] = ceiling / (a * gain);
    }
    // m[j]: the lowest of r[j … j+L-1], kept with a queue of rising values.
    const m = new Float32Array(len + L), q = new Int32Array(len + 2 * L);
    let h = 0, t = 0;
    for (let i = 0; i < len + 2 * L; i++) {
      while (t > h && r[q[t - 1]] >= r[i]) t--;
      q[t++] = i;
      const j = i - L + 1;
      if (j >= 0 && j < len + L) { while (q[h] < j) h++; m[j] = r[q[h]]; }
    }
    // Sample i gets the average of the L windows that hold it, so it never comes out over the ceiling.
    const env = new Float32Array(len), up = 1 - Math.exp(-1 / (0.08 * sr));
    let sum = 0, g = 1;
    for (let j = 1; j <= L; j++) sum += m[j];
    for (let i = 0; i < len; i++) {
      if (i) sum += m[i + L] - m[i];
      const a = sum / L;
      g = i === 0 || a < g ? a : g + (a - g) * up;
      env[i] = g;
    }
    return env;
  }

  // With `gain`, the clip gets that gain as it is (its loudness is left alone), and only its peaks are held.
  function master(buf, { trimStart = false, maxSeconds = 6, gain: fixed = 0 } = {}) {
    const sr = buf.sampleRate, n = buf.length, chans = [];
    for (let ch = 0; ch < buf.numberOfChannels; ch++) chans.push(buf.getChannelData(ch));
    let peak = 0;
    for (const x of chans) for (let i = 0; i < n; i++) { const a = Math.abs(x[i]); if (a > peak) peak = a; }
    if (!Number.isFinite(peak) || peak < 1e-4) return null;
    let from = 0;
    if (trimStart) {
      const th = peak * 0.02;
      while (from < n && !chans.some(x => Math.abs(x[from]) > th)) from++;
      from = Math.max(0, from - Math.round(0.004 * sr));
    }
    let to = n;
    while (to > from && !chans.some(x => Math.abs(x[to - 1]) > peak * 0.001)) to--;   // the tail under -60 dB goes
    const capped = to - from > maxSeconds * sr;
    if (capped) to = from + Math.round(maxSeconds * sr);
    const len = to - from;
    if (len < 64) return null;
    const out = new AudioBuffer({ length: len, numberOfChannels: chans.length, sampleRate: sr });
    const ys = chans.map((x, ch) => out.getChannelData(ch));
    const fadeIn = from ? Math.round(0.002 * sr) : 0, fadeOut = Math.min(len >> 1, Math.round((capped ? 0.06 : 0.01) * sr));
    const target = TARGET, ceiling = TARGET * CREST;
    let gain = fixed || Math.min(100, target / rms(chans, from, to, sr));
    // Limiting takes some loudness off with it, so the gain goes up again until the loudness is right.
    for (let pass = 0; ; pass++) {
      const env = limiter(chans, from, len, gain, ceiling, sr);
      chans.forEach((x, ch) => {
        const y = ys[ch];
        for (let i = 0; i < len; i++) {
          let g = gain * env[i];
          if (i < fadeIn) g *= i / fadeIn;
          if (i >= len - fadeOut) g *= (len - i) / fadeOut;
          y[i] = x[from + i] * g;
        }
      });
      if (pass === 3 || fixed) break;
      const now = rms(ys, 0, len, sr);
      if (Math.abs(now / target - 1) < 0.03) break;
      gain = Math.min(100, gain * target / now);
    }
    return out;
  }

  async function renderKill(pack, kill) {
    if (VALORANT.has(pack)) return (await loadValorant(pack))[kill - 1];
    if (!BUILD[pack]) throw new Error("No pack called " + pack);
    const buf = master(await BUILD[pack](kill).c.startRendering());
    if (!buf) throw new Error(`${pack} ${kill} came out silent`);
    return buf;
  }

  /* ---- Valorant's own kill sounds and banners ----
     Five MP3s and five PNGs a pack, about 1 MB, in this project's valorant folder on GitHub. They come from the
     commit that added them, so the files this version uses never change under it. A pack is downloaded the first
     time it's needed, then kept in this site's Cache Storage, so it doesn't download again on the next visit. */
  const FILES = "https://raw.githubusercontent.com/Virojet/Shell-Shockers-Valorant-Kill-Sounds/7e7305c5fd296117c14f49ec9c1941ae3b1b84e8/valorant";
  const KEEP = "ss-kill-sounds";
  let kept = null;
  function keep() {
    kept = kept || (async () => {
      const store = await caches.open(KEEP);
      for (const req of await store.keys()) if (!req.url.startsWith(FILES + "/")) store.delete(req);   // an older version's
      return store;
    })().catch(() => null);   // no storage here (a private window, or it's blocked): they download on each visit
    return kept;
  }
  async function download(pack, kill, type) {
    const url = `${FILES}/${pack}/${kill}.${type}`, store = await keep();
    const old = store && await store.match(url).catch(() => null);
    if (old) return old;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Couldn't download ${pack} ${kill}.${type} (HTTP ${res.status})`);
    if (store) store.put(url, res.clone()).catch(() => { /* storage full: it downloads again next time */ });
    return res;
  }
  // One gain for the whole pack brings its kills 1 to 4 to the other packs' loudness on average (in Valorant, a
  // streak gets a little louder as it climbs), so its ace stays as much bigger as Valorant made it. An ace rings
  // for up to 10 s.
  async function loadValorant(pack) {
    const c = new OfflineAudioContext(2, 1, SR);
    const bufs = await Promise.all(Array.from({ length: MAX_KILL }, async (_, i) =>
      c.decodeAudioData(await (await download(pack, i + 1, "mp3")).arrayBuffer())));
    const chans = b => Array.from({ length: b.numberOfChannels }, (_, ch) => b.getChannelData(ch));
    const logs = bufs.slice(0, -1).map(b => Math.log(rms(chans(b), 0, b.length, b.sampleRate)));
    const gain = TARGET / Math.exp(logs.reduce((a, b) => a + b) / logs.length);
    return bufs.map((b, i) => {
      const out = master(b, { gain, maxSeconds: 12 });
      if (!out) throw new Error(`${pack} ${i + 1} came out silent`);
      return out;
    });
  }

  /* ---- Your own sounds: up to 5 files in this site's IndexedDB ---- */
  const MAX_FILES = 5, MAX_BYTES = 4 * 1024 * 1024;
  function idb(mode, fn) {
    return new Promise((resolve, reject) => {
      let req;
      try { req = indexedDB.open("ss-kill-sounds", 1); } catch (e) { return reject(e); }
      req.onupgradeneeded = () => req.result.createObjectStore("files");
      req.onerror = () => reject(req.error);
      req.onsuccess = () => {
        const db = req.result;
        try {
          const tx = db.transaction("files", mode), r = fn(tx.objectStore("files"));
          tx.oncomplete = () => { db.close(); resolve(r && r.result); };
          tx.onerror = tx.onabort = () => { db.close(); reject(tx.error); };
        } catch (e) { db.close(); reject(e); }
      };
    });
  }
  const readFiles = () => idb("readonly", st => st.get("files")).then(v => Array.isArray(v) ? v : []);
  const readNames = () => idb("readonly", st => st.get("names")).then(v => Array.isArray(v) ? v : []);
  const writeFiles = list => idb("readwrite", st => { st.put(list, "files"); return st.put(list.map(f => f.name), "names"); });
  // A file that won't play fails the lot, with a short message naming it (`note`) and a longer one (`message`).
  async function decodeAll(list) {
    const c = new OfflineAudioContext(2, 1, SR), out = [];
    const fail = (note, message, cause) => Object.assign(new Error(message), { note, cause });
    for (const f of list) {
      let buf;
      try { buf = master(await c.decodeAudioData(f.data.slice(0)), { trimStart: true }); }
      catch (err) { throw fail("Can't play " + f.name, `Can't play ${f.name}. MP3, OGG and WAV files work.`, err); }
      if (!buf) throw fail("No sound in " + f.name, `There's no sound in ${f.name}.`);
      out.push(buf);
    }
    return out;
  }
  const byName = (a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });

  /* ---- Clips ready to play ---- */
  const cache = new Map();   // pack → Promise of its clips: 5, or 1 to 5 of your own
  function clips(pack) {
    let p = cache.get(pack);
    if (p) return p;
    p = pack === CUSTOM ? readFiles().then(decodeAll) : VALORANT.has(pack) ? loadValorant(pack) : (async () => {
      const list = [];
      for (let k = 1; k <= MAX_KILL; k++) list.push(await renderKill(pack, k));
      return list;
    })();
    cache.set(pack, p);
    p.catch(() => { if (cache.get(pack) === p) cache.delete(pack); });
    // Only the saved pack and the last one tried stay in memory.
    for (const k of [...cache.keys()]) if (cache.size > 2 && k !== pack && k !== saved.pack) cache.delete(k);
    return p;
  }
  const clipFor = (list, kill) => list[Math.min(kill, list.length) - 1];

  /* ---- Playing ----
     Into the game's own sound output (BAWK, the game's audio engine), so its Sound Effects volume applies to the
     kill sounds too. They join it after its compressor, which holds everything that goes through it at about the
     same level and would leave the Kill Sounds volume almost nothing to do. If the game's output isn't there, a
     sound output of its own. A long sound (a Valorant ace rings for up to 10 s) fades out as the next kill's sound
     starts, so kills past the 5th don't pile aces up. */
  const OUT = 1.1;           // at 80% and the game's default Sound Effects volume, a kill peaks just under a gunshot
  const MAX_PEAK = 0.89;     // -1 dBFS: with both volumes near full, a kill stops getting louder there instead of clipping
  const GAP = 0.12;          // kills that land together (one grenade) still sound one after the other
  const MAX_VOICES = 4;
  const LONG = 4;            // seconds: a sound this long gives way to the next one
  const voices = new Set();
  let own = null, lastAt = 0, lastCtx = null;
  function output() {
    const B = window.BAWK, ctx = B && B.audioCtx, node = B && B.gainNode;
    if (ctx && node && ctx.state !== "closed") return node.gain.value > 0 ? { ctx, node } : null;   // 0: the game's sound is off
    if (!own || own.ctx.state === "closed") {
      const ctx = new AudioContext(), node = ctx.createGain();
      node.gain.value = 0.6;   // the game's default Sound Effects volume
      node.connect(ctx.destination);
      own = { ctx, node };
    }
    return own;
  }
  // Returns how long until the sound starts (see GAP), so its banner can pop up with it.
  function play(buf, volume) {
    const out = buf && volume > 0 && output();
    if (!out) return 0;
    const { ctx, node } = out;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const src = ctx.createBufferSource(), g = ctx.createGain(), now = ctx.currentTime;
    src.buffer = buf;
    g.gain.value = Math.min(volume * OUT, MAX_PEAK / (TARGET * CREST * node.gain.value));   // a clip peaks at TARGET × CREST at most
    src.connect(g); g.connect(node);
    const at = lastCtx === ctx ? Math.min(Math.max(now, lastAt + GAP), now + 0.5) : now;
    src.start(at);
    lastAt = at; lastCtx = ctx;
    for (const old of voices) if (old.long) fade(old, at, 0.06);
    const v = { src, g, ctx, long: buf.duration > LONG };
    voices.add(v);
    src.onended = () => { voices.delete(v); try { g.disconnect(); } catch { /* already gone */ } };
    if (voices.size > MAX_VOICES) fade(voices.values().next().value);
    return at - now;
  }
  // Down to silence from `at` (or now), over about 7 × `time` seconds.
  function fade(v, at = 0, time = 0.008) {
    voices.delete(v);
    try {
      const t = Math.max(at, v.ctx.currentTime);
      v.g.gain.cancelScheduledValues(t);
      v.g.gain.setTargetAtTime(0, t, time);
      v.src.stop(t + 7 * time);
    } catch { /* already stopped */ }
  }
  const quiet = () => [...voices].forEach(v => fade(v));

  /* ---- The kill banner ----
     It pops up below the crosshair as its kill's sound starts, the way Valorant's does: in fast, a little big and
     bright, then it settles with a glow in its pack's colour, stays while the sound rings and fades.
     It sits between the crosshair and the game's own kill message, which starts 67% of the way down the screen (63%
     with a Shell Streak). Like the game's UI, it's sized by the screen's height, so it keeps that place on any
     screen. It never takes a click. */
  const BANNER = "ss-kill-banner";
  // The banner a kill shows goes with its sound: a Valorant pack's own, or the egg with the other packs and your
  // own sounds. Sounds off, the egg still shows.
  const bannerFor = s => !s.banner ? null : VALORANT.has(s.pack) ? s.pack : EGG;
  const arts = new Map();   // banner → Promise of its 5 pictures, decoded and ready to show
  function art(look) {
    let p = arts.get(look);
    if (p) return p;
    p = Promise.all(Array.from({ length: MAX_KILL }, async (_, i) => {
      const img = new Image();
      img.alt = "";
      img.draggable = false;
      img.style.cssText = "display: block; width: 100%; height: 100%;";
      img.src = look === EGG ? egg(i + 1) : URL.createObjectURL(await (await download(look, i + 1, "png")).blob());
      await img.decode();
      return img;
    }));
    arts.set(look, p);
    p.catch(() => { if (arts.get(look) === p) arts.delete(look); });
    return p;
  }
  // Shell Shockers' own banner, drawn in the style of Valorant's default one: a cracked egg in a ring in place of
  // its skull, and around it a glowing mark for each kill in the streak (two sit left and right, more start at the
  // top, as in Valorant's).
  function egg(kill) {
    const at = (r, a) => `${(150 + r * Math.cos(a)).toFixed(1)} ${(150 + r * Math.sin(a)).toFixed(1)}`;
    const arc = (r, a, b) => `M${at(r, a)}A${r} ${r} 0 0 1 ${at(r, b)}`;
    const turn = kill === 2 ? 0 : -Math.PI / 2;
    const marks = Array.from({ length: kill }, (_, i) => arc(76, turn + i * 2 * Math.PI / kill - 0.3, turn + i * 2 * Math.PI / kill + 0.3)).join("");
    const lines = arc(91, -2.2, -0.94) + arc(91, 0.94, 2.2) + "M150 42V54M150 246V258M46 141l9 9-9 9M55 141l9 9-9 9M254 141l-9 9 9 9M245 141l-9 9 9 9";
    const shell = "M150 106C169 106 183 138 183 160C183 181 168 194 150 194C132 194 117 181 117 160C117 138 131 106 150 106Z";
    const eyes = "M127 156L146 163L144 171L130 169ZM173 156L154 163L156 171L170 169Z", glint = "M131 159L144 164L143 168L132 167ZM169 159L156 164L157 168L168 167Z";
    return "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">` +
      `<defs><filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b"/>` +
      `<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>` +
      `<clipPath id="left"><rect width="150" height="300"/></clipPath></defs>` +
      `<path d="${lines}" fill="none" stroke="#dfe6ea" stroke-opacity=".6" stroke-width="1.6"/>` +
      `<circle cx="150" cy="150" r="58" fill="#a9bac2" fill-opacity=".14"/>` +
      `<circle cx="150" cy="150" r="60" fill="none" stroke="#f4f4f4" stroke-width="5"/>` +
      `<path d="${marks}" fill="none" stroke="#47f5b4" stroke-width="9" stroke-linecap="round" filter="url(#glow)"/>` +
      `<path d="${shell}" fill="#d3d3d3"/><path d="${shell}" fill="#efefef" clip-path="url(#left)"/>` +
      `<path d="M120 146L130 139L139 147L149 136L158 147L168 138L180 144" fill="none" stroke="#8e8e8e" stroke-width="3"/>` +
      `<path d="${eyes}" fill="#5d6866" stroke="#5d6866" stroke-width="3" stroke-linejoin="round"/>` +
      `<path d="${glint}" fill="#7ff8d4" filter="url(#glow)"/></svg>`);
  }
  /* How a banner moves with its sound. It stays as long as the sound rings (until it's 20 dB down from its
     loudest), 2.2 s at least and 4.6 s at most, so a Valorant ace keeps its banner up while it rings. Each later
     swell that comes back within 4 dB of the loudest makes it flare again: Valorant's aces swell one to three times
     in their first 1.6 s. Their kills 1 to 4, like the other packs' sounds, are one hit, so the banner pops once. */
  const shapes = new WeakMap();   // sound → { ring, swells }, in seconds
  function shape(buf) {
    let s = shapes.get(buf);
    if (s) return s;
    const F = 0.02, W = Math.round(buf.sampleRate * F), chans = [], env = [];
    for (let ch = 0; ch < buf.numberOfChannels; ch++) chans.push(buf.getChannelData(ch));
    for (let i = 0; i + W <= buf.length; i += W) {
      let sum = 0;
      for (const x of chans) for (let j = i; j < i + W; j++) sum += x[j] * x[j];
      env.push(Math.sqrt(sum / (W * chans.length)));
    }
    const peak = Math.max(0, ...env);
    let end = env.length;
    while (end > 0 && env[end - 1] < peak * 0.1) end--;
    s = { ring: end * F, swells: [] };
    let low = Infinity, last = 0;   // the quietest it's been since the last hit, and when that hit was
    for (let i = 1; i < end - 1 && i * F <= 3; i++) {
      const t = i * F;
      low = Math.min(low, env[i]);
      // A peak back within 4 dB of the loudest, 3 dB or more over the dip before it, 0.4 s or more after the last.
      if (env[i] >= peak * 0.63 && env[i] >= env[i - 1] && env[i] > env[i + 1] && env[i] > low * 1.41 && t - last >= 0.4) {
        s.swells.push(t);
        last = t;
        low = env[i];
      }
    }
    shapes.set(buf, s);
    return s;
  }
  // A kill's banner, fit to its sound (`buf`, or none: a plain pop). The ace comes in bigger.
  function fitFor(look, buf, kill) {
    const { ring, swells } = buf ? shape(buf) : { ring: 0, swells: [] };
    const time = Math.min(4.6, Math.max(2.2, ring + 0.9));
    return { time, swells: swells.filter(t => t >= 0.35 && t <= time - 0.85), ace: kill >= MAX_KILL,
      glow: (PACKS.find(p => p.id === look) || {}).glow || EGG_GLOW };
  }
  // Its two animations: the box moves (in, settle, a kick on each swell, fade) and the picture glows (a flash, then
  // its pack's colour, flaring on each swell). Times are in seconds.
  function frames({ time, swells, glow, ace }) {
    const at = t => Math.min(1, Math.max(0, t / time));
    const halo = (bright, blur, alpha) => `brightness(${bright}) drop-shadow(0 0 ${blur}vh ${glow}${alpha})`;
    const calm = halo(1, 0.6, "59");
    const box = [
      { offset: 0, opacity: 0, transform: `scale(${ace ? 1.75 : 1.5})`, easing: "cubic-bezier(.2, .8, .3, 1)" },
      { offset: at(0.13), opacity: 1, transform: "scale(.95)" },
      { offset: at(0.31), opacity: 1, transform: "scale(1)" },
    ];
    const pic = [
      { offset: 0, filter: halo(ace ? 3 : 2.5, ace ? 2.8 : 2.2, "ff") },
      { offset: at(0.13), filter: halo(1.8, 1.6, "cc") },
      { offset: at(0.31), filter: calm },
    ];
    for (const t of swells) {
      box.push({ offset: at(t), transform: "scale(1)", easing: "cubic-bezier(.2, .8, .3, 1)" },
        { offset: at(t + 0.08), transform: "scale(1.06)" }, { offset: at(t + 0.34), transform: "scale(1)" });
      pic.push({ offset: at(t), filter: calm }, { offset: at(t + 0.06), filter: halo(1.6, 1.8, "e6") },
        { offset: at(t + 0.4), filter: calm });
    }
    box.push({ offset: at(time - 0.48), opacity: 1, transform: "scale(1)", easing: "ease-in" },
      { offset: 1, opacity: 0, transform: "scale(.96)" });
    pic.push({ offset: 1, filter: calm });
    return { box, pic };
  }
  let bannerGen = 0;
  function showBanner(img, delay, fit) {
    const gen = bannerGen;
    setTimeout(() => {
      if (gen !== bannerGen || !running || !document.body) return;
      let box = document.getElementById(BANNER);
      if (!box) {
        box = el("div");
        box.id = BANNER;
        box.style.cssText = "position: fixed; left: 50%; top: 52vh; width: 16vh; height: 16vh; margin-left: -8vh; " +
          "pointer-events: none; z-index: 2147483000; opacity: 0;";
        document.body.append(box);
      }
      box.replaceChildren(img);
      box.getAnimations({ subtree: true }).forEach(a => a.cancel());   // the last banner's, and this picture's from before
      const { box: moves, pic } = frames(fit), timing = { duration: fit.time * 1000 };
      box.animate(moves, timing);
      img.animate(pic, timing);
    }, Math.max(0, delay * 1000));
  }
  function hideBanner() {
    bannerGen++;
    document.getElementById(BANNER)?.remove();
  }

  // A kill: its sound, and its banner, which pops up as the sound starts. Either one can be off, or fail alone.
  let warned = false;
  const failed = err => { if (!warned) { warned = true; warn("Couldn't get the kill's sound or banner ready:", err); } return null; };
  function onKill(streak) {
    const kill = Math.min(MAX_KILL, Math.max(1, Math.floor(streak) || 1)), { pack, volume } = saved, look = bannerFor(saved);
    const sound = pack !== OFF && volume > 0 ? clips(pack).then(list => clipFor(list, kill), failed) : null;
    const banner = look ? art(look).then(list => list[kill - 1], failed) : null;
    Promise.all([sound, banner]).then(([buf, img]) => {
      if (!running) return;
      const delay = buf && saved.pack === pack ? play(buf, saved.volume) : 0;
      if (img && bannerFor(saved) === look) showBanner(img, delay, fitFor(look, buf, kill));
    });
  }

  /* ---- The kill hook ---- */
  const MARK = Symbol.for("ssKillSounds.hook");
  let hooked = null;   // { app, orig, wrap }
  function hook() {
    const app = window.vueApp, cur = app && app.shellIngameNotification;
    if (typeof cur !== "function") return false;
    if (cur[MARK]) {   // ours already (this script's earlier hook)
      cur[MARK].live = true;
      hooked = { app, orig: cur[MARK].orig, wrap: cur };
      return true;
    }
    const state = { live: true, orig: cur };
    const wrap = function (item) {
      // Read before calling the game: it rewrites the message object.
      if (state.live && running && item && item.type === 0) {
        try { onKill(Number(item.streak) || 1); } catch (err) { warn(err); }
      }
      return cur.apply(this, arguments);
    };
    wrap[MARK] = state;
    try { app.shellIngameNotification = wrap; } catch { return false; }
    if (app.shellIngameNotification !== wrap) return false;
    hooked = { app, orig: cur, wrap };
    return true;
  }
  function unhook() {
    if (!hooked) return;
    const { app, orig, wrap } = hooked;
    hooked = null;
    // If another script wrapped it since, ours stays in the chain but does nothing.
    wrap[MARK].live = false;
    try { if (app.shellIngameNotification === wrap) app.shellIngameNotification = orig; } catch { /* left as is */ }
  }

  /* ---- Settings ▸ the speaker tab ▸ Kill Sounds, next to Language ---- */
  const CELL = "ss-kill-sounds";
  let ui = null, pending = null, testKill = 0, customNames = [];
  let pendingFiles = null, fileGen = 0;   // files picked since the popup opened: { list, names, decoded }
  const names = () => pendingFiles ? pendingFiles.names : customNames;
  // The slider is the game's 14em, but may give up a little so the cell fits its column: at full size it would
  // widen the column and push the popup's right edge out.
  const CSS = `
#${CELL} { min-width: 0; }
#${CELL} .f_row { align-items: center; }
#${CELL} select, #${CELL} input[type=range] { min-width: 0; }
#${CELL} select { flex: 1 1 auto; }
#${CELL} .ss_button, #${CELL} label { flex: none; }
#${CELL} .ss_button:disabled { opacity: .5; cursor: default; }
#${CELL} .ssks-note { margin: 0 0 var(--ss-space-md) var(--ss-space-sm); font-weight: 700; font-size: .8em; min-width: 0;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
#${CELL} .ssks-note.ssks-error { color: var(--ss-red, #d15354) !important; }`;   // the game's text_blue4 is !important too

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function injectUI() {
    const grid = document.querySelector("#settings_misc > .display-grid");
    if (!grid) return;
    if (ui) removeUI();
    const cell = el("div", "f_col");
    cell.id = CELL;
    const group = (label, list) => {
      const g = el("optgroup");
      g.label = label;
      for (const p of list) g.append(new Option(p.name, p.id));
      return g;
    };
    const select = el("select", "ss_select ss_marginright_sm");
    select.append(group("Sound packs", PACKS.filter(p => !p.valorant)), group("Valorant", PACKS.filter(p => p.valorant)),
      new Option("Your own sounds", CUSTOM), new Option("Off", OFF));
    const test = el("button", "ss_button btn_blue bevel_blue btn_sm", "Test");
    test.type = "button";
    test.title = "Plays kill 1, then 2, and so on up to 5, with its banner.";
    // The game's own checkbox, as in its other settings tabs.
    const banner = el("input");
    banner.type = "checkbox";
    const bannerLabel = el("label", "ss_checkbox label", "Kill Banner ");
    bannerLabel.title = "A banner for each kill pops up with its sound: the Valorant pack's own, or a cracked egg with the other packs.";
    bannerLabel.append(banner, el("span", "checkmark"));
    const bannerRow = el("div", "nowrap");
    bannerRow.append(bannerLabel);
    const range = el("input", "ss_slider");
    Object.assign(range, { type: "range", min: "0", max: "1", step: "0.01" });
    const value = el("label", "ss_slider label text_blue4");
    const files = el("div", "f_row");
    const choose = el("button", "ss_button btn_blue bevel_blue btn_sm", "Choose files");
    choose.type = "button";
    choose.title = "Pick 1 to 5 sound files (MP3, OGG or WAV, up to 4 MB each). In name order they play for kills 1 to 5, and the last one repeats after that.";
    const note = el("span", "ssks-note text_blue4");
    const input = el("input");
    Object.assign(input, { type: "file", accept: "audio/*,.mp3,.ogg,.wav,.m4a,.webm", multiple: true, hidden: true });
    const row = (...kids) => { const r = el("div", "f_row"); r.append(...kids); return r; };
    files.append(choose, note, input);
    cell.append(el("h3", "margin-bottom-none h-short", "Kill Sounds"), row(select, test), row(range, value), files, bannerRow);
    grid.append(cell);

    let style = document.getElementById(CELL + "-style");
    if (!style) {
      style = el("style", null, CSS);
      style.id = CELL + "-style";
      (document.head || document.documentElement).append(style);
    }

    select.addEventListener("change", () => {
      pending.pack = select.value;
      testKill = 0;
      refresh();
      if (pending.pack === CUSTOM && !names().length) input.click();
      else if (pending.pack !== OFF) preview(testKill = 1);
    });
    range.addEventListener("input", () => {
      pending.volume = Math.min(1, Math.max(0, Number(range.value) || 0));
      value.textContent = String(Math.round(pending.volume * 100));
    });
    range.addEventListener("change", () => preview(testKill || 1));
    test.addEventListener("click", () => preview(testKill = testKill % MAX_KILL + 1));
    banner.addEventListener("change", () => {
      pending.banner = banner.checked;
      refresh();
      if (pending.banner) preview(testKill || 1);
    });
    choose.addEventListener("click", () => input.click());
    input.addEventListener("change", () => { const f = [...input.files]; input.value = ""; addFiles(f); });

    // The popup opening or closing puts the saved settings back in the controls, so a change only stays if
    // Confirm saved it (Cancel, the X and Esc all leave things as they were).
    const me = { cell, select, test, range, value, files, choose, note, input, banner, io: null, shown: null };
    me.io = new IntersectionObserver(entries => {
      const shown = entries[entries.length - 1].isIntersecting;
      if (ui !== me || shown === me.shown) return;
      me.shown = shown;
      revert({ ...saved });
    });
    me.io.observe(cell.closest("#settings") || grid);
    ui = me;
    revert({ ...saved });
  }
  function removeUI() {
    if (!ui) return;
    ui.io.disconnect();
    ui.cell.remove();
    document.getElementById(CELL + "-style")?.remove();
    ui = null;
    pendingFiles = null;
    fileGen++;
  }
  // The controls go back to `to`, and files picked since (or still loading) are dropped.
  function revert(to) {
    pending = to;
    pendingFiles = null;
    fileGen++;
    testKill = 0;
    refresh();
  }
  function refresh() {
    if (!ui) return;
    const p = pending || saved, off = p.pack === OFF;
    ui.select.value = p.pack;
    ui.banner.checked = p.banner;
    ui.range.value = String(p.volume);
    ui.value.textContent = String(Math.round(p.volume * 100));
    ui.test.disabled = off && !p.banner;
    ui.range.disabled = off;
    ui.files.style.display = p.pack === CUSTOM ? "" : "none";
    ui.choose.style.display = "";
    setNote();
  }
  // With no text, the note names your files. A problem shows in red in a few words, with more in its tooltip.
  function setNote(text, error, title = text) {
    if (!ui) return;
    const list = names(), n = list.length;
    ui.note.textContent = text || (n === 1 ? list[0] : n ? n + " sounds" : "No files yet");
    ui.note.title = text ? title : list.map((name, i) => `Kill ${i + 1}${i === n - 1 && n < MAX_KILL ? "+" : ""}: ${name}`).join("\n");
    ui.note.classList.toggle("ssks-error", !!error);
  }
  // Under the volume, in the row your files use: a Valorant pack that takes a moment says it's downloading, and
  // says so if it couldn't. No text hides the row.
  function showStatus(text, error = false, title = text) {
    if (!ui || (pending || saved).pack === CUSTOM) return;   // the row is your files' then
    ui.files.style.display = text ? "" : "none";
    ui.choose.style.display = "none";
    if (text) setNote(text, error, title);
  }
  // Kill `kill`'s sound and banner, as they'd come in a game.
  function preview(kill) {
    const s = pending || saved, { pack, volume } = s, look = bannerFor(s);
    let lost = false;   // a Valorant pack's sounds or banners couldn't be downloaded
    const sound = pack !== OFF ?
      (pack === CUSTOM && pendingFiles ? Promise.resolve(pendingFiles.decoded) : clips(pack)).then(list => {
        if (list.length) return clipFor(list, kill);
        setNote("Choose files first", true, "Choose 1 to 5 sound files first.");
        return null;
      }, err => {
        warn(err);
        if (pack === CUSTOM) setNote("Can't play your files", true, "Can't play your saved files. Choose them again.");
        else lost = true;
        return null;
      }) : null;
    const banner = look ? art(look).then(list => list[kill - 1], err => { warn(err); lost = true; return null; }) : null;
    const remote = VALORANT.has(pack);
    const slow = remote && setTimeout(() => showStatus("Downloading…"), 150);
    Promise.all([sound, banner]).then(([buf, img]) => {
      clearTimeout(slow);
      if (remote && (pending || saved).pack === pack) {
        const name = PACKS.find(p => p.id === pack).name;
        showStatus(lost ? "Couldn't download " + name : "", true, `Couldn't download ${name} from GitHub. Check your connection, then try again.`);
      }
      const delay = buf ? play(buf, volume) : 0;
      if (img) showBanner(img, delay, fitFor(look, buf, kill));
    });
  }
  // Picked files wait for Confirm like the rest of the settings: until then they're only previewed.
  async function addFiles(picked) {
    const files = picked.filter(f => f.size > 0).sort(byName).slice(0, MAX_FILES);
    if (!files.length) return;
    const gen = ++fileGen, big = files.find(f => f.size > MAX_BYTES);
    if (big) return setNote("Too big: " + big.name, true, `${big.name} is too big. Files can be up to 4 MB.`);
    setNote("Loading…");
    try {
      const list = await Promise.all(files.map(async f => ({ name: f.name, data: await f.arrayBuffer() })));
      const decoded = await decodeAll(list);   // they all have to play before they're kept
      if (gen !== fileGen || !pending) return;   // closed, or other files picked, in the meantime
      pendingFiles = { list, names: list.map(f => f.name), decoded };
      pending.pack = CUSTOM;
      refresh();
      preview(testKill = 1);
    } catch (err) {
      if (gen !== fileGen) return;
      if (err && err.note) return setNote(err.note, true, err.message);
      warn(err);
      setNote("Can't read those files", true, "Can't read those files. Try choosing them again.");
    }
  }
  function keepFiles() {
    if (!pendingFiles) return;
    const { list, decoded } = pendingFiles;
    customNames = pendingFiles.names;
    pendingFiles = null;
    cache.set(CUSTOM, Promise.resolve(decoded));
    writeFiles(list).catch(err => warn("Couldn't keep your files for next time:", err));
  }

  // The game's Confirm, Reset to Defaults and Cancel buttons, under the tabs.
  function onClick(e) {
    if (!ui || !pending) return;
    const b = e.target instanceof Element && e.target.closest("#settings .grid-column-3-eq > button");
    if (!b) return;
    if (b.classList.contains("btn_green")) { keepFiles(); save(pending); }
    else if (b.classList.contains("btn_yolk")) revert({ ...DEFAULTS });
    else if (b.classList.contains("btn_red")) revert({ ...saved });
  }

  function openSettings() {
    const app = window.vueApp;
    if (!running || !app || typeof app.showSettingsPopup !== "function") return false;
    try {
      app.showSettingsPopup();
      const tab = document.getElementById("misc_button");
      if (tab) tab.click();
      else if (typeof app.onSettingsPopupSwitchTabMisc === "function") app.onSettingsPopupSwitchTabMisc();
    } catch (err) { warn(err); return false; }
    tick();
    return true;
  }

  /* ---- On and off ---- */
  let running = false, timer = 0;
  function tick() {
    if (!running) return;
    if (!hooked || hooked.app !== window.vueApp) hook();
    if (!ui || !ui.cell.isConnected) injectUI();
  }
  function start() {
    if (running) return;
    running = true;
    document.addEventListener("click", onClick, true);
    tick();
    timer = setInterval(tick, 1000);
    setTimeout(() => { if (running) getReady(); }, 1500);
    readNames().then(n => { customNames = n; setNote(); }, () => { /* no storage: no files */ });
  }
  function stop() {
    if (!running) return;
    running = false;
    clearInterval(timer);
    document.removeEventListener("click", onClick, true);
    unhook();
    removeUI();
    quiet();
    hideBanner();
  }
  // The saved pack and banner are made, or downloaded, ahead of the first kill.
  function getReady() {
    if (saved.pack !== OFF) clips(saved.pack).catch(warn);
    const look = bannerFor(saved);
    if (look) art(look).catch(warn);
  }

  window.ssKillSounds = {
    version: VERSION,
    packs: [...PACKS.map(p => p.id), CUSTOM, OFF],
    settings: () => ({ ...saved }),
    set(s) { save({ ...saved, ...s }); revert({ ...saved }); return { ...saved }; },
    play: (kill = 1) => onKill(kill),   // as if you'd got kill `kill` in your streak: its sound and banner
    render: (pack, kill) => renderKill(pack, Math.min(MAX_KILL, Math.max(1, kill | 0))),
    status: () => ({ running, hooked: !!hooked, settingsShown: !!ui && ui.cell.isConnected, packsInMemory: [...cache.keys()],
      bannersInMemory: [...arts.keys()] }),
  };

  start();
  // The Mod Menu (if it's installed) lists it with an on/off switch and a shortcut to these settings.
  (window.ssModMenuQueue = window.ssModMenuQueue || []).push({
    id: "valorant-kill-sounds", name: "Valorant Kill Sounds", version: VERSION, group: "mod",
    description: "A Valorant-style sound and banner on each of your kills, a step higher for each kill in your streak.",
    enable: start, disable: stop, openSettings,
  });
})();
