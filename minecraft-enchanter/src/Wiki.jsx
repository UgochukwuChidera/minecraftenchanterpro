import { useState, useMemo } from "react";
import { E, ITEMS } from "./data.js";

const T = {
  bg: "#080808", surface: "#0f0f0f", s2: "#111111", s3: "#161616",
  border: "#1e1e1e",
  accent: "#a66eff", accentBg: "rgba(166,110,255,0.08)",
  text: "#e0e0e0", muted: "#555", muted2: "#888",
  green: "#4ade80", red: "#f87171", yellow: "#fbbf24", blue: "#93c5fd", orange: "#fb923c",
};

// Grouping logic for enchantments
const ENCHANT_GROUPS = [
  { id: "melee", title: "Melee Weapons", tags: ["sharpness", "smite", "bane", "knockback", "fire_aspect", "sweeping", "looting", "impaling", "lunge", "density", "breach", "wind_burst"] },
  { id: "ranged", title: "Ranged Weapons", tags: ["power", "punch", "flame", "infinity", "multishot", "quick_charge", "piercing", "loyalty", "riptide", "channeling"] },
  { id: "armor", title: "Armor & Shields", tags: ["protection", "blast_prot", "fire_prot", "proj_prot", "feather_fall", "thorns", "respiration", "aqua_affinity", "depth_strider", "frost_walker", "soul_speed", "swift_sneak"] },
  { id: "tools", title: "Tools & Utility", tags: ["efficiency", "silk_touch", "fortune", "luck_of_sea", "lure"] },
  { id: "general", title: "General", tags: ["unbreaking", "mending", "curse_van", "curse_bind"] }
];

const FAQS = [
  {
    q: "Why does the anvil say 'Too Expensive'?",
    a: "In Survival mode, the anvil caps operations at 39 levels. If an operation costs 40 or more levels, you cannot complete it. This usually happens if you combine items poorly or use items that have been repaired/combined too many times. Use our Calculator to find the optimal order to avoid this!"
  },
  {
    q: "What is Prior Work Penalty?",
    a: "Every time an item (tool, weapon, armor, or book) goes through an anvil, its 'Prior Work Penalty' increases. The first time adds 1 level, the second adds 3, the third adds 7, then 15, then 31. This penalty applies to both the item you keep and the item you sacrifice."
  },
  {
    q: "Can I reset the Prior Work Penalty?",
    a: "Yes, but only by using a Grindstone, which removes all enchantments (except Curses) in exchange for some XP. The item becomes completely fresh."
  },
  {
    q: "Why does the left/right slot arrangement matter?",
    a: "The item in the LEFT slot is the one you keep, and the RIGHT slot is the sacrifice. Additionally, the XP cost depends on the enchantment multipliers of the sacrifice. For instance, combining a Sword (Left) and a Book (Right) usually charges the book's enchant costs, whereas doing Book (Left) and Sword (Right) might cost more because it transfers the sword's enchants."
  },
  {
    q: "Can I combine two books first to save levels?",
    a: "Sometimes yes, sometimes no. Combining two books gives the resulting book a Prior Work Penalty, which adds up later. Our optimal solver dynamically calculates when it is mathematically cheaper to combine books versus applying them one by one to your item."
  }
];

