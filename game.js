(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  const TAU = Math.PI * 2;

  const $ = (id) => document.getElementById(id);
  const ui = {
    sap: $("sapValue"),
    heart: $("heartValue"),
    waveLabel: $("waveLabel"),
    wavePips: $("wavePips"),
    waveBtn: $("waveBtn"),
    waveButtonTop: $("waveButtonTop"),
    waveButtonMain: $("waveButtonMain"),
    threatPreview: $("threatPreview"),
    threatText: $("threatText"),
    waveAnnouncement: $("waveAnnouncement"),
    announcementTop: $("announcementTop"),
    announcementMain: $("announcementMain"),
    announcementThreat: $("announcementThreat"),
    pauseBtn: $("pauseBtn"),
    speedBtn: $("speedBtn"),
    speedLabel: $("speedLabel"),
    soundBtn: $("soundBtn"),
    settingsBtn: $("settingsBtn"),
    settingsModal: $("settingsModal"),
    settingsClose: $("settingsClose"),
    musicVolume: $("musicVolume"),
    musicValue: $("musicValue"),
    sfxVolume: $("sfxVolume"),
    sfxValue: $("sfxValue"),
    reducedEffects: $("reducedEffects"),
    audioTestBtn: $("audioTestBtn"),
    fullscreenBtn: $("fullscreenBtn"),
    codexBtn: $("codexBtn"),
    codexModal: $("codexModal"),
    codexClose: $("codexClose"),
    codexArsenal: $("codexArsenal"),
    codexInvaders: $("codexInvaders"),
    helpBtn: $("helpBtn"),
    helpModal: $("helpModal"),
    helpClose: $("helpClose"),
    helpDone: $("helpDone"),
    introModal: $("introModal"),
    startBtn: $("startBtn"),
    endModal: $("endModal"),
    restartBtn: $("restartBtn"),
    toastStack: $("toastStack"),
    selectionPanel: $("selectionPanel"),
    panelClose: $("panelClose"),
    selectedOrb: $("selectedOrb"),
    selectedType: $("selectedType"),
    selectedName: $("selectedName"),
    selectedEvolution: $("selectedEvolution"),
    selectedStats: $("selectedStats"),
    selectedTrait: $("selectedTrait"),
    statDamage: $("statDamage"),
    statRange: $("statRange"),
    statRate: $("statRate"),
    synergyValue: $("synergyValue"),
    synergyFill: $("synergyFill"),
    upgradeBtn: $("upgradeBtn"),
    upgradeCost: $("upgradeCost"),
    sellBtn: $("sellBtn"),
    sellValue: $("sellValue"),
    abilityBtn: $("abilityBtn"),
    abilityStatus: $("abilityStatus"),
    abilityCharge: $("abilityCharge"),
    comboDisplay: $("comboDisplay"),
    comboValue: $("comboValue"),
    comboMeter: $("comboMeter"),
    endEyebrow: $("endEyebrow"),
    endTitle: $("endTitle"),
    endCopy: $("endCopy"),
    endWaves: $("endWaves"),
    endKills: $("endKills"),
    endHarmony: $("endHarmony"),
    endCombo: $("endCombo"),
    endSigil: $("endSigil"),
  };

  const towerCards = [...document.querySelectorAll(".tower-card")];

  const TOWERS = {
    sun: {
      name: "Photon Cell",
      label: "PHOTON BLASTER",
      role: "STRIKER",
      glyph: "☀",
      trait: "Precise rapid-fire photon bolts excel against fast single targets.",
      best: "Speed • finishers • early lanes",
      evolutions: ["Mk I Blaster", "Daybeam", "Starcell", "Solar Crown", "Nova Cannon"],
      color: "#ffd15e",
      cost: 65,
      range: 145,
      damage: 12,
      rate: 2.4,
      projectile: 390,
      description: "Rapid photon",
    },
    dew: {
      name: "Spirit Seal",
      label: "CRYO TRAP",
      role: "CONTROL",
      glyph: "◉",
      trait: "Spirit seals chill clustered ghosts and extend their time in every firing lane.",
      best: "Swarms • chokepoints • support",
      evolutions: ["Seal Mk I", "Frost Sigil", "Ice Chalice", "Absolute Zero", "Void Lock"],
      color: "#5ef0ff",
      cost: 85,
      range: 132,
      damage: 9,
      rate: 1.35,
      projectile: 300,
      slow: 0.56,
      splash: 42,
      description: "Freeze splash",
    },
    thorn: {
      name: "Proton Lance",
      label: "PROTON CANNON",
      role: "ARTILLERY",
      glyph: "✦",
      trait: "Slow, brutal proton lances punish armored specters from exceptional range.",
      best: "Armor • elites • boss damage",
      evolutions: ["Lance Mk I", "Proton Spike", "Siege Cannon", "Void Lance", "Omega Breaker"],
      color: "#ff6b8a",
      cost: 110,
      range: 172,
      damage: 42,
      rate: 0.67,
      projectile: 470,
      description: "Heavy burst",
    },
    prism: {
      name: "Arc Conduit",
      label: "TESLA GRID",
      role: "CHAIN CASTER",
      glyph: "◇",
      trait: "Lightning jumps through nearby bodies, turning dense formations against themselves.",
      best: "Dense waves • mixed packs • chains",
      evolutions: ["Coil Mk I", "Arc Iris", "Spectrum Crown", "Storm Oracle", "Thunder Nexus"],
      color: "#b88cff",
      cost: 135,
      range: 152,
      damage: 20,
      rate: 0.92,
      projectile: 0,
      chain: 3,
      description: "Chain spark",
    },
    ember: {
      name: "Holy Ember",
      label: "PURIFY FLAME",
      role: "BURNER",
      glyph: "▲",
      trait: "Holy fire ignites every target in its splash and keeps dealing true burn damage.",
      best: "Regeneration • groups • damage over time",
      evolutions: ["Ember Mk I", "Cinder Core", "Wildfire Heart", "Phoenix Seal", "Sunforge"],
      color: "#ff8b52",
      cost: 100,
      range: 142,
      damage: 15,
      rate: 1.05,
      projectile: 285,
      splash: 28,
      burn: 6,
      description: "Burning splash",
    },
    gale: {
      name: "Vacuum Pulse",
      label: "EXORCISM FAN",
      role: "DISPLACER",
      glyph: "≋",
      trait: "Compressed vacuum bursts push entire groups backward, reopening exhausted firing lanes.",
      best: "Crowd control • lane resets • combos",
      evolutions: ["Pulse Mk I", "Windwheel", "Tempest Fan", "Cyclone Crown", "Skybreaker"],
      color: "#86f0cf",
      cost: 145,
      range: 158,
      damage: 18,
      rate: 0.78,
      projectile: 350,
      splash: 48,
      knockback: 28,
      description: "Swarm knockback",
    },
  };

  const ENEMIES = {
    mite: {
      name: "Yurei Kid",
      color: "#ffe08a",
      role: "SCOUT",
      glyph: "👻",
      trait: "A hyperactive chibi ghost swarm. Fast, fragile, and annoying in packs.",
      hp: 42,
      speed: 78,
      radius: 10,
      bounty: 7,
      damage: 1,
    },
    wisp: {
      name: "Banshee Idol",
      color: "#8ec8ff",
      role: "DRIFTER",
      glyph: "♪",
      trait: "A melodic phantom idol drifting through the ward. Balanced stats, no weak point.",
      hp: 82,
      speed: 57,
      radius: 12,
      bounty: 10,
      damage: 1,
    },
    brute: {
      name: "Crimson Ronin",
      color: "#ff5a6e",
      role: "ARMORED",
      glyph: "刀",
      trait: "A cursed samurai in lacquered armor. Heavy plating shrugs off direct hits.",
      hp: 225,
      speed: 35,
      radius: 17,
      bounty: 19,
      damage: 3,
      armor: 0.22,
    },
    spore: {
      name: "Miko Wraith",
      color: "#f2a8ff",
      role: "REGENERATOR",
      glyph: "札",
      trait: "A shrine maiden spirit weaving healing talismans. Burn shuts her down.",
      hp: 120,
      speed: 49,
      radius: 14,
      bounty: 15,
      damage: 2,
      regen: 2.2,
    },
    sovereign: {
      name: "Void Emperor",
      color: "#d66bff",
      role: "BOSS",
      glyph: "皇",
      trait: "An anime dark lord in a flowing coat. Armored, arrogant, and lethal to the reactor.",
      hp: 1250,
      speed: 26,
      radius: 26,
      bounty: 120,
      damage: 8,
      armor: 0.16,
    },
    shade: {
      name: "Shadow Shinobi",
      color: "#6f8cff",
      role: "ASSASSIN",
      glyph: "忍",
      trait: "A scarf-wrapped ninja blur. Extremely fast — slow traps are mandatory.",
      hp: 190,
      speed: 82,
      radius: 13,
      bounty: 23,
      damage: 2,
      armor: 0.1,
    },
    colossus: {
      name: "Oni Shogun",
      color: "#ff4f9a",
      role: "FINAL BOSS",
      glyph: "鬼",
      trait: "A towering oni warlord with regen and armor. The ultimate anime raid boss.",
      hp: 2850,
      speed: 19,
      radius: 32,
      bounty: 240,
      damage: 12,
      armor: 0.25,
      regen: 3,
    },
  };

  const WAVE_TEMPLATES = [
    { mite: 8 },
    { mite: 10, wisp: 3 },
    { mite: 8, wisp: 7 },
    { mite: 10, brute: 3 },
    { wisp: 9, spore: 4 },
    { mite: 12, brute: 5, wisp: 4 },
    { spore: 7, brute: 5, mite: 8 },
    { wisp: 14, brute: 7, spore: 4 },
    { mite: 18, spore: 8, brute: 7 },
    { wisp: 10, brute: 6, spore: 6, sovereign: 1 },
    { shade: 10, mite: 14, brute: 4 },
    { shade: 12, wisp: 10, spore: 6 },
    { shade: 14, brute: 9, mite: 12 },
    { shade: 18, spore: 10, brute: 8, sovereign: 1 },
    { shade: 16, brute: 10, spore: 8, colossus: 1 },
  ];

  const WAVE_PIP_COUNT = 10;

  function generateWave(index) {
    if (index < WAVE_TEMPLATES.length) return { ...WAVE_TEMPLATES[index] };

    const tier = index + 1;
    const depth = index - WAVE_TEMPLATES.length + 1;
    const composition = {
      mite: Math.min(28, Math.floor(8 + tier * 0.55 + depth * 0.15)),
      wisp: Math.min(20, Math.floor(tier * 0.35 + depth * 0.08)),
    };

    if (tier >= 4) composition.spore = Math.min(14, Math.floor(tier * 0.2 + depth * 0.05));
    if (tier >= 5) composition.brute = Math.min(12, Math.floor(tier * 0.18 + depth * 0.06));
    if (tier >= 11) composition.shade = Math.min(18, Math.floor((tier - 10) * 0.4 + depth * 0.1));

    if (tier % 25 === 0) {
      composition.colossus = 1;
      composition.mite = Math.floor(composition.mite * 0.6);
    } else if (tier % 10 === 0) {
      composition.sovereign = 1;
      composition.mite = Math.floor(composition.mite * 0.75);
    }

    let total = Object.values(composition).reduce((sum, count) => sum + count, 0);
    if (total > 50) {
      const scale = 50 / total;
      Object.keys(composition).forEach((key) => {
        if (key !== "sovereign" && key !== "colossus") {
          composition[key] = Math.max(key === "mite" ? 4 : 1, Math.floor(composition[key] * scale));
        }
      });
    }

    return composition;
  }

  function waveMeta(composition) {
    return {
      colossus: Boolean(composition.colossus),
      sovereign: Boolean(composition.sovereign),
      total: Object.values(composition).reduce((sum, count) => sum + count, 0),
    };
  }

  const ENEMY_PLURALS = {
    mite: "YUREI KIDS",
    wisp: "BANSHEE IDOLS",
    brute: "CRIMSON RONIN",
    spore: "MIKO WRAITHS",
    sovereign: "VOID EMPEROR",
    shade: "SHADOW SHINOBI",
    colossus: "ONI SHOGUN",
  };

  const path = [
    { x: -45, y: 334 },
    { x: 108, y: 334 },
    { x: 184, y: 238 },
    { x: 298, y: 238 },
    { x: 374, y: 363 },
    { x: 494, y: 363 },
    { x: 570, y: 242 },
    { x: 680, y: 242 },
    { x: 764, y: 340 },
    { x: 858, y: 340 },
    { x: 926, y: 260 },
    { x: 1032, y: 300 },
    { x: 1140, y: 300 },
  ];

  const nodes = [
    { x: 52, y: 280 },
    { x: 68, y: 210 },
    { x: 90, y: 458 },
    { x: 140, y: 300 },
    { x: 155, y: 165 },
    { x: 224, y: 116 },
    { x: 245, y: 420 },
    { x: 290, y: 320 },
    { x: 360, y: 145 },
    { x: 407, y: 492 },
    { x: 430, y: 280 },
    { x: 448, y: 430 },
    { x: 500, y: 174 },
    { x: 535, y: 320 },
    { x: 560, y: 456 },
    { x: 620, y: 175 },
    { x: 649, y: 110 },
    { x: 678, y: 398 },
    { x: 720, y: 310 },
    { x: 778, y: 166 },
    { x: 800, y: 120 },
    { x: 814, y: 475 },
    { x: 870, y: 400 },
    { x: 899, y: 140 },
    { x: 934, y: 440 },
    { x: 980, y: 220 },
    { x: 1022, y: 178 },
    { x: 1050, y: 380 },
  ];

  const backdropSeeds = Array.from({ length: 85 }, (_, i) => ({
    x: ((i * 137.508 + 31) % W) | 0,
    y: ((i * 73.13 + 19) % H) | 0,
    size: 0.4 + ((i * 17) % 13) / 10,
    alpha: 0.06 + ((i * 7) % 11) / 100,
  }));

  const mossPatches = Array.from({ length: 31 }, (_, i) => ({
    x: (i * 181.3 + 57) % W,
    y: (i * 113.7 + 83) % H,
    r: 9 + ((i * 19) % 26),
    hue: i % 3,
  }));

  const worldBlooms = Array.from({ length: 26 }, (_, i) => ({
    x: 28 + ((i * 193.7 + 71) % (W - 56)),
    y: 34 + ((i * 127.3 + 43) % (H - 68)),
    size: 0.75 + ((i * 11) % 9) / 10,
    phase: i * 1.37,
    color: ["#5ef0ff", "#ff5ec8", "#b88cff", "#ffd15e"][i % 4],
  }));

  const livingPools = [
    { x: 310, y: 82, rx: 76, ry: 28, color: "#5ef0ff" },
    { x: 486, y: 540, rx: 92, ry: 31, color: "#ff5ec8" },
    { x: 830, y: 78, rx: 68, ry: 24, color: "#b88cff" },
    { x: 1000, y: 540, rx: 74, ry: 26, color: "#7b6dff" },
  ];

  const segments = [];
  let pathLength = 0;
  for (let i = 1; i < path.length; i += 1) {
    const a = path[i - 1];
    const b = path[i];
    const length = Math.hypot(b.x - a.x, b.y - a.y);
    segments.push({ a, b, length, start: pathLength });
    pathLength += length;
  }

  let enemyId = 0;
  let towerId = 0;
  let lastTime = performance.now();
  let audio = null;
  let masterBus = null;
  let musicBus = null;
  let sfxBus = null;
  let musicTimer = null;
  let musicStep = 0;
  let soundOn = true;
  let compactRender = false;
  const AUDIO_SETTINGS_VERSION = 2;
  const savedSettings = (() => {
    try {
      return JSON.parse(localStorage.getItem("specter-squad-settings") || localStorage.getItem("rootbound-settings") || "{}");
    } catch {
      return {};
    }
  })();
  const savedAudioIsCurrent = savedSettings.audioVersion === AUDIO_SETTINGS_VERSION;
  const settings = {
    audioVersion: AUDIO_SETTINGS_VERSION,
    music: savedAudioIsCurrent && Number.isFinite(savedSettings.music) ? savedSettings.music : 58,
    sfx: savedAudioIsCurrent && Number.isFinite(savedSettings.sfx) ? savedSettings.sfx : 78,
    reducedEffects: Boolean(savedSettings.reducedEffects),
  };

  const savedBestWave = (() => {
    try {
      const value = Number(localStorage.getItem("specter-squad-best-wave"));
      return Number.isFinite(value) && value >= 0 ? value : 0;
    } catch {
      return 0;
    }
  })();

  const state = {
    started: false,
    paused: false,
    speed: 1,
    sap: 280,
    hearts: 20,
    wave: 0,
    wavesCleared: 0,
    bestWave: savedBestWave,
    currentComposition: null,
    waveActive: false,
    spawnQueue: [],
    spawnTimer: 0,
    enemies: [],
    towers: [],
    projectiles: [],
    particles: [],
    beams: [],
    floatingText: [],
    selectedType: null,
    selectedTower: null,
    hoverNode: null,
    mouse: { x: -100, y: -100 },
    ability: 100,
    overgrow: 0,
    kills: 0,
    peakHarmony: 0,
    combo: 0,
    comboTimer: 0,
    bestCombo: 0,
    screenShake: 0,
    warden: { x: 1005, y: 230, angle: 0, cooldown: 0.8, pulse: 0 },
    ended: false,
    elapsed: 0,
  };

  function pointAtDistance(distance) {
    const d = Math.max(0, Math.min(distance, pathLength));
    let segment = segments[segments.length - 1];
    for (const candidate of segments) {
      if (d <= candidate.start + candidate.length) {
        segment = candidate;
        break;
      }
    }
    const t = Math.max(0, Math.min(1, (d - segment.start) / segment.length));
    return {
      x: segment.a.x + (segment.b.x - segment.a.x) * t,
      y: segment.a.y + (segment.b.y - segment.a.y) * t,
      angle: Math.atan2(segment.b.y - segment.a.y, segment.b.x - segment.a.x),
    };
  }

  function roundedPath(points) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 1; i += 1) {
      const current = points[i];
      const next = points[i + 1];
      ctx.quadraticCurveTo(current.x, current.y, (current.x + next.x) / 2, (current.y + next.y) / 2);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function createAudio() {
    if (!audio) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audio = new AudioContext();
        masterBus = audio.createGain();
        musicBus = audio.createGain();
        sfxBus = audio.createGain();
        const compressor = audio.createDynamicsCompressor();
        compressor.threshold.value = -18;
        compressor.knee.value = 16;
        compressor.ratio.value = 5;
        compressor.attack.value = 0.01;
        compressor.release.value = 0.25;
        musicBus.connect(masterBus);
        sfxBus.connect(masterBus);
        masterBus.connect(compressor);
        compressor.connect(audio.destination);
        applyAudioSettings();
      }
    }
    if (audio?.state === "suspended") audio.resume().catch(() => {});
  }

  function tone(frequency, duration = 0.08, type = "sine", volume = 0.025, slide = 0) {
    if (!soundOn || (!state.started && !ui.settingsModal.classList.contains("visible"))) return;
    createAudio();
    if (!audio) return;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audio.currentTime);
    if (slide) oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, frequency + slide), audio.currentTime + duration);
    const audibleVolume = Math.min(0.24, volume * 3.2);
    gain.gain.setValueAtTime(audibleVolume, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(sfxBus);
    oscillator.start();
    oscillator.stop(audio.currentTime + duration);
  }

  function chord(frequencies) {
    frequencies.forEach((frequency, index) => {
      window.setTimeout(() => tone(frequency, 0.26, "sine", 0.018, frequency * 0.08), index * 45);
    });
  }

  function noiseBurst(duration = 0.08, volume = 0.018, frequency = 900) {
    if (!soundOn || !state.started) return;
    createAudio();
    if (!audio) return;
    const frameCount = Math.max(1, Math.floor(audio.sampleRate * duration));
    const buffer = audio.createBuffer(1, frameCount, audio.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i += 1) data[i] = Math.random() * 2 - 1;
    const source = audio.createBufferSource();
    const filter = audio.createBiquadFilter();
    const gain = audio.createGain();
    source.buffer = buffer;
    filter.type = "bandpass";
    filter.frequency.value = frequency;
    filter.Q.value = 0.8;
    gain.gain.setValueAtTime(Math.min(0.2, volume * 2.5), audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(sfxBus);
    source.start();
  }

  function applyAudioSettings() {
    if (!audio) return;
    const now = audio.currentTime;
    masterBus.gain.setTargetAtTime(soundOn ? 1 : 0.0001, now, 0.03);
    musicBus.gain.setTargetAtTime(settings.music / 100, now, 0.05);
    sfxBus.gain.setTargetAtTime(settings.sfx / 100, now, 0.03);
  }

  function saveSettings() {
    try {
      localStorage.setItem("specter-squad-settings", JSON.stringify(settings));
    } catch {
      // Storage can be unavailable in private browsing; gameplay still works.
    }
  }

  function musicNote(frequency, duration, volume, type = "sine", delay = 0) {
    if (!audio || !soundOn || settings.music <= 0 || !state.started || state.paused || state.ended) return;
    const when = audio.currentTime + delay;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    const filter = audio.createBiquadFilter();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, when);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(state.waveActive ? 2200 : 1450, when);
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(volume, when + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(musicBus);
    oscillator.start(when);
    oscillator.stop(when + duration + 0.05);
  }

  function musicPulse() {
    if (!audio || !state.started || state.paused || state.ended || !soundOn || settings.music <= 0) return;
    const roots = [196, 220, 174.61, 261.63];
    const melodies = [392, 440, 523.25, 659.25, 587.33, 523.25, 698.46, 493.88];
    const root = roots[Math.floor(musicStep / 8) % roots.length];
    if (musicStep % 8 === 0) {
      musicNote(root, 5.3, 0.07, "sine");
      musicNote(root * 1.2, 4.8, 0.048, "sine", 0.05);
      musicNote(root * 1.5, 4.6, 0.035, "triangle", 0.1);
    }
    if (musicStep % 2 === 0) {
      const note = melodies[(musicStep / 2 + state.wave * 2) % melodies.length];
      musicNote(note, state.waveActive ? 0.62 : 1.25, state.waveActive ? 0.07 : 0.045, "triangle");
    }
    if (state.waveActive) {
      musicNote(root, 0.38, 0.075, "sine");
      musicNote(root * 1.5, 0.24, 0.035, "triangle", 0.08);
      if (musicStep % 4 === 2) musicNote(root * 2, 0.2, 0.04, "square");
    }
    musicStep += 1;
  }

  function startMusic() {
    createAudio();
    if (musicTimer) return;
    musicPulse();
    musicTimer = window.setInterval(musicPulse, 680);
  }

  function vibrate(pattern) {
    if ("vibrate" in navigator) navigator.vibrate(pattern);
  }

  function toast(message) {
    const item = document.createElement("div");
    item.className = "toast";
    item.textContent = message;
    ui.toastStack.append(item);
    window.setTimeout(() => item.remove(), 2600);
  }

  function saveBestWave(wave) {
    try {
      localStorage.setItem("specter-squad-best-wave", String(wave));
    } catch {
      // Storage can be unavailable in private browsing.
    }
  }

  function createPips() {
    ui.wavePips.innerHTML = "";
    for (let i = 0; i < WAVE_PIP_COUNT; i += 1) {
      const pip = document.createElement("i");
      if (i === WAVE_PIP_COUNT - 1) pip.classList.add("boss-pip");
      ui.wavePips.append(pip);
    }
  }

  function renderCodex() {
    ui.codexArsenal.innerHTML = Object.entries(TOWERS)
      .map(([type, tower]) => {
        const special = tower.slow
          ? `${Math.round((1 - tower.slow) * 100)}% SLOW`
          : tower.chain
            ? `${tower.chain} TARGET CHAIN`
            : tower.burn
              ? `${tower.burn}/S BURN`
              : tower.knockback
                ? `${tower.knockback} KNOCKBACK`
                : "DIRECT DAMAGE";
        return `
          <article class="codex-entry" style="--entry-color:${tower.color}" data-codex-tower="${type}">
            <div class="codex-sigil" aria-hidden="true">${tower.glyph}</div>
            <div class="codex-copy">
              <div class="codex-heading"><strong>${tower.name}</strong><span>${tower.role}</span></div>
              <p>${tower.trait}</p>
              <div class="codex-stats">
                <span>${tower.cost} ECTO</span><span>${tower.damage} DMG</span><span>${tower.range} RNG</span>
                <span>${tower.rate}/S</span><span>${special}</span>
              </div>
              <div class="codex-evolutions">I–V: ${tower.evolutions.join(" → ")}</div>
            </div>
          </article>`;
      })
      .join("");

    ui.codexInvaders.innerHTML = Object.values(ENEMIES)
      .map((enemy) => {
        const defenses = [
          enemy.armor ? `${Math.round(enemy.armor * 100)}% ARMOR` : null,
          enemy.regen ? `${enemy.regen}/S REGEN` : null,
        ]
          .filter(Boolean)
          .join(" • ");
        return `
          <article class="codex-entry" style="--entry-color:${enemy.color}">
            <div class="codex-sigil" aria-hidden="true">${enemy.glyph}</div>
            <div class="codex-copy">
              <div class="codex-heading"><strong>${enemy.name}</strong><span>${enemy.role}</span></div>
              <p>${enemy.trait}</p>
              <div class="codex-stats">
                <span>${enemy.hp} BASE HP</span><span>${enemy.speed} SPEED</span>
                <span>${enemy.damage} REACTOR DMG</span><span>${enemy.bounty} ECTO</span>
                ${defenses ? `<span>${defenses}</span>` : ""}
              </div>
            </div>
          </article>`;
      })
      .join("");
  }

  function buildWave(composition) {
    const queue = [];
    Object.entries(composition).forEach(([type, count]) => {
      for (let i = 0; i < count; i += 1) queue.push(type);
    });
    queue.sort((a, b) => {
      const order = { mite: 0, wisp: 1, shade: 2, spore: 3, brute: 4, sovereign: 5, colossus: 6 };
      const hashA = (queue.indexOf(a) * 7 + order[a] * 11) % 17;
      const hashB = (queue.indexOf(b) * 7 + order[b] * 11) % 17;
      return hashA - hashB;
    });
    return queue;
  }

  function startWave() {
    if (!state.started || state.waveActive || state.ended) return;
    state.waveActive = true;
    state.currentComposition = generateWave(state.wave);
    state.spawnQueue = buildWave(state.currentComposition);
    state.spawnTimer = 0;
    state.selectedType = null;
    updateCards();
    updateUI();
    announceWave();
    const meta = waveMeta(state.currentComposition);
    const bossName = meta.colossus ? "ONI SHOGUN" : meta.sovereign ? "VOID EMPEROR" : null;
    toast(bossName ? `⚠ ${bossName} APPROACHES` : `WAVE ${state.wave + 1} • SQUAD, DEPLOY`);
    tone(196, 0.22, "triangle", 0.035, 96);
  }

  function waveThreatCount(index) {
    return waveMeta(generateWave(index)).total;
  }

  function threatSummary(index) {
    return Object.entries(generateWave(index))
      .map(([type, count]) => `${count} ${ENEMY_PLURALS[type]}`)
      .join("  •  ");
  }

  function announceWave() {
    const composition = state.currentComposition || generateWave(state.wave);
    const meta = waveMeta(composition);
    ui.announcementTop.textContent = meta.colossus
      ? "ONI SIGNAL DETECTED"
      : meta.sovereign
        ? "VOID EMPEROR INBOUND"
        : "SQUAD, DEPLOY";
    ui.announcementMain.textContent = meta.colossus ? `WAVE ${state.wave + 1} • ONI HUNT` : `WAVE ${state.wave + 1}`;
    ui.announcementThreat.textContent = `${meta.total} HOSTILES DETECTED`;
    ui.waveAnnouncement.classList.add("visible");
    window.setTimeout(() => ui.waveAnnouncement.classList.remove("visible"), meta.colossus ? 2400 : 1700);
  }

  function spawnEnemy(type) {
    const base = ENEMIES[type];
    const scale = 1 + state.wave * 0.115;
    const enemy = {
      id: ++enemyId,
      type,
      distance: 0,
      x: path[0].x,
      y: path[0].y,
      angle: 0,
      hp: base.hp * scale,
      maxHp: base.hp * scale,
      speed: base.speed * (1 + state.wave * 0.012),
      radius: base.radius,
      bounty: Math.round(base.bounty * (1 + state.wave * 0.025)),
      damage: base.damage,
      armor: base.armor || 0,
      regen: base.regen || 0,
      slow: 1,
      slowTimer: 0,
      burnTimer: 0,
      burnDamage: 0,
      burnTick: 0,
      hitFlash: 0,
      alive: true,
      phase: Math.random() * TAU,
    };
    state.enemies.push(enemy);
  }

  function createTower(node, type) {
    const data = TOWERS[type];
    const tower = {
      id: ++towerId,
      node,
      x: node.x,
      y: node.y,
      type,
      level: 1,
      cooldown: Math.random() * 0.25,
      angle: -Math.PI / 2,
      synergy: 0,
      links: [],
      invested: data.cost,
      pulse: 0,
      recoil: 0,
      muzzle: 0,
      animOffset: Math.random() * TAU,
    };
    state.towers.push(tower);
    node.tower = tower;
    state.sap -= data.cost;
    recalculateLinks();
    burst(node.x, node.y, data.color, 18, 95);
    floating(node.x, node.y - 28, data.name.toUpperCase(), data.color);
    vibrate(18);
    const plantingTone = { sun: 520, dew: 430, thorn: 260, prism: 610, ember: 190, gale: 350 };
    tone(plantingTone[type], 0.18, "sine", 0.035, 120);
    state.selectedTower = tower;
    state.selectedType = null;
    updateCards();
    updateSelectionPanel();
    updateUI();
  }

  function recalculateLinks() {
    let totalHarmony = 0;
    state.towers.forEach((tower) => {
      tower.links = state.towers.filter((other) => other !== tower && distance(tower, other) <= 190);
      const distinct = new Set(tower.links.filter((other) => other.type !== tower.type).map((other) => other.type));
      tower.synergy = distinct.size;
      totalHarmony += distinct.size;
    });
    state.peakHarmony = Math.max(state.peakHarmony, totalHarmony);
  }

  function towerStats(tower) {
    const base = TOWERS[tower.type];
    const levelScale = 1 + (tower.level - 1) * 0.35;
    return {
      range: base.range + (tower.level - 1) * 7,
      damage: base.damage * levelScale,
      rate: base.rate * (1 + tower.synergy * 0.12) * (state.overgrow > 0 ? 1.75 : 1),
      splash: base.splash || 0,
      slow: base.slow || 0,
      projectile: base.projectile,
      chain: base.chain || 0,
      burn: (base.burn || 0) * levelScale,
      knockback: (base.knockback || 0) + (tower.level - 1) * 2,
    };
  }

  function findTarget(tower, range) {
    let target = null;
    let furthest = -1;
    for (const enemy of state.enemies) {
      if (!enemy.alive || distance(tower, enemy) > range) continue;
      if (enemy.distance > furthest) {
        furthest = enemy.distance;
        target = enemy;
      }
    }
    return target;
  }

  function fireTower(tower, target, stats) {
    tower.angle = Math.atan2(target.y - tower.y, target.x - tower.x);
    tower.pulse = 1;
    tower.recoil = 1;
    tower.muzzle = 1;
    if (tower.type === "prism") {
      chainLightning(tower, target, stats);
      burst(
        tower.x + Math.cos(tower.angle) * 24,
        tower.y + Math.sin(tower.angle) * 24,
        TOWERS.prism.color,
        8,
        58,
      );
      tone(620 + tower.level * 50, 0.055, "square", 0.008, -140);
      return;
    }
    const muzzleDistance = tower.type === "thorn" ? 25 : tower.type === "dew" ? 23 : 26;
    state.projectiles.push({
      x: tower.x + Math.cos(tower.angle) * muzzleDistance,
      y: tower.y + Math.sin(tower.angle) * muzzleDistance,
      targetId: target.id,
      targetX: target.x,
      targetY: target.y,
      type: tower.type,
      color: TOWERS[tower.type].color,
      speed: stats.projectile,
      damage: stats.damage,
      splash: stats.splash,
      slow: stats.slow,
      burn: stats.burn,
      knockback: stats.knockback,
      radius: tower.type === "gale" ? 7 : tower.type === "thorn" || tower.type === "ember" ? 5 : 3.2,
      rotation: tower.angle,
      age: 0,
      trail: [],
      phase: Math.random() * TAU,
      alive: true,
    });
    burst(
      tower.x + Math.cos(tower.angle) * muzzleDistance,
      tower.y + Math.sin(tower.angle) * muzzleDistance,
      TOWERS[tower.type].color,
      tower.type === "thorn" ? 7 : 5,
      tower.type === "thorn" ? 85 : 48,
    );
    if (tower.type === "thorn") {
      tone(175, 0.06, "sawtooth", 0.011, -35);
    } else if (tower.type === "dew") {
      tone(390, 0.07, "sine", 0.009, -80);
    } else if (tower.type === "ember") {
      tone(145, 0.12, "sawtooth", 0.014, 120);
      noiseBurst(0.07, 0.01, 1100);
    } else if (tower.type === "gale") {
      tone(260, 0.16, "sine", 0.012, -150);
      noiseBurst(0.1, 0.009, 760);
    } else {
      tone(560, 0.045, "triangle", 0.008, 40);
    }
  }

  function chainLightning(tower, first, stats) {
    const hit = [first];
    let current = first;
    for (let i = 1; i < stats.chain; i += 1) {
      let next = null;
      let nearest = 95;
      state.enemies.forEach((enemy) => {
        if (!enemy.alive || hit.includes(enemy)) return;
        const d = distance(current, enemy);
        if (d < nearest) {
          nearest = d;
          next = enemy;
        }
      });
      if (!next) break;
      hit.push(next);
      current = next;
    }
    let from = tower;
    hit.forEach((enemy, index) => {
      const damage = stats.damage * Math.pow(0.72, index);
      state.beams.push({
        x1: from.x,
        y1: from.y,
        x2: enemy.x,
        y2: enemy.y,
        life: 0.22,
        maxLife: 0.22,
        color: TOWERS.prism.color,
        seed: tower.id * 17.3 + index * 11.7 + state.elapsed,
      });
      damageEnemy(enemy, damage, TOWERS.prism.color);
      from = enemy;
    });
  }

  function damageEnemy(enemy, amount, color, ignoreArmor = false) {
    if (!enemy || !enemy.alive) return;
    const actual = amount * (ignoreArmor ? 1 : 1 - enemy.armor);
    enemy.hp -= actual;
    enemy.hitFlash = 0.1;
    if (Math.random() < 0.35) {
      particle(enemy.x + random(-5, 5), enemy.y + random(-5, 5), color, random(-22, 22), random(-32, 4), 0.35, random(1, 2.8));
    }
    if (enemy.hp <= 0) killEnemy(enemy);
  }

  function killEnemy(enemy) {
    if (!enemy.alive) return;
    enemy.alive = false;
    state.kills += 1;
    state.combo = state.comboTimer > 0 ? state.combo + 1 : 1;
    state.comboTimer = 1.45;
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    state.sap += enemy.bounty;
    if (state.combo > 1 && state.combo % 5 === 0) {
      const chainBonus = Math.min(15, state.combo);
      state.sap += chainBonus;
      floating(enemy.x, enemy.y - 32, `EXORCISM ${state.combo}×  +${chainBonus}`, "#5ef0ff");
      tone(440 + state.combo * 8, 0.12, "triangle", 0.025, 120);
    }
    const isBoss = enemy.type === "sovereign" || enemy.type === "colossus";
    state.ability = Math.min(100, state.ability + (isBoss ? 25 : 4.2));
    burst(enemy.x, enemy.y, ENEMIES[enemy.type].color, isBoss ? 42 : 10, isBoss ? 170 : 65);
    floating(enemy.x, enemy.y - 15, `+${enemy.bounty}`, "#5ef0ff");
    tone(isBoss ? 110 : 290, isBoss ? 0.4 : 0.04, "sine", 0.012, -40);
    if (isBoss) {
      state.screenShake = settings.reducedEffects ? 0 : 0.8;
      vibrate([35, 30, 70]);
      chord([220, 277, 330, 440]);
    }
  }

  function updateWarden(dt) {
    const warden = state.warden;
    const orbit = state.elapsed * 0.75;
    const targetX = 1015 + Math.cos(orbit) * 58;
    const targetY = 226 + Math.sin(orbit * 1.3) * 32;
    warden.x += (targetX - warden.x) * Math.min(1, dt * 3.5);
    warden.y += (targetY - warden.y) * Math.min(1, dt * 3.5);
    warden.cooldown -= dt;
    warden.pulse = Math.max(0, warden.pulse - dt * 3);
    const target = state.enemies
      .filter((enemy) => enemy.alive && distance(warden, enemy) < 330)
      .sort((a, b) => b.distance - a.distance)[0];
    if (target) warden.angle = Math.atan2(target.y - warden.y, target.x - warden.x);
    if (!target || warden.cooldown > 0) return;
    state.projectiles.push({
      x: warden.x + Math.cos(warden.angle) * 18,
      y: warden.y + Math.sin(warden.angle) * 18,
      targetId: target.id,
      targetX: target.x,
      targetY: target.y,
      type: "wyrm",
      color: "#b9ff78",
      speed: 360,
      damage: 18 + state.wave * 2.5,
      splash: 24,
      slow: 0,
      radius: 5,
      rotation: warden.angle,
      age: 0,
      trail: [],
      phase: Math.random() * TAU,
      alive: true,
    });
    warden.cooldown = state.overgrow > 0 ? 0.7 : 1.55;
    warden.pulse = 1;
    burst(warden.x + Math.cos(warden.angle) * 15, warden.y + Math.sin(warden.angle) * 15, "#b9ff78", 5, 40);
    tone(205, 0.11, "sawtooth", 0.014, 160);
  }

  function projectileImpact(projectile, enemy) {
    const applyEffects = (candidate) => {
      if (projectile.slow) {
        candidate.slow = projectile.slow;
        candidate.slowTimer = 1.8;
      }
      if (projectile.burn) {
        candidate.burnDamage = Math.max(candidate.burnDamage, projectile.burn);
        candidate.burnTimer = Math.max(candidate.burnTimer, 3.2);
        candidate.burnTick = Math.min(candidate.burnTick, 0.15);
      }
      if (projectile.knockback) {
        const bossResistance = candidate.type === "sovereign" || candidate.type === "colossus" ? 0.25 : 1;
        candidate.distance = Math.max(0, candidate.distance - projectile.knockback * bossResistance * (1 - candidate.armor));
      }
    };
    if (projectile.splash) {
      state.enemies.forEach((candidate) => {
        if (!candidate.alive || distance(projectile, candidate) > projectile.splash) return;
        damageEnemy(candidate, projectile.damage, projectile.color);
        applyEffects(candidate);
      });
      ring(projectile.x, projectile.y, projectile.color, projectile.splash);
    } else {
      damageEnemy(enemy, projectile.damage, projectile.color);
      applyEffects(enemy);
    }
    burst(projectile.x, projectile.y, projectile.color, projectile.type === "thorn" ? 8 : 4, 55);
    if (projectile.type === "sun") ring(projectile.x, projectile.y, "#fff1a8", 20);
    if (projectile.type === "thorn") {
      ring(projectile.x, projectile.y, "#ef738f", 31);
      state.screenShake = settings.reducedEffects ? 0 : Math.max(state.screenShake, 0.12);
    }
    if (projectile.type === "wyrm") ring(projectile.x, projectile.y, "#b9ff78", 36);
    if (projectile.type === "ember") {
      ring(projectile.x, projectile.y, "#ff8b52", 42);
      noiseBurst(0.13, 0.016, 980);
    }
    if (projectile.type === "gale") {
      ring(projectile.x, projectile.y, "#86f0cf", 58);
      noiseBurst(0.16, 0.012, 520);
    }
    if (projectile.type === "thorn") noiseBurst(0.07, 0.018, 620);
    if (projectile.type === "wyrm") {
      noiseBurst(0.11, 0.012, 1250);
      tone(310, 0.08, "triangle", 0.01, -90);
    }
    projectile.alive = false;
  }

  function update(dt) {
    if (!state.started || state.paused || state.ended) return;
    state.elapsed += dt;
    if (state.screenShake > 0) state.screenShake = Math.max(0, state.screenShake - dt * 2.2);
    if (state.overgrow > 0) state.overgrow = Math.max(0, state.overgrow - dt);
    if (state.comboTimer > 0) {
      state.comboTimer = Math.max(0, state.comboTimer - dt);
      if (state.comboTimer === 0) state.combo = 0;
    }

    if (state.waveActive && state.spawnQueue.length) {
      state.spawnTimer -= dt;
      if (state.spawnTimer <= 0) {
        spawnEnemy(state.spawnQueue.shift());
        const composition = state.currentComposition || generateWave(state.wave);
        const meta = waveMeta(composition);
        state.spawnTimer = meta.colossus ? 0.82 : meta.sovereign ? 0.68 : Math.max(0.22, 0.85 - state.wave * 0.028);
      }
    }

    state.enemies.forEach((enemy) => {
      if (!enemy.alive) return;
      if (enemy.slowTimer > 0) {
        enemy.slowTimer -= dt;
      } else {
        enemy.slow = 1;
      }
      if (enemy.burnTimer > 0) {
        enemy.burnTimer -= dt;
        enemy.burnTick -= dt;
        if (enemy.burnTick <= 0) {
          damageEnemy(enemy, enemy.burnDamage * 0.5, "#ff8b52", true);
          enemy.burnTick = 0.5;
          if (enemy.alive) particle(enemy.x + random(-4, 4), enemy.y - enemy.radius, "#ffb05f", random(-8, 8), -20, 0.35, 2.2);
        }
        if (!enemy.alive) return;
      }
      if (enemy.regen) enemy.hp = Math.min(enemy.maxHp, enemy.hp + enemy.regen * dt);
      enemy.hitFlash = Math.max(0, enemy.hitFlash - dt);
      enemy.distance += enemy.speed * enemy.slow * dt;
      const point = pointAtDistance(enemy.distance);
      enemy.x = point.x;
      enemy.y = point.y + Math.sin(state.elapsed * 4 + enemy.phase) * 1.5;
      enemy.angle = point.angle;
      if (enemy.distance >= pathLength - 35) reachHeart(enemy);
    });

    state.towers.forEach((tower) => {
      tower.cooldown -= dt;
      tower.pulse = Math.max(0, tower.pulse - dt * 4);
      tower.recoil = Math.max(0, tower.recoil - dt * 7.5);
      tower.muzzle = Math.max(0, tower.muzzle - dt * 10);
      const stats = towerStats(tower);
      const trackingTarget = findTarget(tower, stats.range);
      if (trackingTarget) {
        const desiredAngle = Math.atan2(trackingTarget.y - tower.y, trackingTarget.x - tower.x);
        const angleDelta = Math.atan2(Math.sin(desiredAngle - tower.angle), Math.cos(desiredAngle - tower.angle));
        tower.angle += angleDelta * Math.min(1, dt * (tower.type === "thorn" ? 4.5 : 7.5));
      }
      if (tower.cooldown <= 0) {
        const target = trackingTarget;
        if (target) {
          fireTower(tower, target, stats);
          tower.cooldown = 1 / stats.rate;
        }
      }
    });

    updateWarden(dt);

    state.projectiles.forEach((projectile) => {
      if (!projectile.alive) return;
      projectile.age += dt;
      projectile.trail.unshift({ x: projectile.x, y: projectile.y });
      projectile.trail.length = Math.min(projectile.trail.length, settings.reducedEffects ? 4 : 11);
      const target = state.enemies.find((enemy) => enemy.id === projectile.targetId && enemy.alive);
      if (target) {
        projectile.targetX = target.x;
        projectile.targetY = target.y;
      }
      const dx = projectile.targetX - projectile.x;
      const dy = projectile.targetY - projectile.y;
      const d = Math.hypot(dx, dy);
      if (d < projectile.speed * dt + 7) {
        if (target) projectileImpact(projectile, target);
        else projectile.alive = false;
      } else {
        projectile.rotation = Math.atan2(dy, dx);
        projectile.x += (dx / d) * projectile.speed * dt;
        projectile.y += (dy / d) * projectile.speed * dt;
        if (Math.random() < 0.35) particle(projectile.x, projectile.y, projectile.color, 0, 0, 0.18, 1.5);
      }
    });

    state.particles.forEach((p) => {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.98;
      p.vy *= 0.98;
      if (p.gravity) p.vy += 40 * dt;
      if (p.kind === "ring") p.radius += (p.targetRadius - p.radius) * dt * 8;
    });
    state.beams.forEach((beam) => {
      beam.life -= dt;
    });
    state.floatingText.forEach((text) => {
      text.life -= dt;
      text.y -= 16 * dt;
    });

    state.enemies = state.enemies.filter((enemy) => enemy.alive);
    state.projectiles = state.projectiles.filter((projectile) => projectile.alive);
    state.particles = state.particles.filter((p) => p.life > 0);
    state.beams = state.beams.filter((beam) => beam.life > 0);
    state.floatingText = state.floatingText.filter((text) => text.life > 0);

    if (state.waveActive && !state.spawnQueue.length && !state.enemies.length) completeWave();
    updateUI();
  }

  function reachHeart(enemy) {
    enemy.alive = false;
    state.hearts = Math.max(0, state.hearts - enemy.damage);
    state.screenShake = settings.reducedEffects ? 0 : 0.65;
    vibrate([25, 35, 25]);
    ring(1061, 300, "#ff6b8a", 65);
    burst(1061, 300, "#ff6b8a", 16, 110);
    floating(1035, 253, `−${enemy.damage} REACTOR`, "#ff6b8a");
    tone(85, 0.28, "sawtooth", 0.035, -35);
    noiseBurst(0.22, 0.035, 180);
    if (state.hearts <= 0) endGame();
  }

  function completeWave() {
    state.waveActive = false;
    const composition = state.currentComposition || generateWave(state.wave);
    const meta = waveMeta(composition);
    const cleared = state.wave + 1;
    let bonus = 25 + state.wave * 6;
    if (meta.sovereign) bonus += 55;
    if (meta.colossus) bonus += 120;
    if (cleared % 5 === 0) bonus += 40;
    state.sap += bonus;
    state.wavesCleared = cleared;
    const newRecord = cleared > state.bestWave;
    if (newRecord) {
      state.bestWave = cleared;
      saveBestWave(cleared);
    }
    state.wave += 1;
    state.currentComposition = null;
    floating(1040, 255, `WAVE CLEAR +${bonus}`, "#5ef0ff");
    chord([330, 415, 494]);
    if (newRecord) {
      toast(`NEW BEST • WAVE ${cleared} • +${bonus} ECTO`);
    } else if (cleared % 5 === 0) {
      toast(`MILESTONE WAVE ${cleared} • +${bonus} ECTO`);
    } else if (meta.colossus) {
      toast(`ONI SHOGUN BANISHED • WAVE ${cleared} • +${bonus} ECTO`);
    } else if (meta.sovereign) {
      toast(`VOID EMPEROR BANISHED • WAVE ${cleared} • +${bonus} ECTO`);
    } else {
      toast(`WAVE ${cleared} HELD • +${bonus} ECTO`);
    }
    updateUI();
  }

  function activateAbility() {
    if (!state.started || state.ability < 100 || state.ended) return;
    state.ability = 0;
    state.overgrow = 8;
    state.towers.forEach((tower) => {
      tower.cooldown = Math.min(tower.cooldown, 0.08);
      burst(tower.x, tower.y, "#5ef0ff", 9, 75);
    });
    ring(1061, 300, "#5ef0ff", 450);
    chord([220, 330, 440, 659]);
    vibrate([20, 25, 45]);
    toast("OVERCHARGE • SQUAD SPEED +75%");
    updateUI();
  }

  function upgradeSelected() {
    const tower = state.selectedTower;
    if (!tower || tower.level >= 5) return;
    const cost = getUpgradeCost(tower);
    if (state.sap < cost) {
      toast(`NEED ${Math.ceil(cost - state.sap)} MORE ECTO • BANISH GHOSTS OR SCRAP`);
      tone(120, 0.08, "square", 0.015, -20);
      vibrate([18, 35, 18]);
      return;
    }
    state.sap -= cost;
    tower.invested += cost;
    tower.level += 1;
    burst(tower.x, tower.y, TOWERS[tower.type].color, 24, 125);
    ring(tower.x, tower.y, TOWERS[tower.type].color, 70);
    floating(
      tower.x,
      tower.y - 35,
      `UPGRADED • ${TOWERS[tower.type].evolutions[tower.level - 1].toUpperCase()}`,
      TOWERS[tower.type].color,
    );
    chord([330, 415, 554]);
    updateSelectionPanel();
    updateUI();
  }

  function sellSelected() {
    const tower = state.selectedTower;
    if (!tower) return;
    const value = Math.round(tower.invested * 0.65);
    state.sap += value;
    tower.node.tower = null;
    state.towers = state.towers.filter((candidate) => candidate !== tower);
    burst(tower.x, tower.y, TOWERS[tower.type].color, 13, 85);
    floating(tower.x, tower.y - 25, `+${value} ECTO`, "#5ef0ff");
    tone(260, 0.12, "sine", 0.02, -100);
    state.selectedTower = null;
    recalculateLinks();
    updateSelectionPanel();
    updateUI();
  }

  function getUpgradeCost(tower) {
    return Math.round(TOWERS[tower.type].cost * (0.62 + tower.level * 0.38));
  }

  function particle(x, y, color, vx, vy, life, size, gravity = false) {
    state.particles.push({ x, y, color, vx, vy, life, maxLife: life, size, gravity, kind: "dot" });
  }

  function burst(x, y, color, count, speed) {
    const particleCount = settings.reducedEffects ? Math.max(2, Math.ceil(count * 0.42)) : count;
    for (let i = 0; i < particleCount; i += 1) {
      const angle = Math.random() * TAU;
      const velocity = random(speed * 0.25, speed);
      particle(x, y, color, Math.cos(angle) * velocity, Math.sin(angle) * velocity, random(0.25, 0.65), random(1, 3.5), true);
    }
  }

  function ring(x, y, color, targetRadius) {
    state.particles.push({
      x,
      y,
      color,
      radius: 5,
      targetRadius,
      life: 0.45,
      maxLife: 0.45,
      kind: "ring",
    });
  }

  function floating(x, y, text, color) {
    state.floatingText.push({ x, y, text, color, life: 1.25, maxLife: 1.25 });
  }

  function drawBackdrop() {
    const gradient = ctx.createLinearGradient(0, 0, W, H);
    gradient.addColorStop(0, "#0a0618");
    gradient.addColorStop(0.48, "#140d2e");
    gradient.addColorStop(1, "#08051a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    const aurora = ctx.createLinearGradient(130, 0, 900, H);
    aurora.addColorStop(0, "rgba(94, 240, 255, 0)");
    aurora.addColorStop(0.38, `rgba(94, 240, 255, ${state.overgrow > 0 ? 0.18 : 0.08})`);
    aurora.addColorStop(0.7, "rgba(255, 94, 200, 0.08)");
    aurora.addColorStop(1, "rgba(184, 140, 255, 0)");
    ctx.fillStyle = aurora;
    ctx.beginPath();
    ctx.moveTo(80, 0);
    ctx.bezierCurveTo(280, 150, 460, 40, 620, 170);
    ctx.bezierCurveTo(790, 305, 930, 150, 1120, 280);
    ctx.lineTo(1120, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    const glow = ctx.createRadialGradient(1020, 290, 15, 1020, 290, 330);
    glow.addColorStop(0, "rgba(94, 240, 255, .14)");
    glow.addColorStop(1, "rgba(94, 240, 255, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalAlpha = 0.72;
    mossPatches.forEach((patch) => {
      const colors = ["#1a1238", "#241a4a", "#15102e"];
      const radial = ctx.createRadialGradient(patch.x, patch.y, 0, patch.x, patch.y, patch.r);
      radial.addColorStop(0, colors[patch.hue]);
      radial.addColorStop(1, "rgba(10,24,19,0)");
      ctx.fillStyle = radial;
      ctx.beginPath();
      ctx.arc(patch.x, patch.y, patch.r, 0, TAU);
      ctx.fill();
    });
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "#c8f0ff";
    backdropSeeds.forEach((seed) => {
      ctx.globalAlpha = seed.alpha + Math.sin(state.elapsed * 0.35 + seed.x) * 0.025;
      ctx.beginPath();
      const driftX = seed.x + Math.sin(state.elapsed * 0.18 + seed.y) * 7;
      const driftY = (seed.y - state.elapsed * (1.1 + seed.size * 0.2) + H) % H;
      ctx.arc(driftX, driftY, seed.size, 0, TAU);
      ctx.fill();
    });
    ctx.restore();

    drawContourLines();
    drawLivingScenery();
    drawEdgeFoliage();
  }

  function drawEntrancePortal() {
    const x = 8;
    const y = 334;
    ctx.save();
    ctx.translate(x, y);
    ctx.globalCompositeOperation = "screen";
    const portalGlow = ctx.createRadialGradient(0, 0, 3, 0, 0, 78);
    portalGlow.addColorStop(0, "rgba(244, 112, 255, .2)");
    portalGlow.addColorStop(0.45, "rgba(118, 102, 220, .08)");
    portalGlow.addColorStop(1, "rgba(118, 102, 220, 0)");
    ctx.fillStyle = portalGlow;
    ctx.beginPath();
    ctx.arc(0, 0, 78, 0, TAU);
    ctx.fill();

    for (let i = 0; i < 3; i += 1) {
      ctx.save();
      ctx.rotate(state.elapsed * (i % 2 ? -0.16 : 0.12) + i);
      ctx.strokeStyle = `rgba(211, 130, 255, ${state.waveActive ? 0.32 - i * 0.06 : 0.14 - i * 0.025})`;
      ctx.lineWidth = 1.3;
      ctx.setLineDash([4 + i * 2, 7 + i * 3]);
      ctx.beginPath();
      ctx.ellipse(0, 0, 28 + i * 10, 45 + i * 5, 0, 0, TAU);
      ctx.stroke();
      ctx.restore();
    }

    ctx.fillStyle = "rgba(14, 5, 23, .72)";
    ctx.strokeStyle = "rgba(226, 151, 255, .5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 37, 0, 0, TAU);
    ctx.fill();
    ctx.stroke();

    if (state.waveActive) {
      for (let i = 0; i < 5; i += 1) {
        const angle = state.elapsed * 1.4 + i * (TAU / 5);
        ctx.fillStyle = "rgba(238, 172, 255, .72)";
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * 28, Math.sin(angle) * 42, 1.5, 0, TAU);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawContourLines() {
    ctx.save();
    ctx.strokeStyle = "rgba(140, 120, 220, .055)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 7; i += 1) {
      ctx.beginPath();
      for (let x = -20; x <= W + 20; x += 18) {
        const y = 60 + i * 88 + Math.sin(x * 0.012 + i * 1.7) * 18 + Math.sin(x * 0.025) * 7;
        if (x === -20) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawLivingScenery() {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    livingPools.forEach((pool, index) => {
      const pulse = 1 + Math.sin(state.elapsed * 0.7 + index) * 0.035;
      ctx.save();
      ctx.translate(pool.x, pool.y);
      ctx.scale(pulse, pulse);
      const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, pool.rx);
      glow.addColorStop(0, `${pool.color}22`);
      glow.addColorStop(0.6, `${pool.color}0c`);
      glow.addColorStop(1, `${pool.color}00`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.ellipse(0, 0, pool.rx, pool.ry, 0, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = `${pool.color}24`;
      ctx.lineWidth = 1;
      for (let ringIndex = 0; ringIndex < 3; ringIndex += 1) {
        const ringPulse = ((state.elapsed * 10 + ringIndex * 17) % 34) / 34;
        ctx.globalAlpha = 1 - ringPulse;
        ctx.beginPath();
        ctx.ellipse(0, 0, pool.rx * ringPulse, pool.ry * ringPulse, 0, 0, TAU);
        ctx.stroke();
      }
      ctx.restore();
    });
    ctx.restore();

    worldBlooms.forEach((bloom, index) => {
      if (settings.reducedEffects && index % 2) return;
      const sway = Math.sin(state.elapsed * 1.4 + bloom.phase) * 3.5;
      const stemHeight = 8 + bloom.size * 8;
      ctx.save();
      ctx.translate(bloom.x, bloom.y);
      ctx.strokeStyle = "rgba(94, 240, 255, .38)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.quadraticCurveTo(sway * 0.35, -stemHeight * 0.5, sway, -stemHeight);
      ctx.stroke();
      ctx.translate(sway, -stemHeight);
      ctx.rotate(state.elapsed * 0.08 + bloom.phase);
      ctx.fillStyle = bloom.color;
      ctx.shadowColor = bloom.color;
      ctx.shadowBlur = 10 + Math.sin(state.elapsed * 2 + bloom.phase) * 4;
      ctx.globalAlpha = 0.62;
      ctx.beginPath();
      ctx.arc(0, 0, 3.5 * bloom.size, 0, TAU);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(0, 0, 1.2 * bloom.size, 0, TAU);
      ctx.fill();
      ctx.restore();
    });

    if (!settings.reducedEffects) {
      ctx.save();
      for (let i = 0; i < 14; i += 1) {
        const drift = (state.elapsed * (9 + (i % 3) * 3) + i * 83) % (W + 80);
        const x = W + 40 - drift;
        const y = 35 + ((i * 71 + Math.sin(state.elapsed + i) * 35) % (H - 70));
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(state.elapsed * 1.3 + i);
        ctx.fillStyle = i % 3 ? "rgba(94, 240, 255, .28)" : "rgba(255, 94, 200, .32)";
        ctx.beginPath();
        ctx.ellipse(0, 0, 3, 7, 0.5, 0, TAU);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    }
  }

  function drawEdgeFoliage() {
    ctx.save();
    const positions = [
      [12, 80, 0.4],
      [105, 15, 1.1],
      [320, 5, 1.8],
      [520, 12, 0.8],
      [745, 4, 1.4],
      [940, 8, 0.2],
      [1080, 105, 2.2],
      [1082, 515, 3],
      [920, 610, 4],
      [710, 612, 3.4],
      [500, 605, 5],
      [280, 612, 4.3],
      [35, 580, 5.4],
    ];
    ctx.strokeStyle = "rgba(120, 100, 200, .2)";
    ctx.fillStyle = "rgba(30, 18, 58, .35)";
    positions.forEach(([x, y, phase]) => {
      for (let j = 0; j < 3; j += 1) {
        const width = 18 + j * 14;
        const height = 42 + j * 22 + Math.sin(state.elapsed * 0.5 + phase) * 4;
        ctx.fillRect(x - width / 2, y - height, width, height);
        ctx.strokeRect(x - width / 2, y - height, width, height);
        if (j === 0) {
          ctx.fillStyle = j % 2 ? "rgba(94, 240, 255, .55)" : "rgba(255, 94, 200, .55)";
          ctx.fillRect(x - 3, y - height - 8, 6, 3);
          ctx.fillStyle = "rgba(30, 18, 58, .35)";
        }
      }
    });
    ctx.restore();
  }

  function drawTrack() {
    ctx.save();
    roundedPath(path);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 68;
    ctx.strokeStyle = "rgba(2, 4, 12, .72)";
    ctx.stroke();

    roundedPath(path);
    ctx.lineWidth = 56;
    ctx.strokeStyle = "#1a1238";
    ctx.stroke();

    roundedPath(path);
    ctx.lineWidth = 48;
    const pathGradient = ctx.createLinearGradient(0, 0, W, 0);
    pathGradient.addColorStop(0, "#22183f");
    pathGradient.addColorStop(0.5, "#2a1f4d");
    pathGradient.addColorStop(1, "#22183f");
    ctx.strokeStyle = pathGradient;
    ctx.stroke();

    roundedPath(path);
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = "rgba(180, 160, 255, .12)";
    ctx.setLineDash([2, 15]);
    ctx.lineDashOffset = -state.elapsed * 8;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    for (let d = 30; d < pathLength - 80; d += 62) {
      const p = pointAtDistance(d);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle + Math.PI / 2);
      ctx.strokeStyle = "rgba(140, 120, 220, .08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-17, 0);
      ctx.quadraticCurveTo(0, 4, 17, 0);
      ctx.stroke();
      ctx.restore();
    }

    ctx.save();
    ctx.strokeStyle = state.waveActive ? "rgba(94, 240, 255, .28)" : "rgba(255, 94, 200, .14)";
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    for (let i = 0; i < 11; i += 1) {
      const d = ((state.elapsed * (state.waveActive ? 24 : 9) + i * (pathLength / 11)) % (pathLength - 95)) + 25;
      const p = pointAtDistance(d);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.beginPath();
      ctx.moveTo(-5, -5);
      ctx.lineTo(1, 0);
      ctx.lineTo(-5, 5);
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  function drawLinks() {
    const drawn = new Set();
    state.towers.forEach((tower) => {
      tower.links.forEach((other) => {
        const key = [tower.id, other.id].sort((a, b) => a - b).join("-");
        if (drawn.has(key)) return;
        drawn.add(key);
        const diverse = tower.type !== other.type;
        const active = state.overgrow > 0;
        ctx.save();
        const rootGradient = ctx.createLinearGradient(tower.x, tower.y, other.x, other.y);
        rootGradient.addColorStop(0, TOWERS[tower.type].color);
        rootGradient.addColorStop(1, TOWERS[other.type].color);
        ctx.strokeStyle = rootGradient;
        ctx.globalAlpha = active ? 0.7 : diverse ? 0.28 : 0.11;
        ctx.lineWidth = active ? 3 : diverse ? 1.5 : 1;
        ctx.shadowColor = "#5ef0ff";
        ctx.shadowBlur = active ? 12 : 0;
        ctx.setLineDash(diverse ? [] : [3, 7]);
        ctx.beginPath();
        ctx.moveTo(tower.x, tower.y);
        const bend = Math.sin(tower.x + other.y) * 13;
        ctx.quadraticCurveTo((tower.x + other.x) / 2 + bend, (tower.y + other.y) / 2 - bend, other.x, other.y);
        ctx.stroke();
        if (diverse) {
          const t = (state.elapsed * (active ? 0.9 : 0.35) + tower.id * 0.17) % 1;
          const mx = (1 - t) * (1 - t) * tower.x + 2 * (1 - t) * t * ((tower.x + other.x) / 2 + bend) + t * t * other.x;
          const my = (1 - t) * (1 - t) * tower.y + 2 * (1 - t) * t * ((tower.y + other.y) / 2 - bend) + t * t * other.y;
          ctx.globalAlpha = active ? 1 : 0.75;
          ctx.fillStyle = "#b8f0ff";
          ctx.beginPath();
          ctx.arc(mx, my, active ? 3 : 1.7, 0, TAU);
          ctx.fill();
        }
        ctx.restore();
      });
    });
  }

  function drawNodes() {
    const nodeScale = compactRender ? 1.65 : 1;
    nodes.forEach((node, index) => {
      if (node.tower) return;
      const hovered = state.hoverNode === node;
      const canPlant = state.selectedType && state.sap >= TOWERS[state.selectedType].cost;
      const pulse = 0.5 + Math.sin(state.elapsed * 2.2 + index * 0.9) * 0.18;
      ctx.save();
      ctx.translate(node.x, node.y);
      ctx.scale(nodeScale, nodeScale);
      ctx.strokeStyle = hovered ? TOWERS[state.selectedType]?.color || "#5ef0ff" : `rgba(140, 120, 220, ${canPlant ? 0.38 : 0.18})`;
      ctx.fillStyle = hovered ? "rgba(201, 247, 111, .08)" : "rgba(11, 27, 21, .55)";
      ctx.lineWidth = hovered ? 2 : 1;
      ctx.beginPath();
      ctx.arc(0, 0, hovered ? 19 : 15 + pulse, 0, TAU);
      ctx.fill();
      ctx.stroke();
      ctx.rotate(Math.PI / 4);
      ctx.strokeStyle = `rgba(168, 218, 173, ${hovered ? 0.5 : 0.16})`;
      ctx.strokeRect(-7, -7, 14, 14);
      ctx.fillStyle = canPlant ? TOWERS[state.selectedType].color : "#4a3d6e";
      ctx.globalAlpha = canPlant ? 0.7 : 0.34;
      ctx.beginPath();
      ctx.arc(0, 0, hovered ? 3.2 : 2.2, 0, TAU);
      ctx.fill();
      ctx.restore();
    });
  }

  function drawTower(tower) {
    const data = TOWERS[tower.type];
    const selected = state.selectedTower === tower;
    const stats = towerStats(tower);
    ctx.save();
    ctx.translate(tower.x, tower.y);

    if (selected) {
      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = data.color;
      ctx.lineWidth = 1.3;
      ctx.setLineDash([5, 9]);
      ctx.lineDashOffset = -state.elapsed * 15;
      ctx.beginPath();
      ctx.arc(0, 0, stats.range, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.38;
      ctx.beginPath();
      ctx.arc(0, 0, 27 + Math.sin(state.elapsed * 3) * 2, 0, TAU);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    const modelScale = (compactRender ? 1.38 : 1) * (1 + (tower.level - 1) * 0.035);
    ctx.scale(modelScale, modelScale);

    ctx.save();
    ctx.scale(1, 0.48);
    const shadow = ctx.createRadialGradient(0, 2, 2, 0, 2, 34);
    shadow.addColorStop(0, "rgba(0, 0, 0, .66)");
    shadow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = shadow;
    ctx.beginPath();
    ctx.arc(0, 3, 34, 0, TAU);
    ctx.fill();
    ctx.restore();

    const baseGlow = ctx.createRadialGradient(0, 0, 2, 0, 0, 39);
    baseGlow.addColorStop(0, `${data.color}${tower.muzzle > 0 ? "66" : "38"}`);
    baseGlow.addColorStop(1, `${data.color}00`);
    ctx.fillStyle = baseGlow;
    ctx.beginPath();
    ctx.arc(0, 0, 36 + tower.pulse * 9, 0, TAU);
    ctx.fill();

    ctx.fillStyle = "#1a1030";
    ctx.strokeStyle = selected ? data.color : "rgba(180, 140, 255, .45)";
    ctx.lineWidth = selected ? 2.4 : 2;
    ctx.beginPath();
    for (let i = 0; i < 6; i += 1) {
      const angle = (i / 6) * TAU - Math.PI / 2;
      const radius = 21;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = `${data.color}66`;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 5]);
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, TAU);
    ctx.stroke();
    ctx.setLineDash([]);

    const reloadProgress = Math.max(0, Math.min(1, 1 - Math.max(0, tower.cooldown) * stats.rate));
    ctx.strokeStyle = data.color;
    ctx.globalAlpha = 0.48;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, 0, 20, -Math.PI / 2, -Math.PI / 2 + reloadProgress * TAU);
    ctx.stroke();
    ctx.globalAlpha = 1;

    for (let i = 0; i < 10; i += 1) {
      const angle = (i / 10) * TAU + state.elapsed * 0.08;
      ctx.save();
      ctx.translate(Math.cos(angle) * 18.5, Math.sin(angle) * 18.5);
      ctx.rotate(angle + Math.PI / 4);
      ctx.fillStyle = i < tower.level * 2 ? data.color : "rgba(129, 157, 139, .18)";
      ctx.globalAlpha = i < tower.level * 2 ? 0.7 : 1;
      ctx.fillRect(-1.5, -1.5, 3, 3);
      ctx.restore();
    }

    if (tower.level >= 4) {
      ctx.save();
      ctx.rotate(-state.elapsed * (tower.level === 5 ? 0.42 : 0.2) + tower.animOffset);
      ctx.strokeStyle = data.color;
      ctx.shadowColor = data.color;
      ctx.shadowBlur = tower.level === 5 ? 13 : 7;
      ctx.lineWidth = tower.level === 5 ? 1.7 : 1;
      ctx.globalAlpha = 0.55;
      for (let arc = 0; arc < 4; arc += 1) {
        ctx.beginPath();
        ctx.arc(0, 0, 27 + tower.level, arc * (TAU / 4), arc * (TAU / 4) + 0.62);
        ctx.stroke();
      }
      if (tower.level === 5) {
        for (let mote = 0; mote < 4; mote += 1) {
          const angle = mote * (TAU / 4);
          ctx.save();
          ctx.translate(Math.cos(angle) * 32, Math.sin(angle) * 32);
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = mote % 2 ? "#ffffff" : data.color;
          ctx.fillRect(-2.5, -2.5, 5, 5);
          ctx.restore();
        }
      }
      ctx.restore();
    }

    ctx.rotate(tower.angle + Math.PI / 2);
    if (tower.type === "sun") drawSunTower(data, tower);
    if (tower.type === "dew") drawDewTower(data, tower);
    if (tower.type === "thorn") drawThornTower(data, tower);
    if (tower.type === "prism") drawPrismTower(data, tower);
    if (tower.type === "ember") drawEmberTower(data, tower);
    if (tower.type === "gale") drawGaleTower(data, tower);
    ctx.restore();

    if (tower.synergy > 0) {
      ctx.save();
      ctx.translate(tower.x, tower.y);
      const orbitRadius = compactRender ? 34 : 27;
      for (let i = 0; i < tower.synergy; i += 1) {
        const angle = state.elapsed * 0.8 + (i / tower.synergy) * TAU + tower.animOffset;
        ctx.fillStyle = "#c8f0ff";
        ctx.globalAlpha = 0.82;
        ctx.shadowColor = "#c8f0ff";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * orbitRadius, Math.sin(angle) * orbitRadius, compactRender ? 2.8 : 2.1, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    }

    ctx.save();
    ctx.fillStyle = data.color;
    ctx.font = `500 ${compactRender ? 11 : 9}px 'DM Mono', monospace`;
    ctx.textAlign = "center";
    ctx.globalAlpha = 0.78;
    ctx.fillText(["", "I", "II", "III", "IV", "V"][tower.level], tower.x, tower.y + (compactRender ? 43 : 34));
    ctx.restore();
  }

  function drawSunTower(data, tower) {
    const recoil = tower.recoil * 4.5;
    const spin = state.elapsed * (1.2 + tower.level * 0.12) + tower.animOffset;
    ctx.translate(0, recoil);

    const barrel = ctx.createLinearGradient(-7, 8, 7, -18);
    barrel.addColorStop(0, "#3a2f5c");
    barrel.addColorStop(0.5, "#6a5a9a");
    barrel.addColorStop(1, "#ffd15e");
    ctx.strokeStyle = barrel;
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, 9);
    ctx.lineTo(0, -13);
    ctx.stroke();

    ctx.save();
    ctx.translate(0, -14);
    ctx.rotate(spin);
    ctx.strokeStyle = "#ffd15e";
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 6; i += 1) {
      ctx.save();
      ctx.rotate((i / 6) * TAU);
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(0, -18 - tower.level);
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();

    const lens = ctx.createRadialGradient(-2, -16, 1, 0, -14, 9);
    lens.addColorStop(0, "#ffffff");
    lens.addColorStop(0.28, "#fff3ae");
    lens.addColorStop(0.65, data.color);
    lens.addColorStop(1, "#8d4c1c");
    ctx.fillStyle = lens;
    ctx.shadowColor = data.color;
    ctx.shadowBlur = 13 + tower.pulse * 12;
    ctx.beginPath();
    ctx.arc(0, -14, 7 + tower.pulse * 1.5, 0, TAU);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 245, 179, .72)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, -14, 10 + Math.sin(state.elapsed * 4 + tower.animOffset), 0, TAU);
    ctx.stroke();

    if (tower.muzzle > 0) {
      ctx.translate(0, -27);
      ctx.globalAlpha = tower.muzzle;
      ctx.fillStyle = "#fff9d2";
      ctx.shadowBlur = 22;
      ctx.beginPath();
      ctx.arc(0, 0, 5 + tower.muzzle * 4, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = data.color;
      ctx.lineWidth = 1.5;
      ctx.save();
      for (let i = 0; i < 6; i += 1) {
        ctx.rotate(TAU / 6);
        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.lineTo(0, -14 - tower.muzzle * 8);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  function drawDewTower(data, tower) {
    const recoil = tower.recoil * 3.5;
    ctx.translate(0, recoil);

    ctx.fillStyle = "#1d5b62";
    ctx.strokeStyle = "#75d9e6";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-11, 8);
    ctx.quadraticCurveTo(-14, -1, -8, -11);
    ctx.lineTo(8, -11);
    ctx.quadraticCurveTo(14, -1, 11, 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    const reservoir = ctx.createRadialGradient(-4, -6, 1, 0, -3, 13);
    reservoir.addColorStop(0, "#e9ffff");
    reservoir.addColorStop(0.25, "#80e9f2");
    reservoir.addColorStop(0.72, "#287e8a");
    reservoir.addColorStop(1, "#123f48");
    ctx.fillStyle = reservoir;
    ctx.shadowColor = data.color;
    ctx.shadowBlur = 10 + tower.pulse * 8;
    ctx.beginPath();
    ctx.arc(0, -3, 10, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "rgba(213, 255, 255, .65)";
    ctx.stroke();

    ctx.strokeStyle = "#9af5fb";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(0, -23);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, -24, 5.5, 0, TAU);
    ctx.stroke();

    for (let i = 0; i < 3 + tower.level; i += 1) {
      const phase = state.elapsed * (0.8 + i * 0.08) + tower.animOffset + i * 1.7;
      const bx = Math.sin(phase) * 5;
      const by = 4 - ((phase * 7) % 16);
      ctx.fillStyle = "rgba(220, 255, 255, .72)";
      ctx.beginPath();
      ctx.arc(bx, by, 1 + (i % 2) * 0.5, 0, TAU);
      ctx.fill();
    }

    if (tower.muzzle > 0) {
      const flash = ctx.createRadialGradient(0, -29, 0, 0, -29, 13);
      flash.addColorStop(0, "rgba(240, 255, 255, 1)");
      flash.addColorStop(0.35, "rgba(117, 217, 230, .9)");
      flash.addColorStop(1, "rgba(117, 217, 230, 0)");
      ctx.fillStyle = flash;
      ctx.globalAlpha = tower.muzzle;
      ctx.beginPath();
      ctx.arc(0, -29, 13, 0, TAU);
      ctx.fill();
    }
  }

  function drawThornTower(data, tower) {
    const recoil = tower.recoil * 6;
    const jaw = 4 + tower.muzzle * 6;
    ctx.translate(0, recoil);

    ctx.fillStyle = "#54243a";
    ctx.strokeStyle = "#ef738f";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 16, 0, 0, TAU);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#9e3858";
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.scale(side, 1);
      ctx.beginPath();
      ctx.moveTo(1, 5);
      ctx.quadraticCurveTo(13 + jaw, -7, 7, -24);
      ctx.lineTo(1, -16);
      ctx.quadraticCurveTo(5, -5, 1, 5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      for (let i = 0; i < 3; i += 1) {
        ctx.fillStyle = "#ffd0d9";
        ctx.beginPath();
        ctx.moveTo(5 + i * 2, -7 - i * 5);
        ctx.lineTo(11 + jaw * 0.3, -10 - i * 5);
        ctx.lineTo(6, -13 - i * 5);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    const core = ctx.createRadialGradient(-2, -8, 1, 0, -8, 8);
    core.addColorStop(0, "#ffe0e6");
    core.addColorStop(0.35, data.color);
    core.addColorStop(1, "#601a38");
    ctx.fillStyle = core;
    ctx.shadowColor = data.color;
    ctx.shadowBlur = 10 + tower.pulse * 9;
    ctx.beginPath();
    ctx.arc(0, -8, 6, 0, TAU);
    ctx.fill();

    if (tower.muzzle > 0) {
      ctx.globalAlpha = tower.muzzle;
      ctx.translate(0, -29);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = "#fff0f3";
      ctx.shadowBlur = 20;
      ctx.fillRect(-4, -4, 8, 8);
    }
  }

  function drawPrismTower(data, tower) {
    const recoil = tower.recoil * 2.5;
    const spin = state.elapsed * (0.8 + tower.level * 0.1) + tower.animOffset;
    ctx.translate(0, recoil);

    ctx.strokeStyle = "rgba(182, 151, 255, .48)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-10, 8);
    ctx.lineTo(-5, -10);
    ctx.moveTo(10, 8);
    ctx.lineTo(5, -10);
    ctx.stroke();

    ctx.save();
    ctx.translate(0, -8);
    ctx.rotate(spin);
    for (let i = 0; i < 3 + tower.level; i += 1) {
      const angle = (i / (3 + tower.level)) * TAU;
      ctx.save();
      ctx.translate(Math.cos(angle) * 15, Math.sin(angle) * 8);
      ctx.rotate(-spin + angle);
      ctx.fillStyle = i % 2 ? "#7759cb" : "#b697ff";
      ctx.strokeStyle = "#eee6ff";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, -7);
      ctx.lineTo(4, 0);
      ctx.lineTo(0, 7);
      ctx.lineTo(-4, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();

    ctx.translate(0, -10);
    const crystal = ctx.createLinearGradient(-8, -13, 8, 12);
    crystal.addColorStop(0, "#f4edff");
    crystal.addColorStop(0.32, "#cdb9ff");
    crystal.addColorStop(0.68, "#8565dc");
    crystal.addColorStop(1, "#3d286e");
    ctx.fillStyle = crystal;
    ctx.strokeStyle = "#e8ddff";
    ctx.lineWidth = 1.2;
    ctx.shadowColor = data.color;
    ctx.shadowBlur = 14 + tower.pulse * 14;
    ctx.beginPath();
    ctx.moveTo(0, -17);
    ctx.lineTo(9, -2);
    ctx.lineTo(4, 12);
    ctx.lineTo(-5, 12);
    ctx.lineTo(-9, -2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 255, 255, .72)";
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(-3, 7);
    ctx.stroke();

    if (tower.muzzle > 0) {
      ctx.globalAlpha = tower.muzzle;
      ctx.fillStyle = "#ffffff";
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(0, -22, 7 + tower.muzzle * 5, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = data.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -22, 12 + (1 - tower.muzzle) * 16, 0, TAU);
      ctx.stroke();
    }
  }

  function drawEmberTower(data, tower) {
    const recoil = tower.recoil * 4;
    const breathe = 1 + Math.sin(state.elapsed * 3.2 + tower.animOffset) * 0.06;
    ctx.translate(0, recoil);

    ctx.fillStyle = "#54261f";
    ctx.strokeStyle = "#c64d30";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 13, 15, 0, 0, TAU);
    ctx.fill();
    ctx.stroke();

    const furnace = ctx.createRadialGradient(-3, -5, 1, 0, -3, 12);
    furnace.addColorStop(0, "#fff5aa");
    furnace.addColorStop(0.28, "#ffbd58");
    furnace.addColorStop(0.66, "#f05b36");
    furnace.addColorStop(1, "#541b24");
    ctx.fillStyle = furnace;
    ctx.shadowColor = data.color;
    ctx.shadowBlur = 13 + tower.pulse * 10;
    ctx.save();
    ctx.scale(breathe, breathe);
    ctx.beginPath();
    ctx.arc(0, -3, 9, 0, TAU);
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = "#ffb25e";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(0, -23);
    ctx.stroke();

    for (let i = 0; i < 3 + Math.min(3, tower.level); i += 1) {
      const angle = (i / (3 + Math.min(3, tower.level))) * TAU + state.elapsed * 0.35;
      ctx.fillStyle = i % 2 ? "#ff713f" : "#ffb45e";
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 11, Math.sin(angle) * 11);
      ctx.lineTo(Math.cos(angle - 0.18) * 18, Math.sin(angle - 0.18) * 18);
      ctx.lineTo(Math.cos(angle + 0.18) * 18, Math.sin(angle + 0.18) * 18);
      ctx.closePath();
      ctx.fill();
    }

    if (tower.muzzle > 0) {
      const flame = ctx.createRadialGradient(0, -29, 0, 0, -29, 16);
      flame.addColorStop(0, "#ffffff");
      flame.addColorStop(0.2, "#fff19a");
      flame.addColorStop(0.55, "#ff713f");
      flame.addColorStop(1, "rgba(255, 77, 42, 0)");
      ctx.globalAlpha = tower.muzzle;
      ctx.fillStyle = flame;
      ctx.beginPath();
      ctx.arc(0, -29, 16, 0, TAU);
      ctx.fill();
    }
  }

  function drawGaleTower(data, tower) {
    const recoil = tower.recoil * 2.5;
    const spin = state.elapsed * (2.2 + tower.level * 0.2) + tower.animOffset;
    ctx.translate(0, recoil);

    ctx.strokeStyle = "#54aa8e";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.quadraticCurveTo(-3, -3, 0, -13);
    ctx.stroke();

    ctx.save();
    ctx.translate(0, -12);
    ctx.rotate(spin);
    for (let i = 0; i < 5; i += 1) {
      ctx.save();
      ctx.rotate((i / 5) * TAU);
      const leaf = ctx.createLinearGradient(0, -4, 0, -23);
      leaf.addColorStop(0, "#3b8a73");
      leaf.addColorStop(1, "#baffdd");
      ctx.fillStyle = leaf;
      ctx.strokeStyle = "#d9ffed";
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(-2, -3);
      ctx.quadraticCurveTo(-10, -14, 0, -23 - tower.level);
      ctx.quadraticCurveTo(10, -14, 2, -3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();

    ctx.fillStyle = "#e7fff5";
    ctx.shadowColor = data.color;
    ctx.shadowBlur = 15 + tower.pulse * 12;
    ctx.beginPath();
    ctx.arc(0, -12, 5.5, 0, TAU);
    ctx.fill();

    ctx.strokeStyle = "rgba(134, 240, 207, .48)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 2 + tower.level; i += 1) {
      ctx.beginPath();
      ctx.arc(0, -12, 9 + i * 3 + Math.sin(state.elapsed * 4 + i) * 1.2, -Math.PI * 0.8, Math.PI * 0.25);
      ctx.stroke();
    }

    if (tower.muzzle > 0) {
      ctx.globalAlpha = tower.muzzle;
      ctx.strokeStyle = "#ddfff5";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -27, 8 + (1 - tower.muzzle) * 14, 0, TAU);
      ctx.stroke();
    }
  }

  const ANIME_INK = "#12081f";

  function animeOutline(width = 2.2) {
    ctx.lineWidth = width;
    ctx.strokeStyle = ANIME_INK;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
  }

  function drawAnimeEye(x, y, size, iris, pupil = "#12081f") {
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(x, y, size * 1.15, size, 0, 0, TAU);
    ctx.fill();
    animeOutline(1.4);
    ctx.stroke();
    ctx.fillStyle = iris;
    ctx.beginPath();
    ctx.arc(x, y + size * 0.12, size * 0.62, 0, TAU);
    ctx.fill();
    ctx.fillStyle = pupil;
    ctx.beginPath();
    ctx.arc(x + size * 0.12, y + size * 0.18, size * 0.34, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x - size * 0.22, y - size * 0.08, size * 0.16, 0, TAU);
    ctx.fill();
  }

  function drawAnimeHairSpikes(baseColor, highlight, count, radius, length) {
    for (let i = 0; i < count; i += 1) {
      const angle = -Math.PI * 0.75 + (i / (count - 1)) * Math.PI * 1.5;
      ctx.fillStyle = i % 2 ? highlight : baseColor;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * radius * 0.4, Math.sin(angle) * radius * 0.4 - 2);
      ctx.quadraticCurveTo(
        Math.cos(angle) * (radius + length * 0.5),
        Math.sin(angle) * (radius + length * 0.5) - 4,
        Math.cos(angle) * (radius + length),
        Math.sin(angle) * (radius + length) - 1,
      );
      ctx.lineTo(Math.cos(angle + 0.18) * radius * 0.5, Math.sin(angle + 0.18) * radius * 0.5);
      ctx.closePath();
      ctx.fill();
      animeOutline(1.2);
      ctx.stroke();
    }
  }

  function drawAnimeAura(color, radius, alpha = 0.22) {
    const pulse = 1 + Math.sin(state.elapsed * 3.2) * 0.06;
    const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, radius * pulse);
    glow.addColorStop(0, `${color}${Math.round(alpha * 255).toString(16).padStart(2, "0")}`);
    glow.addColorStop(1, `${color}00`);
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, radius * pulse, 0, TAU);
    ctx.fill();
  }

  function drawYureiKid(enemy) {
    const bob = Math.sin(state.elapsed * 8 + enemy.phase) * 2;
    ctx.translate(0, bob);
    drawAnimeAura("#fff6b0", 18, 0.18);
    ctx.fillStyle = "#f8f4ff";
    ctx.beginPath();
    ctx.ellipse(0, 2, 9, 11, 0, 0, TAU);
    ctx.fill();
    animeOutline();
    ctx.stroke();
    ctx.fillStyle = "#e8e2ff";
    ctx.beginPath();
    ctx.moveTo(-9, 4);
    ctx.quadraticCurveTo(0, 18, 9, 4);
    ctx.fill();
    animeOutline(1.6);
    ctx.stroke();
    drawAnimeEye(-3.5, -1, 2.8, "#7ec8ff");
    drawAnimeEye(3.5, -1, 2.8, "#7ec8ff");
    ctx.fillStyle = ANIME_INK;
    ctx.beginPath();
    ctx.arc(0, 3.5, 1.2, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.55)";
    ctx.beginPath();
    ctx.ellipse(-7, 0, 2.2, 3.5, -0.4, 0, TAU);
    ctx.ellipse(7, 0, 2.2, 3.5, 0.4, 0, TAU);
    ctx.fill();
  }

  function drawBansheeIdol(enemy) {
    const sway = Math.sin(state.elapsed * 5 + enemy.phase) * 0.08;
    ctx.rotate(sway);
    drawAnimeAura("#8ec8ff", 20, 0.16);
    drawAnimeHairSpikes("#6ec6ff", "#b8e8ff", 5, 8, 10);
    ctx.fillStyle = "#ffe3f1";
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, TAU);
    ctx.fill();
    animeOutline();
    ctx.stroke();
    drawAnimeEye(-3, -1, 2.6, "#ff7eb8");
    drawAnimeEye(3, -1, 2.6, "#ff7eb8");
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(-8, 3);
    ctx.lineTo(8, 3);
    ctx.lineTo(6, 12);
    ctx.lineTo(-6, 12);
    ctx.closePath();
    ctx.fill();
    animeOutline(1.5);
    ctx.stroke();
    ctx.fillStyle = "#ff8ec8";
    ctx.fillRect(-8, 3, 16, 2.5);
    ctx.fillStyle = "rgba(180,230,255,.45)";
    ctx.beginPath();
    ctx.moveTo(0, 12);
    ctx.quadraticCurveTo(-4, 18, 0, 22);
    ctx.quadraticCurveTo(4, 18, 0, 12);
    ctx.fill();
  }

  function drawCrimsonRonin() {
    drawAnimeAura("#ff5a6e", 24, 0.14);
    ctx.fillStyle = "#3a1520";
    ctx.beginPath();
    ctx.ellipse(0, 3, 14, 10, 0, 0, TAU);
    ctx.fill();
    animeOutline(2.6);
    ctx.stroke();
    ctx.fillStyle = "#8c1f2f";
    ctx.beginPath();
    ctx.moveTo(-12, -2);
    ctx.lineTo(0, -14);
    ctx.lineTo(12, -2);
    ctx.lineTo(8, 2);
    ctx.lineTo(-8, 2);
    ctx.closePath();
    ctx.fill();
    animeOutline(2);
    ctx.stroke();
    ctx.fillStyle = "#ff334d";
    ctx.beginPath();
    ctx.arc(-4, -1, 2.2, 0, TAU);
    ctx.arc(4, -1, 2.2, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#ffd0d0";
    ctx.fillRect(-10, 4, 20, 5);
    animeOutline(1.5);
    ctx.strokeRect(-10, 4, 20, 5);
    ctx.strokeStyle = "#ff8a98";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(10, 2);
    ctx.lineTo(22, 0);
    ctx.stroke();
  }

  function drawMikoWraith(enemy) {
    const float = Math.sin(state.elapsed * 4 + enemy.phase) * 1.5;
    ctx.translate(0, float);
    drawAnimeAura("#f2a8ff", 22, 0.15);
    ctx.fillStyle = "#fff5ff";
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, TAU);
    ctx.fill();
    animeOutline();
    ctx.stroke();
    ctx.fillStyle = "#ff8ab8";
    ctx.beginPath();
    ctx.arc(-7, -2, 3.5, 0, TAU);
    ctx.arc(7, -2, 3.5, 0, TAU);
    ctx.fill();
    animeOutline(1.2);
    ctx.stroke();
    drawAnimeEye(-3, -0.5, 2.4, "#c76bff");
    drawAnimeEye(3, -0.5, 2.4, "#c76bff");
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(-9, 4);
    ctx.lineTo(9, 4);
    ctx.lineTo(7, 14);
    ctx.lineTo(-7, 14);
    ctx.closePath();
    ctx.fill();
    animeOutline(1.5);
    ctx.stroke();
    ctx.fillStyle = "#ff3d6a";
    ctx.fillRect(-1.5, 5, 3, 9);
    ctx.fillStyle = "#fff8b0";
    ctx.fillRect(-5, 7, 10, 5);
    animeOutline(1);
    ctx.strokeRect(-5, 7, 10, 5);
    ctx.fillStyle = "#ff2244";
    for (let i = 0; i < 3; i += 1) {
      ctx.fillRect(-4 + i * 4, 8.5, 1.5, 2);
    }
  }

  function drawShadowShinobi(enemy) {
    const dash = Math.sin(state.elapsed * 14 + enemy.phase) * 2;
    ctx.translate(dash, 0);
    drawAnimeAura("#6f8cff", 20, 0.12);
    ctx.fillStyle = "#23204a";
    ctx.beginPath();
    ctx.ellipse(0, 1, 9, 11, 0, 0, TAU);
    ctx.fill();
    animeOutline();
    ctx.stroke();
    ctx.fillStyle = "#15122e";
    ctx.beginPath();
    ctx.moveTo(-8, -4);
    ctx.lineTo(8, -4);
    ctx.lineTo(6, 5);
    ctx.lineTo(-6, 5);
    ctx.closePath();
    ctx.fill();
    drawAnimeEye(-3, -1, 2.2, "#8af0ff");
    drawAnimeEye(3, -1, 2.2, "#8af0ff");
    ctx.strokeStyle = "#9eb4ff";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-12, 4);
    ctx.quadraticCurveTo(-24 - Math.sin(state.elapsed * 10) * 3, 0, -30, -6);
    ctx.stroke();
    ctx.strokeStyle = ANIME_INK;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(8, 2);
    ctx.lineTo(16, 4);
    ctx.stroke();
  }

  function drawVoidEmperor() {
    drawAnimeAura("#d66bff", 38, 0.24);
    ctx.fillStyle = "#2a1248";
    ctx.beginPath();
    ctx.moveTo(-18, 8);
    ctx.lineTo(-22, -6);
    ctx.lineTo(0, -20);
    ctx.lineTo(22, -6);
    ctx.lineTo(18, 8);
    ctx.closePath();
    ctx.fill();
    animeOutline(2.8);
    ctx.stroke();
    drawAnimeHairSpikes("#6b2cff", "#c08cff", 7, 10, 16);
    ctx.fillStyle = "#f0d8ff";
    ctx.beginPath();
    ctx.arc(0, -2, 10, 0, TAU);
    ctx.fill();
    animeOutline(2);
    ctx.stroke();
    drawAnimeEye(-4, -3, 3.2, "#b44fff");
    drawAnimeEye(4, -3, 3.2, "#b44fff");
    ctx.fillStyle = "#ffd76a";
    ctx.beginPath();
    ctx.moveTo(-6, -14);
    ctx.lineTo(0, -20);
    ctx.lineTo(6, -14);
    ctx.lineTo(0, -10);
    ctx.closePath();
    ctx.fill();
    animeOutline(1.2);
    ctx.stroke();
    ctx.fillStyle = "rgba(120,60,200,.35)";
    ctx.beginPath();
    ctx.moveTo(-24, 0);
    ctx.quadraticCurveTo(-30, 14, -10, 18);
    ctx.lineTo(10, 18);
    ctx.quadraticCurveTo(30, 14, 24, 0);
    ctx.closePath();
    ctx.fill();
    animeOutline(2);
    ctx.stroke();
  }

  function drawOniShogun() {
    drawAnimeAura("#ff4f9a", 48, 0.28);
    ctx.fillStyle = "#4a1230";
    ctx.beginPath();
    ctx.ellipse(0, 6, 24, 18, 0, 0, TAU);
    ctx.fill();
    animeOutline(3.2);
    ctx.stroke();
    ctx.fillStyle = "#d63a52";
    ctx.beginPath();
    ctx.arc(0, -4, 16, 0, TAU);
    ctx.fill();
    animeOutline(2.8);
    ctx.stroke();
    ctx.fillStyle = "#ffca62";
    ctx.beginPath();
    ctx.moveTo(-14, -16);
    ctx.lineTo(-10, -28);
    ctx.lineTo(-4, -16);
    ctx.closePath();
    ctx.moveTo(14, -16);
    ctx.lineTo(10, -28);
    ctx.lineTo(4, -16);
    ctx.closePath();
    ctx.fill();
    animeOutline(2);
    ctx.stroke();
    drawAnimeEye(-6, -5, 4, "#fff06a");
    drawAnimeEye(6, -5, 4, "#fff06a");
    ctx.fillStyle = ANIME_INK;
    ctx.beginPath();
    ctx.moveTo(-3, 2);
    ctx.lineTo(0, 5);
    ctx.lineTo(3, 2);
    ctx.stroke();
    ctx.fillStyle = "#f8f0ff";
    for (let t = 0; t < 4; t += 1) {
      const angle = (t / 4) * TAU - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 10, Math.sin(angle) * 8 - 4);
      ctx.lineTo(Math.cos(angle) * 18, Math.sin(angle) * 14 - 4);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#f8f0ff";
      ctx.stroke();
    }
    ctx.fillStyle = "#5c2438";
    ctx.fillRect(-20, 8, 40, 8);
    animeOutline(2);
    ctx.strokeRect(-20, 8, 40, 8);
  }

  function drawEnemy(enemy) {
    const data = ENEMIES[enemy.type];
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    const enemyScale = compactRender ? 1.55 : 1.12;
    ctx.scale(enemyScale, enemyScale);
    ctx.rotate(enemy.angle);
    ctx.globalAlpha = enemy.hitFlash > 0 ? 0.45 : 1;

    const drawers = {
      mite: drawYureiKid,
      wisp: drawBansheeIdol,
      brute: drawCrimsonRonin,
      spore: drawMikoWraith,
      shade: drawShadowShinobi,
      sovereign: drawVoidEmperor,
      colossus: drawOniShogun,
    };
    drawers[enemy.type](enemy);

    if (enemy.burnTimer > 0) {
      ctx.fillStyle = "#ff9b52";
      ctx.shadowColor = "#ff6f3d";
      ctx.shadowBlur = 10;
      for (let i = 0; i < 3; i += 1) {
        const phase = state.elapsed * 7 + enemy.phase + i * 2.1;
        ctx.beginPath();
        ctx.arc(Math.sin(phase) * enemy.radius * 0.55, -enemy.radius * 0.65 + Math.cos(phase) * 3, 2.2, 0, TAU);
        ctx.fill();
      }
    }
    ctx.restore();

    const barWidth =
      (enemy.type === "sovereign" || enemy.type === "colossus" ? 68 : enemy.radius * 2.4) *
      (compactRender ? 1.32 : 1);
    const y = enemy.y - enemy.radius * enemyScale - (compactRender ? 14 : 12);
    ctx.fillStyle = ANIME_INK;
    ctx.fillRect(enemy.x - barWidth / 2 - 1, y - 1, barWidth + 2, 5);
    ctx.fillStyle = "rgba(18,8,31,.85)";
    ctx.fillRect(enemy.x - barWidth / 2, y, barWidth, 3);
    ctx.fillStyle = enemy.slow < 1 ? "#8ec8ff" : data.color;
    ctx.fillRect(enemy.x - barWidth / 2, y, barWidth * Math.max(0, enemy.hp / enemy.maxHp), 3);

    if (enemy.armor) {
      ctx.fillStyle = "#ffd76a";
      ctx.font = "bold 9px 'M PLUS Rounded 1c', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("盾", enemy.x, y - 4);
    }
  }

  function drawWarden() {
    const warden = state.warden;
    const bob = Math.sin(state.elapsed * 7) * 2;
    ctx.save();
    ctx.translate(warden.x, warden.y + bob);
    const wardenScale = compactRender ? 1.45 : 1.15;
    ctx.scale(wardenScale, wardenScale);
    drawAnimeAura("#5ef0ff", 42, 0.2);

    ctx.rotate(warden.angle);
    for (let tail = 0; tail < 2; tail += 1) {
      const side = tail ? 1 : -1;
      const sway = Math.sin(state.elapsed * 8 + tail) * 0.22;
      ctx.save();
      ctx.rotate(side * 0.35 + sway);
      ctx.strokeStyle = "#ffb8e8";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(side * 6, 4);
      ctx.quadraticCurveTo(side * 22, 10, side * 30, -2);
      ctx.stroke();
      animeOutline(1.5);
      ctx.stroke();
      ctx.restore();
    }

    ctx.fillStyle = "#2a1a48";
    ctx.beginPath();
    ctx.ellipse(0, 5, 12, 8, 0, 0, TAU);
    ctx.fill();
    animeOutline(2);
    ctx.stroke();

    drawAnimeHairSpikes("#ff8fd8", "#ffd0f0", 5, 7, 11);
    ctx.fillStyle = "#ffe8f5";
    ctx.beginPath();
    ctx.arc(0, 0, 9, 0, TAU);
    ctx.fill();
    animeOutline(2);
    ctx.stroke();
    drawAnimeEye(-3.5, -1, 2.8, "#5ef0ff");
    drawAnimeEye(3.5, -1, 2.8, "#5ef0ff");

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(-10, 4);
    ctx.lineTo(10, 4);
    ctx.lineTo(8, 13);
    ctx.lineTo(-8, 13);
    ctx.closePath();
    ctx.fill();
    animeOutline(1.6);
    ctx.stroke();
    ctx.fillStyle = "#5ef0ff";
    ctx.fillRect(-10, 4, 20, 2.5);

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(24, -1);
    ctx.lineTo(10, 5);
    ctx.closePath();
    ctx.fill();
    animeOutline(1.2);
    ctx.stroke();
    ctx.fillStyle = "#5ef0ff";
    ctx.beginPath();
    ctx.arc(22, -1, 2.5, 0, TAU);
    ctx.fill();

    ctx.restore();
    ctx.save();
    ctx.fillStyle = "rgba(255, 184, 232, .85)";
    ctx.font = `bold ${compactRender ? 9 : 8}px 'M PLUS Rounded 1c', sans-serif`;
    ctx.textAlign = "center";
    ctx.strokeStyle = ANIME_INK;
    ctx.lineWidth = 2;
    ctx.strokeText("NOVA • PARTNER", warden.x, warden.y - (compactRender ? 54 : 44));
    ctx.fillText("NOVA • PARTNER", warden.x, warden.y - (compactRender ? 54 : 44));
    ctx.restore();
  }

  function drawHeart() {
    const x = 1061;
    const y = 300;
    const health = state.hearts / 20;
    ctx.save();
    ctx.translate(x, y);
    const pulse = (compactRender ? 1.16 : 1) + Math.sin(state.elapsed * 2.4) * 0.05;
    ctx.scale(pulse, pulse);

    const glow = ctx.createRadialGradient(0, 0, 5, 0, 0, 67);
    glow.addColorStop(0, state.hearts > 6 ? "rgba(94,240,255,.32)" : "rgba(255,107,138,.36)");
    glow.addColorStop(1, "rgba(94,240,255,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, 67, 0, TAU);
    ctx.fill();

    ctx.strokeStyle = state.hearts > 6 ? "rgba(94,240,255,.38)" : "rgba(255,107,138,.52)";
    ctx.lineWidth = 1.3;
    for (let i = 0; i < 4; i += 1) {
      ctx.save();
      ctx.rotate((i / 4) * TAU + state.elapsed * 0.04);
      ctx.beginPath();
      ctx.ellipse(0, 0, 35 + i * 2, 21 + i * 4, 0, 0, TAU);
      ctx.stroke();
      ctx.restore();
    }

    ctx.fillStyle = "#120a24";
    ctx.strokeStyle = state.hearts > 6 ? "#5ef0ff" : "#ff6b8a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 8; i += 1) {
      const angle = (i / 8) * TAU - Math.PI / 2;
      const radius = i % 2 ? 19 : 29;
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;
      if (!i) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = state.hearts > 6 ? "#8af8ff" : "#ff9bb0";
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(0, 0, 8 + Math.sin(state.elapsed * 3) * 1.2, 0, TAU);
    ctx.fill();

    ctx.restore();

    ctx.fillStyle = "rgba(8,4,18,.82)";
    ctx.fillRect(x - 30, y + 42, 60, 4);
    ctx.fillStyle = health > 0.3 ? "#5ef0ff" : "#ff6b8a";
    ctx.fillRect(x - 30, y + 42, 60 * health, 4);
    ctx.fillStyle = "rgba(220, 230, 255, .62)";
    ctx.font = "500 8px 'DM Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("REACTOR", x, y + 58);
  }

  function drawProjectiles() {
    state.projectiles.forEach((projectile) => {
      ctx.save();
      if (projectile.trail.length > 1) {
        ctx.lineCap = "round";
        for (let i = projectile.trail.length - 1; i > 0; i -= 1) {
          const point = projectile.trail[i];
          const next = projectile.trail[i - 1];
          const alpha = (1 - i / projectile.trail.length) * 0.55;
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = projectile.color;
          ctx.lineWidth =
            projectile.type === "thorn"
              ? 1.5
              : projectile.type === "wyrm"
                ? 5 * (1 - i / projectile.trail.length)
                : projectile.type === "ember" || projectile.type === "gale"
                  ? 4
                  : 3;
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(next.x, next.y);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      ctx.translate(projectile.x, projectile.y);
      if (compactRender) ctx.scale(1.3, 1.3);
      ctx.rotate(projectile.rotation || 0);
      ctx.shadowColor = projectile.color;
      ctx.shadowBlur = projectile.type === "wyrm" ? 18 : 12;

      if (projectile.type === "sun") {
        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 10);
        glow.addColorStop(0, "#ffffff");
        glow.addColorStop(0.25, "#fff4b0");
        glow.addColorStop(0.7, projectile.color);
        glow.addColorStop(1, "rgba(255, 198, 99, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, TAU);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.ellipse(1, 0, 6, 2.4, 0, 0, TAU);
        ctx.fill();
      } else if (projectile.type === "dew") {
        const droplet = ctx.createRadialGradient(-2, -2, 0, 0, 0, 8);
        droplet.addColorStop(0, "#ffffff");
        droplet.addColorStop(0.3, "#c8fbff");
        droplet.addColorStop(0.72, "#4bc3d2");
        droplet.addColorStop(1, "#176a79");
        ctx.fillStyle = droplet;
        ctx.rotate(projectile.age * 8);
        ctx.beginPath();
        ctx.moveTo(7, 0);
        ctx.quadraticCurveTo(0, -7, -6, 0);
        ctx.quadraticCurveTo(0, 7, 7, 0);
        ctx.fill();
        ctx.strokeStyle = "rgba(230, 255, 255, .8)";
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (projectile.type === "thorn") {
        ctx.fillStyle = "#ef738f";
        ctx.strokeStyle = "#ffd0da";
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(13, 0);
        ctx.lineTo(-6, -5);
        ctx.lineTo(-3, 0);
        ctx.lineTo(-6, 5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#8e2949";
        ctx.beginPath();
        ctx.moveTo(2, 0);
        ctx.lineTo(-11, -7);
        ctx.lineTo(-7, 0);
        ctx.lineTo(-11, 7);
        ctx.closePath();
        ctx.fill();
      } else if (projectile.type === "ember") {
        const fireball = ctx.createRadialGradient(2, -1, 0, 0, 0, 11);
        fireball.addColorStop(0, "#ffffff");
        fireball.addColorStop(0.2, "#fff29a");
        fireball.addColorStop(0.52, "#ff8b52");
        fireball.addColorStop(1, "rgba(214, 50, 32, 0)");
        ctx.fillStyle = fireball;
        ctx.beginPath();
        ctx.arc(0, 0, 11, 0, TAU);
        ctx.fill();
        ctx.fillStyle = "#ffb354";
        ctx.beginPath();
        ctx.moveTo(-4, 0);
        ctx.lineTo(-17 - Math.sin(projectile.age * 22) * 4, -5);
        ctx.lineTo(-11, 4);
        ctx.closePath();
        ctx.fill();
      } else if (projectile.type === "gale") {
        ctx.strokeStyle = "#dffff5";
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i += 1) {
          ctx.beginPath();
          ctx.arc(0, 0, 5 + i * 3, projectile.age * 9 + i, projectile.age * 9 + i + Math.PI * 1.25);
          ctx.stroke();
        }
        ctx.fillStyle = "#f0fff9";
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, TAU);
        ctx.fill();
      } else if (projectile.type === "wyrm") {
        const flame = ctx.createLinearGradient(-15, 0, 10, 0);
        flame.addColorStop(0, "rgba(93, 255, 114, 0)");
        flame.addColorStop(0.45, "#62df7d");
        flame.addColorStop(0.75, "#d7ff8c");
        flame.addColorStop(1, "#ffffff");
        ctx.fillStyle = flame;
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.quadraticCurveTo(-2, -7, -16 - Math.sin(projectile.age * 20) * 4, 0);
        ctx.quadraticCurveTo(-2, 7, 10, 0);
        ctx.fill();
        ctx.fillStyle = "#f2ffcb";
        ctx.beginPath();
        ctx.arc(6, 0, 3, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    });

    state.beams.forEach((beam) => {
      const alpha = beam.life / beam.maxLife;
      ctx.save();
      ctx.shadowColor = beam.color;
      const dx = beam.x2 - beam.x1;
      const dy = beam.y2 - beam.y1;
      const points = [{ x: beam.x1, y: beam.y1 }];
      for (let i = 1; i < 7; i += 1) {
        const t = i / 7;
        const jitter = Math.sin(beam.seed * 9.7 + i * 17.3) * 5 * alpha;
        points.push({
          x: beam.x1 + dx * t + (-dy / Math.max(1, Math.hypot(dx, dy))) * jitter,
          y: beam.y1 + dy * t + (dx / Math.max(1, Math.hypot(dx, dy))) * jitter,
        });
      }
      points.push({ x: beam.x2, y: beam.y2 });
      const strokeBeam = (width, color, opacity, blur) => {
        ctx.globalAlpha = alpha * opacity;
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.shadowBlur = blur;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        points.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
        ctx.stroke();
      };
      strokeBeam(9, beam.color, 0.14, 20);
      strokeBeam(4, beam.color, 0.75, 14);
      strokeBeam(1.2, "#ffffff", 1, 7);

      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#ffffff";
      for (let i = 1; i < points.length - 1; i += 2) {
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, 1.6, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    });
  }

  function drawParticles() {
    state.particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.strokeStyle = p.color;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 5;
      if (p.kind === "ring") {
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, TAU);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    });

    state.floatingText.forEach((text) => {
      ctx.save();
      ctx.globalAlpha = Math.min(1, text.life * 2);
      ctx.fillStyle = text.color;
      ctx.font = "500 10px 'DM Mono', monospace";
      ctx.textAlign = "center";
      ctx.shadowColor = "#05100c";
      ctx.shadowBlur = 4;
      ctx.fillText(text.text, text.x, text.y);
      ctx.restore();
    });
  }

  function drawPlacementGhost() {
    if (!state.selectedType || !state.hoverNode || state.hoverNode.tower) return;
    const data = TOWERS[state.selectedType];
    ctx.save();
    ctx.translate(state.hoverNode.x, state.hoverNode.y);
    ctx.globalAlpha = state.sap >= data.cost ? 0.3 : 0.12;
    ctx.strokeStyle = data.color;
    ctx.setLineDash([5, 7]);
    ctx.beginPath();
    ctx.arc(0, 0, data.range, 0, TAU);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = data.color;
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function drawPause() {
    if (!state.paused || !state.started || state.ended) return;
    ctx.save();
    ctx.fillStyle = "rgba(6, 4, 16, .58)";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#f0ecff";
    ctx.textAlign = "center";
    ctx.font = "700 28px 'M PLUS Rounded 1c', sans-serif";
    ctx.fillText("STANDBY MODE", W / 2, H / 2 - 5);
    ctx.fillStyle = "#9b94c4";
    ctx.font = "500 11px 'DM Mono', monospace";
    ctx.fillText("PRESS SPACE TO RESUME", W / 2, H / 2 + 18);
    ctx.restore();
  }

  function draw() {
    compactRender = canvas.getBoundingClientRect().width < 650;
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    if (state.screenShake > 0) {
      ctx.translate(random(-5, 5) * state.screenShake, random(-5, 5) * state.screenShake);
    }
    drawBackdrop();
    drawEntrancePortal();
    drawTrack();
    drawLinks();
    drawNodes();
    state.towers.forEach(drawTower);
    drawWarden();
    drawHeart();
    state.enemies.forEach(drawEnemy);
    drawProjectiles();
    drawParticles();
    drawPlacementGhost();
    ctx.restore();
    drawPause();
  }

  function loop(now) {
    const raw = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    const scaled = raw * state.speed;
    update(scaled);
    draw();
    requestAnimationFrame(loop);
  }

  function updateCards() {
    towerCards.forEach((card) => {
      const type = card.dataset.tower;
      const data = TOWERS[type];
      card.classList.toggle("selected", state.selectedType === type);
      card.disabled = state.sap < data.cost;
      card.setAttribute("aria-pressed", state.selectedType === type ? "true" : "false");
      card.setAttribute(
        "aria-label",
        `${data.name}, ${data.role}. Costs ${data.cost} ecto. ${data.trait}`,
      );
      card.title = `${data.role} — ${data.trait}`;
    });
  }

  function updateUI() {
    ui.sap.textContent = Math.floor(state.sap);
    ui.heart.textContent = state.hearts;
    ui.heart.style.color = state.hearts <= 6 ? "#ff6b8a" : "";

    if (!state.started) ui.waveLabel.textContent = state.bestWave ? `ALL CLEAR • BEST ${state.bestWave}` : "ALL CLEAR";
    else if (state.waveActive) {
      const remaining = state.spawnQueue.length + state.enemies.length;
      ui.waveLabel.textContent = `WAVE ${state.wave + 1} // ${remaining} LEFT`;
    } else {
      const untilBoss = WAVE_PIP_COUNT - (state.wave % WAVE_PIP_COUNT) || WAVE_PIP_COUNT;
      ui.waveLabel.textContent = `WAVE ${state.wave + 1} READY • BOSS IN ${untilBoss}`;
    }

    const chunk = state.wave % WAVE_PIP_COUNT;
    [...ui.wavePips.children].forEach((pip, index) => {
      pip.classList.toggle("complete", !state.waveActive && index < chunk);
      pip.classList.toggle("active", state.waveActive && index === chunk);
    });

    ui.waveBtn.disabled = !state.started || state.waveActive || state.ended;
    ui.waveButtonTop.textContent = state.wave === 0 ? "BEGIN" : state.waveActive ? "INCOMING" : "SUMMON";
    ui.waveButtonMain.textContent = `WAVE ${state.wave + 1}`;
    ui.speedLabel.textContent = `${state.speed}×`;
    ui.threatPreview.classList.toggle("hidden", state.waveActive || state.ended);
    ui.threatText.textContent = threatSummary(state.wave);

    const abilityReady = state.ability >= 100;
    ui.abilityBtn.disabled = !state.started || !abilityReady || state.ended;
    ui.abilityStatus.textContent = state.overgrow > 0 ? `${state.overgrow.toFixed(1)}s` : abilityReady ? "READY • R" : `${Math.floor(state.ability)}%`;
    ui.abilityCharge.style.transform = `scaleX(${state.ability / 100})`;
    ui.abilityBtn.style.borderColor = abilityReady ? "rgba(94, 240, 255, .65)" : "";
    ui.comboDisplay.classList.toggle("visible", state.combo > 1);
    ui.comboValue.textContent = state.combo;
    ui.comboMeter.style.transform = `scaleX(${Math.max(0, state.comboTimer / 1.45)})`;

    updateCards();
    if (state.selectedTower) updateSelectionPanel();
  }

  function updateSelectionPanel() {
    const tower = state.selectedTower;
    ui.selectionPanel.classList.toggle("visible", Boolean(tower));
    if (!tower) return;
    const data = TOWERS[tower.type];
    const stats = towerStats(tower);
    const upgrade = getUpgradeCost(tower);
    const sell = Math.round(tower.invested * 0.65);
    ui.selectedOrb.style.setProperty("--orb-color", data.color);
    ui.selectedType.textContent = `${data.label} • LVL ${tower.level}`;
    ui.selectedName.textContent = data.name;
    ui.selectedEvolution.textContent = `${["I", "II", "III", "IV", "V"][tower.level - 1]} • ${data.evolutions[tower.level - 1]}`;
    ui.selectedStats.textContent = `${data.role} • ${data.description}`;
    ui.selectedTrait.textContent = `${data.trait} Best for: ${data.best}.`;
    ui.statDamage.textContent = Math.round(stats.damage);
    ui.statRange.textContent = Math.round(stats.range);
    ui.statRate.textContent = `${stats.rate.toFixed(1)}/s`;
    ui.synergyValue.textContent = `+${tower.synergy * 12}%`;
    ui.synergyFill.style.width = `${(tower.synergy / 5) * 100}%`;
    ui.upgradeCost.textContent = tower.level >= 5 ? "MAX" : `${upgrade} ◈`;
    ui.upgradeBtn.disabled = tower.level >= 5;
    ui.upgradeBtn.classList.toggle("needs-sap", tower.level < 5 && state.sap < upgrade);
    ui.upgradeBtn.title =
      tower.level >= 5 ? "Maximum upgrade reached" : `Upgrade to ${data.evolutions[tower.level]}`;
    ui.sellValue.textContent = `${sell} ◈`;
  }

  function setPaused(paused, playFeedback = true) {
    state.paused = paused;
    ui.pauseBtn.innerHTML = state.paused
      ? '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 4 10 6-10 6V4z"/></svg>'
      : '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 4h3v12H5zm7 0h3v12h-3z"/></svg>';
    ui.pauseBtn.setAttribute("aria-label", state.paused ? "Resume game" : "Pause game");
    if (playFeedback) tone(state.paused ? 180 : 280, 0.06, "sine", 0.015, state.paused ? -30 : 60);
  }

  function togglePause() {
    if (!state.started || state.ended) return;
    setPaused(!state.paused);
  }

  function cycleSpeed() {
    const speeds = [1, 2, 3];
    state.speed = speeds[(speeds.indexOf(state.speed) + 1) % speeds.length];
    updateUI();
  }

  function selectType(type) {
    if (!state.started || state.sap < TOWERS[type].cost || state.ended) return;
    state.selectedType = state.selectedType === type ? null : type;
    state.selectedTower = null;
    updateSelectionPanel();
    updateCards();
    tone(330 + Object.keys(TOWERS).indexOf(type) * 70, 0.05, "sine", 0.012, 35);
  }

  function getCanvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    const source = event.touches?.[0] || event.changedTouches?.[0] || event;
    return {
      x: ((source.clientX - rect.left) / rect.width) * W,
      y: ((source.clientY - rect.top) / rect.height) * H,
    };
  }

  function findNodeAt(point) {
    const touchScale = canvas.getBoundingClientRect().width < 650 ? 1.9 : 1;
    return nodes.find((node) => distance(node, point) < 27 * touchScale) || null;
  }

  function findTowerAt(point) {
    const touchScale = canvas.getBoundingClientRect().width < 650 ? 1.8 : 1;
    return state.towers.find((tower) => distance(tower, point) < 25 * touchScale) || null;
  }

  function onCanvasMove(event) {
    const point = getCanvasPoint(event);
    state.mouse = point;
    state.hoverNode = findNodeAt(point);
    canvas.style.cursor = state.hoverNode || findTowerAt(point) ? "pointer" : state.selectedType ? "crosshair" : "default";
  }

  function onCanvasClick(event) {
    if (!state.started || state.paused || state.ended) return;
    createAudio();
    const point = getCanvasPoint(event);
    const clickedTower = findTowerAt(point);
    if (clickedTower) {
      state.selectedTower = clickedTower;
      state.selectedType = null;
      updateSelectionPanel();
      updateCards();
      tone(420, 0.045, "sine", 0.01, 30);
      return;
    }
    const node = findNodeAt(point);
    if (node?.tower) {
      state.selectedTower = node.tower;
      state.selectedType = null;
      updateSelectionPanel();
      updateCards();
    } else if (node && state.selectedType) {
      const data = TOWERS[state.selectedType];
      if (state.sap >= data.cost) createTower(node, state.selectedType);
      else toast("THE SQUAD NEEDS MORE ECTO");
    } else {
      state.selectedTower = null;
      updateSelectionPanel();
    }
  }

  function openHelp() {
    ui.helpModal.classList.add("visible");
    if (state.started && !state.paused) {
      ui.helpModal.dataset.pausedGame = "true";
      setPaused(true, false);
    }
  }

  function closeHelp() {
    ui.helpModal.classList.remove("visible");
    if (ui.helpModal.dataset.pausedGame === "true") {
      setPaused(false, false);
      delete ui.helpModal.dataset.pausedGame;
    }
  }

  function openCodex() {
    ui.codexModal.classList.add("visible");
    if (state.started && !state.paused) {
      ui.codexModal.dataset.pausedGame = "true";
      setPaused(true, false);
    }
  }

  function closeCodex() {
    ui.codexModal.classList.remove("visible");
    if (ui.codexModal.dataset.pausedGame === "true") {
      setPaused(false, false);
      delete ui.codexModal.dataset.pausedGame;
    }
  }

  function syncSettingsUI() {
    ui.musicVolume.value = settings.music;
    ui.musicValue.textContent = `${settings.music}%`;
    ui.sfxVolume.value = settings.sfx;
    ui.sfxValue.textContent = `${settings.sfx}%`;
    ui.reducedEffects.checked = settings.reducedEffects;
    ui.soundBtn.classList.toggle("muted", !soundOn);
    ui.soundBtn.style.opacity = soundOn ? "1" : "0.42";
    ui.soundBtn.setAttribute("aria-label", soundOn ? "Mute all audio" : "Enable all audio");
  }

  function openSettings() {
    createAudio();
    syncSettingsUI();
    ui.settingsModal.classList.add("visible");
    if (state.started && !state.paused) {
      ui.settingsModal.dataset.pausedGame = "true";
      setPaused(true, false);
    }
  }

  function closeSettings() {
    ui.settingsModal.classList.remove("visible");
    if (ui.settingsModal.dataset.pausedGame === "true") {
      setPaused(false, false);
      delete ui.settingsModal.dataset.pausedGame;
    }
  }

  function endGame() {
    if (state.ended) return;
    state.ended = true;
    const wavesReached = Math.max(state.wavesCleared, state.wave + (state.waveActive ? 1 : 0));
    ui.endEyebrow.textContent = "THE WARD FALLS";
    ui.endTitle.textContent = "The ghosts break through.";
    ui.endCopy.textContent = `You held ${wavesReached} wave${wavesReached === 1 ? "" : "s"}. Build a stronger squad and push past wave ${state.bestWave}.`;
    ui.endWaves.textContent = wavesReached;
    ui.endKills.textContent = state.kills;
    ui.endHarmony.textContent = state.bestWave;
    ui.endCombo.textContent = `${state.bestCombo}×`;
    ui.endSigil.textContent = "◇";
    ui.endSigil.style.color = "#ff6b8a";
    ui.endModal.classList.add("visible");
    tone(110, 0.8, "sine", 0.04, -60);
  }

  function resetGame() {
    state.sap = 280;
    state.hearts = 20;
    state.wave = 0;
    state.wavesCleared = 0;
    state.currentComposition = null;
    state.waveActive = false;
    state.spawnQueue = [];
    state.spawnTimer = 0;
    state.enemies = [];
    state.towers = [];
    state.projectiles = [];
    state.particles = [];
    state.beams = [];
    state.floatingText = [];
    state.selectedType = null;
    state.selectedTower = null;
    state.ability = 100;
    state.overgrow = 0;
    state.kills = 0;
    state.peakHarmony = 0;
    state.combo = 0;
    state.comboTimer = 0;
    state.bestCombo = 0;
    state.warden = { x: 1005, y: 230, angle: 0, cooldown: 0.8, pulse: 0 };
    state.ended = false;
    setPaused(false, false);
    state.elapsed = 0;
    nodes.forEach((node) => {
      node.tower = null;
    });
    ui.endModal.classList.remove("visible");
    updateSelectionPanel();
    updateUI();
    toast("A NEW HUNT BEGINS");
  }

  towerCards.forEach((card) => {
    card.addEventListener("click", () => selectType(card.dataset.tower));
  });
  canvas.addEventListener("mousemove", onCanvasMove);
  canvas.addEventListener("mouseleave", () => {
    state.hoverNode = null;
  });
  canvas.addEventListener("click", onCanvasClick);
  canvas.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length === 1) onCanvasMove(event);
    },
    { passive: true },
  );
  canvas.addEventListener(
    "touchend",
    (event) => {
      if (event.touches.length > 0) return;
      event.preventDefault();
      onCanvasClick(event);
    },
    { passive: false },
  );

  function startGame() {
    createAudio();
    state.started = true;
    ui.introModal.classList.remove("visible");
    startMusic();
    chord([220, 330, 440]);
    toast("CHOOSE GEAR • DEPLOY ON A GLOWING NODE");
    window.setTimeout(() => toast("♫ ADAPTIVE SCORE ONLINE • USE ⚙ TO MIX"), 900);
    updateUI();
  }

  ui.startBtn.addEventListener("click", startGame);
  ui.waveBtn.addEventListener("click", startWave);
  ui.pauseBtn.addEventListener("click", togglePause);
  ui.speedBtn.addEventListener("click", cycleSpeed);
  ui.abilityBtn.addEventListener("click", activateAbility);
  ui.upgradeBtn.addEventListener("click", upgradeSelected);
  ui.sellBtn.addEventListener("click", sellSelected);
  ui.panelClose.addEventListener("click", () => {
    state.selectedTower = null;
    updateSelectionPanel();
  });
  ui.helpBtn.addEventListener("click", openHelp);
  ui.helpClose.addEventListener("click", closeHelp);
  ui.helpDone.addEventListener("click", closeHelp);
  ui.codexBtn.addEventListener("click", openCodex);
  ui.codexClose.addEventListener("click", closeCodex);
  document.querySelectorAll("[data-codex-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      const section = tab.dataset.codexTab;
      document.querySelectorAll("[data-codex-tab]").forEach((candidate) => {
        const active = candidate === tab;
        candidate.classList.toggle("active", active);
        candidate.setAttribute("aria-selected", active ? "true" : "false");
      });
      document.querySelectorAll("[data-codex-panel]").forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.codexPanel === section);
      });
      tone(section === "arsenal" ? 410 : 270, 0.05, "sine", 0.012, 35);
    });
  });
  ui.settingsBtn.addEventListener("click", openSettings);
  ui.settingsClose.addEventListener("click", closeSettings);
  ui.musicVolume.addEventListener("input", () => {
    settings.music = Number(ui.musicVolume.value);
    ui.musicValue.textContent = `${settings.music}%`;
    applyAudioSettings();
    saveSettings();
  });
  ui.sfxVolume.addEventListener("input", () => {
    settings.sfx = Number(ui.sfxVolume.value);
    ui.sfxValue.textContent = `${settings.sfx}%`;
    applyAudioSettings();
    saveSettings();
  });
  ui.reducedEffects.addEventListener("change", () => {
    settings.reducedEffects = ui.reducedEffects.checked;
    if (settings.reducedEffects) state.screenShake = 0;
    saveSettings();
  });
  ui.audioTestBtn.addEventListener("click", () => {
    if (!soundOn) soundOn = true;
    createAudio();
    applyAudioSettings();
    syncSettingsUI();
    chord([220, 330, 440, 554]);
    window.setTimeout(() => tone(720, 0.14, "triangle", 0.025, -180), 230);
  });
  ui.fullscreenBtn.addEventListener("click", async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      toast("FULLSCREEN IS NOT AVAILABLE ON THIS BROWSER");
    }
  });
  document.addEventListener("fullscreenchange", () => {
    ui.fullscreenBtn.textContent = document.fullscreenElement ? "EXIT FULLSCREEN" : "ENTER FULLSCREEN";
  });
  ui.restartBtn.addEventListener("click", resetGame);
  ui.soundBtn.addEventListener("click", () => {
    createAudio();
    soundOn = !soundOn;
    applyAudioSettings();
    syncSettingsUI();
    if (soundOn) tone(440, 0.08, "sine", 0.02, 80);
  });

  window.addEventListener("keydown", (event) => {
    const modalOpen = [ui.introModal, ui.helpModal, ui.codexModal, ui.settingsModal, ui.endModal].some((modal) =>
      modal.classList.contains("visible"),
    );
    const codexToggle = ui.codexModal.classList.contains("visible") && event.key.toLowerCase() === "c";
    if (modalOpen && event.key !== "Escape" && !codexToggle) return;
    if (event.key >= "1" && event.key <= "6") {
      selectType(Object.keys(TOWERS)[Number(event.key) - 1]);
    } else if (event.key === "Escape" && ui.settingsModal.classList.contains("visible")) {
      closeSettings();
    } else if (event.key === "Escape" && ui.helpModal.classList.contains("visible")) {
      closeHelp();
    } else if (event.key === "Escape" && ui.codexModal.classList.contains("visible")) {
      closeCodex();
    } else if (event.key === "Escape") {
      state.selectedType = null;
      state.selectedTower = null;
      updateCards();
      updateSelectionPanel();
    } else if (event.code === "Space") {
      event.preventDefault();
      togglePause();
    } else if (event.key.toLowerCase() === "f") {
      cycleSpeed();
    } else if (event.key.toLowerCase() === "r" && state.ability >= 100) {
      activateAbility();
    } else if (event.key.toLowerCase() === "c") {
      if (ui.codexModal.classList.contains("visible")) closeCodex();
      else openCodex();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && state.started && !state.ended) setPaused(true, false);
  });
  document.addEventListener(
    "pointerdown",
    () => {
      if (audio?.state === "suspended") audio.resume().catch(() => {});
    },
    { passive: true },
  );

  const refreshViewport = () => {
    state.hoverNode = null;
    lastTime = performance.now();
    draw();
  };
  window.addEventListener("resize", refreshViewport, { passive: true });
  window.visualViewport?.addEventListener("resize", refreshViewport, { passive: true });
  screen.orientation?.addEventListener("change", () => window.setTimeout(refreshViewport, 120));

  try {
    createPips();
    renderCodex();
    syncSettingsUI();
    saveSettings();
    updateUI();
    requestAnimationFrame(loop);
  } catch (error) {
    console.error("Specter Squad failed to start:", error);
    const banner = document.createElement("div");
    banner.textContent = "Game failed to load. Refresh the page.";
    banner.style.cssText =
      "position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:24px;background:#0a0618;color:#ff6b8a;font:600 16px sans-serif;text-align:center;";
    document.body.append(banner);
  }
})();
