export type UserRole = 'RESPONSABLE' | 'ADMIN' | 'USER';

export type ApprovalStatus = 'APPROVED' | 'PENDING' | 'REJECTED';

export type User = {
  id: string;
  email: string;
  role: UserRole; 
  department?: string;
  profileCompleted?: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
  status?: 'active' | 'inactive' | 'pending';
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  departmentId?: string;
  approvalStatus?: ApprovalStatus;
  lastLogin?: string; 
};

export type Department = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};