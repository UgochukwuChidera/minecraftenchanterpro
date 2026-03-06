// ═══════════════════════════════════════════════════════════
//  ENCHANTMENT DATA
// ═══════════════════════════════════════════════════════════
export const E = {
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
    javaOnly: true,
    desc: "Increases the damage of sweep attacks. Java Edition only — does not exist on Bedrock.",
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
    javaOnly: true,
    desc: "Increases movement speed while sneaking. Java Edition only — does not exist on Bedrock.",
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
    desc: "Deals extra damage to aquatic mobs (Java). On Bedrock, affects ALL mobs in water or rain.",
    levels: ["I — +2.5 damage", "II — +5", "III — +7.5", "IV — +10", "V — +12.5 damage"],
    tip: "Java: only hits aquatic mobs (guardians, squid, axolotls). Bedrock: hits anything caught in rain — much stronger.",
    bedrockDesc: "Deals extra damage to ALL mobs and players caught in water or rain. Much more broadly useful than on Java.",
    bedrockTip: "Bedrock: hits anything in rain, making this strong in all rainy-weather combat. Java players: aquatic mobs only."
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

  // ── Spear (1.21.11 Mounts of Mayhem) ─────────────────
  lunge: {
    name: "Lunge", maxLvl: 3, mult: 2, incomp: [],
    desc: "Propels the player forward when performing a jab attack with a spear. Consumes hunger and durability per use.",
    levels: ["I — short forward burst", "II — medium burst", "III — strong burst"],
    tip: "Lunge III turns the spear into a mobility tool — jab to dash, then follow with a charge attack while moving fast for massive damage. Pair with Unbreaking and Mending to offset durability cost."
  },

  // ── Mace (1.21+) ─────────────────────────────────────
  density: {
    name: "Density", maxLvl: 5, mult: 1, incomp: ["breach"],
    desc: "Increases the mace's damage based on the height fallen before impact. Each level multiplies the fall-damage bonus.",
    levels: ["I — +0.5 dmg per block fallen", "II — +1.0", "III — +1.5", "IV — +2.0", "V — +2.5 per block fallen"],
    tip: "The higher you fall before hitting, the more damage dealt. Stack with Wind Burst for a loop of jumps and crits. Incompatible with Breach."
  },
  breach: {
    name: "Breach", maxLvl: 4, mult: 2, incomp: ["density"],
    desc: "Reduces the effectiveness of the target's armor when hit with the mace.",
    levels: ["I — 15% armor reduction", "II — 30%", "III — 45%", "IV — 60% armor bypass"],
    tip: "Powerful against heavily armoured players in PvP. Incompatible with Density — choose one based on your playstyle."
  },
  wind_burst: {
    name: "Wind Burst", maxLvl: 3, mult: 4, incomp: [],
    desc: "Launches the attacker upward when they kill an enemy with a mace smash attack, allowing chained aerial attacks.",
    levels: ["I — moderate upward launch", "II — strong launch", "III — very strong launch"],
    tip: "Enables an aerial loop: fall → smash → Wind Burst launches you up → repeat. Expensive (×4 mult) but defines the mace's identity."
  },
};

export const ITEMS = [
  { id: "sword",       name: "Sword",       em: "⚔️",  enc: ["sharpness","smite","bane","knockback","fire_aspect","looting","sweeping","mending","unbreaking","curse_van"] },
  { id: "pickaxe",     name: "Pickaxe",     em: "⛏️",  enc: ["efficiency","silk_touch","fortune","mending","unbreaking","curse_van"] },
  { id: "axe",         name: "Axe",         em: "🪓",  enc: ["sharpness","smite","bane","efficiency","silk_touch","fortune","mending","unbreaking","curse_van"] },
  { id: "shovel",      name: "Shovel",      em: "🪣",  enc: ["efficiency","silk_touch","fortune","mending","unbreaking","curse_van"] },
  { id: "hoe",         name: "Hoe",         em: "🌿",  enc: ["efficiency","silk_touch","fortune","mending","unbreaking","curse_van"] },
  { id: "bow",         name: "Bow",         em: "🏹",  enc: ["power","punch","flame","infinity","mending","unbreaking","curse_van"] },
  { id: "crossbow",    name: "Crossbow",    em: "🎯",  enc: ["multishot","quick_charge","piercing","mending","unbreaking","curse_van"] },
  { id: "helmet",      name: "Helmet",      em: "🪖",  enc: ["protection","blast_prot","fire_prot","proj_prot","thorns","respiration","aqua_affinity","mending","unbreaking","curse_van","curse_bind","soul_speed"] },
  { id: "chestplate",  name: "Chestplate",  em: "🛡️",  enc: ["protection","blast_prot","fire_prot","proj_prot","thorns","mending","unbreaking","curse_van","curse_bind"] },
  { id: "leggings",    name: "Leggings",    em: "👖",  enc: ["protection","blast_prot","fire_prot","proj_prot","thorns","mending","unbreaking","curse_van","curse_bind","swift_sneak"] },
  { id: "boots",       name: "Boots",       em: "🥾",  enc: ["protection","blast_prot","fire_prot","proj_prot","feather_fall","thorns","depth_strider","frost_walker","mending","unbreaking","curse_van","curse_bind","soul_speed"] },
  { id: "fishing_rod", name: "Fishing Rod", em: "🎣",  enc: ["luck_of_sea","lure","mending","unbreaking","curse_van"] },
  { id: "trident",     name: "Trident",     em: "🔱",  enc: ["loyalty","impaling","riptide","channeling","mending","unbreaking","curse_van"] },
  { id: "spear",       name: "Spear",       em: "🗡️",  enc: ["sharpness","smite","bane","knockback","fire_aspect","looting","lunge","mending","unbreaking","curse_van"] },
  { id: "mace",        name: "Mace",        em: "🪄",  enc: ["density","breach","wind_burst","smite","bane","fire_aspect","looting","mending","unbreaking","curse_van"] },
  { id: "shield",      name: "Shield",      em: "🛡",  enc: ["unbreaking","mending","curse_van"] },
];
