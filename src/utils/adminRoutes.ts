import { Page } from '../types/user';

export const ADMIN_ROUTES: Record<string, { title: string; description: string; icon: string }> = {
  admin_dashboard: {
    title: 'Tableau de bord',
    description: 'Vue d\'ensemble du système',
    icon: '📊'
  },
  admin_approvals: {
    title: 'Approbations',
    description: 'Gérer les demandes en attente',
    icon: '🛡️'
  },
  admin_users: {
    title: 'Utilisateurs',
    description: 'Gérer les comptes utilisateurs',
    icon: '👥'
  },
  admin_departments: {
    title: 'Départements',
    description: 'Gérer les départements',
    icon: '🏢'
  },
  admin_audit: {
    title: 'Journal d\'audit',
    description: 'Historique des actions',
    icon: '📝'
  },
  admin_settings: {
    title: 'Paramètres',
    description: 'Configuration du système',
    icon: '⚙️'
  }
};

export const ADMIN_DEFAULT_ROUTE: Page = 'admin_dashboard';