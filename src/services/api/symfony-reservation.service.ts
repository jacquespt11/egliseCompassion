// src/services/api/symfony-reservation.service.ts
/**
 * Service pour la gestion des réservations via l'API Symfony
 */

import { apiClient } from './client';
import { ApiReservation, CalendarEvent, ReservationFilters, PaginationParams } from '../../types/api/symfony/entities';
import { transformApiReservationToReservation, transformCreateReservationToApi } from '../transformers/symfony.transformer';
import { Reservation, CreateReservationDto } from '../../types/reservation';

/**
 * Récupérer toutes les réservations avec filtres optionnels
 */
export async function getAllReservations(filters?: ReservationFilters, pagination?: PaginationParams): Promise<Reservation[]> {
    const params = { ...filters, ...pagination };
    const apiReservations = await apiClient.get<ApiReservation[]>('/reservations', { params });
    return apiReservations.map(transformApiReservationToReservation);
}

/**
 * Récupérer une réservation par son ID
 */
export async function getReservationById(id: number): Promise<Reservation> {
    const apiReservation = await apiClient.get<ApiReservation>(`/reservations/${id}`);
    return transformApiReservationToReservation(apiReservation);
}

/**
 * Créer une nouvelle réservation
 */
export async function createReservation(reservation: CreateReservationDto): Promise<Reservation> {
    const apiReservationData = transformCreateReservationToApi(reservation);
    const apiReservation = await apiClient.post<ApiReservation>('/reservations', apiReservationData);
    return transformApiReservationToReservation(apiReservation);
}

/**
 * Mettre à jour le statut d'une réservation
 */
export async function updateReservationStatus(
    id: number,
    status: 'confirmed' | 'rejected' | 'cancelled',
    rejectionReason?: string
): Promise<Reservation> {
    const apiReservation = await apiClient.patch<ApiReservation>(`/reservations/${id}/status`, {
        status,
        rejectionReason,
    });
    return transformApiReservationToReservation(apiReservation);
}

/**
 * Supprimer une réservation
 */
export async function deleteReservation(id: number): Promise<void> {
    await apiClient.delete(`/reservations/${id}`);
}

/**
 * Récupérer les événements du calendrier
 */
export async function getCalendarEvents(startDate?: string, endDate?: string): Promise<CalendarEvent[]> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return await apiClient.get<CalendarEvent[]>('/reservations/calendar', { params });
}

/**
 * Récupérer les réservations d'un utilisateur
 */
export async function getUserReservations(userId: number): Promise<Reservation[]> {
    return await getAllReservations({ userId });
}

/**
 * Récupérer les réservations d'une salle
 */
export async function getRoomReservations(roomId: number): Promise<Reservation[]> {
    return await getAllReservations({ roomId });
}

/**
 * Récupérer les réservations en attente
 */
export async function getPendingReservations(): Promise<Reservation[]> {
    return await getAllReservations({ status: 'pending' });
}
