// ═══════════════════════════════════════════════════════════
//  CHANGELOG  — standalone component
// ═══════════════════════════════════════════════════════════
import { useState } from "react";

const T = {
  bg: "#080808", surface: "#0f0f0f", s2: "#111111", s3: "#161616",
  border: "#1e1e1e",
  accent: "#a66eff", accentBg: "rgba(166,110,255,0.08)",
  text: "#e0e0e0", muted: "#555", muted2: "#888",
  green: "#4ade80", red: "#f87171", yellow: "#fbbf24", blue: "#93c5fd", orange: "#fb923c",
};

const TAG_COLORS = {
  new: { bg: "rgba(74,222,128,.1)", border: "rgba(74,222,128,.25)", text: "#4ade80" },
  fix: { bg: "rgba(248,113,113,.1)", border: "rgba(248,113,113,.25)", text: "#f87171" },
  improved: { bg: "rgba(147,197,253,.1)", border: "rgba(147,197,253,.25)", text: "#93c5fd" },
  perf: { bg: "rgba(251,191,36,.1)", border: "rgba(251,191,36,.25)", text: "#fbbf24" },
  design: { bg: "rgba(166,110,255,.1)", border: "rgba(166,110,255,.25)", text: "#a66eff" },
  breaking: { bg: "rgba(239,68,68,.15)", border: "rgba(239,68,68,.35)", text: "#fca5a5" },
};

