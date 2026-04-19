import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { E, ITEMS } from "./data.js";
import { rom, solve, parseShareURL, buildShareURL, exportSteps } from "./solver.js";
import { T, CSS } from "./theme.js";
import CostChart from "./CostChart.jsx";
import MaterialCalc from "./MaterialCalc.jsx";
import HowToUse from "./HowToUse.jsx";
import Changelog from "./Changelog.jsx";
import Support from "./Support.jsx";
import VersionBadge from "./VersionBadge.jsx";
import Wiki from "./Wiki.jsx";

const RECENT_KEY = "mc_recent";

// ── ItemIcon — renders SVG file if item.icon exists, otherwise emoji ──────────
function ItemIcon({ item, size = 22 }) {
  if (!item) return null;
  if (item.icon)
    return <img src={item.icon} alt={item.name} style={{ width: size, height: size, objectFit: "contain", imageRendering: "crisp-edges", verticalAlign: "middle" }} />;
  return <span style={{ fontSize: size }}>{item.em}</span>;
}


function loadRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; }
}
function pushRecent(itemId) {
  const prev = loadRecent().filter(id => id !== itemId);
  localStorage.setItem(RECENT_KEY, JSON.stringify([itemId, ...prev].slice(0, 5)));
}

function Sec({ label, title, children, action }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 18, marginBottom: 16 }}>
      <div className="sec-header" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        {label && <span style={{ fontFamily: "'Press Start 2P'", fontSize: 7, color: "#333" }}>{label}</span>}
        <div className="spacer" style={{ flex: 1, height: 1, background: T.border }} />
        <span style={{ fontFamily: "'Press Start 2P'", fontSize: 8, color: T.accent }}>{title}</span>
        {action}
      </div>
      {children}
    </div>
  );
}

