import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Users, Building2, Calendar, 
  Shield, Clock, TrendingUp, AlertCircle, 
  ChevronRight, ArrowUpRight 
} from 'lucide-react';
import type { User } from '../types/user';
import type { SystemStats, RecentActivity } from '../types/admin';
import { ADMIN_ROUTES } from '../utils/adminRoutes';

interface AdminDashboardPageProps {
  user: User | null;
  onNavigate: (page: string) => void;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ user, onNavigate }) => {
  // Mock Data
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
    { id: '1', type: 'reservation', action: 'Nouvelle réservation créée', user: 'Jean Dupont', timestamp: '2024-03-20T10:30:00', status: 'success' },
    { id: '2', type: 'user', action: 'Nouveau responsable ajouté', user: 'Marie Martin', timestamp: '2024-03-19T14:20:00', status: 'success' },
    { id: '3', type: 'system', action: 'Maintenance planifiée', user: 'Système', timestamp: '2024-03-18T09:15:00', status: 'warning', details: 'Maintenance des serveurs ce week-end' },
    { id: '4', type: 'user', action: 'Compte désactivé', user: 'Pierre Durand', timestamp: '2024-03-17T16:45:00', status: 'error' }
  ];

  const quickActions = [
    { id: 'approvals', label: 'Approbations', icon: Shield, color: 'text-amber-500', bgColor: 'bg-amber-500/10', border: 'border-amber-500/20', route: 'admin_approvals' },
    { id: 'users', label: 'Utilisateurs', icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-500/10', border: 'border-blue-500/20', route: 'admin_users' },
    { id: 'departments', label: 'Départements', icon: Building2, color: 'text-purple-500', bgColor: 'bg-purple-500/10', border: 'border-purple-500/20', route: 'admin_departments' },
    { id: 'audit', label: 'Journal audit', icon: Activity, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', border: 'border-emerald-500/20', route: 'admin_audit' },
    { id: 'settings', label: 'Paramètres', icon: Activity, color: 'text-slate-400', bgColor: 'bg-slate-400/10', border: 'border-slate-400/20', route: 'admin_settings' },
    { id: 'calendar', label: 'Calendrier', icon: Calendar, color: 'text-rose-500', bgColor: 'bg-rose-500/10', border: 'border-rose-500/20', route: 'planing' }
  ];

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Système Live
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">Tableau de bord</h1>
            <p className="text-slate-400 font-medium">
              Bonjour, <span className="text-white">{user?.firstName || 'Perfect'}</span>. Voici l'état de votre infrastructure aujourd'hui.
            </p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl shadow-lg transition-all text-sm font-bold">
            <Clock size={18} />
            Mise à jour système
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Utilisateurs', val: systemStats.totalUsers, icon: Users, color: 'blue', trend: '+12% ce mois' },
            { label: 'En attente', val: systemStats.pendingApprovals, icon: Clock, color: 'amber', trend: 'Action urgente', warn: true },
            { label: 'Salles dispos', val: `${systemStats.availableRooms}/${systemStats.totalRooms}`, icon: Building2, color: 'emerald', trend: '80% Capacité' },
            { label: 'Santé système', val: `${systemStats.systemHealth}%`, icon: Activity, color: 'indigo', trend: 'Optimal' }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl shadow-xl transition-transform hover:scale-[1.02]">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-${stat.color}-500/10 border border-${stat.color}-500/20`}>
                  <stat.icon className={`text-${stat.color}-400`} size={22} />
                </div>
                <ArrowUpRight className="text-slate-600" size={18} />
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
              <h3 className={`text-3xl font-black mt-1 ${stat.warn ? 'text-amber-500' : 'text-white'}`}>{stat.val}</h3>
              <p className={`text-[10px] font-bold mt-2 uppercase tracking-widest ${stat.warn ? 'text-amber-500/80' : 'text-emerald-500/80'}`}>{stat.trend}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions - Darker with Glow on Hover */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6">Actions prioritaires</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map(action => (
              <motion.button
                key={action.id}
                whileHover={{ y: -4 }}
                onClick={() => onNavigate(action.route)}
                className={`flex flex-col items-center justify-center bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 shadow-lg transition-all hover:bg-slate-800/80 hover:border-slate-600 hover:shadow-blue-500/5 group`}
              >
                <div className={`${action.bgColor} ${action.color} p-4 rounded-2xl mb-4 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all`}>
                  <action.icon size={26} />
                </div>
                <p className="text-xs font-black text-slate-400 group-hover:text-white text-center uppercase tracking-tight">
                  {action.label}
                </p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Bottom Section: Activity & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Activity - High Contrast List */}
          <div className="bg-slate-900/30 border border-slate-800/60 rounded-[32px] p-8 shadow-2xl backdrop-blur-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-white">Flux d'activité</h3>
              <button className="text-[10px] font-black text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-[0.2em] border-b border-blue-400/20 pb-1">
                Voir tout l'historique
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map(activity => (
                <div key={activity.id} className="group flex items-center gap-5 p-5 bg-slate-950/40 border border-slate-800/40 rounded-2xl hover:bg-slate-800/40 hover:border-blue-500/30 transition-all cursor-pointer shadow-sm">
                  <div className={`p-3 rounded-xl shadow-inner ${
                    activity.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 
                    activity.status === 'warning' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {activity.type === 'reservation' ? <Calendar size={20} /> : <Users size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors">{activity.action}</h4>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[11px] font-semibold text-slate-500">Par {activity.user}</span>
                      <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                      <span className="text-[11px] font-bold text-slate-600 bg-slate-900 px-2 py-0.5 rounded shadow-sm">
                        {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-700 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>

          {/* Activity Chart - Modern Gradient Bars */}
          <div className="bg-slate-900/30 border border-slate-800/60 rounded-[32px] p-8 shadow-2xl backdrop-blur-sm flex flex-col">
            <h3 className="text-xl font-bold text-white mb-10 text-center lg:text-left">Performance hebdomadaire</h3>
            <div className="flex-1 h-48 flex items-end gap-3 px-4">
              {systemStats.weeklyActivity?.map((day, index) => {
                const maxCount = Math.max(...systemStats.weeklyActivity!.map(d => d.count));
                const height = (day.count / maxCount) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center group relative">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      className="w-full bg-gradient-to-t from-blue-600 via-blue-500 to-blue-300 rounded-t-xl shadow-[0_0_15px_rgba(37,99,235,0.1)] group-hover:brightness-125 transition-all"
                    />
                    <span className="text-[10px] font-black text-slate-500 mt-4 uppercase tracking-tighter">
                      {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-10 p-5 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] text-blue-400/60 font-black uppercase tracking-widest">Tendance Globale</p>
                <p className="text-xl font-black text-white">+18.4% <span className="text-sm font-medium text-slate-500 ml-1">vs week last</span></p>
              </div>
              <TrendingUp className="text-blue-500 w-10 h-10 opacity-30" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;