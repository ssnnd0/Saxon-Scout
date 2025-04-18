import React from 'react';
import { Sun, Moon, PaintBucket } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, setTheme, THEMES } = useTheme();

  // Function to cycle through themes
  const cycleTheme = () => {
    switch (theme) {
      case THEMES.LIGHT:
        setTheme(THEMES.DARK);
        break;
      case THEMES.DARK:
        setTheme(THEMES.BLUE);
        break;
      case THEMES.BLUE:
      default:
        setTheme(THEMES.LIGHT);
        break;
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={cycleTheme}
        className="flex items-center justify-center p-2 rounded-md text-text-secondary hover:bg-surface hover:text-text-primary transition-colors"
        aria-label="Toggle theme"
      >
        {theme === THEMES.LIGHT && <Sun className="h-5 w-5" />}
        {theme === THEMES.DARK && <Moon className="h-5 w-5" />}
        {theme === THEMES.BLUE && <PaintBucket className="h-5 w-5" />}
      </button>
      
      <div className="hidden md:flex ml-2">
        <button
          onClick={() => setTheme(THEMES.LIGHT)}
          className={`p-1.5 rounded-md ${theme === THEMES.LIGHT ? 'bg-primary-100 text-primary-600' : 'hover:bg-surface'}`}
          aria-label="Light theme"
        >
          <Sun className="h-4 w-4" />
        </button>
        <button
          onClick={() => setTheme(THEMES.DARK)}
          className={`p-1.5 rounded-md ${theme === THEMES.DARK ? 'bg-primary-100 text-primary-600' : 'hover:bg-surface'}`}
          aria-label="Dark theme"
        >
          <Moon className="h-4 w-4" />
        </button>
        <button
          onClick={() => setTheme(THEMES.BLUE)}
          className={`p-1.5 rounded-md ${theme === THEMES.BLUE ? 'bg-primary-100 text-primary-600' : 'hover:bg-surface'}`}
          aria-label="Blue theme"
        >
          <PaintBucket className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle; 