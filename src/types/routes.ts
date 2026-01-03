// src/types/routes.ts

// Type pour les identifiants de page
export type PageId = 
  | 'transition' 
  | 'login' 
  | 'register' 
  | 'admin_profile_edit'
  | 'dashboard' 
  | 'planing' 
  | 'room_gallery' 
  | 'reservation_form'
  | 'my_reservations' 
  | 'profile' 
  | 'notifications' 
  | 'settings'
  | 'admin_dashboard' 
  | 'admin_approvals' 
  | 'admin_users'
  | 'admin_departments' 
  | 'admin_audit' 
  | 'admin_settings';

// Interface pour les métadonnées de page
export interface PageMetadata {
  id: PageId;
  title: string;
  description: string;
  icon: string;
  requiresAuth: boolean;
  allowedRoles?: ('ADMIN' | 'RESPONSABLE' | 'USER')[];
}

// Interface pour les props de navigation
export interface NavigationProps {
  currentPage?: PageId;
  onNavigate: (pageId: PageId) => void;
}