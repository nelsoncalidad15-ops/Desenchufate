export interface BrandTheme {
  accent: string;
  soft: string;
  border: string;
  ink: string;
}

const THEMES: Record<string, BrandTheme> = {
  autolux: { accent: '#c81e1e', soft: '#fff1f2', border: '#fecdd3', ink: '#9f1239' },
  autosol: { accent: '#1769aa', soft: '#eff6ff', border: '#bfdbfe', ink: '#1d4ed8' },
  autociel: { accent: '#94a3b8', soft: '#f8fafc', border: '#cbd5e1', ink: '#475569' },
};

const DEFAULT_THEME: BrandTheme = {
  accent: '#0f766e',
  soft: '#f0fdfa',
  border: '#99f6e4',
  ink: '#0f766e',
};

export function getBrandTheme(companyName: string): BrandTheme {
  return THEMES[companyName.trim().toLowerCase()] || DEFAULT_THEME;
}
