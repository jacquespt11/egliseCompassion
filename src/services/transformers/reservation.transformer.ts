// src/services/transformers/reservation.transformer.ts
/**
 * Transformateur pour les données de réservations
 * Convertit entre les types frontend et Symfony
 * @version 1.0.0
 */

import { 
  Reservation as FrontendReservation, 
  ReservationStatus 
} from '../../types/reservation';
import {
  SymfonyReservation,
  SymfonyReservationStatus,
  SymfonyRecurrencePattern,
} from '../../types/api/symfony/user';

/**
 * Mapping des statuts Symfony -> Frontend
 */
const statusMapToFrontend: Record<SymfonyReservationStatus, ReservationStatus> = {
  [SymfonyReservationStatus.PENDING]: 'EN_ATTENTE',
  [SymfonyReservationStatus.APPROVED]: 'APPROUVEE',
  [SymfonyReservationStatus.REJECTED]: 'REFUSEE',
  [SymfonyReservationStatus.CANCELLED]: 'ANNULEE',
  [SymfonyReservationStatus.COMPLETED]: 'APPROUVEE',
};

/**
 * Mapping inverse des statuts
 */
const statusMapToSymfony: Record<ReservationStatus, SymfonyReservationStatus> = {
  EN_ATTENTE: SymfonyReservationStatus.PENDING,
  APPROUVEE: SymfonyReservationStatus.APPROVED,
  REFUSEE: SymfonyReservationStatus.REJECTED,
  ANNULEE: SymfonyReservationStatus.CANCELLED,
};

/**
 * Transforme une réservation Symfony en réservation frontend
 */
export const transformSymfonyReservationToFrontend = (
  symfonyReservation: SymfonyReservation
): FrontendReservation => {
  const startDate = new Date(symfonyReservation.startTime);
  const endDate = new Date(symfonyReservation.endTime);

  return {
    // Champs obligatoires
    id: symfonyReservation.id.toString(),
    userId: symfonyReservation.user.id.toString(),
    userName: symfonyReservation.user.fullName,
    roomId: symfonyReservation.room.id.toString(),
    roomName: symfonyReservation.room.name,
    date: startDate.toISOString().split('T')[0], // YYYY-MM-DD
    startTime: startDate.toTimeString().slice(0, 5), // HH:MM
    endTime: endDate.toTimeString().slice(0, 5),
    status: statusMapToFrontend[symfonyReservation.status] || 'EN_ATTENTE',
    createdAt: symfonyReservation.createdAt,
    updatedAt: symfonyReservation.updatedAt || symfonyReservation.createdAt,

    // Champs optionnels
    title: symfonyReservation.title,
    description: symfonyReservation.description,
    participants: symfonyReservation.attendees,
    equipmentRequested: [],
    comments: symfonyReservation.rejectionReason,
    reason: symfonyReservation.rejectionReason,
    rejectionReason: symfonyReservation.rejectionReason,
    departmentName: symfonyReservation.user.department,
    departmentId: '',
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString().split('T')[0],
    userEmail: '', // Non fourni par l'API
  };
};

/**
 * Transforme une réservation frontend en données de création Symfony
 */
export const transformFrontendReservationToSymfony = (
  reservation: Partial<FrontendReservation>
): {
  roomId: number;
  title: string;
  description?: string;
  attendees: number;
  startTime: string;
  endTime: string;
  isRecurrent?: boolean;
  recurrence?: SymfonyRecurrencePattern;
} => {
  // Construction des dates ISO
  const startDate = new Date(`${reservation.date}T${reservation.startTime}`);
  const endDate = new Date(`${reservation.date}T${reservation.endTime}`);

  // Gestion du cas où endTime < startTime (réservation sur minuit)
  if (endDate < startDate) {
    endDate.setDate(endDate.getDate() + 1);
  }

  return {
    roomId: parseInt(reservation.roomId || '0', 10),
    title: reservation.title || 'Réservation sans titre',
    description: reservation.description,
    attendees: reservation.participants || 1,
    startTime: startDate.toISOString(),
    endTime: endDate.toISOString(),
    isRecurrent: false, // À implémenter quand vous aurez le formulaire de récurrence
  };
};

/**
 * Transforme les données pour l'approbation/rejet
 */
export const transformReservationStatusUpdate = (
  status: 'APPROUVEE' | 'REFUSEE',
  reason?: string
): { status: 'Approved' | 'Rejected'; rejectionReason?: string } => {
  return {
    status: status === 'APPROUVEE' ? 'Approved' : 'Rejected',
    rejectionReason: reason,
  };
};