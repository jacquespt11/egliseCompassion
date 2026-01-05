// src/types/component-props.ts
import { User } from './user';
import { PageId } from './routes';

export interface ReservationListProps {
  userId: string;
  departmentId: string;
  onViewDetails: (reservationId: string) => void;
  onCancelReservation: (reservationId: string) => void;
  onEditReservation: (reservationId: string) => void;
  userRole?: 'ADMIN' | 'RESPONSABLE' | 'USER';
}

export interface AdminDepartmentsPageProps {
  user: User | null;
  onNavigate?: (page: PageId) => void;
}

export interface AdminAuditPageProps {
  user: User | null;
  onNavigate?: (page: PageId) => void;
}

export interface AdminSettingsPageProps {
  user: User | null;
  onNavigate?: (page: PageId) => void;
}

export interface PlaningPageProps {
  user: User | null;
  onNavigate: (page: PageId) => void;
}

export interface RoomGalleryPageProps {
  user: User | null;
  onNavigate: (page: PageId) => void;
}