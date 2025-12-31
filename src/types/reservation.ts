export type ReservationStatus = 'EN_ATTENTE' | 'APPROUVEE' | 'REFUSEE' | 'ANNULEE'; // Adapter au français

export type Reservation = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  department: string;
  roomId: string;
  roomName: string;
  date: string;
  startTime: string;
  endTime: string;
  title?: string; // Ajouter
  description?: string; // Ajouter
  participants?: number; // Ajouter
  equipmentRequested?: string[]; // Ajouter
  comments?: string; // Ajouter
  status: ReservationStatus;
  reason?: string;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
  departmentName?: string; // Ajouter
  startDate?: string; // Ajouter si besoin
  endDate?: string; // Ajouter si besoin
};

export interface TimeSlot {
  start: Date;
  end: Date;
  isAvailable: boolean;
}

export type CreateReservationDto = {
  roomId: string;
  title: string;
  description?: string;
  date: string; // Format: YYYY-MM-DD
  startTime: string; // Format: HH:MM
  endTime: string; // Format: HH:MM
  participants: number;
  equipmentRequested?: string[];
  departmentId?: string;
  department?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  roomName?: string;
  comments?: string;
};
