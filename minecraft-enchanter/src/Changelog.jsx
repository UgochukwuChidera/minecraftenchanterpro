// ═══════════════════════════════════════════════════════════
//  CHANGELOG  — standalone component
//  Import: import Changelog from './Changelog';
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
  new:      { bg: "rgba(74,222,128,.1)",   border: "rgba(74,222,128,.25)",   text: "#4ade80"  },
  fix:      { bg: "rgba(248,113,113,.1)",  border: "rgba(248,113,113,.25)",  text: "#f87171"  },
  improved: { bg: "rgba(147,197,253,.1)",  border: "rgba(147,197,253,.25)",  text: "#93c5fd"  },
  perf:     { bg: "rgba(251,191,36,.1)",   border: "rgba(251,191,36,.25)",   text: "#fbbf24"  },
  design:   { bg: "rgba(166,110,255,.1)",  border: "rgba(166,110,255,.25)",  text: "#a66eff"  },
  breaking: { bg: "rgba(239,68,68,.15)",   border: "rgba(239,68,68,.35)",    text: "#fca5a5"  },
};

const CHANGELOG = [
  {
    version: "1.4.0",
    date: "2026-03-06",
    label: "latest",
    entries: [
      { tag: "new",      text: "Offline support — full PWA with service worker caching. All features work without internet after first load." },
      { tag: "new",      text: "Changelog page — you're reading it." },
      { tag: "new",      text: "Materials Calculator tab — calculates every raw resource needed to craft and fully enchant an item, including paper, leather, and anvil iron." },
      { tag: "new",      text: "How To Use guide — full interactive guide covering all tabs, anvil cost math formula, and pro tips." },
      { tag: "improved", text: "Preset viewer now expands inline with enchant tags and full step-by-step — no more empty editor on load." },
      { tag: "fix",      text: "Loading a preset into the editor now correctly seeds item type, enchantments, levels, and preset name." },
      { tag: "fix",      text: "SingleCalc was missing its savePreset handler — fixed crash on save button click." },
      { tag: "fix",      text: "White screen crash fixed — SingleCalc and SetBuilder were reading initialPreset before it was declared in props." },
    ]
  },
  {
    version: "1.3.0",
    date: "2026-03-05",
    entries: [
      { tag: "new",      text: "Presets tab — save and reload enchantment configs across Calculator and Set Builder." },
      { tag: "new",      text: "localStorage persistence — presets survive page refresh." },
      { tag: "new",      text: "Set Builder tab — build full gear sets with multiple item types, independent enchants per item, and quantity multipliers." },
      { tag: "new",      text: "Grand total XP display across entire gear sets." },
      { tag: "improved", text: "Set results are collapsible — click any item header to expand its step-by-step." },
    ]
  },
  {
    version: "1.2.0",
    date: "2026-03-04",
    entries: [
      { tag: "new",      text: "Enchantment wiki — click ⓘ next to any enchant to see full description, per-level breakdown, tip, and cost multiplier." },
      { tag: "new",      text: "Incompatibility auto-enforcement — selecting Sharpness greys out Smite/Bane, Silk Touch greys out Fortune, etc." },
      { tag: "improved", text: "Roman numeral level pickers for multi-level enchants." },
      { tag: "design",   text: "Netherite-forge dark aesthetic with Press Start 2P + IBM Plex Mono typography." },
    ]
  },
  {
    version: "1.1.0",
    date: "2026-03-03",
    entries: [
      { tag: "new",      text: "Too Expensive detection — steps over 39 levels highlighted in red with explanation." },
      { tag: "new",      text: "Collapsible step results with compact mode for Set Builder." },
      { tag: "improved", text: "Step display now clearly labels LEFT slot (keep) vs RIGHT slot (sacrifice)." },
      { tag: "perf",     text: "DP solver now handles up to 10 enchantments efficiently using bitmask subset enumeration." },
    ]
  },
  {
    version: "1.0.0",
    date: "2026-03-02",
    entries: [
      { tag: "new", text: "Initial release — single item enchantment calculator." },
      { tag: "new", text: "DP-optimised combining order across all 13 item types and 35+ enchantments." },
      { tag: "new", text: "Step-by-step anvil instructions with per-step XP cost." },
      { tag: "new", text: "Total XP cost summary." },
    ]
  }
];

function Tag({ type }) {
  const c = TAG_COLORS[type] || TAG_COLORS.new;
  const labels = { new:"NEW", fix:"FIX", improved:"IMPROVED", perf:"PERF", design:"DESIGN", breaking:"BREAKING" };
  return (
    <span style={{
      fontSize: 8, padding: "2px 6px", borderRadius: 4,
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      fontFamily: "'Press Start 2P'", flexShrink: 0, lineHeight: 1.8
    }}>{labels[type] || type.toUpperCase()}</span>
  );
}

export default function Changelog() {
  const [expanded, setExpanded] = useState("1.4.0");

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .cl-card { transition: border-color .15s; }
        .cl-card:hover { border-color: rgba(166,110,255,.3) !important; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 20, padding: "14px 18px", background: T.surface,
        border: `1px solid ${T.border}`, borderRadius: 10 }}>
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

      {/* Entries */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {CHANGELOG.map(release => {
          const isOpen = expanded === release.version;
          return (
            <div key={release.version} className="cl-card"
              style={{ background: T.surface, border: `1px solid ${isOpen ? T.accent : T.border}`,
                borderRadius: 10, overflow: "hidden" }}>

              {/* Version header */}
              <div onClick={() => setExpanded(isOpen ? null : release.version)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px",
                  cursor: "pointer", userSelect: "none" }}>

                {/* Version badge */}
                <div style={{ fontFamily: "'Press Start 2P'", fontSize: 10,
                  color: isOpen ? T.accent : T.muted2, minWidth: 60 }}>
                  v{release.version}
                </div>

                {/* Date */}
                <span style={{ fontSize: 11, color: T.muted }}>{release.date}</span>

                {/* Latest badge */}
                {release.label === "latest" && (
                  <span style={{ fontSize: 8, padding: "2px 7px", borderRadius: 4,
                    background: "rgba(74,222,128,.1)", border: "1px solid rgba(74,222,128,.25)",
                    color: T.green, fontFamily: "'Press Start 2P'" }}>LATEST</span>
                )}

                <div style={{ flex: 1 }} />

                {/* Entry count */}
                <span style={{ fontSize: 10, color: T.muted }}>
                  {release.entries.length} change{release.entries.length !== 1 ? "s" : ""}
                </span>

                <span style={{ color: T.muted, fontSize: 12 }}>{isOpen ? "▲" : "▼"}</span>
              </div>

              {/* Entries list */}
              {isOpen && (
                <div style={{ borderTop: `1px solid ${T.border}`, padding: "12px 16px",
                  background: "#0a0a0a", display: "flex", flexDirection: "column", gap: 8 }}>
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