// src/pages/AdminDashboardPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Users, 
  Building2, 
  Calendar, 
  Shield, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  BarChart3,
  Settings,
  FileText,
  ArrowRight,
  Zap,
  Database,
  Cpu
} from 'lucide-react';
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
    },
    {
      id: '5',
      type: 'system',
      action: 'Sauvegarde automatique',
      user: 'Système',
      timestamp: '2024-03-17T02:00:00',
      status: 'success',
      details: 'Sauvegarde complétée avec succès'
    },
    {
      id: '6',
      type: 'reservation',
      action: 'Réservation approuvée',
      user: 'Sarah Bernard',
      timestamp: '2024-03-16T11:20:00',
      status: 'success'
    }
  ];

  const quickActions = [
    { id: 'approvals', label: 'Approbations en attente', icon: Shield, color: 'from-amber-500 to-orange-500', route: 'admin_approvals', count: systemStats.pendingApprovals },
    { id: 'users', label: 'Gérer utilisateurs', icon: Users, color: 'from-blue-500 to-cyan-500', route: 'admin_users', count: systemStats.totalUsers },
    { id: 'departments', label: 'Départements', icon: Building2, color: 'from-purple-500 to-pink-500', route: 'admin_departments', count: systemStats.departmentsCount },
    { id: 'audit', label: 'Journal audit', icon: FileText, color: 'from-emerald-500 to-teal-500', route: 'admin_audit', count: 128 },
    { id: 'settings', label: 'Paramètres', icon: Settings, color: 'from-gray-500 to-slate-500', route: 'admin_settings' },
    { id: 'calendar', label: 'Calendrier', icon: Calendar, color: 'from-red-500 to-rose-500', route: 'planing' }
  ];

  const systemMetrics = [
    { label: 'Performance', value: '98%', icon: Zap, color: 'from-green-500 to-emerald-500', change: '+2%' },
    { label: 'Uptime', value: '99.9%', icon: Activity, color: 'from-blue-500 to-indigo-500', change: '±0%' },
    { label: 'Base de données', value: '3.2GB', icon: Database, color: 'from-purple-500 to-violet-500', change: '+0.5GB' },
    { label: 'CPU', value: '24%', icon: Cpu, color: 'from-amber-500 to-orange-500', change: '-5%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900/10">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        {/* Header avec gradient */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-2xl shadow-blue-500/20 dark:shadow-blue-900/30"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold(800) text-white mb-3">
                {ADMIN_ROUTES.admin_dashboard.title}
              </h1>
              <p className="text-blue-100 text-lg">
                {ADMIN_ROUTES.admin_dashboard.description}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl border border-white/30">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">Bienvenue {user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-blue-200 mt-1">Dernière connexion: Aujourd'hui à 10:30</p>
              </div>
            </div>
          </div>

          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="p-5 bg-white/20 rounded-2xl border border-white/30">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-white/90">Utilisateurs</p>
                    <p className="font-semibold text-white text-2xl">{systemStats.totalUsers}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4 text-green-300" />
                    <span className="text-xs text-green-300">+12% ce mois</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white/20 rounded-2xl border border-white/30">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                    <div className="flex items-center gap-1">
                        <p className="text-sm text-white/90">En attente</p>
                        <p className="font-semibold text-white text-2xl">{systemStats.pendingApprovals}</p>
                    </div>
                  <div className="flex items-center gap-1 mt-1">
                    <AlertCircle className="w-4 h-4 text-amber-300" />
                    <span className="text-xs text-amber-300">Action requise</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white/20 rounded-2xl border border-white/30">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                    <div className="flex items-center gap-1">
                        <p className="text-sm text-white/90">Salles disponibles</p>
                        <p className="font-semibold text-white text-2xl">{systemStats.availableRooms}/{systemStats.totalRooms}</p>
                    </div>
                  <div className="text-xs text-emerald-300 mt-1">
                    {Math.round((systemStats.availableRooms / systemStats.totalRooms) * 100)}% disponible
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white/20 rounded-2xl border border-white/30">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                    <div className="flex items-center gap-1">                  
                        <p className="text-sm text-white/90">Santé système</p>
                        <p className="font-semibold text-white text-2xl">{systemStats.systemHealth}%</p>
                    </div>
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-300" />
                    <span className="text-xs text-green-300">Tous systèmes opérationnels</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions rapides */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Actions rapides</h2>
              <p className="text-gray-600 dark:text-gray-400">Accédez rapidement aux fonctions principales</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-500" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {quickActions.map(action => (
              <motion.button
                key={action.id}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate(action.route)}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-4`}>
                  <action.icon className="w-7 h-7 text-white"  />
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {action.label}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  
                  {action.count !== undefined && (
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {action.count}
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Cliquez pour accéder
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Métriques système et contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Métriques système */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-xl mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <Activity className="w-6 h-6 text-blue-500" />
                Métriques système
              </h3>
              
              <div className="space-y-4">
                {systemMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${metric.color} flex items-center justify-center`}>
                          <metric.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{metric.label}</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        metric.change.startsWith('+') 
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                          : metric.change.startsWith('-')
                          ? 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-300'
                          : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300'
                      }`}>
                        {metric.change}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${metric.color}`}
                        style={{ 
                          width: metric.label === 'CPU' ? '24%' : 
                                 metric.label === 'Performance' ? '98%' : 
                                 metric.label === 'Uptime' ? '99.9%' : '80%'
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Colonne principale */}
          <div className="lg:col-span-2">
            {/* Activité récente */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-xl mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Activité récente</h3>
                  <p className="text-gray-600 dark:text-gray-400">Les dernières actions sur le système</p>
                </div>
                <button 
                  onClick={() => onNavigate('admin_audit')}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-xl font-medium hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-all border-2 border-blue-200 dark:border-blue-800 flex items-center gap-2"
                >
                  Voir tout
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-xl border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer hover:shadow-md group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${
                        activity.status === 'success' ? 'bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-900/20' :
                        activity.status === 'warning' ? 'bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-900/20' :
                        'bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900/30 dark:to-rose-900/20'
                      }`}>
                        {activity.type === 'reservation' ? (
                          <Calendar className={`w-5 h-5 ${
                            activity.status === 'success' ? 'text-emerald-600 dark:text-emerald-400' :
                            activity.status === 'warning' ? 'text-amber-600 dark:text-amber-400' :
                            'text-rose-600 dark:text-rose-400'
                          }`} />
                        ) : activity.type === 'user' ? (
                          <Users className={`w-5 h-5 ${
                            activity.status === 'success' ? 'text-emerald-600 dark:text-emerald-400' :
                            activity.status === 'warning' ? 'text-amber-600 dark:text-amber-400' :
                            'text-rose-600 dark:text-rose-400'
                          }`} />
                        ) : (
                          <AlertCircle className={`w-5 h-5 ${
                            activity.status === 'success' ? 'text-emerald-600 dark:text-emerald-400' :
                            activity.status === 'warning' ? 'text-amber-600 dark:text-amber-400' :
                            'text-rose-600 dark:text-rose-400'
                          }`} />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {activity.action}
                            </h4>
                            {activity.details && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{activity.details}</p>
                            )}
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                            activity.status === 'success' ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300' :
                            activity.status === 'warning' ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300' :
                            'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-300'
                          }`}>
                            {activity.status === 'success' ? 'Réussi' :
                             activity.status === 'warning' ? 'Attention' : 'Erreur'}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Users className="w-4 h-4" />
                            <span>par {activity.user}</span>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(activity.timestamp).toLocaleDateString('fr-FR', { 
                              day: 'numeric', 
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Graphique d'activité hebdomadaire */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Activité hebdomadaire</h3>
                  <p className="text-gray-600 dark:text-gray-400">Réservations par jour de la semaine</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-bold">+18% vs semaine dernière</span>
                </div>
              </div>
              
              <div className="h-64 flex items-end gap-2 mb-6">
                {systemStats.weeklyActivity?.map((day, index) => {
                  const maxCount = Math.max(...systemStats.weeklyActivity!.map(d => d.count));
                  const height = (day.count / maxCount) * 100;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="w-full bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-xl transition-all hover:opacity-90 cursor-pointer"
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                        {day.count}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-800 dark:text-blue-300">Réservations cette semaine</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                      {systemStats.weeklyActivity?.reduce((sum, day) => sum + day.count, 0)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                      Moyenne quotidienne: {Math.round(systemStats.weeklyActivity?.reduce((sum, day) => sum + day.count, 0) / 7)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-gray-300 dark:border-gray-700"
        >
          <div className="text-center">
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              Pour toute assistance technique, contactez le support à{' '}
              <a href="mailto:support@compassion.org" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                support@compassion.org
              </a>
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Version 2.1.0 • Dernière mise à jour: 03 Janvier 2025
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;