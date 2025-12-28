// utils/bookingUtils.ts
import type { Reservation } from '../types/reservation';

// Règle des 24h - La réservation doit être faite au moins 24h à l'avance
export const validate24HourRule = (startDate: Date): { isValid: boolean; message: string } => {
  const now = new Date();
  const twentyFourHours = 24 * 60 * 60 * 1000;
  const timeDifference = startDate.getTime() - now.getTime();
  
  if (timeDifference < twentyFourHours) {
    return {
      isValid: false,
      message: `Les réservations doivent être faites au moins 24 heures à l'avance. Il reste ${Math.ceil((twentyFourHours - timeDifference) / (60 * 60 * 1000))} heures.`
    };
  }
  
  return { isValid: true, message: '' };
};

// Valider que la fin est après le début
export const validateTimeRange = (start: Date, end: Date): boolean => {
  return end > start;
};

// Valider la durée maximale (par exemple 8 heures)
export const validateMaxDuration = (start: Date, end: Date, maxHours = 8): boolean => {
  const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  return durationHours <= maxHours;
};

// Vérifier les conflits de réservation
export const checkForConflicts = (
  reservations: Reservation[],
  roomId: string,
  startDate: Date,
  endDate: Date,
  excludeReservationId?: string
): Reservation | null => {
  return reservations.find(reservation => {
    if (reservation.roomId !== roomId) return false;
    if (reservation.id === excludeReservationId) return false;
    if (reservation.status === 'REFUSEE' || reservation.status === 'ANNULEE') return false;
    
    const reservationStart = new Date(reservation.startDate);
    const reservationEnd = new Date(reservation.endDate);
    
    // Vérifier le chevauchement
    return (
      (startDate >= reservationStart && startDate < reservationEnd) ||
      (endDate > reservationStart && endDate <= reservationEnd) ||
      (startDate <= reservationStart && endDate >= reservationEnd)
    );
  }) || null;
};

// Formater la date pour l'affichage
export const formatReservationDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Calculer la durée en heures
export const calculateDuration = (start: Date, end: Date): number => {
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60) * 10) / 10;
};