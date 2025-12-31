export type UserRole = 'RESPONSABLE' | 'ADMIN' | 'USER';

export type User = {
  id: string;
  email: string;
  role: UserRole; 
  department?: string;
  profileCompleted?: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  departmentId?: string; 
};

export type Department = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};