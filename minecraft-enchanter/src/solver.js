import { E } from "./data.js";

export const R = ["", "I", "II", "III", "IV", "V"];
export const rom = n => R[n] || n;
export const pen = wc => Math.pow(2, wc) - 1;
export const ecost = ench => Object.entries(ench).reduce((s, [id, lvl]) => s + E[id].mult * lvl, 0);

let _uid = 0;
const nid = () => ++_uid;

/**
 * Full bitmask DP over (tool + all books).
 *
 * FIX: The tool is now a first-class participant in the merge tree, not just
 * a final receiver. This matches actual Minecraft mechanics — you can apply
 * individual books to the item at any stage, not just at the end.
 *
 * Rules:
 *   - The tool must ALWAYS be in the LEFT (target) slot when it participates
 *     in a merge (Minecraft doesn't let you sacrifice the item).
 *   - Books can go in either slot when merging with each other.
 *   - Tool starts at itemWC prior anvil uses (for pre-enchanted mode).
 *
 * Bitmask layout:
 *   bit 0 (value 1) = tool
 *   bit i+1         = book for enchantment i
 */
export function solve(selected, itemName, itemWC = 0) {
  const ids = Object.keys(selected);
  if (!ids.length) return null;
  const n = ids.length;
  const TOOL_BIT = 1;
  const full = (1 << (n + 1)) - 1;
  const dp = new Array(full + 1).fill(null);

  // Seed: tool (bit 0)
  dp[TOOL_BIT] = {
    nid: nid(), wc: itemWC, cost: 0, ench: {},
    label: itemName, isItem: true, steps: []
  };
  // Seed: books (bits 1..n)
  for (let i = 0; i < n; i++) {
    const id = ids[i];
    dp[1 << (i + 1)] = {
      nid: nid(), wc: 0, cost: 0, ench: { [id]: selected[id] },
      label: `${E[id].name} ${rom(selected[id])} Book`,
      isItem: false, steps: []
    };
  }

  for (let mask = 1; mask <= full; mask++) {
    if (!(mask & (mask - 1))) continue; // skip single-item masks (leaves)
    const maskHasTool = !!(mask & TOOL_BIT);
    let best = null;

    for (let sub = (mask - 1) & mask; sub > 0; sub = (sub - 1) & mask) {
      const comp = mask ^ sub;
      if (!comp) continue;

      if (maskHasTool) {
        // Tool must be on the LEFT — only process when sub contains the tool
        if (!(sub & TOOL_BIT)) continue;
        // (comp never has tool since tool bit is unique and sub already has it)

        const tgt = dp[sub], sac = dp[comp];
        if (!tgt || !sac) continue;

        const ec  = ecost(sac.ench);
        const sc  = pen(tgt.wc) + pen(sac.wc) + ec;
        const tc  = tgt.cost + sac.cost + sc;
        const wc  = Math.max(tgt.wc, sac.wc) + 1;

        if (!best || tc < best.cost || (tc === best.cost && wc < best.wc)) {
          const rid = nid();
          const newEnch = { ...tgt.ench, ...sac.ench };
          const enchStr = Object.entries(newEnch)
            .map(([i, l]) => `${E[i].name}${E[i].maxLvl > 1 ? " " + rom(l) : ""}`)
            .join(", ");
          best = {
            nid: rid, wc, cost: tc, ench: newEnch,
            label: enchStr ? `${itemName} (${enchStr})` : itemName,
            isItem: true,
            steps: [...tgt.steps, ...sac.steps, { tgt, sac, sc, ec, resultNid: rid, isItemStep: true }]
          };
        }
      } else {
        // Book-only merge — try both orientations, skip duplicate pairs
        if (sub > comp) continue;
        const a = dp[sub], b = dp[comp];
        if (!a || !b) continue;

        for (const [tgt, sac] of [[a, b], [b, a]]) {
          const ec  = ecost(sac.ench);
          const sc  = pen(tgt.wc) + pen(sac.wc) + ec;
          const tc  = tgt.cost + sac.cost + sc;
          const wc  = Math.max(tgt.wc, sac.wc) + 1;
          if (!best || tc < best.cost || (tc === best.cost && wc < best.wc)) {
            const rid = nid();
            best = {
              nid: rid, wc, cost: tc, ench: { ...tgt.ench, ...sac.ench },
              label: Object.entries({ ...tgt.ench, ...sac.ench })
                .map(([i, l]) => `${E[i].name} ${rom(l)}`).join(", "),
              isItem: false,
              steps: [...tgt.steps, ...sac.steps, { tgt, sac, sc, ec, resultNid: rid, isItemStep: false }]
            };
          }
        }
      }
    }
    dp[mask] = best;
  }

  const finalNode = dp[full];
  if (!finalNode) return null;

  const allSteps = finalNode.steps;
  const nidMap = {};
  const steps = allSteps.map((step, i) => {
    nidMap[step.resultNid] = i + 1;
    const tl = nidMap[step.tgt.nid] ? `Step ${nidMap[step.tgt.nid]} result` : step.tgt.label;
    const sl = nidMap[step.sac.nid] ? `Step ${nidMap[step.sac.nid]} result` : step.sac.label;
    return {
      num: i + 1, tl, sl, sc: step.sc,
      isFinal:     i === allSteps.length - 1,
      isItemStep:  step.isItemStep,
    };
  });

  return { steps, total: finalNode.cost, tooExpensive: steps.some(s => s.sc > 39) };
}

export function parseShareURL() {
  try {
    const params = new URLSearchParams(window.location.search);
    const item = params.get("item");
    const enc  = params.get("enc");
    if (!item || !enc) return null;
    const sel = {};
    enc.split(",").forEach(part => {
      const [id, lvl] = part.split(":");
      if (E[id]) sel[id] = parseInt(lvl) || E[id].maxLvl;
    });
    return Object.keys(sel).length ? { itemId: item, sel } : null;
  } catch { return null; }
}

export function buildShareURL(itemId, sel) {
  const enc = Object.entries(sel).map(([id, lvl]) => `${id}:${lvl}`).join(",");
  const base = window.location.origin + window.location.pathname;
  return `${base}?item=${itemId}&enc=${enc}`;
}

export function exportSteps(result, itemName, existingEnch = {}) {
  if (!result) return "";
  const existing = Object.keys(existingEnch);
  const preNote = existing.length
    ? `Item already has: ${existing.map(id => `${E[id].name}${E[id].maxLvl > 1 ? ` ${rom(existingEnch[id])}` : ""}`).join(", ")}\n`
    : "";
  const lines = [
    `⚒ ${itemName.toUpperCase()} — OPTIMAL ANVIL ORDER (${result.total} levels)`,
    "",
    ...(preNote ? [preNote] : []),
    ...result.steps.map(s =>
      `Step ${s.num}: [LEFT] ${s.tl}  +  [RIGHT] ${s.sl}  →  ${s.isFinal ? `✨ ${itemName}` : s.isItemStep ? `⚒ ${itemName}` : "combined book"}  (${s.sc} lvls)`
    ),
    "",
    result.tooExpensive
      ? "⚠ WARNING: A step exceeds 39 levels — may be Too Expensive in Survival."
      : "✓ All steps within the 39-level limit.",
    "",
    "Generated by Minecraft Enchanter Pro — minecraftenchanter.vercel.app"
  ];
  return lines.join("\n");
}
