export interface Room {
  id: string;
  name: string;
  description: string;
  capacity: number;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  equipment: string[];
  images?: string[];
  departmentId?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Propriétés étendues pour l'affichage (optionnelles)
  imageUrl?: string;
  location?: string;
}