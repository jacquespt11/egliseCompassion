// src/services/api/symfony-room.service.ts
/**
 * Service pour la gestion des salles via l'API Symfony
 */

import { apiClient } from './client';
import { ApiRoom } from '../../types/api/symfony/entities';
import { transformApiRoomToRoom, transformRoomToApiRoom } from '../transformers/symfony.transformer';
import { Room } from '../../types/room';

/**
 * Récupérer toutes les salles
 */
export async function getAllRooms(): Promise<Room[]> {
    const apiRooms = await apiClient.get<ApiRoom[]>('/rooms');
    return apiRooms.map(transformApiRoomToRoom);
}

/**
 * Récupérer une salle par son ID
 */
export async function getRoomById(id: number): Promise<Room> {
    const apiRoom = await apiClient.get<ApiRoom>(`/rooms/${id}`);
    return transformApiRoomToRoom(apiRoom);
}

/**
 * Créer une nouvelle salle
 */
export async function createRoom(room: Partial<Room>): Promise<Room> {
    const apiRoomData = transformRoomToApiRoom(room);
    const apiRoom = await apiClient.post<ApiRoom>('/rooms', apiRoomData);
    return transformApiRoomToRoom(apiRoom);
}

/**
 * Mettre à jour une salle
 */
export async function updateRoom(id: number, room: Partial<Room>): Promise<Room> {
    const apiRoomData = transformRoomToApiRoom(room);
    const apiRoom = await apiClient.patch<ApiRoom>(`/rooms/${id}`, apiRoomData);
    return transformApiRoomToRoom(apiRoom);
}

/**
 * Supprimer une salle
 */
export async function deleteRoom(id: number): Promise<void> {
    await apiClient.delete(`/rooms/${id}`);
}

/**
 * Récupérer les salles actives uniquement
 */
export async function getActiveRooms(): Promise<Room[]> {
    const allRooms = await getAllRooms();
    return allRooms.filter(room => room.status === 'ACTIVE');
}
