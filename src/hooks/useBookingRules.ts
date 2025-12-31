import { useState } from 'react';
import type { Reservation, ReservationStatus } from '../types/reservation';

export function useBookingRules() {
  const [validation, setValidation] = useState<{
    isValid: boolean;
    message: string;
  }>({ isValid: true, message: '' });

  // Helper pour créer un objet Date à partir de date + time
  const createDateTime = (date: string, time: string): Date => {
    return new Date(`${date}T${time}`);
  };

  const validateReservation = (reservation: Partial<Reservation>) => {
    const errors: string[] = [];

    // Vérifier les champs obligatoires
    if (!reservation.roomId) {
      errors.push('La salle est requise');
    }
    if (!reservation.title) {
      errors.push('Le titre est requis');
    }
    if (!reservation.date || !reservation.startTime || !reservation.endTime) {
      errors.push('Les dates et heures sont requises');
    }

    // Vérifier la durée (minimum 1 heure)
    if (reservation.date && reservation.startTime && reservation.endTime) {
      const startDateTime = createDateTime(reservation.date, reservation.startTime);
      const endDateTime = createDateTime(reservation.date, reservation.endTime);
      const duration = endDateTime.getTime() - startDateTime.getTime();
      const minDuration = 60 * 60 * 1000; // 1 heure en millisecondes
      
      if (duration < minDuration) {
        errors.push('La réservation doit durer au moins 1 heure');
      }

      // Vérifier si la date de début est dans le futur
      if (startDateTime <= new Date()) {
        errors.push('La réservation doit commencer dans le futur');
      }

      // Vérifier que l'heure de fin est après l'heure de début
      if (startDateTime >= endDateTime) {
        errors.push('L\'heure de fin doit être après l\'heure de début');
      }
    }

    // Vérifier le nombre de participants
    if (reservation.participants && reservation.participants < 1) {
      errors.push('Le nombre de participants doit être au moins 1');
    }

    // Vérifier les réservations d'urgence
    if (reservation.title && reservation.title.toLowerCase().includes('urgence')) {
      // Vérifications supplémentaires pour les urgences
      const now = new Date();
      const startDate = reservation.date && reservation.startTime 
        ? createDateTime(reservation.date, reservation.startTime)
        : now;
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
      
      // Vérifier si le statut n'est pas annulé ou refusé
      const status = reservation.status as ReservationStatus;
      if (status === 'ANNULEE' || status === 'REFUSEE') return false;

      // Créer les dates de la réservation existante
      const reservationStart = reservation.date && reservation.startTime 
        ? createDateTime(reservation.date, reservation.startTime)
        : new Date();
      const reservationEnd = reservation.date && reservation.endTime
        ? createDateTime(reservation.date, reservation.endTime)
        : new Date();

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
            message: `Salle déjà réservée le ${conflictingReservation.date} de ${conflictingReservation.startTime} à ${conflictingReservation.endTime}`,
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

    const roomReservations = existingReservations.filter(reservation => {
      if (reservation.roomId !== roomId) return false;
      
      // Vérifier la date
      const reservationDate = reservation.date ? new Date(reservation.date) : null;
      if (!reservationDate) return false;
      
      // Vérifier que c'est le même jour
      if (reservationDate.toDateString() !== date.toDateString()) return false;
      
      // Filtrer les réservations annulées ou refusées
      const status = reservation.status as ReservationStatus;
      return status !== 'ANNULEE' && status !== 'REFUSEE';
    });

    let currentTime = new Date(dayStart);
    
    while (currentTime < dayEnd) {
      const slotEnd = new Date(currentTime);
      slotEnd.setMinutes(slotEnd.getMinutes() + intervalMinutes);

      // Vérifier si ce créneau est disponible
      const isAvailable = !roomReservations.some(reservation => {
        const reservationStart = reservation.date && reservation.startTime
          ? createDateTime(reservation.date, reservation.startTime)
          : new Date();
        const reservationEnd = reservation.date && reservation.endTime
          ? createDateTime(reservation.date, reservation.endTime)
          : new Date();

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