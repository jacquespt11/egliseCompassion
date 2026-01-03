// src/pages/DashboardPage.tsx
import { motion } from 'framer-motion';
import { LayoutDashboard, Building2, Users, Calendar, Plus, ArrowRight } from 'lucide-react';
import type { User } from '../types/user';

interface DashboardPageProps {
  user: User | null;
}

export function DashboardPage({ user }: DashboardPageProps) {
  const stats = [
    { label: 'Salles disponibles', value: '12', icon: Building2, color: 'from-blue-500 to-cyan-500', change: '+2' },
    { label: 'Départements actifs', value: '15', icon: Users, color: 'from-purple-500 to-pink-500', change: '+1' },
    { label: 'Réservations cette semaine', value: '47', icon: Calendar, color: 'from-emerald-500 to-green-500', change: '+8' },
  ];

  const recentActivities = [
    { action: 'Nouvelle réservation', user: 'Jean Dupont', time: 'Il y a 10 min', status: 'success', icon: '📅' },
    { action: 'Validation requise', user: 'Marie Curie', time: 'Il y a 30 min', status: 'warning', icon: '⏰' },
    { action: 'Salle modifiée', user: 'Pierre Martin', time: 'Il y a 1 heure', status: 'info', icon: '🏢' },
    { action: 'Utilisateur approuvé', user: 'Sophie Laurent', time: 'Il y a 2 heures', status: 'success', icon: '👤' },
  ];

  const quickActions = [
    { title: 'Nouvelle réservation', description: 'Réserver une salle', icon: Plus, color: 'blue', gradient: 'from-blue-500 to-blue-600' },
    { title: 'Explorer les salles', description: 'Voir toutes les salles', icon: Building2, color: 'purple', gradient: 'from-purple-500 to-purple-600' },
    { title: 'Voir le planning', description: 'Consulter le planning global', icon: Calendar, color: 'emerald', gradient: 'from-emerald-500 to-emerald-600' },
  ];

  const tips = [
    'Réservez vos salles au moins 24h à l\'avance pour garantir la disponibilité',
    'Consultez le planning avant de réserver pour éviter les conflits',
    'Utilisez les filtres pour trouver rapidement la salle idéale',
    'Les réservations sont approuvées dans les 24h ouvrables',
  ];

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Tableau de bord
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Bienvenue, <span className="font-semibold text-blue-600 dark:text-blue-400">
                {user?.firstName} {user?.lastName}
              </span>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-100 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-300">Aujourd'hui</p>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-400">12 Mars 2024</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${stat.color}/10 to-white/5 dark:to-gray-800/30 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`w-6 h-6 ${stat.color.replace('from-', 'text-').replace(' to-', '')}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Activités récentes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Activités récentes</h3>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                Voir tout
              </button>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{activity.action}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activity.user}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{activity.time}</span>
                    <span className={`text-xs px-2 py-1 rounded-full mt-1 ${
                      activity.status === 'success' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      activity.status === 'warning' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {activity.status === 'success' ? 'Terminé' : 
                       activity.status === 'warning' ? 'En attente' : 'Information'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Actions rapides */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Actions rapides</h3>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <button 
                  key={index}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${action.gradient} bg-opacity-10`}>
                      <action.icon className={`w-5 h-5 text-${action.color}-600 dark:text-${action.color}-400`} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 dark:text-white">{action.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                    </div>
                  </div>
                  <div className={`text-${action.color}-400 group-hover:translate-x-2 transition-transform`}>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </button>
              ))}
            </div>

            {/* Statistiques supplémentaires */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Statistiques du mois</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-300">Réservations totales</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">142</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-800 dark:text-emerald-300">Taux d'occupation</p>
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">78%</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Section informative */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-800/30">
              <LayoutDashboard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Conseils d'utilisation</h4>
              <p className="text-gray-600 dark:text-gray-400">Optimisez votre expérience avec ces astuces</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tips.map((tip, index) => (
              <div key={index} className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-800/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{index + 1}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{tip}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}