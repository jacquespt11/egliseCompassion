// src/services/api/rooms.service.ts
/**
 * Service de gestion des salles pour l'API Symfony
 * Gère la récupération, création, modification et disponibilité des salles
 * @version 1.0.0
 */

import { apiClient } from './client';
import {
  SymfonyApiResponse,
  SymfonyRoom
} from '../../types/api/symfony/user';

/**
 * Filtres pour la recherche de salles
 */
export interface RoomFilters {
  /** Statut de la salle (Available, Occupied, Maintenance) */
  status?: SymfonyRoom['status'];

  /** Capacité minimale requise */
  minCapacity?: number;

  /** Étage spécifique */
  floor?: number;

  /** Numéro de page pour la pagination */
  page?: number;

  /** Nombre d'éléments par page */
  perPage?: number;

  /** Recherche textuelle */
  search?: string;
}

/**
 * Disponibilité d'une salle pour une date spécifique
 */
export interface RoomAvailability {
  /** Date de la disponibilité */
  date: string;

  /** Informations sur la salle */
  room: {
    id: number;
    name: string;
    capacity: number;
    status: string;
  };

  /** Heures d'ouverture */
  openHours: {
    start: string;
    end: string;
  };

  /** Créneaux occupés */
  occupiedSlots: Array<{
    startTime: string;
    endTime: string;
    title: string;
    status: string;
  }>;
}

/**
 * Service de gestion des salles
 */
export const roomsService = {
  /**
   * Récupère la liste des salles avec filtres
   * @param filters - Filtres de recherche
   * @returns Liste paginée des salles
   */
  async getAll(
    filters: RoomFilters = {}
  ): Promise<SymfonyRoom[]> {
    const { page = 1, perPage = 20, ...queryParams } = filters;

    return await apiClient.get<SymfonyRoom[]>('/rooms', {
      params: {
        page,
        perPage,
        ...queryParams,
      },
    });
  },

  /**
   * Récupère les détails d'une salle spécifique
   * @param id - ID de la salle
   * @returns Détails de la salle
   */
  async getById(id: number): Promise<SymfonyRoom> {
    return await apiClient.get<SymfonyRoom>(`/rooms/${id}`);
  },

  /**
   * Crée une nouvelle salle (Admin only)
   * @param roomData - Données de la salle
   * @returns Salle créée
   */
  async create(roomData: Omit<SymfonyRoom, 'id' | 'createdAt' | 'updatedAt'>): Promise<SymfonyRoom> {
    return await apiClient.post<SymfonyRoom>('/rooms', roomData);
  },

  /**
   * Met à jour une salle existante (Admin only)
   * @param id - ID de la salle
   * @param updates - Données à mettre à jour
   * @returns Salle mise à jour
   */
  async update(
    id: number,
    updates: Partial<Omit<SymfonyRoom, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<SymfonyRoom> {
    return await apiClient.put<SymfonyRoom>(`/rooms/${id}`, updates);
  },

  /**
   * Supprime une salle (Admin only)
   * @param id - ID de la salle
   * @returns Succès de l'opération
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/rooms/${id}`);
  },

  /**
   * Récupère la disponibilité d'une salle pour une date spécifique
   * @param id - ID de la salle
   * @param date - Date au format YYYY-MM-DD
   * @returns Disponibilité de la salle
   */
  async getAvailability(id: number, date: string): Promise<RoomAvailability> {
    return await apiClient.get<RoomAvailability>(
      `/rooms/${id}/availability`,
      { params: { date } }
    );
  },

  /**
   * Récupère les salles disponibles pour une plage horaire
   * @param startTime - Date/heure de début (ISO 8601)
   * @param endTime - Date/heure de fin (ISO 8601)
   * @param capacity - Capacité minimale requise
   * @returns Salles disponibles
   */
  async getAvailableRooms(
    startTime: string,
    endTime: string,
    capacity?: number
  ): Promise<SymfonyApiResponse<SymfonyRoom[]>> {
    const params: Record<string, any> = { startTime, endTime };
    if (capacity) params.minCapacity = capacity;

    const response = await apiClient.get<SymfonyApiResponse<SymfonyRoom[]>>('/rooms/available', { params });
    return response.data;
  },

  /**
   * Recherche des salles par critères avancés
   * @param criteria - Critères de recherche
   * @returns Salles correspondantes
   */
  async search(criteria: {
    query?: string;
    equipment?: string[];
    minSurface?: number;
    maxSurface?: number;
    page?: number;
    perPage?: number;
  }): Promise<SymfonyRoom[]> {
    return await apiClient.get<SymfonyRoom[]>('/rooms/search', {
      params: criteria,
    });
  },

  /**
   * Met à jour le statut d'une salle (Admin only)
   * @param id - ID de la salle
   * @param status - Nouveau statut
   * @returns Salle mise à jour
   */
  async updateStatus(
    id: number,
    status: SymfonyRoom['status']
  ): Promise<SymfonyRoom> {
    return this.update(id, { status });
  },

  /**
   * Met à jour les équipements d'une salle (Admin only)
   * @param id - ID de la salle
   * @param equipment - Nouvelle liste d'équipements
   * @returns Salle mise à jour
   */
  async updateEquipment(
    id: number,
    equipment: string[]
  ): Promise<SymfonyRoom> {
    return this.update(id, { equipment });
  },
};

export default roomsService;