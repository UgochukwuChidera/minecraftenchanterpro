import { useState, useMemo, useCallback, useRef } from "react";
import MaterialCalc from "./MaterialCalc";
import HowToUse from "./HowToUse";

// ═══════════════════════════════════════════════════════════
//  ENCHANTMENT DATA  (wiki integrated)
// ═══════════════════════════════════════════════════════════
const E = {
  sharpness: {
    name: "Sharpness", maxLvl: 5, mult: 1, incomp: ["smite", "bane"],
    desc: "Increases melee damage dealt to all mobs and players.",
    levels: ["I — +1 damage", "II — +1.5 damage", "III — +2 damage", "IV — +2.5 damage", "V — +3 damage"],
    tip: "Best all-purpose damage enchant. Each level after I adds only +0.5 — the cumulative effect is strong."
  },

  smite: {
    name: "Smite", maxLvl: 5, mult: 1, incomp: ["sharpness", "bane"],
    desc: "Deals extra damage to undead mobs: zombies, skeletons, phantoms, the Wither, and drowned.",
    levels: ["I — +2.5 damage", "II — +5 damage", "III — +7.5 damage", "IV — +10 damage", "V — +12.5 damage"],
    tip: "Best choice for Wither fights or undead mob farms. Smite V does more damage to undead than Sharpness V."
  },

  bane: {
    name: "Bane of Arthropods", maxLvl: 5, mult: 1, incomp: ["sharpness", "smite"],
    desc: "Extra damage to arthropods (spiders, bees, silverfish, endermites) and applies Slowness IV.",
    levels: ["I — +2.5 damage", "II — +5 damage", "III — +7.5 damage", "IV — +10 damage", "V — +12.5 + Slowness IV"],
    tip: "Very niche. Only useful if you specifically farm cave spiders or run a spider grinder."
  },

  knockback: {
    name: "Knockback", maxLvl: 2, mult: 1, incomp: [],
    desc: "Increases the knockback distance when hitting enemies with a sword.",
    levels: ["I — ~3 extra blocks knockback", "II — ~6 extra blocks knockback"],
    tip: "Can be counterproductive in melee — pushes mobs out of reach. Better on a utility sword than a combat sword."
  },

  fire_aspect: {
    name: "Fire Aspect", maxLvl: 2, mult: 2, incomp: [],
    desc: "Sets the target on fire on hit, dealing damage over time. Animals drop cooked meat when killed burning.",
    levels: ["I — 3 seconds of fire (3 damage)", "II — 7 seconds of fire (7 damage)"],
    tip: "Great for passive cooking — sheep, cows, and chickens all drop cooked food automatically."
  },

  looting: {
    name: "Looting", maxLvl: 3, mult: 2, incomp: [],
    desc: "Increases the quantity and rare-item chance of mob drops.",
    levels: ["I — +1 max drop, +1% rare chance", "II — +2 max, +2% rare", "III — +3 max, +3% rare"],
    tip: "Essential for rare drops like wither skulls (3% → 5.5%), blaze rods, and ender pearls."
  },

  sweeping: {
    name: "Sweeping Edge", maxLvl: 3, mult: 2, incomp: [],
    desc: "Increases the damage of sweep attacks (Java Edition only).",
    levels: ["I — 50% of sword damage", "II — 67% of sword damage", "III — 75% of sword damage"],
    tip: "Java-exclusive. Extremely powerful in mob farms where enemies cluster. Not available on Bedrock."
  },

  mending: {
    name: "Mending", maxLvl: 1, mult: 2, incomp: ["infinity"],
    desc: "Repairs the item using XP orbs collected. Each XP point restores 2 durability.",
    levels: ["I — 2 durability restored per XP point"],
    tip: "Treasure enchantment — can't be obtained from an enchanting table. Trade with librarian villagers. Mutually exclusive with Infinity."
  },

  unbreaking: {
    name: "Unbreaking", maxLvl: 3, mult: 1, incomp: [],
    desc: "Reduces the chance of durability being consumed per use.",
    levels: ["I — 50% chance to not lose durability", "II — 66%", "III — 75%"],
    tip: "Effectively multiplies item lifespan (4× at level III). Almost always worth including on tools and armor."
  },

  curse_van: {
    name: "Curse of Vanishing", maxLvl: 1, mult: 8, incomp: [],
    desc: "The item is destroyed when you die instead of dropping as an item.",
    levels: ["I — item destroyed on death"],
    tip: "Generally undesirable. Only useful for trapping other players (they can't get your gear). Costs a lot of XP to apply."
  },

  curse_bind: {
    name: "Curse of Binding", maxLvl: 1, mult: 8, incomp: [],
    desc: "Once worn, the item can't be removed from its armor slot until it breaks or you die.",
    levels: ["I — item locked to slot until broken or death"],
    tip: "Niche use in multiplayer as a trap item. Avoid on your own gear unless you want to be stuck with it."
  },

  efficiency: {
    name: "Efficiency", maxLvl: 5, mult: 1, incomp: [],
    desc: "Increases mining speed for the correct tool and block type.",
    levels: ["I — +1 speed bonus", "II — +4 bonus", "III — +9 bonus", "IV — +16 bonus", "V — +25 bonus"],
    tip: "Speed bonus scales as level², so V is dramatically faster than IV. Combine with Haste beacon for absurd speed."
  },

  silk_touch: {
    name: "Silk Touch", maxLvl: 1, mult: 4, incomp: ["fortune"],
    desc: "Mined blocks drop themselves rather than their usual drops.",
    levels: ["I — blocks drop as themselves (e.g. stone, not cobblestone)"],
    tip: "Essential for: glass, bookshelves, ice, packed ice, coral, spawners. Incompatible with Fortune."
  },

  fortune: {
    name: "Fortune", maxLvl: 3, mult: 2, incomp: ["silk_touch"],
    desc: "Increases the quantity of drops from certain blocks (ores, crops, gravel, etc.).",
    levels: ["I — up to ×2 drops", "II — up to ×3 drops", "III — up to ×4 drops"],
    tip: "Fortune III on diamonds averages 2.2× more diamonds per ore. Essential for efficient ore mining."
  },

  power: {
    name: "Power", maxLvl: 5, mult: 1, incomp: [],
    desc: "Increases the damage of arrows shot from a bow.",
    levels: ["I — +25% arrow damage", "II — +50%", "III — +75%", "IV — +100%", "V — +125%"],
    tip: "Power V bow deals ~24 damage on a critical arrow — one-shotting most mobs. The most important bow enchantment."
  },

  punch: {
    name: "Punch", maxLvl: 2, mult: 2, incomp: [],
    desc: "Increases the knockback that arrows apply to hit targets.",
    levels: ["I — moderate extra knockback", "II — significant knockback"],
    tip: "Useful to keep mobs at distance. Combine with Flame for sustained chip damage from range."
  },

  flame: {
    name: "Flame", maxLvl: 1, mult: 2, incomp: [],
    desc: "Arrows set their targets on fire, dealing fire damage over time.",
    levels: ["I — 5 seconds of fire (5 damage) on hit"],
    tip: "Skeletons and undead take fire damage. Nether mobs are immune. Great for sustained DPS."
  },

  infinity: {
    name: "Infinity", maxLvl: 1, mult: 4, incomp: ["mending"],
    desc: "Shooting the bow does not consume arrows (one regular arrow must remain in inventory).",
    levels: ["I — arrows not consumed on firing"],
    tip: "Incompatible with Mending. Choose Infinity for combat, Mending if you want the bow to last forever without arrow cost."
  },

  protection: {
    name: "Protection", maxLvl: 4, mult: 1, incomp: ["blast_prot", "fire_prot", "proj_prot"],
    desc: "Reduces incoming damage from most sources by a percentage.",
    levels: ["I — 4% damage reduction", "II — 8%", "III — 12%", "IV — 16%"],
    tip: "Full Protection IV set = 64% total reduction. Stacks across all 4 armor slots. Best general-purpose armor enchant."
  },

  blast_prot: {
    name: "Blast Protection", maxLvl: 4, mult: 2, incomp: ["protection", "fire_prot", "proj_prot"],
    desc: "Reduces explosion damage and knockback (from creepers, TNT, beds in Nether/End).",
    levels: ["I — 8% explosion reduction, −15% knockback", "II — 16%, −30%", "III — 24%, −45%", "IV — 32%, −60%"],
    tip: "Extremely powerful near creepers. Each level also reduces explosion knockback significantly."
  },

  fire_prot: {
    name: "Fire Protection", maxLvl: 4, mult: 1, incomp: ["protection", "blast_prot", "proj_prot"],
    desc: "Reduces fire and lava damage, and decreases the duration of being set on fire.",
    levels: ["I — 8% fire resistance, −15% burn time", "II — 16%, −30%", "III — 24%, −45%", "IV — 32%, −60%"],
    tip: "Particularly useful in the Nether. Fire Prot IV across all armor slots makes lava barely threatening."
  },

  proj_prot: {
    name: "Proj. Protection", maxLvl: 4, mult: 1, incomp: ["protection", "blast_prot", "fire_prot"],
    desc: "Reduces damage from projectiles (arrows, fireballs, shulker bullets, llama spit).",
    levels: ["I — 8% projectile reduction", "II — 16%", "III — 24%", "IV — 32%"],
    tip: "Situational — mainly useful when fighting skeleton armies or blaze mobs. Otherwise Protection is better."
  },

  feather_fall: {
    name: "Feather Falling", maxLvl: 4, mult: 1, incomp: [],
    desc: "Reduces fall damage taken by the player.",
    levels: ["I — 12% fall reduction", "II — 24%", "III — 36%", "IV — 48%"],
    tip: "Essential on boots. Feather Falling IV + Protection IV boots make most fall damage survivable."
  },

  thorns: {
    name: "Thorns", maxLvl: 3, mult: 4, incomp: [],
    desc: "Has a chance to damage attackers when they hit you. Also reduces your armor's durability faster.",
    levels: ["I — 15% chance, 1–2 damage returned", "II — 30% chance, 1–3 damage", "III — 45% chance, 1–4 damage"],
    tip: "Very expensive (mult ×4). Rapidly degrades armor. Best used with Mending. Fun for mob farms."
  },

  respiration: {
    name: "Respiration", maxLvl: 3, mult: 2, incomp: [],
    desc: "Extends underwater breathing time and reduces drowning damage frequency.",
    levels: ["I — 30 seconds total", "II — 45 seconds total", "III — 60 seconds total"],
    tip: "Combine with Aqua Affinity for a full aquatic build. Useful for ocean monument raids."
  },

  aqua_affinity: {
    name: "Aqua Affinity", maxLvl: 1, mult: 2, incomp: [],
    desc: "Removes the underwater mining penalty (blocks normally take 5× longer to mine while submerged).",
    levels: ["I — full mining speed underwater"],
    tip: "Only goes on helmets. Essential for underwater construction or ocean monument looting."
  },

  depth_strider: {
    name: "Depth Strider", maxLvl: 3, mult: 2, incomp: ["frost_walker"],
    desc: "Increases movement speed while walking underwater.",
    levels: ["I — 1/3 of land speed", "II — 2/3 of land speed", "III — full land speed underwater"],
    tip: "Depth Strider III makes you walk at normal speed underwater. Incompatible with Frost Walker."
  },

  frost_walker: {
    name: "Frost Walker", maxLvl: 2, mult: 2, incomp: ["depth_strider"],
    desc: "Turns water blocks beneath the player into frosted ice as you walk, allowing traversal of water.",
    levels: ["I — small radius of ice", "II — larger radius (~2.5 block radius)"],
    tip: "Treasure enchantment — only from loot/trades. Ice reverts to water when you step off. Incompatible with Depth Strider."
  },

  soul_speed: {
    name: "Soul Speed", maxLvl: 3, mult: 4, incomp: [],
    desc: "Increases movement speed on soul sand and soul soil in the Nether. Slowly damages boots.",
    levels: ["I — 1.3× movement speed", "II — 1.7×", "III — 2.0×"],
    tip: "Treasure enchantment (bastion remnant chests only). Very expensive to apply. Pair with Mending to counteract boot damage."
  },

  swift_sneak: {
    name: "Swift Sneak", maxLvl: 3, mult: 8, incomp: [],
    desc: "Increases movement speed while sneaking (Java Edition only).",
    levels: ["I — 25% of normal walk speed", "II — 50%", "III — 75%"],
    tip: "Found only in Ancient City chests. Multiplier of ×8 makes it the most expensive enchant to apply via anvil."
  },

  loyalty: {
    name: "Loyalty", maxLvl: 3, mult: 1, incomp: ["riptide"],
    desc: "Thrown tridents return to the player automatically after hitting.",
    levels: ["I — slow return", "II — medium return", "III — fast return (~3 seconds)"],
    tip: "Essential for using tridents offensively. Without it you lose the trident every throw. Incompatible with Riptide."
  },

  impaling: {
    name: "Impaling", maxLvl: 5, mult: 2, incomp: [],
    desc: "Deals extra damage to aquatic mobs (Java). On Bedrock, affects all mobs in water or rain.",
    levels: ["I — +2.5 damage", "II — +5", "III — +7.5", "IV — +10", "V — +12.5 damage"],
    tip: "Java: only hits guardians, squid, axolotls, dolphins, etc. Bedrock: hits anything in rain. Very edition-dependent."
  },

  riptide: {
    name: "Riptide", maxLvl: 3, mult: 2, incomp: ["loyalty", "channeling"],
    desc: "Propels the player forward when the trident is thrown in water or rain. Trident doesn't fly normally.",
    levels: ["I — 5 m/s launch speed", "II — 8 m/s", "III — 11 m/s"],
    tip: "Enables fast travel in rain. Combine with Depth Strider for aquatic mobility. Incompatible with Loyalty and Channeling."
  },

  channeling: {
    name: "Channeling", maxLvl: 1, mult: 4, incomp: ["riptide"],
    desc: "Summons a lightning bolt on entities struck by the trident during a thunderstorm.",
    levels: ["I — lightning bolt summoned on hit (thunderstorm + open sky required)"],
    tip: "Used to create charged creepers for skull farming, convert villagers to witches, or mooshrooms to brown."
  },

  multishot: {
    name: "Multishot", maxLvl: 1, mult: 2, incomp: ["piercing"],
    desc: "Fires 3 arrows in a spread pattern for the cost of 1 arrow. Extra arrows don't drop on impact.",
    levels: ["I — fires 3 arrows simultaneously (left, center, right)"],
    tip: "All 3 arrows can hit a single large mob. Excellent against groups. Incompatible with Piercing."
  },

  quick_charge: {
    name: "Quick Charge", maxLvl: 3, mult: 1, incomp: [],
    desc: "Reduces the time required to reload/charge a crossbow.",
    levels: ["I — 0.25s faster", "II — 0.5s faster", "III — 0.75s faster (near-instant)"],
    tip: "Quick Charge III reduces load time to ~0.5 seconds — comparable to bow draw speed."
  },

  piercing: {
    name: "Piercing", maxLvl: 4, mult: 1, incomp: ["multishot"],
    desc: "Arrows pass through multiple entities and can be retrieved after impact.",
    levels: ["I — pierces 2 entities", "II — 3", "III — 4", "IV — 5 entities"],
    tip: "Very strong against lined-up mobs. Arrows can be picked up after passing through. Incompatible with Multishot."
  },

  luck_of_sea: {
    name: "Luck of the Sea", maxLvl: 3, mult: 2, incomp: [],
    desc: "Increases the chance of fishing up treasure items instead of fish or junk.",
    levels: ["I — +2% treasure chance", "II — +4%", "III — +6% treasure chance"],
    tip: "Treasures include enchanted books, bows, fishing rods, and saddles. Essential for AFK fishing farms."
  },

  lure: {
    name: "Lure", maxLvl: 3, mult: 2, incomp: [],
    desc: "Decreases the average wait time before something bites when fishing.",
    levels: ["I — 5s less wait (~20s avg)", "II — 10s less (~15s avg)", "III — 15s less (~5s avg)"],
    tip: "Combine with Luck of the Sea for maximum AFK fishing efficiency."
  },
};

