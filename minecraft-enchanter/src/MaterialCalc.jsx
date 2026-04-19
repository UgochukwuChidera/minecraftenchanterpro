// ═══════════════════════════════════════════════════════════
//  MATERIAL CALCULATOR  — standalone component
//  Requires E, ITEMS, rom from the main enchant-optimizer file
//  Import: import MaterialCalc from './MaterialCalc';
//  Usage:  <MaterialCalc E={E} ITEMS={ITEMS} rom={rom} />
// ═══════════════════════════════════════════════════════════
import { useState, useMemo } from "react";

const T = {
  bg: "#080808", surface: "#0f0f0f", s2: "#111111", s3: "#161616",
  border: "#1e1e1e", b2: "#252525",
  accent: "#a66eff", accentBg: "rgba(166,110,255,0.08)",
  text: "#e0e0e0", muted: "#555", muted2: "#888",
  green: "#4ade80", red: "#f87171", yellow: "#fbbf24", blue: "#93c5fd", orange: "#fb923c",
};

// ── Tiers ────────────────────────────────────────────────
const TIERS = {
  wood:         { name: "Wood",           em: "🪵", color: "#a16207" },
  stone:        { name: "Stone",          em: "🪨", color: "#78716c" },
  iron:         { name: "Iron",           em: "⚙️",  color: "#9ca3af" },
  gold:         { name: "Gold",           em: "⭐", color: "#eab308" },
  diamond:      { name: "Diamond",        em: "💎", color: "#67e8f9" },
  netherite:    { name: "Netherite",      em: "🔥", color: "#a855f7" },
  leather:      { name: "Leather",        em: "🐄", color: "#b45309" },
  chainmail:    { name: "Chainmail",      em: "🔗", color: "#6b7280" },
  turtle_shell: { name: "Turtle Shell",   em: "🐢", color: "#16a34a" },
};

// ── Which tiers each item supports ───────────────────────
const ITEM_TIERS = {
  sword:       ["wood","stone","iron","gold","diamond","netherite"],
  pickaxe:     ["wood","stone","iron","gold","diamond","netherite"],
  axe:         ["wood","stone","iron","gold","diamond","netherite"],
  shovel:      ["wood","stone","iron","gold","diamond","netherite"],
  hoe:         ["wood","stone","iron","gold","diamond","netherite"],
  bow:         ["_fixed"],
  crossbow:    ["_fixed"],
  helmet:      ["leather","chainmail","iron","gold","diamond","netherite","turtle_shell"],
  chestplate:  ["leather","chainmail","iron","gold","diamond","netherite"],
  leggings:    ["leather","chainmail","iron","gold","diamond","netherite"],
  boots:       ["leather","chainmail","iron","gold","diamond","netherite"],
  fishing_rod: ["_fixed"],
  trident:     ["_found"],
};

// ── Base durability ───────────────────────────────────────
const DURABILITY = {
  sword:       { wood:59, stone:131, iron:250, gold:32,  diamond:1561, netherite:2031 },
  pickaxe:     { wood:59, stone:131, iron:250, gold:32,  diamond:1561, netherite:2031 },
  axe:         { wood:59, stone:131, iron:250, gold:32,  diamond:1561, netherite:2031 },
  shovel:      { wood:59, stone:131, iron:250, gold:32,  diamond:1561, netherite:2031 },
  hoe:         { wood:59, stone:131, iron:250, gold:32,  diamond:1561, netherite:2031 },
  bow:         { _fixed:384 },
  crossbow:    { _fixed:326 },
  helmet:      { leather:55, chainmail:165, iron:165, gold:77,  diamond:363, netherite:407, turtle_shell:275 },
  chestplate:  { leather:80, chainmail:240, iron:240, gold:112, diamond:528, netherite:592 },
  leggings:    { leather:75, chainmail:225, iron:225, gold:105, diamond:495, netherite:555 },
  boots:       { leather:65, chainmail:195, iron:195, gold:91,  diamond:429, netherite:481 },
  fishing_rod: { _fixed:64 },
  trident:     { _found:250 },
};

