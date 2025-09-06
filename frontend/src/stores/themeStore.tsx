import React, { createContext, useContext, ReactNode } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDark: boolean;
  primaryColor: string;
  accentColor: string;
  toggleTheme: () => void;
  setPrimaryColor: (color: string) => void;
  setAccentColor: (color: string) => void;
  reset: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: true,
      primaryColor: '#3b82f6',
      accentColor: '#8b5cf6',

      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
      
      setPrimaryColor: (color: string) => set({ primaryColor: color }),
      
      setAccentColor: (color: string) => set({ accentColor: color }),
      
      reset: () => set({
        isDark: true,
        primaryColor: '#3b82f6',
        accentColor: '#8b5cf6',
      }),
    }),
    {
      name: 'theme-storage',
    }
  )
);

const ThemeContext = createContext<ThemeState | null>(null);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const themeState = useThemeStore();

  return (
    <ThemeContext.Provider value={themeState}>
      <div className={themeState.isDark ? 'dark' : ''}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return useThemeStore();
  }
  return context;
};