const ITEMS = [
  { id: "sword", name: "Sword", em: "⚔️", enc: ["sharpness", "smite", "bane", "knockback", "fire_aspect", "looting", "sweeping", "mending", "unbreaking", "curse_van"] },
  { id: "pickaxe", name: "Pickaxe", em: "⛏️", enc: ["efficiency", "silk_touch", "fortune", "mending", "unbreaking", "curse_van"] },
  { id: "axe", name: "Axe", em: "🪓", enc: ["sharpness", "smite", "bane", "efficiency", "silk_touch", "fortune", "mending", "unbreaking", "curse_van"] },
  { id: "shovel", name: "Shovel", em: "🪣", enc: ["efficiency", "silk_touch", "fortune", "mending", "unbreaking", "curse_van"] },
  { id: "hoe", name: "Hoe", em: "🌿", enc: ["efficiency", "silk_touch", "fortune", "mending", "unbreaking", "curse_van"] },
  { id: "bow", name: "Bow", em: "🏹", enc: ["power", "punch", "flame", "infinity", "mending", "unbreaking", "curse_van"] },
  { id: "crossbow", name: "Crossbow", em: "🎯", enc: ["multishot", "quick_charge", "piercing", "mending", "unbreaking", "curse_van"] },
  { id: "helmet", name: "Helmet", em: "🪖", enc: ["protection", "blast_prot", "fire_prot", "proj_prot", "thorns", "respiration", "aqua_affinity", "mending", "unbreaking", "curse_van", "curse_bind", "soul_speed"] },
  { id: "chestplate", name: "Chestplate", em: "🛡️", enc: ["protection", "blast_prot", "fire_prot", "proj_prot", "thorns", "mending", "unbreaking", "curse_van", "curse_bind"] },
  { id: "leggings", name: "Leggings", em: "👖", enc: ["protection", "blast_prot", "fire_prot", "proj_prot", "thorns", "mending", "unbreaking", "curse_van", "curse_bind", "swift_sneak"] },
  { id: "boots", name: "Boots", em: "🥾", enc: ["protection", "blast_prot", "fire_prot", "proj_prot", "feather_fall", "thorns", "depth_strider", "frost_walker", "mending", "unbreaking", "curse_van", "curse_bind", "soul_speed"] },
  { id: "fishing_rod", name: "Fishing Rod", em: "🎣", enc: ["luck_of_sea", "lure", "mending", "unbreaking", "curse_van"] },
  { id: "trident", name: "Trident", em: "🔱", enc: ["loyalty", "impaling", "riptide", "channeling", "mending", "unbreaking", "curse_van"] },
];

