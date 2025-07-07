import React from 'react';
import { Sun, Moon } from 'lucide-react';
import useUserStore from '../store/userStore';

function ThemeToggle() {
  const { theme, toggleTheme } = useUserStore();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 left-4 z-50 p-3 rounded-full bg-dark-300/80 backdrop-blur border border-dark-100 hover:bg-dark-200/80 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-blue-400" />
      )}
    </button>
  );
}

export default ThemeToggle;