export type ReservationStatus = 'EN_ATTENTE' | 'APPROUVEE' | 'REFUSEE' | 'ANNULEE';

export interface TimeSlot {
  start: Date;
  end: Date;
  isAvailable: boolean;
}

export interface CreateReservationDto {
  roomId: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  participants?: number;
  equipmentRequested?: string[];
  departmentId: string;
}

export interface Reservation {
  id: string;
  roomId: string;
  userId: string;
  departmentId: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: ReservationStatus;
  participants?: number;
  equipmentRequested?: string[];
  createdAt: Date;
  updatedAt: Date;
  
  // Propriétés étendues pour l'affichage (optionnelles)
  roomName?: string;
  activity?: string;
  rejectionReason?: string;
  participantsCount?: number;
  departmentName?: string;
  userName?: string;
  comments?: string;
  approvedAt?: Date;
  approvedBy?: string;
}