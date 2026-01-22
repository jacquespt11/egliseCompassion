// src/components/shared/ThemeToggle.tsx
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative flex items-center justify-center
        w-10 h-10 rounded-lg
        bg-gray-100 dark:bg-gray-800
        hover:bg-gray-200 dark:hover:bg-gray-700
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-blue-500
        group
      `}
      aria-label={`Basculer en mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
      title={`Mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
    >
      {/* Conteneur des icônes avec animation */}
      <div className="relative w-5 h-5 overflow-hidden">
        {/* Soleil - visible en mode sombre */}
        <Sun
          className={`
            absolute inset-0 w-5 h-5
            transition-all duration-300 ease-in-out
            ${theme === 'dark' 
              ? 'opacity-100 rotate-0 text-yellow-500' 
              : 'opacity-0 -rotate-90'
            }
          `}
        />
        
        {/* Lune - visible en mode clair */}
        <Moon
          className={`
            absolute inset-0 w-5 h-5
            transition-all duration-300 ease-in-out
            ${theme === 'light' 
              ? 'opacity-100 rotate-0 text-gray-700' 
              : 'opacity-0 rotate-90'
            }
          `}
        />
      </div>
      
      {/* Effet de halo subtil */}
      <div className={`
        absolute inset-0 rounded-lg
        transition-opacity duration-300
        ${theme === 'dark' 
          ? 'bg-gradient-to-br from-yellow-400/10 to-yellow-600/5 opacity-0 group-hover:opacity-100' 
          : 'bg-gradient-to-br from-blue-400/10 to-blue-600/5 opacity-0 group-hover:opacity-100'
        }
      `} />
    </button>
  );
}