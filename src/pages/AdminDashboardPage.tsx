import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, Building2, Calendar, Shield, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import type { User } from '../types/user';
import type { SystemStats, RecentActivity } from '../types/admin';
import { ADMIN_ROUTES } from '../utils/adminRoutes';

interface AdminDashboardPageProps {
  user: User | null;
  onNavigate: (page: string) => void;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ user, onNavigate }) => {
  const systemStats: SystemStats = {
    totalRooms: 12,
    totalReservations: 245,
    pendingApprovals: 8,
    totalUsers: 56,
    activeReservations: 34,
    availableRooms: 8,
    upcomingMaintenance: 2,
    systemHealth: 95,
    departmentsCount: 6,
    weeklyActivity: [
      { date: '2024-03-18', count: 15 },
      { date: '2024-03-19', count: 22 },
      { date: '2024-03-20', count: 18 },
      { date: '2024-03-21', count: 25 },
      { date: '2024-03-22', count: 20 },
      { date: '2024-03-23', count: 12 },
      { date: '2024-03-24', count: 8 }
    ]
  };

  const recentActivity: RecentActivity[] = [
    {
      id: '1',
      type: 'reservation',
      action: 'Nouvelle réservation créée',
      user: 'Jean Dupont',
      timestamp: '2024-03-20T10:30:00',
      status: 'success'
    },
    {
      id: '2',
      type: 'user',
      action: 'Nouveau responsable ajouté',
      user: 'Marie Martin',
      timestamp: '2024-03-19T14:20:00',
      status: 'success'
    },
    {
      id: '3',
      type: 'system',
      action: 'Maintenance planifiée',
      user: 'Système',
      timestamp: '2024-03-18T09:15:00',
      status: 'warning',
      details: 'Maintenance des serveurs ce week-end'
    },
    {
      id: '4',
      type: 'user',
      action: 'Compte désactivé',
      user: 'Pierre Durand',
      timestamp: '2024-03-17T16:45:00',
      status: 'error'
    }
  ];

  const quickActions = [
    { id: 'approvals', label: 'Voir approbations', icon: Shield, color: 'bg-amber-500', route: 'admin_approvals' },
    { id: 'users', label: 'Gérer utilisateurs', icon: Users, color: 'bg-blue-500', route: 'admin_users' },
    { id: 'departments', label: 'Départements', icon: Building2, color: 'bg-purple-500', route: 'admin_departments' },
    { id: 'audit', label: 'Journal audit', icon: Activity, color: 'bg-green-500', route: 'admin_audit' },
    { id: 'settings', label: 'Paramètres', icon: Activity, color: 'bg-gray-500', route: 'admin_settings' },
    { id: 'calendar', label: 'Calendrier', icon: Calendar, color: 'bg-red-500', route: 'planing' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="text-blue-600 dark:text-blue-400" size={28} />
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                {ADMIN_ROUTES.admin_dashboard.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {ADMIN_ROUTES.admin_dashboard.description}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Bonjour, {user?.firstName} {user?.lastName} • Dernière connexion: Aujourd'hui à 10:30
          </p>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{systemStats.totalUsers}</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 dark:text-green-400">+12% ce mois</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">En attente</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{systemStats.pendingApprovals}</p>
              </div>
              <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-yellow-600 dark:text-yellow-400">Action requise</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Salles disponibles</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {systemStats.availableRooms}/{systemStats.totalRooms}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Building2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Math.round((systemStats.availableRooms / systemStats.totalRooms) * 100)}% disponible
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Santé système</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{systemStats.systemHealth}%</p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600 dark:text-green-400">Tous systèmes opérationnels</span>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Actions rapides</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map(action => (
              <motion.button
                key={action.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate(action.route)}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3 mx-auto`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-800 dark:text-white text-center">
                  {action.label}
                </p>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activité récente */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Activité récente</h3>
              <button 
                onClick={() => onNavigate('admin_audit')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Voir tout
              </button>
            </div>
            <div className="space-y-3">
              {recentActivity.map(activity => (
                <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                    activity.status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                    'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {activity.type === 'reservation' ? (
                      <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    ) : activity.type === 'user' ? (
                      <Users className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{activity.action}</p>
                    {activity.details && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.details}</p>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">par {activity.user}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(activity.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Graphique d'activité hebdomadaire */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Activité hebdomadaire</h3>
            <div className="h-64 flex items-end gap-2">
              {systemStats.weeklyActivity?.map((day, index) => {
                const maxCount = Math.max(...systemStats.weeklyActivity!.map(d => d.count));
                const height = (day.count / maxCount) * 100;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all hover:opacity-90"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                    </span>
                    <span className="text-sm font-medium text-gray-800 dark:text-white mt-1">
                      {day.count}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Réservations cette semaine</p>
                  <p className="text-xl font-bold text-gray-800 dark:text-white">
                    {systemStats.weeklyActivity?.reduce((sum, day) => sum + day.count, 0)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +18% vs semaine dernière
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;