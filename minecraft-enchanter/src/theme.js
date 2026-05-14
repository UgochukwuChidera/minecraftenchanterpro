export const T = {
  bg: "#080808", surface: "#0f0f0f", s2: "#111111", s3: "#161616",
  border: "#1e1e1e", b2: "#252525",
  accent: "#a66eff", accentD: "#6b28d4", accentBg: "rgba(166,110,255,0.08)",
  text: "#e0e0e0", muted: "#555", muted2: "#888",
  green: "#4ade80", red: "#f87171", yellow: "#fbbf24", blue: "#93c5fd", orange: "#fb923c",
  java: "#f59e0b", bedrock: "#34d399",
};

export const F = {
  body: "'IBM Plex Mono', monospace",
  display: "'Press Start 2P', monospace",
  fallback: "monospace",
};

export const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{background:${T.bg};font-family:${F.body};color:${T.text}}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:3px}
.font-body{font-family:${F.body}}
.font-display{font-family:${F.display}}
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

/* Custom Dropdown */
.custom-select { position: relative; user-select: none; }
.select-trigger { 
  background: ${T.s3}; border: 1px solid ${T.border}; border-radius: 8px; 
  padding: 10px 14px; color: ${T.text}; font-size: 11px; cursor: pointer; 
  display: flex; justify-content: space-between; align-items: center; gap: 10px;
  transition: border-color .15s;
  font-family:${F.body};
}
.select-trigger:hover { border-color: ${T.accent}; }
.select-options { 
  position: absolute; top: calc(100% + 5px); left: 0; right: 0; 
  background: ${T.s2}; border: 1px solid ${T.border}; border-radius: 8px; 
  overflow: hidden; z-index: 100; box-shadow: 0 10px 25px rgba(0,0,0,0.5);
  animation: pdrop .15s ease-out;
}
@keyframes pdrop { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: none; } }
.select-option { 
  padding: 10px 14px; font-size: 11px; color: ${T.muted2}; cursor: pointer; 
  transition: all .1s; 
}
.select-option:hover { background: ${T.accentBg}; color: ${T.accent}; }
.select-option.active { background: ${T.accent}15; color: ${T.accent}; font-weight: bold; }

/* Shared labels / headers / helper text */
.sec-label{font-family:${F.display};font-size:7px;color:#333}
.sec-title{font-family:${F.display};font-size:8px;color:${T.accent}}
.label-display{font-family:${F.display};letter-spacing:.5px}
.control-text{font-family:${F.body};font-size:11px}

/* Tooltip Styles */
[data-tooltip] { position: relative; cursor: help; }
[data-tooltip]::before {
  content: attr(data-tooltip);
  position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%);
  padding: 6px 10px; background: #151515; border: 1px solid ${T.accent}44;
  color: #ccc; font-size: 9px; line-height: 1.4; border-radius: 6px;
  white-space: pre-wrap; width: 180px; text-align: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.4);
  pointer-events: none; opacity: 0; transition: all .15s;
  z-index: 1000; font-family: ${F.body};
}
[data-tooltip]:hover::before { opacity: 1; bottom: 140%; }
.tooltip-trigger:hover { filter: brightness(1.2); }

/* Command palette */
.cmd-palette-root{
  position:fixed;inset:0;z-index:1200;background:rgba(0,0,0,.68);
  backdrop-filter:blur(4px);padding:14px;display:flex;align-items:flex-start;justify-content:center;
}
.cmd-palette-card{
  margin-top:min(14vh,100px);width:min(760px,100%);max-height:72vh;
  background:#070707;border:1px solid ${T.border};border-radius:12px;overflow:hidden;
  box-shadow:0 24px 64px rgba(0,0,0,.65);
}
.cmd-palette-header{
  display:flex;align-items:center;gap:8px;padding:11px 12px;border-bottom:1px solid ${T.border};
}
.cmd-palette-input{
  flex:1;background:transparent;border:none;outline:none;color:${T.text};
  font-size:12px;font-family:${F.body};
}
.cmd-palette-close{
  border:none;background:none;color:${T.muted};font-size:16px;cursor:pointer;line-height:1;font-family:${F.body};
}
.cmd-palette-list{overflow-y:auto;max-height:calc(72vh - 54px);padding:8px 0}
.cmd-palette-empty{padding:14px 14px;font-size:11px;color:${T.muted};font-family:${F.body}}
.cmd-palette-group{
  padding:10px 14px 4px;font-size:9px;color:#646464;font-family:${F.display};letter-spacing:.5px;
}
.cmd-palette-row{
  width:100%;text-align:left;border:none;background:transparent;
  color:${T.text};padding:10px 14px;cursor:pointer;display:flex;align-items:center;gap:12px;
  font-family:${F.body};
}
.cmd-palette-row.active{
  background:rgba(166,110,255,.16);
  border-top:1px solid rgba(166,110,255,.25);
  border-bottom:1px solid rgba(166,110,255,.25);
  color:#efe4ff;
}
.cmd-palette-label{font-size:12px;flex:1}
.cmd-palette-hint{font-size:10px;color:${T.muted};font-family:${F.body}}

/* Responsive Utilities */
@media (max-width: 600px) {
  .stack-mobile { flex-direction: column !important; align-items: stretch !important; }
  .tab-grid { display: grid !important; grid-template-columns: repeat(2, 1fr) !important; gap: 4px !important; }
  .tab-btn { font-size: 8px !important; padding: 12px 0 !important; }
  .sec-header { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
  .sec-header .spacer { display: none !important; }
  .erow { flex-wrap: wrap !important; gap: 10px 8px !important; }
  .erow .lvl-container { width: 100% !important; justify-content: flex-end !important; margin-top: 4px !important; }
  .wiki-panel { margin-left: 0 !important; }
}
@media (max-width: 400px) {
  .tab-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .go-btn { font-size: 8px !important; padding: 16px 8px !important; }
}
`;