// ═══════════════════════════════════════════════════════════
//  ALGORITHM
// ═══════════════════════════════════════════════════════════
const R = ["", "I", "II", "III", "IV", "V"];
const rom = n => R[n] || n;
const pen = wc => Math.pow(2, wc) - 1;
const ecost = ench => Object.entries(ench).reduce((s, [id, lvl]) => s + E[id].mult * lvl, 0);

let _uid = 0;
const nid = () => ++_uid;

function solve(selected, itemName) {
  const ids = Object.keys(selected);
  if (!ids.length) return null;
  const n = ids.length;
  const full = (1 << n) - 1;
  const dp = new Array(1 << n).fill(null);

  for (let i = 0; i < n; i++) {
    const id = ids[i];
    dp[1 << i] = {
      nid: nid(), wc: 0, cost: 0, ench: { [id]: selected[id] },
      label: `${E[id].name} ${rom(selected[id])} Book`, steps: []
    };
  }

  for (let mask = 1; mask <= full; mask++) {
    if (!(mask & (mask - 1))) continue;
    let best = null;
    for (let sub = (mask - 1) & mask; sub > 0; sub = (sub - 1) & mask) {
      const comp = mask ^ sub;
      if (!comp || sub > comp) continue;
      const a = dp[sub], b = dp[comp];
      if (!a || !b) continue;
      for (const [tgt, sac] of [[a, b], [b, a]]) {
        const ec = ecost(sac.ench);
        const sc = pen(tgt.wc) + pen(sac.wc) + ec;
        const tc = tgt.cost + sac.cost + sc;
        const wc = Math.max(tgt.wc, sac.wc) + 1;
        if (!best || tc < best.cost) {
          const id = nid();
          best = {
            nid: id, wc, cost: tc, ench: { ...tgt.ench, ...sac.ench },
            label: Object.entries({ ...tgt.ench, ...sac.ench }).map(([i, l]) => `${E[i].name} ${rom(l)}`).join(", "),
            steps: [...tgt.steps, ...sac.steps, { tgt, sac, sc, ec, resultNid: id }]
          };
        }
      }
    }
    dp[mask] = best;
  }

  const book = dp[full];
  if (!book) return null;

  const ec = ecost(book.ench);
  const sc = pen(0) + pen(book.wc) + ec;
  const total = book.cost + sc;
  const itemNode = { nid: nid(), label: itemName };
  const allSteps = [...book.steps, { tgt: itemNode, sac: book, sc, ec, resultNid: nid(), isFinal: true }];

  const nidMap = {};
  const steps = allSteps.map((step, i) => {
    nidMap[step.resultNid] = i + 1;
    const tl = nidMap[step.tgt.nid] ? `Step ${nidMap[step.tgt.nid]} result` : step.tgt.label;
    const sl = nidMap[step.sac.nid] ? `Step ${nidMap[step.sac.nid]} result` : step.sac.label;
    return { num: i + 1, tl, sl, sc: step.sc, isFinal: !!step.isFinal };
  });

  return { steps, total, tooExpensive: steps.some(s => s.sc > 39) };
}

