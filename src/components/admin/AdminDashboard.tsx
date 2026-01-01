import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Home, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Bell,
  BarChart3,
  Download,
  ChevronRight,
  Eye,
  Shield,
  Activity,
  RefreshCw,
  Settings,
  FileText,
  PieChart,
  Database,
  Server
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import ApprovalQueue from './ApprovalQueue';
import AdminNotification from './AdminNotification';
import SystemStats from './SystemStats';
import AuditLog from './AuditLog';
import { StatusBadge } from '../shared/StatusBadge';
import { TimeDisplay } from '../shared/TimeDisplay';
import type { SystemStats as SystemStatsType, AdminNotification as AdminNotificationType } from '../../types/admin';
import type { Department } from '../../types/user';

interface DashboardStats {
  pendingApprovals: number;
  activeReservations: number;
  availableRooms: number;
  totalUsers: number;
  occupancyRate: number;
  avgResponseTime: string;
  systemHealth: number;
  totalDepartments: number;
}

interface RecentActivity {
  id: string;
  type: 'reservation' | 'user' | 'system' | 'approval';
  action: string;
  user: string;
  timestamp: string;
  details?: string;
  status?: 'success' | 'warning' | 'error';
}

interface AdminDashboardProps {
  stats: SystemStatsType | null;
  notifications: AdminNotificationType[];
  departments: Department[];
  pendingApprovals: number;
  loading?: boolean;
  onViewApprovals: () => void;
  onViewUsers: () => void;
  onViewRooms: () => void;
  onViewAuditLog: () => void;
  onExportData: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  notifications,
  departments,
  pendingApprovals,
  loading = false,
  onViewApprovals,
  onViewUsers,
  onViewRooms,
  onViewAuditLog,
  onExportData
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'notifications' | 'audit'>('overview');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month'>('week');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'reservation',
      action: 'Nouvelle réservation',
      user: 'Eric Matumona',
      timestamp: new Date().toISOString(),
      status: 'success'
    },
    {
      id: '2',
      type: 'user',
      action: 'Nouvel utilisateur',
      user: 'Didier Zola',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      details: 'Département: Enfance',
      status: 'success'
    },
    {
      id: '3',
      type: 'system',
      action: 'Maintenance planifiée',
      user: 'Système',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: 'warning'
    },
    {
      id: '4',
      type: 'reservation',
      action: 'Réservation annulée',
      user: 'Pierre Molenda',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      status: 'error'
    },
    {
      id: '5',
      type: 'approval',
      action: 'Demande approuvée',
      user: 'Admin System',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      status: 'success'
    }
  ]);

  const [quickStats, setQuickStats] = useState<DashboardStats>({
    pendingApprovals: 0,
    activeReservations: 0,
    availableRooms: 0,
    totalUsers: 0,
    occupancyRate: 0,
    avgResponseTime: '0h',
    systemHealth: 100,
    totalDepartments: 0
  });

  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Mettre à jour les stats rapides lorsque les props changent
  useEffect(() => {
    if (stats) {
      setQuickStats({
        pendingApprovals: stats.pendingApprovals || 0,
        activeReservations: stats.activeReservations || 0,
        availableRooms: stats.availableRooms || 0,
        totalUsers: stats.totalUsers || 0,
        occupancyRate: stats.occupancyRate || 0,
        avgResponseTime: stats.avgResponseTime || '0h',
        systemHealth: stats.systemHealth || 100,
        totalDepartments: departments.length || 0
      });
    }
  }, [stats, departments]);

  useEffect(() => {
    // Générer les jours du mois courant pour le calendrier
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    const days = eachDayOfInterval({ start, end });
    setCalendarDays(days);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simuler un rafraîchissement
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getDayClass = (day: Date) => {
    const baseClass = 'w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200';
    
    if (isSameDay(day, selectedDate)) {
      return `${baseClass} bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25`;
    }
    
    if (day.getDay() === 0 || day.getDay() === 6) {
      return `${baseClass} text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800`;
    }
    
    return `${baseClass} text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800`;
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'reservation': return <Calendar className={`${iconClass} text-blue-500`} />;
      case 'user': return <Users className={`${iconClass} text-emerald-500`} />;
      case 'system': return <AlertCircle className={`${iconClass} text-amber-500`} />;
      case 'approval': return <CheckCircle className={`${iconClass} text-purple-500`} />;
      default: return <Bell className={`${iconClass} text-gray-500`} />;
    }
  };

  const getStatusColor = (status?: RecentActivity['status']) => {
    switch (status) {
      case 'success': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'warning': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'error': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const isCurrentDay = (day: Date) => {
    const today = new Date();
    return isSameDay(day, today);
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête avec animations */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Tableau de Bord Administrateur
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })} • Bon retour, Administrateur
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex bg-gray-200/50 dark:bg-gray-800/50 rounded-lg p-1 backdrop-blur-sm">
                {(['today', 'week', 'month'] as const).map((range) => (
                  <motion.button
                    key={range}
                    onClick={() => setDateRange(range)}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      dateRange === range
                        ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                    }`}
                  >
                    {range === 'today' ? 'Aujourd\'hui' : range === 'week' ? 'Semaine' : 'Mois'}
                  </motion.button>
                ))}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onExportData}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/25"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Exporter</span>
              </motion.button>
            </div>
          </div>

          {/* Onglets avec animations */}
          <div className="flex border-b border-gray-200 dark:border-gray-800 -mb-px overflow-x-auto">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: <BarChart3 size={18} />, badge: null },
              { id: 'approvals', label: 'Approbations', icon: <Shield size={18} />, badge: pendingApprovals },
              { id: 'notifications', label: 'Notifications', icon: <Bell size={18} />, badge: unreadNotifications },
              { id: 'audit', label: 'Journal d\'audit', icon: <FileText size={18} />, badge: null },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-all duration-200 flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.badge !== null && tab.badge > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                    {tab.badge}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Contenu principal avec animations */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {activeTab === 'overview' && (
              <>
                {/* Statistiques rapides */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      title: 'En attente',
                      value: quickStats.pendingApprovals,
                      icon: <Shield className="text-amber-500" size={24} />,
                      color: 'from-amber-500/10 to-amber-600/10',
                      borderColor: 'border-amber-500/20',
                      change: '+2',
                      description: 'Approbations',
                      onClick: onViewApprovals
                    },
                    {
                      title: 'Réservations actives',
                      value: quickStats.activeReservations,
                      icon: <Calendar className="text-blue-500" size={24} />,
                      color: 'from-blue-500/10 to-blue-600/10',
                      borderColor: 'border-blue-500/20',
                      change: '+15%',
                      description: 'Aujourd\'hui',
                      onClick: onViewRooms
                    },
                    {
                      title: 'Salles disponibles',
                      value: quickStats.availableRooms,
                      icon: <Home className="text-emerald-500" size={24} />,
                      color: 'from-emerald-500/10 to-emerald-600/10',
                      borderColor: 'border-emerald-500/20',
                      change: '+1',
                      description: 'Sur 12 total',
                      onClick: onViewRooms
                    },
                    {
                      title: 'Santé système',
                      value: `${quickStats.systemHealth}%`,
                      icon: <Activity className="text-purple-500" size={24} />,
                      color: 'from-purple-500/10 to-purple-600/10',
                      borderColor: 'border-purple-500/20',
                      change: quickStats.systemHealth > 90 ? 'Optimal' : 'Attention',
                      description: 'Performance',
                      onClick: () => {}
                    }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5, scale: 1.02 }}
                      onClick={stat.onClick}
                      className={`bg-gradient-to-br ${stat.color} backdrop-blur-sm border ${stat.borderColor} rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-white/20 dark:bg-black/20">
                          {stat.icon}
                        </div>
                        <span className={`text-sm font-medium ${
                          stat.change.startsWith('+') ? 'text-emerald-500' : 
                          stat.change === 'Optimal' ? 'text-emerald-500' : 'text-amber-500'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-gray-800 dark:text-white mb-1">{stat.value}</p>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{stat.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Grille principale */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Activités récentes */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* SystemStats sans props */}
                    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
                      <SystemStats />
                    </div>
                    
                    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Activités Récentes</h2>
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1">
                          Voir tout <ChevronRight size={16} />
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3 p-4 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-200 group"
                          >
                            <div className="pt-1">
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <p className="font-medium text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {activity.action}
                                </p>
                                <TimeDisplay 
                                  date={activity.timestamp} 
                                  className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap"
                                  showIcon={false}
                                />
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Par {activity.user}</span>
                                {activity.status && (
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
                                    {activity.status === 'success' ? 'Réussi' :
                                     activity.status === 'warning' ? 'Avertissement' : 'Erreur'}
                                  </span>
                                )}
                              </div>
                              {activity.details && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.details}</p>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Stats secondaires */}
                    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <PieChart size={18} />
                        Métriques Avancées
                      </h3>
                      <div className="space-y-4">
                        {[
                          { label: 'Taux d\'occupation', value: `${quickStats.occupancyRate}%`, icon: TrendingUp, color: 'text-blue-500' },
                          { label: 'Utilisateurs totaux', value: quickStats.totalUsers, icon: Users, color: 'text-emerald-500' },
                          { label: 'Départements', value: quickStats.totalDepartments, icon: Database, color: 'text-purple-500' },
                          { label: 'Temps réponse moyen', value: quickStats.avgResponseTime, icon: Clock, color: 'text-amber-500' },
                        ].map((metric, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 hover:bg-white/30 dark:hover:bg-gray-700/30 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${metric.color} bg-opacity-10`}>
                                <metric.icon size={16} className={metric.color} />
                              </div>
                              <span className="text-gray-600 dark:text-gray-300">{metric.label}</span>
                            </div>
                            <span className="font-semibold text-gray-800 dark:text-white">{metric.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions rapides */}
                    <div className="bg-gradient-to-br from-blue-600/90 to-blue-700/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-blue-500/25 p-6">
                      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <Settings size={18} />
                        Actions Rapides
                      </h3>
                      <div className="space-y-3">
                        {[
                          { label: 'Gérer les utilisateurs', icon: Users, onClick: onViewUsers },
                          { label: 'Approbations en attente', icon: Shield, onClick: onViewApprovals },
                          { label: 'Journal d\'audit', icon: FileText, onClick: onViewAuditLog },
                          { label: 'Paramètres système', icon: Settings, onClick: () => {} },
                        ].map((action, idx) => (
                          <motion.button
                            key={idx}
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={action.onClick}
                            className="w-full flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 group"
                          >
                            <div className="flex items-center gap-3">
                              <action.icon size={18} className="text-white/80" />
                              <span className="text-white">{action.label}</span>
                            </div>
                            <ChevronRight size={18} className="text-white/40 group-hover:text-white transition-colors" />
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* État système */}
                    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Server size={18} />
                        État du Système
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Base de données</span>
                          <StatusBadge status="success" label="Connectée" size="sm" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Serveur API</span>
                          <StatusBadge status="success" label="Actif" size="sm" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Stockage</span>
                          <StatusBadge status="warning" label="78%" size="sm" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Dernière sauvegarde</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {format(new Date(), 'dd/MM HH:mm')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'approvals' && (
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
                <ApprovalQueue 
                  items={[]}
                  onApprove={async () => {}}
                  onReject={async () => {}}
                />
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
                <AdminNotification />
              </div>
            )}
            
            {activeTab === 'audit' && (
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
                <AuditLog />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;