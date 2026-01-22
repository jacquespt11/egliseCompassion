// src/components/reservations/RecurrenceOptions.tsx
import React, { useState } from 'react';
import { Calendar, Repeat, X } from 'lucide-react';

// Définition des constantes au lieu des enums
const RECURRENCE_FREQUENCY = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  BIWEEKLY: 'BIWEEKLY',
  MONTHLY: 'MONTHLY'
} as const;

const RECURRENCE_END_TYPE = {
  DATE: 'date',
  COUNT: 'count',
  OCCURRENCES: 'occurrences'
} as const;

// Types pour les props
type RecurrenceOptionsProps = {
  value?: {
    frequency: string;
    interval: number;
    daysOfWeek: number[];
    endType: string;
    endDate?: string;
    occurrencesCount?: number;
  };
  onChange: (value: any) => void;
  onRemove: () => void;
};

const DAYS_OF_WEEK = [
  { id: 0, label: 'Dim' },
  { id: 1, label: 'Lun' },
  { id: 2, label: 'Mar' },
  { id: 3, label: 'Mer' },
  { id: 4, label: 'Jeu' },
  { id: 5, label: 'Ven' },
  { id: 6, label: 'Sam' },
];

export function RecurrenceOptions({ value, onChange, onRemove }: RecurrenceOptionsProps) {
  const [recurrence, setRecurrence] = useState({
    frequency: value?.frequency || RECURRENCE_FREQUENCY.WEEKLY,
    interval: value?.interval || 1,
    daysOfWeek: value?.daysOfWeek || [6], // Samedi par défaut
    endType: value?.endType || RECURRENCE_END_TYPE.COUNT,
    endDate: value?.endDate || '',
    occurrencesCount: value?.occurrencesCount || 3,
  });

  const handleChange = (updates: any) => {
    const newRecurrence = { ...recurrence, ...updates };
    setRecurrence(newRecurrence);
    onChange(newRecurrence);
  };

  const toggleDay = (day: number) => {
    const newDays = recurrence.daysOfWeek.includes(day)
      ? recurrence.daysOfWeek.filter(d => d !== day)
      : [...recurrence.daysOfWeek, day];
    handleChange({ daysOfWeek: newDays });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Repeat className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold">Réservation récurrente</h3>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Fréquence</label>
          <select
            value={recurrence.frequency}
            onChange={(e) => handleChange({ frequency: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-700"
          >
            <option value={RECURRENCE_FREQUENCY.WEEKLY}>Hebdomadaire</option>
            <option value={RECURRENCE_FREQUENCY.BIWEEKLY}>Bihebdomadaire</option>
            <option value={RECURRENCE_FREQUENCY.MONTHLY}>Mensuelle</option>
            <option value={RECURRENCE_FREQUENCY.DAILY}>Quotidienne</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Intervalle</label>
          <input
            type="number"
            min="1"
            max="12"
            value={recurrence.interval}
            onChange={(e) => handleChange({ interval: parseInt(e.target.value) || 1 })}
            className="w-full p-2 border rounded dark:bg-gray-700"
          />
          <p className="text-xs text-gray-500 mt-1">
            Ex: 2 = toutes les 2 semaines
          </p>
        </div>
      </div>

      {(recurrence.frequency === RECURRENCE_FREQUENCY.WEEKLY || recurrence.frequency === RECURRENCE_FREQUENCY.BIWEEKLY) && (
        <div>
          <label className="block text-sm font-medium mb-2">Jours de la semaine</label>
          <div className="flex flex-wrap gap-2">
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day.id}
                type="button"
                onClick={() => toggleDay(day.id)}
                className={`px-3 py-1 rounded-full text-sm ${
                  recurrence.daysOfWeek.includes(day.id)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Fin de la récurrence</label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="end-count"
              checked={recurrence.endType === RECURRENCE_END_TYPE.COUNT}
              onChange={() => handleChange({ endType: RECURRENCE_END_TYPE.COUNT })}
            />
            <label htmlFor="end-count" className="flex items-center space-x-2">
              <span>Après</span>
              <input
                type="number"
                min="1"
                max="52"
                value={recurrence.occurrencesCount}
                onChange={(e) => handleChange({ occurrencesCount: parseInt(e.target.value) || 1 })}
                className="w-16 p-1 border rounded dark:bg-gray-700"
                disabled={recurrence.endType !== RECURRENCE_END_TYPE.COUNT}
              />
              <span>occurrences</span>
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="end-date"
              checked={recurrence.endType === RECURRENCE_END_TYPE.DATE}
              onChange={() => handleChange({ endType: RECURRENCE_END_TYPE.DATE })}
            />
            <label htmlFor="end-date" className="flex items-center space-x-2">
              <span>Le</span>
              <input
                type="date"
                value={recurrence.endDate}
                onChange={(e) => handleChange({ endDate: e.target.value })}
                className="p-1 border rounded dark:bg-gray-700"
                disabled={recurrence.endType !== RECURRENCE_END_TYPE.DATE}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        <Calendar className="w-4 h-4 inline mr-1" />
        {recurrence.endType === RECURRENCE_END_TYPE.COUNT && (
          <span>{recurrence.occurrencesCount} occurence(s) créée(s)</span>
        )}
        {recurrence.endType === RECURRENCE_END_TYPE.DATE && recurrence.endDate && (
          <span>Jusqu'au {new Date(recurrence.endDate).toLocaleDateString()}</span>
        )}
      </div>
    </div>
  );
}