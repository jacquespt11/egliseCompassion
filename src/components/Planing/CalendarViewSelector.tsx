// src/components/Planing/CalendarViewSelector.tsx
import React from 'react';
import { Calendar, Grid, List, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export type CalendarView = 'day' | 'week' | 'month' | 'agenda';

interface CalendarViewSelectorProps {
  view: CalendarView;
  onChange: (view: CalendarView) => void;
  className?: string;
}

export const CalendarViewSelector: React.FC<CalendarViewSelectorProps> = ({
  view,
  onChange,
  className = '',
}) => {
  const views = [
    { id: 'day' as const, label: 'Jour', icon: Calendar, color: 'text-blue-500' },
    { id: 'week' as const, label: 'Semaine', icon: Calendar, color: 'text-emerald-500' },
    { id: 'month' as const, label: 'Mois', icon: Grid, color: 'text-purple-500' },
    { id: 'agenda' as const, label: 'Agenda', icon: List, color: 'text-amber-500' },
  ] as const;

  return (
    <div className={`flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl ${className}`}>
      <div className="px-3 py-1.5">
        <Eye className="w-4 h-4 text-gray-500" />
      </div>
      
      {views.map((v) => {
        const Icon = v.icon;
        const isActive = view === v.id;
        
        return (
          <motion.button
            key={v.id}
            onClick={() => onChange(v.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
              ${isActive
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            <Icon className={`w-4 h-4 ${v.color}`} />
            <span className="text-sm font-medium">{v.label}</span>
            
            {isActive && (
              <motion.div
                className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-blue-500 rounded-full"
                layoutId="activeIndicator"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};