const CHANGELOG = [
  {
    version: "2.0.0",
    date: "2026-04-04",
    label: "latest",
    entries: [
      { tag: "new", text: "Enchantment System Wiki — full glossary of items, mechanics, and an FAQ packed with factual and helpful details." }
    ]
  },
  {
    version: "1.8.2",
    date: "2026-03-16",
    entries: [
      { tag: "improved", text: "Guide completely updated — The guide has been rewritten across all segments of itself to correctly describe the optimal algorithmic combining logic, reading results, pre-enchanted workflows, keyboard shortcuts, and deeper mechanics." }
    ]
  },
  {
    version: "1.8.1",
    date: "2026-03-09",
    entries: [
      { tag: "new", text: "Prior work penalty breakdown — each step now shows a subtle dim line below the cost badge indicating how many levels were added by prior-work penalties on the target and sacrifice. Only shown when non-zero. Hover for tooltip." },
    ]
  },
  {
    version: "1.8.0",
    date: "2026-03-09",
    entries: [
      { tag: "fix", text: "Critical algorithm fix — the solver previously forced all books to be merged into one mega-book before applying to the item (always treating the item as the final step). The item is now a first-class participant in the DP tree and can receive books at any intermediate stage. This matches real Minecraft mechanics and produces significantly cheaper results — e.g. a 4-enchant pickaxe dropped from 37 levels to 23 levels." },
      { tag: "improved", text: "Guide fully rewritten — 9 sections covering the corrected algorithm (with the cost formula table), reading the results, pre-enchanted mode walkthrough, all tabs, keyboard shortcuts, share/export features, and 8 pro tips. The old incorrect 'combine all books first' explanation has been removed." },
    ]
  },
  {
    version: "1.7.0",
    date: "2026-03-07",
    entries: [
      { tag: "new", text: "Support tab — send bug reports, feature requests, or wrong-data corrections directly to the developer's inbox. Completely free via Web3Forms (no backend, no credit card)." },
      { tag: "new", text: "Online / offline detection — the support form shows a live connection indicator. Going offline triggers an instant warning toast. A background poll (every 8s) detects reconnection and fires a 'back online' toast, re-enabling the form automatically." },
      { tag: "new", text: "Toast notification system — slide-in toasts for send success, errors, online/offline state changes. Auto-dismiss after 4 seconds." },
    ]
  },
  {
    version: "1.6.0",
    date: "2026-03-07",
    entries: [
      { tag: "new", text: "Pre-enchanted mode — toggle on to declare what enchantments your item already has and how many prior anvil uses it has (0–5). The solver correctly applies the item's prior-work penalty to the final step, and automatically hides incompatible enchants from the 'add' list." },
      { tag: "new", text: "8 new items added: Brush, Shears, Elytra, Flint & Steel, Carrot on a Stick, Fungus on a Stick, Turtle Shell, Carved Pumpkin — each with correct enchantment pools." },
      { tag: "new", text: "Custom SVG icons for Spear, Shovel, Chestplate, and Elytra — items that have no accurate Unicode emoji now render purpose-drawn vector icons. Drop real Minecraft textures into public/items/ to override." },
      { tag: "fix", text: "Spear now correctly available on both Java and Bedrock editions — the erroneous Bedrock-only restriction has been removed." },
      { tag: "new", text: "SVG icons propagated app-wide — item icons now render consistently in the item picker, recently used strip, Set Builder entries, Presets panel, and Materials Calculator." },
      { tag: "improved", text: "Algorithm note shown inline with results — explains that every possible merge-tree is exhaustively tested and why the left slot is always the more expensive book." },
      { tag: "improved", text: "Emoji audit across all items — Hoe now shows 🌾, Mace 🔨, Shield 🛡️, Chestplate uses SVG armour icon instead of a jacket emoji." },
      { tag: "fix", text: "Confirmed and documented: 28 levels is the mathematical minimum for a 5-enchant axe (Fortune III, Sharpness V, Efficiency V, Unbreaking III, Mending I). pen(3) + 21 enchant cost = 28. Cannot be lower — the penalty function 2^n−1 has no value of 6, and the minimum book.wc for 5 books is 3." },
    ]
  },
  {
    version: "1.5.0",
    date: "2026-03-06",
    entries: [
      { tag: "new", text: "Mace (1.21+) — added with full enchantment support: Density I–V, Breach I–IV, Wind Burst I–III, plus Smite, Bane, Fire Aspect, Looting, Mending, Unbreaking, Curse of Vanishing." },
      { tag: "new", text: "Shield — added with Unbreaking, Mending, and Curse of Vanishing." },
      { tag: "new", text: "Spear (1.21.11 Mounts of Mayhem) — available on both Java and Bedrock. Exclusive Lunge I–III enchantment plus standard combat enchants (Sharpness, Smite, Bane, Knockback, Fire Aspect, Looting, Mending, Unbreaking, Curse of Vanishing)." },
      { tag: "new", text: "Java vs Bedrock edition toggle — persisted to localStorage. Hides Java-only enchants (Sweeping Edge, Swift Sneak) on Bedrock. Swaps Impaling description to Bedrock behaviour (all mobs in rain)." },
      { tag: "new", text: "Share button — encodes your item and enchant selection into a URL. Send your build to a friend; opening the link pre-fills the calculator exactly." },
      { tag: "new", text: "XP cost breakdown chart — collapsible panel showing each enchant's contribution as colour-coded bars (blue → yellow → red by cost). Off by default." },
      { tag: "new", text: "Enchant search/filter — appears on items with 6+ enchants (helmets, boots, etc). Live filter with a clear button." },
      { tag: "new", text: "Export results — copy the full step-by-step as plain text to paste into a notes app or Discord." },
      { tag: "new", text: "Keyboard shortcuts — Space to calculate, Esc to clear. Ignored while typing in inputs." },
      { tag: "new", text: "Recently used — last 5 items shown as a quick-pick strip above the full item grid, persisted to localStorage." },
      { tag: "fix", text: "Preset deletion bug fixed — presetUid now seeds from the highest saved ID on startup, preventing ID collisions that caused multiple presets to be deleted at once." },
      { tag: "improved", text: "Fonts now self-hosted via @fontsource packages — typography fully preserved offline without any Google Fonts request." },
    ]
  },
  {
    version: "1.4.0",
    date: "2026-03-06",
    entries: [
      { tag: "new", text: "Offline support — full PWA with service worker caching. All features work without internet after first load." },
      { tag: "new", text: "Changelog page — you're reading it." },
      { tag: "new", text: "Materials Calculator tab — calculates every raw resource needed to craft and fully enchant an item, including paper, leather, and anvil iron." },
      { tag: "new", text: "How To Use guide — full interactive guide covering all tabs, anvil cost math formula, and pro tips." },
      { tag: "improved", text: "Preset viewer now expands inline with enchant tags and full step-by-step — no more empty editor on load." },
      { tag: "fix", text: "Loading a preset into the editor now correctly seeds item type, enchantments, levels, and preset name." },
      { tag: "fix", text: "White screen crash fixed — SingleCalc and SetBuilder were reading initialPreset before it was declared in props." },
    ]
  },
  {
    version: "1.3.0",
    date: "2026-03-05",
    entries: [
      { tag: "new", text: "Presets tab — save and reload enchantment configs across Calculator and Set Builder." },
      { tag: "new", text: "localStorage persistence — presets survive page refresh." },
      { tag: "new", text: "Set Builder tab — build full gear sets with multiple item types, independent enchants per item, and quantity multipliers." },
      { tag: "new", text: "Grand total XP display across entire gear sets." },
      { tag: "improved", text: "Set results are collapsible — click any item header to expand its step-by-step." },
    ]
  },
  {
    version: "1.2.0",
    date: "2026-03-04",
    entries: [
      { tag: "new", text: "Enchantment wiki — click ⓘ next to any enchant to see full description, per-level breakdown, tip, and cost multiplier." },
      { tag: "new", text: "Incompatibility auto-enforcement — selecting Sharpness greys out Smite/Bane, Silk Touch greys out Fortune, etc." },
      { tag: "improved", text: "Roman numeral level pickers for multi-level enchants." },
      { tag: "design", text: "Netherite-forge dark aesthetic with Press Start 2P + IBM Plex Mono typography." },
    ]
  },
  {
    version: "1.1.0",
    date: "2026-03-03",
    entries: [
      { tag: "new", text: "Too Expensive detection — steps over 39 levels highlighted in red with explanation." },
      { tag: "new", text: "Collapsible step results with compact mode for Set Builder." },
      { tag: "improved", text: "Step display now clearly labels LEFT slot (keep) vs RIGHT slot (sacrifice)." },
      { tag: "perf", text: "DP solver handles up to 10 enchantments efficiently using bitmask subset enumeration." },
    ]
  },
  {
    version: "1.0.0",
    date: "2026-03-02",
    entries: [
      { tag: "new", text: "Initial release — single item enchantment calculator." },
      { tag: "new", text: "DP-optimised combining order across 13 item types and 35+ enchantments." },
      { tag: "new", text: "Step-by-step anvil instructions with per-step XP cost." },
      { tag: "new", text: "Total XP cost summary." },
    ]
  }
];