export default function Wiki() {
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState("all");

  const filteredGroups = useMemo(() => {
    const q = search.toLowerCase();
    
    return ENCHANT_GROUPS.map(group => {
      const matchingEnchants = group.tags.filter(id => {
        const enc = E[id];
        if (!enc) return false;
        if (activeGroup !== "all" && activeGroup !== group.id) return false;
        
        const matchesName = enc.name.toLowerCase().includes(q);
        const matchesDesc = enc.desc.toLowerCase().includes(q);
        return matchesName || matchesDesc;
      });
      
      return { ...group, matches: matchingEnchants };
    }).filter(g => g.matches.length > 0);
  }, [search, activeGroup]);

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      <div style={{ marginBottom: 20, padding: "14px 18px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10 }}>
        <div style={{ fontFamily: "'Press Start 2P'", fontSize: 9, color: T.accent, marginBottom: 8 }}>
          ENCHANTMENT SYSTEM WIKI
        </div>
        <p style={{ fontSize: 11, color: T.muted2, lineHeight: 1.7 }}>
          Learn about the mechanics of every enchantment in Minecraft, along with tips, max levels, multipliers, and FAQs.
        </p>
      </div>

      {/* Mechanics Section */}
      <div style={{ marginBottom: 20, padding: "16px 20px", background: "#0a0a0a", border: `1px solid rgba(166,110,255,0.2)`, borderRadius: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 18 }}>⚙️</span>
          <span style={{ fontFamily: "'Press Start 2P'", fontSize: 10, color: T.text }}>Core Mechanics</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
          <p>
            <strong style={{ color: "#d4baff" }}>Enchanting Table vs. Anvil:</strong> Enchanting tables provide random enchants for a flat XP cost based on bookshelves. Anvils allow deterministic combinations (books + tools or tool + tool), but they hit you with a compounding Prior Work Penalty.
          </p>
          <p>
            <strong style={{ color: "#d4baff" }}>Prior Work Penalty:</strong> Every anvil use increases the penalty exponentially: <span style={{ fontFamily: "monospace", color: T.yellow }}>0 → 1 → 3 → 7 → 15 → 31</span> levels.
          </p>
          <p>
            <strong style={{ color: "#d4baff" }}>Anvil Cost Multipliers:</strong> Enchantments transferred through an anvil have a hidden base cost. For example, Sharpness costs 1 level per tier, but Swift Sneak costs 8 levels per tier. This calculates into the total XP cost of the anvil operation!
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <input 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          placeholder="🔍 Search enchantments..."
          style={{ flex: 1, background: T.s3, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: T.text, outline: "none", fontFamily: "'IBM Plex Mono'" }} 
        />
        <select 
          value={activeGroup} 
          onChange={e => setActiveGroup(e.target.value)}
          style={{ background: T.s3, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", color: T.text, fontSize: 11, fontFamily: "'IBM Plex Mono'", outline: "none", cursor: "pointer" }}
        >
          <option value="all">All Groups</option>
          {ENCHANT_GROUPS.map(g => (
            <option key={g.id} value={g.id}>{g.title}</option>
          ))}
        </select>
      </div>

      {/* Enchantment Directory */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {filteredGroups.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: T.muted, fontSize: 12 }}>
            No enchantments match your search criteria.
          </div>
        )}
        
        {filteredGroups.map(group => (
          <div key={group.id}>
            <div style={{ fontSize: 10, fontFamily: "'Press Start 2P'", color: T.accent, marginBottom: 12, paddingBottom: 6, borderBottom: `1px solid ${T.border}` }}>
              {group.title.toUpperCase()}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {group.matches.map(id => {
                const enc = E[id];
                return (
                  <div key={id} style={{ background: T.s2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 14, color: T.text, fontWeight: "bold" }}>{enc.name}</span>
                        {enc.javaOnly && <span style={{ fontSize: 7, color: T.java || "#ed8b00", padding: "2px 6px", border: `1px solid ${T.java || "#ed8b00"}44`, borderRadius: 4, fontFamily: "'Press Start 2P'" }}>JAVA ONLY</span>}
                        {id.startsWith("curse") && <span style={{ fontSize: 7, color: T.red, padding: "2px 6px", border: `1px solid ${T.red}44`, borderRadius: 4, fontFamily: "'Press Start 2P'" }}>CURSE</span>}
                      </div>
                      <div style={{ display: "flex", gap: 10, fontSize: 10, color: T.muted2 }}>
                        <span>Max Lvl: <span style={{ color: "#d4baff" }}>{enc.maxLvl}</span></span>
                        <span>Mult: <span style={{ color: T.orange }}>&times;{enc.mult}</span></span>
                      </div>
                    </div>
                    
                    <p style={{ fontSize: 11, color: T.muted2, marginBottom: 10, lineHeight: 1.6 }}>{enc.desc}</p>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
                      {enc.levels.map((lvl, idx) => (
                        <div key={idx} style={{ fontSize: 10, color: "#aaa" }}>
                          <span style={{ color: T.accent, fontFamily: "'Press Start 2P'", fontSize: 7, display: "inline-block", minWidth: 20 }}>{idx + 1}</span> {lvl}
                        </div>
                      ))}
                    </div>

                    {enc.tip && (
                      <div style={{ padding: "8px 12px", background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)", borderRadius: 6, fontSize: 10, color: "#d4a", lineHeight: 1.5 }}>
                        <span style={{ color: T.yellow }}>💡 TIP: </span>{enc.tip}
                      </div>
                    )}
                    
                    {enc.incomp && enc.incomp.length > 0 && (
                      <div style={{ marginTop: 8, fontSize: 9, color: T.muted }}>
                        ⚠️ Incompatible with: <span style={{ color: T.red }}>{enc.incomp.map(i => E[i]?.name || i).join(", ")}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div style={{ marginTop: 30, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 18 }}>❓</span>
          <span style={{ fontFamily: "'Press Start 2P'", fontSize: 10, color: T.accent }}>Frequently Asked Questions</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {FAQS.map((faq, idx) => (
            <div key={idx} style={{ paddingBottom: idx < FAQS.length - 1 ? 16 : 0, borderBottom: idx < FAQS.length - 1 ? `1px solid ${T.border}` : "none" }}>
              <div style={{ fontSize: 12, color: T.text, fontWeight: "bold", marginBottom: 6 }}>{faq.q}</div>
              <div style={{ fontSize: 11, color: T.muted2, lineHeight: 1.6 }}>{faq.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
