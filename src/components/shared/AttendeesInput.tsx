import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Users } from 'lucide-react';

interface AttendeesInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export function AttendeesInput({
  value,
  onChange,
  min = 1,
  max = 1000,
  step = 1,
  disabled = false
}: AttendeesInputProps) {
  const [inputValue, setInputValue] = useState<string>(value.toString());

  // Synchroniser la valeur interne avec la valeur externe
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleIncrement = () => {
    if (!disabled) {
      const newValue = Math.min(max, value + step);
      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    if (!disabled) {
      const newValue = Math.max(min, value - step);
      onChange(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Valider et convertir en nombre
    if (newValue === '') {
      return;
    }
    
    const numValue = parseInt(newValue, 10);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const handleInputBlur = () => {
    // Corriger la valeur si invalide
    const numValue = parseInt(inputValue, 10);
    if (isNaN(numValue) || numValue < min) {
      setInputValue(min.toString());
      onChange(min);
    } else if (numValue > max) {
      setInputValue(max.toString());
      onChange(max);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleIncrement();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleDecrement();
    }
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium">
        <Users className="w-4 h-4" />
        Nombre de participants
      </label>
      
      <div className="flex items-center gap-2">
        {/* Bouton décrément */}
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          className={`
            flex items-center justify-center
            w-10 h-10 rounded-lg border
            ${disabled || value <= min
              ? 'border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }
            transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
          `}
          aria-label="Diminuer le nombre de participants"
        >
          <ChevronDown className="w-5 h-5" />
        </button>

        {/* Champ de saisie */}
        <div className="relative flex-1">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            disabled={disabled}
            className={`
              w-full h-10 px-4 text-center border rounded-lg
              ${disabled
                ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              font-medium
            `}
            aria-label="Nombre de participants"
          />
          
          {/* Indicateur d'édition au clavier */}
          {!disabled && (
            <div className="absolute inset-y-0 right-3 flex items-center">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                ↑↓
              </span>
            </div>
          )}
        </div>

        {/* Bouton incrément */}
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          className={`
            flex items-center justify-center
            w-10 h-10 rounded-lg border
            ${disabled || value >= max
              ? 'border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }
            transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
          `}
          aria-label="Augmenter le nombre de participants"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      </div>

      {/* Indicateur de plage */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Minimum: {min}</span>
        <span>Maximum: {max}</span>
      </div>

      {/* Aide pour mobile */}
      <div className="text-xs text-gray-500 dark:text-gray-400 lg:hidden">
        <p>• Appuyez sur les boutons ↑↓ pour ajuster</p>
        <p>• Tapez directement pour saisir un nombre</p>
      </div>
    </div>
  );
}