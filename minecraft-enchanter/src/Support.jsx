// ═══════════════════════════════════════════════════════════
//  SUPPORT — Feedback & bug reports via Web3Forms (free)
//
//  Setup (one-time, 2 minutes, totally free):
//    1. Go to https://web3forms.com
//    2. Enter your email → click "Create Access Key"
//    3. Copy the key and replace WEB3FORMS_KEY below
// ═══════════════════════════════════════════════════════════
import { useState, useEffect, useRef, useCallback } from "react";
import { T } from "./theme.js";
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

const POLL_INTERVAL = 8000; // ms between online checks when offline

// ── Toast ─────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none",
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          padding: "10px 16px", borderRadius: 8, fontSize: 11,
          fontFamily: "'IBM Plex Mono'", maxWidth: 300,
          background: t.type === "success" ? "rgba(74,222,128,.12)"
                    : t.type === "error"   ? "rgba(239,68,68,.12)"
                    : t.type === "online"  ? "rgba(74,222,128,.1)"
                    :                        "rgba(251,191,36,.1)",
          border: `1px solid ${
            t.type === "success" ? "rgba(74,222,128,.3)"
          : t.type === "error"   ? "rgba(239,68,68,.3)"
          : t.type === "online"  ? "rgba(74,222,128,.25)"
          :                        "rgba(251,191,36,.25)"}`,
          color:  t.type === "success" ? "#4ade80"
                : t.type === "error"   ? "#ef4444"
                : t.type === "online"  ? "#4ade80"
                :                        "#f5c400",
          boxShadow: "0 4px 20px rgba(0,0,0,.4)",
          animation: "fadeSlideIn .2s ease",
          pointerEvents: "none",
        }}>
          {t.icon} {t.text}
        </div>
      ))}
    </div>
  );
}

function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((text, type = "info", icon = "") => {
    const id = Date.now() + Math.random();
    setToasts(ts => [...ts, { id, text, type, icon }]);
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 4000);
  }, []);
  return { toasts, push };
}