// ═══════════════════════════════════════════════════════════
//  SHARED STYLES / THEME
// ═══════════════════════════════════════════════════════════
const T = {
  bg: "#080808", surface: "#0f0f0f", s2: "#111111", s3: "#161616",
  border: "#1e1e1e", b2: "#252525",
  accent: "#a66eff", accentD: "#6b28d4", accentBg: "rgba(166,110,255,0.08)",
  text: "#e0e0e0", muted: "#555", muted2: "#888",
  green: "#4ade80", red: "#f87171", yellow: "#fbbf24", blue: "#93c5fd", orange: "#fb923c",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:${T.bg};font-family:'IBM Plex Mono',monospace;color:${T.text}}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:3px}
.tab-btn{transition:all .15s;cursor:pointer}
.tab-btn:hover{filter:brightness(1.2)}
.item-btn{cursor:pointer;transition:transform .12s,box-shadow .12s}
.item-btn:hover{transform:translateY(-2px)}
.erow{transition:background .1s;cursor:pointer;user-select:none}
.erow:hover:not(.blocked){background:rgba(255,255,255,0.03)!important}
.erow.blocked{cursor:not-allowed}
.lvbtn{transition:all .1s;cursor:pointer;border:none}
.lvbtn:hover{filter:brightness(1.3)}
.go-btn{transition:all .2s;cursor:pointer;border:none}
.go-btn:not(:disabled):hover{transform:translateY(-1px);filter:brightness(1.1)}
.go-btn:disabled{cursor:not-allowed}
.step{animation:pop .2s ease both}
@keyframes pop{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.wiki-panel{animation:wslide .18s ease both}
@keyframes wslide{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
.add-btn{transition:all .15s;cursor:pointer}
.add-btn:hover{background:rgba(166,110,255,0.12)!important;border-color:${T.accent}!important}
.rm-btn{transition:all .1s;cursor:pointer;opacity:.4}
.rm-btn:hover{opacity:1}
.preset-card{transition:all .15s;cursor:pointer}
.preset-card:hover{border-color:${T.accent}!important;background:${T.accentBg}!important}
.icon-btn{transition:all .1s;cursor:pointer;background:none;border:none}
.icon-btn:hover{color:${T.accent}!important}
`;

// ═══════════════════════════════════════════════════════════
//  SECTION WRAPPER
// ═══════════════════════════════════════════════════════════
function Sec({ label, title, children, action }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 18, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        {label && <span style={{ fontFamily: "'Press Start 2P'", fontSize: 7, color: "#333" }}>{label}</span>}
        <div style={{ flex: 1, height: 1, background: T.border }} />
        <span style={{ fontFamily: "'Press Start 2P'", fontSize: 8, color: T.accent }}>{title}</span>
        {action}
      </div>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  WIKI PANEL (inline expansion)
// ═══════════════════════════════════════════════════════════
function WikiPanel({ id }) {
  const enc = E[id];
  return (
    <div className="wiki-panel" style={{
      margin: "6px 0 2px 28px", padding: "12px 14px",
      background: "#0a0818", border: `1px solid rgba(166,110,255,0.2)`, borderRadius: 8,
    }}>
      <p style={{ fontSize: 12, color: T.muted2, marginBottom: 8, lineHeight: 1.6 }}>{enc.desc}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 8 }}>
        {enc.levels.map((l, i) => (
          <div key={i} style={{ display: "flex", gap: 8, fontSize: 11 }}>
            <span style={{ color: T.accent, fontFamily: "'Press Start 2P'", fontSize: 7, minWidth: 14, paddingTop: 2 }}>{i + 1}</span>
            <span style={{ color: "#ccc" }}>{l}</span>
          </div>
        ))}
      </div>
      {enc.tip && (
        <div style={{ padding: "7px 10px", background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)", borderRadius: 5, fontSize: 11, color: "#d4a", lineHeight: 1.5 }}>
          <span style={{ color: T.yellow }}>💡 </span>{enc.tip}
        </div>
      )}
      <div style={{ marginTop: 8, display: "flex", gap: 12, fontSize: 10, color: T.muted }}>
        <span>Anvil multiplier: <span style={{ color: T.orange }}>×{enc.mult}/lvl</span></span>
        {enc.incomp.length > 0 && (
          <span>Incompatible: <span style={{ color: T.red }}>{enc.incomp.map(i => E[i]?.name || i).join(", ")}</span></span>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  ENCHANT PICKER (reusable)
// ═══════════════════════════════════════════════════════════
function EnchantPicker({ item, sel, onChange }) {
  const [openWiki, setOpenWiki] = useState(null);

  const incomp = useMemo(() => {
    const s = new Set();
    Object.keys(sel).forEach(id => E[id].incomp.forEach(x => s.add(x)));
    return s;
  }, [sel]);

  const toggle = (id) => {
    if (incomp.has(id) && !sel[id]) return;
    const n = { ...sel };
    if (n[id]) delete n[id]; else n[id] = E[id].maxLvl;
    onChange(n);
  };

  const setLvl = (id, lvl) => {
    const n = { ...sel };
    if (!n[id]) n[id] = lvl; else n[id] = lvl;
    onChange(n);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {item.enc.map(id => {
        const enc = E[id];
        const active = !!sel[id];
        const blocked = incomp.has(id) && !active;
        const curse = id.startsWith("curse");
        const wikiOpen = openWiki === id;

        return (
          <div key={id}>
            <div className={`erow${blocked ? " blocked" : ""}`}
              onClick={() => !blocked && toggle(id)}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 6,
                background: active ? T.accentBg : "transparent",
                border: `1px solid ${active ? "rgba(166,110,255,0.15)" : "transparent"}`,
                opacity: blocked ? 0.25 : 1,
              }}>

              <div style={{
                width: 16, height: 16, borderRadius: 3, flexShrink: 0,
                border: `1.5px solid ${active ? T.accent : "#333"}`,
                background: active ? T.accent : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff"
              }}>{active && "✓"}</div>

              <span style={{ flex: 1, fontSize: 12, color: curse ? T.red : active ? "#d4baff" : T.muted2 }}>
                {enc.name}
                {curse && <span style={{ fontSize: 9, color: T.red, marginLeft: 4, opacity: .8 }}>CURSE</span>}
              </span>

              {/* Wiki button */}
              <button className="icon-btn" onClick={e => { e.stopPropagation(); setOpenWiki(wikiOpen ? null : id) }}
                style={{ fontSize: 11, color: wikiOpen ? T.accent : "#333", padding: "0 4px", lineHeight: 1, fontFamily: "'IBM Plex Mono'" }}>
                ⓘ
              </button>

              {/* Multiplier */}
              <span style={{ fontSize: 10, color: "#2a2a2a", minWidth: 38, textAlign: "right" }}>×{enc.mult}</span>

              {/* Level picker */}
              {enc.maxLvl > 1 && (
                <div style={{ display: "flex", gap: 3 }} onClick={e => e.stopPropagation()}>
                  {Array.from({ length: enc.maxLvl }, (_, i) => i + 1).map(lvl => (
                    <button key={lvl} className="lvbtn"
                      onClick={() => { if (!active) toggle(id); setLvl(id, lvl); }}
                      style={{
                        width: 24, height: 22, borderRadius: 4, fontSize: 8,
                        fontFamily: "'Press Start 2P'",
                        background: (active && sel[id] === lvl) ? T.accent : "#1a1a1a",
                        color: (active && sel[id] === lvl) ? "#fff" : "#444",
                      }}>{rom(lvl)}</button>
                  ))}
                </div>
              )}
            </div>
            {wikiOpen && <WikiPanel id={id} />}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  RESULT STEPS DISPLAY
// ═══════════════════════════════════════════════════════════
function ResultSteps({ result, item, compact }) {
  const [collapsed, setCollapsed] = useState(compact);
  if (!result) return null;

  return (
    <div>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "#0a0a0a", border: `1px solid ${T.border}`, borderRadius: 7,
        padding: "9px 12px", marginBottom: collapsed ? 0 : 10, cursor: compact ? "pointer" : "default"
      }}
        onClick={() => compact && setCollapsed(c => !c)}>
        <span style={{ fontSize: 11, color: T.muted }}>
          {result.steps.length} step{result.steps.length !== 1 ? "s" : ""}
          {compact && (collapsed ? " — click to expand" : " — click to collapse")}
        </span>
        <span style={{
          fontFamily: "'Press Start 2P'", fontSize: 9,
          color: result.tooExpensive ? T.red : T.green,
          textShadow: `0 0 10px ${result.tooExpensive ? "rgba(248,113,113,.4)" : "rgba(74,222,128,.3)"}`
        }}>
          {result.tooExpensive ? "⚠ TOO EXPENSIVE" : `${result.total} LEVELS`}
        </span>
      </div>

      {!collapsed && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {result.steps.map((step, i) => (
            <div key={step.num} className="step" style={{
              animationDelay: `${i * .05}s`,
              background: step.isFinal ? "#0d0a18" : T.s2,
              border: `1.5px solid ${step.sc > 39 ? "#7f1d1d" : step.isFinal ? "rgba(166,110,255,.3)" : T.border}`,
              borderRadius: 7, padding: "10px 12px",
              display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap"
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                background: step.isFinal ? T.accent : "#191919",
                border: `1.5px solid ${step.isFinal ? T.accent : "#2a2a2a"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Press Start 2P'", fontSize: 8, color: step.isFinal ? "#fff" : T.muted
              }}>{step.num}</div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", fontSize: 11 }}>
                <span style={{ background: "#0d1f14", border: "1px solid #1a3320", borderRadius: 4, padding: "2px 7px", color: "#86efac" }}>{step.tl}</span>
                <span style={{ color: "#333" }}>+</span>
                <span style={{ background: "#0d1422", border: "1px solid #1a2a40", borderRadius: 4, padding: "2px 7px", color: T.blue }}>{step.sl}</span>
                <span style={{ color: "#2a2a2a" }}>→</span>
                <span style={{ color: step.isFinal ? "#c4a3ff" : T.muted, fontStyle: step.isFinal ? "italic" : "normal" }}>
                  {step.isFinal ? `✨ ${item.name}` : "combined book"}
                </span>
              </div>
              <div style={{
                background: step.sc > 39 ? "#2d0707" : "#1a1300",
                border: `1px solid ${step.sc > 39 ? "#7f1d1d" : "#3d3300"}`,
                borderRadius: 5, padding: "3px 8px", flexShrink: 0,
                fontFamily: "'Press Start 2P'", fontSize: 8,
                color: step.sc > 39 ? T.red : T.yellow
              }}>{step.sc} lvls</div>
            </div>
          ))}
          {result.tooExpensive && (
            <div style={{ padding: "10px 12px", background: "rgba(239,68,68,.06)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 7, fontSize: 11, color: "#fca5a5" }}>
              ⚠ A step exceeds 39 levels. Try removing high-cost enchants (Thorns, Soul Speed, Curses) or start with a fresh item.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  ITEM SELECTOR GRID
// ═══════════════════════════════════════════════════════════
function ItemGrid({ value, onChange }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(72px,1fr))", gap: 6 }}>
      {ITEMS.map(it => (
        <div key={it.id} className="item-btn" onClick={() => onChange(it.id)}
          style={{
            background: value === it.id ? "#160e28" : T.s2,
            border: `1.5px solid ${value === it.id ? T.accent : T.border}`,
            borderRadius: 7, padding: "8px 4px", textAlign: "center",
            boxShadow: value === it.id ? "0 0 12px rgba(166,110,255,.2)" : "none"
          }}>
          <div style={{ fontSize: 22 }}>{it.em}</div>
          <div style={{ marginTop: 4, fontSize: 7, color: value === it.id ? "#c4a3ff" : "#555", fontFamily: "'Press Start 2P'", lineHeight: 1.6 }}>
            {it.name.toUpperCase()}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  SINGLE CALCULATOR TAB
// ═══════════════════════════════════════════════════════════
function SingleCalc({ onSavePreset, initialPreset }) {
  const [itemId, setItemId] = useState(initialPreset?.itemId || "sword");
  const [sel, setSel] = useState(initialPreset?.sel || {});
  const [result, setResult] = useState(null);
  const [presetName, setPresetName] = useState(initialPreset?.name || "");
  const [saved, setSaved] = useState(false);
  const resultsRef = useRef(null);
  const item = ITEMS.find(i => i.id === itemId);

  const pickItem = id => { setItemId(id); setSel({}); setResult(null); };

  const calc = () => {
    if (!Object.keys(sel).length) return;
    const r = solve(sel, item.name);
    setResult(r);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };

  const savePreset = () => {
    if (!presetName.trim() || !count) return;
    onSavePreset({ type: "single", name: presetName.trim(), itemId, sel });
    setPresetName(""); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const count = Object.keys(sel).length;

  return (
    <div>
      <Sec label="01" title="CHOOSE ITEM">
        <ItemGrid value={itemId} onChange={id => { pickItem(id); }} />
      </Sec>

      <Sec label="02" title={`ENCHANTMENTS${count ? ` — ${count} SELECTED` : ""}`}
        action={
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input value={presetName} onChange={e => setPresetName(e.target.value)}
              placeholder="preset name..."
              style={{
                background: T.s3, border: `1px solid ${T.border}`, borderRadius: 5,
                padding: "4px 8px", fontSize: 11, color: T.text, outline: "none", width: 130, fontFamily: "'IBM Plex Mono'"
              }} />
            <button onClick={savePreset} disabled={!presetName.trim() || !count}
              style={{
                background: saved ? "rgba(74,222,128,.15)" : "rgba(166,110,255,.12)",
                border: `1px solid ${saved ? T.green : T.border}`, borderRadius: 5,
                padding: "4px 10px", fontSize: 10, color: saved ? T.green : T.muted, cursor: "pointer", fontFamily: "'IBM Plex Mono'"
              }}>
              {saved ? "✓ saved" : "💾 save"}
            </button>
          </div>
        }>
        <EnchantPicker item={item} sel={sel} onChange={n => { setSel(n); setResult(null); }} />
      </Sec>

      <button className="go-btn" onClick={calc} disabled={!count}
        style={{
          width: "100%", padding: "13px 0", marginBottom: 16, borderRadius: 8,
          background: count ? "linear-gradient(135deg,#5f1fd4,#a66eff)" : T.s2,
          color: count ? "#fff" : "#333",
          border: `1.5px solid ${count ? T.accent : T.border}`,
          fontFamily: "'Press Start 2P'", fontSize: 10, letterSpacing: 1,
          boxShadow: count ? "0 4px 20px rgba(166,110,255,.25)" : "none"
        }}>
        {count ? "⚒  CALCULATE OPTIMAL ORDER" : "SELECT ENCHANTMENTS FIRST"}
      </button>

      {result && (
        <Sec label="03" title="OPTIMAL COMBINING ORDER">
          <div ref={resultsRef} />
          <ResultSteps result={result} item={item} compact={false} />
          <div style={{ marginTop: 10, padding: "8px 12px", background: T.s2, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 10, color: T.muted, lineHeight: 1.8 }}>
            💡 All books and item assumed to have <strong style={{ color: T.muted2 }}>zero work penalty</strong>. For best results, use max-level books from librarian trades rather than combining smaller books.
          </div>
        </Sec>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  SET BUILDER TAB
// ═══════════════════════════════════════════════════════════
let setUid = 0;
const newEntry = () => ({ uid: ++setUid, itemId: "sword", qty: 1, sel: {} });

function SetEntry({ entry, onUpdate, onRemove }) {
  const item = ITEMS.find(i => i.id === entry.itemId);

  return (
    <div style={{ background: T.s2, border: `1px solid ${T.b2}`, borderRadius: 10, padding: 14, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 20 }}>{item.em}</span>
        <select value={entry.itemId}
          onChange={e => onUpdate({ ...entry, itemId: e.target.value, sel: {} })}
          style={{
            background: T.s3, border: `1px solid ${T.border}`, borderRadius: 5, padding: "5px 8px",
            color: T.text, fontSize: 12, flex: 1, fontFamily: "'IBM Plex Mono'", outline: "none"
          }}>
          {ITEMS.map(it => <option key={it.id} value={it.id}>{it.em} {it.name}</option>)}
        </select>

        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: 10, color: T.muted }}>qty</span>
          <button onClick={() => onUpdate({ ...entry, qty: Math.max(1, entry.qty - 1) })}
            style={{
              width: 22, height: 22, background: T.s3, border: `1px solid ${T.border}`,
              borderRadius: 4, cursor: "pointer", color: T.muted, fontSize: 12, lineHeight: 1
            }}>−</button>
          <span style={{ fontFamily: "'Press Start 2P'", fontSize: 10, color: T.accent, minWidth: 14, textAlign: "center" }}>{entry.qty}</span>
          <button onClick={() => onUpdate({ ...entry, qty: Math.min(9, entry.qty + 1) })}
            style={{
              width: 22, height: 22, background: T.s3, border: `1px solid ${T.border}`,
              borderRadius: 4, cursor: "pointer", color: T.muted, fontSize: 12, lineHeight: 1
            }}>+</button>
        </div>

        <button className="rm-btn" onClick={onRemove}
          style={{ fontSize: 16, color: T.red, lineHeight: 1 }}>✕</button>
      </div>

      <EnchantPicker item={item} sel={entry.sel}
        onChange={n => onUpdate({ ...entry, sel: n })} />
    </div>
  );
}

function SetBuilder({ onSavePreset, initialPreset }) {
  const [entries, setEntries] = useState(() => {
    if (initialPreset?.entries?.length) {
      return initialPreset.entries.map(e => ({ ...e, uid: ++setUid }));
    }
    return [newEntry()];
  })
  const [results, setResults] = useState({});
  const [presetName, setPresetName] = useState(initialPreset?.name || "");
  const [saved, setSaved] = useState(false);
  const resultsRef = useRef(null);

  const update = (uid, data) => setEntries(es => es.map(e => e.uid === uid ? data : e));
  const remove = uid => setEntries(es => es.filter(e => e.uid !== uid));
  const add = () => setEntries(es => [...es, newEntry()]);

  const calcAll = () => {
    const r = {};
    entries.forEach(e => {
      if (Object.keys(e.sel).length) {
        const item = ITEMS.find(i => i.id === e.itemId);
        r[e.uid] = solve(e.sel, item.name);
      }
    });
    setResults(r);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };

  const totalXp = Object.entries(results).reduce((sum, [uid, res]) => {
    const entry = entries.find(e => e.uid === parseInt(uid) || e.uid === uid);
    return sum + (res ? res.total * (entry?.qty || 1) : 0);
  }, 0);

  const hasSel = entries.some(e => Object.keys(e.sel).length > 0);

  const savePreset = () => {
    if (!presetName.trim()) return;
    onSavePreset({ type: "set", name: presetName.trim(), entries: entries.map(e => ({ ...e })) });
    setPresetName(""); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div style={{ marginBottom: 14, padding: "10px 14px", background: T.s2, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 11, color: T.muted, lineHeight: 1.8 }}>
        Build a full gear set. Add items, set quantities, pick enchants for each — then calculate the optimal XP cost for your entire set at once.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
        {entries.map(e => (
          <SetEntry key={e.uid} entry={e}
            onUpdate={data => update(e.uid, data)}
            onRemove={() => remove(e.uid)} />
        ))}
      </div>

      <button className="add-btn" onClick={add}
        style={{
          width: "100%", padding: "10px", marginBottom: 12,
          background: "transparent", border: `1.5px dashed ${T.border}`,
          borderRadius: 8, color: T.muted, fontSize: 12, fontFamily: "'IBM Plex Mono'"
        }}>
        + Add Item to Set
      </button>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
        <input value={presetName} onChange={e => setPresetName(e.target.value)}
          placeholder="save this set as..."
          style={{
            flex: 1, background: T.s3, border: `1px solid ${T.border}`, borderRadius: 5,
            padding: "6px 10px", fontSize: 11, color: T.text, outline: "none", fontFamily: "'IBM Plex Mono'"
          }} />
        <button onClick={savePreset} disabled={!presetName.trim() || !hasSel}
          style={{
            background: saved ? "rgba(74,222,128,.12)" : "rgba(166,110,255,.1)",
            border: `1px solid ${saved ? T.green : T.border}`, borderRadius: 5,
            padding: "6px 14px", fontSize: 11, color: saved ? T.green : T.muted, cursor: "pointer", fontFamily: "'IBM Plex Mono'", whiteSpace: "nowrap"
          }}>
          {saved ? "✓ saved" : "💾 save set"}
        </button>
        <button className="go-btn" onClick={calcAll} disabled={!hasSel}
          style={{
            padding: "6px 16px", borderRadius: 7,
            background: hasSel ? "linear-gradient(135deg,#5f1fd4,#a66eff)" : T.s2,
            color: hasSel ? "#fff" : "#333", border: `1.5px solid ${hasSel ? T.accent : T.border}`,
            fontFamily: "'Press Start 2P'", fontSize: 8, letterSpacing: .5, whiteSpace: "nowrap",
            boxShadow: hasSel ? "0 3px 14px rgba(166,110,255,.25)" : "none"
          }}>⚒ CALCULATE SET</button>
      </div>

      {Object.keys(results).length > 0 && (
        <div ref={resultsRef}>
          <Sec title="SET RESULTS">
            {entries.map(e => {
              const res = results[e.uid];
              const item = ITEMS.find(i => i.id === e.itemId);
              if (!res) return null;
              return (
                <div key={e.uid} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 16 }}>{item.em}</span>
                    <span style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>{item.name}</span>
                    {e.qty > 1 && <span style={{ fontSize: 10, color: T.accent, fontFamily: "'Press Start 2P'" }}>×{e.qty}</span>}
                    <span style={{ fontSize: 10, color: T.muted, marginLeft: "auto" }}>
                      {res.total} lvls/each{e.qty > 1 ? ` = ${res.total * e.qty} lvls total` : ""}
                    </span>
                  </div>
                  <ResultSteps result={res} item={item} compact={true} />
                </div>
              );
            })}
            <div style={{
              marginTop: 12, padding: "10px 14px", background: "#0a0818", border: `1px solid rgba(166,110,255,.2)`, borderRadius: 7,
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <span style={{ fontSize: 11, color: T.muted }}>Grand total XP across entire set</span>
              <span style={{ fontFamily: "'Press Start 2P'", fontSize: 11, color: T.accent }}>{totalXp} LEVELS</span>
            </div>
          </Sec>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  PRESETS TAB
// NOTE: using in-memory state. To persist across sessions,
//   swap `useState([])` with localStorage:
//   const [presets, setPresets] = useState(() => {
//     try { return JSON.parse(localStorage.getItem("mc_presets")||"[]"); } catch { return []; }
//   });
//   and after every setPresets call:
//   localStorage.setItem("mc_presets", JSON.stringify(updatedPresets));
// ═══════════════════════════════════════════════════════════
function PresetsPanel({ presets, onDelete, onLoad }) {
  const [expanded, setExpanded] = useState(null);
  const singles = presets.filter(p => p.type === "single");
  const sets = presets.filter(p => p.type === "set");

  if (!presets.length) return (
    <div style={{ textAlign: "center", padding: "48px 20px", color: T.muted }}>
      <div style={{ fontSize: 28, marginBottom: 12 }}>💾</div>
      <div style={{ fontFamily: "'Press Start 2P'", fontSize: 9, color: "#333", marginBottom: 10 }}>NO PRESETS SAVED</div>
      <p style={{ fontSize: 11, lineHeight: 1.7 }}>Save enchantment configs from the Calculator or Set Builder tabs.</p>
    </div>
  );

  const PresetCard = ({ p }) => {
    const isOpen = expanded === p.id;

    // Compute results for viewing
    const viewResults = useMemo(() => {
      if (!isOpen) return null;
      if (p.type === "single") {
        const item = ITEMS.find(i => i.id === p.itemId);
        return [{ item, sel: p.sel, result: solve(p.sel, item.name), qty: 1 }];
      } else {
        return p.entries.map(e => {
          const item = ITEMS.find(i => i.id === e.itemId);
          return { item, sel: e.sel, result: solve(e.sel, item.name), qty: e.qty };
        }).filter(e => Object.keys(e.sel).length > 0);
      }
    }, [isOpen, p]);

    const totalXp = viewResults?.reduce((s, r) => s + (r.result?.total || 0) * r.qty, 0) ?? 0;

    return (
      <div style={{ background: T.s2, border: `1px solid ${isOpen ? T.accent : T.border}`, borderRadius: 9, overflow: "hidden", marginBottom: 8 }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", cursor: "pointer" }}
          onClick={() => setExpanded(isOpen ? null : p.id)}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: T.text, marginBottom: 3 }}>{p.name}</div>
            <div style={{ fontSize: 10, color: T.muted }}>
              {p.type === "single"
                ? `${ITEMS.find(i => i.id === p.itemId)?.em} ${ITEMS.find(i => i.id === p.itemId)?.name} — ${Object.keys(p.sel).length} enchants`
                : `📦 Set — ${p.entries?.length} item type${p.entries?.length !== 1 ? "s" : ""}`}
            </div>
          </div>
          <button onClick={e => { e.stopPropagation(); onLoad(p); }}
            style={{
              background: "rgba(166,110,255,.1)", border: `1px solid rgba(166,110,255,.2)`, borderRadius: 5,
              padding: "5px 10px", fontSize: 10, color: T.accent, cursor: "pointer", fontFamily: "'IBM Plex Mono'", whiteSpace: "nowrap"
            }}>
            ✏ edit
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(p.id); setExpanded(null); }}
            className="rm-btn" style={{ fontSize: 14, color: T.red, background: "none", border: "none", lineHeight: 1, cursor: "pointer" }}>✕</button>
          <span style={{ color: T.muted, fontSize: 12 }}>{isOpen ? "▲" : "▼"}</span>
        </div>

        {/* Expanded viewer */}
        {isOpen && viewResults && (
          <div style={{ borderTop: `1px solid ${T.border}`, padding: "12px 14px", background: "#0a0a0a" }}>
            {viewResults.map(({ item, sel, result, qty }, i) => (
              <div key={i} style={{ marginBottom: i < viewResults.length - 1 ? 16 : 0 }}>
                {/* Item header */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 18 }}>{item.em}</span>
                  <span style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>{item.name}</span>
                  {qty > 1 && <span style={{ fontSize: 9, color: T.accent, fontFamily: "'Press Start 2P'" }}>×{qty}</span>}
                </div>

                {/* Enchant tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                  {Object.entries(sel).map(([id, lvl]) => (
                    <span key={id} style={{
                      fontSize: 10, padding: "2px 8px",
                      background: "rgba(166,110,255,.08)", border: "1px solid rgba(166,110,255,.15)",
                      borderRadius: 4, color: "#c4a3ff"
                    }}>
                      {E[id].name} {E[id].maxLvl > 1 ? rom(lvl) : ""}
                    </span>
                  ))}
                </div>

                {/* Steps */}
                <ResultSteps result={result} item={item} compact={true} />
              </div>
            ))}

            {/* Grand total for sets */}
            {p.type === "set" && viewResults.length > 1 && (
              <div style={{
                marginTop: 12, padding: "8px 12px", background: "#0a0818",
                border: "1px solid rgba(166,110,255,.2)", borderRadius: 6,
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <span style={{ fontSize: 10, color: T.muted }}>Grand total</span>
                <span style={{ fontFamily: "'Press Start 2P'", fontSize: 10, color: T.accent }}>{totalXp} LEVELS</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const Group = ({ title, items }) => items.length === 0 ? null : (
    <Sec title={title}>
      {items.map(p => <PresetCard key={p.id} p={p} />)}
    </Sec>
  );

  return (
    <div>
      <Group title="SINGLE ITEMS" items={singles} />
      <Group title="GEAR SETS" items={sets} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  APP ROOT
// ═══════════════════════════════════════════════════════════
let presetUid = 0;

export default function App() {
  const [tab, setTab] = useState("calc");
  const [presets, setPresets] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mc_presets") || "[]"); } catch { return []; }
  });
  const [loadMsg, setLoadMsg] = useState("");

  const savePreset = useCallback((preset) => {
    setPresets(ps => {
      const updated = [...ps, { ...preset, id: ++presetUid, createdAt: Date.now() }];
      localStorage.setItem("mc_presets", JSON.stringify(updated));  // ← missing
      return updated;
    });
  }, []);

  const deletePreset = useCallback((id) => {
    setPresets(ps => {
      const updated = ps.filter(p => p.id !== id);
      localStorage.setItem("mc_presets", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // For simplicity, loading a preset switches to the right tab and signals
  // via a message (full two-way binding would require lifting all state up further)
  const [loadedPreset, setLoadedPreset] = useState(null);

  const loadPreset = (p) => {
    setLoadedPreset(p);
    setTab(p.type === "set" ? "set" : "calc");
    setLoadMsg(`Preset "${p.name}" loaded`);
    setTimeout(() => setLoadMsg(""), 2500);
  };

  const tabs = [
    { id: "calc", label: "⚒ CALCULATOR" },
    { id: "set", label: "📦 SET BUILDER" },
    { id: "presets", label: `💾 PRESETS${presets.length ? ` (${presets.length})` : ""}` },
    { id: "materials", label: "⛏️ MATERIALS" },
    { id: "guide", label: "📖 GUIDE" },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight: "100vh", background: T.bg, padding: "24px 16px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: "#2a2a2a", fontFamily: "'IBM Plex Mono'", marginBottom: 8 }}>⟡ MINECRAFT TOOLS ⟡</div>
            <h1 style={{
              fontFamily: "'Press Start 2P'", fontSize: "clamp(12px,2.5vw,20px)", color: T.accent, lineHeight: 1.6,
              textShadow: "0 0 20px rgba(166,110,255,.6)"
            }}>
              ANVIL OPTIMIZER
            </h1>
            <p style={{ marginTop: 8, color: "#333", fontSize: 11 }}>Wiki · Presets · Set Builder · DP-optimized XP cost</p>
          </div>

          {/* Tabs */}
          <div style={{
            display: "flex", gap: 4, marginBottom: 20, background: T.surface,
            border: `1px solid ${T.border}`, borderRadius: 8, padding: 4
          }}>
            {tabs.map(t => (
              <button key={t.id} className="tab-btn" onClick={() => setTab(t.id)}
                style={{
                  flex: 1, padding: "9px 0", borderRadius: 5, border: "none",
                  background: tab === t.id ? T.accentBg : "transparent",
                  color: tab === t.id ? T.accent : T.muted,
                  fontFamily: "'Press Start 2P'", fontSize: "clamp(6px,1.2vw,9px)",
                  boxShadow: tab === t.id ? "inset 0 0 0 1px rgba(166,110,255,.25)" : "none",
                  cursor: "pointer",
                }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Load message toast */}
          {loadMsg && (
            <div style={{
              marginBottom: 12, padding: "8px 14px", background: "rgba(74,222,128,.08)",
              border: "1px solid rgba(74,222,128,.2)", borderRadius: 6, fontSize: 11, color: T.green
            }}>
              ✓ {loadMsg}
            </div>
          )}

          {/* Tab content */}
          {tab === "calc" && (
            <SingleCalc
              key={loadedPreset?.type === "single" ? loadedPreset.id : "s"}
              onSavePreset={savePreset}
              initialPreset={loadedPreset?.type === "single" ? loadedPreset : null}
            />
          )}
          {tab === "set" && (
            <SetBuilder
              key={loadedPreset?.type === "set" ? loadedPreset.id : "sb"}
              onSavePreset={savePreset}
              initialPreset={loadedPreset?.type === "set" ? loadedPreset : null}
            />
          )}
          {tab === "presets" && (
            <PresetsPanel
              presets={presets} onDelete={deletePreset} onLoad={loadPreset}
            />
          )}
          {tab === "materials" && (
            <MaterialCalc E={E} ITEMS={ITEMS} rom={rom} />
          )}
          {tab === "guide" && (
            <HowToUse />
          )}
        </div>
      </div>
    </>
  );
}
