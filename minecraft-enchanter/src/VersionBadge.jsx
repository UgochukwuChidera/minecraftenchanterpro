// VersionBadge.jsx
// Single source of truth for app version — matches Changelog latest entry
// Usage: import VersionBadge from "./VersionBadge";
//        <VersionBadge />  or  <VersionBadge onClick={() => setTab("changelog")} />

export const APP_VERSION = "1.5.0";

export default function VersionBadge({ onClick }) {
  return (
    <span
      onClick={onClick}
      title={`v${APP_VERSION} — click to see changelog`}
      style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 7,
        color: "#333",
        border: "1px solid #1e1e1e",
        borderRadius: 4,
        padding: "3px 6px",
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
        transition: "color .15s, border-color .15s",
        letterSpacing: 0.5,
        lineHeight: 1,
      }}
      onMouseEnter={e => {
        if (!onClick) return;
        e.target.style.color = "#a66eff";
        e.target.style.borderColor = "rgba(166,110,255,.3)";
      }}
      onMouseLeave={e => {
        e.target.style.color = "#333";
        e.target.style.borderColor = "#1e1e1e";
      }}
    >
      v{APP_VERSION}
    </span>
  );
}