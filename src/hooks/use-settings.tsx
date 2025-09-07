"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { AppSettings } from '@/lib/types';
import { hsl, parse } from 'culori';

const hexToHslString = (hex: string): string => {
  if (!hex) return "";
  try {
    const parsed = parse(hex);
    if (!parsed) return "";
    const hslColor = hsl(parsed);
    if (!hslColor) return "";
    return `${Math.round(hslColor.h || 0)} ${Math.round(hslColor.s * 100)}% ${Math.round(hslColor.l * 100)}%`;
  } catch (error) {
    console.error("Error converting hex to HSL:", error);
    return "";
  }
};

const _applyTheme = (settings: AppSettings) => {
    if (typeof window === 'undefined') return;
    try {
      const root = document.documentElement;
      const { theme, appearance } = settings;

      // Apply light/dark mode
      root.classList.remove('light', 'dark');
      root.classList.add(appearance);

      // Apply theme colors
      const primaryHsl = hexToHslString(theme.primaryColor);
      
      if (primaryHsl) {
        root.style.setProperty('--primary', primaryHsl);
        root.style.setProperty('--accent', primaryHsl);
        root.style.setProperty('--ring', primaryHsl);
      }
      
      // We only apply background/foreground for custom themes in dark mode,
      // as light mode uses the new default theme colors.
      if (appearance === 'dark') {
        const backgroundHsl = hexToHslString(theme.backgroundColor);
        const foregroundHsl = hexToHslString(theme.foregroundColor);
        if (backgroundHsl) {
            root.style.setProperty('--background', backgroundHsl);
        }
        if (foregroundHsl) {
            root.style.setProperty('--foreground', foregroundHsl);
        }
      } else {
        // Reset to default light theme variables from globals.css
        root.style.removeProperty('--background');
        root.style.removeProperty('--foreground');
      }

    } catch (error) {
        console.error('Failed to apply theme', error);
    }
};


const defaultSettings: AppSettings = {
  appearance: 'dark',
  theme: {
    name: 'Predeterminado',
    primaryColor: '#ff0000', // Red
    backgroundColor: '#111827', // Dark Gray
    foregroundColor: '#f9fafb', // Off-white
  },
};

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: AppSettings) => void;
  applyTheme: (settings: AppSettings) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    if (typeof window === 'undefined') {
      return defaultSettings;
    }
    try {
      const item = window.localStorage.getItem('app-settings');
      return item ? JSON.parse(item) : defaultSettings;
    } catch (error) {
      console.error(error);
      return defaultSettings;
    }
  });
  
  // Apply theme on initial load
  useEffect(() => {
    if (settings) {
      _applyTheme(settings);
    }
  }, [settings]);


  const updateSettings = useCallback((newSettings: AppSettings) => {
    try {
      window.localStorage.setItem('app-settings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings', error);
    }
  }, []);
  
  const applyTheme = useCallback((themeSettings: AppSettings) => {
    _applyTheme(themeSettings);
  }, []);

  const value = useMemo(() => ({ settings, updateSettings, applyTheme }), [settings, updateSettings, applyTheme]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
