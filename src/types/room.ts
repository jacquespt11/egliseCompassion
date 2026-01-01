export type RoomStatus = 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';

export type RoomType = 'meeting' | 'auditorium' | 'classroom' | 'office';

export type Room = {
  id: string;
  name: string;
  description: string;
  capacity: number;
  type: RoomType;
  amenities: string[]; // Équipements et commodités de base
  status: RoomStatus;
  location: string;
  floor: number;
  images: string[];
  color: string; // Couleur pour l'affichage dans l'interface
  createdAt: string;
  updatedAt: string;
  // Propriétés optionnelles
  imageUrl?: string;
  equipment?: string[]; // Équipements spécifiques (optionnel)
  departmentId?: string; // Si la salle est dédiée à un département
};

// Type pour la création d'une salle (sans les champs auto-générés)
export type CreateRoomDto = Omit<Room, 'id' | 'createdAt' | 'updatedAt'>;

// Type pour la mise à jour d'une salle
export type UpdateRoomDto = Partial<Omit<Room, 'id' | 'createdAt' | 'updatedAt'>>;