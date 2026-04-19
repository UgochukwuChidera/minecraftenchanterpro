// ═══════════════════════════════════════════════════════════
//  HOW TO USE  — standalone guide component
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
    id: "overview", icon: "🧭", title: "Overview",
    content: [
      { type: "p", text: "Minecraft Enchanter Pro calculates the cheapest possible XP cost to enchant any item by finding the optimal anvil combining sequence. It uses dynamic programming to exhaustively test every possible merge tree — not just book-first, but every combination including applying individual books to your item at any stage." },
      { type: "callout", color: "purple", text: "The algorithm treats your item as an equal participant in the merge tree. It is not forced to combine all books first — it tries every possible order, including applying a single book to the item early if that turns out cheaper. This can make a huge difference: a 4-enchant pickaxe that costs 37 levels the naïve way costs only 23 with the correct algorithm." },
      { type: "p", text: "The app has seven tabs: Calculator, Set Builder, Presets, Materials, Guide, Changelog, and Support." },
      { type: "table", headers: ["Tab", "What it does"], rows: [
        ["⚒ Calculator",   "Pick an item, select enchants, get the optimal step-by-step order"],
        ["📦 Set Builder", "Build a full gear set — multiple items at once with a grand total XP"],
        ["💾 Presets",     "Save and reload your favourite builds instantly"],
        ["⛏️ Materials",   "See every raw resource needed to craft and enchant an item"],
        ["📖 Guide",       "You are reading it"],
        ["📋 Changelog",   "Version history and release notes"],
        ["💬 Support",     "Send bug reports or feature requests directly to the developer"],
      ]},
    ]
  },
  {
    id: "algorithm", icon: "🧠", title: "How the Algorithm Works",
    content: [
      { type: "p", text: "Each anvil operation costs: Prior Work Penalty of the left slot + Prior Work Penalty of the right slot + Enchantment Cost of whatever is in the right (sacrifice) slot." },
      { type: "table", headers: ["Concept", "Formula", "Example"], rows: [
        ["Prior Work Penalty", "2ⁿ − 1 where n = anvil uses so far", "Used twice → 2²−1 = 3 extra levels"],
        ["Enchantment Cost",   "Level × Multiplier per enchant in sacrifice", "Sharpness V = 5 × 1 = 5 levels"],
        ["Multiplier ×1",      "Sharpness, Protection, Efficiency, Power…", "Efficiency V costs 5 levels"],
        ["Multiplier ×2",      "Smite, Looting, Feather Falling, Luck of the Sea…", "Looting III costs 6 levels"],
        ["Multiplier ×4",      "Thorns, Mending, Frost Walker, Soul Speed…", "Mending I costs 2 levels"],
        ["Multiplier ×8",      "Swift Sneak, Curse of Binding", "Swift Sneak III costs 24 levels"],
        ["Too Expensive",      "Any single step exceeds 39 levels", "Shown in red — impossible in Survival"],
      ]},
      { type: "callout", color: "yellow", text: "The LEFT slot is always the item you keep. The RIGHT slot is always the sacrifice. Both slots charge their own prior work penalty — this is why minimising how many times each item passes through the anvil matters so much." },
      { type: "p", text: "The solver runs a bitmask DP over all subsets of (item + books). It tries every possible binary merge tree and every orientation. The result is provably optimal — no other arrangement of those enchants can be cheaper." },
      { type: "callout", color: "red", text: "If a step shows red (>39 levels), that combination is impossible in Survival. Remove the most expensive enchant (Thorns ×4, Swift Sneak ×8) or start with a completely fresh item (zero prior work penalty)." },
    ]
  },
  {
    id: "calculator", icon: "⚒", title: "Calculator Tab",
    content: [
      { type: "step", num: 1,  title: "Pick your item",          text: "Click the item you want to enchant. The enchant list below automatically filters to only valid enchants for that item. Your 5 most recently used items appear in a quick-pick strip at the top." },
      { type: "step", num: 2,  title: "Set edition",             text: "Use the Java / Bedrock toggle in the header. Java-only enchants (Sweeping Edge, Swift Sneak) are hidden on Bedrock. Impaling's description also updates to reflect Bedrock's different behaviour." },
      { type: "step", num: 3,  title: "Select enchantments",     text: "Check the enchants you want. For multi-level enchants click the roman numeral buttons to set the level. Incompatible enchants grey out automatically — selecting Fortune hides Silk Touch, for example." },
      { type: "step", num: 4,  title: "Read enchant details",    text: "Click the ⓘ button next to any enchant to expand the wiki panel: a full description, per-level breakdown, and a pro tip. Hover the JAVA badge to confirm which enchants are edition-exclusive." },
      { type: "step", num: 5,  title: "Pre-enchanted mode",      text: "If your item already has enchants, click 'Item is fresh — click to enter pre-enchanted mode'. Declare existing enchants and prior anvil uses. See the Pre-Enchanted Mode section of this guide for details." },
      { type: "step", num: 6,  title: "Calculate",               text: "Press the Calculate button or hit Space. The optimal step-by-step appears below. Each step shows LEFT slot, RIGHT slot, and XP cost." },
      { type: "step", num: 7,  title: "Export or share",         text: "Click 📋 export to copy the steps as plain text for Discord or notes. Click 🔗 share to copy a URL that pre-fills the exact same item and enchants for anyone you send it to — or to bookmark it yourself." },
      { type: "step", num: 8,  title: "Cost chart",              text: "Toggle the cost breakdown chart to see each enchant's contribution as colour-coded bars. Useful for spotting which enchant is making a build expensive or pushing a step over 39." },
      { type: "step", num: 9,  title: "Save as preset",          text: "Type a name and click 💾 save to store the build for instant recall in the Presets tab." },
      { type: "callout", color: "blue", text: "Keyboard shortcuts: Space = Calculate, Esc = Clear. Both are ignored while you are typing in a text input." },
    ]
  },
  {
    id: "reading", icon: "📐", title: "Reading the Results",
    content: [
      { type: "p", text: "Each result step tells you exactly what to do at the anvil:" },
      { type: "table", headers: ["Part", "Meaning"], rows: [
        ["Step N",           "Do steps in order — each step's output may feed into later steps"],
        ["LEFT slot",        "The item you keep — your tool or a combined book from an earlier step"],
        ["RIGHT slot",       "What gets consumed — a fresh book or a combined book from an earlier step"],
        ["→ combined book",  "Result is a book — set it aside for a later step"],
        ["→ ✨ Item name",   "The final step — your fully enchanted item comes out here"],
        ["X lvls",           "XP cost of this single step"],
        ["Step N result",    "Refers to what you made in step N — do not confuse it with a fresh book"],
      ]},
      { type: "callout", color: "yellow", text: "Always follow the steps in the numbered order. Do not reorder them — the algorithm's sequence is globally optimal and reordering will increase the total cost due to how work penalties compound." },
      { type: "callout", color: "purple", text: "Your item can appear in any step, not just the last one. The algorithm may apply one book to the item early if that reduces overall cost. Follow the plan exactly." },
    ]
  },
  {
    id: "preenchanted", icon: "🔧", title: "Pre-Enchanted Mode",
    content: [
      { type: "p", text: "If your item already has enchantments on it — from a table, loot chest, or previous anvil session — enable Pre-Enchanted Mode before calculating." },
      { type: "step", num: 1, title: "Enable the mode",       text: "Click the grey bar below the item grid that reads 'Item is fresh — click to enter pre-enchanted mode'. It turns yellow and a new section (01b) appears." },
      { type: "step", num: 2, title: "Declare existing enchants", text: "In section 01b, check all enchants already on the item and set the correct levels. These are not being added — they are already there." },
      { type: "step", num: 3, title: "Set prior work count",  text: "Use the picker to set how many times the item has already been through an anvil (0–5). The penalty shown is 2ⁿ−1 extra levels charged on every future step." },
      { type: "step", num: 4, title: "Select new enchants",   text: "In section 02, pick the enchants you still want to add. Existing enchants and their incompatibles are hidden automatically." },
      { type: "step", num: 5, title: "Calculate",             text: "The result banner shows what is already on the item and the prior work penalty applied. The cost shown is only for adding the new enchants." },
      { type: "callout", color: "yellow", text: "Work penalty doubles each use: 0 uses = 0, 1 use = +1 level, 2 uses = +3, 3 uses = +7, 4 uses = +15, 5 uses = +31. Three or more prior uses makes some enchant combinations Too Expensive." },
    ]
  },
  {
    id: "setbuilder", icon: "📦", title: "Set Builder Tab",
    content: [
      { type: "step", num: 1, title: "Add items",          text: "Click '+ Add Item to Set'. Each entry has its own item selector, quantity stepper (1–9), and full enchant picker." },
      { type: "step", num: 2, title: "Set quantities",     text: "If you are crafting multiple identical items (e.g. 3 swords for alts), set qty to 3. XP multiplies accordingly in the grand total." },
      { type: "step", num: 3, title: "Enchant each item",  text: "Incompatibility rules apply per-item independently. Fortune on your pickaxe and Silk Touch on a second pickaxe in the same set do not conflict." },
      { type: "step", num: 4, title: "Calculate Set",      text: "Each item shows its own optimal step-by-step, plus a grand total XP bar at the bottom across all items and quantities." },
      { type: "step", num: 5, title: "Save the set",       text: "Name and save the entire set as a preset. It stores all items, quantities, and enchants together." },
      { type: "callout", color: "blue", text: "The Set Builder is ideal for planning a full armour + tools session in one go. Seeing the grand total before you start lets you know whether you need to farm more XP first." },
    ]
  },
  {
    id: "presets", icon: "💾", title: "Presets Tab",
    content: [
      { type: "step", num: 1, title: "View a preset", text: "Click any preset card to expand it. The full calculated step-by-step appears instantly without you needing to re-select anything." },
      { type: "step", num: 2, title: "Edit a preset",  text: "Click ✏ edit — this loads the preset into the Calculator or Set Builder tab with all settings pre-filled." },
      { type: "step", num: 3, title: "Delete a preset", text: "Click ✕ on the card header. Presets persist in your browser's localStorage across page refreshes." },
      { type: "callout", color: "blue",   text: "Loading a preset and saving it creates a new entry — it does not overwrite the old one. Delete the old card manually after re-saving if you want to replace it." },
      { type: "callout", color: "yellow", text: "Presets are browser-local and do not sync across devices. Use the 🔗 Share button in the Calculator to transfer a build to another device via URL." },
    ]
  },
  {
    id: "materials", icon: "⛏️", title: "Materials Tab",
    content: [
      { type: "step", num: 1, title: "Select item + tier",   text: "Choose the item type and material tier. The crafting recipe, material count, and base durability appear." },
      { type: "step", num: 2, title: "Set quantity",         text: "Scale all material costs to how many of this item you are crafting." },
      { type: "step", num: 3, title: "Select enchantments",  text: "The calculator adds books (paper + leather + lapis) to the raw materials total." },
      { type: "step", num: 4, title: "Include anvil",        text: "Toggle this to add the 31 iron ingots needed to craft an anvil (3 iron blocks + 4 ingots)." },
      { type: "step", num: 5, title: "Read the summary",     text: "Every raw resource, effective durability with Unbreaking factored in, and a Mending note if applicable." },
      { type: "callout", color: "green", text: "Netherite items are upgraded from Diamond using 1 Netherite Ingot + 1 Netherite Upgrade Smithing Template at a smithing table. The materials calc shows Diamond costs plus the Netherite upgrade materials." },
    ]
  },
  {
    id: "tips", icon: "💡", title: "Pro Tips",
    content: [
      { type: "tip", text: "Always use max-level books from villager trading. Combining two lower-level books wastes XP and adds a prior work count to the result — which then costs extra in every future step involving that book." },
      { type: "tip", text: "The order the algorithm gives you is globally optimal for those enchants. Do not reorder the steps yourself — even a sequence that looks cheaper at step 1 may be far more expensive overall due to compounding work penalties." },
      { type: "tip", text: "Mending and Infinity are mutually exclusive on bows. Choose Mending if you have a nearby XP farm; Infinity if you do not. Mending is almost always better in an established world." },
      { type: "tip", text: "Sweeping Edge (Java only, ×2 multiplier) is one of the best-value enchants per level spent. Do not skip it on your sword — it makes mob farm clearing dramatically faster." },
      { type: "tip", text: "Swift Sneak (×8) and Soul Speed (×4) are the most expensive enchants per level by far. Get these from loot chests or bartering whenever possible — never combine them manually if you can avoid it." },
      { type: "tip", text: "If a build shows Too Expensive, try removing Thorns first. Thorns III has a ×4 multiplier and is often the culprit, and its protection value rarely justifies the cost unless you are specifically building a thorns set." },
      { type: "tip", text: "For a full netherite armour set expect 150–220 total XP levels depending on enchants. Use the Set Builder to plan the whole session before you start so you know whether you need to farm more XP first." },
      { type: "tip", text: "Use the Share button after configuring a build to bookmark it in your browser. The URL encodes your entire selection and restores it exactly on any device." },
    ]
  },
];

