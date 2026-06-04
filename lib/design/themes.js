/**
 * Theme Registry — 8 curated themes for presentations.
 * Each theme provides colors, typography pairings, and decorative element styles.
 * These are mapped to CSS custom properties at runtime for instant theme switching.
 */

const themes = {
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    description: 'Dark & sleek with electric blue accents',
    preview: { bg: '#0F172A', accent: '#3B82F6' },
    colors: {
      slideBg: '#0F172A',
      slideBgAlt: '#1E293B',
      cardBg: '#1E293B',
      heading: '#F1F5F9',
      body: '#CBD5E1',
      muted: '#64748B',
      accent: '#3B82F6',
      accentLight: '#60A5FA',
      accentGlow: 'rgba(59, 130, 246, 0.25)',
      border: 'rgba(148, 163, 184, 0.15)',
      gradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
    },
    fonts: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif",
    },
    decorative: {
      shapeColor: '#3B82F6',
      shapeOpacity: 0.15,
      accentBarColor: '#3B82F6',
      cornerRadius: '12px',
    },
  },

  aurora: {
    id: 'aurora',
    name: 'Aurora',
    description: 'Vibrant purple-to-teal gradients',
    preview: { bg: '#1a1035', accent: '#8B5CF6' },
    colors: {
      slideBg: '#1a1035',
      slideBgAlt: '#0f0d23',
      cardBg: '#241b4a',
      heading: '#F5F3FF',
      body: '#C4B5FD',
      muted: '#7C3AED',
      accent: '#8B5CF6',
      accentLight: '#A78BFA',
      accentGlow: 'rgba(139, 92, 246, 0.3)',
      border: 'rgba(167, 139, 250, 0.15)',
      gradient: 'linear-gradient(135deg, #1a1035 0%, #0d3340 50%, #1a1035 100%)',
    },
    fonts: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif",
    },
    decorative: {
      shapeColor: '#8B5CF6',
      shapeOpacity: 0.12,
      accentBarColor: '#14B8A6',
      cornerRadius: '16px',
    },
  },

  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean whitespace with charcoal text',
    preview: { bg: '#FFFFFF', accent: '#18181B' },
    colors: {
      slideBg: '#FFFFFF',
      slideBgAlt: '#FAFAFA',
      cardBg: '#FFFFFF',
      heading: '#18181B',
      body: '#3F3F46',
      muted: '#A1A1AA',
      accent: '#18181B',
      accentLight: '#52525B',
      accentGlow: 'rgba(24, 24, 27, 0.08)',
      border: 'rgba(0, 0, 0, 0.08)',
      gradient: 'linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%)',
    },
    fonts: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif",
    },
    decorative: {
      shapeColor: '#E4E4E7',
      shapeOpacity: 0.5,
      accentBarColor: '#18181B',
      cornerRadius: '8px',
    },
  },

  corporate: {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional slate blue & warm gray',
    preview: { bg: '#F8FAFC', accent: '#1E40AF' },
    colors: {
      slideBg: '#F8FAFC',
      slideBgAlt: '#F1F5F9',
      cardBg: '#FFFFFF',
      heading: '#1E293B',
      body: '#475569',
      muted: '#94A3B8',
      accent: '#1E40AF',
      accentLight: '#3B82F6',
      accentGlow: 'rgba(30, 64, 175, 0.1)',
      border: 'rgba(0, 0, 0, 0.06)',
      gradient: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
    },
    fonts: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif",
    },
    decorative: {
      shapeColor: '#1E40AF',
      shapeOpacity: 0.08,
      accentBarColor: '#1E40AF',
      cornerRadius: '8px',
    },
  },

  sunset: {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm coral-to-amber creative energy',
    preview: { bg: '#1C1017', accent: '#F97316' },
    colors: {
      slideBg: '#1C1017',
      slideBgAlt: '#2A1520',
      cardBg: '#2A1520',
      heading: '#FFF7ED',
      body: '#FDBA74',
      muted: '#C2410C',
      accent: '#F97316',
      accentLight: '#FB923C',
      accentGlow: 'rgba(249, 115, 22, 0.25)',
      border: 'rgba(251, 146, 60, 0.15)',
      gradient: 'linear-gradient(135deg, #1C1017 0%, #2A1520 50%, #1C1017 100%)',
    },
    fonts: {
      heading: "'Playfair Display', serif",
      body: "'Inter', sans-serif",
    },
    decorative: {
      shapeColor: '#F97316',
      shapeOpacity: 0.12,
      accentBarColor: '#EF4444',
      cornerRadius: '16px',
    },
  },

  forest: {
    id: 'forest',
    name: 'Forest',
    description: 'Earthy deep green & warm cream',
    preview: { bg: '#0C1A0F', accent: '#22C55E' },
    colors: {
      slideBg: '#0C1A0F',
      slideBgAlt: '#14261A',
      cardBg: '#14261A',
      heading: '#F0FDF4',
      body: '#86EFAC',
      muted: '#166534',
      accent: '#22C55E',
      accentLight: '#4ADE80',
      accentGlow: 'rgba(34, 197, 94, 0.2)',
      border: 'rgba(74, 222, 128, 0.12)',
      gradient: 'linear-gradient(135deg, #0C1A0F 0%, #14261A 50%, #0C1A0F 100%)',
    },
    fonts: {
      heading: "'Playfair Display', serif",
      body: "'Inter', sans-serif",
    },
    decorative: {
      shapeColor: '#22C55E',
      shapeOpacity: 0.1,
      accentBarColor: '#22C55E',
      cornerRadius: '12px',
    },
  },

  neon: {
    id: 'neon',
    name: 'Neon',
    description: 'Bold black with neon green & pink',
    preview: { bg: '#09090B', accent: '#22D3EE' },
    colors: {
      slideBg: '#09090B',
      slideBgAlt: '#18181B',
      cardBg: '#18181B',
      heading: '#F4F4F5',
      body: '#D4D4D8',
      muted: '#71717A',
      accent: '#22D3EE',
      accentLight: '#67E8F9',
      accentGlow: 'rgba(34, 211, 238, 0.3)',
      border: 'rgba(34, 211, 238, 0.15)',
      gradient: 'linear-gradient(135deg, #09090B 0%, #18181B 50%, #09090B 100%)',
    },
    fonts: {
      heading: "'JetBrains Mono', monospace",
      body: "'Inter', sans-serif",
    },
    decorative: {
      shapeColor: '#22D3EE',
      shapeOpacity: 0.15,
      accentBarColor: '#EC4899',
      cornerRadius: '4px',
    },
  },

  paper: {
    id: 'paper',
    name: 'Paper',
    description: 'Editorial off-white with elegant serifs',
    preview: { bg: '#FAF9F6', accent: '#92400E' },
    colors: {
      slideBg: '#FAF9F6',
      slideBgAlt: '#F5F0EB',
      cardBg: '#FFFFFE',
      heading: '#292524',
      body: '#57534E',
      muted: '#A8A29E',
      accent: '#92400E',
      accentLight: '#D97706',
      accentGlow: 'rgba(146, 64, 14, 0.08)',
      border: 'rgba(0, 0, 0, 0.06)',
      gradient: 'linear-gradient(135deg, #FAF9F6 0%, #F5F0EB 100%)',
    },
    fonts: {
      heading: "'Playfair Display', serif",
      body: "'Inter', sans-serif",
    },
    decorative: {
      shapeColor: '#D6D3D1',
      shapeOpacity: 0.3,
      accentBarColor: '#92400E',
      cornerRadius: '4px',
    },
  },
};

export const getTheme = (themeId) => themes[themeId] || themes.midnight;
export const getAllThemes = () => Object.values(themes);
export const themeIds = Object.keys(themes);
export default themes;