function Tag({ type }) {
  const c = TAG_COLORS[type] || TAG_COLORS.new;
  const labels = { new: "NEW", fix: "FIX", improved: "IMPROVED", perf: "PERF", design: "DESIGN", breaking: "BREAKING" };
  return (
    <span style={{
      fontSize: 8, padding: "2px 6px", borderRadius: 4,
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      fontFamily: "'Press Start 2P'", flexShrink: 0, lineHeight: 1.8
    }}>{labels[type] || type.toUpperCase()}</span>
  );
}

export default function Changelog() {
  const [expanded, setExpanded] = useState("2.0.0");

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      <style>{`
        .cl-card { transition: border-color .15s; }
        .cl-card:hover { border-color: rgba(166,110,255,.3) !important; }
        .cl-head { display:flex; align-items:center; gap:12px; padding:13px 16px; cursor:pointer; user-select:none; flex-wrap:wrap; }
        .cl-meta { margin-left:auto; display:flex; align-items:center; gap:10px; }
        @media (max-width:767px){
          .cl-head { gap:8px; }
          .cl-meta { margin-left:0; width:100%; justify-content:space-between; }
        }
      `}</style>

      <div style={{
        marginBottom: 20, padding: "14px 18px", background: T.surface,
        border: `1px solid ${T.border}`, borderRadius: 10
      }}>
        <div style={{ fontFamily: "'Press Start 2P'", fontSize: 9, color: T.accent, marginBottom: 8 }}>
          RELEASE HISTORY
        </div>
        <p style={{ fontSize: 11, color: T.muted2, lineHeight: 1.7 }}>
          All notable changes to Minecraft Enchanter Pro. Versioning follows semantic versioning — major.minor.patch.
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          {Object.entries(TAG_COLORS).map(([k]) => <Tag key={k} type={k} />)}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {CHANGELOG.map(release => {
          const isOpen = expanded === release.version;
          return (
            <div key={release.version} className="cl-card"
              style={{
                background: T.surface, border: `1px solid ${isOpen ? T.accent : T.border}`,
                borderRadius: 10, overflow: "hidden"
              }}>
              <div className="cl-head" onClick={() => setExpanded(isOpen ? null : release.version)}>
                <div style={{
                  fontFamily: "'Press Start 2P'", fontSize: 10,
                  color: isOpen ? T.accent : T.muted2, minWidth: 60
                }}>
                  v{release.version}
                </div>
                <span style={{ fontSize: 11, color: T.muted }}>{release.date}</span>
                {release.label === "latest" && (
                  <span style={{
                    fontSize: 8, padding: "2px 7px", borderRadius: 4,
                    background: "rgba(74,222,128,.1)", border: "1px solid rgba(74,222,128,.25)",
                    color: T.green, fontFamily: "'Press Start 2P'"
                  }}>LATEST</span>
                )}
                <div className="cl-meta">
                  <span style={{ fontSize: 10, color: T.muted }}>
                    {release.entries.length} change{release.entries.length !== 1 ? "s" : ""}
                  </span>
                  <span style={{ color: T.muted, fontSize: 12 }}>{isOpen ? "▲" : "▼"}</span>
                </div>
              </div>
              {isOpen && (
                <div style={{
                  borderTop: `1px solid ${T.border}`, padding: "12px 16px",
                  background: "#0a0a0a", display: "flex", flexDirection: "column", gap: 8
                }}>
                  {release.entries.map((entry, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <Tag type={entry.tag} />
                      <span style={{ fontSize: 12, color: T.muted2, lineHeight: 1.7, paddingTop: 1 }}>
                        {entry.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
