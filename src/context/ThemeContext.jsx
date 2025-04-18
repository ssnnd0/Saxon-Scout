import React, { createContext, useState, useContext, useEffect } from 'react';

// Define theme types
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  BLUE: 'blue',
  GREY: 'grey',
};

// Define theme colors for each theme
const themeColors = {
  [THEMES.LIGHT]: {
    primary: {
      50: '#e6f1ff',
      100: '#cce4ff',
      200: '#99c8ff',
      300: '#66adff',
      400: '#3391ff',
      500: '#0070f3',
      600: '#005ac2',
      700: '#004392',
      800: '#002d61',
      900: '#001631',
    },
    background: '#ffffff',
    surface: '#f8f9fa',
    text: {
      primary: '#1f2937',
      secondary: '#4b5563',
      disabled: '#9ca3af',
    },
    border: '#e5e7eb',
  },
  [THEMES.DARK]: {
    primary: {
      50: '#e6f1ff',
      100: '#cce4ff',
      200: '#99c8ff',
      300: '#66adff',
      400: '#3391ff',
      500: '#0070f3',
      600: '#005ac2',
      700: '#004392',
      800: '#002d61',
      900: '#001631',
    },
    background: '#121212',
    surface: '#1e1e1e',
    text: {
      primary: '#f3f4f6',
      secondary: '#d1d5db',
      disabled: '#6b7280',
    },
    border: '#374151',
  },
  [THEMES.BLUE]: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    background: '#0f172a',
    surface: '#1e293b',
    text: {
      primary: '#f8fafc',
      secondary: '#e2e8f0',
      disabled: '#94a3b8',
    },
    border: '#334155',
  },
  [THEMES.GREY]: {
    primary: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    background: '#f3f4f6',
    surface: '#ffffff',
    text: {
      primary: '#1f2937',
      secondary: '#4b5563',
      disabled: '#9ca3af',
    },
    border: '#d1d5db',
  },
};

// Create ThemeContext
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to grey theme
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || THEMES.GREY;
  });

  // Set CSS variables based on theme
  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('theme', theme);

    // Apply theme by setting CSS variables
    const root = document.documentElement;

    // Reset previous theme variables
    Object.values(THEMES).forEach((themeName) => {
      root.classList.remove(`theme-${themeName}`);
    });

    // Add current theme class
    root.classList.add(`theme-${theme}`);

    // Set CSS variables for the current theme
    const colors = themeColors[theme];
    
    // Apply primary color variants
    Object.entries(colors.primary).forEach(([shade, value]) => {
      root.style.setProperty(`--color-primary-${shade}`, value);
    });

    // Apply other theme colors
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-surface', colors.surface);
    root.style.setProperty('--color-text-primary', colors.text.primary);
    root.style.setProperty('--color-text-secondary', colors.text.secondary);
    root.style.setProperty('--color-text-disabled', colors.text.disabled);
    root.style.setProperty('--color-border', colors.border);

    // Handle dark mode for system elements
    if (theme === THEMES.DARK || theme === THEMES.BLUE) {
      root.classList.add('dark');
      document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', 'dark');
    } else {
      root.classList.remove('dark');
      document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', 'light');
    }
  }, [theme]);

  // Function to change theme
  const setThemeMode = (newTheme) => {
    if (Object.values(THEMES).includes(newTheme)) {
      setTheme(newTheme);
    } else {
      console.error(`Invalid theme: ${newTheme}`);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeMode, THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 