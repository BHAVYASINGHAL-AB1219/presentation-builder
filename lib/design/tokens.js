/**
 * Design Tokens — Single source of truth for spacing, typography, elevation, and motion.
 * These are framework-agnostic values injected into CSS via globals.css.
 */

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
};

export const typography = {
  fontFamilies: {
    heading: "'Inter', 'Segoe UI', sans-serif",
    body: "'Inter', 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', monospace",
    serif: "'Playfair Display', Georgia, serif",
  },
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeights: {
    tight: 1.15,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.7,
  },
};

export const elevation = {
  none: 'none',
  sm: '0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.1)',
  md: '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)',
  lg: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
  xl: '0 20px 25px rgba(0,0,0,0.1), 0 8px 10px rgba(0,0,0,0.04)',
  '2xl': '0 25px 50px rgba(0,0,0,0.25)',
  glow: '0 0 30px rgba(99,102,241,0.3)',
  glowStrong: '0 0 60px rgba(99,102,241,0.4)',
};

export const radii = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px',
};

export const transitions = {
  fast: '150ms ease',
  normal: '250ms ease',
  slow: '400ms ease',
  spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
};

export const zIndex = {
  base: 0,
  dropdown: 10,
  overlay: 20,
  modal: 30,
  toast: 40,
  tooltip: 50,
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

/** Slide-specific tokens */
export const slide = {
  aspectRatio: '16 / 9',
  maxWidth: '960px',
  thumbnailWidth: '160px',
  gap: '24px',
};