// ── Crafting recipes  (returns object of {material: count}) ──
// primary = the "main" material (ingot/gem/plank/etc)
function recipe(itemId, tier) {
  const primary = (t) => {
    if (t === "wood") return "Oak Plank";
    if (t === "stone") return "Cobblestone";
    if (t === "iron") return "Iron Ingot";
    if (t === "gold") return "Gold Ingot";
    if (t === "diamond") return "Diamond";
    if (t === "netherite") return null; // special upgrade
    if (t === "leather") return "Leather";
    if (t === "chainmail") return null; // found only
    if (t === "turtle_shell") return "Scute";
    return null;
  };

  const mats = {};
  const add = (k, v) => { mats[k] = (mats[k] || 0) + v; };

  // Tools/weapons (tiered)
  const toolUnits = { sword:2, pickaxe:3, axe:3, shovel:1, hoe:2 };
  if (toolUnits[itemId] !== undefined) {
    if (tier === "netherite") {
      add("Diamond " + { sword:"Sword", pickaxe:"Pickaxe", axe:"Axe", shovel:"Shovel", hoe:"Hoe" }[itemId], 1);
      add("Netherite Ingot", 1);
      add("Netherite Upgrade Template", 1);
    } else if (tier === "chainmail") {
      mats["_chainmail_note"] = true;
    } else {
      const p = primary(tier);
      if (p) add(p, toolUnits[itemId]);
      // sticks
      const stickCounts = { sword:1, pickaxe:2, axe:2, shovel:2, hoe:2 };
      add("Stick", stickCounts[itemId]);
    }
    return mats;
  }

  // Armor (tiered)
  const armorUnits = { helmet:5, chestplate:8, leggings:7, boots:4 };
  if (armorUnits[itemId] !== undefined) {
    if (tier === "netherite") {
      const dBase = { helmet:"Helmet", chestplate:"Chestplate", leggings:"Leggings", boots:"Boots" }[itemId];
      add("Diamond " + dBase, 1);
      add("Netherite Ingot", 1);
      add("Netherite Upgrade Template", 1);
    } else if (tier === "chainmail") {
      mats["_chainmail_note"] = true;
    } else if (tier === "turtle_shell") {
      add("Scute", 5); // helmet only
    } else {
      const p = primary(tier);
      if (p) add(p, armorUnits[itemId]);
    }
    return mats;
  }

  if (itemId === "bow") {
    add("Stick", 3); add("String", 3);
    return mats;
  }
  if (itemId === "crossbow") {
    add("Stick", 3); add("String", 2); add("Iron Ingot", 1);
    add("Tripwire Hook", 1); // = 1 iron ingot + 1 stick + 1 oak plank
    mats["_tripwire_note"] = true;
    return mats;
  }
  if (itemId === "fishing_rod") {
    add("Stick", 3); add("String", 2);
    return mats;
  }
  if (itemId === "trident") {
    mats["_found_note"] = true;
    return mats;
  }

  return mats;
}

// ── Unbreaking effective multiplier ──────────────────────
// Tools: each use has 1/(lvl+1) chance of consuming durability → effective ×(lvl+1)
// Armor: same formula per hit
function unbreakingMult(lvl) {
  if (!lvl) return 1;
  return lvl + 1; // I→2x, II→3x, III→4x
}

// ── Book materials ────────────────────────────────────────
// 1 book = 3 paper + 1 leather; 1 paper = 3 sugar cane
function bookMaterials(n) {
  return { "Book (for enchanting)": n, "Paper": n * 3, "Sugar Cane": n * 9, "Leather": n };
}

// ── Anvil recipe ──────────────────────────────────────────
// 3 iron blocks (27) + 4 iron ingots = 31 iron ingots
const ANVIL_MATS = { "Iron Ingot (for Anvil)": 31 };

