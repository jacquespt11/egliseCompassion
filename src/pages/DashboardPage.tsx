import { motion } from 'framer-motion';
import { LayoutDashboard, Building2, Users, Calendar } from 'lucide-react';
import type { User } from '../types/user';

interface DashboardPageProps {
  user: User | null;
}

export function DashboardPage({ user }: DashboardPageProps) {
  const stats = [
    { label: 'Salles disponibles', value: '12', icon: Building2, color: 'from-blue-500 to-cyan-500' },
    { label: 'Départements actifs', value: '15', icon: Users, color: 'from-purple-500 to-pink-500' },
    { label: 'Réservations cette semaine', value: '47', icon: Calendar, color: 'from-emerald-500 to-green-500' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4"
        >
          Tableau de bord
        </motion.h1>
        <p className="text-white/60 text-lg">
          Bienvenue, <span className="font-semibold text-white">
            {user?.firstName} {user?.lastName}
          </span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${stat.color}/10 to-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-10 h-10 bg-gradient-to-br ${stat.color} text-transparent bg-clip-text`} />
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/60">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activités récentes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Activités récentes</h3>
          <div className="space-y-4">
            {[
              { action: 'Nouvelle réservation', user: 'Jean Dupont', time: 'Il y a 10 min', status: 'success' },
              { action: 'Validation requise', user: 'Marie Curie', time: 'Il y a 30 min', status: 'warning' },
              { action: 'Salle modifiée', user: 'Pierre Martin', time: 'Il y a 1 heure', status: 'info' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                <div className={`w-3 h-3 rounded-full ${
                  activity.status === 'success' ? 'bg-emerald-500' :
                  activity.status === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="font-medium text-white">{activity.action}</p>
                  <p className="text-sm text-white/60">{activity.user}</p>
                </div>
                <span className="text-sm text-white/40">{activity.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions rapides */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Actions rapides</h3>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/20 hover:border-blue-400/40 transition-all group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-white">Nouvelle réservation</p>
                  <p className="text-sm text-white/60">Réserver une salle</p>
                </div>
              </div>
              <div className="text-blue-400 group-hover:translate-x-2 transition-transform">
                →
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/20 hover:border-purple-400/40 transition-all group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Building2 className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-white">Explorer les salles</p>
                  <p className="text-sm text-white/60">Voir toutes les salles</p>
                </div>
              </div>
              <div className="text-purple-400 group-hover:translate-x-2 transition-transform">
                →
              </div>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Section informative */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-10 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-white/10"
      >
        <div className="flex items-center gap-4 mb-4">
          <LayoutDashboard className="w-8 h-8 text-blue-400" />
          <div>
            <h4 className="text-lg font-semibold text-white">Conseils d'utilisation</h4>
            <p className="text-white/60">Optimisez votre expérience avec ces astuces</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            'Réservez vos salles au moins 24h à l\'avance pour garantir la disponibilité',
            'Consultez le planning avant de réserver pour éviter les conflits',
            'Utilisez les filtres pour trouver rapidement la salle idéale'
          ].map((tip, index) => (
            <div key={index} className="p-4 bg-white/5 rounded-xl">
              <p className="text-white/80 text-sm">{tip}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}