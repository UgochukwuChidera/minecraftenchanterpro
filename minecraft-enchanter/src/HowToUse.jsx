// ═══════════════════════════════════════════════════════════
//  HOW TO USE  — standalone guide component
//  Import and render anywhere: <HowToUse />
// ═══════════════════════════════════════════════════════════
import { useState } from "react";

const T = {
  bg: "#080808", surface: "#0f0f0f", s2: "#111111", s3: "#161616",
  border: "#1e1e1e", b2: "#252525",
  accent: "#a66eff", accentBg: "rgba(166,110,255,0.08)",
  text: "#e0e0e0", muted: "#555", muted2: "#888",
  green: "#4ade80", red: "#f87171", yellow: "#fbbf24", blue: "#93c5fd", orange: "#fb923c",
};

const SECTIONS = [
  {
    id: "overview",
    icon: "🧭",
    title: "Overview",
    content: [
      {
        type: "p",
        text: "The Anvil Optimizer calculates the cheapest possible XP cost to enchant any item in Minecraft by finding the optimal order to combine books on an anvil. It uses dynamic programming to try every possible combining sequence and picks the one that minimises total levels spent."
      },
      {
        type: "callout",
        color: "purple",
        text: "Every time you use an anvil on an item its work penalty doubles. The key insight: combine books WITH books first, apply the final mega-book to the item last — so the item only touches the anvil once."
      },
      {
        type: "p",
        text: "The app has four tabs: Calculator (single item), Set Builder (full gear sets), Presets (saved configs), and Materials (raw resource planner)."
      }
    ]
  },
  {
    id: "calculator",
    icon: "⚒",
    title: "Calculator Tab",
    content: [
      { type: "step", num: 1, title: "Choose your item", text: "Click the item type you want to enchant. The enchantment list below will update to show only valid enchants for that item." },
      { type: "step", num: 2, title: "Select enchantments", text: "Check the enchants you want. For multi-level enchants (Sharpness I–V) use the roman numeral buttons to pick the level. Incompatible enchants (e.g. Silk Touch when Fortune is selected) will grey out automatically." },
      { type: "step", num: 3, title: "Read the wiki", text: "Click the ⓘ button next to any enchant to expand a full description, per-level breakdown, and a tip about when to use it." },
      { type: "step", num: 4, title: "Calculate", text: "Hit the Calculate button. You'll see a numbered step-by-step list. Each step shows exactly what to put in the LEFT slot (target) and RIGHT slot (sacrifice) of your anvil, plus the XP cost for that step." },
      { type: "step", num: 5, title: "Save as preset", text: "Type a name in the preset field and click 💾 save to store the config for later." },
      {
        type: "callout",
        color: "yellow",
        text: "The LEFT slot is always the item you keep. The RIGHT slot is always the sacrifice. Never swap them — the work penalty applies to the item in the LEFT slot and misplacing it wastes levels."
      },
    ]
  },
  {
    id: "anvil",
    icon: "📐",
    title: "Understanding Anvil Cost",
    content: [
      {
        type: "p",
        text: "Each anvil step costs: Prior Work Penalty (left) + Prior Work Penalty (right) + Enchantment Cost."
      },
      {
        type: "table",
        headers: ["Thing", "Formula", "Example"],
        rows: [
          ["Prior Work Penalty", "2ⁿ − 1 (n = times used)", "Used twice → 2²−1 = 3 levels"],
          ["Enchantment Cost", "Level × Multiplier", "Sharpness V = 5 × 1 = 5 levels"],
          ["Multiplier varies", "1× common, 2× medium, 4–8× rare", "Thorns III = 3 × 4 = 12 levels"],
          ["Too Expensive", "Any step > 39 levels", "Shown in red — item is unusable"],
        ]
      },
      {
        type: "callout",
        color: "red",
        text: "If a step shows red (>39 levels), that combination is impossible in Survival. Remove the most expensive enchant (Thorns, Soul Speed, Curses have ×4–8 multipliers) or start with a fresh item with zero prior work penalty."
      }
    ]
  },
  {
    id: "setbuilder",
    icon: "📦",
    title: "Set Builder Tab",
    content: [
      { type: "step", num: 1, title: "Add items", text: "Click '+ Add Item to Set'. Each entry has its own item type selector, quantity stepper, and full enchant picker." },
      { type: "step", num: 2, title: "Set quantities", text: "Use the − / + buttons to set how many of each item you're crafting (e.g. 3 pickaxes for different purposes). The total XP will multiply accordingly." },
      { type: "step", num: 3, title: "Enchant each item independently", text: "Each item in the set has its own enchant selection. Incompatibility rules apply per-item, not across the whole set." },
      { type: "step", num: 4, title: "Calculate Set", text: "Hit Calculate Set. Each item shows its own step-by-step (click to expand), plus a grand total XP across the entire set." },
      { type: "step", num: 5, title: "Save the set", text: "Name and save the entire set as a preset — it saves all items, quantities, and enchants together." },
    ]
  },
  {
    id: "presets",
    icon: "💾",
    title: "Presets Tab",
    content: [
      { type: "step", num: 1, title: "View a preset", text: "Click any preset card to expand it. You'll see enchant tags and the full calculated step-by-step — no need to recalculate." },
      { type: "step", num: 2, title: "Edit a preset", text: "Click ✏ edit on any card. This loads the preset into the Calculator or Set Builder tab with all settings pre-filled so you can tweak and re-save." },
      { type: "step", num: 3, title: "Delete a preset", text: "Click ✕ on the card header. Presets are stored in localStorage and persist across page refreshes." },
      {
        type: "callout",
        color: "blue",
        text: "When you load a preset to edit and save it again with the same name, it creates a new entry rather than overwriting. Delete the old one manually if you want to replace it."
      }
    ]
  },
  {
    id: "materials",
    icon: "⛏️",
    title: "Materials Tab",
    content: [
      { type: "step", num: 1, title: "Select item + tier", text: "Choose the item type and the material tier (Iron, Diamond, Netherite, etc). The crafting recipe and base durability will appear." },
      { type: "step", num: 2, title: "Set quantity", text: "How many of this item are you crafting? All material costs scale proportionally." },
      { type: "step", num: 3, title: "Select enchantments", text: "Pick the enchants you want — the calculator will count how many books you need and add paper + leather to the total." },
      { type: "step", num: 4, title: "Include anvil", text: "Toggle 'Include Anvil' to add 31 iron ingots for crafting the anvil itself (3 iron blocks + 4 iron ingots)." },
      { type: "step", num: 5, title: "Read the summary", text: "The output shows every raw material needed, effective durability (factoring in Unbreaking level), and a Mending note if applicable." },
      {
        type: "callout",
        color: "green",
        text: "Netherite items can't be directly crafted — they're upgraded from Diamond using 1 Netherite Ingot + 1 Netherite Upgrade Smithing Template per item. The material calc accounts for this."
      }
    ]
  },
  {
    id: "tips",
    icon: "💡",
    title: "Pro Tips",
    content: [
      { type: "tip", text: "Always use max-level books from librarian villagers (lock them with a workstation). Combining Sharpness I + Sharpness I into Sharpness II wastes XP and adds prior work penalty." },
      { type: "tip", text: "Mending is mutually exclusive with Infinity on bows. Choose Mending + no Infinity if you have a XP farm; Infinity if you don't." },
      { type: "tip", text: "Sweeping Edge (Java only) is extremely powerful in mob grinders — don't skip it on your sword if you're on Java." },
      { type: "tip", text: "The cheapest full Protection IV armour set costs around 90–110 XP levels total if you use fresh items and pre-combined books." },
      { type: "tip", text: "Gold tools have terrible durability (32 uses) but can receive any enchantment from a table at high levels. Only use gold if you need a specific enchant you can't get otherwise." },
      { type: "tip", text: "Swift Sneak (×8 multiplier) and Soul Speed (×4) are the most expensive enchants to apply via anvil. Always get these as pre-enchanted items from loot, never combine manually if avoidable." },
    ]
  }
];

