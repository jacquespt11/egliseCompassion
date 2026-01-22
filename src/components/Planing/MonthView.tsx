// src/components/Planing/MonthView.tsx
import React from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addDays,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';

interface MonthViewProps {
  currentDate: Date;
  reservations: Array<{
    id: number;
    title: string;
    startTime: string;
    endTime: string;
    room: { name: string };
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
    user?: { fullName: string };
  }>;
  onDayClick?: (date: Date) => void;
  onReservationClick?: (reservation: any) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  reservations,
  onDayClick,
  onReservationClick,
}) => {
  // Obtenir le premier et dernier jour du mois
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // Ajouter les jours du début et fin pour compléter les semaines
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  // Tous les jours du calendrier
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  // Grouper en semaines
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // Jours de la semaine
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  // Convertir les réservations et les grouper par jour
  const reservationsByDay: Record<string, typeof reservations> = {};
  reservations.forEach(res => {
    const start = new Date(res.startTime);
    const end = new Date(res.endTime);
    
    // Pour les réservations sur plusieurs jours, on les ajoute à chaque jour
    let current = new Date(start);
    while (current <= end) {
      const dayKey = format(current, 'yyyy-MM-dd');
      if (!reservationsByDay[dayKey]) {
        reservationsByDay[dayKey] = [];
      }
      reservationsByDay[dayKey].push(res);
      current = addDays(current, 1);
    }
  });

  // Couleurs selon le statut
  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-amber-500',
      APPROVED: 'bg-emerald-500',
      REJECTED: 'bg-red-500',
      CANCELLED: 'bg-gray-400',
    };
    return colors[status as keyof typeof colors] || colors.PENDING;
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* En-tête avec le mois */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {format(currentDate, 'MMMM yyyy', { locale: fr })}
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {reservations.length} réservation{reservations.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800">
        {dayNames.map(day => (
          <div key={day} className="p-3 text-center">
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              {day}
            </div>
          </div>
        ))}
      </div>

      {/* Grille des jours */}
      <div className="flex-1 overflow-auto">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
            {week.map((day, dayIndex) => {
              const dayKey = format(day, 'yyyy-MM-dd');
              const dayReservations = reservationsByDay[dayKey] || [];
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());
              const isWeekend = dayIndex >= 5; // Samedi ou dimanche
              
              return (
                <motion.button
                  key={day.toISOString()}
                  onClick={() => onDayClick?.(day)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    min-h-32 p-3 border-r border-gray-100 dark:border-gray-800 
                    last:border-r-0 relative overflow-hidden
                    ${isCurrentMonth 
                      ? 'bg-white dark:bg-gray-900' 
                      : 'bg-gray-50 dark:bg-gray-800/50'
                    }
                    ${isWeekend && isCurrentMonth ? 'bg-gray-50/50 dark:bg-gray-800/30' : ''}
                    ${isToday ? 'ring-2 ring-blue-500 ring-inset' : ''}
                    hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                  `}
                >
                  {/* Numéro du jour */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`
                      text-lg font-semibold
                      ${isCurrentMonth 
                        ? isToday
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-800 dark:text-gray-200'
                        : 'text-gray-400 dark:text-gray-600'
                      }
                    `}>
                      {format(day, 'd')}
                    </span>
                    
                    {dayReservations.length > 0 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        {dayReservations.length}
                      </span>
                    )}
                  </div>

                  {/* Réservations du jour (limitée à 3) */}
                  <div className="space-y-1">
                    {dayReservations.slice(0, 3).map(reservation => (
                      <motion.div
                        key={reservation.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onReservationClick?.(reservation);
                        }}
                        className={`
                          text-left p-2 rounded text-xs cursor-pointer
                          ${reservation.status === 'APPROVED' 
                            ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : reservation.status === 'PENDING'
                            ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                          }
                          hover:shadow-sm transition-shadow
                        `}
                      >
                        <div className="flex items-start gap-1">
                          <div 
                            className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
                            style={{ backgroundColor: getStatusColor(reservation.status) }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{reservation.title}</div>
                            <div className="truncate opacity-75">{reservation.room.name}</div>
                            <div className="text-xs opacity-60 mt-1">
                              {format(new Date(reservation.startTime), 'HH:mm')}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {dayReservations.length > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-1">
                        +{dayReservations.length - 3} autre{dayReservations.length - 3 > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>

                  {/* Indicateur pour les jours avec beaucoup de réservations */}
                  {dayReservations.length >= 4 && (
                    <div className="absolute bottom-1 right-1">
                      <div className="flex gap-0.5">
                        {['PENDING', 'APPROVED', 'REJECTED'].map(status => {
                          const count = dayReservations.filter(r => r.status === status).length;
                          if (count === 0) return null;
                          return (
                            <div
                              key={status}
                              className="w-1 h-1 rounded-full"
                              style={{ backgroundColor: getStatusColor(status) }}
                              title={`${count} ${status.toLowerCase()}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Pied de page avec statistiques */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-3 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">{format(monthStart, 'd MMM', { locale: fr })}</span>
            {' - '}
            <span className="font-medium">{format(monthEnd, 'd MMM', { locale: fr })}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500"></div>
              <span className="text-gray-600 dark:text-gray-400">
                {reservations.filter(r => r.status === 'APPROVED').length} approuvé{reservations.filter(r => r.status === 'APPROVED').length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-amber-500"></div>
              <span className="text-gray-600 dark:text-gray-400">
                {reservations.filter(r => r.status === 'PENDING').length} en attente
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};