function EditionToggle({ edition, onChange }) {
  return (
    <div style={{ display: "flex", background: T.s2, border: `1px solid ${T.border}`, borderRadius: 6, padding: 3, gap: 3 }}>
      {[
        { id: "java",    label: "☕ Java",    color: T.java },
        { id: "bedrock", label: "🪨 Bedrock", color: T.bedrock },
      ].map(opt => (
        <button key={opt.id} className="edition-btn" onClick={() => onChange(opt.id)}
          style={{
            padding: "5px 12px", borderRadius: 4, fontSize: 10, cursor: "pointer",
            fontFamily: "'IBM Plex Mono'",
            background: edition === opt.id ? `${opt.color}18` : "transparent",
            color: edition === opt.id ? opt.color : T.muted,
            border: `1px solid ${edition === opt.id ? opt.color : "transparent"}`,
          }}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function WikiPanel({ id, edition }) {
  const enc = E[id];
  const desc = (edition === "bedrock" && enc.bedrockDesc) ? enc.bedrockDesc : enc.desc;
  const tip  = (edition === "bedrock" && enc.bedrockTip)  ? enc.bedrockTip  : enc.tip;
  return (
    <div className="wiki-panel" style={{ margin: "6px 0 2px 28px", padding: "12px 14px", background: "#0a0818", border: `1px solid rgba(166,110,255,0.2)`, borderRadius: 8 }}>
      {enc.javaOnly && edition === "java" && (
        <div style={{ marginBottom: 8, fontSize: 9, color: T.java, fontFamily: "'Press Start 2P'" }}>☕ JAVA EDITION ONLY</div>
      )}
      <p style={{ fontSize: 12, color: T.muted2, marginBottom: 8, lineHeight: 1.6 }}>{desc}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 8 }}>
        {enc.levels.map((l, i) => (
          <div key={i} style={{ display: "flex", gap: 8, fontSize: 11 }}>
            <span style={{ color: T.accent, fontFamily: "'Press Start 2P'", fontSize: 7, minWidth: 14, paddingTop: 2 }}>{i + 1}</span>
            <span style={{ color: "#ccc" }}>{l}</span>
          </div>
        ))}
      </div>
      {tip && (
        <div style={{ padding: "7px 10px", background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)", borderRadius: 5, fontSize: 11, color: "#d4a", lineHeight: 1.5 }}>
          <span style={{ color: T.yellow }}>💡 </span>{tip}
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

function EnchantPicker({ item, sel, onChange, edition, tint }) {
  const [openWiki, setOpenWiki] = useState(null);
  const [search, setSearch] = useState("");

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

  const setLvl = (id, lvl) => { const n = { ...sel }; n[id] = lvl; onChange(n); };

  const visibleEncs = item.enc.filter(id => {
    if (edition === "bedrock" && E[id].javaOnly) return false;
    if (search && !E[id].name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      {item.enc.length >= 6 && (
        <div style={{ marginBottom: 8, position: "relative" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 filter enchants..."
            style={{ width: "100%", background: T.s3, border: `1px solid ${T.border}`, borderRadius: 6, padding: "6px 10px", fontSize: 11, color: T.text, outline: "none", fontFamily: "'IBM Plex Mono'" }} />
          {search && (
            <button onClick={() => setSearch("")}
              style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 13 }}>✕</button>
          )}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {visibleEncs.length === 0 && (
          <div style={{ padding: "12px 0", textAlign: "center", fontSize: 11, color: T.muted }}>No enchants match "{search}"</div>
        )}
        {visibleEncs.map(id => {
          const enc = E[id];
          const active = !!sel[id];
          const blocked = incomp.has(id) && !active;
          const curse = id.startsWith("curse");
          const wikiOpen = openWiki === id;
          return (
            <div key={id}>
              <div className={`erow${blocked ? " blocked" : ""}`} onClick={() => !blocked && toggle(id)}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 6, background: active ? T.accentBg : "transparent", border: `1px solid ${active ? "rgba(166,110,255,0.15)" : "transparent"}`, opacity: blocked ? 0.25 : 1 }}>
                <div style={{ width: 16, height: 16, borderRadius: 3, flexShrink: 0, border: `1.5px solid ${active ? T.accent : "#333"}`, background: active ? T.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff" }}>{active && "✓"}</div>
                <span style={{ flex: 1, fontSize: 12, color: curse ? T.red : active ? "#d4baff" : T.muted2 }}>
                  {enc.name}
                  {curse && (
                    <span 
                      className="tooltip-trigger" 
                      data-tooltip="Curse enchantment — generally negative effects and cannot be removed via Grindstone." 
                      style={{ fontSize: 9, color: T.red, marginLeft: 4, opacity: .8 }}
                    >
                      CURSE
                    </span>
                  )}
                  {enc.javaOnly && (
                    <span 
                      className="tooltip-trigger" 
                      data-tooltip="Java Edition only — this enchantment does not exist in Bedrock Edition." 
                      style={{ fontSize: 7, color: T.java, marginLeft: 6, padding: "1px 5px", border: `1px solid ${T.java}44`, borderRadius: 3, fontFamily: "'Press Start 2P'", opacity: .8 }}
                    >
                      JAVA
                    </span>
                  )}
                </span>
                <button className="icon-btn" onClick={e => { e.stopPropagation(); setOpenWiki(wikiOpen ? null : id); }}
                  style={{ fontSize: 11, color: wikiOpen ? T.accent : "#333", padding: "0 4px", lineHeight: 1, fontFamily: "'IBM Plex Mono'" }}>ⓘ</button>
                <span style={{ fontSize: 10, color: "#2a2a2a", minWidth: 38, textAlign: "right" }}>×{enc.mult}</span>
                {enc.maxLvl > 1 && (
                  <div className="lvl-container" style={{ display: "flex", gap: 3 }} onClick={e => e.stopPropagation()}>
                    {Array.from({ length: enc.maxLvl }, (_, i) => i + 1).map(lvl => (
                      <button key={lvl} className="lvbtn" onClick={() => { if (!active) toggle(id); setLvl(id, lvl); }}
                        style={{ width: 24, height: 22, borderRadius: 4, fontSize: 8, fontFamily: "'Press Start 2P'", background: (active && sel[id] === lvl) ? T.accent : "#1a1a1a", color: (active && sel[id] === lvl) ? "#fff" : "#444" }}>{rom(lvl)}</button>
                    ))}
                  </div>
                )}
              </div>
              {wikiOpen && <WikiPanel id={id} edition={edition} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ResultSteps({ result, item, compact }) {
  const [collapsed, setCollapsed] = useState(compact);
  const [copied, setCopied] = useState(false);
  if (!result) return null;

  const handleExport = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(exportSteps(result, item.name)).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0a0a0a", border: `1px solid ${T.border}`, borderRadius: 7, padding: "9px 12px", marginBottom: collapsed ? 0 : 10, cursor: compact ? "pointer" : "default" }}
        onClick={() => compact && setCollapsed(c => !c)}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: T.muted }}>
            {result.steps.length} step{result.steps.length !== 1 ? "s" : ""}
            {compact && (collapsed ? " — click to expand" : " — click to collapse")}
          </span>
          {result.timeMs !== undefined && (
            <span className="tooltip-trigger" data-tooltip="Internal calculation time for finding the provably optimal combining sequence using DP. (Usually <1ms for 1-5 enchants)" style={{ fontSize: 9, color: T.muted2, fontFamily: "'IBM Plex Mono'", background: T.s3, padding: "2px 6px", borderRadius: 4, border: `1px solid ${T.border}` }}>
              ⏱ {result.timeMs < 1 ? "<1" : result.timeMs.toFixed(0)}ms
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {!compact && (
            <button className="copy-btn" onClick={handleExport}
              style={{ padding: "3px 9px", borderRadius: 5, fontSize: 9, background: copied ? "rgba(74,222,128,.12)" : "rgba(255,255,255,.04)", border: `1px solid ${copied ? T.green : T.border}`, color: copied ? T.green : T.muted, fontFamily: "'IBM Plex Mono'", cursor: "pointer" }}>
              {copied ? "✓ copied" : "📋 export"}
            </button>
          )}
          <span style={{ fontFamily: "'Press Start 2P'", fontSize: 9, color: result.tooExpensive ? T.red : T.green, textShadow: `0 0 10px ${result.tooExpensive ? "rgba(248,113,113,.4)" : "rgba(74,222,128,.3)"}` }}>
            {result.tooExpensive ? "⚠ TOO EXPENSIVE" : `${result.total} LEVELS`}
          </span>
        </div>
      </div>
      {!collapsed && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {result.steps.map((step, i) => (
            <div key={step.num} className="step" style={{ animationDelay: `${i * .05}s`, background: step.isFinal ? "#0d0a18" : T.s2, border: `1.5px solid ${step.sc > 39 ? "#7f1d1d" : step.isFinal ? "rgba(166,110,255,.3)" : T.border}`, borderRadius: 7, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, background: step.isFinal ? T.accent : "#191919", border: `1.5px solid ${step.isFinal ? T.accent : "#2a2a2a"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Press Start 2P'", fontSize: 8, color: step.isFinal ? "#fff" : T.muted }}>{step.num}</div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", fontSize: 11 }}>
                <span style={{ background: "#0d1f14", border: "1px solid #1a3320", borderRadius: 4, padding: "2px 7px", color: "#86efac" }}>{step.tl}</span>
                <span style={{ color: "#333" }}>+</span>
                <span style={{ background: "#0d1422", border: "1px solid #1a2a40", borderRadius: 4, padding: "2px 7px", color: T.blue }}>{step.sl}</span>
                <span style={{ color: "#2a2a2a" }}>→</span>
                <span style={{ color: step.isFinal ? "#c4a3ff" : T.muted, fontStyle: step.isFinal ? "italic" : "normal" }}>{step.isFinal ? `✨ ${item.name}` : "combined book"}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, flexShrink: 0 }}>
                <div style={{ background: step.sc > 39 ? "#2d0707" : "#1a1300", border: `1px solid ${step.sc > 39 ? "#7f1d1d" : "#3d3300"}`, borderRadius: 5, padding: "3px 8px", fontFamily: "'Press Start 2P'", fontSize: 8, color: step.sc > 39 ? T.red : T.yellow }}>{step.sc} lvls</div>
                {(step.penTgt > 0 || step.penSac > 0) && (
                  <div className="tooltip-trigger" data-tooltip={`Prior work penalty cost for this step:\nItem: +${step.penTgt} lvl\nSacrifice: +${step.penSac} lvl\n\nPenalties double each time an item passes through an anvil.`} style={{ fontSize: 9, color: "#2d2d2d", fontFamily: "'IBM Plex Mono'", whiteSpace: "nowrap" }}>
                    {[step.penTgt > 0 && `⚠ ${step.penTgt}`, step.penSac > 0 && `⚠ ${step.penSac}`].filter(Boolean).join(" + ")} prior
                  </div>
                )}
              </div>
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

function ItemGrid({ value, onChange }) {
  const [recent, setRecent] = useState(loadRecent);
  const handlePick = (id) => { pushRecent(id); setRecent(loadRecent()); onChange(id); };

  return (
    <div>
      {recent.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 9, color: T.muted, fontFamily: "'Press Start 2P'", marginBottom: 6 }}>RECENTLY USED</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {recent.map(id => {
              const it = ITEMS.find(i => i.id === id);
              if (!it) return null;
              return (
                <div key={id} className="recent-btn" onClick={() => handlePick(id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "5px 10px",
                    background: value === id ? "#160e28" : T.s2,
                    border: `1px solid ${value === id ? T.accent : T.border}`,
                    borderRadius: 6, fontSize: 11,
                    color: value === id ? "#c4a3ff" : T.muted2, cursor: "pointer",
                  }}>
                  {it.icon
                    ? <img src={it.icon} alt={it.name} style={{ width: 16, height: 16, objectFit: "contain" }} />
                    : <span style={{ fontSize: 14 }}>{it.em}</span>}
                  <span>{it.name}</span>
                </div>
              );
            })}
          </div>
          <div style={{ height: 1, background: T.border, margin: "10px 0" }} />
        </div>
      )}
      <div style={{ fontSize: 9, color: T.muted, fontFamily: "'Press Start 2P'", marginBottom: 8 }}>ALL ITEMS</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(72px,1fr))", gap: 6 }}>
        {ITEMS.map(it => (
          <div key={it.id} className="item-btn" onClick={() => handlePick(it.id)}
            style={{ background: value === it.id ? "#160e28" : T.s2, border: `1.5px solid ${value === it.id ? T.accent : T.border}`, borderRadius: 7, padding: "8px 4px", textAlign: "center", boxShadow: value === it.id ? "0 0 12px rgba(166,110,255,.2)" : "none" }}>
            <div style={{ fontSize: 22, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {it.icon
                ? <img src={it.icon} alt={it.name} style={{ width: 26, height: 26, objectFit: "contain", imageRendering: "crisp-edges" }} />
                : it.em}
            </div>
            <div style={{ marginTop: 4, fontSize: 7, color: value === it.id ? "#c4a3ff" : "#555", fontFamily: "'Press Start 2P'", lineHeight: 1.6 }}>{it.name.toUpperCase()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Work-count picker (0–5 prior anvil uses, each +1 doubles penalty)
function WorkCountPicker({ value, onChange }) {
  const T2 = { yellow: "#f5c400" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <span style={{ fontSize: 10, color: T.muted }}>Prior anvil uses on this item:</span>
      <div style={{ display: "flex", gap: 3 }}>
        {[0,1,2,3,4,5].map(n => (
          <button key={n} onClick={() => onChange(n)}
            style={{ width: 26, height: 22, borderRadius: 4, fontSize: 9, fontFamily: "'Press Start 2P'",
              cursor: "pointer", lineHeight: 1,
              background: value === n ? "rgba(245,196,0,.2)" : T.s3,
              color:      value === n ? T2.yellow : T.muted2,
              border:     `1px solid ${value === n ? "rgba(245,196,0,.4)" : T.border}`,
            }}>{n}</button>
        ))}
      </div>
      <span style={{ fontSize: 10, color: T.muted, fontFamily: "'IBM Plex Mono'" }}>
        = +{Math.pow(2, value) - 1} lvl penalty
      </span>
    </div>
  );
}

function SingleCalc({ onSavePreset, initialPreset, edition }) {
  const urlShare = useMemo(() => parseShareURL(), []);
  const seed = initialPreset || urlShare;

  const [itemId,      setItemId]      = useState(seed?.itemId || "sword");
  const [sel,         setSel]         = useState(seed?.sel    || {});
  const [result,      setResult]      = useState(null);
  const [presetName,  setPresetName]  = useState(initialPreset?.name || "");
  const [saved,       setSaved]       = useState(false);
  const [shareMsg,    setShareMsg]    = useState("");
  const [showChart,   setShowChart]   = useState(false);
  // ── Pre-enchanted mode ───────────────────────────────
  const [preMode,     setPreMode]     = useState(false);
  const [existing,    setExisting]    = useState({});   // enchants already on the item
  const [itemWC,      setItemWC]      = useState(1);    // how many times item has been through anvil

  const resultsRef = useRef(null);
  const item  = ITEMS.find(i => i.id === itemId);
  const count = Object.keys(sel).length;

  const pickItem = id => { setItemId(id); setSel({}); setExisting({}); setResult(null); };

  // Build a filtered item that hides enchants already on the item + their incompatibles
  const filteredItem = useMemo(() => {
    if (!preMode || !Object.keys(existing).length) return item;
    const blocked = new Set(Object.keys(existing));
    Object.keys(existing).forEach(id => E[id]?.incomp?.forEach(x => blocked.add(x)));
    return { ...item, enc: item.enc.filter(id => !blocked.has(id)) };
  }, [item, existing, preMode]);

  const calc = useCallback(() => {
    if (!count) return;
    const t0 = performance.now();
    const res = solve(sel, item.name, preMode ? itemWC : 0);
    res.timeMs = performance.now() - t0;
    setResult(res);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }, [sel, item, count, preMode, itemWC]);

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.code === "Space")  { e.preventDefault(); calc(); }
      if (e.code === "Escape") { setSel({}); setResult(null); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [calc]);

  const savePreset = () => {
    if (!presetName.trim() || !count) return;
    onSavePreset({ type: "single", name: presetName.trim(), itemId, sel });
    setPresetName(""); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(buildShareURL(itemId, sel)).then(() => {
      setShareMsg("🔗 link copied!"); setTimeout(() => setShareMsg(""), 2500);
    });
  };

  const existingKeys = Object.keys(existing);

  return (
    <div>
      <div style={{ marginBottom: 10, fontSize: 10, color: "#2a2a2a", textAlign: "right" }}>
        <kbd style={{ padding: "1px 5px", border: "1px solid #2a2a2a", borderRadius: 3, fontSize: 9 }}>Space</kbd> calculate &nbsp;
        <kbd style={{ padding: "1px 5px", border: "1px solid #2a2a2a", borderRadius: 3, fontSize: 9 }}>Esc</kbd> clear
      </div>

      <Sec label="01" title="CHOOSE ITEM">
        <ItemGrid value={itemId} onChange={pickItem} />
      </Sec>

      {/* ── Pre-enchanted mode toggle ── */}
      <div style={{ marginBottom: 14 }}>
        <button onClick={() => { setPreMode(p => !p); setExisting({}); setSel({}); setResult(null); }}
          style={{ padding: "7px 14px", borderRadius: 6, fontSize: 10, cursor: "pointer",
            fontFamily: "'IBM Plex Mono'",
            background: preMode ? "rgba(245,196,0,.08)" : T.s2,
            border:     `1px solid ${preMode ? "rgba(245,196,0,.3)" : T.border}`,
            color:      preMode ? "#f5c400" : T.muted,
          }}>
          {preMode ? "🔒 Item already has enchantments (pre-enchanted mode ON)" : "🔓 Item is fresh — click to enter pre-enchanted mode"}
        </button>
        {preMode && (
          <div style={{ marginTop: 6, fontSize: 10, color: T.muted, paddingLeft: 2 }}>
            Select what's <em>already on the item</em> below, then pick what to add in section 02.
          </div>
        )}
      </div>

      {/* ── Existing enchantments (pre-enchanted mode only) ── */}
      {preMode && (
        <Sec label="01b" title="ALREADY ON THE ITEM">
          <div style={{ marginBottom: 12 }}>
            <WorkCountPicker value={itemWC} onChange={setItemWC} />
          </div>
          <div style={{ marginBottom: 10, padding: "8px 11px", background: "rgba(245,196,0,.05)",
            border: "1px solid rgba(245,196,0,.15)", borderRadius: 6, fontSize: 10,
            color: "#b89020", lineHeight: 1.7 }}>
            💡 <strong>Prior anvil uses</strong> = how many times this item has already been through an anvil.
            0 = came from enchanting table or chest loot. 1 = had one book applied. Each use doubles the penalty.
          </div>
          <EnchantPicker item={item} sel={existing}
            onChange={n => { setExisting(n); setSel({}); setResult(null); }} edition={edition} tint="yellow" />
          {existingKeys.length > 0 && (
            <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 5 }}>
              {existingKeys.map(id => (
                <span key={id} style={{ fontSize: 10, padding: "2px 8px",
                  background: "rgba(245,196,0,.1)", border: "1px solid rgba(245,196,0,.2)",
                  borderRadius: 4, color: "#f5c400" }}>
                  ✓ {E[id].name}{E[id].maxLvl > 1 ? ` ${rom(existing[id])}` : ""}
                </span>
              ))}
            </div>
          )}
        </Sec>
      )}

      <Sec label="02" title={`${preMode ? "ENCHANTMENTS TO ADD" : "ENCHANTMENTS"}${count ? ` — ${count} SELECTED` : ""}`}
        action={
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
            <input value={presetName} onChange={e => setPresetName(e.target.value)} placeholder="preset name..."
              style={{ background: T.s3, border: `1px solid ${T.border}`, borderRadius: 5, padding: "4px 8px", fontSize: 11, color: T.text, outline: "none", width: 130, maxWidth: "100%", fontFamily: "'IBM Plex Mono'" }} />
            <button onClick={savePreset} disabled={!presetName.trim() || !count}
              style={{ background: saved ? "rgba(74,222,128,.15)" : "rgba(166,110,255,.12)", border: `1px solid ${saved ? T.green : T.border}`, borderRadius: 5, padding: "4px 10px", fontSize: 10, color: saved ? T.green : T.muted, cursor: "pointer", fontFamily: "'IBM Plex Mono'" }}>
              {saved ? "✓ saved" : "💾 save"}
            </button>
          </div>
        }>
        {count > 0 && (
          <div style={{ marginBottom: 10 }}>
            <button onClick={() => setShowChart(c => !c)}
              style={{ background: showChart ? T.accentBg : "transparent",
                border: `1px solid ${showChart ? "rgba(166,110,255,.2)" : T.border}`,
                borderRadius: 5, padding: "4px 10px", fontSize: 10,
                color: showChart ? T.accent : T.muted, cursor: "pointer", fontFamily: "'IBM Plex Mono'" }}>
              📊 {showChart ? "hide" : "show"} xp breakdown
            </button>
            {showChart && <CostChart sel={sel} />}
          </div>
        )}
        <EnchantPicker item={filteredItem} sel={sel}
          onChange={n => { setSel(n); setResult(null); }} edition={edition} />
        {preMode && filteredItem.enc.length === 0 && (
          <div style={{ padding: "16px", textAlign: "center", fontSize: 11, color: T.muted }}>
            No more enchantments available — item is fully enchanted.
          </div>
        )}
      </Sec>

      <div className="stack-mobile" style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button className="go-btn" onClick={calc} disabled={!count}
          style={{ flex: 1, padding: "13px 0", borderRadius: 8,
            background: count ? "linear-gradient(135deg,#5f1fd4,#a66eff)" : T.s2,
            color: count ? "#fff" : "#333",
            border: `1.5px solid ${count ? T.accent : T.border}`,
            fontFamily: "'Press Start 2P'", fontSize: 10, letterSpacing: 1,
            boxShadow: count ? "0 4px 20px rgba(166,110,255,.25)" : "none" }}>
          {count ? "⚒  CALCULATE OPTIMAL ORDER" : "SELECT ENCHANTMENTS FIRST"}
        </button>
        {count > 0 && (
          <button className="copy-btn" onClick={handleShare}
            style={{ padding: "13px 16px", borderRadius: 8, flexShrink: 0,
              background: shareMsg ? "rgba(74,222,128,.1)" : "rgba(255,255,255,.03)",
              border: `1px solid ${shareMsg ? T.green : T.border}`,
              color: shareMsg ? T.green : T.muted,
              fontSize: 11, fontFamily: "'IBM Plex Mono'", whiteSpace: "nowrap", cursor: "pointer" }}>
            {shareMsg || "🔗 share"}
          </button>
        )}
      </div>

      {result && (
        <Sec label="03" title="OPTIMAL COMBINING ORDER">
          <div ref={resultsRef} />
          {preMode && existingKeys.length > 0 && (
            <div style={{ marginBottom: 10, padding: "7px 11px",
              background: "rgba(245,196,0,.05)", border: "1px solid rgba(245,196,0,.15)",
              borderRadius: 5, fontSize: 10, color: "#b89020", lineHeight: 1.7 }}>
              Item already has: {existingKeys.map(id =>
                `${E[id].name}${E[id].maxLvl > 1 ? ` ${rom(existing[id])}` : ""}`).join(", ")}
              {itemWC > 0 && <span> · Prior work penalty: +{Math.pow(2, itemWC) - 1} lvls on final step</span>}
            </div>
          )}
          <ResultSteps result={result} item={item} compact={false} />
          <div style={{ marginTop: 10, padding: "8px 12px", background: T.s2,
            border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 10, color: T.muted, lineHeight: 1.8 }}>
            💡 All books assumed to have <strong style={{ color: T.muted2 }}>zero prior work</strong>. For best results, use max-level books from librarian trades.
          </div>
        </Sec>
      )}
    </div>
  );
}

let setUid = 0;
const newEntry = () => ({ uid: ++setUid, itemId: "sword", qty: 1, sel: {} });

function SetEntry({ entry, onUpdate, onRemove, edition }) {
  const item = ITEMS.find(i => i.id === entry.itemId);
  return (
    <div style={{ background: T.s2, border: `1px solid ${T.b2}`, borderRadius: 10, padding: 14 }}>
      <div className="stack-mobile" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
          <ItemIcon item={item} size={20} />
          <select value={entry.itemId} onChange={e => onUpdate({ ...entry, itemId: e.target.value, sel: {} })}
            style={{ background: T.s3, border: `1px solid ${T.border}`, borderRadius: 5, padding: "5px 8px", color: T.text, fontSize: 12, flex: 1, fontFamily: "'IBM Plex Mono'", outline: "none" }}>
            {ITEMS.map(it => <option key={it.id} value={it.id}>{it.em} {it.name}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <span style={{ fontSize: 10, color: T.muted }}>qty</span>
            <button onClick={() => onUpdate({ ...entry, qty: Math.max(1, entry.qty - 1) })} style={{ width: 22, height: 22, background: T.s3, border: `1px solid ${T.border}`, borderRadius: 4, cursor: "pointer", color: T.muted, fontSize: 12, lineHeight: 1 }}>−</button>
            <span style={{ fontFamily: "'Press Start 2P'", fontSize: 10, color: T.accent, minWidth: 14, textAlign: "center" }}>{entry.qty}</span>
            <button onClick={() => onUpdate({ ...entry, qty: Math.min(9, entry.qty + 1) })} style={{ width: 22, height: 22, background: T.s3, border: `1px solid ${T.border}`, borderRadius: 4, cursor: "pointer", color: T.muted, fontSize: 12, lineHeight: 1 }}>+</button>
          </div>
          <button className="rm-btn" onClick={onRemove} style={{ fontSize: 16, color: T.red, lineHeight: 1, background: "none", border: "none", cursor: "pointer" }}>✕</button>
        </div>
      </div>
      <EnchantPicker item={item} sel={entry.sel} onChange={n => onUpdate({ ...entry, sel: n })} edition={edition} />
    </div>
  );
}

function SetBuilder({ onSavePreset, initialPreset, edition }) {
  const [entries, setEntries]   = useState(() => initialPreset?.entries?.length ? initialPreset.entries.map(e => ({ ...e, uid: ++setUid })) : [newEntry()]);
  const [results, setResults]   = useState({});
  const [presetName, setPresetName] = useState(initialPreset?.name || "");
  const [saved, setSaved]       = useState(false);
  const resultsRef = useRef(null);

  const update = (uid, data) => setEntries(es => es.map(e => e.uid === uid ? data : e));
  const remove = uid => setEntries(es => es.filter(e => e.uid !== uid));
  const add    = () => setEntries(es => [...es, newEntry()]);

  const calcAll = () => {
    const r = {};
    entries.forEach(e => { if (Object.keys(e.sel).length) { const item = ITEMS.find(i => i.id === e.itemId); const t0 = performance.now(); const res = solve(e.sel, item.name); res.timeMs = performance.now() - t0; r[e.uid] = res; } });
    setResults(r);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };

  const totalXp = Object.entries(results).reduce((sum, [uid, res]) => {
    const entry = entries.find(e => e.uid === parseInt(uid) || e.uid == uid);
    return sum + (res ? res.total * (entry?.qty || 1) : 0);
  }, 0);

  const hasSel = entries.some(e => Object.keys(e.sel).length > 0);

  const savePreset = () => {
    if (!presetName.trim()) return;
    onSavePreset({ type: "set", name: presetName.trim(), entries: entries.map(e => ({ ...e })) });
    setPresetName(""); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div style={{ marginBottom: 14, padding: "10px 14px", background: T.s2, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 11, color: T.muted, lineHeight: 1.8 }}>
        Build a full gear set. Add items, set quantities, pick enchants for each — then calculate the optimal XP cost for your entire set at once.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
        {entries.map(e => <SetEntry key={e.uid} entry={e} onUpdate={data => update(e.uid, data)} onRemove={() => remove(e.uid)} edition={edition} />)}
      </div>
      <button className="add-btn" onClick={add} style={{ width: "100%", padding: "10px", marginBottom: 12, background: "transparent", border: `1.5px dashed ${T.border}`, borderRadius: 8, color: T.muted, fontSize: 12, fontFamily: "'IBM Plex Mono'", cursor: "pointer" }}>
        + Add Item to Set
      </button>
      <div className="stack-mobile" style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "stretch" }}>
        <input value={presetName} onChange={e => setPresetName(e.target.value)} placeholder="save this set as..."
          style={{ flex: 1, background: T.s3, border: `1px solid ${T.border}`, borderRadius: 5, padding: "6px 10px", fontSize: 11, color: T.text, outline: "none", fontFamily: "'IBM Plex Mono'" }} />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={savePreset} disabled={!presetName.trim() || !hasSel}
            style={{ flex: 1, background: saved ? "rgba(74,222,128,.12)" : "rgba(166,110,255,.1)", border: `1px solid ${saved ? T.green : T.border}`, borderRadius: 5, padding: "6px 14px", fontSize: 11, color: saved ? T.green : T.muted, cursor: "pointer", fontFamily: "'IBM Plex Mono'", whiteSpace: "nowrap" }}>
            {saved ? "✓ saved" : "💾 save set"}
          </button>
          <button className="go-btn" onClick={calcAll} disabled={!hasSel}
            style={{ flex: 1, padding: "6px 16px", borderRadius: 7, background: hasSel ? "linear-gradient(135deg,#5f1fd4,#a66eff)" : T.s2, color: hasSel ? "#fff" : "#333", border: `1.5px solid ${hasSel ? T.accent : T.border}`, fontFamily: "'Press Start 2P'", fontSize: 8, letterSpacing: .5, whiteSpace: "nowrap", boxShadow: hasSel ? "0 3px 14px rgba(166,110,255,.25)" : "none" }}>
            ⚒ CALCULATE SET
          </button>
        </div>
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
                    <ItemIcon item={item} size={16} />
                    <span style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>{item.name}</span>
                    {e.qty > 1 && <span style={{ fontSize: 10, color: T.accent, fontFamily: "'Press Start 2P'" }}>×{e.qty}</span>}
                    <span style={{ fontSize: 10, color: T.muted, marginLeft: "auto" }}>{res.total} lvls/each{e.qty > 1 ? ` = ${res.total * e.qty} lvls total` : ""}</span>
                  </div>
                  <ResultSteps result={res} item={item} compact={true} />
                </div>
              );
            })}
            <div style={{ marginTop: 12, padding: "10px 14px", background: "#0a0818", border: `1px solid rgba(166,110,255,.2)`, borderRadius: 7, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: T.muted }}>Grand total XP across entire set</span>
              <span style={{ fontFamily: "'Press Start 2P'", fontSize: 11, color: T.accent }}>{totalXp} LEVELS</span>
            </div>
          </Sec>
        </div>
      )}
    </div>
  );
}

function PresetCard({ p, expanded, setExpanded, onLoad, onDelete }) {
  const isOpen = expanded === p.id;
  const viewResults = useMemo(() => {
    if (!isOpen) return null;
    if (p.type === "single") { const item = ITEMS.find(i => i.id === p.itemId); const t0 = performance.now(); const res = solve(p.sel, item.name); res.timeMs = performance.now() - t0; return [{ item, sel: p.sel, result: res, qty: 1 }]; }
    return p.entries.map(e => { const item = ITEMS.find(i => i.id === e.itemId); const t0 = performance.now(); const res = solve(e.sel, item.name); res.timeMs = performance.now() - t0; return { item, sel: e.sel, result: res, qty: e.qty }; }).filter(e => Object.keys(e.sel).length > 0);
  }, [isOpen, p]);
  const totalXp = viewResults?.reduce((s, r) => s + (r.result?.total || 0) * r.qty, 0) ?? 0;

  return (
    <div style={{ background: T.s2, border: `1px solid ${isOpen ? T.accent : T.border}`, borderRadius: 9, overflow: "hidden", marginBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", cursor: "pointer" }} onClick={() => setExpanded(isOpen ? null : p.id)}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: T.text, marginBottom: 3 }}>{p.name}</div>
          <div style={{ fontSize: 10, color: T.muted }}>
            {p.type === "single" ? (
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <ItemIcon item={ITEMS.find(i => i.id === p.itemId)} size={13} />
                {ITEMS.find(i => i.id === p.itemId)?.name} — {Object.keys(p.sel).length} enchants
              </span>
            ) : `📦 Set — ${p.entries?.length} item type${p.entries?.length !== 1 ? "s" : ""}`}
          </div>
        </div>
        <button onClick={e => { e.stopPropagation(); onLoad(p); }} style={{ background: "rgba(166,110,255,.1)", border: `1px solid rgba(166,110,255,.2)`, borderRadius: 5, padding: "5px 10px", fontSize: 10, color: T.accent, cursor: "pointer", fontFamily: "'IBM Plex Mono'", whiteSpace: "nowrap" }}>✏ edit</button>
        <button onClick={e => { e.stopPropagation(); onDelete(p.id); setExpanded(null); }} className="rm-btn" style={{ fontSize: 14, color: T.red, background: "none", border: "none", lineHeight: 1, cursor: "pointer" }}>✕</button>
        <span style={{ color: T.muted, fontSize: 12 }}>{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && viewResults && (
        <div style={{ borderTop: `1px solid ${T.border}`, padding: "12px 14px", background: "#0a0a0a" }}>
          {viewResults.map(({ item, sel, result, qty }, i) => (
            <div key={i} style={{ marginBottom: i < viewResults.length - 1 ? 16 : 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <ItemIcon item={item} size={18} />
                <span style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>{item.name}</span>
                {qty > 1 && <span style={{ fontSize: 9, color: T.accent, fontFamily: "'Press Start 2P'" }}>×{qty}</span>}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                {Object.entries(sel).map(([id, lvl]) => (
                  <span key={id} style={{ fontSize: 10, padding: "2px 8px", background: "rgba(166,110,255,.08)", border: "1px solid rgba(166,110,255,.15)", borderRadius: 4, color: "#c4a3ff" }}>
                    {E[id].name} {E[id].maxLvl > 1 ? rom(lvl) : ""}
                  </span>
                ))}
              </div>
              <ResultSteps result={result} item={item} compact={true} />
            </div>
          ))}
          {p.type === "set" && viewResults.length > 1 && (
            <div style={{ marginTop: 12, padding: "8px 12px", background: "#0a0818", border: "1px solid rgba(166,110,255,.2)", borderRadius: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 10, color: T.muted }}>Grand total</span>
              <span style={{ fontFamily: "'Press Start 2P'", fontSize: 10, color: T.accent }}>{totalXp} LEVELS</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PresetsPanel({ presets, onDelete, onLoad }) {
  const [expanded, setExpanded] = useState(null);
  const singles = presets.filter(p => p.type === "single");
  const sets     = presets.filter(p => p.type === "set");

  if (!presets.length) return (
    <div style={{ textAlign: "center", padding: "48px 20px", color: T.muted }}>
      <div style={{ fontSize: 28, marginBottom: 12 }}>💾</div>
      <div style={{ fontFamily: "'Press Start 2P'", fontSize: 9, color: "#333", marginBottom: 10 }}>NO PRESETS SAVED</div>
      <p style={{ fontSize: 11, lineHeight: 1.7 }}>Save enchantment configs from the Calculator or Set Builder tabs.</p>
    </div>
  );

  const Group = ({ title, items }) => items.length === 0 ? null : (
    <Sec title={title}>
      {items.map(p => <PresetCard key={p.id} p={p} expanded={expanded} setExpanded={setExpanded} onLoad={onLoad} onDelete={onDelete} />)}
    </Sec>
  );

  return <div><Group title="SINGLE ITEMS" items={singles} /><Group title="GEAR SETS" items={sets} /></div>;
}

let presetUid = 0;

export default function App() {
  const [tab, setTab]         = useState("calc");
  const [edition, setEdition] = useState(() => localStorage.getItem("mc_edition") || "java");
  const [presets, setPresets] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("mc_presets") || "[]");
      // Restore uid counter so new presets never collide with saved ones
      if (saved.length) presetUid = Math.max(...saved.map(p => p.id || 0));
      return saved;
    } catch { return []; }
  });
  const [loadedPreset, setLoadedPreset] = useState(null);
  const [loadMsg, setLoadMsg] = useState("");

  const handleEdition = (ed) => { setEdition(ed); localStorage.setItem("mc_edition", ed); };

  const savePreset = useCallback((preset) => {
    setPresets(ps => { const updated = [...ps, { ...preset, id: ++presetUid, createdAt: Date.now() }]; localStorage.setItem("mc_presets", JSON.stringify(updated)); return updated; });
  }, []);

  const deletePreset = useCallback((id) => {
    setPresets(ps => { const updated = ps.filter(p => p.id !== id); localStorage.setItem("mc_presets", JSON.stringify(updated)); return updated; });
  }, []);

  const loadPreset = (p) => {
    setLoadedPreset(p); setTab(p.type === "set" ? "set" : "calc");
    setLoadMsg(`Preset "${p.name}" loaded`); setTimeout(() => setLoadMsg(""), 2500);
  };

  const tabs = [
    { id: "calc",      label: "⚒ CALCULATOR" },
    { id: "set",       label: "📦 SET BUILDER" },
    { id: "presets",   label: `💾 PRESETS${presets.length ? ` (${presets.length})` : ""}` },
    { id: "materials", label: "⛏️ MATERIALS" },
    { id: "guide",     label: "📖 GUIDE" },
    { id: "wiki",      label: "📚 WIKI" },
    { id: "changelog", label: "📋 CHANGELOG" },
    { id: "support",   label: "💬 SUPPORT" },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight: "100vh", background: T.bg, padding: "24px 16px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: "#2a2a2a", fontFamily: "'IBM Plex Mono'", marginBottom: 8 }}>⟡ MINECRAFT TOOLS ⟡</div>
            <h1 style={{ fontFamily: "'Press Start 2P'", fontSize: "clamp(12px,2.5vw,20px)", color: T.accent, lineHeight: 1.6, textShadow: "0 0 20px rgba(166,110,255,.6)" }}>ANVIL OPTIMIZER</h1>
            <p style={{ marginTop: 6, color: "#333", fontSize: 11 }}>Wiki · Presets · Set Builder · DP-optimized XP cost</p>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "center", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <EditionToggle edition={edition} onChange={handleEdition} />
              <VersionBadge onClick={() => setTab("changelog")} />
            </div>
            {edition === "bedrock" && (
              <div style={{ marginTop: 8, fontSize: 10, color: T.bedrock, opacity: .8 }}>
                🪨 Bedrock mode — Java-only enchants hidden · Impaling description updated
              </div>
            )}
          </div>

          <div className="tab-grid" style={{ display: "flex", gap: 3, marginBottom: 20, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 4 }}>
            {tabs.map(t => (
              <button key={t.id} className="tab-btn" onClick={() => setTab(t.id)}
                style={{ flex: 1, padding: "9px 0", borderRadius: 5, border: "none", background: tab === t.id ? T.accentBg : "transparent", color: tab === t.id ? T.accent : T.muted, fontFamily: "'Press Start 2P'", fontSize: "clamp(5px,1.1vw,8px)", boxShadow: tab === t.id ? "inset 0 0 0 1px rgba(166,110,255,.25)" : "none", cursor: "pointer" }}>
                {t.label}
              </button>
            ))}
          </div>

          {loadMsg && (
            <div style={{ marginBottom: 12, padding: "8px 14px", background: "rgba(74,222,128,.08)", border: "1px solid rgba(74,222,128,.2)", borderRadius: 6, fontSize: 11, color: T.green }}>
              ✓ {loadMsg}
            </div>
          )}

          {tab === "calc"      && <SingleCalc key={loadedPreset?.type === "single" ? loadedPreset.id : "s"} onSavePreset={savePreset} initialPreset={loadedPreset?.type === "single" ? loadedPreset : null} edition={edition} />}
          {tab === "set"       && <SetBuilder key={loadedPreset?.type === "set" ? loadedPreset.id : "sb"} onSavePreset={savePreset} initialPreset={loadedPreset?.type === "set" ? loadedPreset : null} edition={edition} />}
          {tab === "presets"   && <PresetsPanel presets={presets} onDelete={deletePreset} onLoad={loadPreset} />}
          {tab === "materials" && <MaterialCalc E={E} ITEMS={ITEMS} rom={rom} />}
          {tab === "guide"     && <HowToUse />}
          {tab === "wiki"      && <Wiki />}
          {tab === "changelog" && <Changelog />}
          {tab === "support"   && <Support />}
        </div>
      </div>
    </>
  );
}
