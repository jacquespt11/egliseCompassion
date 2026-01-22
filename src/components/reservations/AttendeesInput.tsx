// src/components/reservations/AttendeesInput.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Minus, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface AttendeesInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
  showLabel?: boolean;
  roomCapacity?: number;
}

export const AttendeesInput: React.FC<AttendeesInputProps> = ({
  value,
  onChange,
  min = 1,
  max = 1000,
  disabled = false,
  className = '',
  showLabel = true,
  roomCapacity,
}) => {
  const [inputValue, setInputValue] = useState(value.toString());
  const [isEditing, setIsEditing] = useState(false);

  // Synchroniser la valeur interne avec la valeur externe
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleIncrement = () => {
    if (disabled) return;
    const newValue = value + 1;
    if (newValue <= (roomCapacity || max)) {
      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    if (disabled) return;
    const newValue = value - 1;
    if (newValue >= min) {
      onChange(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const newValue = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(newValue);

    if (newValue === '') {
      return;
    }

    const numValue = parseInt(newValue, 10);
    if (!isNaN(numValue)) {
      // Limiter la valeur entre min et max
      const finalMax = roomCapacity || max;
      const clampedValue = Math.min(Math.max(numValue, min), finalMax);
      onChange(clampedValue);
    }
  };

  const handleFocus = () => {
    setIsEditing(true);
    // Sélectionner tout le texte quand on clique
    setTimeout(() => {
      const input = document.getElementById('attendees-input');
      if (input instanceof HTMLInputElement) {
        input.select();
      }
    }, 10);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Si l'input est vide ou invalide, remettre la valeur minimale
    if (inputValue === '' || parseInt(inputValue, 10) < min) {
      onChange(min);
      setInputValue(min.toString());
    } else {
      // S'assurer que la valeur est dans les limites
      const finalMax = roomCapacity || max;
      const current = parseInt(inputValue, 10);
      const clampedValue = Math.min(Math.max(current, min), finalMax);
      if (current !== clampedValue) {
        onChange(clampedValue);
        setInputValue(clampedValue.toString());
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      setInputValue(value.toString());
      e.currentTarget.blur();
    }
  };

  // Calculer le pourcentage d'occupation si on a une capacité de salle
  const occupancyPercentage = roomCapacity ? Math.min((value / roomCapacity) * 100, 100) : null;
  const isNearCapacity = occupancyPercentage && occupancyPercentage > 80;

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Nombre de participants
          </label>
          {roomCapacity && (
            <span className={`text-xs ${isNearCapacity ? 'text-amber-600' : 'text-gray-500'}`}>
              Capacité: {roomCapacity} pers.
            </span>
          )}
        </div>
      )}

      <div className="flex items-stretch">
        {/* Bouton décrémenter */}
        <motion.button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            p-3 sm:p-4 border border-r-0 rounded-l-lg 
            ${disabled || value <= min
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
              : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10
          `}
          aria-label="Diminuer le nombre de participants"
        >
          <Minus className="w-5 h-5" />
        </motion.button>

        {/* Champ input avec indicateur */}
        <div className="relative flex-1">
          <input
            id="attendees-input"
            type="text"
            inputMode="numeric"
            value={isEditing ? inputValue : value}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={`
              w-full h-full py-3 sm:py-4 text-center border-y 
              text-lg font-semibold
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${disabled
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
              }
              transition-all duration-200
            `}
            aria-label="Nombre de participants"
          />
          
          {/* Icône d'utilisateurs */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Users className="w-5 h-5 text-gray-400" />
          </div>

          {/* Indicateur de capacité (si disponible) */}
          {roomCapacity && occupancyPercentage && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 overflow-hidden rounded-b">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${occupancyPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`
                  h-full ${isNearCapacity ? 'bg-amber-500' : 'bg-blue-500'}
                `}
              />
            </div>
          )}
        </div>

        {/* Bouton incrémenter */}
        <motion.button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || value >= (roomCapacity || max)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            p-3 sm:p-4 border border-l-0 rounded-r-lg
            ${disabled || value >= (roomCapacity || max)
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
              : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10
          `}
          aria-label="Augmenter le nombre de participants"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Informations supplémentaires */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span>Minimum: {min}</span>
          {roomCapacity && <span>•</span>}
          {roomCapacity && (
            <span className={isNearCapacity ? 'text-amber-600 font-medium' : ''}>
              Maximum: {roomCapacity}
            </span>
          )}
        </div>
        
        {/* Indicateur visuel pour mobile */}
        <div className="sm:hidden flex items-center gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-1 h-1 rounded-full ${
                value >= i * Math.ceil((roomCapacity || max) / 3)
                  ? 'bg-blue-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Message d'avertissement si près de la capacité */}
      {isNearCapacity && occupancyPercentage && occupancyPercentage > 90 && (
        <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded text-amber-800 dark:text-amber-200 text-xs">
          ⚠️ Attention: La salle sera presque pleine ({Math.round(occupancyPercentage)}%)
        </div>
      )}
    </div>
  );
};

export default AttendeesInput;