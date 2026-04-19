export const T = {
  bg: "#080808", surface: "#0f0f0f", s2: "#111111", s3: "#161616",
  border: "#1e1e1e", b2: "#252525",
  accent: "#a66eff", accentD: "#6b28d4", accentBg: "rgba(166,110,255,0.08)",
  text: "#e0e0e0", muted: "#555", muted2: "#888",
  green: "#4ade80", red: "#f87171", yellow: "#fbbf24", blue: "#93c5fd", orange: "#fb923c",
  java: "#f59e0b", bedrock: "#34d399",
};

export const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{background:${T.bg};font-family:'IBM Plex Mono',monospace;color:${T.text}}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:3px}
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

/* Responsive Utilities */
@media (max-width: 600px) {
  .stack-mobile { flex-direction: column !important; align-items: stretch !important; }
  .tab-grid { display: grid !important; grid-template-columns: repeat(2, 1fr) !important; gap: 4px !important; }
  .tab-btn { font-size: 8px !important; padding: 12px 0 !important; }
  .sec-header { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
  .sec-header .spacer { display: none !important; }
  .erow { flex-wrap: wrap !important; gap: 10px 8px !important; }
  .erow .lvl-container { width: 100% !important; justify-content: flex-end !important; margin-top: 4px !important; }
}
@media (max-width: 400px) {
  .tab-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .go-btn { font-size: 8px !important; padding: 16px 8px !important; }
}
`;
