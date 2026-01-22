// src/services/transformers/room.transformer.ts
/**
 * Transformateur pour les données de salles
 * Convertit entre les types frontend et Symfony
 * @version 1.0.0
 */

import { Room as FrontendRoom, RoomType, RoomStatus } from '../../types/room';
import {
  SymfonyRoom,
  SymfonyRoomStatus
} from '../../types/api/symfony/user';

/**
 * Détermine le type de salle frontend basé sur la capacité
 */
const getRoomTypeFromCapacity = (capacity: number): RoomType => {
  if (capacity >= 100) return 'auditorium';
  if (capacity >= 50) return 'meeting';
  if (capacity >= 20) return 'classroom';
  return 'office';
};

/**
 * Détermine la couleur associée au type de salle
 */
const getColorFromRoomType = (type: RoomType): string => {
  const colorMap: Record<RoomType, string> = {
    meeting: '#3B82F6',     // Bleu
    auditorium: '#8B5CF6',  // Violet
    classroom: '#10B981',   // Vert émeraude
    office: '#6B7280',      // Gris
  };
  return colorMap[type] || '#3B82F6';
};

/**
 * Transforme un statut Symfony en statut frontend
 */
const transformRoomStatus = (status: SymfonyRoomStatus): RoomStatus => {
  const statusMap: Record<string, RoomStatus> = {
    'Available': 'ACTIVE',
    'Occupied': 'ACTIVE',
    'Maintenance': 'MAINTENANCE',
  };
  return statusMap[status] || 'ACTIVE';
};

/**
 * Transforme une salle Symfony en salle frontend
 */
export const transformSymfonyRoomToFrontend = (symfonyRoom: SymfonyRoom): FrontendRoom => {
  const roomType = getRoomTypeFromCapacity(symfonyRoom.capacity);

  return {
    id: symfonyRoom.id.toString(),
    name: symfonyRoom.name,
    description: symfonyRoom.description,
    capacity: symfonyRoom.capacity,
    type: roomType,
    amenities: symfonyRoom.equipment || [],
    equipment: symfonyRoom.equipment,
    status: transformRoomStatus(symfonyRoom.status),
    location: `Étage ${symfonyRoom.floor}`,
    floor: symfonyRoom.floor,
    images: symfonyRoom.imageUrl ? [symfonyRoom.imageUrl] : [],
    imageUrl: symfonyRoom.imageUrl,
    color: getColorFromRoomType(roomType),
    createdAt: symfonyRoom.createdAt,
    updatedAt: symfonyRoom.updatedAt || symfonyRoom.createdAt,
    // Champs optionnels
    departmentId: '',
  };
};

/**
 * Transforme une salle frontend en salle Symfony
 */
export const transformFrontendRoomToSymfony = (
  frontendRoom: Partial<FrontendRoom>
): Partial<SymfonyRoom> => {
  const result: Partial<SymfonyRoom> = {};

  // Mapping des champs simples
  if (frontendRoom.name !== undefined) result.name = frontendRoom.name;
  if (frontendRoom.description !== undefined) result.description = frontendRoom.description;
  if (frontendRoom.capacity !== undefined) result.capacity = frontendRoom.capacity;
  if (frontendRoom.imageUrl !== undefined) result.imageUrl = frontendRoom.imageUrl;
  if (frontendRoom.floor !== undefined) result.floor = frontendRoom.floor;
  if (frontendRoom.equipment !== undefined) result.equipment = frontendRoom.equipment;

  // Mapping du statut
  if (frontendRoom.status !== undefined) {
    const statusMap: Record<RoomStatus, string> = {
      'ACTIVE': 'Available',
      'MAINTENANCE': 'Maintenance',
      'INACTIVE': 'Maintenance',
    };
    result.status = statusMap[frontendRoom.status] as SymfonyRoomStatus || 'Available' as SymfonyRoomStatus;
  }

  // Règles de disponibilité par défaut pour les nouvelles salles
  if (!frontendRoom.id && !result.availabilityRules) {
    result.availabilityRules = {
      openDays: [1, 2, 3, 4, 5, 6], // Lundi à Samedi
      openHours: {
        start: '07:00',
        end: '22:00',
      },
      minBookingDuration: 30, // 30 minutes minimum
      maxBookingDuration: 480, // 8 heures maximum
    };
  }

  return result;
};