// ── Section wrapper ───────────────────────────────────────
function Sec({ label, title, children }) {
  return (
    <div className="section-card" style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        {label && <span style={{ fontFamily: "'Press Start 2P'", fontSize: 7, color: "#333" }}>{label}</span>}
        <div style={{ flex: 1, height: 1, background: T.border }} />
        <span style={{ fontFamily: "'Press Start 2P'", fontSize: 8, color: T.accent }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

// ── Material row ──────────────────────────────────────────
function MatRow({ icon, label, qty, sub, color }) {
  return (
    <div className="mat-row" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 10px",
      background: T.s2, border: `1px solid ${T.border}`, borderRadius: 6, marginBottom: 5 }}>
      {icon && <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>}
      <span style={{ flex: 1, fontSize: 12, color: color || T.text, minWidth: 0 }}>{label}</span>
      {sub && <span style={{ fontSize: 10, color: T.muted }}>{sub}</span>}
      <span style={{ fontFamily: "'Press Start 2P'", fontSize: 10,
        color: color || T.accent, minWidth: 30, textAlign: "right" }}>×{qty}</span>
    </div>
  );
}

// ── Material icons map ────────────────────────────────────
const MAT_ICONS = {
  "Oak Plank": "🪵", "Cobblestone": "🪨", "Iron Ingot": "⚙️", "Gold Ingot": "⭐",
  "Diamond": "💎", "Netherite Ingot": "🔥", "Leather": "🐄", "Scute": "🐢",
  "Stick": "🥢", "String": "🕸️", "Tripwire Hook": "🪝",
  "Book (for enchanting)": "📖", "Paper": "📄", "Sugar Cane": "🌿",
  "Iron Ingot (for Anvil)": "🔨",
  "Netherite Upgrade Template": "🗺️",
};

// ── Enchantment picker (simplified — just checkboxes, no wiki) ─
function SimplePicker({ item, sel, onChange, E, rom }) {
  const incomp = useMemo(() => {
    const s = new Set();
    Object.keys(sel).forEach(id => E[id].incomp.forEach(x => s.add(x)));
    return s;
  }, [sel, E]);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {item.enc.map(id => {
        const enc = E[id];
        const active = !!sel[id];
        const blocked = incomp.has(id) && !active;
        return (
          <div key={id}
            onClick={() => {
              if (blocked) return;
              const n = { ...sel };
              if (n[id]) delete n[id]; else n[id] = enc.maxLvl;
              onChange(n);
            }}
            style={{
              padding: "5px 10px", borderRadius: 5, cursor: blocked ? "not-allowed" : "pointer",
              background: active ? T.accentBg : T.s2,
              border: `1px solid ${active ? "rgba(166,110,255,.3)" : T.border}`,
              fontSize: 11, color: active ? "#c4a3ff" : blocked ? "#333" : T.muted2,
              userSelect: "none", transition: "all .1s",
              opacity: blocked ? .3 : 1,
            }}>
            {enc.name}{enc.maxLvl > 1 ? ` ${rom(enc.maxLvl)}` : ""}
          </div>
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────
export default function MaterialCalc({ E, ITEMS, rom }) {
  const [itemId, setItemId] = useState("sword");
  const [tier, setTier] = useState("diamond");
  const [qty, setQty] = useState(1);
  const [sel, setSel] = useState({});
  const [includeAnvil, setIncludeAnvil] = useState(true);
  const [includeBooks, setIncludeBooks] = useState(true);

  const item = ITEMS.find(i => i.id === itemId);
  const tiers = ITEM_TIERS[itemId] || [];
  const isFixed = tiers[0] === "_fixed";
  const isFound = tiers[0] === "_found";
  const activeTier = isFixed ? "_fixed" : isFound ? "_found" : tier;

  // Reset tier when item changes if current tier not valid
  const handleItemChange = (id) => {
    setItemId(id);
    setSel({});
    const newTiers = ITEM_TIERS[id] || [];
    if (!newTiers.includes(tier) && newTiers[0] !== "_fixed" && newTiers[0] !== "_found") {
      setTier(newTiers[0] || "iron");
    }
  };

  const baseDur = useMemo(() => {
    const d = DURABILITY[itemId];
    if (!d) return 0;
    return d[activeTier] || 0;
  }, [itemId, activeTier]);

  const unbreakingLvl = sel["unbreaking"] || 0;
  const hasMending = !!sel["mending"];
  const effectiveDur = Math.round(baseDur * unbreakingMult(unbreakingLvl));

  const itemMats = useMemo(() => recipe(itemId, activeTier), [itemId, activeTier]);
  const bookCount = Object.keys(sel).length;
  const bookMats = useMemo(
    () => (includeBooks && bookCount > 0 ? bookMaterials(bookCount) : {}),
    [includeBooks, bookCount]
  );
  const anvilMats = useMemo(
    () => (includeAnvil ? ANVIL_MATS : {}),
    [includeAnvil]
  );

  // Combine all mats × qty (item mats scale with qty, books/anvil are one-time)
  const totalMats = useMemo(() => {
    const all = {};
    const add = (k, v) => { if (!k.startsWith("_")) all[k] = (all[k] || 0) + v; };

    Object.entries(itemMats).forEach(([k, v]) => {
      if (!k.startsWith("_")) add(k, v * qty);
    });
    Object.entries(bookMats).forEach(([k, v]) => add(k, v));
    Object.entries(anvilMats).forEach(([k, v]) => add(k, v));

    return all;
  }, [itemMats, bookMats, anvilMats, qty]);

  const notes = [];
  if (itemMats["_chainmail_note"]) notes.push("Chainmail cannot be crafted — obtain from drops or trading.");
  if (itemMats["_found_note"]) notes.push("Tridents cannot be crafted — they drop from Drowned mobs (8.5% chance, +1% per Looting level).");
  if (itemMats["_tripwire_note"]) notes.push("Tripwire Hook requires: 1 Iron Ingot + 1 Stick + 1 Oak Plank.");

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      <style>{`
        .mc-item-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(84px,1fr));gap:8px;margin-bottom:14px}
        .mc-tier-wrap{display:flex;flex-wrap:wrap;gap:8px}
        .mc-qty-wrap{display:flex;align-items:center;gap:10px;margin-top:14px;flex-wrap:wrap}
        @media (max-width:767px){
          .mc-item-grid{grid-template-columns:repeat(auto-fill,minmax(78px,1fr))}
          .mat-row{flex-wrap:wrap}
          .mat-row > span:last-child{margin-left:auto}
        }
      `}</style>

      {/* Item selector */}
      <Sec label="01" title="ITEM & MATERIAL">
        <div className="mc-item-grid">
          {ITEMS.map(it => (
            <div key={it.id} onClick={() => handleItemChange(it.id)}
              style={{
                background: itemId === it.id ? "#160e28" : T.s2,
                border: `1.5px solid ${itemId === it.id ? T.accent : T.border}`,
                borderRadius: 7, padding: "7px 4px", textAlign: "center", cursor: "pointer",
                transition: "all .1s",
              }}>
              <div style={{ fontSize: 20, height: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {it.icon
                  ? <img src={it.icon} alt={it.name} style={{ width: 22, height: 22, objectFit: "contain", imageRendering: "crisp-edges" }} />
                  : it.em}
              </div>
              <div style={{ marginTop: 3, fontSize: 6, color: itemId === it.id ? "#c4a3ff" : "#555",
                fontFamily: "'Press Start 2P'", lineHeight: 1.5 }}>{it.name.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Tier selector */}
        {!isFixed && !isFound && (
          <div>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 7 }}>MATERIAL TIER</div>
            <div className="mc-tier-wrap">
              {tiers.map(t => {
                const td = TIERS[t];
                if (!td) return null;
                return (
                  <div key={t} onClick={() => setTier(t)}
                    style={{
                      padding: "10px 12px", borderRadius: 6, cursor: "pointer", minHeight: 40,
                      background: tier === t ? `${td.color}18` : T.s2,
                      border: `1.5px solid ${tier === t ? td.color : T.border}`,
                      fontSize: 12, color: tier === t ? td.color : T.muted,
                      display: "flex", alignItems: "center", gap: 6, transition: "all .1s",
                    }}>
                    <span>{td.em}</span> {td.name}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {isFixed && <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>This item has a fixed material — no tier selection needed.</div>}
        {isFound && <div style={{ fontSize: 11, color: T.red, marginTop: 4 }}>⚠ Tridents cannot be crafted. See notes below.</div>}

        {/* Quantity */}
        <div className="mc-qty-wrap">
          <span style={{ fontSize: 11, color: T.muted }}>QUANTITY</span>
          <button onClick={() => setQty(q => Math.max(1, q - 1))}
            style={{ width: 36, height: 36, background: T.s3, border: `1px solid ${T.border}`,
              borderRadius: 5, cursor: "pointer", color: T.muted, fontSize: 14 }}>−</button>
          <span style={{ fontFamily: "'Press Start 2P'", fontSize: 12, color: T.accent, minWidth: 20, textAlign: "center" }}>{qty}</span>
          <button onClick={() => setQty(q => Math.min(64, q + 1))}
            style={{ width: 36, height: 36, background: T.s3, border: `1px solid ${T.border}`,
              borderRadius: 5, cursor: "pointer", color: T.muted, fontSize: 14 }}>+</button>
          {qty > 1 && <span style={{ fontSize: 10, color: T.muted }}>crafting {qty}×</span>}
        </div>
      </Sec>

      {/* Enchantments */}
      <Sec label="02" title="ENCHANTMENTS (FOR BOOKS)">
        <SimplePicker item={item} sel={sel} onChange={setSel} E={E} rom={rom} />
        {bookCount > 0 && (
          <div style={{ marginTop: 10, fontSize: 11, color: T.muted }}>
            {bookCount} book{bookCount !== 1 ? "s" : ""} needed
            {unbreakingLvl > 0 && <span style={{ color: T.blue, marginLeft: 8 }}>
              · Unbreaking {["","I","II","III"][unbreakingLvl]} selected
            </span>}
            {hasMending && <span style={{ color: T.green, marginLeft: 8 }}>· Mending selected</span>}
          </div>
        )}
      </Sec>

      {/* Options */}
      <Sec label="03" title="OPTIONS">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { key: "includeAnvil", label: "Include Anvil (31 iron ingots)", val: includeAnvil, set: setIncludeAnvil },
            { key: "includeBooks", label: "Include enchanted book materials (paper, leather)", val: includeBooks, set: setIncludeBooks },
          ].map(opt => (
            <div key={opt.key} onClick={() => opt.set(v => !v)}
              style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                padding: "8px 10px", borderRadius: 6, background: opt.val ? T.accentBg : "transparent",
                border: `1px solid ${opt.val ? "rgba(166,110,255,.15)" : T.border}` }}>
              <div style={{ width: 16, height: 16, borderRadius: 3, flexShrink: 0,
                border: `1.5px solid ${opt.val ? T.accent : "#333"}`,
                background: opt.val ? T.accent : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff" }}>
                {opt.val && "✓"}
              </div>
              <span style={{ fontSize: 12, color: opt.val ? "#d4baff" : T.muted2 }}>{opt.label}</span>
            </div>
          ))}
        </div>
      </Sec>

      {/* Durability */}
      <Sec label="04" title="EXPECTED DURABILITY">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "9px 12px", background: T.s2, border: `1px solid ${T.border}`, borderRadius: 7 }}>
            <span style={{ fontSize: 12, color: T.muted2 }}>Base durability</span>
            <span style={{ fontFamily: "'Press Start 2P'", fontSize: 10, color: T.muted2 }}>{baseDur.toLocaleString()}</span>
          </div>

          {unbreakingLvl > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "9px 12px", background: "#0d1422", border: "1px solid #1a2a40", borderRadius: 7 }}>
              <span style={{ fontSize: 12, color: T.blue }}>
                With Unbreaking {["","I","II","III"][unbreakingLvl]} (×{unbreakingMult(unbreakingLvl)})
              </span>
              <span style={{ fontFamily: "'Press Start 2P'", fontSize: 10, color: T.blue }}>{effectiveDur.toLocaleString()}</span>
            </div>
          )}

          {hasMending && (
            <div style={{ padding: "8px 12px", background: "rgba(74,222,128,.06)",
              border: "1px solid rgba(74,222,128,.2)", borderRadius: 7, fontSize: 11, color: T.green }}>
              ✨ Mending will repair this item using XP orbs (2 durability per XP point) — effectively making it last indefinitely with a XP farm.
            </div>
          )}

          {!hasMending && effectiveDur > 0 && (
            <div style={{ padding: "8px 12px", background: T.s3,
              border: `1px solid ${T.border}`, borderRadius: 7, fontSize: 11, color: T.muted }}>
              Without Mending, this item will eventually break. Consider adding Mending for indefinite use.
            </div>
          )}
        </div>
      </Sec>

      {/* Materials summary */}
      <Sec label="05" title="RAW MATERIALS NEEDED">
        {Object.keys(totalMats).length === 0 ? (
          <div style={{ fontSize: 12, color: T.muted, textAlign: "center", padding: "20px 0" }}>
            No craftable materials — check notes below.
          </div>
        ) : (
          <>
            {/* Group by category */}
            {(() => {
              const craftingMats = {};
              const bookingMats = {};
              const anvilM = {};

              Object.entries(totalMats).forEach(([k, v]) => {
                if (k.includes("for Anvil")) anvilM[k] = v;
                else if (["Book (for enchanting)", "Paper", "Sugar Cane", "Leather"].includes(k)) bookingMats[k] = v;
                else craftingMats[k] = v;
              });

              return (
                <>
                  {Object.keys(craftingMats).length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 9, color: T.muted, fontFamily: "'Press Start 2P'", marginBottom: 7 }}>
                        ITEM CRAFTING {qty > 1 ? `(×${qty})` : ""}
                      </div>
                      {Object.entries(craftingMats).map(([k, v]) => (
                        <MatRow key={k} icon={MAT_ICONS[k] || "📦"} label={k} qty={v} />
                      ))}
                    </div>
                  )}

                  {Object.keys(bookingMats).length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 9, color: T.muted, fontFamily: "'Press Start 2P'", marginBottom: 7 }}>
                        ENCHANTED BOOKS ({bookCount} books)
                      </div>
                      {Object.entries(bookingMats).map(([k, v]) => (
                        <MatRow key={k} icon={MAT_ICONS[k] || "📦"} label={k} qty={v} color={T.blue} />
                      ))}
                    </div>
                  )}

                  {Object.keys(anvilM).length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 9, color: T.muted, fontFamily: "'Press Start 2P'", marginBottom: 7 }}>
                        ANVIL (3 Iron Blocks + 4 Iron Ingots)
                      </div>
                      {Object.entries(anvilM).map(([k, v]) => (
                        <MatRow key={k} icon={MAT_ICONS[k] || "🔨"} label={k} qty={v} color={T.orange} />
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </>
        )}

        {/* Notes */}
        {notes.length > 0 && (
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            {notes.map((n, i) => (
              <div key={i} style={{ padding: "8px 12px", background: "rgba(251,191,36,.06)",
                border: "1px solid rgba(251,191,36,.15)", borderRadius: 6, fontSize: 11, color: "#fde68a" }}>
                ⚠ {n}
              </div>
            ))}
          </div>
        )}
      </Sec>
    </div>
  );
}
