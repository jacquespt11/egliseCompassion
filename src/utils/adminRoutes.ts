// src/utils/adminRoutes.ts
import type { PageId, PageMetadata } from '../types/routes';

export const ADMIN_ROUTES: Record<string, PageMetadata> = {
  admin_dashboard: {
    id: 'admin_dashboard',
    title: 'Tableau de bord',
    description: 'Vue d\'ensemble du système',
    icon: '📊',
    requiresAuth: true,
    allowedRoles: ['ADMIN']
  },
  admin_approvals: {
    id: 'admin_approvals',
    title: 'Approbations',
    description: 'Gérer les demandes en attente',
    icon: '🛡️',
    requiresAuth: true,
    allowedRoles: ['ADMIN']
  },
  admin_users: {
    id: 'admin_users',
    title: 'Utilisateurs',
    description: 'Gérer les comptes utilisateurs',
    icon: '👥',
    requiresAuth: true,
    allowedRoles: ['ADMIN']
  },
  admin_departments: {
    id: 'admin_departments',
    title: 'Départements',
    description: 'Gérer les départements',
    icon: '🏢',
    requiresAuth: true,
    allowedRoles: ['ADMIN']
  },
  admin_audit: {
    id: 'admin_audit',
    title: 'Journal d\'audit',
    description: 'Historique des actions',
    icon: '📝',
    requiresAuth: true,
    allowedRoles: ['ADMIN']
  },
  admin_settings: {
    id: 'admin_settings',
    title: 'Paramètres',
    description: 'Configuration du système',
    icon: '⚙️',
    requiresAuth: true,
    allowedRoles: ['ADMIN']
  }
};

export const ADMIN_DEFAULT_ROUTE: PageId = 'admin_dashboard';

// Fonction utilitaire pour obtenir les routes admin
export const getAdminRoutes = () => Object.values(ADMIN_ROUTES);

// Fonction pour vérifier si une route est accessible par l'utilisateur
export const canAccessRoute = (routeId: PageId, userRole?: string): boolean => {
  const route = ADMIN_ROUTES[routeId];
  if (!route) return false;
  
  if (!route.allowedRoles || route.allowedRoles.length === 0) {
    return true;
  }
  
  return !userRole || route.allowedRoles.includes(userRole as any);
};