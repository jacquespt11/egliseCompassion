import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Check, X } from 'lucide-react';
import type { TimeSlot } from '../../types/reservation';

interface TimeSlotPickerProps {
  selectedDate: Date;
  roomId: string;
  onTimeSelect: (start: Date, end: Date) => void;
  existingReservations: any[];
  workHours?: { start: number; end: number };
  intervalMinutes?: number;
}

export function TimeSlotPicker({
  selectedDate,
  roomId,
  onTimeSelect,
  existingReservations,
  workHours = { start: 8, end: 20 },
  intervalMinutes = 30
}: TimeSlotPickerProps) {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    generateTimeSlots();
  }, [selectedDate, roomId, existingReservations]);

  const generateTimeSlots = () => {
    const slots: TimeSlot[] = [];
    const dayStart = new Date(selectedDate);
    dayStart.setHours(workHours.start, 0, 0, 0);
    
    const dayEnd = new Date(selectedDate);
    dayEnd.setHours(workHours.end, 0, 0, 0);

    const roomReservations = existingReservations.filter(
      reservation => reservation.roomId === roomId && 
      new Date(reservation.startDate).toDateString() === selectedDate.toDateString() &&
      reservation.status !== 'ANNULEE' && reservation.status !== 'REFUSEE'
    );

    let currentTime = new Date(dayStart);
    
    while (currentTime < dayEnd) {
      const slotEnd = new Date(currentTime);
      slotEnd.setMinutes(slotEnd.getMinutes() + intervalMinutes);

      // Vérifier si ce créneau est disponible
      const isAvailable = !roomReservations.some(reservation => {
        const reservationStart = new Date(reservation.startDate);
        const reservationEnd = new Date(reservation.endDate);

        return (
          (currentTime >= reservationStart && currentTime < reservationEnd) ||
          (slotEnd > reservationStart && slotEnd <= reservationEnd) ||
          (currentTime <= reservationStart && slotEnd >= reservationEnd)
        );
      });

      // Trouver la réservation conflictuelle pour l'affichage
      const conflictingReservation = roomReservations.find(reservation => {
        const reservationStart = new Date(reservation.startDate);
        const reservationEnd = new Date(reservation.endDate);

        return (
          (currentTime >= reservationStart && currentTime < reservationEnd) ||
          (slotEnd > reservationStart && slotEnd <= reservationEnd) ||
          (currentTime <= reservationStart && slotEnd >= reservationEnd)
        );
      });

      slots.push({
        start: new Date(currentTime),
        end: new Date(slotEnd),
        isAvailable,
      });

      currentTime = slotEnd;
    }

    setTimeSlots(slots);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSlotClick = (slot: TimeSlot) => {
    if (!slot.isAvailable) return;
    
    setSelectedSlot(slot);
    onTimeSelect(slot.start, slot.end);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Sélectionnez un créneau horaire</h3>
            <p className="text-sm text-white/60">
              {selectedDate.toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-white/70">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-white/70">Occupé</span>
          </div>
        </div>
      </div>

      {/* Grille des créneaux */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {timeSlots.map((slot, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleSlotClick(slot)}
            disabled={!slot.isAvailable}
            className={`p-4 rounded-xl border transition-all ${
              selectedSlot?.start.getTime() === slot.start.getTime()
                ? 'border-blue-500 bg-blue-500/10'
                : slot.isAvailable
                ? 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                : 'border-rose-500/20 bg-rose-500/10 cursor-not-allowed opacity-50'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                {slot.isAvailable ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <X className="w-4 h-4 text-rose-400" />
                )}
                <span className={`font-medium ${
                  slot.isAvailable ? 'text-white' : 'text-white/50'
                }`}>
                  {formatTime(slot.start)} - {formatTime(slot.end)}
                </span>
              </div>
              <span className={`text-xs ${
                slot.isAvailable ? 'text-white/60' : 'text-rose-400/70'
              }`}>
                {slot.isAvailable ? 'Disponible' : 'Occupé'}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Aucun créneau disponible */}
      {timeSlots.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/60">Aucun créneau horaire disponible pour cette date</p>
        </div>
      )}

      {/* Sélection actuelle */}
      {selectedSlot && (
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white">Créneau sélectionné</h4>
              <p className="text-white/70">
                {formatTime(selectedSlot.start)} - {formatTime(selectedSlot.end)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/60">Durée</p>
              <p className="font-semibold text-white">
                {Math.round((selectedSlot.end.getTime() - selectedSlot.start.getTime()) / (1000 * 60 * 60) * 10) / 10}h
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}