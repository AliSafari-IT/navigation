import { useEffect, useRef, useState } from "react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="demo-hero demo-logo">
      <svg className="demo-logo__mark" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="2" y="2" width="28" height="28" rx="10" fill="var(--accent)" />
        <path
          d="M16 6.5 18.9 13l6.6 2.9-6.6 2.9L16 25.5l-2.9-6.7L6.5 16l6.6-3L16 6.5Z"
          fill="var(--bg-elev)"
        />
        <circle cx="16" cy="16" r="2.4" fill="var(--accent)" />
      </svg>
      {!compact && <span>Navigation</span>}
    </span>
  );
}

const THEME_STORAGE_KEY = "asafarim-navigation-theme";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "dark" || storedTheme === "light") return storedTheme;

  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const syncTheme = () => {
      const nextTheme = document.documentElement.getAttribute("data-theme");
      if (nextTheme === "dark" || nextTheme === "light") setTheme(nextTheme);
    };
    window.addEventListener("themechange", syncTheme);
    return () => window.removeEventListener("themechange", syncTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    window.dispatchEvent(new Event("themechange"));
  }, [theme]);

  return (
    <button
      type="button"
      className="demo-btn theme-toggle"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
      <span className="theme-toggle__label">{theme === "light" ? "Dark" : "Light"}</span>
    </button>
  );
}

/* Demo "user avatar" → opens a dropdown trigger */
export function AvatarTrigger() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
      <span
        aria-hidden="true"
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "#7c3aed",
          color: "white",
          fontSize: 12,
          fontWeight: 700,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        A
      </span>
      <span style={{ fontSize: "0.875rem" }}>Ali ▾</span>
    </span>
  );
}

export function CodeBlock({ code }: { code: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div className="demo-code">
      <button
        type="button"
        className="demo-code-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="demo-code-chevron" data-open={open}>▶</span>
        {open ? "Hide code" : "Show code"}
      </button>
      {open && (
        <div className="demo-code-body">
          <button
            type="button"
            className="demo-code-copy"
            onClick={copy}
            aria-label="Copy code"
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
          <pre className="demo-code-pre"><code>{code}</code></pre>
        </div>
      )}
    </div>
  );
}

export function NotificationBell() {
  return (
    <button
      type="button"
      className="demo-btn"
      aria-label="Notifications"
      style={{ position: "relative" }}
    >
      🔔
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -4,
          right: -4,
          background: "#dc2626",
          color: "white",
          fontSize: 10,
          fontWeight: 700,
          padding: "2px 5px",
          borderRadius: 999,
        }}
      >
        2
      </span>
    </button>
  );
}
