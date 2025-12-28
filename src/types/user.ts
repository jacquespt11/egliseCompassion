// src/types/user.ts

export type Page = 'transition' | 'login' | 'register' | 'admin_profile_edit' | 
                  'dashboard' | 'planing' | 'room_gallery' | 'reservation_form' | 
                  'my_reservations' | 'profile' | 'notifications' | 'settings';

export type UserRole = 'ADMIN' | 'RESPONSABLE';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isProfileComplete: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
  departmentId?: string;
  departmentName?: string;
  avatar?: string;
}

export type Department = {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  createdAt: Date;
};

// Ré-exporter aussi les types qui pourraient être utilisés ailleurs
export * from './room';
export * from './reservation';