// VersionBadge.jsx
// Single source of truth for app version — matches Changelog latest entry
// Usage: import VersionBadge from "./VersionBadge";
//        <VersionBadge />  or  <VersionBadge onClick={() => setTab("changelog")} />

export const APP_VERSION = "2.0.1";

export default function VersionBadge({ onClick }) {
  return (
    <span
      onClick={onClick}
      className="tooltip-trigger"
      data-tooltip={`v${APP_VERSION} — Click to view technical changelog and release history.`}
      style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 7,
        color: "#a66eff",
        background: "rgba(166,110,255,0.05)",
        border: "1px solid rgba(166,110,255,0.25)",
        borderRadius: 6,
        padding: "4px 8px",
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
        transition: "all .2s ease",
        letterSpacing: 0.5,
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
        boxShadow: "0 0 10px rgba(166,110,255,0.1)"
      }}
      onMouseEnter={e => {
        if (!onClick) return;
        e.currentTarget.style.color = "#fff";
        e.currentTarget.style.background = "#a66eff";
        e.currentTarget.style.borderColor = "#a66eff";
        e.currentTarget.style.boxShadow = "0 0 15px rgba(166,110,255,0.4)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = "#a66eff";
        e.currentTarget.style.background = "rgba(166,110,255,0.05)";
        e.currentTarget.style.borderColor = "rgba(166,110,255,0.25)";
        e.currentTarget.style.boxShadow = "0 0 10px rgba(166,110,255,0.1)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      v{APP_VERSION}
    </span>
  );
}