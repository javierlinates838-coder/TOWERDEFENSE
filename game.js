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
    selectedStats: $("selectedStats"),
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
    endSigil: $("endSigil"),
  };

  const towerCards = [...document.querySelectorAll(".tower-card")];

  const TOWERS = {
    sun: {
      name: "Sunspire",
      label: "SOLAR FLORA",
      color: "#ffc663",
      cost: 65,
      range: 145,
      damage: 12,
      rate: 2.4,
      projectile: 390,
      description: "Rapid light",
    },
    dew: {
      name: "Dewbell",
      label: "TIDAL FLORA",
      color: "#75d9e6",
      cost: 85,
      range: 132,
      damage: 9,
      rate: 1.35,
      projectile: 300,
      slow: 0.56,
      splash: 42,
      description: "Slow splash",
    },
    thorn: {
      name: "Thornmaw",
      label: "FERAL FLORA",
      color: "#ef738f",
      cost: 110,
      range: 172,
      damage: 42,
      rate: 0.67,
      projectile: 470,
      description: "Heavy burst",
    },
    prism: {
      name: "Prismbloom",
      label: "ARC FLORA",
      color: "#b697ff",
      cost: 135,
      range: 152,
      damage: 20,
      rate: 0.92,
      projectile: 0,
      chain: 3,
      description: "Chain spark",
    },
  };

  const ENEMIES = {
    mite: {
      name: "Rift mite",
      color: "#ffaf69",
      hp: 42,
      speed: 78,
      radius: 9,
      bounty: 7,
      damage: 1,
    },
    wisp: {
      name: "Hollow wisp",
      color: "#8bdcc7",
      hp: 82,
      speed: 57,
      radius: 11,
      bounty: 10,
      damage: 1,
    },
    brute: {
      name: "Bark brute",
      color: "#e87974",
      hp: 225,
      speed: 35,
      radius: 16,
      bounty: 19,
      damage: 3,
      armor: 0.22,
    },
    spore: {
      name: "Sporeling",
      color: "#d2e781",
      hp: 120,
      speed: 49,
      radius: 13,
      bounty: 15,
      damage: 2,
      regen: 2.2,
    },
    sovereign: {
      name: "Rift sovereign",
      color: "#f38cff",
      hp: 1250,
      speed: 26,
      radius: 25,
      bounty: 120,
      damage: 8,
      armor: 0.16,
    },
  };

  const WAVES = [
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
  ];

  const ENEMY_PLURALS = {
    mite: "RIFT MITES",
    wisp: "HOLLOW WISPS",
    brute: "BARK BRUTES",
    spore: "SPORELINGS",
    sovereign: "RIFT SOVEREIGN",
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
    { x: 68, y: 210 },
    { x: 90, y: 458 },
    { x: 224, y: 116 },
    { x: 245, y: 420 },
    { x: 360, y: 145 },
    { x: 407, y: 492 },
    { x: 500, y: 174 },
    { x: 560, y: 456 },
    { x: 649, y: 110 },
    { x: 678, y: 398 },
    { x: 778, y: 166 },
    { x: 814, y: 475 },
    { x: 899, y: 140 },
    { x: 934, y: 440 },
    { x: 1022, y: 178 },
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
  const savedSettings = (() => {
    try {
      return JSON.parse(localStorage.getItem("rootbound-settings") || "{}");
    } catch {
      return {};
    }
  })();
  const settings = {
    music: Number.isFinite(savedSettings.music) ? savedSettings.music : 38,
    sfx: Number.isFinite(savedSettings.sfx) ? savedSettings.sfx : 62,
    reducedEffects: Boolean(savedSettings.reducedEffects),
  };

  const state = {
    started: false,
    paused: false,
    speed: 1,
    sap: 240,
    hearts: 20,
    wave: 0,
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
    if (audio?.state === "suspended") audio.resume();
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
    gain.gain.setValueAtTime(volume, audio.currentTime);
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
    gain.gain.setValueAtTime(volume, audio.currentTime);
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
      localStorage.setItem("rootbound-settings", JSON.stringify(settings));
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
    filter.frequency.setValueAtTime(state.waveActive ? 1250 : 760, when);
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
    const roots = [110, 130.81, 98, 146.83];
    const melodies = [293.66, 349.23, 440, 392, 329.63, 440, 523.25, 392];
    const root = roots[Math.floor(musicStep / 8) % roots.length];
    if (musicStep % 8 === 0) {
      musicNote(root, 5.3, 0.035, "sine");
      musicNote(root * 1.2, 4.8, 0.021, "sine", 0.05);
      musicNote(root * 1.5, 4.6, 0.017, "triangle", 0.1);
    }
    if (musicStep % 2 === 0) {
      const note = melodies[(musicStep / 2 + state.wave * 2) % melodies.length];
      musicNote(note, state.waveActive ? 0.62 : 1.25, state.waveActive ? 0.032 : 0.018, "triangle");
    }
    if (state.waveActive) {
      musicNote(root / 2, 0.38, 0.045, "sine");
      if (musicStep % 4 === 2) musicNote(root * 2, 0.2, 0.018, "square");
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

  function createPips() {
    ui.wavePips.innerHTML = "";
    WAVES.forEach(() => {
      const pip = document.createElement("i");
      ui.wavePips.append(pip);
    });
  }

  function buildWave(index) {
    const composition = WAVES[index];
    const queue = [];
    Object.entries(composition).forEach(([type, count]) => {
      for (let i = 0; i < count; i += 1) queue.push(type);
    });
    // Deterministic interleaving keeps hard enemies legible and avoids luck-driven spikes.
    queue.sort((a, b) => {
      const order = { mite: 0, wisp: 1, spore: 2, brute: 3, sovereign: 4 };
      const hashA = (queue.indexOf(a) * 7 + order[a] * 11) % 17;
      const hashB = (queue.indexOf(b) * 7 + order[b] * 11) % 17;
      return hashA - hashB;
    });
    return queue;
  }

  function startWave() {
    if (!state.started || state.waveActive || state.ended || state.wave >= WAVES.length) return;
    state.waveActive = true;
    state.spawnQueue = buildWave(state.wave);
    state.spawnTimer = 0;
    state.selectedType = null;
    updateCards();
    updateUI();
    announceWave();
    toast(state.wave === 9 ? "⚠ RIFT SOVEREIGN APPROACHES" : `WAVE ${state.wave + 1} • ROOTS, AWAKEN`);
    tone(196, 0.22, "triangle", 0.035, 96);
  }

  function waveThreatCount(index) {
    if (index >= WAVES.length) return 0;
    return Object.values(WAVES[index]).reduce((total, count) => total + count, 0);
  }

  function threatSummary(index) {
    if (index >= WAVES.length) return "RIFT SEALED";
    return Object.entries(WAVES[index])
      .map(([type, count]) => `${count} ${ENEMY_PLURALS[type]}`)
      .join("  •  ");
  }

  function announceWave() {
    const isBoss = state.wave === WAVES.length - 1;
    ui.announcementTop.textContent = isBoss ? "SOVEREIGN SIGNAL DETECTED" : "ROOTS, AWAKEN";
    ui.announcementMain.textContent = isBoss ? "FINAL BLOOM" : `WAVE ${state.wave + 1}`;
    ui.announcementThreat.textContent = `${waveThreatCount(state.wave)} HOSTILES DETECTED`;
    ui.waveAnnouncement.classList.add("visible");
    window.setTimeout(() => ui.waveAnnouncement.classList.remove("visible"), isBoss ? 2400 : 1700);
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
    tone(type === "sun" ? 520 : type === "dew" ? 430 : type === "thorn" ? 260 : 610, 0.18, "sine", 0.035, 120);
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
    const levelScale = 1 + (tower.level - 1) * 0.45;
    return {
      range: base.range + (tower.level - 1) * 8,
      damage: base.damage * levelScale,
      rate: base.rate * (1 + tower.synergy * 0.12) * (state.overgrow > 0 ? 1.75 : 1),
      splash: base.splash || 0,
      slow: base.slow || 0,
      projectile: base.projectile,
      chain: base.chain || 0,
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
      radius: tower.type === "thorn" ? 5 : 3.2,
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
      floating(enemy.x, enemy.y - 32, `ROOTCHAIN ${state.combo}×  +${chainBonus}`, "#ffc663");
      tone(440 + state.combo * 8, 0.12, "triangle", 0.025, 120);
    }
    state.ability = Math.min(100, state.ability + (enemy.type === "sovereign" ? 25 : 4.2));
    burst(enemy.x, enemy.y, ENEMIES[enemy.type].color, enemy.type === "sovereign" ? 42 : 10, enemy.type === "sovereign" ? 170 : 65);
    floating(enemy.x, enemy.y - 15, `+${enemy.bounty}`, "#c9f76f");
    tone(enemy.type === "sovereign" ? 110 : 290, enemy.type === "sovereign" ? 0.4 : 0.04, "sine", 0.012, -40);
    if (enemy.type === "sovereign") {
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
    if (projectile.splash) {
      state.enemies.forEach((candidate) => {
        if (!candidate.alive || distance(projectile, candidate) > projectile.splash) return;
        damageEnemy(candidate, projectile.damage, projectile.color);
        if (projectile.slow) {
          candidate.slow = projectile.slow;
          candidate.slowTimer = 1.8;
        }
      });
      ring(projectile.x, projectile.y, projectile.color, projectile.splash);
    } else {
      damageEnemy(enemy, projectile.damage, projectile.color);
    }
    burst(projectile.x, projectile.y, projectile.color, projectile.type === "thorn" ? 8 : 4, 55);
    if (projectile.type === "sun") ring(projectile.x, projectile.y, "#fff1a8", 20);
    if (projectile.type === "thorn") {
      ring(projectile.x, projectile.y, "#ef738f", 31);
      state.screenShake = settings.reducedEffects ? 0 : Math.max(state.screenShake, 0.12);
    }
    if (projectile.type === "wyrm") ring(projectile.x, projectile.y, "#b9ff78", 36);
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
        state.spawnTimer = state.wave === 9 ? 0.78 : Math.max(0.38, 0.8 - state.wave * 0.035);
      }
    }

    state.enemies.forEach((enemy) => {
      if (!enemy.alive) return;
      if (enemy.slowTimer > 0) {
        enemy.slowTimer -= dt;
      } else {
        enemy.slow = 1;
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
    ring(1061, 300, "#ff7d71", 65);
    burst(1061, 300, "#ff7d71", 16, 110);
    floating(1035, 253, `−${enemy.damage} HEART`, "#ff7d71");
    tone(85, 0.28, "sawtooth", 0.035, -35);
    noiseBurst(0.22, 0.035, 180);
    if (state.hearts <= 0) endGame(false);
  }

  function completeWave() {
    state.waveActive = false;
    const bonus = 25 + state.wave * 6;
    state.sap += bonus;
    state.wave += 1;
    floating(1040, 255, `WAVE CLEAR +${bonus}`, "#c9f76f");
    chord([330, 415, 494]);
    if (state.wave >= WAVES.length) {
      window.setTimeout(() => endGame(true), 700);
    } else {
      toast(`WAVE ${state.wave} HELD • +${bonus} SAP`);
    }
    updateUI();
  }

  function activateAbility() {
    if (!state.started || state.ability < 100 || state.ended) return;
    state.ability = 0;
    state.overgrow = 8;
    state.towers.forEach((tower) => {
      tower.cooldown = Math.min(tower.cooldown, 0.08);
      burst(tower.x, tower.y, "#7ce2bb", 9, 75);
    });
    ring(1061, 300, "#7ce2bb", 450);
    chord([220, 330, 440, 659]);
    vibrate([20, 25, 45]);
    toast("OVERGROW • NETWORK SPEED +75%");
    updateUI();
  }

  function upgradeSelected() {
    const tower = state.selectedTower;
    if (!tower || tower.level >= 3) return;
    const cost = getUpgradeCost(tower);
    if (state.sap < cost) {
      toast("THE GARDEN NEEDS MORE SAP");
      tone(120, 0.08, "square", 0.015, -20);
      return;
    }
    state.sap -= cost;
    tower.invested += cost;
    tower.level += 1;
    burst(tower.x, tower.y, TOWERS[tower.type].color, 24, 125);
    ring(tower.x, tower.y, TOWERS[tower.type].color, 70);
    floating(tower.x, tower.y - 35, `EVOLVED • ${["", "I", "II", "III"][tower.level]}`, TOWERS[tower.type].color);
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
    floating(tower.x, tower.y - 25, `+${value} SAP`, "#c9f76f");
    tone(260, 0.12, "sine", 0.02, -100);
    state.selectedTower = null;
    recalculateLinks();
    updateSelectionPanel();
    updateUI();
  }

  function getUpgradeCost(tower) {
    return Math.round(TOWERS[tower.type].cost * (0.85 + tower.level * 0.45));
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
    gradient.addColorStop(0, "#0a1914");
    gradient.addColorStop(0.48, "#10231b");
    gradient.addColorStop(1, "#091610");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    const aurora = ctx.createLinearGradient(130, 0, 900, H);
    aurora.addColorStop(0, "rgba(86, 205, 148, 0)");
    aurora.addColorStop(0.38, `rgba(86, 205, 148, ${state.overgrow > 0 ? 0.1 : 0.035})`);
    aurora.addColorStop(0.7, "rgba(158, 111, 226, 0.035)");
    aurora.addColorStop(1, "rgba(158, 111, 226, 0)");
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
    glow.addColorStop(0, "rgba(186, 240, 128, .11)");
    glow.addColorStop(1, "rgba(186, 240, 128, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalAlpha = 0.5;
    mossPatches.forEach((patch) => {
      const colors = ["#18372a", "#244331", "#152d27"];
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
    ctx.fillStyle = "#c8f4aa";
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
    ctx.strokeStyle = "rgba(124, 178, 143, .055)";
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
    ctx.strokeStyle = "rgba(95, 152, 115, .16)";
    ctx.fillStyle = "rgba(40, 88, 61, .18)";
    positions.forEach(([x, y, phase]) => {
      for (let j = 0; j < 4; j += 1) {
        const angle = phase + j * 1.35;
        const length = 26 + j * 7;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(
          x + Math.cos(angle + 0.3) * length * 0.5,
          y + Math.sin(angle + 0.3) * length * 0.5,
          x + Math.cos(angle) * length,
          y + Math.sin(angle) * length,
        );
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(
          x + Math.cos(angle) * length,
          y + Math.sin(angle) * length,
          5,
          11,
          angle,
          0,
          TAU,
        );
        ctx.fill();
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
    ctx.strokeStyle = "rgba(2, 9, 8, .65)";
    ctx.stroke();

    roundedPath(path);
    ctx.lineWidth = 56;
    ctx.strokeStyle = "#17271f";
    ctx.stroke();

    roundedPath(path);
    ctx.lineWidth = 48;
    const pathGradient = ctx.createLinearGradient(0, 0, W, 0);
    pathGradient.addColorStop(0, "#1d3026");
    pathGradient.addColorStop(0.5, "#23382b");
    pathGradient.addColorStop(1, "#1d3026");
    ctx.strokeStyle = pathGradient;
    ctx.stroke();

    roundedPath(path);
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = "rgba(200, 238, 176, .1)";
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
      ctx.strokeStyle = "rgba(165, 202, 169, .06)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-17, 0);
      ctx.quadraticCurveTo(0, 4, 17, 0);
      ctx.stroke();
      ctx.restore();
    }

    ctx.save();
    ctx.strokeStyle = state.waveActive ? "rgba(201, 247, 111, .24)" : "rgba(201, 247, 111, .11)";
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
        ctx.shadowColor = "#7ce2bb";
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
          ctx.fillStyle = "#a9f3cd";
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
      ctx.strokeStyle = hovered ? TOWERS[state.selectedType]?.color || "#c9f76f" : `rgba(156, 213, 166, ${canPlant ? 0.34 : 0.16})`;
      ctx.fillStyle = hovered ? "rgba(201, 247, 111, .08)" : "rgba(11, 27, 21, .55)";
      ctx.lineWidth = hovered ? 2 : 1;
      ctx.beginPath();
      ctx.arc(0, 0, hovered ? 19 : 15 + pulse, 0, TAU);
      ctx.fill();
      ctx.stroke();
      ctx.rotate(Math.PI / 4);
      ctx.strokeStyle = `rgba(168, 218, 173, ${hovered ? 0.5 : 0.16})`;
      ctx.strokeRect(-7, -7, 14, 14);
      ctx.fillStyle = canPlant ? TOWERS[state.selectedType].color : "#5d796a";
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

    const modelScale = compactRender ? 1.38 : 1;
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

    ctx.strokeStyle = `${data.color}3d`;
    ctx.lineWidth = 1.4;
    for (let i = 0; i < 6; i += 1) {
      const angle = (i / 6) * TAU + tower.animOffset;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 12, Math.sin(angle) * 12);
      ctx.quadraticCurveTo(Math.cos(angle + 0.25) * 23, Math.sin(angle + 0.25) * 23, Math.cos(angle) * 31, Math.sin(angle) * 31);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(3, 11, 9, .94)";
    ctx.strokeStyle = selected ? data.color : "rgba(164, 205, 174, .28)";
    ctx.lineWidth = selected ? 1.8 : 1;
    ctx.beginPath();
    for (let i = 0; i < 12; i += 1) {
      const angle = (i / 12) * TAU - Math.PI / 2;
      const radius = i % 2 ? 20 : 23;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = `${data.color}52`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, TAU);
    ctx.stroke();

    const reloadProgress = Math.max(0, Math.min(1, 1 - Math.max(0, tower.cooldown) * stats.rate));
    ctx.strokeStyle = data.color;
    ctx.globalAlpha = 0.48;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, 0, 20, -Math.PI / 2, -Math.PI / 2 + reloadProgress * TAU);
    ctx.stroke();
    ctx.globalAlpha = 1;

    for (let i = 0; i < 6; i += 1) {
      const angle = (i / 6) * TAU + state.elapsed * 0.08;
      ctx.save();
      ctx.translate(Math.cos(angle) * 18.5, Math.sin(angle) * 18.5);
      ctx.rotate(angle + Math.PI / 4);
      ctx.fillStyle = i < tower.level * 2 ? data.color : "rgba(129, 157, 139, .18)";
      ctx.globalAlpha = i < tower.level * 2 ? 0.7 : 1;
      ctx.fillRect(-1.5, -1.5, 3, 3);
      ctx.restore();
    }

    ctx.rotate(tower.angle + Math.PI / 2);
    if (tower.type === "sun") drawSunTower(data, tower);
    if (tower.type === "dew") drawDewTower(data, tower);
    if (tower.type === "thorn") drawThornTower(data, tower);
    if (tower.type === "prism") drawPrismTower(data, tower);
    ctx.restore();

    if (tower.synergy > 0) {
      ctx.save();
      ctx.translate(tower.x, tower.y);
      const orbitRadius = compactRender ? 34 : 27;
      for (let i = 0; i < tower.synergy; i += 1) {
        const angle = state.elapsed * 0.8 + (i / tower.synergy) * TAU + tower.animOffset;
        ctx.fillStyle = "#aaf2cc";
        ctx.globalAlpha = 0.82;
        ctx.shadowColor = "#aaf2cc";
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
    ctx.fillText(["", "I", "II", "III"][tower.level], tower.x, tower.y + (compactRender ? 43 : 34));
    ctx.restore();
  }

  function drawSunTower(data, tower) {
    const recoil = tower.recoil * 4.5;
    const spin = state.elapsed * (1.2 + tower.level * 0.12) + tower.animOffset;
    ctx.translate(0, recoil);

    const stem = ctx.createLinearGradient(-7, 8, 7, -18);
    stem.addColorStop(0, "#5d6f2b");
    stem.addColorStop(0.5, "#a8b944");
    stem.addColorStop(1, "#ffe382");
    ctx.strokeStyle = stem;
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, 9);
    ctx.quadraticCurveTo(-3, -3, 0, -13);
    ctx.stroke();

    ctx.save();
    ctx.translate(0, -14);
    ctx.rotate(spin);
    ctx.fillStyle = "#d9892a";
    ctx.strokeStyle = "#ffe18a";
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 8; i += 1) {
      ctx.save();
      ctx.rotate((i / 8) * TAU);
      ctx.beginPath();
      ctx.moveTo(-3, -2);
      ctx.quadraticCurveTo(-7, -15, 0, -20 - tower.level);
      ctx.quadraticCurveTo(7, -15, 3, -2);
      ctx.closePath();
      ctx.fill();
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

  function drawEnemy(enemy) {
    const data = ENEMIES[enemy.type];
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    const enemyScale = compactRender ? 1.48 : 1;
    ctx.scale(enemyScale, enemyScale);
    ctx.rotate(enemy.angle);
    ctx.globalAlpha = enemy.hitFlash > 0 ? 0.5 : 1;
    ctx.shadowColor = data.color;
    ctx.shadowBlur = enemy.type === "sovereign" ? 18 : 5;

    if (enemy.type === "mite") {
      ctx.fillStyle = data.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, 10, 6.5, 0, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = `${data.color}aa`;
      ctx.lineWidth = 1.5;
      for (const y of [-5, 0, 5]) {
        ctx.beginPath();
        ctx.moveTo(-2, y * 0.55);
        ctx.lineTo(-8, y);
        ctx.stroke();
      }
    } else if (enemy.type === "wisp") {
      ctx.fillStyle = `${data.color}cc`;
      ctx.beginPath();
      ctx.moveTo(11, 0);
      ctx.quadraticCurveTo(-4, -13, -10, 0);
      ctx.quadraticCurveTo(-4, 13, 11, 0);
      ctx.fill();
      ctx.fillStyle = "#d5fff2";
      ctx.beginPath();
      ctx.arc(3, 0, 2.5, 0, TAU);
      ctx.fill();
    } else if (enemy.type === "brute") {
      ctx.fillStyle = "#572f2d";
      ctx.strokeStyle = data.color;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      for (let i = 0; i < 8; i += 1) {
        const angle = (i / 8) * TAU;
        const r = i % 2 ? 13 : 17;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (!i) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#ffb0a6";
      ctx.fillRect(4, -3, 4, 2);
    } else if (enemy.type === "spore") {
      ctx.fillStyle = `${data.color}d9`;
      ctx.beginPath();
      ctx.arc(0, -3, 10, Math.PI, 0);
      ctx.lineTo(7, 6);
      ctx.quadraticCurveTo(0, 10, -7, 6);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#61703b";
      for (let i = 0; i < 4; i += 1) {
        ctx.beginPath();
        ctx.arc(-5 + i * 3.5, -5 + (i % 2) * 2, 1.3, 0, TAU);
        ctx.fill();
      }
    } else {
      ctx.rotate(state.elapsed * 0.25);
      ctx.fillStyle = "#4c2855";
      ctx.strokeStyle = data.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i < 12; i += 1) {
        const angle = (i / 12) * TAU;
        const r = i % 2 ? 20 : 29;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (!i) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#ffd3ff";
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, TAU);
      ctx.fill();
    }
    ctx.restore();

    const barWidth = (enemy.type === "sovereign" ? 54 : enemy.radius * 2.2) * (compactRender ? 1.32 : 1);
    const y = enemy.y - enemy.radius * enemyScale - (compactRender ? 12 : 10);
    ctx.fillStyle = "rgba(1, 7, 5, .75)";
    ctx.fillRect(enemy.x - barWidth / 2, y, barWidth, 3);
    ctx.fillStyle = enemy.slow < 1 ? "#75d9e6" : data.color;
    ctx.fillRect(enemy.x - barWidth / 2, y, barWidth * Math.max(0, enemy.hp / enemy.maxHp), 3);

    if (enemy.armor) {
      ctx.fillStyle = "rgba(220, 235, 226, .55)";
      ctx.font = "8px 'DM Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText("◆", enemy.x, y - 3);
    }
  }

  function drawWarden() {
    const warden = state.warden;
    const flap = Math.sin(state.elapsed * 9) * 5;
    ctx.save();
    ctx.translate(warden.x, warden.y);
    const wardenScale = compactRender ? 1.32 : 1;
    ctx.scale(wardenScale, wardenScale);

    const aura = ctx.createRadialGradient(0, 0, 2, 0, 0, 45);
    aura.addColorStop(0, `rgba(185, 255, 120, ${0.16 + warden.pulse * 0.14})`);
    aura.addColorStop(1, "rgba(185, 255, 120, 0)");
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, 0, 45, 0, TAU);
    ctx.fill();

    ctx.rotate(warden.angle);
    ctx.strokeStyle = "rgba(124, 226, 187, .68)";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-12, 1);
    ctx.quadraticCurveTo(-26, 7 + flap * 0.25, -35, -1);
    ctx.quadraticCurveTo(-42, -7, -47, 2);
    ctx.stroke();

    ctx.fillStyle = "rgba(116, 216, 157, .52)";
    ctx.strokeStyle = "rgba(191, 255, 168, .58)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-4, -3);
    ctx.quadraticCurveTo(-13, -25 - flap, 6, -31 - flap);
    ctx.quadraticCurveTo(18, -20, 8, -3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-4, 3);
    ctx.quadraticCurveTo(-13, 25 + flap, 6, 31 + flap);
    ctx.quadraticCurveTo(18, 20, 8, 3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#63bb83";
    ctx.strokeStyle = "#c4ff9a";
    ctx.lineWidth = 1.4;
    ctx.shadowColor = "#b9ff78";
    ctx.shadowBlur = 8 + warden.pulse * 10;
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 7, 0, 0, TAU);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#83dfa0";
    ctx.beginPath();
    ctx.moveTo(10, -7);
    ctx.lineTo(23, -5);
    ctx.quadraticCurveTo(29, 0, 22, 7);
    ctx.lineTo(9, 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#fff3a0";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(21, -2, 2, 0, TAU);
    ctx.fill();

    ctx.strokeStyle = "#b9ff78";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(16, -5);
    ctx.lineTo(18, -13);
    ctx.moveTo(20, -4);
    ctx.lineTo(25, -10);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "rgba(201, 247, 111, .72)";
    ctx.textAlign = "center";
    ctx.font = `500 ${compactRender ? 9 : 7}px 'DM Mono', monospace`;
    ctx.fillText("SYLVA • WARDEN", warden.x, warden.y - (compactRender ? 50 : 39));
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
    glow.addColorStop(0, state.hearts > 6 ? "rgba(201,247,111,.28)" : "rgba(255,125,113,.32)");
    glow.addColorStop(1, "rgba(201,247,111,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, 67, 0, TAU);
    ctx.fill();

    ctx.strokeStyle = state.hearts > 6 ? "rgba(201,247,111,.32)" : "rgba(255,125,113,.48)";
    ctx.lineWidth = 1.3;
    for (let i = 0; i < 4; i += 1) {
      ctx.save();
      ctx.rotate((i / 4) * TAU + state.elapsed * 0.04);
      ctx.beginPath();
      ctx.ellipse(0, 0, 35 + i * 2, 21 + i * 4, 0, 0, TAU);
      ctx.stroke();
      ctx.restore();
    }

    ctx.fillStyle = "#101e15";
    ctx.strokeStyle = state.hearts > 6 ? "#c9f76f" : "#ff7d71";
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

    ctx.fillStyle = state.hearts > 6 ? "#dfff91" : "#ffaaa3";
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(0, 0, 8 + Math.sin(state.elapsed * 3) * 1.2, 0, TAU);
    ctx.fill();

    ctx.restore();

    ctx.fillStyle = "rgba(3,10,7,.8)";
    ctx.fillRect(x - 30, y + 42, 60, 4);
    ctx.fillStyle = health > 0.3 ? "#c9f76f" : "#ff7d71";
    ctx.fillRect(x - 30, y + 42, 60 * health, 4);
    ctx.fillStyle = "rgba(220, 240, 222, .58)";
    ctx.font = "500 8px 'DM Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("HEARTSEED", x, y + 58);
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
            projectile.type === "thorn" ? 1.5 : projectile.type === "wyrm" ? 5 * (1 - i / projectile.trail.length) : 3;
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
    ctx.fillStyle = "rgba(2, 8, 6, .52)";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#edf8df";
    ctx.textAlign = "center";
    ctx.font = "700 28px Manrope, sans-serif";
    ctx.fillText("THE GARDEN WAITS", W / 2, H / 2 - 5);
    ctx.fillStyle = "#8ca59a";
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
      card.classList.toggle("selected", state.selectedType === type);
      card.disabled = state.sap < TOWERS[type].cost;
      card.setAttribute("aria-pressed", state.selectedType === type ? "true" : "false");
    });
  }

  function updateUI() {
    ui.sap.textContent = Math.floor(state.sap);
    ui.heart.textContent = state.hearts;
    ui.heart.style.color = state.hearts <= 6 ? "#ff7d71" : "";

    if (!state.started) ui.waveLabel.textContent = "GARDEN QUIET";
    else if (state.waveActive) {
      const remaining = state.spawnQueue.length + state.enemies.length;
      ui.waveLabel.textContent = `WAVE ${state.wave + 1} // ${remaining} REMAIN`;
    } else if (state.wave >= WAVES.length) ui.waveLabel.textContent = "RIFT SEALED";
    else ui.waveLabel.textContent = `WAVE ${state.wave + 1} READY`;

    [...ui.wavePips.children].forEach((pip, index) => {
      pip.classList.toggle("complete", index < state.wave);
      pip.classList.toggle("active", state.waveActive && index === state.wave);
    });

    ui.waveBtn.disabled = !state.started || state.waveActive || state.wave >= WAVES.length || state.ended;
    ui.waveButtonTop.textContent = state.wave === 0 ? "BEGIN" : state.waveActive ? "INCOMING" : "SUMMON";
    ui.waveButtonMain.textContent = state.wave >= WAVES.length ? "COMPLETE" : `WAVE ${state.wave + 1}`;
    ui.speedLabel.textContent = `${state.speed}×`;
    ui.threatPreview.classList.toggle("hidden", state.waveActive || state.wave >= WAVES.length || state.ended);
    ui.threatText.textContent = threatSummary(state.wave);

    const abilityReady = state.ability >= 100;
    ui.abilityBtn.disabled = !state.started || !abilityReady || state.ended;
    ui.abilityStatus.textContent = state.overgrow > 0 ? `${state.overgrow.toFixed(1)}s` : abilityReady ? "READY • R" : `${Math.floor(state.ability)}%`;
    ui.abilityCharge.style.transform = `scaleX(${state.ability / 100})`;
    ui.abilityBtn.style.borderColor = abilityReady ? "rgba(124, 226, 187, .65)" : "";
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
    ui.selectedStats.textContent = `${data.description} • ${Math.round(stats.damage)} damage • ${stats.rate.toFixed(1)} shots/s`;
    ui.synergyValue.textContent = `+${tower.synergy * 12}%`;
    ui.synergyFill.style.width = `${(tower.synergy / 3) * 100}%`;
    ui.upgradeCost.textContent = tower.level >= 3 ? "MAX" : `${upgrade} ◈`;
    ui.upgradeBtn.disabled = tower.level >= 3 || state.sap < upgrade;
    ui.sellValue.textContent = `${sell} ◈`;
  }

  function togglePause() {
    if (!state.started || state.ended) return;
    state.paused = !state.paused;
    ui.pauseBtn.innerHTML = state.paused
      ? '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 4 10 6-10 6V4z"/></svg>'
      : '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 4h3v12H5zm7 0h3v12h-3z"/></svg>';
    ui.pauseBtn.setAttribute("aria-label", state.paused ? "Resume game" : "Pause game");
    tone(state.paused ? 180 : 280, 0.06, "sine", 0.015, state.paused ? -30 : 60);
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
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * W,
      y: ((clientY - rect.top) / rect.height) * H,
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
      else toast("THE GARDEN NEEDS MORE SAP");
    } else {
      state.selectedTower = null;
      updateSelectionPanel();
    }
  }

  function openHelp() {
    ui.helpModal.classList.add("visible");
    if (state.started && !state.paused) {
      state.paused = true;
      ui.helpModal.dataset.pausedGame = "true";
    }
  }

  function closeHelp() {
    ui.helpModal.classList.remove("visible");
    if (ui.helpModal.dataset.pausedGame === "true") {
      state.paused = false;
      delete ui.helpModal.dataset.pausedGame;
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
      state.paused = true;
      ui.settingsModal.dataset.pausedGame = "true";
    }
  }

  function closeSettings() {
    ui.settingsModal.classList.remove("visible");
    if (ui.settingsModal.dataset.pausedGame === "true") {
      state.paused = false;
      delete ui.settingsModal.dataset.pausedGame;
    }
  }

  function endGame(won) {
    if (state.ended) return;
    state.ended = true;
    ui.endEyebrow.textContent = won ? "THE HEARTSEED ENDURES" : "THE ROOTS FALL SILENT";
    ui.endTitle.textContent = won ? "The rift blooms." : "The garden fades.";
    ui.endCopy.textContent = won
      ? "Your living network held the dark at bay. A new world takes root."
      : "The rift reached the Heartseed. Grow a more diverse network and return.";
    ui.endWaves.textContent = state.wave;
    ui.endKills.textContent = state.kills;
    ui.endHarmony.textContent = state.peakHarmony;
    ui.endSigil.textContent = won ? "✦" : "◇";
    ui.endSigil.style.color = won ? "" : "#ff7d71";
    ui.endModal.classList.add("visible");
    if (won) chord([262, 330, 392, 523, 659]);
    else tone(110, 0.8, "sine", 0.04, -60);
  }

  function resetGame() {
    state.sap = 240;
    state.hearts = 20;
    state.wave = 0;
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
    state.paused = false;
    state.elapsed = 0;
    nodes.forEach((node) => {
      node.tower = null;
    });
    ui.endModal.classList.remove("visible");
    updateSelectionPanel();
    updateUI();
    toast("A NEW GARDEN STIRS");
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
      event.preventDefault();
      onCanvasMove(event);
      onCanvasClick(event);
    },
    { passive: false },
  );

  ui.startBtn.addEventListener("click", () => {
    createAudio();
    state.started = true;
    ui.introModal.classList.remove("visible");
    startMusic();
    chord([220, 330, 440]);
    toast("CHOOSE A SEED • PLANT ON A GLOWING NODE");
    updateUI();
  });
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
    if (event.key >= "1" && event.key <= "4") {
      selectType(Object.keys(TOWERS)[Number(event.key) - 1]);
    } else if (event.key === "Escape" && ui.settingsModal.classList.contains("visible")) {
      closeSettings();
    } else if (event.key === "Escape" && ui.helpModal.classList.contains("visible")) {
      closeHelp();
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
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && state.started && !state.ended) state.paused = true;
  });

  createPips();
  syncSettingsUI();
  updateUI();
  requestAnimationFrame(loop);
})();
