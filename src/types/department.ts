// Types pour les départements

export interface Department {
  id: string;
  name: string;
  description: string;
  managerId?: string;
  managerName?: string;
  memberCount: number;
  roomCount: number;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
  color?: string;
  icon?: string;
}

export interface DepartmentMember {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: 'MANAGER' | 'MEMBER' | 'VIEWER';
  joinedAt: Date;
  lastActive?: Date;
}

export interface DepartmentStats {
  totalMembers: number;
  activeMembers: number;
  totalReservations: number;
  upcomingReservations: number;
  favoriteRooms: string[];
  monthlyUsage: Array<{ month: string; hours: number }>;
}