function Callout({ color, text }) {
  const colors = {
    purple: { bg: "rgba(166,110,255,.07)", border: "rgba(166,110,255,.2)", text: "#c4a3ff" },
    yellow: { bg: "rgba(251,191,36,.06)", border: "rgba(251,191,36,.2)", text: "#fde68a" },
    red:    { bg: "rgba(239,68,68,.06)",  border: "rgba(239,68,68,.2)",  text: "#fca5a5" },
    blue:   { bg: "rgba(147,197,253,.06)",border: "rgba(147,197,253,.2)",text: "#bae6fd" },
    green:  { bg: "rgba(74,222,128,.06)", border: "rgba(74,222,128,.2)", text: "#bbf7d0" },
  };
  const c = colors[color] || colors.purple;
  return (
    <div style={{ padding: "10px 14px", background: c.bg, border: `1px solid ${c.border}`,
      borderRadius: 7, fontSize: 12, color: c.text, lineHeight: 1.7, marginTop: 10 }}>
      {text}
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <div style={{ overflowX: "auto", marginTop: 10 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{ padding: "7px 10px", background: "#0d0d0d",
                border: `1px solid ${T.border}`, color: T.accent,
                fontFamily: "'Press Start 2P'", fontSize: 7, textAlign: "left", whiteSpace: "nowrap" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? T.s2 : T.s3 }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "7px 10px", border: `1px solid ${T.border}`,
                  color: j === 0 ? T.text : T.muted2, lineHeight: 1.5 }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StepBlock({ num, title, text }) {
  return (
    <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
      <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
        background: T.accentBg, border: `1.5px solid rgba(166,110,255,.3)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Press Start 2P'", fontSize: 8, color: T.accent, marginTop: 1 }}>
        {num}
      </div>
      <div>
        <div style={{ fontSize: 12, color: T.text, fontWeight: 600, marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 11, color: T.muted2, lineHeight: 1.7 }}>{text}</div>
      </div>
    </div>
  );
}

function TipBlock({ text }) {
  return (
    <div style={{ display: "flex", gap: 10, padding: "8px 12px", marginTop: 6,
      background: T.s2, border: `1px solid ${T.border}`, borderRadius: 6 }}>
      <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
      <span style={{ fontSize: 11, color: T.muted2, lineHeight: 1.7 }}>{text}</span>
    </div>
  );
}

export default function HowToUse() {
  const [active, setActive] = useState("overview");
  const section = SECTIONS.find(s => s.id === active);

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      <style>{`
        .guide-nav-btn { transition: all .12s; cursor: pointer; }
        .guide-nav-btn:hover { background: rgba(166,110,255,.1) !important; }
      `}</style>

      {/* Nav */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
        {SECTIONS.map(s => (
          <button key={s.id} className="guide-nav-btn" onClick={() => setActive(s.id)}
            style={{
              padding: "6px 12px", borderRadius: 6, border: "none", cursor: "pointer",
              background: active === s.id ? T.accentBg : T.s2,
              color: active === s.id ? T.accent : T.muted,
              border: `1px solid ${active === s.id ? "rgba(166,110,255,.3)" : T.border}`,
              fontSize: 11, fontFamily: "'IBM Plex Mono'",
            }}>
            {s.icon} {s.title}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16,
          paddingBottom: 12, borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontSize: 22 }}>{section.icon}</span>
          <span style={{ fontFamily: "'Press Start 2P'", fontSize: 10, color: T.accent }}>{section.title}</span>
        </div>

        {section.content.map((block, i) => {
          if (block.type === "p") return (
            <p key={i} style={{ fontSize: 12, color: T.muted2, lineHeight: 1.8, marginBottom: 8 }}>{block.text}</p>
          );
          if (block.type === "callout") return <Callout key={i} color={block.color} text={block.text} />;
          if (block.type === "table")   return <Table key={i} headers={block.headers} rows={block.rows} />;
          if (block.type === "step")    return <StepBlock key={i} num={block.num} title={block.title} text={block.text} />;
          if (block.type === "tip")     return <TipBlock key={i} text={block.text} />;
          return null;
        })}
      </div>
    </div>
  );
}
