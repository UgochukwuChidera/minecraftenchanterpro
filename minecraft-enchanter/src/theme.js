export const T = {
  bg: "#080808", surface: "#0f0f0f", s2: "#111111", s3: "#161616",
  border: "#1e1e1e", b2: "#252525",
  accent: "#a66eff", accentD: "#6b28d4", accentBg: "rgba(166,110,255,0.08)",
  text: "#e0e0e0", muted: "#555", muted2: "#888",
  green: "#4ade80", red: "#f87171", yellow: "#fbbf24", blue: "#93c5fd", orange: "#fb923c",
  java: "#f59e0b", bedrock: "#34d399",
};

export const R = {
  bpXs: 374,
  bpSm: 413,
  bpMd: 767,
  bpLg: 1023,
  controlMin: 44,
};

export const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html,body,#root{max-width:100%;overflow-x:hidden}
body{
  background:${T.bg};
  font-family:'IBM Plex Mono',monospace;
  color:${T.text};
  font-size:14px;
  line-height:1.45;
}
:root{
  --space-1:6px; --space-2:10px; --space-3:14px; --space-4:18px;
  --font-xs:11px; --font-sm:12px; --font-md:14px;
  --control-min:${R.controlMin}px;
}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:3px}
.tab-rail{
  display:flex; gap:6px; margin-bottom:20px; background:${T.surface};
  border:1px solid ${T.border}; border-radius:8px; padding:6px;
  overflow-x:auto; -webkit-overflow-scrolling:touch; scrollbar-width:thin;
}
.tab-btn{transition:all .15s;cursor:pointer}
.tab-btn:hover{filter:brightness(1.2)}
.item-btn{cursor:pointer;transition:transform .12s,box-shadow .12s}
.item-btn:hover{transform:translateY(-2px)}
.erow{transition:background .1s;cursor:pointer;user-select:none}
.erow:hover:not(.blocked){background:rgba(255,255,255,0.03)!important}
.erow.blocked{cursor:not-allowed}
.lvbtn{transition:all .1s;cursor:pointer;border:none}
.lvbtn:hover{filter:brightness(1.3)}
.go-btn{transition:all .2s;cursor:pointer;border:none}
.go-btn:not(:disabled):hover{transform:translateY(-1px);filter:brightness(1.1)}
.go-btn:disabled{cursor:not-allowed}
.step{animation:pop .2s ease both}
@keyframes pop{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.wiki-panel{animation:wslide .18s ease both}
@keyframes wslide{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
.add-btn{transition:all .15s;cursor:pointer}
.add-btn:hover{background:rgba(166,110,255,0.12)!important;border-color:#a66eff!important}
.rm-btn{transition:all .1s;cursor:pointer;opacity:.4}
.rm-btn:hover{opacity:1}
.preset-card{transition:all .15s;cursor:pointer}
.preset-card:hover{border-color:#a66eff!important;background:rgba(166,110,255,0.08)!important}
.icon-btn{transition:all .1s;cursor:pointer;background:none;border:none}
.icon-btn:hover{color:#a66eff!important}
.copy-btn{transition:all .15s;cursor:pointer}
.copy-btn:hover{filter:brightness(1.2)}
.edition-btn{transition:all .15s;cursor:pointer;border:none}
.edition-btn:hover{filter:brightness(1.1)}
.recent-btn{transition:all .12s;cursor:pointer}
.recent-btn:hover{border-color:#a66eff!important;transform:translateY(-1px)}

.app-shell{min-height:100vh;background:${T.bg};padding:24px 16px}
.app-container{max-width:900px;margin:0 auto}
.app-header{text-align:center;margin-bottom:24px}
.app-header-controls{
  margin-top:12px;display:flex;justify-content:center;align-items:center;gap:12px;flex-wrap:wrap
}
.section-card{background:${T.surface};border:1px solid ${T.border};border-radius:10px;padding:18px;margin-bottom:16px}
.enchant-row-main{display:flex;align-items:center;gap:8px;flex-wrap:nowrap;min-width:0}
.enchant-row-meta{display:flex;align-items:center;gap:8px;flex-shrink:0}
.mobile-stack{display:flex;gap:8px;align-items:center}
.mobile-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.touch-target{min-height:var(--control-min)}

button, input, select, textarea { font: inherit; }

@media (max-width:${R.bpMd}px){
  :root{
    --space-2:10px; --space-3:12px; --space-4:14px;
    --font-xs:12px; --font-sm:13px; --font-md:14px;
  }
  .app-shell{padding:14px 10px}
  .app-header{margin-bottom:14px}
  .app-container{max-width:100%}
  .tab-btn{
    flex:0 0 auto!important;
    min-width:118px;
    min-height:44px;
    padding:10px 12px!important;
    font-size:10px!important;
  }
  .section-card{padding:12px}
  .edition-btn, .go-btn, .copy-btn, .add-btn, .recent-btn, .item-btn, .icon-btn{min-height:40px}
  .enchant-row-main{flex-wrap:wrap;align-items:flex-start}
  .enchant-row-meta{width:100%;justify-content:flex-start;gap:6px;padding-left:24px;flex-wrap:wrap}
  .mobile-stack{flex-direction:column;align-items:stretch}
  .mobile-grid-2{grid-template-columns:1fr}
  .lvbtn{min-width:32px;min-height:32px}
}

@media (max-width:${R.bpSm}px){
  .tab-btn{min-width:110px;font-size:9px!important}
  .app-shell{padding:10px 8px}
  .section-card{padding:10px}
}
`;
