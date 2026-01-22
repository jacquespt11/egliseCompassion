// src/services/transformers/symfony.transformer.ts
/**
 * Transformateurs pour convertir entre les entités Symfony API et les types frontend
 */

import { ApiUser, ApiRoom, ApiReservation } from '../../types/api/symfony/entities';
import { User, UserRole } from '../../types/user';
import { Room, RoomStatus, RoomType } from '../../types/room';
import { Reservation, ReservationStatus, CreateReservationDto } from '../../types/reservation';

/**
 * Convertit un utilisateur Symfony en utilisateur frontend
 */
export function transformApiUserToUser(apiUser: ApiUser): User {
    // Mapper les rôles Symfony aux rôles frontend
    const mapRole = (roles: string[]): UserRole => {
        if (roles.includes('ROLE_ADMIN')) return 'ADMIN';
        if (roles.includes('ROLE_RESPONSABLE') || roles.includes('ROLE_PASTOR')) return 'RESPONSABLE';
        return 'USER';
    };

    return {
        id: apiUser.id.toString(),
        email: apiUser.email,
        role: mapRole(apiUser.roles),
        firstName: apiUser.firstName,
        lastName: apiUser.lastName,
        phone: apiUser.phoneNumber,
        isActive: apiUser.isActive,
        status: apiUser.isActive ? 'active' : 'inactive',
        createdAt: apiUser.createdAt,
        updatedAt: apiUser.updatedAt,
        profileCompleted: true,
        approvalStatus: 'APPROVED',
    };
}

/**
 * Convertit une salle Symfony en salle frontend
 */
export function transformApiRoomToRoom(apiRoom: ApiRoom): Room {
    return {
        id: apiRoom.id.toString(),
        name: apiRoom.name,
        description: apiRoom.description || '',
        capacity: apiRoom.capacity,
        type: 'meeting' as RoomType, // Par défaut, peut être étendu selon l'API
        amenities: apiRoom.equipment || [],
        equipment: apiRoom.equipment || [],
        status: apiRoom.isActive ? 'ACTIVE' : 'INACTIVE' as RoomStatus,
        location: '', // À compléter selon l'API
        floor: 1, // À compléter selon l'API
        images: [],
        color: '#3b82f6', // Couleur par défaut
        createdAt: apiRoom.createdAt,
        updatedAt: apiRoom.updatedAt,
    };
}

/**
 * Convertit une réservation Symfony en réservation frontend
 */
export function transformApiReservationToReservation(apiReservation: ApiReservation): Reservation {
    // Mapper les statuts Symfony aux statuts frontend
    const mapStatus = (status: ApiReservation['status']): ReservationStatus => {
        switch (status) {
            case 'pending': return 'EN_ATTENTE';
            case 'confirmed': return 'APPROUVEE';
            case 'rejected': return 'REFUSEE';
            case 'cancelled': return 'ANNULEE';
            default: return 'EN_ATTENTE';
        }
    };

    // Extraire les informations de la salle et de l'utilisateur
    const room = typeof apiReservation.room === 'object' && 'name' in apiReservation.room
        ? apiReservation.room
        : { id: (apiReservation.room as any).id, name: 'Salle inconnue' };

    const user = typeof apiReservation.user === 'object' && 'email' in apiReservation.user
        ? apiReservation.user
        : { id: (apiReservation.user as any).id, email: 'Utilisateur inconnu', firstName: '', lastName: '' };

    // Extraire date et heures
    const startDate = new Date(apiReservation.startDate);
    const endDate = new Date(apiReservation.endDate);

    return {
        id: apiReservation.id.toString(),
        userId: typeof apiReservation.user === 'object' && 'id' in apiReservation.user
            ? apiReservation.user.id.toString()
            : (apiReservation.user as any).id.toString(),
        userName: `${user.firstName} ${user.lastName}`.trim() || user.email,
        userEmail: user.email,
        roomId: typeof apiReservation.room === 'object' && 'id' in apiReservation.room
            ? apiReservation.room.id.toString()
            : (apiReservation.room as any).id.toString(),
        roomName: room.name,
        date: startDate.toISOString().split('T')[0],
        startDate: apiReservation.startDate,
        endDate: apiReservation.endDate,
        startTime: startDate.toTimeString().slice(0, 5),
        endTime: endDate.toTimeString().slice(0, 5),
        title: apiReservation.title,
        description: apiReservation.description,
        status: mapStatus(apiReservation.status),
        rejectionReason: apiReservation.rejectionReason,
        createdAt: apiReservation.createdAt,
        updatedAt: apiReservation.updatedAt,
        departmentId: '', // À compléter selon l'API
    };
}

/**
 * Convertit un DTO de création de réservation frontend vers le format Symfony
 */
export function transformCreateReservationToApi(dto: CreateReservationDto): any {
    // Combiner date et heures pour créer des timestamps ISO
    const startDateTime = new Date(`${dto.date}T${dto.startTime}`);
    const endDateTime = new Date(`${dto.date}T${dto.endTime}`);

    return {
        title: dto.title,
        description: dto.description || '',
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        roomId: parseInt(dto.roomId),
        participants: dto.participants,
        equipmentRequested: dto.equipmentRequested || [],
    };
}

/**
 * Convertit un utilisateur frontend en format Symfony pour les mises à jour
 */
export function transformUserToApiUser(user: Partial<User>): Partial<ApiUser> {
    const apiUser: Partial<ApiUser> = {};

    if (user.email) apiUser.email = user.email;
    if (user.firstName) apiUser.firstName = user.firstName;
    if (user.lastName) apiUser.lastName = user.lastName;
    if (user.phone) apiUser.phoneNumber = user.phone;
    if (user.isActive !== undefined) apiUser.isActive = user.isActive;

    return apiUser;
}

/**
 * Convertit une salle frontend en format Symfony pour les mises à jour
 */
export function transformRoomToApiRoom(room: Partial<Room>): Partial<ApiRoom> {
    const apiRoom: Partial<ApiRoom> = {};

    if (room.name) apiRoom.name = room.name;
    if (room.description) apiRoom.description = room.description;
    if (room.capacity) apiRoom.capacity = room.capacity;
    if (room.equipment) apiRoom.equipment = room.equipment;
    if (room.status) apiRoom.isActive = room.status === 'ACTIVE';

    return apiRoom;
}
