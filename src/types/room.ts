// types/room.ts
export interface Room {
  id: string;
  name: string;
  description: string;
  capacity: number;
  location: string;
  equipment: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  imageUrl?: string;
  departmentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoomFilters {
  capacity?: number;
  equipment?: string[];
  status?: Room['status'];
  departmentId?: string;
}

// types/reservation.ts (anticipation pour Sprint 3)
export interface Reservation {
  id: string;
  roomId: string;
  roomName: string;
  departmentId: string;
  departmentName: string;
  userId: string;
  userName: string;
  startDate: string;
  endDate: string;
  activity: string;
  participantsCount: number;
  status: 'EN_ATTENTE' | 'APPROUVEE' | 'REFUSEE' | 'ANNULEE';
  comments?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

// types/user.ts (extension de l'existant)
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'RESPONSABLE';
  departmentId?: string;
  departmentName?: string;
  phone?: string;
  isProfileComplete: boolean;
  createdAt: string;
}