// ── Main Component ────────────────────────────────────────
export default function Support() {
  const { toasts, push } = useToasts();
  const [online, setOnline]     = useState(navigator.onLine);
  const [form, setForm]         = useState({ name: "", email: "", type: "bug", message: "" });
  const [sending, setSending]   = useState(false);
  const [sent, setSent]         = useState(false);
  const pollRef                 = useRef(null);

  // ── Online / offline detection ──────────────────────────
  const checkOnline = useCallback(async () => {
    try {
      // Ping a tiny reliable endpoint — web3forms itself
      await fetch("https://api.web3forms.com/ping", { method: "HEAD", mode: "no-cors", cache: "no-store" });
      if (!online) {
        setOnline(true);
        push("You're back online — support form is active again.", "online", "🟢");
      }
    } catch {
      // still offline — keep polling
    }
  }, [online, push]);

  useEffect(() => {
    const goOnline  = () => { setOnline(true);  push("You're back online — support form is active again.", "online",  "🟢"); };
    const goOffline = () => { setOnline(false); push("You're currently offline — messages can't be sent.", "warning", "🔴"); };

    window.addEventListener("online",  goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online",  goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, [push]);

  // Poll when offline so we catch reconnections the browser event misses
  useEffect(() => {
    if (!online) {
      pollRef.current = setInterval(checkOnline, POLL_INTERVAL);
    } else {
      clearInterval(pollRef.current);
    }
    return () => clearInterval(pollRef.current);
  }, [online, checkOnline]);

  // ── Form submit ─────────────────────────────────────────
  const handleSubmit = async () => {
    if (!online) {
      push("Can't send — you're offline. We'll let you know when you're back.", "error", "📵");
      return;
    }
    if (!form.name.trim() || !form.message.trim()) {
      push("Name and message are required.", "error", "⚠️");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `[Minecraft Enchanter Pro] ${TYPES.find(t => t.id === form.type)?.label || form.type} report`,
          name:    form.name.trim(),
          email:   form.email.trim() || "not provided",
          message: form.message.trim(),
          type:    form.type,
          from_name: "Minecraft Enchanter Pro",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        setForm({ name: "", email: "", type: "bug", message: "" });
        push("Message sent! Thanks for the feedback.", "success", "✅");
        setTimeout(() => setSent(false), 6000);
      } else {
        push("Delivery failed — please try again.", "error", "❌");
      }
    } catch {
      push("Network error — check your connection.", "error", "❌");
    } finally {
      setSending(false);
    }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <>
      <Toast toasts={toasts} />

      {/* ── Offline banner ── */}
      {!online && (
        <div style={{
          marginBottom: 16, padding: "10px 14px", borderRadius: 7,
          background: "rgba(251,191,36,.07)", border: "1px solid rgba(251,191,36,.25)",
          fontSize: 11, color: "#f5c400", display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 16 }}>📵</span>
          <div>
            <strong>You're currently offline.</strong> The support form will become active again automatically when your connection is restored.
            <span style={{ marginLeft: 8, opacity: .6 }}>Checking every {POLL_INTERVAL / 1000}s…</span>
          </div>
        </div>
      )}

      {/* ── Online indicator ── */}
      {online && (
        <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: T.muted }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "inline-block", boxShadow: "0 0 6px #4ade80" }} />
          Connected — form is active
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ marginBottom: 20, padding: "14px 16px", background: T.s2, border: `1px solid ${T.border}`, borderRadius: 9 }}>
        <div style={{ fontSize: 12, color: T.text, marginBottom: 6, fontFamily: "'Press Start 2P'" }}>💬 SEND FEEDBACK</div>
        <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.7 }}>
          Found a bug? Got an idea for a feature? Something feels off? Send it directly — every message goes to the developer's inbox.
        </div>
      </div>

      {/* ── Type selector ── */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 10, color: T.muted, marginBottom: 6, fontFamily: "'Press Start 2P'" }}>TYPE</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {TYPES.map(t => (
            <button key={t.id} onClick={() => set("type", t.id)}
              style={{
                padding: "7px 14px", borderRadius: 6, cursor: "pointer",
                fontSize: 11, fontFamily: "'IBM Plex Mono'",
                background: form.type === t.id ? `${t.color}18` : T.s2,
                border:     `1px solid ${form.type === t.id ? t.color : T.border}`,
                color:      form.type === t.id ? t.color : T.muted,
              }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Name + Email row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <div>
          <label style={labelStyle}>NAME <span style={{ color: T.red }}>*</span></label>
          <input value={form.name} onChange={e => set("name", e.target.value)}
            placeholder="Your name or handle" maxLength={60}
            style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>EMAIL <span style={{ color: T.muted, fontSize: 9 }}>(optional — for replies)</span></label>
          <input value={form.email} onChange={e => set("email", e.target.value)}
            placeholder="you@example.com" type="email" maxLength={120}
            style={inputStyle} />
        </div>
      </div>

      {/* ── Message ── */}
      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>MESSAGE <span style={{ color: T.red }}>*</span></label>
        <textarea value={form.message} onChange={e => set("message", e.target.value)}
          placeholder={PLACEHOLDERS[form.type]}
          maxLength={2000} rows={6}
          style={{ ...inputStyle, resize: "vertical", minHeight: 120, lineHeight: 1.6 }} />
        <div style={{ textAlign: "right", fontSize: 10, color: T.muted, marginTop: 3 }}>
          {form.message.length} / 2000
        </div>
      </div>

      {/* ── Send button ── */}
      {sent ? (
        <div style={{ padding: "13px 0", textAlign: "center", borderRadius: 8,
          background: "rgba(74,222,128,.08)", border: "1px solid rgba(74,222,128,.2)",
          fontSize: 11, color: "#4ade80", fontFamily: "'Press Start 2P'" }}>
          ✓ MESSAGE SENT — THANK YOU!
        </div>
      ) : (
        <button onClick={handleSubmit} disabled={sending || !online || !form.name.trim() || !form.message.trim()}
          style={{
            width: "100%", padding: "13px 0", borderRadius: 8, cursor: sending ? "wait" : "pointer",
            background: (!online || !form.name.trim() || !form.message.trim())
              ? T.s2
              : "linear-gradient(135deg,#5f1fd4,#a66eff)",
            color: (!online || !form.name.trim() || !form.message.trim()) ? "#333" : "#fff",
            border: `1.5px solid ${(!online || !form.name.trim() || !form.message.trim()) ? T.border : T.accent}`,
            fontFamily: "'Press Start 2P'", fontSize: 10, letterSpacing: 1,
            boxShadow: (!online || !form.name.trim() || !form.message.trim()) ? "none" : "0 4px 20px rgba(166,110,255,.25)",
            opacity: sending ? 0.7 : 1,
          }}>
          {sending ? "⏳  SENDING…" : !online ? "📵  OFFLINE" : "📨  SEND MESSAGE"}
        </button>
      )}

      {/* ── Footer note ── */}
      <div style={{ marginTop: 16, padding: "8px 12px", background: T.s2,
        border: `1px solid ${T.border}`, borderRadius: 6,
        fontSize: 10, color: T.muted, lineHeight: 1.8 }}>
        🔒 Messages are delivered directly to the developer via <strong style={{ color: T.muted2 }}>Web3Forms</strong> (free, no ads, no data selling).
        Your email is only used to reply — never shared.
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

const TYPES = [
  { id: "bug",         label: "Bug Report",      icon: "🐛", color: "#ef4444" },
  { id: "improvement", label: "Improvement",      icon: "💡", color: "#a66eff" },
  { id: "data",        label: "Wrong Data",       icon: "📊", color: "#f5c400" },
  { id: "other",       label: "Other",            icon: "💬", color: "#60a5fa" },
];

const PLACEHOLDERS = {
  bug:         "Describe what happened, what you expected, and how to reproduce it…",
  improvement: "Describe the feature or change you'd like to see and why it would help…",
  data:        "Which item or enchantment has incorrect data, and what should it say?",
  other:       "Whatever's on your mind…",
};

const labelStyle = {
  display: "block", fontSize: 9, color: "#555",
  fontFamily: "'Press Start 2P'", marginBottom: 5, letterSpacing: 0.5,
};

const inputStyle = {
  width: "100%", background: "#0e0e1a",
  border: "1px solid #1e1e2e", borderRadius: 6,
  padding: "8px 10px", fontSize: 12, color: "#e0e0e0",
  outline: "none", fontFamily: "'IBM Plex Mono'",
  boxSizing: "border-box",
  transition: "border-color .15s",
};