function Callout({ color, text }) {
  const colors = {
    purple: { bg: "rgba(166,110,255,.07)", border: "rgba(166,110,255,.2)", text: "#c4a3ff" },
    yellow: { bg: "rgba(251,191,36,.06)",  border: "rgba(251,191,36,.2)",  text: "#fde68a" },
    red:    { bg: "rgba(239,68,68,.06)",   border: "rgba(239,68,68,.2)",   text: "#fca5a5" },
    blue:   { bg: "rgba(147,197,253,.06)", border: "rgba(147,197,253,.2)", text: "#bae6fd" },
    green:  { bg: "rgba(74,222,128,.06)",  border: "rgba(74,222,128,.2)",  text: "#bbf7d0" },
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
          <tr>{headers.map((h, i) => (
            <th key={i} style={{ padding: "7px 10px", background: "#0d0d0d",
              border: `1px solid ${T.border}`, color: T.accent,
              fontFamily: "'Press Start 2P'", fontSize: 7, textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? T.s2 : T.s3 }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "7px 10px", border: `1px solid ${T.border}`,
                  color: j === 0 ? T.text : T.muted2, lineHeight: 1.5 }}>{cell}</td>
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
        background: T.accentBg, border: "1.5px solid rgba(166,110,255,.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Press Start 2P'", fontSize: 8, color: T.accent, marginTop: 1 }}>{num}</div>
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
        .guide-nav { display:flex; flex-wrap:wrap; gap:5px; margin-bottom:16px; }
        .guide-card { background:${T.surface}; border:1px solid ${T.border}; border-radius:10px; padding:20px; }
        @media (max-width:767px){
          .guide-nav { overflow-x:auto; flex-wrap:nowrap; padding-bottom:4px; }
          .guide-nav-btn { flex:0 0 auto; min-height:40px; font-size:12px !important; }
          .guide-card { padding:14px; }
        }
      `}</style>

      <div className="guide-nav">
        {SECTIONS.map(s => (
          <button key={s.id} className="guide-nav-btn" onClick={() => setActive(s.id)}
            style={{
              padding: "8px 12px", borderRadius: 6, cursor: "pointer",
              background: active === s.id ? T.accentBg : T.s2,
              color: active === s.id ? T.accent : T.muted,
              border: `1px solid ${active === s.id ? "rgba(166,110,255,.3)" : T.border}`,
              fontSize: 12, fontFamily: "'IBM Plex Mono'",
            }}>{s.icon} {s.title}</button>
        ))}
      </div>

      <div className="guide-card">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16,
          paddingBottom: 12, borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontSize: 22 }}>{section.icon}</span>
          <span style={{ fontFamily: "'Press Start 2P'", fontSize: 10, color: T.accent }}>{section.title}</span>
        </div>

        {section.content.map((block, i) => {
          if (block.type === "p")       return <p key={i} style={{ fontSize: 12, color: T.muted2, lineHeight: 1.8, marginBottom: 8 }}>{block.text}</p>;
          if (block.type === "callout") return <Callout   key={i} color={block.color} text={block.text} />;
          if (block.type === "table")   return <Table     key={i} headers={block.headers} rows={block.rows} />;
          if (block.type === "step")    return <StepBlock key={i} num={block.num} title={block.title} text={block.text} />;
          if (block.type === "tip")     return <TipBlock  key={i} text={block.text} />;
          return null;
        })}
      </div>
    </div>
  );
}
