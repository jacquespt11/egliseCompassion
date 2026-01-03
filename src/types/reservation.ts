export type ReservationStatus = 'EN_ATTENTE' | 'APPROUVEE' | 'REFUSEE' | 'ANNULEE';

export type Reservation = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  roomId: string;
  roomName: string;
  date: string;
  startTime: string;
  endTime: string;
  endDate?: string;
  title?: string;
  description?: string;
  participants?: number;
  equipmentRequested?: string[];
  comments?: string;
  status: ReservationStatus;
  reason?: string;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
  departmentName?: string;
  departmentId: string; 
  startDate?: string;
};

export interface TimeSlot {
  start: Date;
  end: Date;
  isAvailable: boolean;
}

export interface CreateReservationDto {
  roomId: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  participants: number;
  equipmentRequested?: string[];
  departmentId: string;
  
}

