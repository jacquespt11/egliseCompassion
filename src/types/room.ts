export type RoomStatus = 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE'; // Adapter

export type RoomType = 'meeting' | 'auditorium' | 'classroom' | 'office';

export type Room = {
  id: string;
  name: string;
  description: string;
  capacity: number;
  type: RoomType;
  amenities: string[];
  status: RoomStatus;
  location: string;
  floor: number;
  images: string[];
  imageUrl?: string; // Ajouter
  equipment?: string[]; // Ajouter
  departmentId?: string; // Ajouter
  color: string;
  createdAt: string;
  updatedAt: string;
};