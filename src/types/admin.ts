// src/types/admin.ts

// Types pour les pages admin
export type AdminPage = 
  | 'admin_dashboard' 
  | 'admin_approvals' 
  | 'admin_users' 
  | 'admin_departments' 
  | 'admin_audit' 
  | 'admin_settings';

// Types pour les statistiques système
export type SystemStats = {
  totalRooms: number;
  totalReservations: number;
  pendingApprovals: number;
  totalUsers: number;
  occupancyRate?: number; 
  avgResponseTime?: string; 
  activeReservations: number;
  activeUsers?: number;
  availableRooms: number;
  upcomingMaintenance: number;
  systemHealth: number;
  departmentsCount?: number;
  weeklyActivity?: Array<{ date: string; count: number }>;
};

export interface DashboardStats {
  totalUsers: number;
  totalRooms: number;
  totalReservations: number;
  pendingApprovals: number;
  activeToday: number;
  cancellationRate: number;
  averageUsage: number;
  peakHours: string[];
}

// Types pour les notifications admin
export type AdminNotification = {
  id: string;
  type: 'APPROVAL' | 'SYSTEM' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  read: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  createdAt: string;
  actionUrl?: string;
  relatedId?: string;
  timestamp: string;
  actionRequired: boolean;
  metadata?: {
    reservationId?: string;
    userId?: string;
    roomId?: string;
    department?: string;
  };

};

// Types pour les requêtes d'approbation
export type ApprovalRequest = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  department: string;
  type?: string; 
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  comments?: string;
  roomId?: string;
  roomName?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  purpose?: string;
};

// Types pour les journaux d'audit
export type AuditLogEntry = {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail: string;
  department: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT';
  entity: 'RESERVATION' | 'USER' | 'ROOM' |'DEPARTMENT'| 'PROFILE';
  entityId: string;
  details: string;
  ipAddress: string;
  userAgent: string;
};

// Types pour la gestion des départements
export interface Department {
  id: string;
  name: string;
  description: string;
  leader: string;
  leaderEmail: string;
  memberCount: number;
  active: boolean;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentStats {
  id: string;
  name: string;
  reservations: number;
  users: number;
  usage: number;
  status: 'high' | 'medium' | 'low';
}

// Types pour les paramètres admin
export interface AdminSettings {
  notifications: {
    emailOnNewReservation: boolean;
    emailOnApprovalNeeded: boolean;
    pushNotifications: boolean;
  };
  reservation: {
    maxDaysInAdvance: number;
    minNoticeHours: number;
    maxHoursPerBooking: number;
    allowWeekendBookings: boolean;
  };
  system: {
    maintenanceMode: boolean;
    requireAdminApproval: boolean;
    allowMultipleBookings: boolean;
    autoCancelUnapproved: number;
  };
  email: {
    smtpServer: string;
    smtpPort: string;
    senderEmail: string;
    senderName: string;
  };
}

// Types pour la gestion des utilisateurs
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  department: string;
  role: 'admin' | 'user' | 'department_leader';
  status: 'active' | 'pending' | 'inactive' | 'suspended';
  reservationsCount: number;
  lastLogin: string;
  createdAt: string;
  approved: boolean;
  profileCompleted: boolean;
  phone?: string;
}

// Types pour les rapports
export interface ReportData {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  totalReservations: number;
  approvedReservations: number;
  rejectedReservations: number;
  pendingReservations: number;
  uniqueUsers: number;
  mostUsedRoom: string;
  peakUsageTime: string;
  departmentBreakdown: Array<{
    department: string;
    reservations: number;
    percentage: number;
  }>;
}

// Types pour les filtres admin
export interface AdminFilters {
  dateRange: {
    start: string;
    end: string;
  };
  status?: string;
  department?: string;
  user?: string;
  room?: string;
}

// Types pour les exports de données
export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  data: 'reservations' | 'users' | 'audit_logs' | 'departments';
  dateRange: {
    start: string;
    end: string;
  };
  includeSensitive: boolean;
}

// Types pour les mises à jour système
export interface SystemUpdate {
  id: string;
  version: string;
  description: string;
  date: string;
  type: 'feature' | 'bugfix' | 'security' | 'maintenance';
  status: 'pending' | 'applied' | 'failed';
}

// Types pour les activités récentes du dashboard
export interface RecentActivity {
  id: string;
  type: 'reservation' | 'user' | 'system';
  action: string;
  user: string;
  timestamp: string;
  details?: string;
  status?: 'success' | 'warning' | 'error';
}

// Types pour les widgets du dashboard
export interface DashboardWidget {
  id: string;
  title: string;
  type: 'chart' | 'stat' | 'list' | 'calendar';
  size: 'small' | 'medium' | 'large';
  position: number;
  data: any;
  settings: {
    refreshInterval: number;
    showTitle: boolean;
    showFooter: boolean;
  };
}

// Types pour les backups système
export interface SystemBackup {
  id: string;
  filename: string;
  size: string;
  createdAt: string;
  type: 'full' | 'partial';
  status: 'completed' | 'failed' | 'in_progress';
  downloadUrl?: string;
}