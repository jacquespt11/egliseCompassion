// src/components/Planing/WeekView.tsx
import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';

interface WeekViewProps {
  currentDate: Date;
  reservations: Array<{
    id: number;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    room: { id: number; name: string };
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
    user?: { fullName: string; department?: string };
  }>;
  onReservationClick?: (reservation: any) => void;
  onTimeSlotClick?: (date: Date, hour: number) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  reservations,
  onReservationClick,
  onTimeSlotClick,
}) => {
  // Configuration pour semaine commençant le lundi
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Heures de la journée (7h à 22h)
  const hours = Array.from({ length: 16 }, (_, i) => i + 7);

  // Convertir les dates de réservation en objets Date
  const parsedReservations = reservations.map(res => ({
    ...res,
    start: new Date(res.startTime),
    end: new Date(res.endTime),
  }));

  // Fonction pour obtenir les réservations pour un jour et une heure spécifiques
  const getReservationsForSlot = (day: Date, hour: number) => {
    const slotStart = new Date(day);
    slotStart.setHours(hour, 0, 0, 0);
    const slotEnd = new Date(day);
    slotEnd.setHours(hour + 1, 0, 0, 0);

    return parsedReservations.filter(res => 
      res.start < slotEnd && res.end > slotStart
    );
  };

  // Fonction pour calculer la position et la hauteur d'une réservation
  const getReservationStyle = (reservation: any, dayIndex: number) => {
    const day = days[dayIndex];
    const start = new Date(reservation.start);
    const end = new Date(reservation.end);
    
    // Si la réservation commence avant ce jour, on ajuste
    const displayStart = isSameDay(start, day) ? start : new Date(day.setHours(0, 0, 0, 0));
    const displayEnd = isSameDay(end, day) ? end : new Date(day.setHours(23, 59, 59, 999));
    
    const top = ((displayStart.getHours() - 7) * 60 + displayStart.getMinutes()) / 60 * 4; // 4rem par heure
    const height = ((displayEnd.getTime() - displayStart.getTime()) / (1000 * 60 * 60)) * 4;
    
    return { top: `${top}rem`, height: `${height}rem` };
  };

  // Couleurs selon le statut
  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300',
      APPROVED: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300',
      REJECTED: 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-300',
      CANCELLED: 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400',
    };
    return colors[status as keyof typeof colors] || colors.PENDING;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
      {/* En-tête avec les jours */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <div className="w-16 border-r border-gray-200 dark:border-gray-800 p-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">Heures</div>
        </div>
        {days.map((day, index) => {
          const isToday = isSameDay(day, new Date());
          const dayReservations = parsedReservations.filter(res => 
            isSameDay(res.start, day) || isSameDay(res.end, day)
          );
          
          return (
            <div
              key={day.toISOString()}
              className={`flex-1 border-r border-gray-200 dark:border-gray-800 last:border-r-0 p-2 ${
                isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {format(day, 'EEE', { locale: fr })}
                </div>
                <div className={`
                  text-lg font-bold mx-auto w-8 h-8 flex items-center justify-center rounded-full
                  ${isToday 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-800 dark:text-gray-200'
                  }
                `}>
                  {format(day, 'd')}
                </div>
                {dayReservations.length > 0 && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {dayReservations.length} réserv.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Corps avec les heures et les réservations */}
      <div className="flex flex-1 overflow-auto">
        {/* Colonne des heures */}
        <div className="w-16 border-r border-gray-200 dark:border-gray-800 flex-shrink-0">
          {hours.map(hour => (
            <div key={hour} className="h-16 border-b border-gray-200 dark:border-gray-800 p-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 -mt-2">
                {hour}:00
              </div>
            </div>
          ))}
        </div>

        {/* Colonnes des jours */}
        <div className="flex flex-1 relative">
          {days.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className="flex-1 border-r border-gray-200 dark:border-gray-800 last:border-r-0 relative"
            >
              {/* Créneaux horaires */}
              {hours.map(hour => (
                <motion.button
                  key={hour}
                  onClick={() => onTimeSlotClick?.(day, hour)}
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                  className="absolute w-full h-16 border-b border-gray-100 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700"
                  style={{ top: `${(hour - 7) * 4}rem` }}
                />
              ))}

              {/* Réservations */}
              {parsedReservations
                .filter(res => 
                  isSameDay(res.start, day) || isSameDay(res.end, day) ||
                  (res.start < day && res.end > addDays(day, 1))
                )
                .map(reservation => {
                  const style = getReservationStyle(reservation, dayIndex);
                  return (
                    <motion.div
                      key={reservation.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => onReservationClick?.(reservation)}
                      className={`
                        absolute left-1 right-1 rounded-lg border px-3 py-2 cursor-pointer
                        overflow-hidden shadow-sm hover:shadow-md transition-shadow
                        ${getStatusColor(reservation.status)}
                      `}
                      style={style}
                      whileHover={{ scale: 1.02, zIndex: 10 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate text-sm">
                            {reservation.title}
                          </div>
                          <div className="text-xs truncate opacity-75">
                            {reservation.room.name}
                          </div>
                          {reservation.user && (
                            <div className="text-xs truncate opacity-60 mt-1">
                              {reservation.user.fullName}
                            </div>
                          )}
                        </div>
                        <div className="text-xs opacity-60">
                          {format(new Date(reservation.startTime), 'HH:mm')}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>

      {/* Légende */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-3 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-500"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">En attente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-500"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Approuvé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Rejeté</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-400"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Annulé</span>
          </div>
        </div>
      </div>
    </div>
  );
};