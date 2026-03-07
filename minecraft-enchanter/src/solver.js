import { E } from "./data.js";

export const R = ["", "I", "II", "III", "IV", "V"];
export const rom = n => R[n] || n;
export const pen = wc => Math.pow(2, wc) - 1;
export const ecost = ench => Object.entries(ench).reduce((s, [id, lvl]) => s + E[id].mult * lvl, 0);

let _uid = 0;
const nid = () => ++_uid;

/**
 * Finds the optimal anvil book-combination order using full bitmask DP.
 * Tries every possible binary merge tree (both left/right slot orientations).
 *
 * Cost of a single anvil step = pen(tgt.wc) + pen(sac.wc) + ecost(sac)
 * The LEFT slot (target) enchantments are NOT paid — only the RIGHT (sacrifice).
 * Algorithm always picks the orientation that minimises each step's cost.
 *
 * @param selected  { enchId: level } — enchantments to ADD
 * @param itemName  display name
 * @param itemWC    prior-work count of the item itself (0 = brand new, 1 = one prior anvil use, etc.)
 *                  Affects the cost of the FINAL step where the book is applied to the item.
 */
export function solve(selected, itemName, itemWC = 0) {
  const ids = Object.keys(selected);
  if (!ids.length) return null;
  const n = ids.length;
  const full = (1 << n) - 1;
  const dp = new Array(1 << n).fill(null);

  // Seed: each individual enchantment starts as a fresh book (wc=0)
  for (let i = 0; i < n; i++) {
    const id = ids[i];
    dp[1 << i] = {
      nid: nid(), wc: 0, cost: 0, ench: { [id]: selected[id] },
      label: `${E[id].name} ${rom(selected[id])} Book`, steps: []
    };
  }

  // Build optimal merge tree bottom-up over all subsets
  for (let mask = 1; mask <= full; mask++) {
    if (!(mask & (mask - 1))) continue;   // skip single-bit masks (leaves)
    let best = null;
    for (let sub = (mask - 1) & mask; sub > 0; sub = (sub - 1) & mask) {
      const comp = mask ^ sub;
      if (!comp || sub > comp) continue;  // avoid double-counting
      const a = dp[sub], b = dp[comp];
      if (!a || !b) continue;
      // Try both orientations — LEFT is target (not paid), RIGHT is sacrifice (paid)
      for (const [tgt, sac] of [[a, b], [b, a]]) {
        const ec = ecost(sac.ench);
        const sc = pen(tgt.wc) + pen(sac.wc) + ec;
        const tc = tgt.cost + sac.cost + sc;
        const wc = Math.max(tgt.wc, sac.wc) + 1;
        if (!best || tc < best.cost) {
          const id = nid();
          best = {
            nid: id, wc, cost: tc, ench: { ...tgt.ench, ...sac.ench },
            label: Object.entries({ ...tgt.ench, ...sac.ench })
              .map(([i, l]) => `${E[i].name} ${rom(l)}`).join(", "),
            steps: [...tgt.steps, ...sac.steps, { tgt, sac, sc, ec, resultNid: id }]
          };
        }
      }
    }
    dp[mask] = best;
  }

  const book = dp[full];
  if (!book) return null;

  // Final step: item (left, uses itemWC as its penalty) + combined book (right)
  const ec = ecost(book.ench);
  const sc = pen(itemWC) + pen(book.wc) + ec;
  const total = book.cost + sc;
  const itemNode = { nid: nid(), label: itemName };
  const allSteps = [...book.steps, { tgt: itemNode, sac: book, sc, ec, resultNid: nid(), isFinal: true }];

  const nidMap = {};
  const steps = allSteps.map((step, i) => {
    nidMap[step.resultNid] = i + 1;
    const tl = nidMap[step.tgt.nid] ? `Step ${nidMap[step.tgt.nid]} result` : step.tgt.label;
    const sl = nidMap[step.sac.nid] ? `Step ${nidMap[step.sac.nid]} result` : step.sac.label;
    return { num: i + 1, tl, sl, sc: step.sc, isFinal: !!step.isFinal };
  });

  return { steps, total, tooExpensive: steps.some(s => s.sc > 39) };
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
      `Step ${s.num}: [LEFT] ${s.tl}  +  [RIGHT] ${s.sl}  →  ${s.isFinal ? `✨ ${itemName}` : "combined book"}  (${s.sc} lvls)`
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
