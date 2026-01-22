// src/types/api/symfony/user.ts
/**
 * Types correspondant exactement aux entités Symfony
 * Basés sur la documentation OpenAPI fournie
 * @namespace SymfonyAPI
 */

// ==================== ENUMS ====================
export const SymfonyUserRole = {
  MEMBER: 'Member',
  RESPONSIBLE: 'Responsible',
  PASTOR: 'Pastor',
  ADMIN: 'Admin'
} as const;

export type SymfonyUserRole = typeof SymfonyUserRole[keyof typeof SymfonyUserRole];

export const SymfonyReservationStatus = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed'
} as const;

export type SymfonyReservationStatus = typeof SymfonyReservationStatus[keyof typeof SymfonyReservationStatus];

export const SymfonyRoomStatus = {
  AVAILABLE: 'Available',
  OCCUPIED: 'Occupied',
  MAINTENANCE: 'Maintenance'
} as const;

export type SymfonyRoomStatus = typeof SymfonyRoomStatus[keyof typeof SymfonyRoomStatus];

// ==================== TYPES PRINCIPAUX ====================
export interface SymfonyUser {
  /** Identifiant unique de l'utilisateur */
  id: number;

  /** Email de l'utilisateur (format standard) */
  email: string;

  /** Nom complet de l'utilisateur */
  fullName: string;

  /** Numéro de téléphone au format international */
  phoneNumber?: string;

  /** URL de l'avatar de l'utilisateur */
  avatarUrl?: string;

  /** Département de l'utilisateur */
  department?: string;

  /** Rôle utilisateur selon SymfonyUserRole */
  role: SymfonyUserRole;

  /** Indique si le compte est actif */
  isActive: boolean;

  /** Date de création (ISO 8601) */
  createdAt: string;

  /** Date de dernière connexion (ISO 8601) */
  lastLogin?: string;

  /** Date de dernière mise à jour (ISO 8601) */
  updatedAt?: string;
}

export interface SymfonyRoom {
  /** Identifiant unique de la salle */
  id: number;

  /** Nom de la salle */
  name: string;

  /** Description détaillée de la salle */
  description: string;

  /** Capacité maximale en personnes */
  capacity: number;

  /** URL de l'image de la salle */
  imageUrl?: string;

  /** Statut actuel de la salle */
  status: SymfonyRoomStatus;

  /** Liste des équipements disponibles */
  equipment: string[];

  /** Étage où se trouve la salle */
  floor: number;

  /** Surface en m² */
  surface?: number;

  /** Règles de disponibilité */
  availabilityRules: {
    /** Jours ouverts (0=Dimanche, 6=Samedi) */
    openDays: number[];

    /** Heures d'ouverture */
    openHours: {
      start: string;  // Format HH:mm
      end: string;    // Format HH:mm
    };

    /** Durée minimale de réservation (minutes) */
    minBookingDuration: number;

    /** Durée maximale de réservation (minutes) */
    maxBookingDuration: number;
  };

  /** Date de création (ISO 8601) */
  createdAt: string;

  /** Date de dernière mise à jour (ISO 8601) */
  updatedAt: string;
}

export interface SymfonyReservation {
  /** Identifiant unique de la réservation */
  id: number;

  /** Informations sur la salle */
  room: {
    id: number;
    name: string;
    capacity: number;
    status: string;
  };

  /** Informations sur l'utilisateur */
  user: {
    id: number;
    fullName: string;
    department?: string;
  };

  /** Titre de la réservation */
  title: string;

  /** Description détaillée */
  description?: string;

  /** Nombre de participants */
  attendees: number;

  /** Date et heure de début (ISO 8601) */
  startTime: string;

  /** Date et heure de fin (ISO 8601) */
  endTime: string;

  /** Statut de la réservation */
  status: SymfonyReservationStatus;

  /** Raison du rejet (si applicable) */
  rejectionReason?: string;

  /** Informations sur l'approbateur */
  approvedBy?: {
    id: number;
    fullName: string;
  };

  /** Date d'approbation (ISO 8601) */
  approvedAt?: string;

  /** Indique si c'est une réservation récurrente */
  isRecurrent: boolean;

  /** ID du groupe de récurrence */
  recurrenceGroupId?: string;

  /** Date de création (ISO 8601) */
  createdAt: string;

  /** Date de dernière mise à jour (ISO 8601) */
  updatedAt: string;
}

export interface SymfonyRecurrencePattern {
  /** Fréquence de récurrence */
  frequency: 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';

  /** Intervalle entre les occurrences */
  interval?: number;

  /** Jours de la semaine (0-6) pour les récurrences hebdomadaires */
  daysOfWeek?: number[];

  /** Type de fin de récurrence */
  endType: 'date' | 'count' | 'occurrences';

  /** Date de fin (format YYYY-MM-DD) */
  endDate?: string;

  /** Nombre d'occurrences */
  occurrencesCount?: number;
}

// ==================== TYPES DE RÉPONSE API ====================
export interface SymfonyApiResponse<T> {
  /** Indique si la requête a réussi */
  success: boolean;

  /** Données de la réponse */
  data?: T;

  /** Message informatif */
  message?: string;

  /** Informations d'erreur */
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };

  /** Métadonnées pour la pagination */
  meta?: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface SymfonyAuthResponse {
  /** Données d'authentification */
  data: {
    user: SymfonyUser;
    token: string;
    refreshToken: string;
    expiresIn: number;
  };
}

// ==================== TYPES DE REQUÊTE ====================
export interface SymfonyLoginRequest {
  /** Email ou numéro de téléphone */
  identifier: string;

  /** Mot de passe */
  password: string;
}

export interface SymfonyCreateReservationRequest {
  /** ID de la salle */
  roomId: number;

  /** Titre de la réservation */
  title: string;

  /** Description optionnelle */
  description?: string;

  /** Nombre de participants */
  attendees: number;

  /** Date et heure de début (ISO 8601) */
  startTime: string;

  /** Date et heure de fin (ISO 8601) */
  endTime: string;

  /** Indique si c'est une réservation récurrente */
  isRecurrent?: boolean;

  /** Configuration de récurrence */
  recurrence?: SymfonyRecurrencePattern;
}

// ==================== TYPES DE TRANSFORMATION ====================
export type TransformFunction<TFrom, TTo> = (from: TFrom) => TTo;