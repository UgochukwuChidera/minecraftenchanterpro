import { T } from "./theme.js";
import { E } from "./data.js";
import { rom } from "./solver.js";

// Shows each enchant's raw cost contribution (mult × level)
// and its share of total enchant cost as a horizontal bar
export default function CostChart({ sel }) {
  if (!sel || !Object.keys(sel).length) return null;

  const entries = Object.entries(sel).map(([id, lvl]) => ({
    id, lvl,
    name: E[id].name,
    cost: E[id].mult * lvl,
    mult: E[id].mult,
  })).sort((a, b) => b.cost - a.cost);

  const maxCost = entries[0]?.cost || 1;
  const totalCost = entries.reduce((s, e) => s + e.cost, 0);

  // Colour scale: cheap → blue, mid → yellow, expensive → red
  const barColor = (cost) => {
    if (cost >= 8)  return T.red;
    if (cost >= 4)  return T.orange;
    if (cost >= 2)  return T.yellow;
    return T.blue;
  };

  return (
    <div style={{
      background: "#09090d", border: `1px solid ${T.border}`,
      borderRadius: 8, padding: "12px 14px", marginTop: 12,
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 10,
      }}>
        <span style={{ fontFamily: "'Press Start 2P'", fontSize: 7, color: T.accent }}>
          XP COST BREAKDOWN
        </span>
        <span style={{ fontSize: 10, color: T.muted }}>
          raw enchant cost: <span style={{ color: T.yellow }}>{totalCost} pts</span>
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {entries.map(({ id, lvl, name, cost, mult }) => {
          const pct = Math.round((cost / totalCost) * 100);
          const barW = Math.round((cost / maxCost) * 100);
          const color = barColor(cost);

          return (
            <div key={id}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <span style={{ fontSize: 12, color: T.muted2, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {name}{E[id].maxLvl > 1 ? ` ${rom(lvl)}` : ""}
                </span>
                <span style={{ fontSize: 10, color: T.muted, minWidth: 52, textAlign: "right" }}>
                  ×{mult}{E[id].maxLvl > 1 ? `×${lvl}` : ""} = {cost}
                </span>
                <span style={{ fontSize: 9, color, fontFamily: "'Press Start 2P'", minWidth: 32, textAlign: "right" }}>
                  {pct}%
                </span>
              </div>
              <div style={{ height: 5, background: T.s2, borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${barW}%`,
                  background: color,
                  borderRadius: 3,
                  transition: "width .3s ease",
                  boxShadow: `0 0 6px ${color}44`,
                }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 10, fontSize: 10, color: T.muted, lineHeight: 1.6 }}>
        Note: bars show <em style={{ color: T.muted2 }}>base enchant cost</em> (mult × level). Total XP is higher due to work penalties added per anvil step.
      </div>
    </div>
  );
}
