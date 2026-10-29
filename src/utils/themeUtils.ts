import { AppThemeConfig, ThemePreset } from '../types';

export const THEME_PRESETS: Record<
  ThemePreset,
  {
    nameBn: string;
    nameEn: string;
    descriptionBn: string;
    descriptionEn: string;
    config: AppThemeConfig;
  }
> = {
  professional_blue: {
    nameBn: 'প্রফেশনাল ব্লু (ডিফল্ট)',
    nameEn: 'Professional Blue',
    descriptionBn: 'নেভি ব্লু, সোনালী ও পরিষ্কার সাদা রঙের প্রফেশনাল রূপ',
    descriptionEn: 'Deep navy, gold accents, and clean white slate for enterprise business',
    config: {
      preset: 'professional_blue',
      colorMode: 'light',
      primaryColor: '#0f172a', // slate-950 / navy
      secondaryColor: '#1e3a8a', // blue-900
      accentColor: '#f59e0b', // amber-500 gold
      appBgColor: '#f8fafc', // slate-50
      cardBgColor: '#ffffff',
      textColor: '#0f172a',
      buttonShape: 'rounded-xl',
      cardRadius: 'rounded-2xl',
      fontSize: 'base',
    },
  },
  csc_green: {
    nameBn: 'সিএসসি গ্রিন (সবুজ)',
    nameEn: 'CSC Green',
    descriptionBn: 'গ্রামীণ ডিজিটাল কেন্দ্র ও কৃষি সেবার সবুজ প্রাকৃতিক ভাব',
    descriptionEn: 'Earthy emerald green and gold inspired by CSC & agriculture portals',
    config: {
      preset: 'csc_green',
      colorMode: 'light',
      primaryColor: '#064e3b', // emerald-900
      secondaryColor: '#047857', // emerald-700
      accentColor: '#10b981', // emerald-500
      appBgColor: '#f0fdf4', // emerald-50
      cardBgColor: '#ffffff',
      textColor: '#064e3b',
      buttonShape: 'rounded-xl',
      cardRadius: 'rounded-2xl',
      fontSize: 'base',
    },
  },
  purple_modern: {
    nameBn: 'পার্পল মডার্ন (আধুনিক)',
    nameEn: 'Purple Modern',
    descriptionBn: 'আধুনিক ফিনটেক ও ডিজিটাল ওয়ালেটের স্টাইলিশ ভায়োলেট লুক',
    descriptionEn: 'Modern fintech violet and electric indigo with smooth curves',
    config: {
      preset: 'purple_modern',
      colorMode: 'light',
      primaryColor: '#2e1065', // violet-950
      secondaryColor: '#581c87', // purple-900
      accentColor: '#a855f7', // purple-500
      appBgColor: '#faf5ff', // purple-50
      cardBgColor: '#ffffff',
      textColor: '#2e1065',
      buttonShape: 'rounded-full',
      cardRadius: 'rounded-3xl',
      fontSize: 'base',
    },
  },
  dark_premium: {
    nameBn: 'ডার্ক প্রিমিয়াম (রাতের মোড)',
    nameEn: 'Dark Premium',
    descriptionBn: 'চোখের প্রশান্তির জন্য গভীর ডার্ক স্লেট ও উজ্জ্বল অ্যাম্বার অ্যাকসেন্ট',
    descriptionEn: 'Deep obsidian and midnight slate with luminous gold accents',
    config: {
      preset: 'dark_premium',
      colorMode: 'dark',
      primaryColor: '#020617', // slate-950
      secondaryColor: '#0f172a', // slate-900
      accentColor: '#fbbf24', // amber-400
      appBgColor: '#090d16',
      cardBgColor: '#111827', // gray-900
      textColor: '#f8fafc',
      buttonShape: 'rounded-xl',
      cardRadius: 'rounded-2xl',
      fontSize: 'base',
    },
  },
  clean_white: {
    nameBn: 'ক্লিন হোয়াইট (সাদা ও ছিমছাম)',
    nameEn: 'Clean White',
    descriptionBn: 'অফিসিয়াল ডকুমেন্টের মতো পরিচ্ছন্ন ন্যূনতম ডিজাইন',
    descriptionEn: 'Ultra-clean minimalist monochrome with sharp subtle borders',
    config: {
      preset: 'clean_white',
      colorMode: 'light',
      primaryColor: '#1e293b', // slate-800
      secondaryColor: '#334155', // slate-700
      accentColor: '#0284c7', // sky-600
      appBgColor: '#ffffff',
      cardBgColor: '#f8fafc',
      textColor: '#0f172a',
      buttonShape: 'rounded-md',
      cardRadius: 'rounded-xl',
      fontSize: 'base',
    },
  },
  custom: {
    nameBn: 'কাস্টম থিম (পছন্দমতো রঙ)',
    nameEn: 'Custom Theme',
    descriptionBn: 'দোকান মালিকের নিজস্ব পছন্দের রঙ ও আকারের সংমিশ্রণ',
    descriptionEn: 'Personalized color palette customized by the business owner',
    config: {
      preset: 'custom',
      colorMode: 'light',
      primaryColor: '#0f172a',
      secondaryColor: '#1e3a8a',
      accentColor: '#f59e0b',
      appBgColor: '#f8fafc',
      cardBgColor: '#ffffff',
      textColor: '#0f172a',
      buttonShape: 'rounded-xl',
      cardRadius: 'rounded-2xl',
      fontSize: 'base',
    },
  },
};

/**
 * Apply the theme settings directly to HTML document root and CSS custom properties
 */
export function applyThemeToDocument(theme: AppThemeConfig): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Set CSS Custom Properties
  root.style.setProperty('--theme-primary', theme.primaryColor);
  root.style.setProperty('--theme-secondary', theme.secondaryColor);
  root.style.setProperty('--theme-accent', theme.accentColor);
  root.style.setProperty('--theme-app-bg', theme.appBgColor);
  root.style.setProperty('--theme-card-bg', theme.cardBgColor);
  root.style.setProperty('--theme-text', theme.textColor);

  // Sync background of body
  document.body.style.backgroundColor = theme.appBgColor;
  document.body.style.color = theme.textColor;

  // Dark Mode Class
  const isDark =
    theme.colorMode === 'dark' ||
    (theme.colorMode === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Base Font Size
  if (theme.fontSize === 'sm') {
    root.style.fontSize = '14px';
  } else if (theme.fontSize === 'lg') {
    root.style.fontSize = '16.5px';
  } else {
    root.style.fontSize = '15px';
  }
}
