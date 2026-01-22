// src/types/api/symfony/entities.ts
export interface SymfonyApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
    meta?: {
        page: number;
        perPage: number;
        total: number;
        totalPages: number;
    };
}

// Types pour l'authentification
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    refreshToken?: string;
    user: ApiUser;
}

// Types des entités principales
export interface ApiUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    roles: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ApiRoom {
    id: number;
    name: string;
    description?: string;
    capacity: number;
    isActive: boolean;
    equipment?: string[];
    rules?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface ApiReservation {
    id: number;
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'rejected';
    room: ApiRoom | { id: number };
    user: ApiUser | { id: number };
    approvedBy?: ApiUser | { id: number };
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CalendarEvent {
    id: number;
    title: string;
    start: string;
    end: string;
    roomId: number;
    roomName: string;
    status: ApiReservation['status'];
    userId: number;
    userName: string;
}

// Types pour les filtres et paramètres
export interface ReservationFilters {
    roomId?: number;
    userId?: number;
    status?: ApiReservation['status'];
    startDate?: string;
    endDate?: string;
}

export interface PaginationParams {
    page?: number;
    perPage?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}