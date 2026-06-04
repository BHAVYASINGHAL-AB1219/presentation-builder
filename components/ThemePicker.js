"use client";

import { getAllThemes } from "@/lib/design/themes";

/**
 * ThemePicker — Visual theme selector with mini previews.
 * Switching themes instantly updates CSS custom properties.
 */
export default function ThemePicker({ currentTheme, onThemeChange }) {
  const themes = getAllThemes();

  return (
    <div className="theme-picker">
      <div className="theme-picker-title">Theme</div>
      <div className="theme-grid">
        {themes.map((theme) => (
          <button
            key={theme.id}
            className={`theme-option ${
              currentTheme === theme.id ? "active" : ""
            }`}
            onClick={() => onThemeChange(theme.id)}
            title={theme.description}
          >
            <div
              className="theme-preview"
              style={{ background: theme.preview.bg }}
            >
              <div
                className="theme-preview-bar"
                style={{ background: theme.preview.accent }}
              />
            </div>
            <div className="theme-name">{theme.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
