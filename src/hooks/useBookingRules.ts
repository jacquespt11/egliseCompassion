import { useState } from 'react';
import type { Reservation } from '../types/reservation';

export function useBookingRules() {
  const [validation, setValidation] = useState<{
    isValid: boolean;
    message: string;
  }>({ isValid: true, message: '' });

  const validateReservation = (reservation: Partial<Reservation>) => {
    const errors: string[] = [];

    // Vérifier les champs obligatoires
    if (!reservation.roomId) {
      errors.push('La salle est requise');
    }
    if (!reservation.title) {
      errors.push('Le titre est requis');
    }
    if (!reservation.startDate || !reservation.endDate) {
      errors.push('Les dates de début et fin sont requises');
    }

    // Vérifier la durée (minimum 1 heure)
    if (reservation.startDate && reservation.endDate) {
      const duration = reservation.endDate.getTime() - reservation.startDate.getTime();
      const minDuration = 60 * 60 * 1000; // 1 heure en millisecondes
      
      if (duration < minDuration) {
        errors.push('La réservation doit durer au moins 1 heure');
      }
    }

    // Vérifier si la date de début est dans le futur
    if (reservation.startDate && reservation.startDate <= new Date()) {
      errors.push('La réservation doit commencer dans le futur');
    }

    // Vérifier le nombre de participants
    if (reservation.participants && reservation.participants < 1) {
      errors.push('Le nombre de participants doit être au moins 1');
    }

    // Vérifier les réservations d'urgence
    if (reservation.title && reservation.title.toLowerCase().includes('urgence')) {
      // Vérifications supplémentaires pour les urgences
      const now = new Date();
      const startDate = reservation.startDate || now;
      const timeUntilStart = startDate.getTime() - now.getTime();
      const maxUrgencyTime = 2 * 60 * 60 * 1000; // 2 heures
      
      if (timeUntilStart > maxUrgencyTime) {
        errors.push('Les réservations d\'urgence doivent être dans les 2 prochaines heures');
      }
    }

    const isValid = errors.length === 0;
    const message = isValid ? '' : errors.join(', ');

    setValidation({ isValid, message });

    return { isValid, message };
  };

  const checkRoomAvailability = (
    roomId: string,
    startDate: Date,
    endDate: Date,
    existingReservations: Reservation[]
  ) => {
    const conflictingReservation = existingReservations.find(reservation => {
      if (reservation.roomId !== roomId) return false;
      if (reservation.status === 'ANNULEE' || reservation.status === 'REFUSEE') return false;

      const reservationStart = new Date(reservation.startDate);
      const reservationEnd = new Date(reservation.endDate);

      // Vérifier le chevauchement
      return (
        (startDate >= reservationStart && startDate < reservationEnd) ||
        (endDate > reservationStart && endDate <= reservationEnd) ||
        (startDate <= reservationStart && endDate >= reservationEnd)
      );
    });

    return {
      isAvailable: !conflictingReservation,
      conflict: conflictingReservation
        ? {
            message: `Salle déjà réservée du ${new Date(conflictingReservation.startDate).toLocaleDateString()} ${new Date(conflictingReservation.startDate).toLocaleTimeString()} au ${new Date(conflictingReservation.endDate).toLocaleDateString()} ${new Date(conflictingReservation.endDate).toLocaleTimeString()}`,
            reservation: conflictingReservation,
          }
        : null,
    };
  };

  const getAvailableTimeSlots = (
    roomId: string,
    date: Date,
    existingReservations: Reservation[],
    intervalMinutes: number = 30,
    workHours: { start: number; end: number } = { start: 8, end: 20 }
  ) => {
    const slots: Array<{
      start: Date;
      end: Date;
      isAvailable: boolean;
    }> = [];

    const dayStart = new Date(date);
    dayStart.setHours(workHours.start, 0, 0, 0);
    
    const dayEnd = new Date(date);
    dayEnd.setHours(workHours.end, 0, 0, 0);

    const roomReservations = existingReservations.filter(
      reservation => reservation.roomId === roomId && 
      new Date(reservation.startDate).toDateString() === date.toDateString() &&
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

      slots.push({
        start: new Date(currentTime),
        end: new Date(slotEnd),
        isAvailable,
      });

      currentTime = slotEnd;
    }

    return slots;
  };

  return {
    validation,
    validateReservation,
    checkRoomAvailability,
    getAvailableTimeSlots,
  };
}